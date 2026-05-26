const crypto = require("crypto");
const dns = require("dns").promises;
const fs = require("fs");
const net = require("net");
const path = require("path");
const { resolveInside } = require("./workspace-paths");

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".heic", ".heif", ".tiff", ".bmp"]);
const VIDEO_EXTENSIONS = new Set([".mp4", ".mov", ".m4v", ".webm", ".mkv", ".avi"]);
const TEXT_EXTENSIONS = new Set([".txt", ".md", ".json", ".csv", ".tsv", ".html"]);
const DOCUMENT_EXTENSIONS = new Set([".pdf", ".docx", ".pptx", ".xlsx"]);
const APPROVED_ASSET_EXTENSIONS = new Set([
  ...IMAGE_EXTENSIONS,
  ...VIDEO_EXTENSIONS,
  ...TEXT_EXTENSIONS,
  ...DOCUMENT_EXTENSIONS
]);

const MAX_BYTES_BY_KIND = {
  image: 50 * 1024 * 1024,
  video: 750 * 1024 * 1024,
  text: 10 * 1024 * 1024,
  document: 100 * 1024 * 1024,
  file: 25 * 1024 * 1024
};

const SENSITIVE_SEGMENTS = new Set([
  ".ssh",
  ".gnupg",
  ".aws",
  ".azure",
  ".docker",
  ".kube",
  ".password-store",
  ".npm",
  ".config/gcloud"
]);

const SENSITIVE_BASENAMES = new Set([
  ".env",
  ".env.local",
  ".env.production",
  ".env.development",
  ".npmrc",
  ".yarnrc",
  ".pnpmrc",
  ".netrc",
  ".pypirc",
  "id_rsa",
  "id_dsa",
  "id_ecdsa",
  "id_ed25519",
  "known_hosts",
  "authorized_keys",
  "credentials",
  "credentials.json",
  "token",
  "token.json"
]);

const SENSITIVE_EXTENSIONS = new Set([".pem", ".key", ".p12", ".pfx", ".crt", ".cer", ".kdbx"]);
const MAX_LINK_BYTES = 750 * 1024;
const MAX_REDIRECTS = 3;

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function safeId(value) {
  return String(value || "asset")
    .normalize("NFKD")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "asset";
}

function classifyAssetPath(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (IMAGE_EXTENSIONS.has(ext)) {
    return "image";
  }
  if (VIDEO_EXTENSIONS.has(ext)) {
    return "video";
  }
  if (TEXT_EXTENSIONS.has(ext)) {
    return "text";
  }
  if (DOCUMENT_EXTENSIONS.has(ext)) {
    return "document";
  }
  return "file";
}

function sha256File(filePath) {
  return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
}

function isSensitivePath(filePath) {
  const absolute = path.resolve(filePath);
  const lower = absolute.toLowerCase();
  const parts = lower.split(path.sep).filter(Boolean);
  const basename = path.basename(lower);
  if (SENSITIVE_BASENAMES.has(basename) || SENSITIVE_EXTENSIONS.has(path.extname(lower))) {
    return true;
  }
  if (/(^|[._-])(secret|private-key|apikey|api-key|access-token|refresh-token|password)([._-]|$)/i.test(basename)) {
    return true;
  }
  for (let index = 0; index < parts.length; index += 1) {
    const segment = parts[index];
    if (SENSITIVE_SEGMENTS.has(segment)) {
      return true;
    }
    const pair = `${segment}/${parts[index + 1] || ""}`;
    if (SENSITIVE_SEGMENTS.has(pair)) {
      return true;
    }
  }
  return false;
}

function assertSafeLocalAssetFile(sourcePath, options = {}) {
  if (!sourcePath || typeof sourcePath !== "string") {
    throw new Error("A local asset path is required.");
  }
  if (/[\u0000-\u001f\u007f]/.test(sourcePath)) {
    throw new Error("Unsafe asset path contains control characters.");
  }

  const absolutePath = path.resolve(process.cwd(), sourcePath);
  if (isSensitivePath(absolutePath)) {
    throw new Error(`Refusing sensitive local path: ${sourcePath}`);
  }
  if (!fs.existsSync(absolutePath)) {
    throw new Error(`File not found: ${sourcePath}`);
  }

  const lstat = fs.lstatSync(absolutePath);
  if (lstat.isSymbolicLink()) {
    throw new Error(`Refusing symlink asset: ${sourcePath}`);
  }
  const stat = fs.statSync(absolutePath);
  if (!stat.isFile()) {
    throw new Error(`Asset must be a normal file: ${sourcePath}`);
  }

  const ext = path.extname(absolutePath).toLowerCase();
  if (!APPROVED_ASSET_EXTENSIONS.has(ext)) {
    throw new Error(`Unsupported asset extension: ${ext || "(none)"}`);
  }
  const kind = classifyAssetPath(absolutePath);
  const allowedKinds = options.allowedKinds ? new Set(options.allowedKinds) : null;
  if (allowedKinds && !allowedKinds.has(kind)) {
    throw new Error(`Asset kind ${kind} is not allowed here.`);
  }
  const maxBytes = options.maxBytes || MAX_BYTES_BY_KIND[kind] || MAX_BYTES_BY_KIND.file;
  if (stat.size > maxBytes) {
    throw new Error(`Asset is too large: ${stat.size} bytes > ${maxBytes} bytes.`);
  }

  return {
    absolutePath,
    ext,
    kind,
    size: stat.size,
    sha256: sha256File(absolutePath)
  };
}

function uniqueAssetName(filePath, digest) {
  const parsed = path.parse(filePath);
  const id = safeId(parsed.name);
  const shortDigest = String(digest || "").slice(0, 12) || crypto.randomBytes(6).toString("hex");
  return `${id}-${shortDigest}${parsed.ext.toLowerCase()}`;
}

function importLocalAsset({ workspaceRoot, sourcePath, allowedKinds = null, maxBytes = null }) {
  const asset = assertSafeLocalAssetFile(sourcePath, { allowedKinds, maxBytes });
  const rawDir = resolveInside(workspaceRoot, "assets", "raw");
  ensureDir(rawDir);
  const destination = resolveInside(rawDir, uniqueAssetName(asset.absolutePath, asset.sha256));
  const destinationReal = fs.existsSync(destination) ? fs.realpathSync(destination) : destination;
  if (asset.absolutePath !== destinationReal) {
    fs.copyFileSync(asset.absolutePath, destination);
  }
  return {
    ...asset,
    destination,
    relativePath: path.relative(workspaceRoot, destination)
  };
}

function isPrivateIpv4(address) {
  const parts = address.split(".").map((part) => Number(part));
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) {
    return true;
  }
  const [a, b] = parts;
  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    a >= 224
  );
}

function isPrivateIpv6(address) {
  const normalized = address.toLowerCase();
  return (
    normalized === "::1" ||
    normalized === "::" ||
    normalized.startsWith("fc") ||
    normalized.startsWith("fd") ||
    normalized.startsWith("fe80:") ||
    normalized.startsWith("::ffff:127.") ||
    normalized.startsWith("::ffff:10.") ||
    normalized.startsWith("::ffff:192.168.")
  );
}

function isLocalHostname(hostname) {
  const lower = hostname.toLowerCase();
  return lower === "localhost" || lower.endsWith(".localhost") || lower.endsWith(".local") || lower.endsWith(".internal");
}

async function assertSafePublicHttpUrl(rawUrl) {
  let parsed;
  try {
    parsed = new URL(rawUrl);
  } catch (_error) {
    throw new Error(`Invalid URL: ${rawUrl}`);
  }
  if (!["http:", "https:"].includes(parsed.protocol)) {
    throw new Error(`Unsupported URL scheme: ${parsed.protocol}`);
  }
  if (parsed.username || parsed.password) {
    throw new Error("URLs with embedded credentials are not allowed.");
  }
  if (!parsed.hostname || isLocalHostname(parsed.hostname)) {
    throw new Error(`Private or local URL host is not allowed: ${parsed.hostname}`);
  }

  const literalFamily = net.isIP(parsed.hostname);
  const addresses = literalFamily
    ? [{ address: parsed.hostname, family: literalFamily }]
    : await dns.lookup(parsed.hostname, { all: true, verbatim: true });

  for (const item of addresses) {
    if (item.family === 4 && isPrivateIpv4(item.address)) {
      throw new Error(`Private IPv4 URL target is not allowed: ${item.address}`);
    }
    if (item.family === 6 && isPrivateIpv6(item.address)) {
      throw new Error(`Private IPv6 URL target is not allowed: ${item.address}`);
    }
  }
  return parsed.toString();
}

async function readResponseTextWithLimit(response, maxBytes) {
  const reader = response.body && response.body.getReader ? response.body.getReader() : null;
  if (!reader) {
    const text = await response.text();
    return text.slice(0, maxBytes);
  }
  const chunks = [];
  let total = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      break;
    }
    total += value.byteLength;
    if (total > maxBytes) {
      throw new Error(`URL response exceeded ${maxBytes} bytes.`);
    }
    chunks.push(Buffer.from(value));
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function fetchPublicText(url, options = {}) {
  const timeoutMs = options.timeoutMs || 10000;
  const maxBytes = options.maxBytes || MAX_LINK_BYTES;
  let currentUrl = await assertSafePublicHttpUrl(url);
  let redirects = 0;

  while (redirects <= MAX_REDIRECTS) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(currentUrl, {
        headers: {
          "user-agent": "local-first-social-agent-workspace/0.1 (+human-reviewed link context)"
        },
        redirect: "manual",
        signal: controller.signal
      });

      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const location = response.headers.get("location");
        if (!location) {
          throw new Error(`Redirect without Location header from ${currentUrl}`);
        }
        const nextUrl = new URL(location, currentUrl).toString();
        currentUrl = await assertSafePublicHttpUrl(nextUrl);
        redirects += 1;
        continue;
      }

      const contentLength = Number(response.headers.get("content-length") || 0);
      if (contentLength > maxBytes) {
        throw new Error(`URL response is too large: ${contentLength} bytes > ${maxBytes} bytes.`);
      }
      const text = await readResponseTextWithLimit(response, maxBytes);
      return {
        ok: response.ok,
        status: response.status,
        finalUrl: response.url || currentUrl,
        contentType: response.headers.get("content-type") || "",
        text,
        redirects
      };
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new Error(`Too many redirects while fetching URL: ${url}`);
}

module.exports = {
  APPROVED_ASSET_EXTENSIONS,
  DOCUMENT_EXTENSIONS,
  IMAGE_EXTENSIONS,
  MAX_BYTES_BY_KIND,
  TEXT_EXTENSIONS,
  VIDEO_EXTENSIONS,
  assertSafeLocalAssetFile,
  assertSafePublicHttpUrl,
  classifyAssetPath,
  fetchPublicText,
  importLocalAsset,
  isSensitivePath,
  safeId
};

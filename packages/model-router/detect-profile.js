const os = require("os");
const { spawnSync } = require("child_process");

const backendCommands = [
  { id: "ollama", label: "Ollama", commands: [["ollama", ["--version"]]] },
  { id: "mlx", label: "MLX LM", commands: [["mlx_lm.generate", ["--help"]], ["mlx_lm", ["--help"]]] },
  { id: "llama.cpp", label: "llama.cpp", commands: [["llama-cli", ["--help"]], ["main", ["--help"]]] },
  { id: "vllm", label: "vLLM", commands: [["vllm", ["--help"]]] },
  { id: "comfyui", label: "ComfyUI", commands: [["comfy", ["--help"]], ["comfyui", ["--help"]]] },
  { id: "nvidia-smi", label: "NVIDIA SMI", commands: [["nvidia-smi", ["--query-gpu=memory.total", "--format=csv,noheader,nounits"]]] }
];

function probeCommand(command, args) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    timeout: 1500,
    stdio: ["ignore", "pipe", "pipe"]
  });

  return {
    found: !result.error && result.status !== 127,
    status: typeof result.status === "number" ? result.status : null,
    error: result.error ? result.error.code || result.error.message : null,
    stdout: result.stdout || "",
    stderr: result.stderr || ""
  };
}

function probeOllamaApi() {
  const result = spawnSync("curl", ["-s", "--max-time", "2", "http://127.0.0.1:11434/api/tags"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"]
  });
  if (result.error || result.status !== 0 || !result.stdout) {
    return false;
  }
  try {
    const payload = JSON.parse(result.stdout);
    return Array.isArray(payload.models);
  } catch (_error) {
    return false;
  }
}

function detectBackends() {
  return backendCommands.map((backend) => {
    if (backend.id === "ollama" && probeOllamaApi()) {
      return {
        id: backend.id,
        label: backend.label,
        available: true,
        command: "ollama-api",
        status: 0
      };
    }
    for (const [command, args] of backend.commands) {
      const probe = probeCommand(command, args);
      if (probe.found && probe.status === 0) {
        return {
          id: backend.id,
          label: backend.label,
          available: true,
          command,
          status: probe.status
        };
      }
    }
    return {
      id: backend.id,
      label: backend.label,
      available: false,
      command: null,
      status: null
    };
  });
}

function parseNvidiaVramGb(backends) {
  const nvidia = backends.find((backend) => backend.id === "nvidia-smi" && backend.available);
  if (!nvidia) {
    return 0;
  }
  const probe = probeCommand("nvidia-smi", ["--query-gpu=memory.total", "--format=csv,noheader,nounits"]);
  const values = probe.stdout
    .split(/\s+/)
    .map((value) => Number.parseInt(value, 10))
    .filter((value) => Number.isFinite(value));
  if (values.length === 0) {
    return 0;
  }
  return Math.round(Math.max(...values) / 1024);
}

function detectProfile(profiles) {
  const platform = os.platform();
  const arch = os.arch();
  const totalMemoryGb = Math.round(os.totalmem() / 1024 / 1024 / 1024);
  const backends = detectBackends();
  const nvidiaVramGb = parseNvidiaVramGb(backends);

  let profileId = "cpu-weak";
  const signals = [`platform:${platform}`, `arch:${arch}`, `memoryGb:${totalMemoryGb}`];
  if (nvidiaVramGb > 0) {
    signals.push(`nvidiaVramGb:${nvidiaVramGb}`);
  }

  if (nvidiaVramGb >= 16) {
    profileId = "nvidia-strong";
  } else if (nvidiaVramGb >= 8) {
    profileId = "nvidia-medium";
  } else if (platform === "darwin" && arch === "arm64") {
    profileId = "apple-silicon-pro";
  }

  const profile = profiles.profiles.find((item) => item.id === profileId) || profiles.profiles[0];
  return {
    ...profile,
    detectedSignals: signals,
    totalMemoryGb,
    nvidiaVramGb,
    availableBackends: backends
  };
}

function recommendationsForProfile(profile, catalog) {
  const profileId = profile.id;
  const sections = ["text", "vision", "image", "orchestration"];
  const result = {};

  for (const section of sections) {
    result[section] = (catalog[section] || [])
      .filter((item) => item.profiles.includes(profileId) || item.profiles.includes("all"))
      .map((item) => ({
        ...item,
        backendAvailability: item.backendPreference.map((backendId) => {
          const backend = profile.availableBackends.find((candidate) => candidate.id === backendId);
          return {
            id: backendId,
            available: Boolean(backend && backend.available),
            command: backend ? backend.command : null
          };
        })
      }));
  }

  return result;
}

function buildModelRoutingReport(profiles, catalog) {
  const profile = detectProfile(profiles);
  return {
    version: catalog.version || profiles.version,
    generatedAt: new Date().toISOString(),
    noCostPolicy: "software-only no-cost; quality depends on local hardware and installed backends",
    profile,
    recommendations: recommendationsForProfile(profile, catalog),
    requiredHumanDecision: [
      "Download exact local model weights only after checking their license and hardware fit.",
      "Do not configure paid API fallbacks in generated workspaces.",
      "Keep image/video generation optional when hardware is too small."
    ]
  };
}

function modelRoutingMarkdown(report) {
  const backendRows = report.profile.availableBackends.map((backend) => {
    return `| ${backend.label} | ${backend.available ? "yes" : "no"} | ${backend.command || "-"} |`;
  });

  const sectionMarkdown = (title, items) => {
    if (!items || items.length === 0) {
      return `## ${title}\nNo compatible candidates for this profile yet.\n`;
    }
    return `## ${title}

${items.map((item) => {
  const backends = item.backendAvailability
    .map((backend) => `${backend.id}:${backend.available ? "available" : "missing"}`)
    .join(", ");
  return `### ${item.label}
- Role: ${item.role}
- Candidate tier: ${item.candidateTier}
- Backend fit: ${backends}
- License posture: ${item.licensePosture}
- Notes: ${item.notes}`;
}).join("\n\n")}
`;
  };

  return `# Model Routing Report

Profile: ${report.profile.label}

Policy: ${report.noCostPolicy}

## Detected Signals
${report.profile.detectedSignals.map((signal) => `- ${signal}`).join("\n")}

## Local Backend Probes
| Backend | Available | Command |
| --- | --- | --- |
${backendRows.join("\n")}

${sectionMarkdown("Text Models", report.recommendations.text)}
${sectionMarkdown("Vision Models", report.recommendations.vision)}
${sectionMarkdown("Image Models", report.recommendations.image)}
${sectionMarkdown("Orchestration", report.recommendations.orchestration)}
## Human Decisions Required
${report.requiredHumanDecision.map((item) => `- ${item}`).join("\n")}
`;
}

module.exports = { buildModelRoutingReport, detectBackends, detectProfile, modelRoutingMarkdown };

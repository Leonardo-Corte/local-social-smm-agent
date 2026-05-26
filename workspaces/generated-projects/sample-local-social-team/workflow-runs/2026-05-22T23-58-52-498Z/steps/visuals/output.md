## Visual Brief Improvements

### Summary of Issues:
The current visual briefs do not align well with the local model routing context since ComfyUI is missing. The text-heavy social graphics tier also relies on ComfyUI, which is unavailable. Therefore, the image generation and workflow needs a practical adaptation to ensure compliance with our constraints.

### Recommendations:

1. **Image Prompts Adaptation**:
   - Adjust prompts in `image-prompts.md` for text-heavy graphics to be more descriptive, providing detailed instructions that could be implemented manually or through a different local image backend if one is identified.
   
2. **ComfyUI Workflow Notes Adjustment**:
   - Create comprehensive notes on how ComfyUI workflows can be designed and documented separately, ready to implement once the ComfyUI installation and model licensing check are completed.

3. **Visual Briefs Update**:
   - Modify the visual briefs in `visual-briefs.md` to indicate placeholders for image generation that require human intervention or use alternative text-based instructions when an image is not generated.

### Recommended Fixes:

- Ensure all visual prompts can be executed either manually by a designer or with local tools if ComfyUI isn't immediately available.
- Include detailed descriptions of the workflow steps and any necessary model configurations in `comfyui-workflow-notes.md`.
- Update `visual-briefs.md` to reflect placeholders for images that will require approval before final generation and publishing.

### Next Steps:
1. **Human Review**: Approve or adjust these suggestions to ensure compliance with project goals.
2. **Implementation**:
   - Adjust the image prompts in `image-prompts.md`.
   - Document ComfyUI workflow configurations and notes in `comfyui-workflow-notes.md`.
   - Update visual briefs in `visual-briefs.md` to reflect current limitations and future plans.

Please proceed with these adjustments, ensuring all modifications align with our project's constraints and goals.

# KGG Patient Preview Runtime Routing

Shared dispatcher: `Kayus24/vibe-shared-knowledge/tool-routing/BASELINE.md`.

## Runtime dispatch
- **ChatGPT:** read `CHATGPT_TOOL_ROUTING.md`.
- **Codex:** read `CODEX_TOOL_ROUTING.md`.

Never apply ChatGPT plugin priorities to Codex.

## Source of truth
1. This repo for isolated preview artifacts.
2. `Kayus24/kgg` for production patient-app source and release truth.
3. Preview files are never production authority.

## Gates
- Synthetic plans only.
- No real patient links, secrets or chat content.
- No production release from this repo.
- A production fix must return to `Kayus24/kgg` through its branch/test/PR process.

## Directory routing
- `previews/<request_id>/**`: isolated synthetic preview for one request.
- `device-test/**`: preview-side device/test helpers only.
- `index.html`: preview channel entry point, not production authority.
- Root docs/config: preview contract and routing only.

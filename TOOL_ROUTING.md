# KGG Patient Preview Tool Routing

Inherit: `Kayus24/vibe-shared-knowledge/tool-routing/BASELINE.md`.

## Source of truth
1. This repo for isolated preview artifacts
2. `Kayus24/kgg` for production patient-app source and release truth
3. Preview files are never production authority

## Preferred hierarchy
- Preview repo/commit state: **GitHub**
- Visual preview validation: **KGG UI Lab Private**
- Deterministic browser regression: **Playwright/project tests**
- Device/WebView-only behavior: **Test Android Apps/ADB**
- Local preview tooling: **Remote Desktop Commander**
- Browser-independent external verification: **Firecrawl** only when needed

## Gates
- Synthetic plans only.
- No real patient links, secrets or chat content.
- No production release from this repo.
- A production fix must return to `Kayus24/kgg` through its branch/test/PR process.
## Directory routing
- `previews/<request_id>/**`: isolated synthetic preview for one request; primary runtime artifact area.
- `device-test/**`: preview-side device/test helpers only.
- `index.html`: preview channel entry point, not production patient-app authority.
- Root docs/config: preview contract and routing only.

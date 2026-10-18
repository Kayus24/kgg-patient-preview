# KGG Patient Preview Codex Tool Routing

Applies only to **Codex**.

Inherit: `Kayus24/vibe-shared-knowledge/tool-routing/CODEX_BASELINE.md`.

## Project-specific hierarchy
1. Use the local preview repo/worktree and Git state first.
2. Use repository-native search, shell and existing preview/test scripts.
3. For actual preview interaction or visual inspection, use **Codex's own browser first**.
4. Use Developer Mode/full CDP access when approved for console/network/page-state/rendering diagnostics.
5. Use repository Playwright/E2E for deterministic browser regression.
6. Use local Android SDK/ADB/emulator tooling through Codex shell for device/WebView-only behavior.
7. Production fixes belong in `Kayus24/kgg`, not this preview repo.

## Hard exclusions
- Do not route Codex preview work to Firecrawl or KGG UI Lab by default.
- Do not inherit ChatGPT connectors/plugins.

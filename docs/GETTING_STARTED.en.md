# From source material to BIT slides

[简体中文](GETTING_STARTED.md) · [Visual guide and two-minute walkthrough](https://roxyxu151.github.io/slidev-theme-bit/guide/) · [Complete paper example](https://roxyxu151.github.io/slidev-theme-bit/attention/1)

Slidev uses Markdown source and presents in a browser. PDF and PPTX are additional exports. Saving the source updates the live preview; export again to update those files. The starters, video captions, and report checker messages are in Simplified Chinese.

## 1. Pick a scenario

Use Node.js 22.18 or later and npm:

```bash
git clone https://github.com/RoxyXu151/slidev-theme-bit.git
cd slidev-theme-bit
npm ci
npm run create:deck -- ../my-paper --template paper --theme .
cd ../my-paper
npm install
npm run dev
```

Choose `paper` (12 slides: problem, methods, evidence, discussion), `meeting` (8 slides: progress, evidence, blockers, next steps), or `defense` (9 slides, default: background, methods, experiments, conclusions). Run `npm run create:deck -- --list` to list them.

The initializer refuses nonempty destinations and installs nothing. `--theme .` reuses your local theme repository; omit it to use a fixed GitHub release archive. Each starter includes placeholders and speaker-note prompts, without invented results. Edit `slides.md` in the new project; put your images in `public/`.

For a complete worked example, run `npm run dev:paper` **in the theme repository** and edit `attention.md`. This 14-slide reading presentation covers *Attention Is All You Need* with equations, the original architecture figure, reported data, notes, and discussion. See [sources and version details](attention/SOURCES.md).

## 2. Give your AI the material and starter

Provide your verified paper/results, selected `slides.md`, and [writing prompt](AI_PROMPT.md). Specify audience, duration, slide count, author information, and output format. An AI coding assistant can also load the repository's `bit-slidev` skill.

Ask it to plan each slide's question, fill the starter, preserve sources and notes, distinguish reported conclusions from your analysis, and leave missing facts as placeholders. Ask it to run the checker, inspect screenshots, and fix the source. This theme does not provide an AI model or hosted generation service.

## 3. Preview and revise

Open the URL printed by `npm run dev`. Edit and save `slides.md` to update the preview. Slides are separated by `---`. Use `#` for a title, `-` for bullets, `**bold**` for emphasis, and HTML comments for notes.

Arrow keys navigate; `P` opens presenter view, `O` the overview, and `F` full screen. Use your editor or ask your AI assistant to edit files; there is no built-in drag-and-drop editor. Prefer requests such as “Split slide 6 into the formula and an example” or “Keep only two results on slide 10, preserving sources.” Split crowded slides instead of shrinking text.

## 4. Check the actual report

In your generated project:

```bash
npx playwright install chromium
npm run check
```

The checker starts and closes its own preview and leaves your source unchanged. Open `.slidev-check/slides/index.html` for Chinese diagnostics and screenshots. `report.json` contains slide numbers, rule codes, and source locations for an AI assistant. Each slide also has a PNG screenshot.

```bash
npm run check -- slides.md --browser chrome
npm run check -- slides.md --strict
```

An installed Chrome can replace downloaded Chromium. In the theme repository, `npm run check:paper` checks the worked example. `PLAYWRIGHT_CHANNEL` also selects the browser.

Errors include canvas overflow, header/footer intrusion, clipped content, missing images, nonexistent TOC pages, and render failures. Warnings cover titles longer than two lines, overlapping independent content blocks, and TOC labels differing from target titles/section labels. Review screenshots before deciding whether a warning is intentional.

Exit codes: 0 without errors; 1 with errors (or warnings under `--strict`); 2 when the check could not complete. `--out <directory>` selects an independent report directory; `--url http://localhost:3030/` reuses an existing preview matching your source.

Checks cover the default display state, not every click animation. They do not validate research facts, statistical comparisons, aesthetic quality, every possible custom CSS overlap, or PPTX rendering. Fix the source using the JSON and screenshots, then run again.

## 5. Present or export

```bash
npm run build
npm run export
```

Serve `dist/` through a static server or deploy it to your hosting service. Do not rely on double-clicking its HTML file. The PDF is `slides.pdf`.

```bash
npx slidev export slides.md --format pptx --output slides.pptx
npx slidev export slides.md --format pptx-editable --output slides-editable.pptx --no-with-clicks
```

Image PPTX preserves appearance more closely but its text cannot be edited separately. Editable PPTX uses native objects where possible; equations and complex effects can remain pictures. Verify wrapping and image proportions in PowerPoint. See [Slidev exporting](https://sli.dev/guide/exporting.html).

## Troubleshooting

- Updated source but old PDF? Export again.
- Unsupported Node.js? Use 22.18 or later and reopen your terminal.
- Browser missing? Install Chromium, or use `--browser chrome` with installed Chrome.
- Chinese glyphs missing? Use Microsoft YaHei on Windows, PingFang on macOS, or Noto Sans CJK on Linux.
- Prefer a browser workspace? [Open the full example in StackBlitz](https://stackblitz.com/github/RoxyXu151/slidev-theme-bit?file=attention.md&startScript=dev:paper). First launch installs dependencies and needs a supported browser and network. Browser workspaces may limit exports and checks; download and run locally when needed.

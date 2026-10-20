# slidev-theme-bit

[简体中文](README.md) · [English](README.en.md)

**An academic presentation and thesis defense theme for Beijing Institute of Technology (BIT), built with Slidev.**

Bring the familiar BIT PowerPoint style to the browser. Use Markdown, Vue, and AI assistance to prepare course presentations, research group reports, and thesis defenses.

[Start here](https://roxyxu151.github.io/slidev-theme-bit/guide/) · [Complete paper example](https://roxyxu151.github.io/slidev-theme-bit/attention/1) · [All layouts](https://roxyxu151.github.io/slidev-theme-bit/) · [Edit in your browser](https://stackblitz.com/github/RoxyXu151/slidev-theme-bit?file=attention.md&startScript=dev:paper) · [Use this template](https://github.com/new?template_name=slidev-theme-bit&template_owner=RoxyXu151)

![Classic cover](docs/preview/cover.png)

> An unofficial community project adapted from the BIT academic defense PowerPoint template designed by Han Yu (韩宇) in 2019. Original code and documentation are licensed under MIT. Artwork from the original template and university marks retain their original rights. See [NOTICE.md](NOTICE.md).

## First time here?

**Choose a starter → Give verified material to AI → Preview and revise → Check each slide → Present or export.**

Slidev uses Markdown source and presents in a browser. `slides.md` is editable source; PDF and PPTX are additional exports that must be regenerated after edits. This project provides a theme, starters, and an AI skill, not a hosted AI generation service.

The [beginner guide](docs/GETTING_STARTED.en.md) explains files, editing, checks, exports, and troubleshooting. The [visual guide and two-minute walkthrough](https://roxyxu151.github.io/slidev-theme-bit/guide/) use Chinese captions.

| Starter | Slides | Content flow |
| --- | ---: | --- |
| `paper` · Paper reading | 12 | Problem, methods, experiments, discussion, sources |
| `meeting` · Research group | 8 | Progress, evidence, blockers, next steps |
| `defense` · Thesis defense | 9 | Background, methods, experiments, conclusions |

The complete **Attention Is All You Need** example has 14 slides with equations, the original architecture figure, reported data, notes, and discussion. [Source deck](attention.md) · [Pinned version and sources](docs/attention/SOURCES.md)

![Attention Is All You Need example](docs/attention/preview.jpg)

## Start locally

Requires Node.js **22.18 or later** (Node.js 22 LTS recommended) and npm.

```bash
git clone https://github.com/RoxyXu151/slidev-theme-bit.git
cd slidev-theme-bit
npm ci
npm run dev:paper
```

Open the printed URL and edit **`attention.md`** to preview the worked example. To start your own presentation, run this in the theme repository:

```bash
npm run create:deck -- ../my-paper --template paper --theme .
cd ../my-paper
npm install
npm run dev
```

Replace `paper` with `meeting` or `defense` (default). Starters contain placeholders and speaker-note prompts. The initializer refuses nonempty destinations and installs nothing. Edit **`slides.md`** in the new project; saving updates the browser.

`npm run dev:starter` still opens the nine-slide root defense starter **`slides.md`**. `npm run dev` opens the layout showcase **`example.md`**. The StackBlitz browser entry installs dependencies on first launch and needs a supported desktop browser and network. Local checks and exports are more complete. You can also select “Use this template” to create your own repository.

The starter, showcase, AI prompt, and some built-in labels are in Simplified Chinese. This English README documents the same theme and interfaces.

## Preview

![Layout preview](docs/preview/layouts.jpg)

- Four cover and closing styles: classic white, solid green, campus photo, and campus panorama
- Contents, light and dark section dividers, body slides, two columns, images on either side, full figures, quotations, and centered content
- Six additional compositions: green/white comparison, three stages, four viewpoints, sidebar, equation/key figures, and overlapping photo/text
- Four title treatments, three header styles, automatic page numbers, configurable footers and colors
- Local Chinese font fallbacks, with Slidev support for equations, code highlighting, and speaker notes
- Editable key figures, bar charts, research timelines, and callouts
- A GitHub Pages demo, continuous integration, and installation in existing projects

## Common commands

| Command | Purpose |
| --- | --- |
| `npm run dev:starter` | Edit the thesis defense starter, `slides.md` |
| `npm run dev:paper` | Edit the complete example, `attention.md` |
| `npm run create:deck -- --list` | List three scenario starters |
| `npm run check -- slides.md` | Check a report; output diagnostics, JSON, and screenshots |
| `npm run check:paper` | Strictly check the worked example |
| `npm run dev` | View the complete theme showcase, `example.md` |
| `npm run build:starter` | Build the starter website into `dist-starter/` |
| `npm run build` | Build the theme demo into `dist/` |
| `npm run build:paper` | Build the paper example into `dist-attention/` |
| `npm run build:site` | Build the showcase, paper example, and beginner guide |
| `npm run export` | Export the starter to `slides.pdf` |
| `npm run export:example` | Export the showcase to `example.pdf` |
| `npm test` | Check browser rendering, asset loading, and content boundaries |
| `npm run test:skill` | Check skill initialization, installation, and preservation of existing files |
| `npm run test:checker` | Verify detection of real rendering faults |

Before exporting PDFs or running tests, run `npx playwright install chromium`. On Linux, use `npx playwright install --with-deps chromium` to install system dependencies as well. Run PDF exports locally. In a browser editing environment, you can build the website and then use the browser's print function.

Use the arrow keys to navigate, `P` for presenter view, `O` for the overview, and `F` for full screen. Write speaker notes in HTML comments at the end of each slide.

The checker starts and closes an independent preview without changing source files. Open `.slidev-check/<entry-name>/index.html`; the same directory contains `report.json` and screenshots. Add `--browser chrome` to use installed Chrome. Checks cover overflow, footer intrusion, missing images, long titles, intersecting content blocks, and TOC targets. Review warnings manually; `--strict` treats them as failures. Research facts, all animation steps, and PPTX rendering require separate review. [Scope and exit codes](docs/GETTING_STARTED.en.md#4-check-the-actual-report)

## Use in an existing Slidev project

Install the theme from GitHub. **These instructions do not require or assume publication to npm.**

```bash
npm install github:RoxyXu151/slidev-theme-bit#v0.3.0
```

Add the following configuration to the first slide of your project:

```yaml
---
theme: bit
title: My Thesis Defense
presenter: Your Name
advisor: Advisor Name
date: October 2026
school: Beijing Institute of Technology · Your School
subtitle: Thesis Defense
themeConfig:
  footer: Beijing Institute of Technology · Your School
  motto: 德以明理　学以精工
  showPageNumber: true
  headerStyle: classic
---
```

Requires Slidev 53 or later. Omit the version fragment to install from the main branch. Put your own images in your project's `public/` directory and reference them as `/filename.png`. Bundled theme assets use module imports and support deployment under a subpath.

## Layouts

Separate slides with `---`. The first slide defaults to `cover`; subsequent slides default to `default`. Configure each slide's layout in its YAML frontmatter.

| `layout` | Purpose | Options and slots |
| --- | --- | --- |
| `cover` | Title slide | `variant: classic / green / photo / panorama`; `presenter`, `advisor`, `date`, `school`, `subtitle` |
| `default` | Title and body content | `section`, `sectionNumber`, `headerStyle` |
| `toc` | Table of contents | An ordered list in the default slot; `heading` overrides the default Chinese heading |
| `section` | Section divider | `number`, `subtitle`; `variant: light` selects the light style |
| `two-cols` | Two columns beneath a shared title | Default slot for the title; `::left::` and `::right::` for the columns |
| `image-left` | Image on the left, text on the right | `::title::` for the title; default slot for text; `image` or `::image::` for the image |
| `image-right` | Text on the left, image on the right | Same interface as `image-left` |
| `figure` | Large figure with a caption | Default slot for the title; `image` or `::figure::` for the figure |
| `quote` | Quotation | Default slot for the quotation; `author` for its source |
| `center` | Centered content | Default slot |
| `end` | Closing slide | Same interface as `cover` |
| `compare` | Green/white comparison panels | Default title; `::left::`, `::right::`, optional `::note::` |
| `steps` | Three-stage progression | Default title; `::first::`, `::second::`, `::third::`, optional `::note::` |
| `grid` | Four concise viewpoints | Default title; `::first::` through `::fourth::`, optional `::note::` |
| `sidebar` | Question sidebar with supporting content | Default short title; `::body::`, optional `::summary::`; `eyebrow` label |
| `focus` | Central equation or key figures | Default title; `::focus::`, `::explanation::`, optional `::note::` |
| `image-story` | Photo with overlapping text panel | Default body; `::title::`; `image` or `::image::` |

**Vary the composition to suit the content.** Set `titleStyle: classic / plain / rail / band` on a slide or in `themeConfig` for a red underline, undecorated title, green vertical rule, or green title band. Existing slides keep the classic default; new compositions default to plain or rail. Per-slide settings override deck settings, which override layout defaults. See the [composition guide and original PPT references (Chinese)](docs/LAYOUTS.md).

Image and figure layouts support `caption`, `imageAlt`, and `fit: contain / cover`. The default, `contain`, preserves the entire image. The `photo` and `panorama` covers accept an `image` override and otherwise use a campus photo from the original template.

Two-column example:

```md
---
layout: two-cols
section: Research Methods
sectionNumber: '02'
---

# Methods and Validation

::left::

## Method Design
Research steps and assumptions.

::right::

## Validation Plan
Controls and evaluation metrics.
```

Image-and-text example:

```md
---
layout: image-right
image: /experiment.png
imageAlt: Experimental platform structure
caption: Figure 1. Experimental platform, photographed by the author
fit: contain
---

## Platform Details
Describe the experimental conditions shown in the image.

::title::

# Experimental Platform
```

`themeConfig` supports `primary` (default `#006C39`), `accent` (default `#A13F3D`), `footer`, `motto`, `showPageNumber`, `titleStyle`, and `headerStyle` (`classic`, `minimal`, or `building`). You can also override these options on individual slides. Set `footer: false` to hide a body slide's footer, or `showPageNumber: false` to hide only the page number. Cover metadata comes from the current slide; repeat the fields you need on additional covers and closing slides.

The theme uses a **16:9, 1280 × 720** design canvas. For projection readability, aim for no more than five bullet points per body slide and split long passages across slides. Install Chinese fonts on your system; the theme does not download online fonts. It prefers Microsoft YaHei on Windows and PingFang SC on macOS. On Linux, you can install Noto Sans CJK.

## Academic components

`BitMetrics` displays two or three editable key figures with units, labels, and context:

```vue
<BitMetrics :items="[
  { value: '128', label: 'Sample size', detail: 'Demonstration data' },
  { value: '86%', label: 'Example score', detail: 'Demonstration, not a research result', accent: true }
]" />
```

```vue
<BitCallout title="Key Finding">State an evidence-supported conclusion.</BitCallout>

<BitCallout title="Limitations" tone="accent">Explain the conditions of applicability.</BitCallout>

<BitBarChart
  :items="[{ label: 'Method A', value: 72 }, { label: 'Method B', value: 88, accent: true }]"
  :max="100"
  unit="%"
  label="Accuracy comparison"
>
  Demonstration data, not actual experimental results.
</BitBarChart>

<BitTimeline :items="[
  { date: 'Phase 1', title: 'Review', description: 'Define the research problem.' },
  { date: 'Phase 2', title: 'Experiments', description: 'Test the research hypothesis.' }
]" />
```

Use three to five stages for a timeline. Bar charts are intended for nonnegative values; `max` sets the display limit. Use your own Vue components or complete images for complex statistical figures. A simple bar chart does not replace uncertainty or error analysis.

## Write slides with AI

Provide [AI_PROMPT.md (Chinese)](docs/AI_PROMPT.md), `slides.md`, and your verified source materials to your AI assistant. The prompt covers available layouts, slot syntax, content length, and citation requirements. Replace the starter's content without asking the assistant to recreate the theme's styles.

See [AGENTS.md](AGENTS.md) for repository maintenance and AI editing guidance. Keep `[待补充]` (“to be added”) placeholders when data or references are missing, and manually verify every chart, citation, and conclusion before submission.

## Agent Skill

The repository includes the [bit-slidev skill](.agents/skills/bit-slidev/SKILL.md), with layout interfaces, three scenario starters, project initialization, and a generate–check–revise workflow. Codex discovers repository skills under `.agents/skills/`; see the [official skill documentation](https://learn.chatgpt.com/docs/build-skills) for directory conventions.

Invoke it in this repository:

```text
$bit-slidev Create a 12-slide BIT thesis defense from my supplied research materials, including speaker notes and a PDF.
```

To use it in other projects, run this command from the repository root:

```bash
node .agents/skills/bit-slidev/scripts/install_skill.mjs
```

The installer copies the complete skill to `~/.agents/skills/bit-slidev` and refuses to overwrite an existing destination. Use `--dest /path/to/bit-slidev` to select another location. For other tools supporting Agent Skills, copy the whole `bit-slidev` folder to the tool's skill directory. If it does not appear in the skill list, reopen your session.

Agents can also initialize a project directly. The script does not access the network or install dependencies and refuses nonempty destinations:

```bash
node .agents/skills/bit-slidev/scripts/init_deck.mjs ./my-paper --template paper
cd my-paper
npm install
npm run dev
```

When invoking it elsewhere, use the actual path to the installed skill's script. Add `--theme /path/to/slidev-theme-bit` to reuse local theme sources; otherwise it uses a pinned GitHub theme archive. The skill guides material verification, attribution, and layout review. Creating a report does not automatically publish it.

## Publish your presentation

Build `slides.md`:

```bash
npx slidev build slides.md --out dist-starter --base /your-repository-name/
```

Deploy `dist-starter/` to a static hosting service. The included [Pages workflow](.github/workflows/pages.yml) runs `npm run build:site` to publish the showcase, paper example, and guide. To publish only your report, replace that build step with the command above and upload `dist-starter`. In Settings → Pages, select GitHub Actions as the source.

The theme has no built-in remote AI service and requires no API key. Before publishing a report in a public repository or on Pages, confirm that its materials are suitable for public access.

## Contributing

Contributions that improve layouts, examples, or documentation for BIT teaching and research are welcome. Run `npm ci`, `npm run build:site`, `npm run build:starter`, and `npm test`, and check Chinese text readability when projected. See [CONTRIBUTING.md (Chinese)](CONTRIBUTING.md) for skill and checker verification.

## Acknowledgments

Thanks to Han Yu (韩宇) for the original PowerPoint design, the authors of campus photos and other materials used in the original template, and the [Slidev](https://sli.dev) community. Original code and documentation are licensed under [MIT](LICENSE). See [NOTICE.md (Chinese)](NOTICE.md) for the provenance and rights of original template assets and university marks.

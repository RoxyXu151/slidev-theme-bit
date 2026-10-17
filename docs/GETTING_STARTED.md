# 从材料到北理工幻灯片

[English](GETTING_STARTED.en.md) · [图文指南与两分钟录屏](https://roxyxu151.github.io/slidev-theme-bit/guide/) · [完整论文示例](https://roxyxu151.github.io/slidev-theme-bit/attention/1)

Slidev 的源稿是 Markdown，展示形式是网页。PDF 和 PowerPoint 是额外导出物；修改源稿后，网页预览会更新，导出物需要重新生成。

## 1. 选择场景

需要 Node.js 22.18 或以上和 npm。第一次使用：

```bash
git clone https://github.com/RoxyXu151/slidev-theme-bit.git
cd slidev-theme-bit
npm ci
```

从下面三种起步稿中选一种，创建在独立的新目录。已有文件不会被覆盖：

| 场景 | 参数 | 内容安排 |
| --- | --- | --- |
| 论文阅读 | `paper`，12 页 | 问题、方法、实验、讨论、参考资料 |
| 组会汇报 | `meeting`，8 页 | 上次目标、本周进展、证据、阻碍、计划 |
| 毕业答辩 | `defense`，9 页，默认 | 背景、方法、实验、总结与致谢 |

```bash
npm run create:deck -- ../my-paper --template paper --theme .
cd ../my-paper
npm install
npm run dev
```

把 `paper` 换成 `meeting` 或 `defense` 即可选择其他场景。`--theme .` 复用当前主题仓库；也可省略，从 GitHub 的固定版本包安装主题。可以用 `npm run create:deck -- --list` 列出场景。

每份起步稿都含待补充标记和讲稿提示，没有预设实验结果。源稿为新目录内的 `slides.md`，素材放在 `public/`。

想先看一份完整报告？在主题仓库运行 `npm run dev:paper`，打开终端中的地址，编辑 `attention.md`。它是基于《Attention Is All You Need》的 14 页论文阅读报告，含公式、原论文图、真实数据、讲稿与讨论。[来源与数据口径](attention/SOURCES.md)

## 2. 提供材料给 AI

将真实论文、实验结果、所选 `slides.md` 与 [AI 写作提示词](AI_PROMPT.md) 一起交给 AI。任务中说明听众、时长、页数、作者信息和输出格式。使用支持技能的 AI 编程助手时，可先加载仓库的 `bit-slidev` 技能。

```text
请根据我提供的材料，用北理工主题完成一份12页论文阅读汇报。
听众为本方向研究生，时长12分钟。
先给出每页要回答的问题，再填写slides.md。
保留图表出处和讲稿，区分论文结论与自己的分析。
缺失数据写[待补充]，不要编造结果。
保存后运行报告检查，并结合截图修正。
```

本项目不内置 AI 模型或在线生成服务；生成内容由你使用的 AI 工具完成。

## 3. 预览与修改

打开 `npm run dev` 给出的本地地址。修改 `slides.md` 并保存，网页实时更新。每页用 `---` 分隔，常见内容如下：

```markdown
# 页面标题

- 一条要点
- **需要强调的结论**

<!-- 这里是这一页的讲稿。 -->
```

方向键翻页，`P` 查看讲稿，`O` 总览，`F` 全屏。网页没有内置的自由拖拽编辑器，可以使用自己的文本编辑器，或让 AI 编程助手修改文件。

修改请求尽量具体，例如“第6页拆成两页，分别解释公式和例子”“第10页只保留两项结果，保留来源”。先修改内容与布局，内容太多时拆页，不通过缩小字号塞内容。

## 4. 检查报告

在新建报告目录中执行：

```bash
npx playwright install chromium
npm run check
```

检查器自动启动独立预览，完成后关闭，不修改源稿。结果写入 `.slidev-check/slides/`：

- `index.html`：中文问题说明与逐页截图，可直接打开。
- `report.json`：页码、规则代码、来源行号，便于 AI 继续修改。
- `slide-01.png` 等：实际浏览器截图。

检查其他报告时传入文件路径。已有 Chrome 时可跳过 Chromium 下载：

```bash
npm run check -- slides.md --browser chrome
npm run check -- slides.md --strict
```

在主题仓库中检查完整论文示例用 `npm run check:paper`；可通过环境变量 `PLAYWRIGHT_CHANNEL=chrome` 或参数选择本机浏览器。

| 检查 | 输出级别 | 如何处理 |
| --- | --- | --- |
| 画布越界、进入页眉或页脚、被裁切的内容 | 错误 | 精简内容、拆页或调整布局 |
| 图片加载失败 | 错误 | 检查文件和引用路径 |
| 目录指向不存在的页 | 错误 | 更新页码 |
| 目录文字与目标标题/章节不一致 | 提醒 | 判断是否错页，或是否用了不同表述 |
| 标题超过两行 | 提醒 | 缩短标题并检查效果 |
| 独立内容块相交 | 提醒 | 对照截图确认，可能是有意设计 |

错误退出码为 1；正常无错误退出 0。`--strict` 将提醒也视为失败。检查过程无法完成时退出 2。`--out 路径` 指定独立输出目录，`--url http://localhost:3030/` 复用你已启动且与源稿对应的预览。

检查范围是默认显示状态，不覆盖所有点击动画；无法验证论文事实、图表统计口径、审美质量、任意自定义 CSS 的全部重叠或 PPTX 导出。它提供可复查证据，不能代替人工判断。把 JSON 和截图交给 AI 修改后，应重新检查。

## 5. 展示与导出

```bash
npm run build
npm run export
```

网页产物为 `dist/`，PDF 为 `slides.pdf`。构建网页需要通过静态服务器访问，不建议直接双击 HTML 文件。可以部署到自己的静态托管服务。

额外需要 PowerPoint 时：

```bash
npx slidev export slides.md --format pptx --output slides.pptx
npx slidev export slides.md --format pptx-editable --output slides-editable.pptx --no-with-clicks
```

图片版更接近网页外观，但文字不可单独编辑。对象版文字和部分图形可编辑；公式、复杂效果等可能作为图片，文字换行和图片比例需要在 PowerPoint 核对。查看 [Slidev 导出文档](https://sli.dev/guide/exporting.html)。

## 常见问题

- **改了网页却没改 PDF？** 修改的是源稿，重新导出才会更新文件。
- **命令提示 Node 版本不兼容？** 使用 22.18 以上，重新打开终端后核对版本。
- **找不到浏览器？** 运行 `npx playwright install chromium`；已有 Chrome 可使用 `--browser chrome`。
- **没有中文字体？** Windows 使用微软雅黑，macOS 使用苹方，Linux 安装 Noto Sans CJK。字体由系统提供。
- **想从浏览器开始？** [StackBlitz 完整示例](https://stackblitz.com/github/RoxyXu151/slidev-theme-bit?file=attention.md&startScript=dev:paper) 首次会安装依赖，需受支持的浏览器和网络；浏览器环境中运行导出/检查可能受限，可下载项目在本机完成。

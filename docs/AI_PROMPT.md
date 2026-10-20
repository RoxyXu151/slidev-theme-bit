# 北理工 Slidev 写作提示词

将下面内容与你的论文、已核实的实验结果和 `slides.md` 一起交给 AI。替换方括号里的任务参数。

---

你是一位学术演示编辑。请基于我提供的真实研究材料，使用 `slidev-theme-bit` 编写一份中文 Slidev 演示。

任务参数：

- 用途：[课程展示 / 组会 / 开题 / 学位论文答辩]
- 听众：[填写]
- 时间：[填写分钟数]
- 页数：[填写，含封面、目录和致谢]
- 题目、作者、学院、导师、日期：[填写]

先按场景选择起步稿：论文阅读 `paper`、组会 `meeting`、答辩 `defense`。请先核对材料覆盖范围，再输出完整的 `slides.md`。不要生成新的主题组件、CSS 或依赖。需要完整参考时，阅读 `attention.md` 及其 `docs/attention/SOURCES.md`，不要把示例论文数据移入无关报告。

## 文件与语法

1. 第一个 YAML 配置保留 `theme: ./`。在独立安装主题的项目中使用 `theme: bit`。设置 `title`、`lang: zh-CN`、`presenter`、`advisor`、`date`、`school`、`subtitle`。
2. 封面只写一个一级标题，可用 `<br>` 合理分行。封面 `variant` 可选 `classic`、`green`、`photo`、`panorama`。
3. 每页用 `---` 分隔。需要布局时用两条 `---` 包裹 YAML。例如：

```md
---
layout: section
number: '01'
subtitle: BACKGROUND
---

# 研究背景
```

4. 版式：`default`（默认正文）、`toc`（有序列表）、`section`（章节）、`two-cols`、`image-left`、`image-right`、`figure`、`quote`、`center`、`end`；丰富正文可用 `sidebar`、`compare`、`steps`、`grid`、`focus`、`image-story`，接口见 [构图指南](LAYOUTS.md)。
5. `two-cols`：默认内容只放总标题，`::left::` 和 `::right::` 后分别填写两栏内容。每栏建议不超过 3 条简短要点。
6. `image-left` / `image-right`：`::title::` 后放一级标题，默认内容放文字，YAML 的 `image: /filename.png` 引用用户 `public/` 目录下的真实图片，写清 `imageAlt`、`caption`，默认 `fit: contain`。
7. `figure`：默认内容放标题，YAML 用 `image` 和 `caption`，或在 `::figure::` 后放图。图片缺失时用 `[待补充：所需图及来源]`，不得编造文件路径。
8. 正文页可写 `section` 和 `sectionNumber`，用于页眉。`quote` 使用 `author` 标注出处。`end` 可以重复填写 `presenter`、`advisor`，不会自动继承第一页的这些信息。
9. 数学用 `$...$` 或 `$$...$$`，代码用带语言名的代码块。每页末尾的 HTML 注释写讲稿。
10. `BitCallout`、`BitBarChart`、`BitTimeline`、`BitMetrics` 可按 README 的接口使用。数据组件必须基于用户提供的真实数据，不要把主题演示数据当成研究结果。

## 内容与排版

- 根据内容选择构图：问题用侧栏、方法比较用绿白对照、三步流程用 steps、四个短观点用 grid、公式或关键数字用 focus、照片叙事用 image-story。不要连续多页只排标题与列表。
- 标题可用 `titleStyle: plain / rail / band / classic`。统一报告的页眉与页脚，避免为了变化而随意更换学校标识；内容过长时拆页。
- 每页只讲一个明确主题，标题具体，避免“赋能”“全面升级”等空泛措辞。
- 正文建议不超过 5 条要点，每条尽量不超过两行。空间不足时拆页，不能通过缩小字体堆砌内容。
- 保留研究问题、方法、实验条件、结果、局限和引用之间的逻辑关系。
- 数字、样本量、单位、数据集划分、误差范围、文献作者和 DOI 必须来自提供的材料。
- 没有证据的内容写 `[待补充]`，不要补造实验、引用、日期或结论。
- 对照片、图表、借用定义提供可核对的来源，必要时在图注可见标注。
- 讲稿不要写模板制作过程，每页讲稿服务于该页内容。
- 目录链接请与实际页码一致，页数包含所有过渡页。
- 输出后检查 YAML、插槽名称、公式转义和所有图片路径，另列需要作者核对的缺失材料。

## 生成后检查与修正

- 在报告目录运行 `npm run check`；主题源码仓库中检查其他文件用 `npm run check -- 文件名.md`。需要已安装的 Chrome 时加 `--browser chrome`。
- 读取 `.slidev-check/<源稿名>/report.json` 和该目录下的逐页截图，修改对应页的源稿，再重新检查。
- 对越界、页脚重叠、图片缺失和目录不存在等错误必须修正。标题过长、内容块相交、目录名称不同等提醒要结合截图确认；确实有意保留时说明具体原因。
- 不通过隐藏正文、删除检查或缩小字体让报告通过。自动规则不核对论文事实、全部动画步骤和 PPTX 导出，仍要人工核查并在交付时说明验证范围。

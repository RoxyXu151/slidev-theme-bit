# 参与贡献

欢迎通过 Issue 反馈显示问题，或通过 Pull Request 提交版式、文档与示例改进。

1. 使用 Node.js 22.18 或以上，运行 `npm ci`。
2. 运行 `npm run dev` 检查完整主题，`npm run dev:starter` 检查起步稿。
3. 运行 `npm run build:site`、`npm run build:starter`、`npx playwright install chromium` 和 `npm test`。修改技能时运行 `npm run test:skill`，修改检查器时运行 `npm run test:checker`；用 `npm run check:paper` 检查完整论文示例。
4. 如修改版式或字体，检查全屏、演讲者视图和 PDF 中的中文换行及图片比例。使用 `npm run export:example` 导出核对。
5. 在 PR 中说明具体场景、变更和验证方法，视觉变化附修改前后截图。

请保留原模板设计者署名与素材来源。不要提交商业字体、来源不明的照片、真实学生个人信息或未经确认可以公开的研究材料。

新布局需在 `example.md` 展示，接口变化需同步 README 和 AI 提示词。请使用真实可读的中文示例，演示数据明确注明用途。

---
name: bit-slidev
description: Create and edit Beijing Institute of Technology (北京理工大学、北理工、BIT) academic presentations, thesis defenses, and research reports with slidev-theme-bit. Use when the user requests this university's Slidev template or invokes bit-slidev; not for unrelated universities or native PowerPoint editing.
---

# 北理工 Slidev 幻灯片

使用 `slidev-theme-bit` 交付可编辑的 Markdown 幻灯片及可运行的本地预览。根据用户要求交付网页构建或 PDF。技能目录可以位于任意位置，不能将其中的相对路径当成用户项目路径。

## 开始工作

- 先检查用户当前目录中的 `package.json`、`slides.md` 与项目指引，区分已有演示和新项目。现有项目就地编辑，保留自定义内容、依赖和用户选定的版式。
- 已在主题源码仓库中时，`slides.md` 是答辩起步稿，`example.md` 是主题展示；写报告时优先编辑起步稿。源码仓库使用 `theme: ./`，安装主题的独立项目使用 `theme: bit`。
- 新项目使用本技能的初始化脚本。将 `<skill-dir>` 替换成当前 `SKILL.md` 所在目录，目标目录按用户任务选择：

```bash
node "<skill-dir>/scripts/init_deck.mjs" "<project-dir>"
```

脚本只创建文件，不安装依赖或联网，目标目录非空时会拒绝写入。默认依赖已发布的 GitHub 主题安装包。已持有主题源码时，可加 `--theme "<theme-repo-dir>"` 复用本地主题。进入生成目录后执行 `npm install`，随后 `npm run dev`。

已有项目需要安装主题时，使用 `slidev-theme-bit` 的 GitHub 发布包或用户指定的版本，不要假定 npm 上的同名包就是本项目。初始化脚本中的依赖地址是可用的固定版本。

## 从材料到幻灯片

1. 从任务与材料提取用途、听众、时长、总页数、作者、学院、导师与日期。用户给定页数包含封面、目录、章节和致谢。材料已足够时直接制作，未知信息保留 `[待补充]`；仅对影响交付的缺失要求提问。
2. 按论述需要组织研究背景、方法、实验、结论和局限。总页数服从用户要求，不机械套用固定章节或为凑页数添加内容。
3. 版式、插槽与组件接口见 [references/layouts.md](references/layouts.md)，需要写页时按需阅读。复用主题提供的结构，避免临时改动主题源码或引入依赖；用户要求新功能时再扩展。
4. 每页围绕一个明确主题，正文通常不超过五条要点。内容过长先精简或拆页，不靠缩小字体塞入。讲稿写在该页末尾的 HTML 注释中。
5. 数据、参考文献、实验结论和图片来源必须有材料依据。演示数据不能当成真实结果；缺图时保留说明，不能编造存在的文件或 DOI。

## 本主题容易用错的地方

- 画布为 16:9、1280×720；北理绿 `#006C39`，褐红 `#A13F3D`。默认使用经典页眉 `headerStyle: classic`，保持同一报告的正文页一致，除非用户指定其他风格。
- `two-cols` 的默认插槽放总标题，两栏分别写在 `::left::`、`::right::` 后。图文布局的默认插槽是正文，标题写在 `::title::` 后。
- 封面和致谢的 `presenter`、`advisor`、`date` 等信息来自各自页面，不自动继承第一页，应按需重复填写。
- 图片放在用户项目的 `public/` 中，用 `image: /filename.png` 引用，提供 `imageAlt` 和 `caption`。科研图默认 `fit: contain`，保留完整证据。
- 目录使用显式页码链接。增删过渡页后需重新核对跳转目标。
- 字体由系统提供，不下载或分发商业字体。Windows 优先微软雅黑，macOS 使用苹方，Linux 使用 Noto Sans CJK。

## 验证与交付

- 在演示项目中执行 `npm run build`，并在浏览器逐页检查中文换行、图像加载、文字边界和目录跳转。特别检查封面长标题、双栏与页眉编号。在主题源码仓库中，起步稿的构建命令是 `npm run build:starter`。
- 需要 PDF 时，先安装导出依赖 `npm install -D playwright-chromium`，再执行 `npx playwright install chromium` 和 `npm run export`。Linux 缺少系统依赖时使用 `npx playwright install --with-deps chromium`。导出后检查页数和实际页面，不把构建成功等同于排版正确。
- 若环境不能预览或导出，保留完整源文件，明确未完成的验证及具体原因，不声称已检查。
- 交付源文件位置、实际启动命令和用户要求的导出物，并标明仍需作者补充的材料。创建报告本身不表示用户要求公开发布，不自动推送用户报告或部署到 Pages。
- 这是非官方社区主题。保留韩宇（2019）的原模板设计署名和主题的 `NOTICE.md`，不要将学校标识或原模板素材重新声明为 MIT。初始化项目附带素材权利说明。

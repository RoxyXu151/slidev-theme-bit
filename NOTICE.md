# 来源与素材权利说明

本项目是面向北京理工大学学生的**非官方社区 Slidev 主题**，不代表北京理工大学发布、认证或背书。

## 设计来源

参考文件：《北京理工大学学术答辩 PPT 模板正式版.pptx》，362 页，16:9。

原模板第 1 页署名：**北京理工大学光电学院 18 级博士 韩宇，2019 年 5 月 10 日**。

第 1 页说明模板不收费，开放共享给所有北理人，欢迎传播分享。同时说明其参考了其他高校模板，使用了校园风景照片，并感谢原作者。该说明不是 MIT、CC0 等标准许可，也没有逐项确认照片、字体与标识的再许可范围。

本项目保留署名及来源，仅从原文件提取少量用于还原学校视觉风格的素材。原 PPT、内嵌字体、肖像、其他学校的照片和图标库不随本项目分发。用户提供的原文件保留在本地并由 `.gitignore` 排除。

## 分发素材清单

以下文件来自用户提供的 PPT 中的 `ppt/media/`。仅对两张照片进行等比例缩小和 WebP 编码，未重绘校徽或校名。

| 项目文件 | 原文件 | 用途 |
| --- | --- | --- |
| `assets/bit-logo.png` | `image2.png` | 彩色校徽与黑色校名 |
| `assets/bit-logo-white.png` | `image8.png` | 彩色校徽与白色校名 |
| `assets/bit-seal.png` | `image17.png` | 校徽原始素材 |
| `assets/tower-watermark.png` | `image1.png` | 原模板浅色塔楼装饰 |
| `assets/seal-watermark.png` | `image12.png` | 原模板浅色校徽装饰 |
| `assets/building.png` | `image35.png` | 原模板建筑插画 |
| `assets/campus.webp` | `image11.png` | 校园全景照片 |
| `assets/campus-building.webp` | `image46.jpeg` | 校园建筑照片 |

素材版权及标识权归各自权利人所有。**项目的 MIT 许可只覆盖新增代码与文档，不将上述素材或学校标识重新许可为 MIT**。使用学校标识应遵守学校要求，不得暗示官方背书。商业使用或与原模板共享目的不同的再分发，应向相应权利人确认授权。

如你是权利人并希望更正署名或移除素材，请通过本仓库 Issues 联系维护者。

## 论文阅读示例中的独立素材

`docs/attention/architecture.png` 来自 Vaswani et al. 的 *Attention Is All You Need*，arXiv:1706.03762v7 图 1，仅用于有署名的学术阅读示例。该图及原论文图表的权利不适用本项目的 MIT 许可。固定版本、许可依据与逐页来源见 [docs/attention/SOURCES.md](docs/attention/SOURCES.md)。

## 设计参数

原模板第 2 页标注绿色 RGB(0,108,57)、褐红 RGB(161,63,61)、深灰 RGB(63,63,63)、浅灰 RGB(162,162,162)，字体为微软雅黑与 Century Gothic。主题保留前两种主色，并提供系统中文字体回退，不分发商业字体、不依赖在线字体服务。

主题将多套模板中的常用结构改写为 Vue/CSS 版式，不逐页转换全部 362 页。示例中的数据明确标为演示用途。

# 根据内容选择构图

主题保留北理绿 `#006C39`、褐红 `#A13F3D`、校名比例和统一页眉页脚。正文可以随论述变化，不必每页都使用“加粗标题 + 红色短线”。所有文字、公式、表格和数字均可编辑。

## 原 PPT 与网页构图的对应

页码按用户提供的 362 页《北京理工大学学术答辩 PPT 模板正式版》计算，原设计为韩宇（2019）。这是对排版关系的适配，未将原幻灯片作为整页背景。

| 内容 | 建议布局 | 参考与变化 | 展示页 |
| --- | --- | --- | --- |
| 问题、贡献、结论 | `sidebar` | 原模板左侧色块、目录侧栏与正文区的主次关系 | [24](https://roxyxu151.github.io/slidev-theme-bit/24) |
| 基线与方法、两种观点 | `compare` | 第 75 页，绿白整块对照，中间连接箭头 | [21](https://roxyxu151.github.io/slidev-theme-bit/21) |
| 三步流程、三项贡献 | `steps` | 第 79 页，三栏观点与箭头，增加自动编号 | [22](https://roxyxu151.github.io/slidev-theme-bit/22) |
| 四个实验要素、四个短观点 | `grid` | 第 80 页，四宫格与绿色细边框 | [23](https://roxyxu151.github.io/slidev-theme-bit/23) |
| 关键公式、关键数字 | `focus` | 第 116 页的数字层级，整理为中央重点与下方解释 | [25](https://roxyxu151.github.io/slidev-theme-bit/25) |
| 场景、设备、项目背景照片 | `image-story` | 第 99 页，大幅照片与叠放的白色文字板 | [26](https://roxyxu151.github.io/slidev-theme-bit/26) |

科研架构图优先使用 `image-left`、`image-right` 或 `figure`，完整保留证据。`image-story` 更适合照片；文字板会遮住图片边缘，默认 `contain`，只有装饰照片才选择 `fit: cover`。

## 标题不再只有红色短线

```yaml
---
layout: two-cols
titleStyle: band
---
```

| `titleStyle` | 效果 |
| --- | --- |
| `classic` | 原有加粗标题与红色短线，保留旧稿默认 |
| `plain` | 无装饰标题，适合大图与整体构图 |
| `rail` | 左侧绿色竖线，适合流程和方法 |
| `band` | 绿色横向标题带，适合表格与双栏 |

也可写在第一页的 `themeConfig.titleStyle` 中。优先级：单页设置 → 全局设置 → 布局默认。新构图默认 plain 或 rail；侧栏的标题在绿色区域独立排版。标题设置不改变封面、章节页或引文内容的专属构图。

## 可复制的用法

以下示例用于主题源码仓库已有演示中的一个正文页；独立项目的第一页仍需 `theme: bit`。

### 侧栏

```md
---
layout: sidebar
eyebrow: RESEARCH QUESTION
---

# 研究问题

::summary::

一句话说明为什么这个问题值得研究。

::body::

## 已有工作的限制

[待补充：具体困难与文献依据]

## 本文的切入点

[待补充：采用什么机制解决上述问题]
```

### 绿白对照

```md
---
layout: compare
---

# 两种方法的核心差别

::left::

## 基线方法

[待补充：原有机制与适用条件]

::right::

## 本文方法

[待补充：具体改变及其证据]

::note::

[待补充：来源与比较口径]
```

### 三段与四宫格

`steps` 的默认插槽放总标题，三个内容分别写在 `::first::`、`::second::`、`::third::` 后，编号和箭头自动生成。`grid` 使用相同语法，并增加 `::fourth::`。两者都支持可选的 `::note::` 来源说明。

```md
---
layout: grid
---

# 实验的四个要素

::first::

## 数据

[待补充：来源与划分]

::second::

## 对照

[待补充：基线与比较条件]

::third::

## 指标

[待补充：单位与优劣方向]

::fourth::

## 环境

[待补充：硬件与关键配置]
```

### 公式聚焦

```md
---
layout: focus
---

# 一个核心公式

::focus::

$$
y = f(x;\theta)
$$

::explanation::

- **输入** [待补充：变量含义]
- **计算** [待补充：核心机制]
- **输出** [待补充：用途与边界]

::note::

[待补充：原式出处。这是语法示例，不是研究结果。]
```

`::explanation::` 中的三个列表项自动横排；也可写一段解释。将 `::focus::` 的公式替换为 `BitMetrics` 即为数字聚焦页，组件接口见中英文 README。

### 图文叠放

```md
---
layout: image-story
image: /lab.jpg
imageAlt: 实验场地照片
caption: '[待补充：照片来源]'
fit: cover
---

[待补充：围绕照片说明实验场景与条件]

::title::

# 实验场景
```

请先将真实照片放到 `public/lab.jpg`；也可用 `::image::` 插槽放本地图片。照片会和白色文字板适度叠放，不要在被文字板覆盖的边缘放重要信息。

完整 27 页展示见 [example.md](../example.md)。[attention.md](../attention.md) 展示同一篇论文如何组合这些布局。建议依据内容选择版式，同类信息保持一致；空间不足时精简或拆页，不通过缩小字号塞内容。

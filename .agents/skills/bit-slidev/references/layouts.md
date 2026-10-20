# 版式与组件接口

此参考对应 `slidev-theme-bit`，不是通用 Slidev 布局约定。根配置称为 headmatter，每页配置称为 frontmatter。页面用 `---` 分隔；需要配置时，使用两条 `---` 包围该页 YAML。

## 配置

```yaml
---
theme: bit
title: 论文题目
lang: zh-CN
presenter: 作者姓名
advisor: 导师姓名
school: 北京理工大学 · 学院名称
date: "待补充"
subtitle: 学位论文答辩
themeConfig:
  footer: 北京理工大学 · 学院名称
  motto: 德以明理　学以精工
  headerStyle: classic
  showPageNumber: true
---
```

在主题源码仓库编辑时将 `theme` 保持为 `./`。`themeConfig` 还支持 `primary`、`accent`，单页同名字段覆盖全局设置。单页 `footer: false` 隐藏页脚，`showPageNumber: false` 只隐藏页码。

## 布局选择

| 布局 | 适用内容 | 字段或插槽 |
| --- | --- | --- |
| `cover` | 开场封面 | `variant: classic / green / photo / panorama`，`presenter`、`advisor`、`school`、`date`、`subtitle` |
| `default` | 普通正文，非首页默认布局 | `section`、`sectionNumber` 显示在页眉 |
| `toc` | 有序列表目录 | 可用 `heading` 修改标题；列表项可链接到页码 |
| `section` | 章节过渡 | `number: '01'`、`subtitle`；`variant: light` 为浅色 |
| `two-cols` | 方法对比、问题与方案 | 默认插槽为总标题；`::left::`、`::right::` 为两栏 |
| `image-left` | 左图右文 | 默认插槽为正文；`::title::` 为标题；`image` 或 `::image::` 放图片 |
| `image-right` | 左文右图 | 同上 |
| `figure` | 大图、实验结果 | 默认插槽为标题；`image` 或 `::figure::` 放图 |
| `quote` | 引文、定义 | 默认插槽为引文；`author` 为来源 |
| `center` | 居中短文本、参考资料 | 默认插槽 |
| `end` | 致谢 | 与 `cover` 相同，重复填写需要显示的作者等字段 |

正文页眉可选 `classic`、`minimal`、`building`。除明确要求外，报告正文采用统一的 `classic`，不要为了演示选项而在报告中混用页眉。

## 双栏示例

```md
---
layout: two-cols
section: 研究方法
sectionNumber: '02'
---

# 方法与验证

::left::

## 方法设计

输入、输出与关键假设。

::right::

## 验证方案

对照设置与评价指标。
```

## 图文示例

```md
---
layout: image-right
image: /experiment.png
imageAlt: 实验平台结构
caption: 图 1 实验平台，作者拍摄
fit: contain
---

## 平台说明

填写与图像直接相关的实验条件。

::title::

# 实验平台
```

`caption`、`imageAlt`、`fit` 也适用于 `figure`。`contain` 保留全图，`cover` 会裁切，通常只用于装饰照片。封面 `photo`、`panorama` 默认有主题内置校园图，也可用 `image` 替换。

## 学术组件

```vue
<BitCallout title="主要发现">填写有证据支持的结论。</BitCallout>
<BitCallout title="局限" tone="accent">说明适用条件。</BitCallout>

<BitBarChart
  :items="[{ label: '方法 A', value: 72 }, { label: '方法 B', value: 88, accent: true }]"
  :max="100" unit="%" label="准确率对比"
>
  仅为接口演示的数据，不代表实验结果。
</BitBarChart>

<BitTimeline :items="[
  { date: '第一阶段', title: '文献调研', description: '界定研究问题。' },
  { date: '第二阶段', title: '实验验证', description: '验证研究假设。' }
]" />
```

条形图仅适合非负值，`max` 为显示上限，不能代替误差分析。时间轴通常使用 3–5 个阶段。公式使用 `$...$` 或 `$$...$$`，代码使用带语言名称的 Markdown 代码块。


## 丰富正文构图（v0.3 起）

原有布局继续可用。按内容选择版式，不必每页都使用不同样式；避免连续多页复用“标题 + 列表”。

| 布局 | 默认插槽 | 命名插槽 | 适用内容 |
| --- | --- | --- | --- |
| `sidebar` | 短标题，建议 4–12 字 | `::body::` 正文、`::summary::` 侧栏提要 | 问题、贡献、结论；`eyebrow` 可加英文眉题 |
| `compare` | 总标题 | `::left::` 绿底、`::right::` 白底、可选 `::note::` | 方法与基线、两个观点 |
| `steps` | 总标题 | `::first::`、`::second::`、`::third::`、可选 `::note::` | 三步流程或三项贡献，自动编号与箭头 |
| `grid` | 总标题 | `::first::`、`::second::`、`::third::`、`::fourth::`、可选 `::note::` | 四个短观点或实验要素 |
| `focus` | 总标题 | `::focus::` 核心公式/数字、`::explanation::` 解释、可选 `::note::` | 一个公式或 2–3 个关键数字 |
| `image-story` | 正文 | `::title::` 标题，`image` 或 `::image::` 图片 | 图片与文字板叠放；支持 `caption`、`imageAlt`、`fit` |

`titleStyle` 可在单页或 `themeConfig` 中设置：`classic`（红色短线，保留旧稿默认）、`plain`（无装饰）、`rail`（绿色竖线）、`band`（绿色标题带）。新构图默认使用 plain 或 rail；单页覆盖全局，全局覆盖布局默认。侧栏标题放在绿色区域，保持其独立样式。

```md
---
layout: compare
---

# 两种方法的核心差别

::left::

## 基线方法

说明相同条件下的原有机制。

::right::

## 改进方法

说明具体改变与验证证据。

::note::

[待补充：来源与适用条件]
```

`focus` 的 `::explanation::` 中可写三条带加粗短标题的列表，自动横向排列；也可放一段解释。不要放冗长推导。

```vue
<BitMetrics :items="[
  { value: '128', label: '样本量', detail: '演示数据' },
  { value: '86%', label: '指标示例', detail: '演示数据，非实验结果', accent: true }
]" />
```

`BitMetrics` 的数字、标签和说明保持可编辑；通常放 2–3 项，单位写入 value，原始来源写入页面 note。完整示例见主题仓库 `example.md` 第 21–26 页；`attention.md` 展示真实论文中的构图选择。

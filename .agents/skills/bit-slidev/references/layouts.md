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

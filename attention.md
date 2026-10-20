---
theme: ./
title: Attention Is All You Need 论文阅读
lang: zh-CN
school: 北京理工大学 · 论文阅读示例
subtitle: Vaswani et al. · NeurIPS 2017 · arXiv v7
themeConfig:
  footer: 北京理工大学 · Transformer 论文阅读
  headerStyle: classic
---

# Attention Is<br>All You Need

<!-- 建议12–15分钟。这是一份可直接修改的完整论文阅读示例，不是复现实验报告。论文发表于2017年，内容和数字固定依据arXiv:1706.03762v7（2023-08-02修订）。作者并非北理工师生；北理工是本演示采用的主题。图表与版本出处见docs/attention/SOURCES.md。 -->

---
layout: toc
---

1. [研究问题](3)
2. [Transformer 架构](5)
3. [实验设置](8)
4. [讨论与局限](12)

<!-- 路线：先解释注意力计算，再看编码器与解码器如何组合，最后区分翻译测试结果、开发集消融和自己的分析。 -->

---
layout: sidebar
eyebrow: RESEARCH QUESTION
section: 研究问题
sectionNumber: '01'
---

# 研究问题

::summary::

如何缩短序列中不同位置之间的计算路径？

::body::

## 从逐步计算到直接交互

- 循环网络需要沿序列逐步计算，限制训练并行性。
- 远距离位置的信息交互，需要经过较长计算路径。
- Transformer 用注意力连接不同位置，替代序列递归。

<BitCallout title="阅读主线">训练时的并行计算，与生成时逐词预测，需要分别理解。</BitCallout>

<p class="bit-note">来源：论文 §1–2。以下讲解为阅读整理，不包含新的实验结果。</p>

<!-- 从计算依赖理解动机：训练数据的目标序列已知，可以并行计算不同位置的表示；自回归推理时仍依赖已经生成的词。这两个阶段不应混淆。 -->

---
layout: focus
section: 注意力计算
sectionNumber: '02'
---

# 缩放点积注意力

::focus::

$$
\mathrm{Attention}(Q,K,V)=\mathrm{softmax}\!\left(\frac{QK^\top}{\sqrt{d_k}}\right)V
$$

::explanation::

- **Q / K** 用点积得到位置之间的匹配分数。
- **缩放与 softmax** 把分数转为归一化权重。
- **V** 按这些权重汇总信息，得到新的位置表示。

::note::

<p class="bit-note">来源：论文 §3.2.1，式 (1)。Q、K 的末维为 dₖ；softmax 沿 key 维度计算。</p>

<!-- 按矩阵维度读公式：若有n个query和m个key，QK转置得到n×m权重矩阵；乘m×dv的V后得到n×dv输出。缩放使高维点积的量级更稳定。不要把Q、K、V说成三个固定的自然语言词。 -->

---
layout: image-left
titleStyle: plain
section: Transformer 架构
sectionNumber: '02'
caption: 原论文图 1 · Vaswani et al., arXiv:1706.03762v7
---

<script setup>
import architecture from './docs/attention/architecture.png'
</script>

## 两个堆叠结构

- **编码器**：自注意力 + 逐位置前馈网络。
- **解码器**：掩码自注意力 + 交叉注意力 + 前馈网络。
- 每个子层配残差连接与 LayerNorm。

::title::

# Transformer 架构

::image::

<img :src="architecture" alt="原论文图1：左侧编码器、右侧解码器；解码器含掩码注意力及连接编码器输出的交叉注意力" style="height:420px;width:auto;max-width:100%;margin:auto;object-fit:contain" />

<!-- 图1直接从v7 PDF第3页裁出，未改动内容和比例。底座编码器/解码器各6层；交叉注意力的Q来自解码器，K/V来自编码器输出。原论文采用LayerNorm(x+Sublayer(x))，不能用后来的Pre-LN结构代替本图解释。图复用许可与署名见docs/attention/SOURCES.md。 -->

---
section: Transformer 架构
sectionNumber: '02'
layout: two-cols
titleStyle: rail
---

# 多头注意力：多个投影子空间并行计算

::left::

## 每个头分别计算

$$
\mathrm{head}_i=\mathrm{Attention}(QW_i^Q,KW_i^K,VW_i^V)
$$

将各头拼接后，再经输出投影。

::right::

## Base 模型的设置

- 模型维度：512。
- 注意力头数：8。
- 每头 key / value 维度：64。

<p class="bit-note">来源：论文 §3.2.2。多头表示不同的可学习投影，不预先指定每个头负责什么语义。</p>

<!-- 把多头理解为多个并行信息汇总过程。它们共享输入但投影不同；拼接后再混合输出。不能只凭某个注意力可视化就认定一个头具有稳定的语法角色。 -->

---
section: Transformer 架构
sectionNumber: '02'
layout: compare
---

# 位置与掩码：补充顺序，控制可见信息

::left::

## 正弦位置编码

输入表示由词嵌入与位置编码相加。

$$
PE_{(pos,2i)}=\sin\!\left(\frac{pos}{10000^{2i/d_{model}}}\right)
$$

奇数维使用相同频率的余弦函数。

::right::

## 解码器的因果掩码

- 屏蔽未来目标位置的注意力分数。
- 配合右移目标序列，避免训练时看到待预测答案。
- 推理时仍然逐步生成。

<p class="bit-note">来源：论文 §3.1、§3.2.3、§3.5。位置编码与因果掩码解决不同问题。</p>

<!-- 位置编码给模型位置线索；掩码约束能看到哪些位置，两者不能互相替代。讲解右移时可用“开始标记+已有目标词预测下一个词”的例子，不需要虚构注意力权重。 -->

---
layout: grid
section: 实验设置
sectionNumber: '03'
---

# 实验设置：四个复现要素

::first::

## 翻译任务

WMT 2014 英德与英法翻译。

::second::

## 训练语料

约 450 万 / 3600 万句对，分别对应英德与英法。

::third::

## 计算环境

8 张 NVIDIA P100 GPU。

::fourth::

## 训练时长

Base 约 12 小时；Big 约 3.5 天。

::note::

来源：论文 §5、表 2。时长仅对应原论文环境，不能直接作为当前硬件的速度。

<!-- 英德采用BPE、共享约37000词表；英法约32000 word-piece词表。原论文使用Adam与4000步warmup，base训练100K步、big训练300K步。 -->

---
section: 实验设置
sectionNumber: '03'
titleStyle: band
---

# 并行性优势，不等于所有长度都更省计算

| 层类型 | 每层计算复杂度 | 顺序操作数 | 最大路径长度 |
| --- | --- | --- | --- |
| 自注意力 | O(n²d) | O(1) | O(1) |
| 循环层 | O(nd²) | O(n) | O(n) |

<BitCallout title="如何解读">自注意力缩短跨位置路径；标准全注意力的 n² 项也带来长序列成本。</BitCallout>

<p class="bit-note">来源：论文表 1、§4。n 为序列长度，d 为表示维度；仅展示表中两类层。</p>

<!-- 这是结构分析，不是同硬件实测速度。论文指出n小于d时，自注意力的计算复杂度相对循环层更有利。生成过程也不能从O(1)顺序层内操作直接推断为一次输出完整句子。 -->

---
layout: sidebar
eyebrow: TRANSLATION RESULTS
section: 实验结果
sectionNumber: '03'
---

# 翻译结果

::summary::

统一读取 v7 表 2 的 newstest2014 测试集 BLEU；分数越高越好。

::body::

<BitMetrics :items="[
  { value: '28.4', label: 'Big · 英德 BLEU', detail: 'newstest2014' },
  { value: '41.8', label: 'Big · 英法 BLEU', detail: 'newstest2014', accent: true }
]" />

<BitBarChart :items="[
  { label: 'ConvS2S', value: 25.16 },
  { label: 'MoE', value: 26.03 },
  { label: 'Base', value: 27.3 },
  { label: 'Big', value: 28.4, accent: true }
]" :max="30" label="表2英德翻译BLEU比较" />

<!-- 来源：原论文arXiv v7表2。英法Base=38.1。英德Big比Base高1.1个BLEU分数点，不是准确率提高1.1%。表2英法Big=41.8，但§6.1正文有41.0的不同表述，本示例明确采用表2，不据此重新解释或修改原论文数据。 -->

---
layout: focus
section: 实验结果
sectionNumber: '03'
---

# 消融：更多注意力头不必然更好

::focus::

<BitMetrics :items="[
  { value: '24.9', label: '1 个头', detail: '每头 key / value 维度 512' },
  { value: '25.8', label: '8 个头 · Base', detail: '每头 key / value 维度 64' },
  { value: '25.4', label: '32 个头', detail: '每头 key / value 维度 16', accent: true }
]" />

::explanation::

这组设置支持多头的作用，但头数与每头维度同时变化，不能概括成“头越多越好”。

::note::

来源：论文表 3 (A)。数值为英德 newstest2013 **开发集 BLEU**，不能与前页测试集直接比较。

<!-- 表3还报告16头为25.8。本页选择1、8、32头作紧凑对比，不暗示完整搜索全部超参数。解读为阅读分析，需要控制维度与预算再讨论头数因果效应。 -->

---
layout: steps
section: 讨论与局限
sectionNumber: '04'
---

# 讨论与局限

::first::

## 长序列成本

标准全注意力的二次复杂度，仍带来内存与计算开销。

::second::

## 自回归推理

训练时的并行性，不消除生成时逐步预测的依赖。

::third::

## 证据范围

翻译与句法分析实验，不能直接代表所有任务。

::note::

依据：论文 §4、§6–7。“证据范围”为阅读分析；应分开检验表达能力、并行性和实际成本。

<!-- 讨论只以原论文为边界，不把后来的模型、长上下文算法或现代训练规模当成作者当年已经完成的结果。 -->

---
layout: sidebar
eyebrow: TAKEAWAY
section: 讨论与局限
sectionNumber: '04'
---

# 结论与参考

::summary::

用注意力组织序列内部交互。

::body::

## 一个结构上的改变

以自注意力组织序列内部交互，配合前馈网络、位置编码与编码器—解码器结构。

## 本示例的原始材料

Vaswani et al. **Attention Is All You Need.** NeurIPS 2017.

[arXiv 固定版本 v7](https://arxiv.org/abs/1706.03762v7) · [原始 PDF](https://arxiv.org/pdf/1706.03762v7)

<p class="bit-note">图表来源、数据口径及复用说明：仓库 docs/attention/SOURCES.md。所有数字均为论文报告，未执行复现。</p>

<!-- 完整作者：Ashish Vaswani, Noam Shazeer, Niki Parmar, Jakob Uszkoreit, Llion Jones, Aidan N. Gomez, Łukasz Kaiser, Illia Polosukhin。该示例用于学术阅读和模板使用教学。图1按原论文Google许可用于有署名的学术作品，未重新授权为MIT。 -->

---
layout: end
variant: green
subtitle: 论文阅读 · 欢迎讨论
---

# 感谢聆听<br>欢迎讨论

<!-- 讨论问题：在你的研究问题中，最重要的是减少顺序依赖，还是控制长序列成本？ -->

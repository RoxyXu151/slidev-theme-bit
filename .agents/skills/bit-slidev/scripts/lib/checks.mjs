// Runs in Chromium through page.evaluate. Keep this function self-contained.
export function inspectSlide(root) {
  const issues = []
  const bounds = root.getBoundingClientRect()
  const scale = bounds.width / 1280
  const tolerance = 3 * scale
  const visible = el => {
    const r = el.getBoundingClientRect()
    const style = getComputedStyle(el)
    return r.width > 0 && r.height > 0 && style.visibility !== 'hidden' && style.display !== 'none'
  }
  const text = el => (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 90)
  const add = (code, message, el, severity = 'error') => issues.push({ code, severity, message, text: text(el) })
  const main = root.querySelector('.bit-main, .bit-cover-content, .bit-toc-main, .bit-section-body') || root
  const footer = root.querySelector('.bit-footer')
  const bottom = footer ? footer.getBoundingClientRect().top - 6 * scale : bounds.bottom - 20 * scale
  const header = root.querySelector('.bit-header')
  const top = header ? header.getBoundingClientRect().bottom + 8 * scale : bounds.top
  const elements = [...main.querySelectorAll('h1,h2,h3,p,li,pre,table,figure,img,.bit-callout,.bit-timeline,.bit-bar-chart,.katex-display')].filter(visible)
  for (const el of elements) {
    const r = el.getBoundingClientRect()
    if (r.left < bounds.left - tolerance || r.right > bounds.right + tolerance || r.bottom > bounds.bottom + tolerance || r.top < bounds.top - tolerance)
      add('CANVAS_OVERFLOW', '内容超出幻灯片画布；请精简、拆页或调整布局。', el)
    else if (footer && r.bottom > bottom + tolerance)
      add('FOOTER_OVERLAP', '正文进入页脚安全区域；请拆页或减少内容。', el)
    else if (header && r.top < top - tolerance)
      add('HEADER_OVERLAP', '正文进入页眉区域。', el)
    if (el.scrollHeight > el.clientHeight + 4 && ['hidden', 'clip', 'auto', 'scroll'].includes(getComputedStyle(el).overflowY))
      add('CLIPPED_CONTENT', '内容被裁切或需要滚动，投影时无法完整显示。', el)
  }
  for (const img of [...root.querySelectorAll('img')].filter(visible)) {
    if (!img.complete || !img.naturalWidth)
      issues.push({ code: 'IMAGE_MISSING', severity: 'error', message: '图片无法加载；检查文件路径和 public/ 中的文件。', text: img.getAttribute('alt') || '', src: (img.getAttribute('src') || '').slice(0, 250) })
  }
  for (const h1 of [...main.querySelectorAll('h1')].filter(visible)) {
    const range = document.createRange()
    range.selectNodeContents(h1)
    const lines = []
    for (const rect of range.getClientRects()) {
      if (rect.height > 8 * scale && !lines.some(y => Math.abs(y - rect.top) < 5 * scale)) lines.push(rect.top)
    }
    if (lines.length > 2) add('TITLE_TOO_LONG', `标题超过两行（约 ${lines.length} 行）；建议缩短标题。`, h1, 'warning')
  }
  // Compare independent content blocks, excluding ancestor/descendant pairs.
  const blocks = [...main.querySelectorAll('h1,h2,h3,p,pre,table,figure,.bit-callout,.katex-display')].filter(visible)
  for (let i = 0; i < blocks.length; i++) {
    for (let j = i + 1; j < blocks.length; j++) {
      const a = blocks[i], b = blocks[j]
      if (a.contains(b) || b.contains(a)) continue
      const ar = a.getBoundingClientRect(), br = b.getBoundingClientRect()
      if (Math.min(ar.right, br.right) - Math.max(ar.left, br.left) > 6 * scale && Math.min(ar.bottom, br.bottom) - Math.max(ar.top, br.top) > 6 * scale)
        issues.push({ code: 'CONTENT_OVERLAP', severity: 'warning', message: '两个独立内容块相交，请结合截图确认。', text: `${text(a)} / ${text(b)}` })
    }
  }
  return {
    title: root.querySelector('h1')?.textContent?.trim() || '',
    section: root.querySelector('.bit-section-label')?.textContent?.trim() || '',
    issues,
    toc: [...root.querySelectorAll('.bit-toc-main a[href]')].map(a => ({ label: a.textContent.trim(), href: a.getAttribute('href') })),
  }
}

export function tocFindings(pages, baseUrl) {
  const issues = []
  const normalize = text => text.toLowerCase().replace(/[\s\p{P}\p{S}\d]/gu, '')
  for (const page of pages) {
    for (const link of page.toc || []) {
      const url = new URL(link.href, baseUrl)
      if (url.origin !== new URL(baseUrl).origin) continue
      const match = /(?:\/|#)(\d+)(?:[/?#].*)?$/.exec(url.hash || url.pathname)
      if (!match) {
        issues.push({ slide: page.slide, code: 'TOC_TARGET_UNKNOWN', severity: 'warning', message: '无法识别目录目标页，请人工确认。', text: link.label, href: link.href })
        continue
      }
      const target = pages.find(p => p.slide === Number(match[1]))
      if (!target) {
        issues.push({ slide: page.slide, code: 'TOC_OUT_OF_RANGE', severity: 'error', message: `目录指向第 ${match[1]} 页，但报告只有 ${pages.length} 页。`, text: link.label, href: link.href })
        continue
      }
      const label = normalize(link.label)
      const targets = [target.title, target.section].map(normalize).filter(Boolean)
      if (label && !targets.some(t => t.includes(label) || label.includes(t)))
        issues.push({ slide: page.slide, code: 'TOC_LABEL_MISMATCH', severity: 'warning', message: `目录文字与第 ${target.slide} 页的标题/章节不一致，请确认是否链接错页。`, text: `${link.label} → ${target.title}`, href: link.href })
    }
  }
  return issues
}

const escape = text => String(text).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
export function reportHtml(report) {
  return `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>北理工报告检查</title>
<style>body{font:16px/1.7 system-ui,"Microsoft YaHei",sans-serif;color:#303b35;background:#f3f6f4;max-width:1200px;margin:36px auto;padding:0 24px}h1,h2,a{color:#006c39}article{background:white;padding:24px;margin:24px 0;border-left:4px solid #006c39}img{width:100%;max-width:960px;border:1px solid #dce6df}code{background:#eef2ef;padding:2px 5px}li{margin:8px 0}.error{color:#a13f3d}</style>
<h1>报告检查：${escape(report.entry.replace(/^.*[\\/]/, ''))}</h1><p>${report.totalSlides} 页 · ${report.errors} 项错误 · ${report.warnings} 项提醒</p><p>检查基于浏览器默认显示状态，不验证论文事实、全部动画步骤或 PPTX 导出。请继续人工检查截图。</p>
${report.pages.map(p => `<article><h2>第 ${p.slide} 页 · ${escape(p.title)}</h2><ul>${report.issues.filter(i => i.slide === p.slide).map(i => `<li class="${i.severity}"><code>${escape(i.code)}</code> ${escape(i.message)}<br>${escape(i.text || '')}</li>`).join('') || '<li>未发现规则覆盖范围内的问题。</li>'}</ul>${p.screenshot ? `<a href="${escape(p.screenshot)}"><img loading="lazy" src="${escape(p.screenshot)}" alt="第 ${p.slide} 页截图"></a>` : ''}</article>`).join('')}</html>`
}

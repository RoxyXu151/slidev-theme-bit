import { expect, test } from '@playwright/test'

// The showcase covers every shipped layout and the demonstrated style variants.
const slides = [
  ['bit-cover-classic', '北京理工大学'],
  ['bit-toc', '目录'],
  ['bit-section', '设计与版式'],
  ['bit-default', '熟悉的北理工视觉语言'],
  ['bit-cover-green', '纯绿封面'],
  ['bit-cover-photo', '校园照片封面'],
  ['bit-cover-panorama', '全景封面'],
  ['bit-section-light', '学术表达'],
  ['bit-two-cols', '两栏比较'],
  ['bit-default', '数学公式与代码'],
  ['bit-quote', '实事求是'],
  ['bit-image', '一张图'],
  ['bit-image', '反向排列'],
  ['bit-header-building', '表格中的实验设置'],
  ['bit-default', '数据图表'],
  ['bit-header-classic', '研究计划与进度'],
  ['bit-section', '写作与分享'],
  ['bit-default', 'Markdown 与 AI 协作'],
  ['bit-figure', '大图与图注'],
  ['bit-center', '参考资料'],
  ['bit-ending', '感谢各位老师'],
]

for (const [index, [layout, title]] of slides.entries()) {
  test(`slide ${index + 1}: ${layout}`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', error => errors.push(error.message))
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()) })
    await page.goto(`/${index + 1}`)
    const slide = page.locator(`#slide-content .slidev-page-${index + 1} .slidev-layout`)
    await expect(slide).toBeVisible()
    await expect(slide).toHaveClass(new RegExp(layout))
    await expect(slide).toContainText(title)
    await page.evaluate(() => document.fonts.ready)
    await expect.poll(async () => slide.locator('img').evaluateAll(images =>
      images.every(image => (image as HTMLImageElement).complete && (image as HTMLImageElement).naturalWidth > 0),
    )).toBe(true)
    // Content must fit the slide canvas; decorative backgrounds may extend.
    const overflow = await slide.evaluate(root => {
      const bounds = root.getBoundingClientRect()
      const candidates = root.querySelectorAll('h1, h2, h3, p, li, pre, table, .bit-cover-meta, .bit-image-copy, .bit-timeline, .bit-bar-chart')
      return [...candidates].flatMap(element => {
        const rect = element.getBoundingClientRect()
        if (!rect.width || !rect.height) return []
        return rect.bottom > bounds.bottom + 2 || rect.right > bounds.right + 2 || rect.left < bounds.left - 2
          ? [element.textContent?.slice(0, 70)] : []
      })
    })
    expect(overflow).toEqual([])
    expect(errors).toEqual([])
  })
}

test('TOC links navigate to the intended section', async ({ page }) => {
  await page.goto('/2')
  await page.locator('#slide-content').getByRole('link', { name: '学术表达' }).click()
  await expect(page).toHaveURL(/\/8$/)
})

test('timeline header matches other body slides at different display sizes', async ({ page }) => {
  for (const viewport of [{ width: 1280, height: 720 }, { width: 800, height: 450 }]) {
    await page.setViewportSize(viewport)
    await page.goto('/15')
    const reference = page.locator('#slide-content .slidev-page-15 .bit-section-marker')
    await expect(reference).toBeVisible()
    const markerStyles = (element: Element) => {
      const style = getComputedStyle(element)
      return ['height', 'min-width', 'margin-left', 'padding-left', 'font-size', 'background-color', 'border-right'].map(property => style.getPropertyValue(property))
    }
    const expectedStyles = await reference.evaluate(markerStyles)
    await page.goto('/16')
    const header = page.locator('#slide-content .slidev-page-16 .bit-header')
    await expect(header).toBeVisible()
    await expect(page.locator('#slide-content .slidev-page-16 .slidev-layout')).toHaveClass(/bit-header-classic/)
    await page.evaluate(() => document.fonts.ready)
    await expect(header.locator('.bit-section-marker')).toHaveText('03')
    expect(await header.locator('.bit-section-marker').evaluate(markerStyles)).toEqual(expectedStyles)
    const geometry = await header.evaluate(element => {
      const marker = element.querySelector('.bit-section-marker')!
      const label = element.querySelector('.bit-section-label')!
      const badge = marker.getBoundingClientRect()
      const title = label.getBoundingClientRect()
      const range = document.createRange()
      range.selectNodeContents(marker)
      const text = range.getBoundingClientRect()
      return {
        textFits: text.top >= badge.top && text.bottom <= badge.bottom && text.left >= badge.left && text.right <= badge.right,
        aligned: Math.abs((badge.top + badge.bottom - title.top - title.bottom) / 2) < 1,
        separated: badge.right < title.left,
      }
    })
    expect(geometry).toEqual({ textFits: true, aligned: true, separated: true })
  }
})

test('formula, code and data components remain structured', async ({ page }) => {
  await page.goto('/10')
  await expect(page.locator('#slide-content .katex').first()).toBeVisible()
  await expect(page.locator('#slide-content pre')).toContainText('empirical_risk')
  await page.goto('/15')
  await expect(page.locator('#slide-content .bit-bar-row')).toHaveCount(3)
  await expect(page.locator('#slide-content .bit-bar-chart')).toContainText('演示数据')
  await page.goto('/16')
  await expect(page.locator('#slide-content .bit-timeline > li')).toHaveCount(4)
})

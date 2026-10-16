import { computed, reactive, unref } from 'vue'
import { useSlideContext } from '@slidev/client'

/** Per-slide options override deck-wide themeConfig, including false and ''. */
export function useBitTheme() {
  const context = reactive(useSlideContext())
  const options = computed(() => ({
    footer: '北京理工大学',
    motto: '德以明理　学以精工',
    showPageNumber: true,
    headerStyle: 'classic',
    ...context.$slidev.themeConfigs,
    ...unref(context.$frontmatter),
  }))
  return { options, context }
}

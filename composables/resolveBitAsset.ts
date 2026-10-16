/** Public-directory images must follow Vite's deployment base (e.g. Pages). */
export function resolveBitAsset(source: string) {
  if (source.startsWith('/') && !source.startsWith('//'))
    return `${import.meta.env.BASE_URL}${source.slice(1)}`
  return source
}

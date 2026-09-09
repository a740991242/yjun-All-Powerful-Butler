/** Resolve public assets under both localhost and GitHub Pages project paths. */
export function publicAsset(path: string) {
  return `${import.meta.env.BASE_URL}${path.replace(/^\/+/, '')}`;
}

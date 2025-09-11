export const nextSlugToWpSlug = (nextSlug: string | string[]) =>
  nextSlug && Array.isArray(nextSlug) ? nextSlug.join("/") : nextSlug ?? "/";

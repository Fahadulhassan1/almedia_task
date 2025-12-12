/**
 * Generates a URL-friendly slug from a string
 * @param text The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function generateSlug(text: string): string {
  if (!text) {
    return '';
  }

  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/[^\w\-]+/g, '') // Remove non-word characters except hyphens
    .replace(/\-\-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+/, '') // Remove leading hyphens
    .replace(/-+$/, ''); // Remove trailing hyphens
}


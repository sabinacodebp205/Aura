/**
 * Returns a fully-qualified absolute URL for an image path or string.
 * Returns null when the URL is missing, empty, or invalid — the caller
 * should handle null gracefully (e.g. render an empty placeholder box).
 */
export function getImageUrl(url) {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return null;
  }

  const cleanUrl = url.trim();

  if (
    cleanUrl.startsWith('http://') ||
    cleanUrl.startsWith('https://') ||
    cleanUrl.startsWith('data:') ||
    cleanUrl.startsWith('blob:')
  ) {
    return cleanUrl;
  }

  const rawApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5083/api';
  const baseUrl = rawApiUrl.replace(/\/api\/?$/, '');

  const relative = cleanUrl.startsWith('/') ? cleanUrl : `/${cleanUrl}`;
  return `${baseUrl}${relative}`;
}

/**
 * Event handler for img onError — hides the broken image element
 * so the container's background (e.g. gray box) shows through cleanly.
 */
export function handleImageError(e) {
  e.target.style.display = 'none';
}

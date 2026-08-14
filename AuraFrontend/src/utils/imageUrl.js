export const PLACEHOLDER_IMAGE = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=85';

/**
 * Returns a fully-qualified absolute URL for an image path or string.
 * Handles null/undefined/empty by returning a fallback placeholder.
 * Handles relative paths by prepending the backend base URL.
 */
export function getImageUrl(url) {
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return PLACEHOLDER_IMAGE;
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
 * Event handler for img onError to fallback to PLACEHOLDER_IMAGE safely without infinite loops.
 */
export function handleImageError(e) {
  if (e.target.src !== PLACEHOLDER_IMAGE) {
    e.target.src = PLACEHOLDER_IMAGE;
  }
}

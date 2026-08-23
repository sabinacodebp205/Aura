const STORAGE_KEY = 'aura_recently_viewed';
const MAX_ITEMS = 20;

export function getRecentlyViewed() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.warn('Failed to parse recently viewed products from localStorage:', err);
    return [];
  }
}

export function addRecentlyViewed(product) {
  if (!product || !product.id) return;

  try {
    const current = getRecentlyViewed();
    // Remove if already exists to place at the beginning (deduplicate)
    const filtered = current.filter((item) => item && item.id !== product.id);

    // Save lightweight product summary
    const itemToSave = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrls?.[0] || product.image || product.imageUrl || '',
      categoryName: product.categoryName || product.category || '',
      rating: product.averageRating || product.rating || 5,
      viewedAt: Date.now(),
    };

    const updated = [itemToSave, ...filtered].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.warn('Failed to save recently viewed product to localStorage:', err);
  }
}

export function clearRecentlyViewed() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear recently viewed products:', err);
  }
}

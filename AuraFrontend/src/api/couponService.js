import client from './client';

export async function getActiveCampaign() {
  try {
    const res = await client.get('/coupon/active');
    return res.data;
  } catch (err) {
    console.warn('Failed to load active campaign coupon:', err);
    // Fallback default campaign
    return {
      code: 'AURA15',
      discountPercent: 15,
      description: '15% off luxury architectural streetwear',
      isActive: true,
    };
  }
}

export async function validateCoupon(code) {
  if (!code || !code.trim()) {
    return { isValid: false, message: 'Please enter a coupon code.' };
  }

  try {
    const res = await client.get(`/coupon/validate/${encodeURIComponent(code.trim())}`);
    return res.data;
  } catch (err) {
    console.warn('Failed to validate coupon on backend:', err);
    const normalized = code.trim().toUpperCase();
    if (normalized === 'AURA15') {
      return { isValid: true, code: 'AURA15', discountPercent: 15, description: '15% off discount' };
    }
    if (normalized === 'AURA10') {
      return { isValid: true, code: 'AURA10', discountPercent: 10, description: '10% off discount' };
    }
    if (normalized === 'WELCOME20') {
      return { isValid: true, code: 'WELCOME20', discountPercent: 20, description: '20% welcome discount' };
    }
    return { isValid: false, message: 'Invalid coupon code.' };
  }
}

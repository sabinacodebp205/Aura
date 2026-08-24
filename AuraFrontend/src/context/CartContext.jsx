/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { validateCoupon } from '../api/couponService';

const CartContext = createContext(null);

/* ---------- localStorage persistence (offline / guest fallback) ---------- */
const STORAGE_KEY = 'aura_cart';
const COUPON_KEY = 'aura_applied_coupon';

function loadLocal() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
}
function saveLocal(items) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* quota */ }
}

function loadCoupon() {
  try { return JSON.parse(localStorage.getItem(COUPON_KEY)) || null; } catch { return null; }
}
function saveCoupon(coupon) {
  try {
    if (coupon) localStorage.setItem(COUPON_KEY, JSON.stringify(coupon));
    else localStorage.removeItem(COUPON_KEY);
  } catch { /* quota */ }
}

/* ---------- helpers ---------- */
function itemTotal(item) {
  const fees = Array.isArray(item.fees) ? item.fees : [];
  const feeTotal = fees.reduce((sum, fee) => sum + fee.amount, 0);
  return item.unitPrice * item.quantity + feeTotal;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadLocal);
  const [appliedCoupon, setAppliedCoupon] = useState(loadCoupon);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [syncing, setSyncing] = useState(false);

  /* ---- listen for logout to reset state ---- */
  useEffect(() => {
    const handleLogout = () => {
      setItems([]);
      setAppliedCoupon(null);
      setActiveOrderId(null);
    };
    window.addEventListener('aura_logout', handleLogout);
    return () => window.removeEventListener('aura_logout', handleLogout);
  }, []);

  /* ---- persist to localStorage on change ---- */
  useEffect(() => { saveLocal(items); }, [items]);
  useEffect(() => { saveCoupon(appliedCoupon); }, [appliedCoupon]);

  const applyCoupon = async (code) => {
    const res = await validateCoupon(code);
    if (res.isValid) {
      const couponObj = {
        code: res.code,
        discountPercent: res.discountPercent,
        maxDiscountAmount: res.maxDiscountAmount,
        description: res.description,
      };
      setAppliedCoupon(couponObj);
      return { success: true, message: res.message || 'Coupon applied successfully!' };
    }
    return { success: false, message: res.message || 'Invalid coupon code.' };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const value = useMemo(() => {
    const addItem = (item) => {
      setItems((current) => {
        const existing = current.find(
          (ci) => ci.productId === item.productId && ci.size === item.size && ci.detail === item.detail,
        );
        if (existing) {
          return current.map((ci) =>
            ci.id === existing.id
              ? { ...ci, quantity: ci.quantity + (item.quantity || 1) }
              : ci,
          );
        }
        return [
          ...current,
          { ...item, id: item.id || `${item.productId}-${Date.now()}` },
        ];
      });
    };

    const removeItem = (itemId) => {
      setItems((current) => current.filter((i) => i.id !== itemId));
    };

    const updateQty = (itemId, quantity) => {
      setItems((current) =>
        current.map((i) =>
          i.id === itemId ? { ...i, quantity: Math.max(1, quantity) } : i,
        ),
      );
    };

    const incrementQty = (itemId) => {
      setItems((current) =>
        current.map((i) =>
          i.id === itemId ? { ...i, quantity: i.quantity + 1 } : i,
        ),
      );
    };

    const decrementQty = (itemId) => {
      setItems((current) =>
        current.map((i) =>
          i.id === itemId ? { ...i, quantity: Math.max(1, i.quantity - 1) } : i,
        ),
      );
    };

    const clearCart = () => {
      setItems([]);
      setAppliedCoupon(null);
    };

    /* ---- totals calculation with coupon discount ---- */
    const subtotal = items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );

    let discountAmount = 0;
    if (appliedCoupon && appliedCoupon.discountPercent > 0) {
      discountAmount = Math.round(subtotal * (appliedCoupon.discountPercent / 100) * 100) / 100;
      if (appliedCoupon.maxDiscountAmount && discountAmount > appliedCoupon.maxDiscountAmount) {
        discountAmount = appliedCoupon.maxDiscountAmount;
      }
    }

    const finalTotal = Math.max(0, subtotal - discountAmount);

    return {
      items,
      appliedCoupon,
      syncing,
      activeOrderId,
      addItem,
      removeItem,
      updateQty,
      incrementQty,
      decrementQty,
      clearCart,
      applyCoupon,
      removeCoupon,
      itemTotal,
      refetchCart: async () => {},
      totals: {
        products: subtotal,
        discountAmount,
        discountPercent: appliedCoupon?.discountPercent || 0,
        couponCode: appliedCoupon?.code || '',
        shipping: 0,
        total: finalTotal,
      },
    };
  }, [items, appliedCoupon, syncing, activeOrderId]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return context;
}

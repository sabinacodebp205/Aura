/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getAllOrders, createOrder } from '../api/orderService';
import { deleteOrderItem } from '../api/orderItemService';
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

function isLoggedIn() {
  return !!localStorage.getItem('jwt');
}

function mapBackendItem(backendItem) {
  return {
    id: backendItem.productId,
    productId: backendItem.productId,
    name: backendItem.productName,
    detail: '',
    quantity: backendItem.quantity,
    unitPrice: backendItem.price,
    fees: [],
    image: backendItem.imageUrl || '',
    alt: backendItem.productName,
    _fromBackend: true,
  };
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

  /* ---- on mount: fetch user pending order if logged in ---- */
  useEffect(() => {
    if (!isLoggedIn()) return;
    let cancelled = false;

    (async () => {
      try {
        setSyncing(true);
        const orders = await getAllOrders();
        const pending = orders
          .filter((o) => o.status === 0 || o.status === 'Pending')
          .sort((a, b) => (b.id > a.id ? 1 : -1))[0];

        if (pending && !cancelled) {
          setActiveOrderId(pending.id);
          const mapped = (pending.orderItems || []).map(mapBackendItem);
          setItems(mapped);
        }
      } catch (err) {
        console.warn('CartContext: could not fetch orders from backend, using local cart.', err);
      } finally {
        if (!cancelled) setSyncing(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  /* ---- re-fetch active order from backend ---- */
  const refetchCart = useCallback(async () => {
    if (!isLoggedIn()) return;
    try {
      const orders = await getAllOrders();
      const pending = orders
        .filter((o) => o.status === 0 || o.status === 'Pending')
        .sort((a, b) => (b.id > a.id ? 1 : -1))[0];
      if (pending) {
        setActiveOrderId(pending.id);
        setItems((pending.orderItems || []).map(mapBackendItem));
      } else {
        setActiveOrderId(null);
        setItems([]);
      }
    } catch (err) {
      console.warn('CartContext: refetch failed', err);
    }
  }, []);

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

      if (isLoggedIn()) {
        const orderItem = {
          productId: item.productId,
          quantity: item.quantity || 1,
        };

        (async () => {
          try {
            await createOrder({
              addressId: '00000000-0000-0000-0000-000000000000',
              couponCode: appliedCoupon?.code || null,
              orderItems: [orderItem],
            });
            await refetchCart();
          } catch (err) {
            console.warn('CartContext: failed to sync addItem to backend', err);
          }
        })();
      }
    };

    const removeItem = (itemId) => {
      const toRemove = items.find((i) => i.id === itemId);
      setItems((current) => current.filter((i) => i.id !== itemId));

      if (isLoggedIn() && toRemove?._fromBackend) {
        (async () => {
          try {
            await deleteOrderItem(toRemove.productId);
            await refetchCart();
          } catch (err) {
            console.warn('CartContext: failed to sync removeItem to backend', err);
            await refetchCart();
          }
        })();
      }
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
      applyCoupon,
      removeCoupon,
      itemTotal,
      refetchCart,
      totals: {
        products: subtotal,
        discountAmount,
        discountPercent: appliedCoupon?.discountPercent || 0,
        couponCode: appliedCoupon?.code || '',
        shipping: 0,
        total: finalTotal,
      },
    };
  }, [items, appliedCoupon, syncing, activeOrderId, refetchCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return context;
}

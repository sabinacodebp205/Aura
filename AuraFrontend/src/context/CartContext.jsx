/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { getAllOrders, createOrder } from '../api/orderService';
import { deleteOrderItem } from '../api/orderItemService';

const CartContext = createContext(null);

/* ---------- localStorage persistence (offline / guest fallback) ---------- */
const STORAGE_KEY = 'aura_cart';
function loadLocal() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; }
}
function saveLocal(items) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)); } catch { /* quota */ }
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

/**
 * Map a backend OrderItemGetDto to the shape CartItem/CartPage/OrderSummaryCard expect.
 *
 * Backend OrderItemGetDto:
 *   { productId, productName, price, quantity, imageUrl, designId }
 *
 * Frontend cart item shape (from data/cartItems.js):
 *   { id, productId, name, detail, quantity, unitPrice, fees[], image, alt }
 */
function mapBackendItem(backendItem) {
  return {
    id: backendItem.productId,           // use productId as the local identifier
    productId: backendItem.productId,
    name: backendItem.productName,
    detail: backendItem.designId ? 'Custom design applied' : '',
    quantity: backendItem.quantity,
    unitPrice: backendItem.price,
    fees: [],                             // backend doesn't separate fees
    image: backendItem.imageUrl || '',
    alt: backendItem.productName,
    designId: backendItem.designId ?? null,
    _fromBackend: true,
  };
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(loadLocal);
  const [activeOrderId, setActiveOrderId] = useState(null);
  const [syncing, setSyncing] = useState(false);

  /* ---- listen for logout to reset state ---- */
  useEffect(() => {
    const handleLogout = () => {
      setItems([]);
      setActiveOrderId(null);
    };
    window.addEventListener('aura_logout', handleLogout);
    return () => window.removeEventListener('aura_logout', handleLogout);
  }, []);

  /* ---- persist to localStorage on every change ---- */
  useEffect(() => { saveLocal(items); }, [items]);

  /* ---- on mount: fetch the user's pending order if logged in ---- */
  useEffect(() => {
    if (!isLoggedIn()) return;
    let cancelled = false;

    (async () => {
      try {
        setSyncing(true);
        const orders = await getAllOrders();
        // Treat the most recent Pending order as the "cart"
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

  const value = useMemo(() => {
    /* ---- addItem ---- */
    const addItem = (item) => {
      // Optimistic local update
      setItems((current) => {
        const existing = current.find(
          (ci) => ci.productId === item.productId && ci.detail === item.detail,
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

      // Backend sync (fire-and-forget, then refetch to reconcile)
      if (isLoggedIn()) {
        const orderItem = {
          productId: item.productId,
          quantity: item.quantity || 1,
          designId: item.designId ?? null,
        };

        (async () => {
          try {
            if (activeOrderId) {
              // There is no "add item to existing order" endpoint;
              // we can only create a new order. We'll create a one-item
              // order each time and let the user's orders accumulate,
              // OR we'd need a dedicated cart endpoint on the backend.
              // For now, create a new order per add-to-cart action.
              await createOrder({
                addressId: '00000000-0000-0000-0000-000000000000',
                orderItems: [orderItem],
              });
            } else {
              await createOrder({
                addressId: '00000000-0000-0000-0000-000000000000',
                orderItems: [orderItem],
              });
            }
            await refetchCart();
          } catch (err) {
            console.warn('CartContext: failed to sync addItem to backend', err);
          }
        })();
      }
    };

    /* ---- removeItem ---- */
    const removeItem = (itemId) => {
      const toRemove = items.find((i) => i.id === itemId);
      // Optimistic update
      setItems((current) => current.filter((i) => i.id !== itemId));

      if (isLoggedIn() && toRemove?._fromBackend) {
        (async () => {
          try {
            // The OrderItemGetDto doesn't have its own id, but productId
            // can be used to identify the item in the order item controller.
            // NOTE: This may not work as expected since deleteOrderItem
            // expects an OrderItem GUID which isn't exposed in OrderItemGetDto.
            // We attempt it but don't crash if it fails.
            await deleteOrderItem(toRemove.productId);
            await refetchCart();
          } catch (err) {
            console.warn('CartContext: failed to sync removeItem to backend', err);
            // Refetch to revert if needed
            await refetchCart();
          }
        })();
      }
    };

    /* ---- updateQty ---- */
    const updateQty = (itemId, quantity) => {
      setItems((current) =>
        current.map((i) =>
          i.id === itemId ? { ...i, quantity: Math.max(1, quantity) } : i,
        ),
      );
      // Backend doesn't support patching quantity on an existing order item
      // without the order item's own GUID (which isn't in OrderItemGetDto).
    };

    /* ---- incrementQty / decrementQty ---- */
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
          i.id === itemId
            ? { ...i, quantity: Math.max(1, i.quantity - 1) }
            : i,
        ),
      );
    };

    /* ---- totals ---- */
    const productsTotal = items.reduce(
      (sum, item) => sum + item.unitPrice * item.quantity,
      0,
    );
    const fees = items.flatMap((item) => (Array.isArray(item.fees) ? item.fees : []));
    const designFees = fees
      .filter((f) => /design/i.test(f.label))
      .reduce((s, f) => s + f.amount, 0);
    const embroidery = fees
      .filter((f) => /embroidery/i.test(f.label))
      .reduce((s, f) => s + f.amount, 0);

    return {
      items,
      syncing,
      activeOrderId,
      addItem,
      removeItem,
      updateQty,
      incrementQty,
      decrementQty,
      itemTotal,
      refetchCart,
      totals: {
        products: productsTotal,
        designFees,
        embroidery,
        shipping: 0,
        total: items.reduce((sum, item) => sum + itemTotal(item), 0),
      },
    };
  }, [items, syncing, activeOrderId, refetchCart]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return context;
}


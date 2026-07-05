import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import axios from 'axios';
import { toastSuccess, toastInfo } from '../utils/toast.js';
import { BASEURL } from '../utils/api.js';

const GUEST_CART_KEY  = "guestCart";
const CART_ADD_URL    = `${BASEURL}/api/add/cart/product/user`;
const CART_GET_URL    = `${BASEURL}/api/get/all/cart/product/user`;
const CART_REMOVE_URL = `${BASEURL}/api/remove/cart/product/user`;
const CART_MERGE_URL  = `${BASEURL}/api/merge/cart/product/user`;
const CART_CLEAR_URL  = `${BASEURL}/api/clear/cart/product/user`;

const getStoredToken = () =>
  localStorage.getItem('userToken') || sessionStorage.getItem('userToken');

const loadLocalCart = () => {
  try {
    const raw = localStorage.getItem(GUEST_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

// Build a merge payload from a local guest cart item.
// Works regardless of whether prices came as prices[] or priceInfo (getFiltered API).
const toGuestItem = (it) => {
  const isAcc = !!it.isAccessory;
  const pd    = (it.prices || []).find(p => p.country === 'IND')
             || (it.prices || [])[0]
             || it.priceInfo;
  return {
    productId:     !isAcc ? (it.productId || it._id) : undefined,
    accessoryId:    isAcc ? (it.accessoryId || it._id) : undefined,
    priceId:        it.priceId || pd?._id || it.priceInfo?._id,
    quantity:       it.qty || it.quantity || 1,
    selectedSize:   it.selectedSize || it.size  || '',
    selectedColor:  it.selectedColor || it.color || '',
  };
};

// Normalize a populated DB cart item → the shape the UI uses throughout.
const normalizeDbItem = (item) => {
  const prod  = item.productId   && typeof item.productId   === 'object' ? item.productId   : null;
  const acc   = item.accessoryId && typeof item.accessoryId === 'object' ? item.accessoryId : null;
  const price = item.priceId     && typeof item.priceId     === 'object' ? item.priceId     : null;

  const entityId   = prod?._id || acc?._id || item.productId || item.accessoryId;
  const name       = prod?.productName || acc?.accessoryName || '';
  // Pick the isDefault colour image (matches normalizeProduct in price.js)
  const defaultImg = prod?.colorImages?.find(c => c.isDefault) || prod?.colorImages?.[0];
  const img        = defaultImg?.thumbnail
                  || acc?.colorImages?.[0]?.accessoryThumbnail
                  || '';
  const sellingPrice = price?.sellingPrice || 0;

  return {
    id:           String(entityId),
    _id:          String(entityId),
    dbItemId:     String(item._id),       // cart subdoc _id — required for DB removal
    productId:    prod?._id  ? String(prod._id)  : undefined,
    accessoryId:  acc?._id   ? String(acc._id)   : undefined,
    priceId:      price?._id ? String(price._id) : String(item.priceId || ''),
    isAccessory:  !!acc,
    productName:  name,
    title:        name,
    name:         name,
    image:        img,
    price:        sellingPrice,
    prices:       price ? [price] : [],
    qty:           item.quantity || 1,
    quantity:      item.quantity || 1,
    selectedSize:  item.selectedSize  || '',
    selectedColor: item.selectedColor || '',
    size:          item.selectedSize  || '',
    color:         item.selectedColor || '',
  };
};

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems,  setCartItems]  = useState(loadLocalCart);

  // Always-current ref — lets addToCart / removeFromCart read live cartItems
  // without capturing a stale closure (and without listing cartItems as a dep,
  // which would make the callbacks unstable and cause consumer re-renders).
  const cartItemsRef = useRef(cartItems);
  useEffect(() => { cartItemsRef.current = cartItems; }, [cartItems]);

  // Guard: prevents two concurrent mergeGuestAndSync calls from both reading
  // the same guestCart and sending duplicate merge requests to the backend
  // (which would make the backend increment qty on the second request → qty 2).
  const mergingRef = useRef(false);

  // ── Persist cart to localStorage — GUEST ONLY ────────────────────────────
  // Logged-in users: DB is the source of truth. Writing DB items back to
  // guestCart causes them to be re-merged on the next login, doubling qty.
  useEffect(() => {
    if (!getStoredToken()) {
      localStorage.setItem(GUEST_CART_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems]);

  // ── Fetch populated DB cart and replace state ────────────────────────────
  const syncFromDb = useCallback(async (token) => {
    try {
      const res = await axios.get(CART_GET_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const dbItems = res.data?.data?.items;
      if (Array.isArray(dbItems) && dbItems.length > 0) {
        setCartItems(dbItems.map(normalizeDbItem));
        return true;
      }
      setCartItems([]);
      return false;
    } catch (err) {
      console.error('[Cart] DB fetch failed:', err?.response?.data || err?.message);
      return false;
    }
  }, []);

  // ── Core: merge guest cart → DB, then reload (Amazon/Flipkart behaviour) ─
  // Called on login AND on mount-when-already-logged-in.
  // Always merges regardless of whether DB already has items.
  const mergeGuestAndSync = useCallback(async (token) => {
    // Prevent concurrent executions — two simultaneous calls would both read
    // the same guestCart before either removes it, sending duplicate merge
    // requests and causing the backend to increment qty a second time.
    if (mergingRef.current) return;
    mergingRef.current = true;

    try {
      const local = loadLocalCart();
      const guestItems = local
        .map(toGuestItem)
        .filter(i => i.priceId && (i.productId || i.accessoryId));

      if (guestItems.length > 0) {
        // Remove guestCart BEFORE the API call so that any concurrent call
        // that wins the mergingRef race (unlikely but defensive) reads an
        // empty list and skips the merge entirely.
        localStorage.removeItem(GUEST_CART_KEY);

        try {
          await axios.post(CART_MERGE_URL, { guestItems }, {
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch (err) {
          console.error('[Cart] Guest merge failed:', err?.response?.data || err?.message);
          // Best-effort: re-store guest items so they are not silently lost.
          localStorage.setItem(GUEST_CART_KEY, JSON.stringify(local));
        }
      }

      await syncFromDb(token);
    } finally {
      mergingRef.current = false;
    }
  }, [syncFromDb]);

  // ── On mount: if already logged in, merge any lingering guest items ───────
  useEffect(() => {
    const token = getStoredToken();
    if (!token) return; // guest — state seeded from localStorage via useState(loadLocalCart)
    mergeGuestAndSync(token);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── After login: merge guest cart → DB, then show merged cart ────────────
  useEffect(() => {
    const onLogin = async (e) => {
      const token = e.detail?.token || getStoredToken();
      if (!token) return;
      await mergeGuestAndSync(token);
    };
    window.addEventListener('user-login', onLogin);
    return () => window.removeEventListener('user-login', onLogin);
  }, [mergeGuestAndSync]);

  // ── After logout: wipe cart state for the next (guest) session ───────────
  useEffect(() => {
    const onLogout = () => {
      setCartItems([]);
      localStorage.removeItem(GUEST_CART_KEY);
    };
    window.addEventListener('user-logout', onLogout);
    return () => window.removeEventListener('user-logout', onLogout);
  }, []);

  // ── addToCart ─────────────────────────────────────────────────────────────
  // Uses cartItemsRef (not closure) so the callback reference is STABLE —
  // it never changes between renders, preventing consumer components from
  // seeing a "new" addToCart after every cart update.
  const addToCart = useCallback((product) => {
    const itemId   = product._id || product.id || product.title;
    const existing = cartItemsRef.current.find(item => item.id === itemId);

    // Toast OUTSIDE setState updater: React StrictMode runs updaters twice,
    // which would fire the toast twice if placed inside.
    if (existing) {
      toastInfo('Quantity updated in cart 🛒', { autoClose: 2000 });
    } else {
      toastSuccess('Added to Cart 🛒', { autoClose: 2500 });
    }

    // Optimistic local update
    setCartItems(prev => {
      const ex = prev.find(item => item.id === itemId);
      if (ex) {
        return prev.map(item =>
          item.id === itemId ? { ...item, qty: (item.qty || 1) + 1 } : item
        );
      }
      return [...prev, { ...product, id: itemId, qty: 1 }];
    });

    // DB sync — logged-in users only; guests rely on the localStorage effect
    const token = getStoredToken();
    if (!token) return;

    const isAcc   = !!product.isAccessory;
    const pd      = (product.prices || []).find(p => p.country === 'IND')
                 || (product.prices || [])[0]
                 || product.priceInfo;
    const priceId = product.priceId || pd?._id || product.priceInfo?._id;

    if (!priceId) {
      console.warn('[Cart] DB sync skipped — no priceId for:', product._id || product.title);
      return;
    }

    const productId   = !isAcc ? (product.productId || product._id) : undefined;
    const accessoryId =  isAcc ? (product.accessoryId || product._id) : undefined;

    axios.post(CART_ADD_URL, {
      productId, accessoryId, priceId, quantity: 1,
      selectedSize:  product.selectedSize || product.size  || '',
      selectedColor: product.selectedColor || product.color || '',
    }, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        // Attach dbItemId so removeFromCart can target the exact subdoc in DB
        const cartDoc = res.data?.data;
        if (!cartDoc?.items) return;
        setCartItems(prev => prev.map(it => {
          if (it.id !== itemId || it.dbItemId) return it;
          const match = cartDoc.items.find(ci =>
            String(ci.priceId     || '') === String(priceId     || '') &&
            String(ci.productId   || '') === String(productId   || '') &&
            String(ci.accessoryId || '') === String(accessoryId || '')
          );
          return match ? { ...it, dbItemId: String(match._id) } : it;
        }));
      })
      .catch(err => {
        console.error('[Cart] DB add failed:', err?.response?.status, err?.response?.data || err?.message);
      });
  }, []); // Stable — reads live state via cartItemsRef, not stale closure

  // ── removeFromCart ────────────────────────────────────────────────────────
  const removeFromCart = useCallback((id) => {
    const item = cartItemsRef.current.find(i => i.id === id);
    toastInfo('Removed from Cart', { autoClose: 2000 });
    setCartItems(prev => prev.filter(i => i.id !== id));

    const token = getStoredToken();
    if (!token) return; // guest — localStorage handled by the persistence effect

    if (item?.dbItemId) {
      axios.post(CART_REMOVE_URL, { itemId: item.dbItemId }, {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(err => console.error('[Cart] DB remove failed:', err?.response?.data || err?.message));
    } else {
      // dbItemId not yet tracked (item added before this session) — re-sync
      syncFromDb(token);
    }
  }, [syncFromDb]); // Only syncFromDb needed; cartItems read via ref

  // ── updateQty — optimistic only; DB reconciled at checkout ───────────────
  const updateQty = useCallback((id, delta) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, qty: Math.max(1, (item.qty || 1) + delta) } : item
      )
    );
  }, []);

  // ── clearCart ─────────────────────────────────────────────────────────────
  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem(GUEST_CART_KEY);
    const token = getStoredToken();
    if (token) {
      axios.post(CART_CLEAR_URL, {}, { headers: { Authorization: `Bearer ${token}` } })
        .catch(err => console.error('[Cart] DB clear failed:', err?.response?.data || err?.message));
    }
  }, []);

  const openCart  = useCallback(() => setIsCartOpen(true),  []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);

  const cartCount = cartItems.reduce((sum, item) => sum + (item.qty || 1), 0);
  const cartTotal = cartItems.reduce((sum, item) => {
    const p = parseFloat(String(item.price || '0').replace(/[^\d.]/g, '')) || 0;
    return sum + p * (item.qty || 1);
  }, 0);

  return (
    <CartContext.Provider value={{
      cartItems, setCartItems,
      addToCart, removeFromCart, updateQty, clearCart,
      isCartOpen, openCart, closeCart,
      cartCount, cartTotal,
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};

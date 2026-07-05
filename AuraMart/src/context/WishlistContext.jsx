import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import axios from 'axios';
import { ApiUrl, getAuthToken } from '../utils/api.js';
import { toastSuccess, toastInfo, toastError } from '../utils/toast.js';
import { useAuth } from './AuthContext.jsx';

const GUEST_WL_KEY = 'guestWishlist';

const WishlistContext = createContext(null);

// ─── localStorage helpers ────────────────────────────────────────────────
const loadGuest = () => {
  try { return JSON.parse(localStorage.getItem(GUEST_WL_KEY) || '[]'); }
  catch { return []; }
};
const saveGuest = (items) => {
  localStorage.setItem(GUEST_WL_KEY, JSON.stringify(items));
};

// ─── Normalize a raw wishlist API response into { products, accessories } ─
const normalizeApiData = (data) => {
  if (!data) return { products: [], accessories: [] };
  if (Array.isArray(data)) {
    // old flat-array format fallback
    return { products: data, accessories: [] };
  }
  return {
    products:    Array.isArray(data.products)    ? data.products    : [],
    accessories: Array.isArray(data.accessories) ? data.accessories : [],
  };
};

// ─── Build the IDs Set from API items ───────────────────────────────────
const buildIdsFromApi = ({ products, accessories }) => {
  const ids = new Set();
  products.forEach(p => {
    const id = p.productId?._id || p.productId;
    if (id) ids.add(String(id));
  });
  accessories.forEach(a => {
    const id = a.accessoryId?._id || a.accessoryId;
    if (id) ids.add(String(id));
  });
  return ids;
};

// ─── Build the IDs Set from guest items ─────────────────────────────────
const buildIdsFromGuest = (guestItems) => {
  const ids = new Set();
  guestItems.forEach(g => {
    const id = g.productId || g.accessoryId;
    if (id) ids.add(String(id));
  });
  return ids;
};

// ─── Provider ────────────────────────────────────────────────────────────
export const WishlistProvider = ({ children }) => {
  const { isLoggedIn, token } = useAuth();
  const [wishlistIds,   setWishlistIds]   = useState(new Set());
  const [wishlistItems, setWishlistItems] = useState({ products: [], accessories: [] });
  const [loading,       setLoading]       = useState(false);
  const mergedRef = useRef(false); // prevent double-merge on token refresh

  // ── Fetch full wishlist from DB ────────────────────────────────────────
  const fetchFromDb = useCallback(async (tkn) => {
    try {
      const res = await axios.get(ApiUrl.getWishlist, {
        headers: { Authorization: `Bearer ${tkn}` },
      });
      const normalized = normalizeApiData(res.data?.data);
      setWishlistItems(normalized);
      setWishlistIds(buildIdsFromApi(normalized));
    } catch { /* silent */ }
  }, []);

  // ── On login: merge guest → DB, then fetch ────────────────────────────
  const mergeAndLoad = useCallback(async (tkn) => {
    setLoading(true);
    try {
      const guest = loadGuest();
      if (guest.length > 0) {
        try {
          await axios.post(
            ApiUrl.mergeWishlist,
            { guestItems: guest },
            { headers: { Authorization: `Bearer ${tkn}` } }
          );
          localStorage.removeItem(GUEST_WL_KEY);
        } catch { /* merge failed — still fetch */ }
      }
      await fetchFromDb(tkn);
    } finally {
      setLoading(false);
    }
  }, [fetchFromDb]);

  // ── Effect: react to login/logout ────────────────────────────────────
  useEffect(() => {
    if (isLoggedIn && token) {
      if (!mergedRef.current) {
        mergedRef.current = true;
        mergeAndLoad(token);
      } else {
        fetchFromDb(token);
      }
    } else {
      // Logged out — switch to guest mode
      mergedRef.current = false;
      const guest = loadGuest();
      setWishlistIds(buildIdsFromGuest(guest));
      // No full items for guest (no image/price without API)
      setWishlistItems({ products: [], accessories: [] });
    }
  }, [isLoggedIn, token]);

  // ── isWishlisted ──────────────────────────────────────────────────────
  const isWishlisted = useCallback(
    (id) => wishlistIds.has(String(id)),
    [wishlistIds]
  );

  // ── toggleWishlist ────────────────────────────────────────────────────
  const toggleWishlist = useCallback(async (item) => {
    if (!item) return;
    const id    = String(item._id || item.id || '');
    const isAcc = !!item.isAccessory;
    if (!id) return;

    if (wishlistIds.has(id)) {
      // ── Remove ──────────────────────────────────────────────────────
      setWishlistIds(prev => { const n = new Set(prev); n.delete(id); return n; });
      setWishlistItems(prev => ({
        products:    prev.products.filter(p => String(p.productId?._id || p.productId) !== id),
        accessories: prev.accessories.filter(a => String(a.accessoryId?._id || a.accessoryId) !== id),
      }));

      if (isLoggedIn && token) {
        try {
          const body = isAcc ? { accessoryId: id } : { productId: id };
          await axios.delete(ApiUrl.removeFromWishlist, {
            data: body,
            headers: { Authorization: `Bearer ${token}` },
          });
        } catch { /* silent */ }
      } else {
        const guest = loadGuest().filter(g => (g.productId || g.accessoryId) !== id);
        saveGuest(guest);
      }
      toastInfo('Removed from Wishlist 💔', { autoClose: 2500 });
    } else {
      // ── Add ─────────────────────────────────────────────────────────
      setWishlistIds(prev => new Set([...prev, id]));

      if (isLoggedIn && token) {
        try {
          const body = isAcc ? { accessoryId: id } : { productId: id };
          await axios.post(ApiUrl.addToWishlist, body, {
            headers: { Authorization: `Bearer ${token}` },
          });
          // Refresh to get full item data
          fetchFromDb(token);
        } catch { /* silent */ }
      } else {
        const guest = loadGuest();
        const entry = isAcc ? { accessoryId: id } : { productId: id };
        if (!guest.find(g => (g.productId || g.accessoryId) === id)) {
          guest.push(entry);
          saveGuest(guest);
        }
      }
      toastSuccess('Added to Wishlist ❤️', { autoClose: 2500 });
    }
  }, [wishlistIds, isLoggedIn, token, fetchFromDb]);

  // ── removeById (for wishlist page) ───────────────────────────────────
  const removeById = useCallback(async (id, isAcc = false) => {
    setWishlistIds(prev => { const n = new Set(prev); n.delete(String(id)); return n; });
    setWishlistItems(prev => ({
      products:    prev.products.filter(p => String(p.productId?._id || p.productId) !== String(id)),
      accessories: prev.accessories.filter(a => String(a.accessoryId?._id || a.accessoryId) !== String(id)),
    }));

    if (isLoggedIn && token) {
      try {
        const body = isAcc ? { accessoryId: id } : { productId: id };
        await axios.delete(ApiUrl.removeFromWishlist, {
          data: body,
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch { /* silent */ }
    } else {
      const guest = loadGuest().filter(g => (g.productId || g.accessoryId) !== String(id));
      saveGuest(guest);
    }
    toastInfo('Removed from Wishlist 💔', { autoClose: 2500 });
  }, [isLoggedIn, token]);

  const wishlistCount = wishlistIds.size;

  return (
    <WishlistContext.Provider value={{
      wishlistIds,
      wishlistItems,
      wishlistCount,
      loading,
      isWishlisted,
      toggleWishlist,
      removeById,
    }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used inside WishlistProvider');
  return ctx;
};

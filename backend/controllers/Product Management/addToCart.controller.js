import cartModel from "../../models/Product Management/addToCart.model.js";
import priceModel from "../../models/Product Management/price.model.js";
import productModel from "../../models/Product Management/product.model.js";
import accessoryModel from "../../models/Product Management/accessory.model.js";

// ─── helpers ───────────────────────────────────────────────────────────────
const itemsMatch = (a, b) =>
    String(a.productId  || '')  === String(b.productId  || '')  &&
    String(a.accessoryId || '') === String(b.accessoryId || '') &&
    String(a.priceId)           === String(b.priceId)           &&
    (a.selectedSize  || '') === (b.selectedSize  || '')         &&
    (a.selectedColor || '') === (b.selectedColor || '');

// ─── Add to Cart (requires auth) ─────────────────────────────────────────
export const addToCart = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'Login required to add to cart.' });

        const { productId, accessoryId, priceId, quantity = 1, selectedSize, selectedColor } = req.body;
        if (!productId && !accessoryId)
            return res.status(400).json({ success: false, message: 'productId or accessoryId is required.' });
        if (!priceId)
            return res.status(400).json({ success: false, message: 'priceId is required.' });

        const priceData = await priceModel.findById(priceId);
        if (!priceData) return res.status(400).json({ success: false, message: `Invalid priceId: ${priceId}` });

        if (productId && !(await productModel.findById(productId)))
            return res.status(400).json({ success: false, message: `Invalid productId: ${productId}` });
        if (accessoryId && !(await accessoryModel.findById(accessoryId)))
            return res.status(400).json({ success: false, message: `Invalid accessoryId: ${accessoryId}` });

        let cart = await cartModel.findOne({ userId });
        if (!cart) cart = new cartModel({ userId, items: [] });

        const newItem = { productId, accessoryId, priceId, quantity, selectedSize, selectedColor };
        const existing = cart.items.find(i => itemsMatch(i, newItem));
        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.items.push(newItem);
        }
        await cart.save();
        return res.status(200).json({ success: true, message: 'Item added to cart.', data: cart });
    } catch (err) {
        console.error('Add to Cart Error:', err);
        return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// ─── Get Cart (requires auth) ─────────────────────────────────────────────
export const getCart = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'Login required.' });

        const cart = await cartModel
            .findOne({ userId })
            .populate('items.productId')
            .populate('items.accessoryId')
            .populate('items.priceId');

        if (!cart) return res.status(200).json({ success: true, message: 'Cart is empty.', data: [], cartCount: 0, cartTotal: 0 });

        let cartTotal = 0;
        const items = cart.items.map(item => {
            const price = item.priceId?.sellingPrice || 0;
            const total = price * (item.quantity || 1);
            cartTotal += total;
            return { ...item.toObject(), totalForItem: total };
        });

        return res.status(200).json({
            success: true, message: 'Cart fetched.', cartCount: items.length, cartTotal,
            data: { ...cart.toObject(), items },
        });
    } catch (err) {
        console.error('Get Cart Error:', err);
        return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// ─── Remove Item from Cart (requires auth) ───────────────────────────────
export const removeFromCart = async (req, res) => {
    try {
        const userId = req.userId;
        const { itemId } = req.body;
        if (!userId) return res.status(401).json({ success: false, message: 'Login required.' });
        if (!itemId) return res.status(400).json({ success: false, message: 'itemId is required.' });

        const cart = await cartModel.findOne({ userId });
        if (!cart) return res.status(404).json({ success: false, message: 'Cart not found.' });

        const before = cart.items.length;
        cart.items = cart.items.filter(i => String(i._id) !== String(itemId));
        if (cart.items.length === before)
            return res.status(404).json({ success: false, message: 'Item not found in cart.' });

        await cart.save();
        return res.status(200).json({ success: true, message: 'Item removed from cart.', data: cart });
    } catch (err) {
        console.error('Remove Cart Error:', err);
        return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// ─── Clear Cart (requires auth) ───────────────────────────────────────────
export const clearCart = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'Login required.' });

        const cart = await cartModel.findOne({ userId });
        if (!cart) return res.status(404).json({ success: false, message: 'Cart not found.' });

        cart.items = [];
        await cart.save();
        return res.status(200).json({ success: true, message: 'Cart cleared.' });
    } catch (err) {
        console.error('Clear Cart Error:', err);
        return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// ─── Merge Guest Cart → User Cart (requires auth) ────────────────────────
// guestItems: [{ productId?, accessoryId?, priceId, quantity?, selectedSize?, selectedColor? }]
export const mergeCart = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'Login required to merge cart.' });

        const { guestItems } = req.body;
        if (!Array.isArray(guestItems) || guestItems.length === 0)
            return res.status(200).json({ success: true, message: 'No guest items to merge.' });

        let cart = await cartModel.findOne({ userId });
        if (!cart) cart = new cartModel({ userId, items: [] });

        for (const g of guestItems) {
            // Skip invalid items silently
            if (!g.priceId) continue;
            const existing = cart.items.find(i => itemsMatch(i, g));
            if (existing) {
                existing.quantity += g.quantity || 1;
            } else {
                cart.items.push({
                    productId:     g.productId   || undefined,
                    accessoryId:   g.accessoryId || undefined,
                    priceId:       g.priceId,
                    quantity:      g.quantity || 1,
                    selectedSize:  g.selectedSize  || '',
                    selectedColor: g.selectedColor || '',
                });
            }
        }
        await cart.save();
        return res.status(200).json({ success: true, message: 'Guest cart merged successfully.', data: cart });
    } catch (err) {
        console.error('Merge Cart Error:', err);
        return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

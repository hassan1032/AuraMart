import whislistModel from "../../models/Product Management/whislist.model.js";
import priceModel from "../../models/Product Management/price.model.js";

// ─── Add to Wishlist (requires auth) ────────────────────────────────────
export const addToWishlist = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'Login required.' });

        const { productId, accessoryId } = req.body;
        if (!productId && !accessoryId)
            return res.status(400).json({ success: false, message: 'productId or accessoryId is required.' });

        let wishlist = await whislistModel.findOne({ userId });
        if (!wishlist) wishlist = new whislistModel({ userId, products: [], accessories: [] });

        if (productId && !wishlist.products.some(p => p.productId.toString() === productId)) {
            wishlist.products.push({ productId });
        }
        if (accessoryId && !wishlist.accessories.some(a => a.accessoryId.toString() === accessoryId)) {
            wishlist.accessories.push({ accessoryId });
        }
        await wishlist.save();
        return res.status(200).json({ success: true, message: 'Added to wishlist.', data: wishlist });
    } catch (err) {
        console.error('Add Wishlist Error:', err);
        return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// ─── Get Wishlist (requires auth) ────────────────────────────────────────
export const getWishlist = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'Login required.' });

        const wishlist = await whislistModel
            .findOne({ userId })
            .populate('products.productId')
            .populate('accessories.accessoryId');

        if (!wishlist) return res.status(200).json({ success: true, message: 'Wishlist is empty.', data: { products: [], accessories: [] } });

        // Attach prices to each product
        const updatedProducts = await Promise.all(
            wishlist.products.filter(i => i.productId).map(async i => {
                const product = i.productId.toObject ? i.productId.toObject() : i.productId;
                product.prices = await priceModel.find({ productId: product._id });
                return { ...i.toObject(), productId: product };
            })
        );
        const updatedAccessories = await Promise.all(
            wishlist.accessories.filter(i => i.accessoryId).map(async i => {
                const acc = i.accessoryId.toObject ? i.accessoryId.toObject() : i.accessoryId;
                acc.prices = await priceModel.find({ accessoryId: acc._id });
                return { ...i.toObject(), accessoryId: acc };
            })
        );

        return res.status(200).json({
            success: true, message: 'Wishlist fetched.',
            data: { products: updatedProducts, accessories: updatedAccessories },
        });
    } catch (err) {
        console.error('Get Wishlist Error:', err);
        return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// ─── Remove from Wishlist (requires auth) ────────────────────────────────
export const removeFromWishlist = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'Login required.' });

        const { productId, accessoryId } = req.body;
        const wishlist = await whislistModel.findOne({ userId });
        if (!wishlist) return res.status(404).json({ success: false, message: 'Wishlist not found.' });

        if (productId) wishlist.products    = wishlist.products.filter(p => p.productId.toString() !== productId);
        if (accessoryId) wishlist.accessories = wishlist.accessories.filter(a => a.accessoryId.toString() !== accessoryId);

        await wishlist.save();
        return res.status(200).json({ success: true, message: 'Removed from wishlist.', data: wishlist });
    } catch (err) {
        console.error('Remove Wishlist Error:', err);
        return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// ─── Merge Guest Wishlist → DB (requires auth) ───────────────────────────
// guestItems: [{ productId? }, { accessoryId? }]
export const mergeWishlist = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'Login required.' });

        const { guestItems } = req.body;
        if (!Array.isArray(guestItems) || guestItems.length === 0)
            return res.status(200).json({ success: true, message: 'No guest wishlist items to merge.' });

        let wishlist = await whislistModel.findOne({ userId });
        if (!wishlist) wishlist = new whislistModel({ userId, products: [], accessories: [] });

        for (const item of guestItems) {
            if (item.productId && !wishlist.products.some(p => p.productId.toString() === item.productId)) {
                wishlist.products.push({ productId: item.productId });
            }
            if (item.accessoryId && !wishlist.accessories.some(a => a.accessoryId.toString() === item.accessoryId)) {
                wishlist.accessories.push({ accessoryId: item.accessoryId });
            }
        }
        await wishlist.save();
        return res.status(200).json({ success: true, message: 'Wishlist merged successfully.', data: wishlist });
    } catch (err) {
        console.error('Merge Wishlist Error:', err);
        return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

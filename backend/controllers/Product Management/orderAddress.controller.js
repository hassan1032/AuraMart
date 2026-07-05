import AddressModel from "../../models/Product Management/orderAddress.model.js";

// ─── Add Address (requires auth) ─────────────────────────────────────────
export const addAddress = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'Login required.' });

        const { name, contact, countryCode, addressLine, provinceState, postalCode, country, addressType, city, isDefault } = req.body;

        const missing = ['name', 'city', 'contact', 'addressLine', 'provinceState', 'postalCode', 'country'].find(k => !req.body[k]);
        if (missing) return res.status(400).json({ success: false, message: `${missing} is required.` });

        const existingAddresses = await AddressModel.find({ userId });
        // First address is always default
        const makeDefault = isDefault || existingAddresses.length === 0;
        if (makeDefault) await AddressModel.updateMany({ userId }, { $set: { isDefault: false } });

        const newAddress = await AddressModel.create({
            userId, name, contact, countryCode, addressLine,
            provinceState, postalCode, country, city, addressType,
            isDefault: makeDefault,
        });
        return res.status(201).json({ success: true, message: 'Address added successfully.', data: newAddress });
    } catch (err) {
        console.error('Add Address Error:', err);
        return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// ─── Get All Addresses (requires auth) ───────────────────────────────────
export const getAllAddresses = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) return res.status(401).json({ success: false, message: 'Login required.' });

        const addresses = await AddressModel.find({ userId }).sort({ isDefault: -1, createdAt: -1 });
        return res.status(200).json({ success: true, message: 'Addresses retrieved.', data: addresses });
    } catch (err) {
        console.error('Get Addresses Error:', err);
        return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// ─── Get Single Address (requires auth + ownership) ───────────────────────
export const getAddressById = async (req, res) => {
    try {
        const userId = req.userId;
        const { AddressId } = req.params;
        if (!userId) return res.status(401).json({ success: false, message: 'Login required.' });

        const address = await AddressModel.findById(AddressId);
        if (!address) return res.status(404).json({ success: false, message: 'Address not found.' });
        if (String(address.userId) !== String(userId))
            return res.status(403).json({ success: false, message: 'Access denied.' });

        return res.status(200).json({ success: true, message: 'Address retrieved.', data: address });
    } catch (err) {
        console.error('Get Address Error:', err);
        return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// ─── Update Address (requires auth + ownership) ───────────────────────────
export const updateAddress = async (req, res) => {
    try {
        const userId = req.userId;
        const { addressId } = req.params;
        if (!userId) return res.status(401).json({ success: false, message: 'Login required.' });

        const existing = await AddressModel.findById(addressId);
        if (!existing) return res.status(404).json({ success: false, message: 'Address not found.' });
        if (String(existing.userId) !== String(userId))
            return res.status(403).json({ success: false, message: 'Access denied.' });

        if (req.body.isDefault === true) {
            await AddressModel.updateMany({ userId }, { $set: { isDefault: false } });
        }
        // Prevent userId from being changed via body
        const { userId: _ignore, ...safeUpdate } = req.body;
        const updated = await AddressModel.findByIdAndUpdate(addressId, safeUpdate, { new: true, runValidators: true });
        return res.status(200).json({ success: true, message: 'Address updated.', data: updated });
    } catch (err) {
        console.error('Update Address Error:', err);
        return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

// ─── Delete Address (requires auth + ownership) ───────────────────────────
export const deleteAddress = async (req, res) => {
    try {
        const userId = req.userId;
        const { addressId } = req.params;
        if (!userId) return res.status(401).json({ success: false, message: 'Login required.' });

        const address = await AddressModel.findById(addressId);
        if (!address) return res.status(404).json({ success: false, message: 'Address not found.' });
        if (String(address.userId) !== String(userId))
            return res.status(403).json({ success: false, message: 'Access denied.' });

        await AddressModel.findByIdAndDelete(addressId);

        // If deleted address was default, make the most recent one default
        if (address.isDefault) {
            const next = await AddressModel.findOne({ userId }).sort({ createdAt: -1 });
            if (next) { next.isDefault = true; await next.save(); }
        }
        return res.status(200).json({ success: true, message: 'Address deleted.' });
    } catch (err) {
        console.error('Delete Address Error:', err);
        return res.status(500).json({ success: false, message: 'Server error.', error: err.message });
    }
};

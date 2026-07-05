
import orderModel from "../../models/Product Management/order.model.js";
import { createShipment, trackShipment } from "../../helpers/DHL.helper.js";
import { sendTrackingMail } from "../../helpers/mailer.helpers.js"

export const createDhlShipment = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await orderModel.findById(orderId);
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });

        const existingTracking = order.items.find((it) => it.trackingNumber);
        if (existingTracking)
            return res.status(400).json({
                success: false,
                message: "Shipment already created",
                trackingNumber: existingTracking.trackingNumber,
            });

        const result = await createShipment(order);
        if (!result.success || !result.trackingNumber)
            return res.status(500).json({ success: false, message: "Failed to create shipment", raw: result.raw });

        order.items.forEach((it) => (it.trackingNumber = result.trackingNumber));
        order.status = order.status === "pending" ? "processing" : order.status;
        await order.save();

        return res.status(200).json({
            success: true,
            message: "Shipment created successfully",
            trackingNumber: result.trackingNumber,
            order,
        });
    } catch (error) {
        console.error("createDhlShipment error:", error.message);
        return res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
export const getTrackingByOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        if (!orderId) return res.status(400).json({ success: false, message: "orderId required" });
        const order = await orderModel.findById(orderId);
        if (!order) return res.status(404).json({ success: false, message: "Order not found" });
        const trackingNumbers = [...new Set(order.items.map((it) => it.trackingNumber).filter(Boolean))];
        if (trackingNumbers.length === 0) {
            return res.status(404).json({ success: false, message: "No tracking number found for this order" });
        }
        const trackingNumber = trackingNumbers[0];
        const data = await trackShipment(trackingNumber);

        return res.status(200).json({ success: true, trackingNumber, data });
    } catch (err) {
        console.error("getTrackingByOrder error:", err?.response?.data ?? err.message);
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};
export const getTrackingByNumber = async (req, res) => {
    try {
        const { trackingNumber } = req.params;
        if (!trackingNumber) return res.status(400).json({ success: false, message: "trackingNumber required" });
        const data = await trackShipment(trackingNumber);
        return res.status(200).json({ success: true, trackingNumber, data });
    } catch (err) {
        console.error("getTrackingByNumber error:", err?.response?.data ?? err.message);
        return res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};
// Update Order Status ::
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const allowedStatus = ["confirmed", "on_the_way", "cancelled"];
        if (!allowedStatus.includes(status)) {
            console.warn("❌ Invalid status received:", status);
            return res.status(400).json({
                success: false,
                message: `Invalid status. Allowed values are: ${allowedStatus.join(", ")}`
            });
        }
        const order = await orderModel.findById(orderId);
        if (!order) {
            console.warn("⚠️ Order not found:", orderId);
            return res.status(404).json({ success: false, message: "Order not found" });
        }
        if (status === "confirmed") {
            const alreadyHasTracking = order.items.some(it => it.trackingNumber);
            if (!alreadyHasTracking) {
                const shipment = await createShipment(order);
                if (shipment?.trackingNumber) {
                    order.items.forEach(it => (it.trackingNumber = shipment.trackingNumber));
                    order.status = "confirmed";
                    await order.save();
                    const userEmail = order.customer?.email || order.shippingAddress?.email;
                    if (userEmail) {
                        console.log("📨 Sending tracking mail to:", userEmail);
                        try {
                            await sendTrackingMail(
                                userEmail,
                                order,
                                shipment.trackingNumber,
                                shipment.data?.shipments?.[0]?.estimatedTimeOfDelivery || "Not available"
                            );
                        } catch (emailErr) {
                            console.warn("⚠️ Failed to send tracking email:", emailErr.message);
                        }
                    } else {
                        console.warn("⚠️ No email found for this order’s customer or shipping address.");
                    }
                    return res.status(200).json({ success: true, message: status === "confirmed" ? "Order confirmed successfully. Tracking mail sent." : status === "cancelled" ? "Order has been cancelled successfully." : status === "on_the_way" ? "Order is now on the way to the customer." : `Order status updated to '${status}' successfully.`, trackingNumber: shipment?.trackingNumber || order?.items?.[0]?.trackingNumber || null, currentStatus: status, order, });

                } else {
                    console.warn("❌ No tracking number in DHL response:", shipment);
                    return res.status(500).json({ success: false, message: "Failed to create DHL shipment.", details: shipment?.raw ?? null, });
                }
            } else {
                console.log("ℹ️ Order already has tracking, skipping DHL call.");
                order.status = "confirmed";
                await order.save();
                return res.status(200).json({ success: true, message: "Order confirmed (tracking already exists).", order, });
            }
        }
        if (status === "cancelled") {
            console.log("🛑 Order cancelled by admin.");
            order.status = "cancelled";
            await order.save();
            return res.status(200).json({ success: true, message: "Order cancelled successfully.", order, });
        }
        console.log("🚚 Updating status manually to:", status);
        order.status = status;
        await order.save();
        return res.status(200).json({ success: true, message: `Order status updated to '${status}' successfully.`, order, });
    } catch (error) {
        console.error("💥 Update Order Status Error:", error);
        return res.status(500).json({ success: false, message: "Server error while updating order status.", error: error.message, });
    }
};


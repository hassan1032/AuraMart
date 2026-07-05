import orderModel from "../models/Product Management/order.model.js";
const generateOrderCode = async () => {
    const lastOrder = await orderModel.findOne().sort({ createdAt: -1 });
    if (!lastOrder || !lastOrder.orderCode) {
        return "NIC000001";
    }
    const lastNumber = parseInt(lastOrder.orderCode.replace("NIC", ""), 10);
    const nextNumber = lastNumber + 1;
    return "NIC" + String(nextNumber).padStart(6, "0");
};
export default generateOrderCode
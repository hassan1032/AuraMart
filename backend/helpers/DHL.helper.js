// ─── DHL removed — not used in this India-only project ────────────────────────

export const createShipment = async (order) => {
    return {
        success: true,
        trackingNumber: `IN${Date.now()}`,
        message: "Shipment tracking will be updated by the store.",
    };
};

export const trackShipment = async (trackingNumber) => {
    return {
        success: true,
        trackingNumber,
        shipments: [],
        message: "Tracking information will be updated by the store.",
    };
};

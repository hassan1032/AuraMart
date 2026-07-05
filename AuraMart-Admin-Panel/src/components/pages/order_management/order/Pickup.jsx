import React from "react";
import OrderListPage from "./OrderListPage";

const Pickup = () => (
  <OrderListPage title="Ready for Pickup" subtitle="Orders ready to be picked up by delivery" statusFilter="pickup" />
);

export default Pickup;

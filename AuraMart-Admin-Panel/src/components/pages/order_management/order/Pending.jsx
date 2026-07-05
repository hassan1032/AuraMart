import React from "react";
import OrderListPage from "./OrderListPage";

const Pending = () => (
  <OrderListPage title="Pending Orders" subtitle="Orders waiting to be confirmed" statusFilter="pending" />
);

export default Pending;

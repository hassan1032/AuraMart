import React from "react";
import OrderListPage from "./OrderListPage";

const Confirm = () => (
  <OrderListPage title="Confirmed Orders" subtitle="Orders confirmed and being prepared" statusFilter="confirmed" />
);

export default Confirm;

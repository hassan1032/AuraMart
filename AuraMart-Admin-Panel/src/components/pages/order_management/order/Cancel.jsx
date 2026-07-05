import React from "react";
import OrderListPage from "./OrderListPage";

const Cancel = () => (
  <OrderListPage title="Cancelled Orders" subtitle="Orders that have been cancelled" statusFilter="cancelled" />
);

export default Cancel;

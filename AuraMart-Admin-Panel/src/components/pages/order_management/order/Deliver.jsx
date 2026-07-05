import React from "react";
import OrderListPage from "./OrderListPage";

const Deliver = () => (
  <OrderListPage title="Delivered Orders" subtitle="Successfully delivered orders" statusFilter="delivered" />
);

export default Deliver;

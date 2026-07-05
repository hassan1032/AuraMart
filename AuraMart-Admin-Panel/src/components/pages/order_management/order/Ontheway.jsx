import React from "react";
import OrderListPage from "./OrderListPage";

const Ontheway = () => (
  <OrderListPage title="Out for Delivery" subtitle="Orders currently in transit" statusFilter="on_the_way" />
);

export default Ontheway;

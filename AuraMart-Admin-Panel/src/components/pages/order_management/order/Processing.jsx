import React from "react";
import OrderListPage from "./OrderListPage";

const Processing = () => (
  <OrderListPage title="Processing Orders" subtitle="Orders currently being packed" statusFilter="processing" />
);

export default Processing;

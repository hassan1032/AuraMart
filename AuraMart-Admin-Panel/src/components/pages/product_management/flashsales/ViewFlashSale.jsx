import React from "react";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../../ui/Card";
import { Table, Th, Td, TableEmpty } from "../../../ui/Table";
import { Badge } from "../../../ui/Badge";
import { Zap } from "lucide-react";

const ViewFlashSale = () => (
  <div className="space-y-6">
    <PageHeader
      title="Flash Deal Details"
      subtitle="View flash sale information and added products"
      breadcrumbs={[{ label: "Products" }, { label: "Flash Sales", href: "/admin/products/flash-sales" }, { label: "Details" }]}
    />

    <Card>
      <CardHeader>
        <CardTitle><div className="flex items-center gap-2"><Zap size={14} className="text-[#E63946]" /> Deal Information</div></CardTitle>
      </CardHeader>
      <CardBody>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Deal Name</p>
            <p className="text-sm font-medium text-gray-900">Glow Cosmetics</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Start Date</p>
            <p className="text-sm text-gray-700">2025-06-26 12:05:00</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">End Date</p>
            <p className="text-sm text-gray-700">2025-07-31 01:00:00</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Minimum Discount</p>
            <p className="text-sm text-gray-700">15%</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Publish Status</p>
            <button className="relative inline-flex h-5 w-9 items-center rounded-full transition-colors bg-[#E63946]">
              <span className="inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform translate-x-4.5" />
            </button>
          </div>
        </div>
      </CardBody>
    </Card>

    <Card>
      <CardHeader><CardTitle>Added Products</CardTitle></CardHeader>
      <CardBody className="p-0">
        <Table>
          <thead>
            <tr>
              <Th>SL</Th>
              <Th>Thumbnail</Th>
              <Th>Product Name</Th>
              <Th>Shop</Th>
              <Th className="text-center">Price</Th>
              <Th className="text-center">Quantity</Th>
            </tr>
          </thead>
          <tbody>
            <TableEmpty colSpan={6} message="No products added to this flash sale yet" />
          </tbody>
        </Table>
      </CardBody>
    </Card>
  </div>
);

export default ViewFlashSale;

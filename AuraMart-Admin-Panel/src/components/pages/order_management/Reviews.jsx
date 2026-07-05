import React from "react";
import { Star, MessageSquare } from "lucide-react";
import { PageHeader } from "../../ui/PageHeader";
import { Card, CardHeader, CardTitle } from "../../ui/Card";
import { Table, Th, Td, TableEmpty } from "../../ui/Table";

const Reviews = () => (
  <div className="space-y-6">
    <PageHeader
      title="Reviews"
      subtitle="Customer product reviews"
      breadcrumbs={[{ label: "Orders" }, { label: "Reviews" }]}
    />
    <Card>
      <CardHeader>
        <CardTitle>All Reviews</CardTitle>
      </CardHeader>
      <Table>
        <thead>
          <tr>
            <Th>Thumbnail</Th>
            <Th>Product Name</Th>
            <Th>Review</Th>
            <Th>Rating</Th>
            <Th className="text-center">Status</Th>
          </tr>
        </thead>
        <tbody>
          <TableEmpty message="No reviews yet" icon={<MessageSquare size={24} />} />
        </tbody>
      </Table>
    </Card>
  </div>
);

export default Reviews;

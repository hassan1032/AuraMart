import React from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, MapPin, Map } from "lucide-react";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardHeader, CardTitle } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import { Table, Th, Td } from "../../../ui/Table";
import { formatINR } from "../../../../lib/utils";

const SAMPLE = [{ id: 1, city: "Chennai", charge: 25 }, { id: 2, city: "Mumbai", charge: 50 }];

const ManageDelivery = () => (
  <div className="space-y-6">
    <PageHeader title="Delivery Charges" subtitle="Manage city-wise delivery pricing"
      breadcrumbs={[{ label: "Business" }, { label: "Delivery Charges" }]}
      action={
        <div className="flex items-center gap-2">
          <Link to="/admin/Business/delivery-charges/cities/cities">
            <Button variant="secondary" icon={<Map size={14} />}>Manage Cities</Button>
          </Link>
          <Link to="/admin/Business/delivery-charges/cities/create-new-delivery">
            <Button icon={<Plus size={15} />}>Add Charge</Button>
          </Link>
        </div>
      }
    />
    <Card>
      <CardHeader><CardTitle>All Delivery Charges</CardTitle></CardHeader>
      <Table>
        <thead>
          <tr><Th className="w-10">#</Th><Th>City</Th><Th className="text-right">Charge</Th><Th className="text-center">Actions</Th></tr>
        </thead>
        <tbody>
          {SAMPLE.map((row, i) => (
            <tr key={row.id}>
              <Td className="text-gray-400 text-xs">{i + 1}</Td>
              <Td className="font-medium text-gray-900 flex items-center gap-2"><MapPin size={13} className="text-gray-400" />{row.city}</Td>
              <Td className="text-right font-semibold">{formatINR(row.charge)}</Td>
              <Td>
                <div className="flex items-center justify-center gap-1">
                  <Link to="/admin/Business/delivery-charges/cities/edit-delivery-charge">
                    <Button size="icon-sm" variant="ghost" icon={<Pencil size={13} />} />
                  </Link>
                  <Button size="icon-sm" variant="ghost" icon={<Trash2 size={13} className="text-red-500" />} />
                </div>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Card>
  </div>
);

export default ManageDelivery;

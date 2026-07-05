import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, Search, Upload, MapPin } from "lucide-react";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardBody } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import { Table, Th, Td } from "../../../ui/Table";
import { SearchInput } from "../../../ui/SearchInput";

const CITIES = [
  { id: 1, country: "India", name: "Kerala" },
  { id: 2, country: "India", name: "Tamil Nadu" },
  { id: 3, country: "India", name: "Karnataka" },
  { id: 4, country: "India", name: "Maharashtra" },
  { id: 5, country: "India", name: "Delhi" },
];

const ManageCity = () => {
  const [search, setSearch] = useState("");
  const filtered = CITIES.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      <PageHeader title="Manage Cities" subtitle="Configure cities for delivery"
        breadcrumbs={[{ label: "Business" }, { label: "Delivery" }, { label: "Cities" }]}
        action={
          <div className="flex items-center gap-2">
            <Link to="/admin/business/delivery-charges/cities/import">
              <Button variant="secondary" icon={<Upload size={14} />}>Import</Button>
            </Link>
            <Link to="/admin/business/delivery-charges/cities/add-new-city">
              <Button icon={<Plus size={15} />}>Add City</Button>
            </Link>
          </div>
        }
      />

      <Card>
        <CardBody className="pb-0">
          <div className="flex justify-end mb-4">
            <SearchInput value={search} onChange={setSearch} placeholder="Search cities..." className="w-56" />
          </div>
        </CardBody>
        <Table>
          <thead>
            <tr><Th className="w-10">#</Th><Th>Country</Th><Th>City Name</Th><Th className="text-center">Actions</Th></tr>
          </thead>
          <tbody>
            {filtered.map((city, i) => (
              <tr key={city.id}>
                <Td className="text-gray-400 text-xs">{i + 1}</Td>
                <Td className="text-gray-600">{city.country}</Td>
                <Td><div className="flex items-center gap-2 font-medium text-gray-900"><MapPin size={13} className="text-gray-400" />{city.name}</div></Td>
                <Td>
                  <div className="flex items-center justify-center gap-1">
                    <Link to="/admin/business/delivery-charges/cities/edit-city">
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
};

export default ManageCity;

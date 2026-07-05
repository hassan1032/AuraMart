import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Plus, Pencil, Trash2, Box } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { request } from "../../../../api/request";
import { ApiEndpoints } from "../../../../api/apis";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardHeader, CardTitle } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import { Table, Th, Td, TableSkeleton, TableEmpty } from "../../../ui/Table";
import { Pagination } from "../../../ui/Pagination";
import { ConfirmModal } from "../../../ui/Modal";
import { truncate } from "../../../../lib/utils";

const LIMIT = 10;

const AccessoriesType = () => {
  const { hasPermission } = useAuth();
  const [accessories, setAccessories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [data, error] = await request({ method: "GET", url: ApiEndpoints.PRODUCTS_MANAGEMENT.ALL_ACCESSORY_TYPE });
      if (!error && Array.isArray(data?.data)) setAccessories(data.data);
      else if (error) toast.error("Failed to fetch accessory types");
      setLoading(false);
    })();
  }, []);

  const totalPages = Math.ceil(accessories.length / LIMIT);
  const paginated = accessories.slice((currentPage - 1) * LIMIT, currentPage * LIMIT);

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const [data, error] = await request({ method: "PUT", url: ApiEndpoints.PRODUCTS_MANAGEMENT.ACCESSORY_TYPE_STATUS, data: { id, status: newStatus } });
    if (error) toast.error("Failed to update status");
    else setAccessories(prev => prev.map(a => a._id === id ? { ...a, status: data?.data?.status || newStatus } : a));
  };

  const handleDelete = async () => {
    const [, error] = await request({ method: "DELETE", url: ApiEndpoints.PRODUCTS_MANAGEMENT.DELETE_ACCESSORY_TYPE(confirmId) });
    if (error) toast.error("Failed to delete");
    else { setAccessories(prev => prev.filter(a => a._id !== confirmId)); toast.success("Deleted"); }
    setConfirmId(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Accessory Types"
        subtitle="Manage categories of accessories"
        breadcrumbs={[{ label: "Catalog" }, { label: "Accessory Types" }]}
        action={
          hasPermission("Accessory Type", "create") && (
            <Link to="/admin/product/accessories-type/create">
              <Button icon={<Plus size={15} />}>Add Type</Button>
            </Link>
          )
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>All Types <span className="text-gray-400 font-normal text-sm">({accessories.length})</span></CardTitle>
        </CardHeader>
        <Table>
          <thead>
            <tr>
              <Th className="w-10">#</Th>
              <Th>Image</Th>
              <Th>Name</Th>
              <Th>Description</Th>
              <Th>Status</Th>
              <Th className="text-center">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? <TableSkeleton rows={5} cols={6} /> :
              paginated.length === 0 ? (
                <TableEmpty message="No accessory types yet" icon={<Box size={24} />}
                  action={<Link to="/admin/product/accessories-type/create"><Button size="sm" icon={<Plus size={13} />}>Add Type</Button></Link>} />
              ) :
              paginated.map((acc, i) => (
                <tr key={acc._id}>
                  <Td className="text-gray-400 text-xs">{(currentPage - 1) * LIMIT + i + 1}</Td>
                  <Td>
                    {acc.thumbnail ? (
                      <img src={acc.thumbnail} alt={acc.name} className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                        onError={e => { e.target.onerror = null; e.target.src = "/images/col8.jpg"; }} />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Box size={16} className="text-gray-400" />
                      </div>
                    )}
                  </Td>
                  <Td className="font-medium text-gray-900">{acc.name}</Td>
                  <Td className="text-gray-500 text-sm max-w-xs">{truncate(acc.description, 60) || "—"}</Td>
                  <Td>
                    <button
                      onClick={() => handleStatusToggle(acc._id, acc.status)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${acc.status === "active" ? "bg-[#E63946]" : "bg-gray-300"}`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${acc.status === "active" ? "translate-x-4.5" : "translate-x-0.5"}`} />
                    </button>
                  </Td>
                  <Td>
                    <div className="flex items-center justify-center gap-1">
                      {hasPermission("Accessory Type", "edit") && (
                        <Link to={`/admin/product/accessories-type/edit/${acc._id}`}>
                          <Button size="icon-sm" variant="ghost" icon={<Pencil size={13} />} />
                        </Link>
                      )}
                      {hasPermission("Accessory Type", "delete") && (
                        <Button size="icon-sm" variant="ghost" icon={<Trash2 size={13} className="text-red-500" />} onClick={() => setConfirmId(acc._id)} />
                      )}
                    </div>
                  </Td>
                </tr>
              ))
            }
          </tbody>
        </Table>
        {!loading && totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-100">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </Card>

      <ConfirmModal open={!!confirmId} onClose={() => setConfirmId(null)} onConfirm={handleDelete} title="Delete Accessory Type" message="This will permanently delete this accessory type." />
    </div>
  );
};

export default AccessoriesType;

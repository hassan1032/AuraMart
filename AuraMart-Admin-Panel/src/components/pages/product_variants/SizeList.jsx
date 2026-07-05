import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Plus, Pencil, Trash2, Ruler } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { request } from "../../../api/request";
import { ApiEndpoints } from "../../../api/apis";
import { PageHeader } from "../../ui/PageHeader";
import { Card, CardHeader, CardTitle } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { Table, Th, Td, TableSkeleton, TableEmpty } from "../../ui/Table";
import { Pagination } from "../../ui/Pagination";
import { ConfirmModal, Modal } from "../../ui/Modal";

const LIMIT = 10;

const SizeList = () => {
  const { hasPermission } = useAuth();
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmId, setConfirmId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [createName, setCreateName] = useState("");
  const [editForm, setEditForm] = useState({ _id: null, name: "" });

  const fetchSizes = async () => {
    setLoading(true);
    const [data, error] = await request({ method: "GET", url: ApiEndpoints.PRODUCT_VARIANT.ALL_SIZE });
    if (!error && Array.isArray(data?.data)) setSizes(data.data);
    else if (error) toast.error("Failed to fetch sizes");
    setLoading(false);
  };

  useEffect(() => { fetchSizes(); }, []);

  const totalPages = Math.ceil(sizes.length / LIMIT);
  const paginated = sizes.slice((currentPage - 1) * LIMIT, currentPage * LIMIT);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    fd.append("name", createName);
    const [, error] = await request({ method: "POST", url: ApiEndpoints.PRODUCT_VARIANT.ADD_SIZE, data: fd });
    if (error) toast.error(error.message || "Failed to create size");
    else { await fetchSizes(); toast.success("Size created"); setCreateOpen(false); setCreateName(""); }
    setSaving(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    fd.append("name", editForm.name);
    const [data, error] = await request({ method: "PUT", url: ApiEndpoints.PRODUCT_VARIANT.UPDATE_SIZE(editForm._id), data: fd });
    if (error) toast.error(error.message || "Failed to update");
    else {
      setSizes(prev => prev.map(s => s._id === data?.data?._id ? data.data : s));
      toast.success("Updated"); setEditOpen(false);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    const [, error] = await request({ method: "DELETE", url: ApiEndpoints.PRODUCT_VARIANT.DELETE_SIZE(confirmId) });
    if (error) toast.error("Failed to delete");
    else { setSizes(prev => prev.filter(s => s._id !== confirmId)); toast.success("Deleted"); }
    setConfirmId(null);
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const [data, error] = await request({ method: "PUT", url: ApiEndpoints.PRODUCT_VARIANT.SIZE_STATUS, data: { id, status: newStatus } });
    if (error) toast.error("Failed to update status");
    else setSizes(prev => prev.map(s => s._id === id ? { ...s, status: data?.data?.status || newStatus } : s));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Sizes"
        subtitle="Manage product size variants"
        breadcrumbs={[{ label: "Variants" }, { label: "Sizes" }]}
        action={
          hasPermission("Size", "create") && (
            <Button icon={<Plus size={15} />} onClick={() => setCreateOpen(true)}>Add Size</Button>
          )
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Size List <span className="text-gray-400 font-normal text-sm">({sizes.length})</span></CardTitle>
        </CardHeader>
        <Table>
          <thead>
            <tr>
              <Th className="w-10">#</Th>
              <Th>Name</Th>
              <Th>Status</Th>
              <Th className="text-center">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? <TableSkeleton rows={5} cols={4} /> :
              paginated.length === 0 ? <TableEmpty message="No sizes yet" icon={<Ruler size={24} />} /> :
              paginated.map((size, i) => (
                <tr key={size._id}>
                  <Td className="text-gray-400 text-xs">{(currentPage - 1) * LIMIT + i + 1}</Td>
                  <Td className="font-medium text-gray-900">{size.name}</Td>
                  <Td>
                    <button
                      onClick={() => handleStatusToggle(size._id, size.status)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${size.status === "active" ? "bg-[#E63946]" : "bg-gray-300"}`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${size.status === "active" ? "translate-x-4.5" : "translate-x-0.5"}`} />
                    </button>
                  </Td>
                  <Td>
                    <div className="flex items-center justify-center gap-1">
                      {hasPermission("Size", "edit") && (
                        <Button size="icon-sm" variant="ghost" icon={<Pencil size={13} />}
                          onClick={() => { setEditForm({ _id: size._id, name: size.name }); setEditOpen(true); }} />
                      )}
                      {hasPermission("Size", "delete") && (
                        <Button size="icon-sm" variant="ghost" icon={<Trash2 size={13} className="text-red-500" />} onClick={() => setConfirmId(size._id)} />
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

      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Add New Size" size="sm">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
            <input type="text" required value={createName} onChange={e => setCreateName(e.target.value)}
              placeholder="e.g. XL, 42, Free Size"
              className="w-full h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946]" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>Create</Button>
          </div>
        </form>
      </Modal>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Size" size="sm">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
            <input type="text" required value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
              className="w-full h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946]" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>Update</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal open={!!confirmId} onClose={() => setConfirmId(null)} onConfirm={handleDelete} title="Delete Size" message="This will permanently delete this size." />
    </div>
  );
};

export default SizeList;

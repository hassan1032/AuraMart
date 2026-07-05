import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Plus, Pencil, Trash2, Palette, X } from "lucide-react";
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

const ColorList = () => {
  const { hasPermission } = useAuth();
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmId, setConfirmId] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({ name: "", colour: "#000000" });
  const [editForm, setEditForm] = useState({ _id: null, name: "", colour: "#000000" });

  const fetchColors = async () => {
    setLoading(true);
    const [data, error] = await request({ method: "GET", url: ApiEndpoints.PRODUCT_VARIANT.ALL_COLOR });
    if (!error && Array.isArray(data?.data)) setColors(data.data);
    else if (error) toast.error("Failed to fetch colors");
    setLoading(false);
  };

  useEffect(() => { fetchColors(); }, []);

  const totalPages = Math.ceil(colors.length / LIMIT);
  const paginated = colors.slice((currentPage - 1) * LIMIT, currentPage * LIMIT);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("colour", form.colour);
    const [data, error] = await request({ method: "POST", url: ApiEndpoints.PRODUCT_VARIANT.ADD_COLOR, data: fd });
    if (error) toast.error(error.message || "Failed to create color");
    else { await fetchColors(); toast.success("Color created"); setCreateOpen(false); setForm({ name: "", colour: "#000000" }); }
    setSaving(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData();
    fd.append("name", editForm.name);
    fd.append("colour", editForm.colour);
    const [data, error] = await request({ method: "PUT", url: ApiEndpoints.PRODUCT_VARIANT.UPDATE_COLOR(editForm._id), data: fd });
    if (error) toast.error(error.message || "Failed to update");
    else {
      setColors(prev => prev.map(c => c._id === data?.data?._id ? data.data : c));
      toast.success("Updated"); setEditOpen(false);
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    const [, error] = await request({ method: "DELETE", url: ApiEndpoints.PRODUCT_VARIANT.DELETE_COLOR(confirmId) });
    if (error) toast.error("Failed to delete");
    else { setColors(prev => prev.filter(c => c._id !== confirmId)); toast.success("Deleted"); }
    setConfirmId(null);
  };

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const [data, error] = await request({ method: "PUT", url: ApiEndpoints.PRODUCT_VARIANT.COLOR_STATUS, data: { id, status: newStatus } });
    if (error) toast.error("Failed to update status");
    else setColors(prev => prev.map(c => c._id === id ? { ...c, status: data?.data?.status || newStatus } : c));
  };

  const openEdit = (color) => {
    setEditForm({ _id: color._id, name: color.name, colour: color.colour || "#000000" });
    setEditOpen(true);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Colors"
        subtitle="Manage product color variants"
        breadcrumbs={[{ label: "Variants" }, { label: "Colors" }]}
        action={
          hasPermission("Color", "create") && (
            <Button icon={<Plus size={15} />} onClick={() => setCreateOpen(true)}>Add Color</Button>
          )
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Color List <span className="text-gray-400 font-normal text-sm">({colors.length})</span></CardTitle>
        </CardHeader>
        <Table>
          <thead>
            <tr>
              <Th className="w-10">#</Th>
              <Th>Name</Th>
              <Th>Color</Th>
              <Th>Status</Th>
              <Th className="text-center">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? <TableSkeleton rows={5} cols={5} /> :
              paginated.length === 0 ? <TableEmpty message="No colors yet" icon={<Palette size={24} />} /> :
              paginated.map((color, i) => (
                <tr key={color._id}>
                  <Td className="text-gray-400 text-xs">{(currentPage - 1) * LIMIT + i + 1}</Td>
                  <Td className="font-medium text-gray-900">{color.name}</Td>
                  <Td>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-6 rounded border border-gray-200" style={{ background: color.colour }} />
                      <span className="text-xs text-gray-500 font-mono">{color.colour}</span>
                    </div>
                  </Td>
                  <Td>
                    <button
                      onClick={() => handleStatusToggle(color._id, color.status)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${color.status === "active" ? "bg-[#E63946]" : "bg-gray-300"}`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${color.status === "active" ? "translate-x-4.5" : "translate-x-0.5"}`} />
                    </button>
                  </Td>
                  <Td>
                    <div className="flex items-center justify-center gap-1">
                      {hasPermission("Color", "edit") && (
                        <Button size="icon-sm" variant="ghost" icon={<Pencil size={13} />} onClick={() => openEdit(color)} />
                      )}
                      {hasPermission("Color", "delete") && (
                        <Button size="icon-sm" variant="ghost" icon={<Trash2 size={13} className="text-red-500" />} onClick={() => setConfirmId(color._id)} />
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

      {/* Create Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Add New Color" size="sm">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
            <input type="text" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              placeholder="e.g. Navy Blue"
              className="w-full h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color <span className="text-red-500">*</span></label>
            <div className="flex items-center gap-3">
              <input type="color" required value={form.colour} onChange={e => setForm(p => ({ ...p, colour: e.target.value }))}
                className="w-16 h-9 rounded border border-gray-300 cursor-pointer p-0.5" />
              <div className="w-10 h-9 rounded-lg border border-gray-200" style={{ background: form.colour }} />
              <span className="text-sm text-gray-500 font-mono">{form.colour}</span>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setCreateOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>Create</Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Edit Color" size="sm">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
            <input type="text" required value={editForm.name} onChange={e => setEditForm(p => ({ ...p, name: e.target.value }))}
              className="w-full h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946]" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <div className="flex items-center gap-3">
              <input type="color" value={editForm.colour} onChange={e => setEditForm(p => ({ ...p, colour: e.target.value }))}
                className="w-16 h-9 rounded border border-gray-300 cursor-pointer p-0.5" />
              <div className="w-10 h-9 rounded-lg border border-gray-200" style={{ background: editForm.colour }} />
              <span className="text-sm text-gray-500 font-mono">{editForm.colour}</span>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>Update</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal open={!!confirmId} onClose={() => setConfirmId(null)} onConfirm={handleDelete} title="Delete Color" message="This will permanently delete this color." />
    </div>
  );
};

export default ColorList;

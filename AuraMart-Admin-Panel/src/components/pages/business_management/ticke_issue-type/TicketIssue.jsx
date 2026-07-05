import React, { useState } from "react";
import { toast } from "react-toastify";
import { Tag, Plus, Pencil, Trash2 } from "lucide-react";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardHeader, CardTitle } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import { Table, Th, Td, TableEmpty } from "../../../ui/Table";
import { Modal, ConfirmModal } from "../../../ui/Modal";

const INITIAL = [
  { id: 1, name: "Product Issue",    active: true },
  { id: 2, name: "Delivery Problem", active: true },
  { id: 3, name: "Payment Issue",    active: true },
];

const TicketIssue = () => {
  const [issues, setIssues]     = useState(INITIAL);
  const [addOpen, setAddOpen]   = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [name, setName]         = useState("");

  const openEdit = (item) => { setEditItem(item); setName(item.name); };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIssues(prev => [...prev, { id: Date.now(), name: name.trim(), active: true }]);
    toast.success("Issue type created");
    setName(""); setAddOpen(false);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIssues(prev => prev.map(i => i.id === editItem.id ? { ...i, name: name.trim() } : i));
    toast.success("Issue type updated");
    setEditItem(null); setName("");
  };

  const handleDelete = () => {
    setIssues(prev => prev.filter(i => i.id !== confirmId));
    toast.success("Issue type deleted");
    setConfirmId(null);
  };

  const toggleActive = (id) => {
    setIssues(prev => prev.map(i => i.id === id ? { ...i, active: !i.active } : i));
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Ticket Issue Types"
        subtitle="Define categories for customer support requests"
        breadcrumbs={[{ label: "Business" }, { label: "Issue Types" }]}
        icon={<Tag size={20} />}
        action={<Button icon={<Plus size={15} />} onClick={() => { setName(""); setAddOpen(true); }}>Create New</Button>}
      />

      <Card>
        <CardHeader>
          <CardTitle>All Issue Types <span className="text-[#6B7280] font-normal text-sm">({issues.length})</span></CardTitle>
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
            {issues.length === 0 ? (
              <TableEmpty message="No issue types defined" icon={<Tag size={22} />} />
            ) : (
              issues.map((item, i) => (
                <tr key={item.id}>
                  <Td className="text-[#6B7280] text-xs">{i + 1}</Td>
                  <Td className="font-medium text-[#2B2D42]">{item.name}</Td>
                  <Td>
                    <button
                      onClick={() => toggleActive(item.id)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${item.active ? "bg-[#E63946]" : "bg-gray-300"}`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${item.active ? "translate-x-4" : "translate-x-0.5"}`} />
                    </button>
                  </Td>
                  <Td>
                    <div className="flex items-center justify-center gap-1">
                      <Button size="icon-sm" variant="ghost" icon={<Pencil size={13} />} onClick={() => openEdit(item)} />
                      <Button size="icon-sm" variant="ghost" icon={<Trash2 size={13} className="text-red-500" />} onClick={() => setConfirmId(item.id)} />
                    </div>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>

      {/* Create modal */}
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Create Issue Type" size="sm">
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#2B2D42] mb-1.5">Name <span className="text-[#E63946]">*</span></label>
            <input
              autoFocus required value={name} onChange={e => setName(e.target.value)}
              placeholder="e.g. Delivery Problem"
              className="w-full h-10 px-3 border border-[#EAEAEA] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946]/30 focus:border-[#E63946] bg-white"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="secondary" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </Modal>

      {/* Edit modal */}
      <Modal open={!!editItem} onClose={() => setEditItem(null)} title="Edit Issue Type" size="sm">
        <form onSubmit={handleEdit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#2B2D42] mb-1.5">Name <span className="text-[#E63946]">*</span></label>
            <input
              autoFocus required value={name} onChange={e => setName(e.target.value)}
              className="w-full h-10 px-3 border border-[#EAEAEA] rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946]/30 focus:border-[#E63946] bg-white"
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="secondary" onClick={() => setEditItem(null)}>Cancel</Button>
            <Button type="submit">Update</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal open={!!confirmId} onClose={() => setConfirmId(null)} onConfirm={handleDelete} title="Delete Issue Type" message="This will permanently delete this issue category." />
    </div>
  );
};

export default TicketIssue;

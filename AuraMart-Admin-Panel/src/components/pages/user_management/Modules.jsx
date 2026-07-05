import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Plus, Trash2, Layers, X, Save } from "lucide-react";
import { request } from "../../../api/request";
import { ApiEndpoints } from "../../../api/apis";
import { PageHeader } from "../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { Table, Th, Td, TableSkeleton, TableEmpty } from "../../ui/Table";
import { Pagination } from "../../ui/Pagination";

const LIMIT = 10;

const Modules = () => {
  const [formData, setFormData] = useState({ name: "", actions: [] });
  const [actionInput, setActionInput] = useState("");
  const [allModules, setAllModules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(allModules.length / LIMIT);
  const paginated = allModules.slice((currentPage - 1) * LIMIT, currentPage * LIMIT);

  const fetchModules = async () => {
    setLoading(true);
    try {
      const [data, error] = await request({ method: "GET", url: ApiEndpoints.MODULE.GET_MODULE });
      if (error) throw new Error();
      if (data?.data) { setAllModules(data.data); setCurrentPage(1); }
    } catch { toast.error("Failed to fetch modules"); } finally { setLoading(false); }
  };

  useEffect(() => { fetchModules(); }, []);

  const handleAddAction = () => {
    const t = actionInput.trim();
    if (t && !formData.actions.some(a => a.toLowerCase() === t.toLowerCase())) {
      setFormData(p => ({ ...p, actions: [...p.actions, t] }));
      setActionInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) { toast.error("Module name is required"); return; }
    if (formData.actions.length === 0) { toast.error("At least one action is required"); return; }
    setLoading(true);
    try {
      const [data, error] = await request({ method: "POST", url: ApiEndpoints.MODULE.ADD_MODULE, data: { name: formData.name.trim(), actions: formData.actions } });
      if (error) throw new Error(error.message || "Failed");
      if (data?.data) { toast.success("Module added"); await fetchModules(); setFormData({ name: "", actions: [] }); setActionInput(""); }
    } catch (err) { toast.error(err.message || "Failed to add module"); } finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    try {
      const [, error] = await request({ method: "DELETE", url: ApiEndpoints.MODULE.DELETE_MODULE(id) });
      if (error) throw new Error();
      setAllModules(prev => prev.filter(m => m._id !== id));
      toast.success("Module deleted");
    } catch { toast.error("Failed to delete module"); }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Modules" subtitle="Define permission modules and their actions" breadcrumbs={[{ label: "Users" }, { label: "Modules" }]} />

      {/* Create Module Form */}
      <Card>
        <CardHeader>
          <CardTitle><div className="flex items-center gap-2"><Plus size={15} className="text-[#E63946]" /> Create Module</div></CardTitle>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Module Name</label>
                <input type="text" value={formData.name} onChange={e => setFormData(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Orders, Products"
                  className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946]" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Add Actions</label>
                <div className="flex gap-2">
                  <input type="text" value={actionInput} onChange={e => setActionInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); handleAddAction(); } }}
                    placeholder="e.g. create, edit, delete"
                    className="flex-1 h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946]" />
                  <Button type="button" variant="secondary" size="sm" onClick={handleAddAction} icon={<Plus size={13} />}>Add</Button>
                </div>
              </div>
            </div>
            {formData.actions.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.actions.map((action, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1.5 bg-[#FFF1F1] text-[#E63946] text-xs font-semibold px-2.5 py-1 rounded-full uppercase">
                    {action}
                    <button type="button" onClick={() => setFormData(p => ({ ...p, actions: p.actions.filter((_, i) => i !== idx) }))}
                      className="hover:text-red-500 transition-colors"><X size={11} /></button>
                  </span>
                ))}
              </div>
            )}
            <div className="flex justify-end">
              <Button type="submit" loading={loading} icon={<Save size={14} />}>Save Module</Button>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Module List */}
      <Card>
        <CardHeader>
          <CardTitle>Module List <span className="text-gray-400 font-normal text-sm">({allModules.length})</span></CardTitle>
        </CardHeader>
        <Table>
          <thead>
            <tr>
              <Th className="w-10">#</Th>
              <Th>Module</Th>
              <Th>Actions</Th>
              <Th className="text-center w-16">Delete</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? <TableSkeleton rows={4} cols={4} /> :
              paginated.length === 0 ? (
                <TableEmpty message="No modules yet" icon={<Layers size={24} />} />
              ) : paginated.map((mod, i) => (
                <tr key={mod._id}>
                  <Td className="text-gray-400 text-xs">{(currentPage - 1) * LIMIT + i + 1}</Td>
                  <Td><span className="font-semibold text-[#E63946] bg-[#FFF1F1] px-2 py-0.5 rounded text-sm uppercase">{mod.name}</span></Td>
                  <Td>
                    <div className="flex flex-wrap gap-1">
                      {mod.actions?.map((a, ai) => (
                        <span key={ai} className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-0.5 rounded uppercase">{a.name || a}</span>
                      ))}
                    </div>
                  </Td>
                  <Td className="text-center">
                    <Button size="icon-sm" variant="ghost" icon={<Trash2 size={13} className="text-red-500" />} onClick={() => handleDelete(mod._id)} />
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
    </div>
  );
};

export default Modules;

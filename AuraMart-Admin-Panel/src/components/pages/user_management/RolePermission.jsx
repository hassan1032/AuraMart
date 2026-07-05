import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Plus, Pencil, Trash2, ShieldCheck, UserX, RefreshCw } from "lucide-react";
import { request } from "../../../api/request";
import { ApiEndpoints } from "../../../api/apis";
import useDebounceSearch from "../../../hooks/useDebounceSearch";
import { PageHeader } from "../../ui/PageHeader";
import { Card, CardBody } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { Pagination } from "../../ui/Pagination";
import { Modal } from "../../ui/Modal";
import { SearchInput } from "../../ui/SearchInput";

const LIMIT = 10;

const RolePermission = () => {
  const [roles, setRoles] = useState([]);
  const [newRoleName, setNewRoleName] = useState({ roleName: "" });
  const [updateRole, setUpdateRole] = useState({ _id: "", roleName: "" });
  const [allModules, setAllModules] = useState([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [searchRole, setSearchRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedRoles, setPaginatedRoles] = useState([]);

  useEffect(() => {
    const start = (currentPage - 1) * LIMIT;
    setPaginatedRoles(roles.slice(start, start + LIMIT));
  }, [roles, currentPage]);

  useEffect(() => { getRoles(); fetchModules(); }, []);

  const getRoles = async () => {
    setLoading(true);
    try {
      const [data, error] = await request({ method: "GET", url: ApiEndpoints.ROLE.GET_ROLE });
      if (error) throw new Error();
      if (Array.isArray(data?.data)) { setRoles(data.data); setTotalPages(Math.ceil(data.data.length / LIMIT)); setCurrentPage(1); }
    } catch { toast.error("Failed to fetch roles"); } finally { setLoading(false); }
  };

  const fetchModules = async () => {
    setLoading(true);
    try {
      const [data, error] = await request({ method: "GET", url: ApiEndpoints.MODULE.GET_MODULE });
      if (error) throw new Error();
      if (data?.data) {
        setAllModules(data.data.map(mod => ({
          ...mod,
          actions: mod.actions.map(a => typeof a === "string" ? { name: a, allowed: false } : { ...a, allowed: a.allowed ?? false }),
        })));
      }
    } catch { setAllModules([]); } finally { setLoading(false); }
  };

  const handleCreateRole = async (e) => {
    e?.preventDefault();
    if (!newRoleName.roleName.trim()) { toast.error("Enter a role name"); return; }
    setLoading(true);
    try {
      const [data, error] = await request({ method: "POST", url: ApiEndpoints.ROLE.ADD_ROLE, data: { roleName: newRoleName.roleName } });
      if (error) throw new Error();
      if (data?.data) { setRoles(prev => [...prev, data.data]); setNewRoleName({ roleName: "" }); setIsCreateOpen(false); toast.success("Role created"); }
    } catch { toast.error("Role already exists"); } finally { setLoading(false); }
  };

  const handleUpdateRole = async () => {
    setLoading(true);
    try {
      const [data, error] = await request({ method: "PUT", url: ApiEndpoints.ROLE.UPDATE_ROLE(updateRole._id), data: { roleName: updateRole.roleName } });
      if (error) throw new Error();
      if (data?.data) { setRoles(prev => prev.map(r => r._id === updateRole._id ? { ...r, ...data.data } : r)); setIsUpdateOpen(false); toast.success("Role updated"); }
    } catch { toast.error("Failed to update role"); } finally { setLoading(false); }
  };

  const handleDeleteRole = async (id) => {
    setLoading(true);
    try {
      const [, error] = await request({ method: "DELETE", url: ApiEndpoints.ROLE.DELETE_ROLE(id) });
      if (error) throw new Error();
      setRoles(prev => prev.filter(r => r._id !== id));
      toast.success("Role deleted");
    } catch { toast.error("Failed to delete role"); } finally { setLoading(false); }
  };

  const handleUpdatePermission = async () => {
    setLoading(true);
    try {
      const payload = { permissions: allModules.map(m => ({ module: m._id, isVisible: m.actions.some(a => a.allowed), actions: m.actions.map(a => ({ name: a.name, allowed: a.allowed })) })) };
      const [, error] = await request({ method: "PUT", url: ApiEndpoints.ROLE.UPDATE_PERMISSION(updateRole._id), data: payload });
      if (error) throw new Error();
      toast.success("Permissions updated");
    } catch { toast.error("Failed to update permissions"); } finally { setLoading(false); }
  };

  const handleSearch = useMemo(() =>
    useDebounceSearch(async (value) => {
      if (!value.trim()) { getRoles(); return; }
      try {
        const [data, error] = await request({ method: "GET", url: `${ApiEndpoints.ROLE.FILTER_ROLE}?roleName=${value}` });
        if (!error && Array.isArray(data?.data)) { setRoles(data.data); setTotalPages(Math.ceil(data.data.length / LIMIT)); setCurrentPage(1); }
      } catch { toast.error("Search failed"); }
    }, 500), []);

  const handleSearchChange = (value) => {
    setSearchRole(value);
    setCurrentPage(1);
    if (!value.trim()) getRoles();
    else handleSearch(value);
  };

  const handleRoleClick = (role) => {
    const merged = allModules.map(mod => {
      const perm = role.permissions?.find(p => p.module === mod._id);
      return { ...mod, actions: mod.actions.map(a => { const ra = perm?.actions?.find(x => x.name === a.name); return { name: a.name, allowed: ra?.allowed ?? false }; }) };
    });
    setAllModules(merged);
    setUpdateRole({ _id: role._id, roleName: role.roleName });
  };

  const handlePermissionChange = (moduleId, actionName) => {
    setAllModules(prev => prev.map(mod => mod._id === moduleId
      ? { ...mod, actions: mod.actions.map(a => a.name === actionName ? { ...a, allowed: !a.allowed } : a) }
      : mod
    ));
  };

  const selectedCount = allModules.flatMap(m => m.actions.filter(a => a.allowed)).length;
  const allAllowed = allModules.every(m => m.actions.every(a => a.allowed));
  const isRoot = updateRole.roleName === "root";

  return (
    <div className="space-y-6">
      <PageHeader title="Roles & Permissions" subtitle="Manage employee roles and access control" breadcrumbs={[{ label: "Users" }, { label: "Roles & Permissions" }]}
        action={<Button icon={<Plus size={15} />} onClick={() => setIsCreateOpen(true)}>Create Role</Button>} />

      <Card>
        <CardBody>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
            {/* Left: Roles */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Roles</h3>
                <SearchInput value={searchRole} onChange={handleSearchChange} placeholder="Search roles..." className="w-44" />
              </div>
              {loading && paginatedRoles.length === 0 ? (
                <div className="flex justify-center py-8"><div className="w-6 h-6 border-2 border-[#E63946] border-t-transparent rounded-full animate-spin" /></div>
              ) : paginatedRoles.length === 0 ? (
                <p className="text-center text-gray-400 py-8 text-sm">No roles found</p>
              ) : (
                <div className="flex flex-col gap-2">
                  {paginatedRoles.map((role) => {
                    const isActive = updateRole._id === role._id;
                    const permCount = role.permissions?.flatMap(m => m.actions?.filter(a => a.allowed))?.length ?? 0;
                    return (
                      <div key={role._id} className={`flex items-center justify-between rounded-lg border px-3 py-2 transition-colors ${isActive ? "bg-[#E63946] border-[#E63946] text-white" : "border-gray-200 hover:border-[#E63946]/30 hover:bg-[#FFF1F1]"}`}>
                        <button onClick={() => handleRoleClick(role)} className="flex-1 text-left flex items-center gap-2 capitalize font-medium text-sm">
                          {role.roleName}
                          <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full ${isActive ? "bg-white/20 text-white" : "bg-[#FFF1F1] text-[#E63946]"}`}>{permCount}</span>
                        </button>
                        {role.roleName === "root" ? (
                          <span className="text-xs text-gray-400 italic">Protected</span>
                        ) : (
                          <div className="flex gap-1 ml-2">
                            <button onClick={() => { setUpdateRole({ _id: role._id, roleName: role.roleName }); setIsUpdateOpen(true); }}
                              className={`p-1.5 rounded ${isActive ? "hover:bg-white/20" : "hover:bg-gray-100"}`}>
                              <Pencil size={13} className={isActive ? "text-white" : "text-gray-500"} />
                            </button>
                            <button onClick={() => handleDeleteRole(role._id)} disabled={loading}
                              className={`p-1.5 rounded ${isActive ? "hover:bg-white/20" : "hover:bg-gray-100"}`}>
                              <Trash2 size={13} className={isActive ? "text-red-200" : "text-red-500"} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <div className="mt-3">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={p => { setCurrentPage(p); }} />
                  </div>
                </div>
              )}
            </div>

            {/* Right: Permissions */}
            <div className="pt-6 lg:pt-0 lg:pl-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Permissions</h3>
                {updateRole._id && !isRoot && (
                  <div className="flex items-center gap-2">
                    <button onClick={() => setAllModules(prev => prev.map(m => ({ ...m, actions: m.actions.map(a => ({ ...a, allowed: false })) })))} className="text-xs text-red-500 hover:text-red-700">Clear</button>
                    <Button size="sm" icon={<RefreshCw size={13} />} onClick={handleUpdatePermission} loading={loading}>Update</Button>
                  </div>
                )}
              </div>

              {!updateRole._id ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <ShieldCheck size={40} className="text-gray-200 mb-3" />
                  <p className="text-gray-400 text-sm italic">Select a role to manage its permissions</p>
                </div>
              ) : isRoot ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <UserX size={40} className="text-gray-200 mb-3" />
                  <p className="text-gray-500 font-medium">Root role permissions cannot be edited</p>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
                    <input type="checkbox" checked={allAllowed}
                      onChange={e => setAllModules(prev => prev.map(m => ({ ...m, actions: m.actions.map(a => ({ ...a, allowed: e.target.checked })) })))}
                      className="w-4 h-4 accent-blue-600 cursor-pointer" />
                    <span className="text-sm text-gray-600">{selectedCount} permissions selected</span>
                  </div>
                  <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                    {allModules.map(mod => (
                      <div key={mod._id}>
                        <p className="text-sm font-semibold text-gray-700 mb-2">{mod.name}</p>
                        <div className="flex flex-wrap gap-3">
                          {mod.actions.map((action, idx) => (
                            <label key={`${mod._id}-${action.name}-${idx}`} className="flex items-center gap-1.5 cursor-pointer">
                              <input type="checkbox" checked={!!action.allowed}
                                onChange={() => handlePermissionChange(mod._id, action.name)}
                                className="w-4 h-4 accent-blue-600" />
                              <span className="text-sm text-gray-600 capitalize">{action.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end mt-4 pt-3 border-t border-gray-100">
                    <Button onClick={handleUpdatePermission} loading={loading}>Save Permissions</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Create Role Modal */}
      <Modal open={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create Role" size="sm">
        <form onSubmit={handleCreateRole} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
            <input type="text" value={newRoleName.roleName} onChange={e => setNewRoleName({ roleName: e.target.value })} placeholder="e.g. Manager"
              className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946]" required />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button type="submit" loading={loading}>Create</Button>
          </div>
        </form>
      </Modal>

      {/* Update Role Modal */}
      <Modal open={isUpdateOpen} onClose={() => setIsUpdateOpen(false)} title="Update Role Name" size="sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role Name</label>
            <input type="text" value={updateRole.roleName} onChange={e => setUpdateRole(p => ({ ...p, roleName: e.target.value }))} placeholder="Role name"
              className="w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946]" />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={() => setIsUpdateOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdateRole} loading={loading}>Update</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RolePermission;

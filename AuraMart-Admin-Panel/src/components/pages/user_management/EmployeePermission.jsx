import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { RefreshCw, ShieldCheck } from "lucide-react";
import { request } from "../../../api/request";
import { ApiEndpoints } from "../../../api/apis";
import { PageHeader } from "../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../ui/Card";
import { Button } from "../../ui/Button";

const EmployeePermissions = () => {
  const { _id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (_id) getSingleEmployee(); }, [_id]);

  const getSingleEmployee = async () => {
    setLoadingFetch(true);
    try {
      const [data, error] = await request({ method: "GET", url: ApiEndpoints.EMPLOYEE.GET_SINGLE_EMPLOYEE(_id) });
      if (error) throw new Error(error?.message || "Failed to fetch employee");
      if (data?.data) {
        const normalized = {
          ...data.data,
          role: {
            ...data.data.role,
            permissions: Array.isArray(data.data.role?.permissions)
              ? data.data.role.permissions.map(perm => ({
                  ...perm,
                  actions: Array.isArray(perm.actions)
                    ? perm.actions
                    : perm.actions ? Object.entries(perm.actions).map(([name, allowed]) => ({ name, allowed })) : [],
                  module: perm.module?._id || perm.module,
                  moduleName: perm.module?.name || "",
                }))
              : [],
          },
        };
        setEmployee(normalized);
      }
    } catch (err) { toast.error(err.message || "Failed to load employee"); } finally { setLoadingFetch(false); }
  };

  const handlePermissionChange = (moduleId, actionName) => {
    setEmployee(prev => ({
      ...prev,
      role: {
        ...prev.role,
        permissions: prev.role.permissions.map(mod =>
          mod.module === moduleId ? { ...mod, actions: mod.actions.map(a => a.name === actionName ? { ...a, allowed: !a.allowed } : a) } : mod
        ),
      },
    }));
  };

  const handleSelectAll = (checked) => {
    setEmployee(prev => ({ ...prev, role: { ...prev.role, permissions: prev.role.permissions.map(mod => ({ ...mod, actions: mod.actions.map(a => ({ ...a, allowed: checked })) })) } }));
  };

  const handleUpdate = async () => {
    if (!employee?.role?._id) { toast.error("Invalid employee data"); return; }
    setLoading(true);
    try {
      const payload = {
        permissions: employee.role.permissions.map(mod => ({
          module: mod.module,
          isVisible: mod.actions.some(a => a.allowed),
          actions: mod.actions.map(a => ({ name: a.name, allowed: a.allowed })),
        })),
      };
      const [data, error] = await request({ method: "PUT", url: ApiEndpoints.ROLE.UPDATE_PERMISSION(employee.role._id), data: payload });
      if (error) throw new Error(error?.message || "Failed");
      toast.success("Permissions updated");
      if (data?.data) {
        setEmployee(prev => ({
          ...prev,
          role: {
            ...prev.role,
            ...data.data,
            permissions: Array.isArray(data.data.permissions)
              ? data.data.permissions.map(perm => ({
                  ...perm,
                  actions: Array.isArray(perm.actions) ? perm.actions : Object.entries(perm.actions || {}).map(([name, allowed]) => ({ name, allowed })),
                  module: perm.module?._id || perm.module,
                  moduleName: perm.module?.name || "",
                }))
              : [],
          },
        }));
      }
    } catch (err) { toast.error(err.message || "Failed to update permissions"); } finally { setLoading(false); }
  };

  const perms = employee?.role?.permissions || [];
  const selectedCount = perms.reduce((n, m) => n + m.actions.filter(a => a.allowed).length, 0);
  const allSelected = perms.length > 0 && perms.every(m => m.actions.every(a => a.allowed));

  return (
    <div className="space-y-6">
      <PageHeader title="Employee Permissions" subtitle="Manage individual employee access" breadcrumbs={[{ label: "Users" }, { label: "Employees" }, { label: "Permissions" }]} />

      {/* Employee Info */}
      {employee && (
        <Card>
          <CardHeader><CardTitle><div className="flex items-center gap-2"><ShieldCheck size={15} className="text-[#E63946]" /> Employee Information</div></CardTitle></CardHeader>
          <CardBody>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[["Name", `${employee.firstName} ${employee.lastName}`], ["Phone", employee.contact], ["Email", employee.email], ["Role", employee.role?.roleName]].map(([label, value]) => (
                <div key={label}>
                  <p className="text-xs text-gray-500 mb-0.5">{label}</p>
                  <p className="text-sm font-medium text-gray-900 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100">{value || "—"}</p>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      )}

      {/* Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Permissions</CardTitle>
        </CardHeader>
        <CardBody>
          {loadingFetch ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-8 h-8 border-2 border-[#E63946] border-t-transparent rounded-full animate-spin mb-2" />
              <p className="text-sm text-gray-400">Loading permissions...</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={allSelected} disabled={perms.length === 0}
                    onChange={e => handleSelectAll(e.target.checked)} className="w-4 h-4 accent-blue-600" />
                  <span className="text-sm text-gray-600">{selectedCount} permissions selected</span>
                </label>
                <div className="flex items-center gap-3">
                  {perms.length > 0 && (
                    <button onClick={() => handleSelectAll(false)} className="text-xs text-red-500 hover:text-red-700">Clear</button>
                  )}
                  <Button size="sm" icon={<RefreshCw size={13} />} onClick={handleUpdate} loading={loading} disabled={perms.length === 0}>Update</Button>
                </div>
              </div>

              {perms.length === 0 ? (
                <div className="text-center py-10 text-gray-400 text-sm italic">No permissions available</div>
              ) : (
                <div className="space-y-4">
                  {perms.map((mod, idx) => (
                    <div key={mod.module || idx}>
                      <p className="text-sm font-semibold text-gray-700 mb-2 capitalize">{mod.moduleName || mod.name || "Module"}</p>
                      <div className="flex flex-wrap gap-4 pl-2">
                        {mod.actions.length === 0 ? (
                          <span className="text-xs text-gray-400">No actions</span>
                        ) : mod.actions.map((action, ai) => (
                          <label key={`${mod.module}-${action.name}-${ai}`} className="flex items-center gap-1.5 cursor-pointer">
                            <input type="checkbox" checked={!!action.allowed}
                              onChange={() => handlePermissionChange(mod.module, action.name)}
                              className="w-4 h-4 accent-blue-600" />
                            <span className="text-sm text-gray-600 capitalize">{action.name}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end pt-4 border-t border-gray-100">
                    <Button onClick={handleUpdate} loading={loading}>Save Permissions</Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default EmployeePermissions;

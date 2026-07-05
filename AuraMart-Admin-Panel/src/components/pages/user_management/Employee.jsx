import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Plus, Pencil, Key, Trash2, Users, Eye, EyeOff } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";
import { request } from "../../../api/request";
import { ApiEndpoints } from "../../../api/apis";
import { PageHeader } from "../../ui/PageHeader";
import { Card, CardHeader, CardTitle } from "../../ui/Card";
import { Button } from "../../ui/Button";
import { Table, Th, Td, TableSkeleton, TableEmpty } from "../../ui/Table";
import { ConfirmModal, Modal } from "../../ui/Modal";
import { getInitials } from "../../../lib/utils";

const Employee = () => {
  const { hasPermission } = useAuth();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmId, setConfirmId] = useState(null);
  const [resetModal, setResetModal] = useState(false);
  const [resetId, setResetId] = useState(null);
  const [resetForm, setResetForm] = useState({ password: "", confirmPassword: "" });
  const [resetLoading, setResetLoading] = useState(false);
  const [showPw1, setShowPw1] = useState(false);
  const [showPw2, setShowPw2] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [data, error] = await request({ method: "GET", url: ApiEndpoints.EMPLOYEE.GET_EMPLOYEE });
      if (!error && Array.isArray(data?.data)) setEmployees(data.data);
      else if (error) toast.error("Failed to fetch employees");
      setLoading(false);
    })();
  }, []);

  const handleDelete = async () => {
    const [, error] = await request({ method: "DELETE", url: ApiEndpoints.EMPLOYEE.DELETE_EMPLOYEE(confirmId) });
    if (error) toast.error("Failed to delete employee");
    else { setEmployees(prev => prev.filter(e => e._id !== confirmId)); toast.success("Employee deleted"); }
    setConfirmId(null);
  };

  const openReset = (id) => { setResetId(id); setResetForm({ password: "", confirmPassword: "" }); setResetModal(true); };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (resetForm.password !== resetForm.confirmPassword) { toast.error("Passwords do not match"); return; }
    setResetLoading(true);
    const [, error] = await request({
      method: "PUT", url: ApiEndpoints.EMPLOYEE.UPDATE_EMPLOYEE_PASSWORD,
      data: { employeeId: resetId, password: resetForm.password, confirmPassword: resetForm.confirmPassword }
    });
    if (error) toast.error("Failed to reset password");
    else { toast.success("Password reset successfully"); setResetModal(false); }
    setResetLoading(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employees"
        subtitle="Manage admin panel staff accounts"
        breadcrumbs={[{ label: "Users" }, { label: "Employees" }]}
        action={
          hasPermission("Employees", "create") && (
            <Link to="/admin/employees/create">
              <Button icon={<Plus size={15} />}>Add Employee</Button>
            </Link>
          )
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>All Employees <span className="text-gray-400 font-normal text-sm">({employees.length})</span></CardTitle>
        </CardHeader>
        <Table>
          <thead>
            <tr>
              <Th className="w-10">#</Th>
              <Th>Employee</Th>
              <Th>ID</Th>
              <Th>Contact</Th>
              <Th>Role</Th>
              <Th className="text-center">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? <TableSkeleton rows={5} cols={6} /> :
              employees.length === 0 ? (
                <TableEmpty message="No employees yet" icon={<Users size={24} />}
                  action={<Link to="/admin/employees/create"><Button size="sm" icon={<Plus size={13} />}>Add Employee</Button></Link>} />
              ) : (
                employees.map((emp, i) => (
                  <tr key={emp._id}>
                    <Td className="text-gray-400 text-xs">{i + 1}</Td>
                    <Td>
                      <div className="flex items-center gap-3">
                        {emp.profileImage ? (
                          <img src={emp.profileImage} alt="" className="w-9 h-9 rounded-full object-cover" />
                        ) : (
                          <div className="w-9 h-9 rounded-full bg-[#FFF1F1] flex items-center justify-center text-[#E63946] text-xs font-bold">
                            {getInitials(`${emp.firstName} ${emp.lastName}`)}
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{emp.firstName} {emp.lastName}</p>
                          <p className="text-xs text-gray-400">{emp.email}</p>
                        </div>
                      </div>
                    </Td>
                    <Td className="font-mono text-xs text-gray-500">{emp.userId || "—"}</Td>
                    <Td className="text-gray-600 text-sm">{emp.contact || "—"}</Td>
                    <Td>
                      <span className="text-xs font-medium px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full">
                        {emp.role?.roleName || "No Role"}
                      </span>
                    </Td>
                    <Td>
                      {i === 0 ? (
                        <div className="flex justify-center">
                          <span className="text-xs text-gray-400 px-2 py-0.5 bg-gray-100 rounded-full">Root</span>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-1">
                          {hasPermission("Employees", "edit") && (
                            <Button size="icon-sm" variant="ghost" icon={<Pencil size={13} />}
                              onClick={() => navigate(`/admin/employees/permission/${emp._id}`)} />
                          )}
                          {hasPermission("Employees", "password") && (
                            <Button size="icon-sm" variant="ghost" icon={<Key size={13} className="text-amber-500" />}
                              onClick={() => openReset(emp._id)} />
                          )}
                          {hasPermission("Employees", "delete") && (
                            <Button size="icon-sm" variant="ghost" icon={<Trash2 size={13} className="text-red-500" />}
                              onClick={() => setConfirmId(emp._id)} />
                          )}
                        </div>
                      )}
                    </Td>
                  </tr>
                ))
              )
            }
          </tbody>
        </Table>
      </Card>

      {/* Reset Password Modal */}
      <Modal open={resetModal} onClose={() => setResetModal(false)} title="Reset Password" size="sm">
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <div className="relative">
              <input type={showPw1 ? "text" : "password"} required minLength={6}
                value={resetForm.password} onChange={e => setResetForm(p => ({ ...p, password: e.target.value }))}
                placeholder="Min. 6 characters"
                className="w-full h-9 px-3 pr-9 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946]" />
              <button type="button" onClick={() => setShowPw1(p => !p)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                {showPw1 ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <input type={showPw2 ? "text" : "password"} required minLength={6}
                value={resetForm.confirmPassword} onChange={e => setResetForm(p => ({ ...p, confirmPassword: e.target.value }))}
                placeholder="Repeat password"
                className="w-full h-9 px-3 pr-9 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946]" />
              <button type="button" onClick={() => setShowPw2(p => !p)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
                {showPw2 ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="secondary" onClick={() => setResetModal(false)}>Cancel</Button>
            <Button type="submit" loading={resetLoading}>Reset Password</Button>
          </div>
        </form>
      </Modal>

      <ConfirmModal open={!!confirmId} onClose={() => setConfirmId(null)} onConfirm={handleDelete}
        title="Delete Employee" message="This will permanently delete this employee account." />
    </div>
  );
};

export default Employee;

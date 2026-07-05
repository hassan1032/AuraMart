import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { request } from "../../../../api/request";
import { ApiEndpoints } from "../../../../api/apis";
import { showSuccess } from "../../../../utils/toastManager";
import { useAuth } from "../../../../context/AuthContext";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardBody } from "../../../ui/Card";
import { Table, Th, Td, TableSkeleton, TableEmpty } from "../../../ui/Table";
import { Button } from "../../../ui/Button";
import { ConfirmModal } from "../../../ui/Modal";
import { Pagination } from "../../../ui/Pagination";
import { Pencil, Trash2, Plus } from "lucide-react";

const Stokiest = () => {
  const { hasPermission } = useAuth();
  const [stokiest, setStokiest] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedStokiest, setPaginatedStokiest] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedStokiestId, setSelectedStokiestId] = useState(null);
  const limit = 10;

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(stokiest.length / limit)) setCurrentPage(newPage);
  };

  useEffect(() => {
    const getBanners = async () => {
      try {
        setLoading(true);
        const [data, error] = await request({ method: "GET", url: ApiEndpoints.PROMOTION_MANAGEMENT.ALL_STOKIEST });
        if (error) { toast.error("Failed to Fetch data" || error.message); return; }
        const allBanners = Array.isArray(data.data) ? data.data : [];
        setStokiest(allBanners);
        setCurrentPage(1);
        if (allBanners.length > 0 && !sessionStorage.getItem("bannerFetched")) {
          showSuccess("Fetched successfully!");
          sessionStorage.setItem("bannerFetched", true);
        }
      } catch (error) {
        toast.error(error.message || "Failed to fetch data");
        setStokiest([]);
      } finally {
        setLoading(false);
      }
    };
    getBanners();
  }, []);

  useEffect(() => {
    const start = (currentPage - 1) * limit;
    setPaginatedStokiest(stokiest.slice(start, start + limit));
  }, [stokiest, currentPage]);

  const handleStatusToggle = async (id, currentStatus) => {
    if (!id) { toast.info("Missing ID in Status"); return; }
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    try {
      const [data, error] = await request({ method: "PUT", url: ApiEndpoints.PROMOTION_MANAGEMENT.STOKIEST_STATUS, data: { id, status: newStatus } });
      if (error) { toast.error("Failed to update status" || error.message); return; }
      if (data?.data) {
        setStokiest(prev => prev.map(s => s._id === id ? { ...s, status: data.data.status } : s));
        toast.success("Status updated!");
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong update status");
    }
  };

  const handleDelete = async (id) => {
    if (!id) { toast.error("Missing Id to delete"); return; }
    try {
      const [data, error] = await request({ method: "DELETE", url: ApiEndpoints.PROMOTION_MANAGEMENT.DELETE_STOKIEST(id) });
      if (error) { toast.error("failed to delete" || error.message); return; }
      setStokiest(prev => prev.filter(s => s._id !== id));
      showSuccess("Deleted successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to delete");
    }
  };

  const confirmDelete = async () => {
    if (selectedStokiestId) {
      await handleDelete(selectedStokiestId);
      setShowConfirmModal(false);
      setSelectedStokiestId(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Stokiest"
        subtitle="Manage stockist partners"
        breadcrumbs={[{ label: "Promotions" }, { label: "Stokiest" }]}
        action={hasPermission("Stokiest", "create") && (
          <Link to="/admin/stokiest/create"><Button icon={<Plus size={14} />}>Create New</Button></Link>
        )}
      />

      <Card>
        <CardBody className="p-0">
          {hasPermission("stokiest", "list") && (
            <Table>
              <thead>
                <tr>
                  <Th>SL</Th>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>Shop</Th>
                  <Th>Address</Th>
                  <Th>City</Th>
                  <Th>Country</Th>
                  <Th>Website</Th>
                  <Th className="text-center">Status</Th>
                  <Th className="text-center">Action</Th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <TableSkeleton rows={5} cols={10} />
                ) : paginatedStokiest.length === 0 ? (
                  <TableEmpty colSpan={10} message="No stokiest found" />
                ) : (
                  paginatedStokiest.map((s, index) => (
                    <tr key={s._id || index}>
                      <Td>{(currentPage - 1) * limit + index + 1}</Td>
                      <Td className="font-medium text-gray-900">{s.name}</Td>
                      <Td>{s.email}</Td>
                      <Td>{s.shopName}</Td>
                      <Td>{s.Address || "Bareilly"}</Td>
                      <Td>{s.city}</Td>
                      <Td>{s.country}</Td>
                      <Td className="max-w-xs truncate">{s.website}</Td>
                      <Td className="text-center">
                        {hasPermission("Stokiest", "status") && (
                          <button
                            onClick={() => handleStatusToggle(s?._id, s?.status)}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${s?.status === "active" ? "bg-[#E63946]" : "bg-gray-300"}`}
                          >
                            <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${s?.status === "active" ? "translate-x-4.5" : "translate-x-0.5"}`} />
                          </button>
                        )}
                      </Td>
                      <Td className="text-center">
                        <div className="flex gap-1 justify-center">
                          {hasPermission("stokiest", "edit") && (
                            <Link to={`/admin/stokiest/edit/${s._id}`}>
                              <button className="w-8 h-8 rounded-full border border-[#E63946]/30 text-[#E63946] hover:bg-[#FFF1F1] flex items-center justify-center">
                                <Pencil size={13} />
                              </button>
                            </Link>
                          )}
                          {hasPermission("stokiest", "delete") && (
                            <button
                              onClick={() => { setSelectedStokiestId(s._id); setShowConfirmModal(true); }}
                              className="w-8 h-8 rounded-full border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </Td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </CardBody>
      </Card>

      <Pagination currentPage={currentPage} totalItems={stokiest.length} limit={limit} onPageChange={handlePageChange} />

      {showConfirmModal && (
        <ConfirmModal onConfirm={confirmDelete} onCancel={() => { setShowConfirmModal(false); setSelectedStokiestId(null); }} />
      )}
    </div>
  );
};

export default Stokiest;

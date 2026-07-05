import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Plus, Pencil, Trash2, Image } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { request } from "../../../../api/request";
import { ApiEndpoints } from "../../../../api/apis";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardHeader, CardTitle } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import { Table, Th, Td, TableSkeleton, TableEmpty } from "../../../ui/Table";
import { Pagination } from "../../../ui/Pagination";
import { ConfirmModal } from "../../../ui/Modal";

const LIMIT = 10;

const BannerList = () => {
  const { hasPermission } = useAuth();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [data, error] = await request({ method: "GET", url: ApiEndpoints.PROMOTION_MANAGEMENT.ALL_BANNER });
      if (!error && Array.isArray(data?.data)) setBanners(data.data);
      else if (error) toast.error("Failed to load banners");
      setLoading(false);
    })();
  }, []);

  const totalPages = Math.ceil(banners.length / LIMIT);
  const paginated = banners.slice((currentPage - 1) * LIMIT, currentPage * LIMIT);

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const [data, error] = await request({ method: "PUT", url: ApiEndpoints.PROMOTION_MANAGEMENT.BANNER_STATUS, data: { id, status: newStatus } });
    if (error) toast.error("Failed to update status");
    else setBanners(prev => prev.map(b => b._id === id ? { ...b, status: data?.data?.status || newStatus } : b));
  };

  const handleDelete = async () => {
    const [, error] = await request({ method: "DELETE", url: ApiEndpoints.PROMOTION_MANAGEMENT.DELETE_BANNER(confirmId) });
    if (error) toast.error("Failed to delete");
    else { setBanners(prev => prev.filter(b => b._id !== confirmId)); toast.success("Banner deleted"); }
    setConfirmId(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Banners"
        subtitle="Manage storefront promotional banners"
        breadcrumbs={[{ label: "Promotions" }, { label: "Banners" }]}
        action={
          hasPermission("Banner", "create") && (
            <Link to="/admin/banners/create">
              <Button icon={<Plus size={15} />}>Add Banner</Button>
            </Link>
          )
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>All Banners <span className="text-gray-400 font-normal text-sm">({banners.length})</span></CardTitle>
        </CardHeader>
        <Table>
          <thead>
            <tr>
              <Th className="w-10">#</Th>
              <Th>Image</Th>
              <Th>Title</Th>
              <Th>Status</Th>
              <Th className="text-center">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? <TableSkeleton rows={4} cols={5} /> :
              paginated.length === 0 ? (
                <TableEmpty message="No banners yet" icon={<Image size={24} />}
                  action={<Link to="/admin/banners/create"><Button size="sm" icon={<Plus size={13} />}>Add Banner</Button></Link>} />
              ) : paginated.map((banner, i) => (
                <tr key={banner._id}>
                  <Td className="text-gray-400 text-xs">{(currentPage - 1) * LIMIT + i + 1}</Td>
                  <Td>
                    {banner.thumbnail ? (
                      <img src={banner.thumbnail} alt={banner.Heading} className="h-14 w-28 object-cover rounded-lg border border-gray-100" />
                    ) : (
                      <div className="h-14 w-28 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Image size={16} className="text-gray-400" />
                      </div>
                    )}
                  </Td>
                  <Td className="font-medium text-gray-900">{banner.Heading || banner.title || "—"}</Td>
                  <Td>
                    <button
                      onClick={() => handleStatusToggle(banner._id, banner.status)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${banner.status === "active" ? "bg-[#E63946]" : "bg-gray-300"}`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${banner.status === "active" ? "translate-x-4.5" : "translate-x-0.5"}`} />
                    </button>
                  </Td>
                  <Td>
                    <div className="flex items-center justify-center gap-1">
                      {hasPermission("Banner", "edit") && (
                        <Link to={`/admin/banners/edit/${banner._id}`}>
                          <Button size="icon-sm" variant="ghost" icon={<Pencil size={13} />} />
                        </Link>
                      )}
                      {hasPermission("Banner", "delete") && (
                        <Button size="icon-sm" variant="ghost" icon={<Trash2 size={13} className="text-red-500" />} onClick={() => setConfirmId(banner._id)} />
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

      <ConfirmModal open={!!confirmId} onClose={() => setConfirmId(null)} onConfirm={handleDelete} title="Delete Banner" message="This will permanently delete this banner." />
    </div>
  );
};

export default BannerList;

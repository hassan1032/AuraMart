import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { request } from "../../../../api/request";
import { ApiEndpoints } from "../../../../api/apis";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import { Badge } from "../../../ui/Badge";
import { Table, Th, Td, TableSkeleton, TableEmpty } from "../../../ui/Table";
import { Pagination } from "../../../ui/Pagination";
import { SearchInput } from "../../../ui/SearchInput";
import { ConfirmModal } from "../../../ui/Modal";
import { truncate } from "../../../../lib/utils";

const LIMIT = 10;

const Collection = () => {
  const { hasPermission } = useAuth();
  const [collection, setCollection] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmId, setConfirmId] = useState(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [data, error] = await request({ method: "GET", url: ApiEndpoints.PRODUCTS_MANAGEMENT.ALL_COLLECTION });
      if (!error && Array.isArray(data?.data)) setCollection(data.data);
      else if (error) toast.error("Failed to fetch categories");
      setLoading(false);
    })();
  }, []);

  const filtered = collection.filter(c =>
    !search || c.name?.toLowerCase().includes(search.toLowerCase())
  );
  const totalPages = Math.ceil(filtered.length / LIMIT);
  const paginated = filtered.slice((currentPage - 1) * LIMIT, currentPage * LIMIT);

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const [data, error] = await request({
      method: "PUT",
      url: ApiEndpoints.PRODUCTS_MANAGEMENT.COLLECTION_STATUS,
      data: { id, status: newStatus },
    });
    if (error) { toast.error("Failed to update status"); return; }
    setCollection(prev => prev.map(c => c._id === id ? { ...c, status: data?.data?.status || newStatus } : c));
    toast.success("Status updated");
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    setDeleteLoading(true);
    const [, error] = await request({ method: "DELETE", url: ApiEndpoints.PRODUCTS_MANAGEMENT.DELETE_COLLECTION(confirmId) });
    if (error) { toast.error("Failed to delete"); }
    else { setCollection(prev => prev.filter(c => c._id !== confirmId)); toast.success("Category deleted"); }
    setDeleteLoading(false);
    setConfirmId(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Categories"
        subtitle="Manage your product collections and categories"
        breadcrumbs={[{ label: "Catalog" }, { label: "Categories" }]}
        action={
          hasPermission("Collection", "create") && (
            <Link to="/admin/product/collection/create">
              <Button icon={<Plus size={15} />}>Add Category</Button>
            </Link>
          )
        }
      />

      <Card>
        <CardHeader
          action={
            <SearchInput
              value={search}
              onChange={v => { setSearch(v); setCurrentPage(1); }}
              placeholder="Search categories..."
              className="w-56"
            />
          }
        >
          <CardTitle>All Categories <span className="text-gray-400 font-normal text-sm">({filtered.length})</span></CardTitle>
        </CardHeader>

        <Table>
          <thead>
            <tr>
              <Th className="w-12">#</Th>
              <Th>Image</Th>
              <Th>Name</Th>
              <Th>Description</Th>
              <Th>Status</Th>
              <Th className="text-center">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableSkeleton rows={5} cols={6} />
            ) : paginated.length === 0 ? (
              <TableEmpty
                message={search ? "No categories match your search" : "No categories yet"}
                icon={<Tag size={24} />}
                action={
                  !search && (
                    <Link to="/admin/product/collection/create">
                      <Button size="sm" icon={<Plus size={13} />}>Add Category</Button>
                    </Link>
                  )
                }
              />
            ) : (
              paginated.map((col, i) => (
                <tr key={col._id}>
                  <Td className="text-gray-400 text-xs">{(currentPage - 1) * LIMIT + i + 1}</Td>
                  <Td>
                    {col.thumbnail ? (
                      <img
                        src={col.thumbnail}
                        alt={col.name}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                        onError={e => { e.target.onerror = null; e.target.src = "/images/col8.jpg"; }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Tag size={16} className="text-gray-400" />
                      </div>
                    )}
                  </Td>
                  <Td className="font-medium text-gray-900">{col.name || "—"}</Td>
                  <Td className="text-gray-500 max-w-xs">{truncate(col.description, 60) || "—"}</Td>
                  <Td>
                    <button
                      onClick={() => handleStatusToggle(col._id, col.status)}
                      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none ${col.status === "active" ? "bg-[#E63946]" : "bg-gray-300"}`}
                    >
                      <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${col.status === "active" ? "translate-x-4.5" : "translate-x-0.5"}`} />
                    </button>
                  </Td>
                  <Td className="text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {hasPermission("Collection", "edit") && (
                        <Link to={`/admin/product/collection/edit/${col._id}`}>
                          <Button size="icon-sm" variant="ghost" icon={<Pencil size={13} />} />
                        </Link>
                      )}
                      {hasPermission("Collection", "delete") && (
                        <Button size="icon-sm" variant="ghost" icon={<Trash2 size={13} className="text-red-500" />} onClick={() => setConfirmId(col._id)} />
                      )}
                    </div>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </Table>

        {!loading && totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-100">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
          </div>
        )}
      </Card>

      <ConfirmModal
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Category"
        message="This will permanently delete the category. This action cannot be undone."
      />
    </div>
  );
};

export default Collection;

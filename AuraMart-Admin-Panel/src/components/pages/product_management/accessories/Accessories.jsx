import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Plus, Pencil, Trash2, Box, Eye, Filter, RotateCcw } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { request } from "../../../../api/request";
import { ApiEndpoints } from "../../../../api/apis";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import { Table, Th, Td, TableSkeleton, TableEmpty } from "../../../ui/Table";
import { Pagination } from "../../../ui/Pagination";
import { ConfirmModal } from "../../../ui/Modal";
import { SearchInput } from "../../../ui/SearchInput";
import { formatINR, truncate } from "../../../../lib/utils";

const LIMIT = 10;

const Accessories = () => {
  const { hasPermission } = useAuth();
  const [accessories, setAccessories] = useState([]);
  const [accessoryTypes, setAccessoryTypes] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmId, setConfirmId] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const fetchAccessories = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const qp = new URLSearchParams();
      if (params.accessoryName) qp.append("accessoryName", params.accessoryName);
      if (params.selectAccessoryType) qp.append("selectAccessoryType", params.selectAccessoryType);
      if (params.selectColor) qp.append("selectColor", params.selectColor);
      if (params.selectSize) qp.append("selectSize", params.selectSize);
      const hasFilters = qp.toString().length > 0;
      const url = hasFilters
        ? `${ApiEndpoints.PRODUCTS_MANAGEMENT.FILTER_ACCESSORY}?${qp}`
        : ApiEndpoints.PRODUCTS_MANAGEMENT.ALL_ACCESSORY;
      const [data, error] = await request({ method: "GET", url });
      if (!error) setAccessories(Array.isArray(data?.data) ? data.data : []);
      else toast.error("Failed to load accessories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccessories();
    Promise.all([
      request({ method: "GET", url: ApiEndpoints.PRODUCTS_MANAGEMENT.ALL_ACCESSORY_TYPE }),
      request({ method: "GET", url: ApiEndpoints.PRODUCT_VARIANT.ALL_COLOR }),
      request({ method: "GET", url: ApiEndpoints.PRODUCT_VARIANT.ALL_SIZE }),
    ]).then(([[tData], [cData], [sData]]) => {
      if (Array.isArray(tData?.data)) setAccessoryTypes(tData.data);
      if (Array.isArray(cData?.data)) setColors(cData.data);
      if (Array.isArray(sData?.data)) setSizes(sData.data);
    });
  }, [fetchAccessories]);

  const handleFilter = (e) => {
    e?.preventDefault();
    setCurrentPage(1);
    fetchAccessories({ accessoryName: search, selectAccessoryType: selectedType, selectColor: selectedColor, selectSize: selectedSize });
  };

  const handleReset = () => {
    setSearch(""); setSelectedType(""); setSelectedColor(""); setSelectedSize("");
    setCurrentPage(1);
    fetchAccessories();
  };

  const totalPages = Math.ceil(accessories.length / LIMIT);
  const paginated = accessories.slice((currentPage - 1) * LIMIT, currentPage * LIMIT);

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const [data, error] = await request({ method: "PUT", url: ApiEndpoints.PRODUCTS_MANAGEMENT.ACCESSORY_STATUS, data: { id, status: newStatus } });
    if (error) toast.error("Failed to update status");
    else setAccessories(prev => prev.map(a => a._id === id ? { ...a, status: data?.data?.status || newStatus } : a));
  };

  const handleDelete = async () => {
    const [, error] = await request({ method: "DELETE", url: ApiEndpoints.PRODUCTS_MANAGEMENT.DELETE_ACCESSORY(confirmId) });
    if (error) toast.error("Failed to delete");
    else { setAccessories(prev => prev.filter(a => a._id !== confirmId)); toast.success("Deleted"); }
    setConfirmId(null);
  };

  const Select = ({ label, value, onChange, options, placeholder }) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full h-9 px-3 border border-gray-300 rounded-lg text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-[#E63946]">
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o._id} value={o.name}>{o.name}</option>)}
      </select>
    </div>
  );

  const hasActiveFilters = search || selectedType || selectedColor || selectedSize;

  // Debounced live search from the card header SearchInput
  const searchTimer = useRef(null);
  const handleSearchChange = (v) => {
    setSearch(v);
    clearTimeout(searchTimer.current);
    if (!v) { setCurrentPage(1); fetchAccessories({ selectAccessoryType: selectedType, selectColor: selectedColor, selectSize: selectedSize }); return; }
    searchTimer.current = setTimeout(() => {
      setCurrentPage(1);
      fetchAccessories({ accessoryName: v, selectAccessoryType: selectedType, selectColor: selectedColor, selectSize: selectedSize });
    }, 400);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Accessories"
        subtitle="Manage product accessories catalog"
        breadcrumbs={[{ label: "Catalog" }, { label: "Accessories" }]}
        action={
          <div className="flex items-center gap-2">
            <Button variant={showFilters ? "primary" : "secondary"} size="md" icon={<Filter size={14} />} onClick={() => setShowFilters(p => !p)}>
              Filters
            </Button>
            {hasPermission("Accessories", "create") && (
              <Link to="/admin/product/accessories/create">
                <Button icon={<Plus size={15} />}>Add Accessory</Button>
              </Link>
            )}
          </div>
        }
      />

      {showFilters && (
        <Card>
          <CardBody>
            <form onSubmit={handleFilter}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Search</label>
                  <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Accessory name..."
                    className="w-full h-9 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946]" />
                </div>
                <Select label="Type" value={selectedType} onChange={setSelectedType} options={accessoryTypes} placeholder="All Types" />
                <Select label="Color" value={selectedColor} onChange={setSelectedColor} options={colors} placeholder="All Colors" />
                <Select label="Size" value={selectedSize} onChange={setSelectedSize} options={sizes} placeholder="All Sizes" />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                {hasActiveFilters && <Button type="button" variant="ghost" size="sm" icon={<RotateCcw size={13} />} onClick={handleReset}>Reset</Button>}
                <Button type="submit" size="sm">Apply Filters</Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader action={<SearchInput value={search} onChange={handleSearchChange} placeholder="Search accessories..." className="w-56" />}>
          <CardTitle>All Accessories <span className="text-gray-400 font-normal text-sm">({accessories.length})</span></CardTitle>
        </CardHeader>
        <Table>
          <thead>
            <tr>
              <Th className="w-10">#</Th>
              <Th>Accessory</Th>
              <Th>Type</Th>
              <Th className="text-right">Price</Th>
              <Th>Status</Th>
              <Th className="text-center">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? <TableSkeleton rows={5} cols={6} /> :
              paginated.length === 0 ? (
                <TableEmpty message={hasActiveFilters ? "No accessories match filters" : "No accessories yet"} icon={<Box size={24} />}
                  action={!hasActiveFilters && <Link to="/admin/product/accessories/create"><Button size="sm" icon={<Plus size={13} />}>Add Accessory</Button></Link>} />
              ) : paginated.map((acc, i) => {
                const img = acc.colorImages?.[0]?.accessoryThumbnail || acc.colorImages?.[0]?.thumbnail || acc.thumbnail || acc.image || "";
                const name = acc.accessoryName || acc.name || "—";
                const type = (Array.isArray(acc.selectAccessoryType) ? acc.selectAccessoryType[0] : acc.selectAccessoryType) || acc.accessoryType?.name || "—";
                const indPrice = (acc.prices || []).find(p => p.country === "IND") || acc.prices?.[0];
                const price = indPrice?.sellingPrice || acc.priceInfo?.sellingPrice || acc.sellingPrice || acc.price || 0;
                return (
                  <tr key={acc._id}>
                    <Td className="text-gray-400 text-xs">{(currentPage - 1) * LIMIT + i + 1}</Td>
                    <Td>
                      <div className="flex items-center gap-3">
                        {img ? (
                          <img src={img} alt={name} className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                            onError={e => { e.target.onerror = null; e.target.src = "/images/col8.jpg"; }} />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center"><Box size={14} className="text-gray-400" /></div>
                        )}
                        <p className="font-medium text-gray-900 text-sm">{truncate(name, 35)}</p>
                      </div>
                    </Td>
                    <Td className="text-gray-500 text-xs">{type}</Td>
                    <Td className="text-right font-semibold text-gray-900">{formatINR(price)}</Td>
                    <Td>
                      <button onClick={() => handleStatusToggle(acc._id, acc.status)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${acc.status === "active" ? "bg-[#E63946]" : "bg-gray-300"}`}>
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${acc.status === "active" ? "translate-x-4.5" : "translate-x-0.5"}`} />
                      </button>
                    </Td>
                    <Td>
                      <div className="flex items-center justify-center gap-1">
                        <Link to={`/admin/product/accessory-details/${acc._id}`}>
                          <Button size="icon-sm" variant="ghost" icon={<Eye size={13} />} />
                        </Link>
                        <Link to={`/admin/product/accessories/edit/${acc._id}`}>
                          <Button size="icon-sm" variant="ghost" icon={<Pencil size={13} />} />
                        </Link>
                        {hasPermission("Accessories", "delete") && (
                          <Button size="icon-sm" variant="ghost" icon={<Trash2 size={13} className="text-red-500" />} onClick={() => setConfirmId(acc._id)} />
                        )}
                      </div>
                    </Td>
                  </tr>
                );
              })
            }
          </tbody>
        </Table>
        {!loading && totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-100">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={p => { setCurrentPage(p); window.scrollTo(0, 0); }} />
          </div>
        )}
      </Card>

      <ConfirmModal open={!!confirmId} onClose={() => setConfirmId(null)} onConfirm={handleDelete} title="Delete Accessory" message="This will permanently delete this accessory." />
    </div>
  );
};

export default Accessories;

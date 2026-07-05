import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Plus, Pencil, Trash2, Package, Eye, Filter, X, RotateCcw } from "lucide-react";
import { useAuth } from "../../../../context/AuthContext";
import { request } from "../../../../api/request";
import { ApiEndpoints } from "../../../../api/apis";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../../ui/Card";
import { Button } from "../../../ui/Button";
import { Badge, StatusBadge } from "../../../ui/Badge";
import { Table, Th, Td, TableSkeleton, TableEmpty } from "../../../ui/Table";
import { Pagination } from "../../../ui/Pagination";
import { SearchInput } from "../../../ui/SearchInput";
import { ConfirmModal } from "../../../ui/Modal";
import { formatINR, truncate } from "../../../../lib/utils";

const LIMIT = 10;

const Products = () => {
  const { hasPermission } = useAuth();
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [confirmId, setConfirmId] = useState(null);
  const [search, setSearch] = useState("");
  const [selectedCollection, setSelectedCollection] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const fetchProducts = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const qp = new URLSearchParams();
      if (params.productName) qp.append("productName", params.productName);
      if (params.selectCollection) qp.append("selectCollection", params.selectCollection);
      if (params.selectColor) qp.append("selectColor", params.selectColor);
      if (params.selectSize) qp.append("selectSize", params.selectSize);
      const url = qp.toString()
        ? `${ApiEndpoints.PRODUCTS_MANAGEMENT.FILTER_PRODUCT}?${qp}`
        : ApiEndpoints.PRODUCTS_MANAGEMENT.ALL_PRODUCT;
      const [data, error] = await request({ method: "GET", url });
      if (!error) setProducts(Array.isArray(data?.data) ? data.data : []);
      else toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    Promise.all([
      request({ method: "GET", url: ApiEndpoints.PRODUCTS_MANAGEMENT.ALL_COLLECTION }),
      request({ method: "GET", url: ApiEndpoints.PRODUCT_VARIANT.ALL_COLOR }),
      request({ method: "GET", url: ApiEndpoints.PRODUCT_VARIANT.ALL_SIZE }),
    ]).then(([[colData], [colorData], [sizeData]]) => {
      if (Array.isArray(colData?.data)) setCollections(colData.data);
      if (Array.isArray(colorData?.data)) setColors(colorData.data);
      if (Array.isArray(sizeData?.data)) setSizes(sizeData.data);
    });
  }, [fetchProducts]);

  const handleFilter = (e) => {
    e?.preventDefault();
    setCurrentPage(1);
    fetchProducts({ productName: search, selectCollection: selectedCollection, selectColor: selectedColor, selectSize: selectedSize });
  };

  const handleReset = () => {
    setSearch(""); setSelectedCollection(""); setSelectedColor(""); setSelectedSize("");
    setCurrentPage(1);
    fetchProducts();
  };

  const hasActiveFilters = search || selectedCollection || selectedColor || selectedSize;

  // Debounced live search from the card header SearchInput
  const searchTimer = useRef(null);
  const handleSearchChange = (v) => {
    setSearch(v);
    clearTimeout(searchTimer.current);
    if (!v) { setCurrentPage(1); fetchProducts({ selectCollection: selectedCollection, selectColor: selectedColor, selectSize: selectedSize }); return; }
    searchTimer.current = setTimeout(() => {
      setCurrentPage(1);
      fetchProducts({ productName: v, selectCollection: selectedCollection, selectColor: selectedColor, selectSize: selectedSize });
    }, 400);
  };

  const totalPages = Math.ceil(products.length / LIMIT);
  const paginated = products.slice((currentPage - 1) * LIMIT, currentPage * LIMIT);

  const handleStatusToggle = async (id, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";
    const [data, error] = await request({
      method: "PUT", url: ApiEndpoints.PRODUCTS_MANAGEMENT.PRODUCT_STATUS,
      data: { id, status: newStatus },
    });
    if (error) { toast.error("Failed to update status"); return; }
    setProducts(prev => prev.map(p => p._id === id ? { ...p, status: data?.data?.status || newStatus } : p));
    toast.success("Status updated");
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    setDeleteLoading(true);
    const [, error] = await request({ method: "DELETE", url: ApiEndpoints.PRODUCTS_MANAGEMENT.DELETE_PRODUCT(confirmId) });
    if (error) toast.error("Failed to delete product");
    else { setProducts(prev => prev.filter(p => p._id !== confirmId)); toast.success("Product deleted"); }
    setDeleteLoading(false);
    setConfirmId(null);
  };

  const getProductImage = (p) => {
    const def = p.colorImages?.find(c => c.isDefault) || p.colorImages?.[0];
    return def?.thumbnail || p.thumbnail || p.image || p.images?.[0] || "";
  };

  const getProductPrice = (p) => {
    const indPrice = (p.prices || []).find(pr => pr.country === "IND") || p.prices?.[0];
    return indPrice?.sellingPrice ?? p.price ?? p.priceInfo?.sellingPrice ?? p.sellingPrice ?? p.mrp ?? 0;
  };

  const SelectField = ({ label, value, onChange, options, placeholder }) => (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full h-9 px-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E63946]"
      >
        <option value="">{placeholder}</option>
        {options.map(o => <option key={o._id} value={o.name}>{o.name}</option>)}
      </select>
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Products"
        subtitle="Manage your product catalog"
        breadcrumbs={[{ label: "Catalog" }, { label: "Products" }]}
        action={
          <div className="flex items-center gap-2">
            <Button
              variant={showFilters ? "primary" : "secondary"}
              size="md"
              icon={<Filter size={14} />}
              onClick={() => setShowFilters(p => !p)}
            >
              Filters {hasActiveFilters && <span className="ml-1 w-4 h-4 bg-[#E63946] text-white rounded-full text-[10px] flex items-center justify-center">{[search, selectedCollection, selectedColor, selectedSize].filter(Boolean).length}</span>}
            </Button>
            {hasPermission("Products", "create") && (
              <Link to="/admin/product/create">
                <Button icon={<Plus size={15} />}>Add Product</Button>
              </Link>
            )}
          </div>
        }
      />

      {/* Filter panel */}
      {showFilters && (
        <Card>
          <CardBody>
            <form onSubmit={handleFilter}>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Search</label>
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Product name..."
                    className="w-full h-9 px-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                  />
                </div>
                <SelectField label="Category" value={selectedCollection} onChange={setSelectedCollection} options={collections} placeholder="All Categories" />
                <SelectField label="Color" value={selectedColor} onChange={setSelectedColor} options={colors} placeholder="All Colors" />
                <SelectField label="Size" value={selectedSize} onChange={setSelectedSize} options={sizes} placeholder="All Sizes" />
              </div>
              <div className="flex items-center justify-end gap-2 mt-4">
                {hasActiveFilters && (
                  <Button type="button" variant="ghost" size="sm" icon={<RotateCcw size={13} />} onClick={handleReset}>Reset</Button>
                )}
                <Button type="submit" size="sm">Apply Filters</Button>
              </div>
            </form>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardHeader
          action={
            <SearchInput
              value={search}
              onChange={handleSearchChange}
              onClear={handleReset}
              placeholder="Search products..."
              className="w-56"
            />
          }
        >
          <CardTitle>
            All Products <span className="text-gray-400 font-normal text-sm">({products.length})</span>
          </CardTitle>
        </CardHeader>

        <Table>
          <thead>
            <tr>
              <Th className="w-10">#</Th>
              <Th>Product</Th>
              <Th>Category</Th>
              <Th className="text-right">Price</Th>
              <Th>Status</Th>
              <Th className="text-center">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableSkeleton rows={6} cols={6} />
            ) : paginated.length === 0 ? (
              <TableEmpty
                message={hasActiveFilters ? "No products match your filters" : "No products yet"}
                icon={<Package size={24} />}
                action={
                  !hasActiveFilters && (
                    <Link to="/admin/product/create">
                      <Button size="sm" icon={<Plus size={13} />}>Add Product</Button>
                    </Link>
                  )
                }
              />
            ) : (
              paginated.map((product, i) => {
                const img = getProductImage(product);
                const price = getProductPrice(product);
                const name = product.productName || product.title || product.name || "—";
                const category = product.collectionName || (Array.isArray(product.selectCollection) ? product.selectCollection[0]?.collectionName || product.selectCollection[0] : "") || "—";
                return (
                  <tr key={product._id}>
                    <Td className="text-gray-400 text-xs">{(currentPage - 1) * LIMIT + i + 1}</Td>
                    <Td>
                      <div className="flex items-center gap-3">
                        {img ? (
                          <img src={img} alt={name} className="w-10 h-10 rounded-lg object-cover border border-gray-100"
                            onError={e => { e.target.onerror = null; e.target.src = "/images/col8.jpg"; }} />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <Package size={14} className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-900 text-sm">{truncate(name, 35)}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{product.sku || product.productSKU || ""}</p>
                        </div>
                      </div>
                    </Td>
                    <Td className="text-gray-500 text-xs">{category}</Td>
                    <Td className="text-right font-semibold text-gray-900">{formatINR(price)}</Td>
                    <Td>
                      <button
                        onClick={() => handleStatusToggle(product._id, product.status)}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${product.status === "active" ? "bg-[#E63946]" : "bg-gray-300"}`}
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${product.status === "active" ? "translate-x-4.5" : "translate-x-0.5"}`} />
                      </button>
                    </Td>
                    <Td>
                      <div className="flex items-center justify-center gap-1">
                        <Link to={`/admin/products/product-details/${product._id}`}>
                          <Button size="icon-sm" variant="ghost" icon={<Eye size={13} />} />
                        </Link>
                        <Link to={`/admin/products/product-edit/${product._id}`}>
                          <Button size="icon-sm" variant="ghost" icon={<Pencil size={13} />} />
                        </Link>
                        {hasPermission("Products", "delete") && (
                          <Button size="icon-sm" variant="ghost" icon={<Trash2 size={13} className="text-red-500" />} onClick={() => setConfirmId(product._id)} />
                        )}
                      </div>
                    </Td>
                  </tr>
                );
              })
            )}
          </tbody>
        </Table>

        {!loading && totalPages > 1 && (
          <div className="px-6 py-3 border-t border-gray-100">
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={p => { setCurrentPage(p); window.scrollTo(0, 0); }} />
          </div>
        )}
      </Card>

      <ConfirmModal
        open={!!confirmId}
        onClose={() => setConfirmId(null)}
        onConfirm={handleDelete}
        loading={deleteLoading}
        title="Delete Product"
        message="This will permanently delete the product and all associated data."
      />
    </div>
  );
};

export default Products;

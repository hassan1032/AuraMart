import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { request } from "../../../../api/request";
import { ApiEndpoints } from "../../../../api/apis";
import { showError, showSuccess } from "../../../../utils/toastManager";
import { toast } from "react-toastify";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardBody } from "../../../ui/Card";
import { Table, Th, Td, TableSkeleton, TableEmpty } from "../../../ui/Table";
import { Pagination } from "../../../ui/Pagination";
import { Eye, Trash2 } from "lucide-react";

const CustomizationProduct = () => {
  const [customizedData, setCustomizedData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState([]);
  const limit = 10;

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(customizedData.length / limit)) setCurrentPage(newPage);
  };

  useEffect(() => { fetchCustomizeData(); }, []);

  const fetchCustomizeData = async () => {
    setLoading(true);
    try {
      const [data, error] = await request({ method: "GET", url: ApiEndpoints.PRODUCTS_MANAGEMENT.ALLCUSTOMIZE });
      if (error) throw new Error("Failed to fetch data" || error.message);
      const allData = Array.isArray(data?.data) ? data.data : [];
      setCustomizedData(allData);
      setCurrentPage(1);
      if (allData.length > 0 && !sessionStorage.getItem("customizeProduct")) {
        showSuccess("Customization data fetched successfully!");
        sessionStorage.setItem("customizeProduct", true);
      }
    } catch (error) {
      showError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!id) { toast.error("Missing Id to delete"); return; }
    try {
      const [data, error] = await request({ method: "DELETE", url: ApiEndpoints.PRODUCTS_MANAGEMENT.DELETECUSTOMIZE(id) });
      if (error) throw new Error("Failed to delete" || error.message);
      setCustomizedData(prev => prev.filter(item => item._id !== id));
      showSuccess("Customization data deleted");
    } catch (error) {
      showError("Something went wrong!" || error.message);
    }
  };

  useEffect(() => {
    const start = (currentPage - 1) * limit;
    setPaginatedData(customizedData.slice(start, start + limit));
  }, [customizedData, currentPage]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customization"
        subtitle="View and manage product customization requests"
        breadcrumbs={[{ label: "Products" }, { label: "Customization" }]}
      />

      <Card>
        <CardBody className="p-0">
          <Table>
            <thead>
              <tr>
                <Th>SL</Th>
                <Th>Product Name</Th>
                <Th>Message</Th>
                <Th>Email</Th>
                <Th>Contact</Th>
                <Th className="text-center">Action</Th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableSkeleton rows={5} cols={6} />
              ) : paginatedData.length === 0 ? (
                <TableEmpty colSpan={6} message="No customization requests found" />
              ) : (
                paginatedData.map((item, index) => (
                  <tr key={item._id || index}>
                    <Td>{(currentPage - 1) * limit + index + 1}</Td>
                    <Td className="font-medium text-gray-900">{item.name}</Td>
                    <Td className="max-w-xs">
                      <span className="text-gray-600 text-sm">
                        {item.message?.length > 60 ? item.message.slice(0, 60) + "..." : item.message}
                      </span>
                    </Td>
                    <Td>{item.email}</Td>
                    <Td>{item.contact}</Td>
                    <Td className="text-center">
                      <div className="flex gap-1 justify-center">
                        <Link to={`/admin/product/customize/view/${item._id}`}>
                          <button className="w-8 h-8 rounded-full border border-[#E63946]/30 text-[#E63946] hover:bg-[#FFF1F1] flex items-center justify-center">
                            <Eye size={13} />
                          </button>
                        </Link>
                        <button
                          onClick={() => handleDelete(item._id)}
                          className="w-8 h-8 rounded-full border border-red-200 text-red-500 hover:bg-red-50 flex items-center justify-center"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </Td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </CardBody>
      </Card>

      <Pagination currentPage={currentPage} totalItems={customizedData.length} limit={limit} onPageChange={handlePageChange} />
    </div>
  );
};

export default CustomizationProduct;

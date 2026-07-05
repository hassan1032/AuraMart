import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { request } from "../../../../api/request";
import { ApiEndpoints } from "../../../../api/apis";
import { toast } from "react-toastify";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../../ui/Card";
import { Badge } from "../../../ui/Badge";
import { Loader } from "../../../ui/Loader";
import { Package, Tag } from "lucide-react";

const CustomizationView = () => {
  const { _id } = useParams();
  const [product, setProduct] = useState(null);
  const [activeColorTab, setActiveColorTab] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const [response, error] = await request({ method: "GET", url: ApiEndpoints.PRODUCTS_MANAGEMENT.GET_SINGLE_CUSTOMIZATION(_id) });
        if (error) throw new Error("Failed to fetch data");
        setProduct(response.data);
        if (response.data?.product?.colorImages?.length > 0) {
          setActiveColorTab(response.data.product.colorImages[0].color);
        }
      } catch (error) {
        toast.error("Failed to fetch product details: " + error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [_id]);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader size="lg" />
    </div>
  );

  const colorImages = product?.product?.colorImages || [];
  const activeImages = colorImages.filter(img => img.color === activeColorTab);

  return (
    <div className="space-y-6">
      <PageHeader
        title="View Customization"
        subtitle="Customization request details"
        breadcrumbs={[{ label: "Products" }, { label: "Customization", href: "/admin/product/customize" }, { label: "View" }]}
      />

      {/* Customer Info */}
      <Card>
        <CardBody>
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">{product?.name}</h2>
              <p className="text-sm text-gray-500 mt-1">{product?.orders || 0} Orders</p>
            </div>
          </div>
          <hr className="my-4" />
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs text-gray-500 mb-1">Email</p>
              <p className="text-sm text-gray-900">{product?.email || "N/A"}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-1">Contact</p>
              <p className="text-sm text-gray-900">{product?.contact || "N/A"}</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-xs text-gray-500 mb-1">Message</p>
              <p className="text-sm text-gray-700">{product?.message || "No message"}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Information */}
        <Card>
          <CardHeader><CardTitle>General Information</CardTitle></CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-2">Colors</p>
                {product?.product?.selectColor?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {product.product.selectColor.map(({ color, code }, index) => (
                      <span key={index} className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 text-sm text-gray-700 bg-gray-50">
                        <span style={{ backgroundColor: code, width: 14, height: 14, borderRadius: "50%", border: "1px solid #ccc", display: "inline-block" }} />
                        {color}
                      </span>
                    ))}
                  </div>
                ) : <span className="text-sm text-gray-400">N/A</span>}
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">Collections</p>
                {product?.product?.selectCollection?.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {product.product.selectCollection.map((col, index) => (
                      <Badge key={index} variant="success">{col}</Badge>
                    ))}
                  </div>
                ) : <span className="text-sm text-gray-400">N/A</span>}
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">Sizes</p>
                {product?.product?.selectSize?.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {product.product.selectSize.map((size, index) => (
                      <Badge key={index} variant="warning">{size}</Badge>
                    ))}
                  </div>
                ) : <span className="text-sm text-gray-400">N/A</span>}
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">Accessories</p>
                {product?.product?.accessories?.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {product.product.accessories.map((acc, index) => (
                      <Badge key={index} variant="danger">{acc.name}</Badge>
                    ))}
                  </div>
                ) : <span className="text-sm text-gray-400">N/A</span>}
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">SKU</p>
                <span className="inline-block px-2 py-0.5 rounded bg-gray-800 text-white text-xs">{product?.product?.productSKU || "N/A"}</span>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <Badge variant={product?.product?.status === "Active" ? "success" : "secondary"}>{product?.product?.status || "N/A"}</Badge>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Price Information */}
        <Card>
          <CardHeader><CardTitle>Price Information</CardTitle></CardHeader>
          <CardBody className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Country</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Currency</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Buying</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Selling</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Stock</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {product?.prices?.map((price) => (
                    <tr key={price._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-gray-700">{price.country}</td>
                      <td className="px-4 py-3 text-gray-700">{price.currency}</td>
                      <td className="px-4 py-3 text-gray-700">{price.buyingPrice}</td>
                      <td className="px-4 py-3 text-gray-700">{price.sellingPrice}</td>
                      <td className="px-4 py-3 text-gray-700">{price.stockQuantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Product Images */}
      <Card>
        <CardHeader><CardTitle><div className="flex items-center gap-2"><Package size={14} className="text-[#E63946]" /> Product Images</div></CardTitle></CardHeader>
        <CardBody>
          {colorImages.length > 0 && (
            <>
              <div className="flex gap-2 flex-wrap mb-4">
                {colorImages.map((colorObj, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveColorTab(colorObj.color)}
                    className={`px-4 py-1.5 text-sm rounded-full border transition-colors ${activeColorTab === colorObj.color ? "bg-[#E63946] text-white border-[#E63946]" : "border-gray-300 text-gray-600 hover:bg-gray-50"}`}
                  >
                    {colorObj.color}
                  </button>
                ))}
              </div>

              {activeImages.map((image, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-6">
                  <div className="relative w-full max-w-sm">
                    <img src={image.thumbnail} alt={image.color} className="w-full h-80 object-cover rounded-xl border border-gray-100" />
                    <span className={`absolute top-3 right-3 px-2 py-0.5 text-xs font-semibold rounded-full ${image.isDefault ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {image.isDefault ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>

                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Additional Images</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {image.additionalThumbnail?.map((thumb, idx) => (
                        <img key={idx} src={thumb} alt={`${image.color} additional ${idx}`} className="w-full h-28 object-cover rounded-lg border border-gray-100" />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </>
          )}
        </CardBody>
      </Card>

      {/* Description */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Description</CardTitle></CardHeader>
          <CardBody>
            <p className="text-sm text-gray-700 leading-relaxed">{product?.product?.detailedDescription || "No description available."}</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader><CardTitle>Additional Information</CardTitle></CardHeader>
          <CardBody>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{product?.product?.additionalInformation || "No additional information."}</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default CustomizationView;

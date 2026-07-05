import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { request } from "../../../../api/request";
import { ApiEndpoints } from "../../../../api/apis";
import { PageHeader } from "../../../ui/PageHeader";
import { Card, CardHeader, CardTitle, CardBody } from "../../../ui/Card";
import { Badge } from "../../../ui/Badge";
import { Loader } from "../../../ui/Loader";
import { Globe, Star, Package } from "lucide-react";

const ProductDetails = () => {
  const { _id } = useParams();
  const [product, setProduct] = useState({});
  const [activeColorTab, setActiveColorTab] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const [response, error] = await request({
          method: "GET",
          url: ApiEndpoints.PRODUCTS_MANAGEMENT.GET_PRODUCT(_id),
        });
        if (Array.isArray(response?.data) && response.data.length > 0) {
          const data = response.data[0];
          setProduct(data);
          if (data.colorImages?.length > 0) {
            const def = data.colorImages.find((c) => c.isDefault) || data.colorImages[0];
            setActiveColorTab(def.color);
          }
        }
      } catch (error) {
        console.error("Failed to fetch product details:", error);
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

  const defaultColor = product.colorImages?.find((c) => c.isDefault) || product.colorImages?.[0];
  const activeImages = (product.colorImages || []).filter((img) => img.color === activeColorTab);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Product Details"
        subtitle="View product information and images"
        breadcrumbs={[{ label: "Products", href: "/admin/products" }, { label: "Details" }]}
      />

      {/* Header card: thumbnail + stats + name */}
      <Card>
        <CardBody>
          <div className="flex gap-4 flex-wrap">
            {/* Default thumbnail */}
            <div className="flex flex-col items-center gap-3 flex-shrink-0">
              <div className="w-36 h-36 rounded-xl border border-gray-100 overflow-hidden bg-gray-50">
                {defaultColor?.thumbnail && (
                  <img src={defaultColor.thumbnail} alt={product.productName} className="w-full h-full object-cover" />
                )}
              </div>
              <Link to={`/products/${product._id}/details`} target="_blank" rel="noopener noreferrer">
                <button type="button" className="flex items-center gap-1.5 px-4 py-1.5 text-sm border border-[#E63946]/30 text-[#E63946] rounded-lg hover:bg-[#FFF1F1] transition-colors">
                  <Globe size={13} /> View Live
                </button>
              </Link>
            </div>

            {/* Right section */}
            <div className="flex-1 min-w-0">
              {/* Additional thumbnails + stats row */}
              <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                <div className="flex gap-2 flex-wrap">
                  {defaultColor?.additionalThumbnail?.map((thumb, idx) => (
                    <img key={idx} src={thumb} alt={`Additional ${idx + 1}`} className="w-16 h-16 rounded-lg border border-gray-100 object-cover" />
                  ))}
                </div>
                <div className="flex items-center gap-3 border border-gray-200 rounded-lg px-4 py-2 text-sm font-semibold text-gray-700">
                  <span>{product.orders || 0} Orders</span>
                  <span className="w-px h-4 bg-gray-200" />
                  <span className="flex items-center gap-1"><Star size={13} className="text-yellow-400 fill-yellow-400" /> {product.rating || "0.0"}</span>
                  <span className="w-px h-4 bg-gray-200" />
                  <span>{product.reviews || 0} Reviews</span>
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-1">{product.productName}</h2>
              <p className="text-sm text-gray-500">{product.shortDescription}</p>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* General Info + Prices */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Information */}
        <Card>
          <CardHeader><CardTitle>General Information</CardTitle></CardHeader>
          <CardBody>
            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-2">Colors</p>
                {product.selectColor?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {product.selectColor.map(({ color, code }, idx) => (
                      <span key={idx} className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-gray-200 text-sm text-gray-700 bg-gray-50">
                        <span style={{ backgroundColor: code, width: 14, height: 14, borderRadius: "50%", border: "1px solid #ccc", display: "inline-block" }} />
                        {color}
                      </span>
                    ))}
                  </div>
                ) : <span className="text-sm text-gray-400">N/A</span>}
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">Collection</p>
                {product.selectCollection?.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {product.selectCollection.map((col, idx) => (
                      <Badge key={idx} variant="success">{col}</Badge>
                    ))}
                  </div>
                ) : <span className="text-sm text-gray-400">N/A</span>}
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">Size</p>
                {product.selectSize?.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {product.selectSize.map((s, idx) => (
                      <Badge key={idx} variant="warning">{s}</Badge>
                    ))}
                  </div>
                ) : <span className="text-sm text-gray-400">N/A</span>}
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-2">Accessories with Product</p>
                {product.accessories?.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {product.accessories.map((acc, idx) => (
                      <Badge key={idx} variant="danger">{acc.name}</Badge>
                    ))}
                  </div>
                ) : <span className="text-sm text-gray-400">N/A</span>}
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">SKU</p>
                <span className="inline-block px-2 py-0.5 rounded bg-gray-800 text-white text-xs">{product.productSKU || "N/A"}</span>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Status</p>
                <Badge variant={product.status === "Active" ? "success" : "secondary"}>{product.status || "N/A"}</Badge>
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
                  {product.prices?.map((price) => (
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
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-2"><Package size={14} className="text-[#E63946]" /> Product Images</div>
          </CardTitle>
        </CardHeader>
        <CardBody>
          {(product.colorImages?.length || 0) > 0 ? (
            <>
              {/* Color tabs */}
              <div className="flex flex-wrap gap-1 border-b border-gray-200 mb-6">
                {product.colorImages.map((colorObj, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setActiveColorTab(colorObj.color)}
                    className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
                      activeColorTab === colorObj.color
                        ? "border-[#E63946] text-[#E63946]"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {colorObj.color}
                  </button>
                ))}
              </div>

              {activeImages.map((image, idx) => (
                <div key={idx} className="flex flex-col md:flex-row gap-6">
                  {/* Main thumbnail */}
                  <div className="relative w-full max-w-sm flex-shrink-0 overflow-hidden rounded-xl border border-gray-100">
                    <img
                      src={image.thumbnail}
                      alt={image.color}
                      className="w-full h-96 md:h-[500px] object-cover"
                    />
                    <span className={`absolute top-3 right-3 px-2 py-0.5 text-xs font-semibold rounded-full ${image.isDefault ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                      {image.isDefault ? "ACTIVE" : "INACTIVE"}
                    </span>
                  </div>

                  {/* Additional thumbnails */}
                  <div className="flex-1">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Additional Images</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {image.additionalThumbnail?.map((thumb, tidx) => (
                        <img
                          key={tidx}
                          src={thumb}
                          alt={`${image.color} additional ${tidx}`}
                          className="w-full h-36 object-cover rounded-xl border border-gray-100"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : (
            <p className="text-sm text-gray-400 text-center py-8">No images available</p>
          )}
        </CardBody>
      </Card>

      {/* Description + Additional Info */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Description</CardTitle></CardHeader>
          <CardBody>
            <p className="text-sm text-gray-700 leading-relaxed">{product.detailedDescription || "No description available."}</p>
          </CardBody>
        </Card>
        <Card>
          <CardHeader><CardTitle>Additional Information</CardTitle></CardHeader>
          <CardBody>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{product.additionalInformation || "No additional information."}</p>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default ProductDetails;

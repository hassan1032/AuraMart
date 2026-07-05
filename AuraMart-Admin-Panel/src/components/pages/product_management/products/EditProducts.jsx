import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import JoditEditor from 'jodit-react';
import { X } from 'lucide-react';
import { request } from '../../../../api/request';
import { ApiEndpoints } from '../../../../api/apis';
import { showSuccess } from '../../../../utils/toastManager';
import { PageHeader } from '../../../ui/PageHeader';
import { Card, CardBody } from '../../../ui/Card';
import { Loader } from '../../../ui/Loader';

const countries = [
  { code: "UK", currency: "£" },
  { code: "DUBAI", currency: "د. إ" },
  { code: "IND", currency: "₹" },
  { code: "ITALY", currency: "€" },
];

const initialFormData = {
  productName: "",
  shortDescription: "",
  detailedDescription: "",
  additionalInformation: "",
  selectCollection: [],
  selectColor: [],
  selectSize: [],
  productSKU: "",
  accessories: [],
  colorImages: [],
  prices: countries.map((c) => ({
    country: c.code,
    currency: c.currency,
    buyingPrice: "",
    sellingPrice: "",
    stockQuantity: "",
    minimumQuantity: "",
  })),
};

const inputCls = "w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white";
const labelCls = "block text-sm font-medium text-gray-700 mb-1";
const fileCls = "w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#FFF1F1] file:text-[#E63946] hover:file:bg-[#FFF1F1] border border-gray-300 rounded-lg cursor-pointer";

const EditProducts = () => {
  const navigate = useNavigate();
  const { _id } = useParams();
  const [activeTab, setActiveTab] = useState(countries[0].code);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [collections, setCollections] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [accessoriesList, setAccessoriesList] = useState([]);
  const [priceErrors, setPriceErrors] = useState({});
  const [activeColorTab, setActiveColorTab] = useState("");
  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const getDropdownData = async () => {
      try {
        setFetching(true);
        const [collectionData] = await request({ method: "GET", url: ApiEndpoints.PRODUCTS_MANAGEMENT.ALL_COLLECTION });
        const [sizeData] = await request({ method: "GET", url: ApiEndpoints.PRODUCT_VARIANT.ALL_SIZE });
        const [colorData] = await request({ method: "GET", url: ApiEndpoints.PRODUCT_VARIANT.ALL_COLOR });
        const [accessoryData] = await request({ method: "GET", url: ApiEndpoints.PRODUCTS_MANAGEMENT.ALL_ACCESSORY });
        if (Array.isArray(collectionData?.data)) setCollections(collectionData.data);
        if (Array.isArray(sizeData?.data)) setSizes(sizeData.data);
        if (Array.isArray(colorData?.data)) setColors(colorData.data);
        if (Array.isArray(accessoryData?.data)) setAccessoriesList(accessoryData.data);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setFetching(false);
      }
    };
    getDropdownData();
  }, []);

  useEffect(() => {
    if (!_id) return;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const [data, error] = await request({ method: "GET", url: ApiEndpoints.PRODUCTS_MANAGEMENT.GET_PRODUCT(_id) });
        if (error) { toast.error("Failed to fetch product"); return; }
        const product = data?.data?.[0];
        if (!product) return;

        const mergedPrices = countries.map((c) => {
          const existing = product.prices?.find((p) => p.country === c.code);
          return existing
            ? { country: c.code, currency: c.currency, buyingPrice: existing.buyingPrice || "", sellingPrice: existing.sellingPrice || "", stockQuantity: existing.stockQuantity || "", minimumQuantity: existing.minimumQuantity || "" }
            : { country: c.code, currency: c.currency, buyingPrice: "", sellingPrice: "", stockQuantity: "", minimumQuantity: "" };
        });

        const colorImages = (product.colorImages || []).map((ci) => ({
          color: ci.color,
          code: ci.code,
          thumbnail: ci.thumbnail || null,
          additionalThumbnail: ci.additionalThumbnail || [],
          video: ci.video || null,
          isDefault: !!ci.isDefault,
        }));

        setFormData({
          productName: product.productName || "",
          shortDescription: product.shortDescription || "",
          detailedDescription: product.detailedDescription || "",
          additionalInformation: product.additionalInformation || "",
          selectCollection: product.selectCollection || [],
          selectColor: (product.selectColor || []).map((c) => typeof c === "object" ? c : { color: c, code: "" }),
          selectSize: product.selectSize || [],
          productSKU: product.productSKU || "",
          accessories: (product.accessories || []).map((a) => typeof a === "object" ? a : { _id: a, name: a }),
          colorImages,
          prices: mergedPrices,
        });

        if (colorImages.length > 0) {
          const def = colorImages.find((c) => c.isDefault) || colorImages[0];
          setActiveColorTab(def.color);
        }
      } catch (error) {
        toast.error(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [_id]);

  const handleAccessoryChange = (e) => {
    const value = e.target.value;
    if (!value) return;
    const found = accessoriesList.find((a) => a._id === value);
    if (!found) return;
    setFormData((prev) => {
      if (prev.accessories.some((a) => a._id === found._id)) return prev;
      return { ...prev, accessories: [...prev.accessories, { _id: found._id, name: found.accessoryName }] };
    });
    e.target.value = "";
  };

  const handleAccessoryRemove = (accId) => {
    setFormData((prev) => ({ ...prev, accessories: prev.accessories.filter((a) => a._id !== accId) }));
  };

  const handleInputPriceChange = (countryCode, field, value) => {
    setFormData((prev) => {
      const updatedPrices = prev.prices.map((p) => p.country === countryCode ? { ...p, [field]: value } : p);
      setPriceErrors((prevErrors) => {
        const updated = { ...prevErrors };
        if (!updated[countryCode]) updated[countryCode] = {};
        if (!value || value.toString().trim() === "") {
          updated[countryCode][field] = `${field} is required`;
        } else {
          delete updated[countryCode][field];
        }
        if (updated[countryCode] && Object.keys(updated[countryCode]).length === 0) delete updated[countryCode];
        return updated;
      });
      return { ...prev, prices: updatedPrices };
    });
  };

  const handleDefaultImageChange = (color) => {
    setFormData((prev) => ({
      ...prev,
      colorImages: prev.colorImages.map((ci) => ({ ...ci, isDefault: ci.color === color })),
    }));
  };

  const handleSelectColor = (e) => {
    const selectedValue = e.target.value;
    if (!selectedValue) return;
    const [color, code] = selectedValue.split("|");
    setFormData((prev) => {
      if (prev.selectColor.some((c) => c.color === color)) return prev;
      return { ...prev, selectColor: [...prev.selectColor, { color, code }] };
    });
  };

  useEffect(() => {
    setFormData((prev) => {
      const selectedColors = prev.selectColor;
      let updated = [...prev.colorImages];
      selectedColors.forEach((c) => {
        if (!updated.some((ci) => ci.color === c.color)) {
          updated.push({ color: c.color, code: c.code, thumbnail: null, additionalThumbnail: [], video: null, isDefault: false });
        }
      });
      updated = updated.filter((ci) => selectedColors.some((c) => c.color === ci.color));
      return { ...prev, colorImages: updated };
    });
  }, [formData.selectColor]);

  useEffect(() => {
    if (formData.colorImages.length > 0 && !formData.colorImages.some((c) => c.color === activeColorTab)) {
      setActiveColorTab(formData.colorImages[0].color);
    }
  }, [formData.colorImages]);

  const joditConfig = {
    readonly: false,
    placeholder: "Enter additional information...",
    minHeight: 200,
    toolbarAdaptive: false,
    toolbarSticky: false,
    askBeforePasteFromWord: false,
    askBeforePasteHTML: false,
    pasteHTMLAction: "insert_clear_html",
    events: {
      paste: (e) => {
        e.preventDefault();
        const text = e.clipboardData.getData("text/plain");
        e.target?.editor?.s.insertHTML(text.replace(/\n/g, "<br>"));
      },
    },
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const payload = new FormData();
    payload.append("productName", formData.productName);
    payload.append("productSKU", formData.productSKU);
    payload.append("shortDescription", formData.shortDescription);
    payload.append("detailedDescription", formData.detailedDescription);
    payload.append("additionalInformation", formData.additionalInformation);
    payload.append("selectCollection", JSON.stringify(formData.selectCollection));
    payload.append("selectColor", JSON.stringify(formData.selectColor));
    payload.append("selectSize", JSON.stringify(formData.selectSize));
    if (formData.accessories?.length > 0) {
      payload.append("accessories", JSON.stringify(formData.accessories.map((a) => a._id)));
    }
    const colorImagesMeta = formData.colorImages.map((item) => {
      const meta = {
        color: item.color,
        code: item.code,
        thumbnail: item.thumbnail instanceof File ? `${item.color}_thumbnail` : (item.thumbnail || ""),
        additionalThumbnail: [],
        video: item.video instanceof File ? `${item.color}_video` : (item.video || ""),
        isDefault: !!item.isDefault,
      };
      if (item.thumbnail instanceof File) payload.append(`${item.color}_thumbnail`, item.thumbnail);
      const additionals = (item.additionalThumbnail || []).filter((f) => f instanceof File || (typeof f === "string" && f.startsWith("http")));
      additionals.forEach((f) => {
        if (f instanceof File) {
          payload.append(`${item.color}_additional`, f);
          meta.additionalThumbnail.push(`${item.color}_additional`);
        } else {
          meta.additionalThumbnail.push(f);
        }
      });
      if (item.video instanceof File) payload.append(`${item.color}_video`, item.video);
      return meta;
    });
    payload.append("colorImages", JSON.stringify(colorImagesMeta));
    payload.append("prices", JSON.stringify(formData.prices));

    try {
      setLoading(true);
      const [data, error] = await request({ method: "PUT", url: ApiEndpoints.PRODUCTS_MANAGEMENT.UPDATE_PRODUCT(_id), data: payload });
      if (error) { toast.error("Failed to update product" || error.message); return; }
      showSuccess("Product updated successfully!");
      navigate("/admin/products");
    } catch (err) {
      toast.error("Something went wrong!" || err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading || fetching) return (
    <div className="flex items-center justify-center h-64">
      <Loader size="lg" />
    </div>
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Product"
        subtitle="Update product details, pricing and images"
        breadcrumbs={[{ label: "Products", href: "/admin/products" }, { label: "Edit" }]}
      />

      <form encType="multipart/form-data" onSubmit={handleFormSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardBody>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Product Name <span className="text-red-500">*</span></label>
                <input type="text" name="productName" className={inputCls} placeholder="Enter Product Name" required value={formData.productName} onChange={handleInputChange} />
              </div>
              <div>
                <label className={labelCls}>Short Description <span className="text-red-500">*</span></label>
                <textarea name="shortDescription" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white resize-y" rows={2} value={formData.shortDescription} onChange={handleInputChange} placeholder="Enter short description" required />
              </div>
              <div>
                <label className={labelCls}>Description <span className="text-red-500">*</span></label>
                <textarea name="detailedDescription" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white resize-y" rows={4} value={formData.detailedDescription} onChange={handleInputChange} placeholder="Enter description" required />
              </div>
              <div>
                <label className={labelCls}>Additional Information</label>
                <JoditEditor
                  value={formData?.additionalInformation}
                  config={joditConfig}
                  onBlur={(newContent) =>
                    setFormData((prev) => ({
                      ...prev,
                      additionalInformation: newContent.replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>/gi, "\n").replace(/<[^>]+>/g, "").trim(),
                    }))
                  }
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* General Information */}
        <Card>
          <CardBody>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-3 mb-5">General Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">

              {/* Collection */}
              <div>
                <label className={labelCls}>Select Collection <span className="text-red-500">*</span></label>
                <select value="" onChange={(e) => { const v = e.target.value; if (v && !formData.selectCollection.includes(v)) setFormData((prev) => ({ ...prev, selectCollection: [...prev.selectCollection, v] })); }} className={inputCls}>
                  <option value="" disabled>Select Collection</option>
                  {Array.isArray(collections) && collections.length > 0
                    ? collections.map((co) => <option key={co?._id} value={co?.name}>{co?.name}</option>)
                    : <option disabled>No collections available</option>}
                </select>
                {formData.selectCollection?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {formData.selectCollection.map((name) => (
                      <span key={name} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E63946] text-white text-xs font-medium">
                        {name}
                        <button type="button" onClick={() => setFormData((prev) => ({ ...prev, selectCollection: prev.selectCollection.filter((c) => c !== name) }))} className="hover:text-white/70"><X size={10} /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Color */}
              <div>
                <label className={labelCls}>Select Color</label>
                <select value="" onChange={handleSelectColor} className={inputCls}>
                  <option value="" disabled>Select Color</option>
                  {Array.isArray(colors) && colors.length > 0
                    ? colors.map((col) => <option key={col._id} value={`${col.name}|${col.colour}`}>{col.name}</option>)
                    : <option disabled>No colors available</option>}
                </select>
                {formData.selectColor.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {formData.selectColor.map(({ color, code }) => (
                      <span key={color} className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#E63946] text-white text-xs font-medium">
                        <span style={{ width: 10, height: 10, backgroundColor: code, borderRadius: 3, display: "inline-block", border: "1px solid rgba(255,255,255,0.4)" }} />
                        {color}
                        <button type="button" onClick={() => setFormData((prev) => ({ ...prev, selectColor: prev.selectColor.filter((c) => c.color !== color) }))} className="hover:text-white/70"><X size={10} /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Size */}
              <div>
                <label className={labelCls}>Select Size</label>
                <select value="" onChange={(e) => { const v = e.target.value; if (v && !formData.selectSize.includes(v)) setFormData((prev) => ({ ...prev, selectSize: [...prev.selectSize, v] })); }} className={inputCls}>
                  <option value="" disabled>Select Size</option>
                  {Array.isArray(sizes) && sizes.length > 0
                    ? sizes.map((sz) => <option key={sz?._id} value={sz?.name}>{sz?.name}</option>)
                    : <option disabled>No sizes available</option>}
                </select>
                {formData.selectSize.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {formData.selectSize.map((name) => (
                      <span key={name} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E63946] text-white text-xs font-medium">
                        {name}
                        <button type="button" onClick={() => setFormData((prev) => ({ ...prev, selectSize: prev.selectSize.filter((s) => s !== name) }))} className="hover:text-white/70"><X size={10} /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Accessories */}
              <div>
                <label className={labelCls}>Accessories Pair with Products</label>
                <select value="" onChange={handleAccessoryChange} className={inputCls}>
                  <option value="" disabled>Select an accessory</option>
                  {Array.isArray(accessoriesList) && accessoriesList.length > 0
                    ? accessoriesList.map((acc) => <option key={acc._id} value={acc._id}>{acc.accessoryName}</option>)
                    : <option value="">No Accessories Found</option>}
                </select>
                {formData.accessories.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {formData.accessories.map((acc) => (
                      <span key={acc._id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E63946] text-white text-xs font-medium">
                        {acc.name}
                        <button type="button" onClick={() => handleAccessoryRemove(acc._id)} className="hover:text-white/70"><X size={10} /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* SKU */}
              <div>
                <label className={labelCls}>Product SKU <span className="text-red-500">*</span></label>
                <input type="text" placeholder="Ex: 134543" className={inputCls} value={formData.productSKU}
                  onChange={(e) => setFormData((prev) => ({ ...prev, productSKU: e.target.value.replace(/[^0-9]/g, "") }))}
                />
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Price Information */}
        <Card>
          <CardBody>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-3 mb-4">Price Information</h3>
            <div className="flex gap-1 border-b border-gray-200">
              {countries.map((loc) => (
                <button key={loc.code} type="button" onClick={() => setActiveTab(loc.code)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${activeTab === loc.code ? "border-[#E63946] text-[#E63946]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                >
                  {loc.code}
                </button>
              ))}
            </div>
            {countries.map((country) =>
              activeTab === country.code ? (
                <div key={country.code} className="pt-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {["buyingPrice", "sellingPrice", "stockQuantity", "minimumQuantity"].map((field) => (
                      <div key={field}>
                        <label className="block text-xs font-medium text-gray-600 mb-1 uppercase">{field.replace(/([A-Z])/g, " $1")}</label>
                        <input
                          type="text"
                          className={`w-full h-10 px-3 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white ${priceErrors[country.code]?.[field] ? "border-red-400" : "border-gray-300"}`}
                          placeholder={field}
                          value={formData.prices.find((p) => p.country === country.code)?.[field] || ""}
                          onChange={(e) => handleInputPriceChange(country.code, field, e.target.value.replace(/[^0-9.]/g, ""))}
                          required
                        />
                        {priceErrors[country.code]?.[field] && <p className="mt-1 text-xs text-red-500">{priceErrors[country.code][field]}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null
            )}
          </CardBody>
        </Card>

        {/* Color Images */}
        <Card>
          <CardBody>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide border-b border-gray-100 pb-3 mb-2">Selected Colors Product Image</h3>
            <p className="text-sm text-gray-500 mb-4">Upload images and videos for each selected color.</p>

            {formData.colorImages.length === 0 ? (
              <p className="text-sm text-gray-400 py-6 text-center">Select colors above to upload per-color images.</p>
            ) : (
              <>
                <div className="flex flex-wrap gap-1 border-b border-gray-200">
                  {formData.colorImages.map(({ color, code }) => (
                    <button key={color} type="button" onClick={() => setActiveColorTab(color)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border-b-2 -mb-px transition-colors ${activeColorTab === color ? "border-[#E63946] text-[#E63946]" : "border-transparent text-gray-500 hover:text-gray-700"}`}
                    >
                      {color}
                      <span style={{ backgroundColor: code, width: 10, height: 10, borderRadius: 3, display: "inline-block" }} />
                    </button>
                  ))}
                </div>

                {formData.colorImages.map(({ color, thumbnail, additionalThumbnail, video, isDefault }) =>
                  activeColorTab === color ? (
                    <div key={color} className="mt-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Thumbnail */}
                        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">Thumbnail</h4>
                          <input type="file" accept="image/*" className={fileCls}
                            onChange={(e) => {
                              const file = e.target.files[0];
                              setFormData((prev) => ({
                                ...prev,
                                colorImages: prev.colorImages.map((ci) => ci.color === color ? { ...ci, thumbnail: file } : ci),
                              }));
                            }}
                          />
                          {thumbnail && (
                            <div className="relative mt-3">
                              <img
                                src={thumbnail instanceof File ? URL.createObjectURL(thumbnail) : thumbnail}
                                alt="Preview"
                                className="w-full object-cover rounded-xl border border-gray-200"
                                style={{ maxHeight: 220 }}
                              />
                              <button type="button"
                                onClick={() => setFormData((prev) => ({ ...prev, colorImages: prev.colorImages.map((ci) => ci.color === color ? { ...ci, thumbnail: null } : ci) }))}
                                className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-red-50 hover:text-red-600 shadow-sm"
                              >
                                <X size={12} />
                              </button>
                              <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-3 py-2 bg-black/50 rounded-b-xl">
                                <span className="text-xs text-amber-300 font-medium">Make Default</span>
                                <button type="button" onClick={() => handleDefaultImageChange(color)}
                                  className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${isDefault ? "bg-[#E63946]" : "bg-gray-400"}`}
                                >
                                  <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${isDefault ? "translate-x-4.5" : "translate-x-0.5"}`} />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Additional Thumbnails */}
                        <div className="md:col-span-2 border border-gray-200 rounded-xl p-4 bg-gray-50">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">Additional Thumbnails</h4>
                          <input type="file" multiple accept="image/*" className={fileCls}
                            onChange={(e) => {
                              const files = Array.from(e.target.files);
                              setFormData((prev) => ({
                                ...prev,
                                colorImages: prev.colorImages.map((ci) =>
                                  ci.color === color ? { ...ci, additionalThumbnail: [...(ci.additionalThumbnail || []), ...files] } : ci
                                ),
                              }));
                            }}
                          />
                          {(additionalThumbnail || []).filter((f) => f instanceof File || (typeof f === "string" && f.startsWith("http"))).length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {(additionalThumbnail || [])
                                .filter((f) => f instanceof File || (typeof f === "string" && f.startsWith("http")))
                                .map((file, idx) => (
                                  <div key={idx} className="relative">
                                    <img src={file instanceof File ? URL.createObjectURL(file) : file} alt="Additional" className="w-24 h-24 object-cover rounded-lg border border-gray-200" />
                                    <button type="button"
                                      onClick={() => setFormData((prev) => ({
                                        ...prev,
                                        colorImages: prev.colorImages.map((ci) =>
                                          ci.color === color ? { ...ci, additionalThumbnail: ci.additionalThumbnail.filter((_, i) => i !== idx) } : ci
                                        ),
                                      }))}
                                      className="absolute top-1 right-1 w-5 h-5 bg-red-600 rounded-full flex items-center justify-center text-white shadow-sm"
                                    >
                                      <X size={10} />
                                    </button>
                                  </div>
                                ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Video */}
                      <div className="border border-gray-200 rounded-xl p-4 bg-gray-50 max-w-md">
                        <h4 className="text-sm font-semibold text-gray-700 mb-3">Video</h4>
                        <input type="file" accept="video/*" className={fileCls}
                          onChange={(e) => {
                            const file = e.target.files[0];
                            setFormData((prev) => ({
                              ...prev,
                              colorImages: prev.colorImages.map((ci) => ci.color === color ? { ...ci, video: file } : ci),
                            }));
                          }}
                        />
                        {video && (
                          <div className="relative mt-3">
                            <video src={video instanceof File ? URL.createObjectURL(video) : video} controls className="w-full max-h-48 rounded-lg border border-gray-200" />
                            <button type="button"
                              onClick={() => setFormData((prev) => ({ ...prev, colorImages: prev.colorImages.map((ci) => ci.color === color ? { ...ci, video: null } : ci) }))}
                              className="absolute top-2 right-2 w-6 h-6 bg-red-600 rounded-full flex items-center justify-center text-white shadow-sm"
                            >
                              <X size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : null
                )}
              </>
            )}
          </CardBody>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3 pb-4">
          <button type="button" onClick={() => setFormData(initialFormData)} className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">Reset</button>
          <button type="submit" className="px-6 py-2 text-sm font-medium bg-[#E63946] text-white rounded-lg hover:bg-[#C5303A] disabled:opacity-60 transition-colors flex items-center gap-2" disabled={loading}>
            {loading ? <Loader size="sm" /> : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProducts;

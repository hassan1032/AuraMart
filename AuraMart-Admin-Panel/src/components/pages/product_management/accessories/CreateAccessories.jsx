import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import JoditEditor from 'jodit-react';
import { X } from 'lucide-react';
import { request } from '../../../../api/request';
import { ApiEndpoints } from '../../../../api/apis';
import { showSuccess, showError } from '../../../../utils/toastManager';
import { PageHeader } from '../../../ui/PageHeader';
import { Card, CardBody } from '../../../ui/Card';
import { Loader } from '../../../ui/Loader';

const countries = [
  { code: "UK", currency: "£" },
  { code: "DUBAI", currency: "د. إ" },
  { code: "IND", currency: "₹" },
  { code: "ITALY", currency: "€" },
];

const initialAdditionalPreviews = [null];

const initialFormData = {
  accessoryName: "",
  shortDescription: "",
  detailedDescription: "",
  additionalInformation: "",
  selectAccessoryType: [],
  selectColor: [],
  selectSize: [],
  product: [],
  accessorySKU: "",
  colorImages: [],
  prices: countries.map((c) => ({
    country: c.code,
    currency: c.currency,
    buyingPrice: "",
    sellingPrice: "",
    discountPrice: "",
    stockQuantity: "",
    minimumQuantity: "",
  })),
};

const inputCls = "w-full h-10 px-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white";
const labelCls = "block text-sm font-medium text-gray-700 mb-1";
const fileCls = "w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#FFF1F1] file:text-[#E63946] hover:file:bg-[#FFF1F1] border border-gray-300 rounded-lg cursor-pointer";

const CreateAccessories = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(countries[0].code);
  const [additionalPreviews, setAdditionalPreviews] = useState(initialAdditionalPreviews);
  const [loading, setLoading] = useState(false);
  const [accessoriesType, setAccessoriesType] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [product, setProduct] = useState([]);
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
        const [accessoryTypeData] = await request({ method: "GET", url: ApiEndpoints.PRODUCTS_MANAGEMENT.ALL_ACCESSORY_TYPE });
        const [sizeData] = await request({ method: "GET", url: ApiEndpoints.PRODUCT_VARIANT.ALL_SIZE });
        const [colorData] = await request({ method: "GET", url: ApiEndpoints.PRODUCT_VARIANT.ALL_COLOR });
        const [productData] = await request({ method: "GET", url: ApiEndpoints.PRODUCTS_MANAGEMENT.ALL_PRODUCT });
        if (Array.isArray(accessoryTypeData?.data)) setAccessoriesType(accessoryTypeData.data);
        if (Array.isArray(sizeData?.data)) setSizes(sizeData.data);
        if (Array.isArray(colorData?.data)) setColors(colorData.data);
        if (Array.isArray(productData?.data)) setProduct(productData.data);
      } catch (error) {
        toast.error(error.message);
      }
    };
    getDropdownData();
  }, []);

  const handleProductChange = (e) => {
    const value = e.target.value;
    if (!value) return;
    if (!formData.product.includes(value)) {
      setFormData((prev) => ({ ...prev, product: [...prev.product, value] }));
    }
    e.target.value = "";
  };

  const handleProductRemove = (prodId) => {
    setFormData((prev) => ({ ...prev, product: prev.product.filter((id) => id !== prodId) }));
  };

  const handleInputPriceChange = (countryCode, field, value) => {
    setFormData((prev) => {
      const updatedPrices = prev.prices.map((p) => p.country === countryCode ? { ...p, [field]: value } : p);
      const newForm = { ...prev, prices: updatedPrices };
      setPriceErrors((prevErrors) => {
        const updated = { ...prevErrors };
        if (!updated[countryCode]) updated[countryCode] = {};
        if (!value || value.toString().trim() === "") {
          updated[countryCode][field] = `${field} is required`;
        } else {
          delete updated[countryCode][field];
        }
        if (field === "discountPrice" || field === "sellingPrice") {
          const priceObj = newForm.prices.find((p) => p.country === countryCode) || {};
          if (Number(priceObj.discountPrice || 0) > Number(priceObj.sellingPrice || 0)) {
            updated[countryCode]["discountPrice"] = "Discount price cannot be greater than selling price";
          } else {
            delete updated[countryCode]["discountPrice"];
          }
        }
        if (updated[countryCode] && Object.keys(updated[countryCode]).length === 0) delete updated[countryCode];
        return updated;
      });
      return newForm;
    });
  };

  useEffect(() => {
    return () => {
      additionalPreviews.forEach((url) => { if (url) URL.revokeObjectURL(url); });
    };
  }, []);

  const handleBarcode = async () => {
    try {
      const [data, error] = await request({ method: "POST", url: ApiEndpoints.PRODUCTS_MANAGEMENT.SKU_CODE });
      if (error) { toast.error("Failed to generate " || error.message); return; }
      if (data?.sku) setFormData((prev) => ({ ...prev, accessorySKU: data.sku }));
      showSuccess("Barcode generated", true);
    } catch (error) {
      toast.error(error.message || "Something went wrong!");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await handleSubmit(countries.map((c) => c.code));
  };

  const handleReset = () => {
    setFormData(initialFormData);
    setAdditionalPreviews(initialAdditionalPreviews);
  };

  const handleSubmit = async (selectedCountries) => {
    setLoading(true);
    const filteredPrices = formData.prices.filter((p) => selectedCountries.includes(p.country));
    const payload = new FormData();
    payload.append("accessoryName", formData.accessoryName);
    payload.append("accessorySKU", formData.accessorySKU);
    payload.append("additionalInformation", formData.additionalInformation);
    payload.append("shortDescription", formData.shortDescription);
    payload.append("detailedDescription", formData.detailedDescription);
    payload.append("selectAccessoryType", JSON.stringify(formData.selectAccessoryType));
    payload.append("selectColor", JSON.stringify(formData.selectColor));
    payload.append("selectSize", JSON.stringify(formData.selectSize));
    if (formData.product.length > 0) payload.append("product", JSON.stringify(formData.product));
    const colorImagesMeta = formData.colorImages.map((item) => {
      const meta = { color: item.color, code: item.code, accessoryThumbnail: "", additionalThumbnail: [], video: "", isDefault: !!item.isDefault };
      if (item.accessoryThumbnail) { meta.accessoryThumbnail = `${item.color}_accessoryThumbnail`; payload.append(`${item.color}_accessoryThumbnail`, item.accessoryThumbnail); }
      if (item.additionalThumbnail?.length) {
        meta.additionalThumbnail = item.additionalThumbnail.map(() => `${item.color}_additional`);
        item.additionalThumbnail.forEach((file) => payload.append(`${item.color}_additional`, file));
      }
      if (item.video) { meta.video = `${item.color}_video`; payload.append(`${item.color}_video`, item.video); }
      return meta;
    });
    payload.append("colorImages", JSON.stringify(colorImagesMeta));
    payload.append("prices", JSON.stringify(filteredPrices));
    try {
      const [data, error] = await request({ method: "POST", url: ApiEndpoints.PRODUCTS_MANAGEMENT.ADD_ACCESSORY, data: payload });
      if (error) { showError("Failed to save accessory" || error.message); return; }
      showSuccess("Accessory saved successfully!");
      navigate("/admin/product/accessories");
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
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

  const handleDefaultImageChange = (color) => {
    setFormData((prev) => ({
      ...prev,
      colorImages: prev.colorImages.map((ci) => ({ ...ci, isDefault: ci.color === color })),
    }));
  };

  useEffect(() => {
    setFormData((prev) => {
      const selectedColors = prev.selectColor;
      let updated = [...prev.colorImages];
      selectedColors.forEach((c) => {
        if (!updated.some((ci) => ci.color === c.color)) {
          updated.push({ color: c.color, code: c.code, accessoryThumbnail: null, additionalThumbnail: [], video: null, isDefault: false });
        }
      });
      updated = updated.filter((ci) => selectedColors.some((c) => c.color === ci.color));
      return { ...prev, colorImages: updated };
    });
  }, [formData.selectColor]);

  useEffect(() => {
    if (formData.colorImages.length > 0 && !activeColorTab) {
      setActiveColorTab(formData.colorImages[0].color);
    } else if (activeColorTab && !formData.colorImages.some((c) => c.color === activeColorTab)) {
      setActiveColorTab(formData.colorImages[0]?.color || "");
    }
  }, [formData.colorImages, activeColorTab]);

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

  return (
    <div className="space-y-6">
      <PageHeader
        title="Add New Accessory"
        subtitle="Create a new accessory with pricing and images"
        breadcrumbs={[{ label: "Products" }, { label: "Accessories", href: "/admin/product/accessories" }, { label: "Create" }]}
      />

      <form encType="multipart/form-data" onSubmit={handleFormSubmit} className="space-y-6">
        {/* Basic Info */}
        <Card>
          <CardBody>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Accessory Name <span className="text-red-500">*</span></label>
                <input type="text" name="accessoryName" className={inputCls} placeholder="Enter Accessory Name" required value={formData.accessoryName} onChange={handleInputChange} />
              </div>
              <div>
                <label className={labelCls}>Short Description <span className="text-red-500">*</span></label>
                <textarea name="shortDescription" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white resize-y" rows={2} value={formData.shortDescription} onChange={handleInputChange} placeholder="Enter Short Description" required />
              </div>
              <div>
                <label className={labelCls}>Description <span className="text-red-500">*</span></label>
                <textarea name="detailedDescription" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#E63946] bg-white resize-y" rows={4} value={formData.detailedDescription} onChange={handleInputChange} placeholder="Enter Detailed Description" required />
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

              {/* Accessory Type */}
              <div>
                <label className={labelCls}>Select Accessory Type <span className="text-red-500">*</span></label>
                <select value="" onChange={(e) => { const v = e.target.value; if (v && !formData.selectAccessoryType.includes(v)) setFormData((prev) => ({ ...prev, selectAccessoryType: [...prev.selectAccessoryType, v] })); }} className={inputCls}>
                  <option value="" disabled>Select Accessory Type</option>
                  {Array.isArray(accessoriesType) && accessoriesType.length > 0
                    ? accessoriesType.map((acc) => <option key={acc?._id} value={acc?.name}>{acc?.name}</option>)
                    : <option disabled>No accessory types available</option>}
                </select>
                {formData.selectAccessoryType.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {formData.selectAccessoryType.map((name) => (
                      <span key={name} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E63946] text-white text-xs font-medium">
                        {name}
                        <button type="button" onClick={() => setFormData((prev) => ({ ...prev, selectAccessoryType: prev.selectAccessoryType.filter((c) => c !== name) }))} className="hover:text-white/70">
                          <X size={10} />
                        </button>
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
                        <button type="button" onClick={() => setFormData((prev) => ({ ...prev, selectColor: prev.selectColor.filter((c) => c.color !== color) }))} className="hover:text-white/70">
                          <X size={10} />
                        </button>
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
                        <button type="button" onClick={() => setFormData((prev) => ({ ...prev, selectSize: prev.selectSize.filter((s) => s !== name) }))} className="hover:text-white/70">
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Products */}
              <div>
                <label className={labelCls}>Accessories Pair with Products</label>
                <select value="" onChange={handleProductChange} className={inputCls}>
                  <option value="" disabled>Select Product</option>
                  {Array.isArray(product) && product.length > 0
                    ? product.map((prod) => <option key={prod._id} value={prod._id}>{prod.productName}</option>)
                    : <option value="">No products found</option>}
                </select>
                {formData.product.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {formData.product.map((id) => {
                      const prod = product.find((p) => p._id === id);
                      return (
                        <span key={id} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#E63946] text-white text-xs font-medium">
                          {prod ? prod.productName : id}
                          <button type="button" onClick={() => handleProductRemove(id)} className="hover:text-white/70"><X size={10} /></button>
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* SKU */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium text-gray-700">Product SKU <span className="text-red-500">*</span></label>
                  <button type="button" onClick={handleBarcode} className="text-xs text-[#E63946] hover:text-[#E63946] font-medium">Generate Code</button>
                </div>
                <input type="text" placeholder="Ex: 134543" className={inputCls} value={formData.accessorySKU}
                  onChange={(e) => setFormData((prev) => ({ ...prev, accessorySKU: e.target.value.replace(/[^0-9]/g, "") }))}
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
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {["buyingPrice", "sellingPrice", "discountPrice", "stockQuantity", "minimumQuantity"].map((field) => (
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

                {formData.colorImages.map(({ color, accessoryThumbnail, additionalThumbnail, video, isDefault }) =>
                  activeColorTab === color ? (
                    <div key={color} className="mt-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Thumbnail */}
                        <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
                          <h4 className="text-sm font-semibold text-gray-700 mb-3">Accessory Thumbnail</h4>
                          <input type="file" accept="image/*" className={fileCls}
                            onChange={(e) => {
                              const file = e.target.files[0];
                              setFormData((prev) => ({
                                ...prev,
                                colorImages: prev.colorImages.map((ci) => ci.color === color ? { ...ci, accessoryThumbnail: file } : ci),
                              }));
                              if (!formData.colorImages.some((ci) => ci.isDefault)) handleDefaultImageChange(color);
                            }}
                          />
                          {accessoryThumbnail && (
                            <div className="relative mt-3">
                              <img
                                src={accessoryThumbnail instanceof File ? URL.createObjectURL(accessoryThumbnail) : accessoryThumbnail}
                                alt="Preview"
                                className="w-full object-cover rounded-xl border border-gray-200"
                                style={{ maxHeight: 220 }}
                              />
                              <button type="button"
                                onClick={() => setFormData((prev) => ({ ...prev, colorImages: prev.colorImages.map((ci) => ci.color === color ? { ...ci, accessoryThumbnail: null } : ci) }))}
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
                            required
                          />
                          {(additionalThumbnail || []).length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {(additionalThumbnail || []).map((file, idx) => (
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
          <button type="button" onClick={handleReset} className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">Reset</button>
          <button type="submit" className="px-6 py-2 text-sm font-medium bg-[#E63946] text-white rounded-lg hover:bg-[#C5303A] disabled:opacity-60 transition-colors flex items-center gap-2" disabled={loading || !!priceErrors[activeTab]}>
            {loading ? <Loader size="sm" /> : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAccessories;

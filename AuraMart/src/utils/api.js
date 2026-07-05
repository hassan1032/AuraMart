
export const BASEURL = import.meta.env.VITE_API_URL || "http://localhost:4050";

const APIUser    = `${BASEURL}/api/auth/`;
const APIProduct = `${BASEURL}/api/`;

export const ApiUrl = {
  // Auth
  sendOtpInEmail:  `${APIUser}send/otp/email/user`,
  register:        `${APIUser}register/user`,
  verifyEmail:     `${APIUser}verify/account/user`,
  otpLogin:        `${APIUser}request/login/otp/user`,
  verifyOtpLogin:  `${APIUser}login/user`,
  loginPassword:   `${APIUser}login/password/user`,
  forgotPassword:  `${APIUser}forgot/password/user`,
  resetPassword:   `${APIUser}reset/password/user`,
  logout:          `${APIUser}logout/user`,
  resendOtpEmail:  `${APIUser}resend/otp/email/user`,
  userProfile:     `${APIUser}get/profile/user`,
  updateProfile:   `${APIUser}update/profile/user`,

  // Products
  getAllProducts:      `${APIProduct}get/filter/product/user`,
  getProductById:     `${APIProduct}get/single/product/by/user`,
  getFilteredProducts:`${APIProduct}get/filter/product/user`,

  // Collections
  getAllCollections:   `${APIProduct}get/collection/product/user`,

  // Accessories
  getAllAccessories:    `${APIProduct}get/all/accessory/admin`,
  getSingleAccessory:  `${APIProduct}get/single/accessory/by/user`,
  getAllAccessoryTypes: `${APIProduct}get/all/accessory/type/admin`,

  // Cart (corrected paths)
  addToCart:      `${APIProduct}add/cart/product/user`,
  getCart:        `${APIProduct}get/all/cart/product/user`,
  removeFromCart: `${APIProduct}remove/cart/product/user`,
  clearCart:      `${APIProduct}clear/cart/product/user`,
  mergeCart:      `${APIProduct}merge/cart/product/user`,

  // Wishlist (corrected paths)
  addToWishlist:      `${APIProduct}add/whislist/product/user`,
  getWishlist:        `${APIProduct}get/all/whislist/product/user`,
  removeFromWishlist: `${APIProduct}remove/whislist/product/user`,
  mergeWishlist:      `${APIProduct}merge/whislist/product/user`,

  // Orders (corrected paths)
  placeOrder:    `${APIProduct}create/order/cart/user`,
  createOrder:   `${APIProduct}create/order/user`,
  getOrders:     `${APIProduct}get/order/by/user`,
  cancelOrder:   `${APIProduct}cancel/order/user`,

  // Razorpay
  razorpayCreateOrder:  `${APIProduct}razorpay/create/order`,
  razorpayVerifyPayment:`${APIProduct}razorpay/verify/payment`,

  // Address (corrected paths)
  addAddress:    `${APIProduct}add/address/order/user`,
  getAddresses:  `${APIProduct}get/all/address/order/user`,
  updateAddress: `${APIProduct}update/address/order/user`,
  deleteAddress: `${APIProduct}delete/address/oreder/user`,

  // Banners (corrected to /admin endpoint)
  getAllBanners: `${APIProduct}get/all/banner/admin`,

  // Events (corrected to /admin endpoint)
  getAllEvents: `${APIProduct}get/all/event/admin`,

  // Coupons
  getAllCoupons: `${APIProduct}get/all/coupon/admin`,

  // Stockist (corrected path)
  getStockists: `${APIProduct}get/all/stock/kist/admin`,
};

export const getAuthToken = () =>
  localStorage.getItem("userToken") || sessionStorage.getItem("userToken");

export const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getAuthToken()}`,
});

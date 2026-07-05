// src/api/apis.jsx

const BASE_URL = `${import.meta.env.VITE_API_URL || "https://auramart-backend-vl5j.onrender.com/"}/api`;

// const api_URL = `${BASE_URL}/api`;

export const ApiEndpoints = {

  MODULE: {
    ADD_MODULE: `${BASE_URL}/add/module/admin`,
    GET_MODULE: `${BASE_URL}/get/all/module/admin`,
    UPDATE_MODULE: (id) => `${BASE_URL}/update/module/admin/${id}`,
    DELETE_MODULE: (id) => `${BASE_URL}/delete/module/admin/${id}`
  },

  ROLE: {
    ADD_ROLE: `${BASE_URL}/add/role/admin`,
    GET_ROLE: `${BASE_URL}/get/all/role/admin`,
    UPDATE_ROLE: (id) => `${BASE_URL}/update/role/admin/${id}`,
    UPDATE_PERMISSION: (id) => `${BASE_URL}/update/role/permission/admin/${id}`,
    DELETE_ROLE: (id) => `${BASE_URL}/delete/role/admin/${id}`,
    GET_SINGLE_ROLE: (id) => `${BASE_URL}/get/single/role/admin/${id}`,
    FILTER_ROLE: `${BASE_URL}/filter/role/admin`,
  },

  EMPLOYEE: {
    LOGIN_EMPLOYEE: `${BASE_URL}/login/employee/admin`,
    ADD_EMPLOYEE: `${BASE_URL}/register/employee/admin`,
    GET_EMPLOYEE: `${BASE_URL}/get/all/employee/admin`,
    UPDATE_EMPLOYEE_PASSWORD: `${BASE_URL}/update/employee/password/admin`,
    DELETE_EMPLOYEE: (id) => `${BASE_URL}/delete/employee/admin/${id}`,
    GET_SINGLE_EMPLOYEE: (id) => `${BASE_URL}/get/by/id/employee/admin/${id}`,
    UPDATE_PERMISSION_EMPLOYEE: (id) => `${BASE_URL}/get/by/id/employee/admin/${id}`,
  },

  AUTH: {
    // LOGIN: `${BASE_URL}/auth/login/admin`,
    LOGIN_EMP: `${BASE_URL}/login/employee/admin`,
    FORGOT_PASSWORD: `${BASE_URL}/auth/forgot/password/admin`,
    RESET_PASSWORD: `${BASE_URL}/auth/reset/password/admin`,
    UPDATE_PROFILE: `${BASE_URL}/auth/update/profile/admin`,
    GET_ADMIN_PROFILE: `${BASE_URL}/get/profile/employee/admin`,
    UPDATE_PASSWORD: `${BASE_URL}/auth/update/password/admin`
  },

  PRODUCT_VARIANT: {
    // COLOR
    ALL_COLOR: `${BASE_URL}/get/all/colour/admin`,
    ADD_COLOR: `${BASE_URL}/add/colour/admin`,
    UPDATE_COLOR: (id) => `${BASE_URL}/update/colour/admin/${id}`,
    DELETE_COLOR: (id) => `${BASE_URL}/delete/colour/admin/${id}`,
    COLOR_STATUS: `${BASE_URL}/update/colour/status/admin`,

    // SIZE
    ALL_SIZE: `${BASE_URL}/get/all/size/admin`,
    ADD_SIZE: `${BASE_URL}/add/size/admin`,
    UPDATE_SIZE: (id) => `${BASE_URL}/update/size/admin/${id}`,
    DELETE_SIZE: (id) => `${BASE_URL}/delete/size/admin/${id}`,
    SIZE_STATUS: `${BASE_URL}/update/size/status/admin`,
  },

  PROMOTION_MANAGEMENT: {
    // BANNER
    ALL_BANNER: `${BASE_URL}/get/all/banner/admin`,
    ADD_BANNER: `${BASE_URL}/add/banner/admin`,
    UPDATE_BANNER: (id) => `${BASE_URL}/update/banner/admin/${id}`,
    DELETE_BANNER: (id) => `${BASE_URL}/delete/banner/admin/${id}`,
    BANNER_STATUS: `${BASE_URL}/update/status/banner/admin`,

    // COUPON
    ALL_COUPON: `${BASE_URL}/get/all/coupon/admin`,
    ADD_COUPON: `${BASE_URL}/add/coupon/admin`,
    UPDATE_COUPON: (id) => `${BASE_URL}/update/coupon/admin/${id}`,
    DELETE_COUPON: (id) => `${BASE_URL}/delete/coupon/admin/${id}`,
    COUPON_STATUS: `${BASE_URL}/update/status/coupon/admin`,

    // EVENTS
    ALL_EVENTS: `${BASE_URL}/get/all/event/admin`,
    SINGLE_EVENT: (id) => `${BASE_URL}/get/single/event/admin/${id}`,
    ADD_EVENT: `${BASE_URL}/add/event/admin`,
    UPDATE_EVENT: (id) => `${BASE_URL}/update/event/admin/${id}`,
    DELETE_EVENT: (id) => `${BASE_URL}/delete/event/admin/${id}`,
    EVENT_STATUS: `${BASE_URL}/update/status/event/admin`,

    // STOKIEST
    ALL_STOKIEST: `${BASE_URL}/get/all/stock/kist/admin`,
    ADD_STOKIEST: `${BASE_URL}/add/stock/kist/admin`,
    UPDATE_STOKIEST: (id) => `${BASE_URL}/update/stock/kist/admin/${id}`,
    STOKIEST_STATUS: `${BASE_URL}/update/stock/kist/status/admin`,
    DELETE_STOKIEST: (id) => `${BASE_URL}/delete/stock/kist/admin/${id}`,
  },

  PRODUCTS_MANAGEMENT: {
    // COLLECTION
    ALL_COLLECTION: `${BASE_URL}/get/all/collection/admin`,
    ADD_COLLECTION: `${BASE_URL}/add/collection/admin`,
    UPDATE_COLLECTION: (id) => `${BASE_URL}/update/collection/admin/${id}`,
    DELETE_COLLECTION: (colId) => `${BASE_URL}/delete/collection/admin/${colId}`,
    COLLECTION_STATUS: `${BASE_URL}/update/collection/status/admin`,

    // ACCESSORIES TYPE
    ALL_ACCESSORY_TYPE: `${BASE_URL}/get/all/accessory/type/admin`,
    ADD_ACCESSORY_TYPE: `${BASE_URL}/add/accessory/type/admin`,
    UPDATE_ACCESSORY_TYPE: (id) => `${BASE_URL}/update/accessory/type/admin/${id}`,
    DELETE_ACCESSORY_TYPE: (productId) => `${BASE_URL}/delete/accessory/type/admin/${productId}`,
    ACCESSORY_TYPE_STATUS: `${BASE_URL}/update/accessory/type/status/admin`,

    // ACCESSORY
    ALL_ACCESSORY: `${BASE_URL}/get/all/accessory/admin`,
    GET_ACCESSORY: (id) => `${BASE_URL}/get/single/accessory/admin/${id}`,
    ADD_ACCESSORY: `${BASE_URL}/add/accessory/admin`,
    UPDATE_ACCESSORY: (id) => `${BASE_URL}/update/accessory/admin/${id}`,
    DELETE_ACCESSORY: (accId) => `${BASE_URL}/delete/accessory/admin/${accId}`,
    ACCESSORY_STATUS: `${BASE_URL}/update/accessory/status/admin`,
    GENERATE_BARCODE_ACCESSORY: (id) => `${BASE_URL}/genrate/accessory/barcode/admin/${id}?count=`,
    FILTER_ACCESSORY: `${BASE_URL}/get/filter/accessory/admin`,
    ACCESSORY_IMAGE_STATUS: `${BASE_URL}/default/image/product/admin`,

    // PRODUCT
    ALL_PRODUCT: `${BASE_URL}/get/all/product/admin`,
    GET_PRODUCT: (productId) => `${BASE_URL}/get/single/product/admin/${productId}`,
    ADD_PRODUCT: `${BASE_URL}/add/product/admin`,
    UPDATE_PRODUCT: (productId) => `${BASE_URL}/update/product/admin/${productId}`,
    DELETE_PRODUCT: (productId) => `${BASE_URL}/delete/product/admin/${productId}`,
    PRODUCT_STATUS: `${BASE_URL}/update/product/status/admin`,
    SKU_CODE: `${BASE_URL}/genrate/sku/code/admin`,
    GENERATE_BARCODE: (id) => `${BASE_URL}/genrate/product/barcode/admin/${id}?count=`,
    FILTER_PRODUCT: `${BASE_URL}/get/filter/product/admin`,
    PRODUCT_IMAGE_STATUS: `${BASE_URL}/default/image/product/admin`,

    // CUSTOMIZE
    ALLCUSTOMIZE: `${BASE_URL}/get/all//product/customization/admin`,
    DELETECUSTOMIZE: (id) => `${BASE_URL}/delete/customization/admin/${id}`,
    GET_SINGLE_CUSTOMIZATION: (id) => `${BASE_URL}/get/product/customization/admin/${id}`,
    // VIEWCUSTOMIZE: (id) => `${BASE_URL}/get/product/customization/admin/${id}`,
  },

  ORDERS: {
    ALL_ORDERS: `${BASE_URL}/get/all/order/admin`,
    GET_SINGLE_ORDER: `${BASE_URL}/get/single/order/admin`,
    ORDER_STATUS: (id) => `${BASE_URL}/update/status/order/admin/${id}`
  }


};


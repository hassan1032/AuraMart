
import Business from "../components/pages/business_management/business_setup/Business";
import AddNewCity from "../components/pages/business_management/delivery_charge/AddNewCity";
import CreateNewDelivery from "../components/pages/business_management/delivery_charge/CreateNewDelivery";
import EditCity from "../components/pages/business_management/delivery_charge/EditCity";
import EditDeliveryCharge from "../components/pages/business_management/delivery_charge/EditDeliveryCharge";
import ImportCity from "../components/pages/business_management/delivery_charge/ImportCity";
import ManageCity from "../components/pages/business_management/delivery_charge/ManageCity";
import ManageDelivery from "../components/pages/business_management/delivery_charge/ManageDelivery";
import General from "../components/pages/business_management/general_setting/General";
import SocialLink from "../components/pages/business_management/social_links/SocialLink";
import ThemeColor from "../components/pages/business_management/theme_color/ThemeColor";
// TicketIssue removed — not used
import Verification from "../components/pages/business_management/verification/verification";
import ColorList from "../components/pages/product_variants/ColorList";
import Coupon from "../components/pages/Promotion_Management/coupon/Coupon";
import Customers from "../components/pages/user_management/Customer";
import Dashboard from "../components/pages/Dashboard/dashboard/Dashboard";
import AdminSetting from "../components/pages/header/AdminSetting";
import ChangePassword from "../components/pages/header/ChangePassword";
import EditProfileDetails from "../components/pages/header/EditProfileDetails";
import ProfileDetails from "../components/pages/header/ProfileDetails";
// Import/Export removed
// Language management removed — India-only English app
import EditAboutUs from "../components/pages/legal-pages/abous-us/EditLegalAboutUs";
import LegalAboutUs from "../components/pages/legal-pages/abous-us/LegalAboutUs";
import LegalContactUs from "../components/pages/legal-pages/contact-us/LegalContactUs";
import EditPrivacyPolicy from "../components/pages/legal-pages/privacyPolicy/EditPrivacypolicy";
import PrivacyPolicy from "../components/pages/legal-pages/privacyPolicy/PrivacyPolicy";
import EditReturnRefund from "../components/pages/legal-pages/return_refund/EditReturnRefund";
import ReturnRefundPolicy from "../components/pages/legal-pages/return_refund/ReturnRefund";
import EditShippingDelivery from "../components/pages/legal-pages/Shipping-and-delivery/EditShippingDelivery";
import ShippinAndDelivery from "../components/pages/legal-pages/Shipping-and-delivery/ShipingAndDelivery";
import EditTermAndCondition from "../components/pages/legal-pages/term-and-condition/EditTermAndCondition";
import TermAndCondition from "../components/pages/legal-pages/term-and-condition/TermAndCondition";
import Cancel from "../components/pages/order_management/order/Cancel";
import Confirm from "../components/pages/order_management/order/Confirm";
import Deliver from "../components/pages/order_management/order/Deliver";
import Ontheway from "../components/pages/order_management/order/Ontheway";
import Order from "../components/pages/order_management/order/Order";
import OrderDetails from "../components/pages/order_management/order/OrderDetails";
import Pending from "../components/pages/order_management/order/Pending";
import Pickup from "../components/pages/order_management/order/Pickup";
import Processing from "../components/pages/order_management/order/Processing";
import Replacement from "../components/pages/order_management/order/Replacement";
import Return from "../components/pages/order_management/order/Return";
// 3rd Party Config removed — credentials handled via .env
import Reviews from "../components/pages/order_management/Reviews";
import RolePermission from "../components/pages/user_management/RolePermission";
import SizeList from "../components/pages/product_variants/SizeList";
// Support Tickets removed
import Employee from "../components/pages/user_management/Employee";
import Employeepermissions from "../components/pages/user_management/EmployeePermission";
import Notification from "../components/pages/Promotion_Management/coupon/Notification";
import Notifications from "../components/pages/header/Notifications";
import BannerList from "../components/pages/Promotion_Management/banner/Banner";
import AddNewbanner from "../components/pages/Promotion_Management/banner/AddNewbanner";
import CreateNewCoupon from "../components/pages/Promotion_Management/coupon/CreateNewCoupon";
import EditCoupon from "../components/pages/Promotion_Management/coupon/EditCoupon";
import EditBanner from "../components/pages/Promotion_Management/banner/EditBanner";
import { CreateEmployee } from "../components/pages/user_management/CreateEmployee";
import Modules from "../components/pages/user_management/Modules";

import Collection from "../components/pages/product_management/collection/Collection";
import EditCollection from "../components/pages/product_management/collection/EditCollection";
import CreateCollection from "../components/pages/product_management/collection/CreateCollection";
import Accessories from "../components/pages/product_management/accessories/Accessories";
import EditAccessories from "../components/pages/product_management/accessories/EditAccessories";
import CreateAccessories from "../components/pages/product_management/accessories/CreateAccessories";
import CreateAccessoriesType from "../components/pages/product_management/accessoryType/CreateAccessoriesType";
import EditAccessoriesType from "../components/pages/product_management/accessoryType/EditAccessoriesType";
import ProductDetails from "../components/pages/product_management/products/ProductDetails";
import AddNewProduct from "../components/pages/product_management/products/AddNewProduct";
import EditProducts from "../components/pages/product_management/products/EditProducts";
import Products from "../components/pages/product_management/products/Products";
import GenerateBarcode from "../components/pages/product_management/products/GenerateBarcode";
import GenerateBarcodes from "../components/pages/product_management/accessories/GenerateBarcodes";
import AccessoryDetails from "../components/pages/product_management/accessories/AccessoryDetails";
import AccessoriesType from "../components/pages/product_management/accessoryType/AccessoriesType";
import FlashSales from "../components/pages/product_management/flashsales/FlashSalses";
import CreateFlashSale from "../components/pages/product_management/flashsales/CreateFlashSale";
import ViewFlashSale from "../components/pages/product_management/flashsales/ViewFlashSale";
import EditFlashSales from "../components/pages/product_management/flashsales/EditFlashSales";
import CustomizationProduct from "../components/pages/product_management/customization/CustomizationProduct";
import CustomizationView from "../components/pages/product_management/customization/CustomizationView";
import Event from "../components/pages/product_management/events/Event";
import CreateEvent from "../components/pages/product_management/events/CreateEvent";
import EditEvent from "../components/pages/product_management/events/EditEvent";
import ViewEvent from "../components/pages/product_management/events/ViewEvent";
import Stokiest from "../components/pages/Promotion_Management/stokiest/Stokiest";
import CreateStokiest from "../components/pages/Promotion_Management/stokiest/CreateStokiest";
import EditStokiest from "../components/pages/Promotion_Management/stokiest/EditStokiest";





export const routes = [
  {
    path: "dashboard",
    component: Dashboard,
  },
  // PROFILE
  {
    path: "profile",
    component: ProfileDetails,
    module: "profile",
    action: "list"
  },
  {
    path: "profile/edit",
    component: EditProfileDetails,
    module: "profile",
    action: "edit"
  },

  {
    path: "general-setting",
    component: AdminSetting,
    module: "profile",
    action: "profile setting"
  },

  {
    path: "profile/change-password",
    component: ChangePassword,
    module: "profile",
    action: "change password"
  },
  {
    path: "notifications",
    component: Notification,
  },

  // BANNER
  {
    path: "banner",
    component: BannerList,
    module: "Banner",
    action: "list"
  },
  {
    path: "banners/create",
    component: AddNewbanner,
    module: "Banner",
    action: "create"
  },
  {
    path: "banners/edit/:_id",
    component: EditBanner,
    module: "Banner",
    action: "edit"
  },
  {
    path: "coupon",
    component: Coupon,
    module: "Coupon",
    action: "list"
  },
  {
    path: "coupons/edit-coupon/:_id",
    component: EditCoupon,
    module: "Coupon",
    action: "edit"
  },
  {
    path: "coupons/create",
    component: CreateNewCoupon,
    module: "Coupon",
    action: "create"
  },

  // Events
  {
    path: "events",
    component: Event,
    module: "events",
    action: "list"
  },
  {
    path: "events/create",
    component: CreateEvent,
    module: "events",
    action: "create"
  },
  {
    path: "events/edit/:_id",
    component: EditEvent,
    module: "events",
    action: "edit"
  },
  {
    path: "events/view/:_id",
    component: ViewEvent,
    module: "events",
    action: "view"
  },
// Stokiest
{
    path: "stokiest",
    component: Stokiest,
    module: "stokiest",
    action: "list"
  },
  {
    path: "stokiest/create",
    component: CreateStokiest,
    module: "stokiest",
    action: "create"
  },
  {
    path: "stokiest/edit/:_id",
    component: EditStokiest,
    module: "stokiest",
    action: "edit"
  },

  {
    path: "customer-notifications",
    component: Notifications,
    module: "notifications",
  },

  // Order Routes  //
  {
    path: "all-orders",
    component: Order,
  },
  {
    path: "orders/order-details/:_id",
    component: OrderDetails,
  },
  {
    path: "orders/pending",
    component: Pending,
  },
  {
    path: "orders/confirm",
    component: Confirm,
  },
  {
    path: "orders/processing",
    component: Processing,
  },
  {
    path: "orders/pickup",
    component: Pickup,
  },
  {
    path: "orders/on-the-way",
    component: Ontheway,
  },
  {
    path: "orders/delivered",
    component: Deliver,
  },
  {
    path: "orders/return",
    component: Return,
  },
  {
    path: "orders/replacement",
    component: Replacement,
  },
  {
    path: "orders/cancel",
    component: Cancel,
  },
  {
    path: "orders/review",
    component: Reviews,
  },

  //  Product Management Route  //
  {
    path: "product/collection",
    component: Collection,
    module: "Collection",
    action: "list"
  },
  {
    path: "product/collection/edit/:_id",
    component: EditCollection,
    module: "Collection",
    action: "edit"
  },
  {
    path: "product/collection/create",
    component: CreateCollection,
    module: "Collection",
    action: "create"
  },
  {
    path: "product/accessories",
    component: Accessories,
    module: "Accessories",
    action: "list"
  },
  {
    path: "product/accessories/edit/:_id",
    component: EditAccessories,
    module: "Accessories",
    action: "edit"
  },
  {
    path: "product/accessories/create",
    component: CreateAccessories,
    module: "Accessories",
    action: "create"
  },
  {
    path: "product/accessories-type",
    component: AccessoriesType,
    module: "Accessory Type",
    action: "list"
  },
  {
    path: "product/accessories-type/create",
    component: CreateAccessoriesType,
    module: "Accessory Type",
    action: "create"
  },
  {
    path: "product/accessories-type/edit/:_id",
    component: EditAccessoriesType,
    module: "Accessory Type",
    action: "edit"
  },
  {
    path: "product/accessory/generate-barcode/:_id",
    component: GenerateBarcodes,
    module: "Accessories",
    action: "barcode"
  },
  {
    path: "product/accessory-details/:id",
    component: AccessoryDetails,
    module: "Accessories",
    action: "view"
  },
  {
    path: "product/color",
    component: ColorList,
    module: "Color",
    action: "list"
  },
  {
    path: "product/size",
    component: SizeList,
    module: "Size",
    action: "list"
  },
  {
    path: "products",
    component: Products,
    module: "Products",
    action: "list"
  },
  {
    path: "product/create",
    component: AddNewProduct,
    module: "Products",
    action: "create"
  },
  {
    path: "products/product-details/:_id",
    component: ProductDetails,
    module: "Products",
    action: "view"
  },
  {
    path: "products/generate-barcode/:_id?",
    component: GenerateBarcode,
    module: "Products",
    action: "barcode"
  },
  {
    path: "products/product-edit/:_id",
    component: EditProducts,
    module: "Products",
    action: "edit"
  },
  {
    path: "product/customize",
    component: CustomizationProduct,
    // module: "Products",
    // action: "customize"
  },
  {
    path: "product/customize/view/:_id",
    component: CustomizationView,
    // module: "Products",
    // action: "customize"
  },
  {
    path: "product/flashsales",
    component: FlashSales,
  },
  {
    path: "products/flashsales/create",
    component: CreateFlashSale,
  },
  {
    path: "products/flash-sales/view",
    component: ViewFlashSale,
  },
  {
    path: "products/flash-sales/edit",
    component: EditFlashSales,
  },

  //  User Management  //
  {
    path: "module",
    component: Modules,
  },
  {
    path: "customer",
    component: Customers,
  },
  {
    path: "employees",
    component: Employee,
    module: "Employees",
  },
  {
    path: "employees/permission/:_id",
    component: Employeepermissions,
    module: "Employees",
  },
  {
    path: "employees/create",
    component: CreateEmployee,
    module: "Employees",
  },
  {
    path: "user/permissions",
    component: RolePermission,
    module: "Role & Permissions",
  },
  {
    path: "business/General",
    component: General,
    module: false,
  },
  {
    path: "business/Business",
    component: Business,
    module: false,
  },
  {
    path: "business/Verification",
    component: Verification,
    module: false,
  },
  {
    path: "business/delivery-charge",
    component: ManageDelivery,
    module: false,
  },
  {
    path: "business/delivery-charges/cities/edit-city",
    component: EditCity,
    module: false,
  },
  {
    path: "business/delivery-charges/cities/edit-delivery-charge",
    component: EditDeliveryCharge,
    module: false,
  },

  {
    path: "business/delivery-charges/cities/cities",
    component: ManageCity,
    module: false,
  },
  {
    path: "business/delivery-charges/cities/create-new-delivery",
    component: CreateNewDelivery,
    module: false,
  },
  {
    path: "business/delivery-charges/cities/add-new-city",
    component: AddNewCity,
    module: false,
  },
  {
    path: "business/delivery-charges/cities/import",
    component: ImportCity,
    module: false,
  },
  {
    path: "business/color-theme",
    component: ThemeColor,
    module: false,
  },
  {
    path: "business/social-link",
    component: SocialLink,
    module: false,
  },
  // Legal Pages
  {
    path: "business/legal-privacy-policy",
    component: PrivacyPolicy,
    module: false,
  },
  {
    path: "business/edit-privacy-policy",
    component: EditPrivacyPolicy,
    module: false,
  },
  {
    path: "business/term-and-condition",
    component: TermAndCondition,
    module: false,
  },
  {
    path: "business/term-and-condition/edit",
    component: EditTermAndCondition,
    module: false,
  },
  {
    path: "business/return-refund-policy",
    component: ReturnRefundPolicy,
    module: false,
  },
  {
    path: "business/return-refund-policy-edit",
    component: EditReturnRefund,
    module: false,
  },
  {
    path: "business/shipping-delivery",
    component: ShippinAndDelivery,
    module: false,
  },
  {
    path: "business/shipping-delivery/edit",
    component: EditShippingDelivery,
    module: false,
  },
  {
    path: "business/about-us",
    component: LegalAboutUs,
    module: false,
  },
  {
    path: "business/about-us/edit",
    component: EditAboutUs,
    module: false,
  },
  {
    path: "business/legal-contact-us",
    component: LegalContactUs,
    module: false,
  },

  // (3rd Party Config, Language, Import/Export, Support removed from routes)
];

export default routes;
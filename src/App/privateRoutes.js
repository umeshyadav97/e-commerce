import React from "react";
import MODULES from "./moduleList";
const Appointment = React.lazy(() => import("./pages/Appointment"));
const AppointmentDetails = React.lazy(() =>
  import("./pages/Appointment/AppointmentDetails")
);
const CreateAppointment = React.lazy(() =>
  import("./pages/Appointment/CreateAppointment")
);
const AppointmentSuccess = React.lazy(() =>
  import("./pages/Appointment/CreateAppointment/AppointmentSuccess")
);
const InstoreOrderDetails = React.lazy(() =>
  import("./pages/Orders/InstoreOrderDetails")
);
const CustomProductDetails = React.lazy(() =>
  import("./pages/ProductDetail/customProductDetail")
);
const SearchProduct = React.lazy(() =>
  import("./pages/ProductListing/components/SearchProduct")
);
const UserAgreement = React.lazy(() => import("./pages/Cms/UserAgreement"));
const ViewAllReview = React.lazy(() =>
  import("./pages/ProductDetail/components/viewAllReview")
);
const ProductDetails = React.lazy(() => import("./pages/ProductDetail"));
const Dashboard = React.lazy(() => import("./pages/Dashboard"));
const ProductListing = React.lazy(() => import("./pages/ProductListing"));
const SavedAddress = React.lazy(() => import("./pages/SavedAddress"));
const AddAddress = React.lazy(() =>
  import("./pages/SavedAddress/AddNewAddress")
);
const EditAddress = React.lazy(() =>
  import("./pages/SavedAddress/EditAddress")
);
const Wishlist = React.lazy(() => import("./pages/Wishlist"));
const EditProfile = React.lazy(() => import("./pages/Profile"));
const ChangePassword = React.lazy(() => import("./pages/ChangePassword"));
const Orders = React.lazy(() => import("./pages/Orders"));
const OrderDetails = React.lazy(() => import("./pages/Orders/OrderDetails"));
const Cart = React.lazy(() => import("./pages/Cart"));
const CreditNote = React.lazy(() => import("./pages/CreditNotes"));
const CreditNoteDetail = React.lazy(() =>
  import("./pages/CreditNotes/CreditDetail")
);
const OrderSuccess = React.lazy(() =>
  import("./pages/Cart/components/OrderSuccess")
);
const Designers = React.lazy(() => import("./pages/Designers"));
const DesignerDetails = React.lazy(() =>
  import("./pages/Designers/DesignerDetails")
);
const CmsPage = React.lazy(() => import("./pages/Cms/index"));
const FAQs = React.lazy(() => import("./pages/Cms/FAQs"));
const Notification = React.lazy(() => import("./pages/Notification/index"));

const routes = [
  {
    path: "/home",
    exact: true,
    name: "Dashboard",
    module: MODULES.DASHBOARD,
    checkAccess: false,
    component: Dashboard,
  },
  {
    path: "/notification",
    exact: true,
    name: "Notification",
    module: MODULES.NOTIFICATION,
    checkAccess: false,
    component: Notification,
  },
  {
    path: "/product-listing/:title/:category_id",
    exact: true,
    name: "PRODUCT_LISTING",
    module: MODULES.PRODUCT_LISTING,
    checkAccess: false,
    component: ProductListing,
  },
  {
    path: "/product-search/:search",
    exact: true,
    name: "PRODUCT_SEARCH",
    module: MODULES.PRODUCT_LISTING,
    checkAccess: false,
    component: SearchProduct,
  },
  {
    path: "/product-details/:category_id/:product_id",
    exact: true,
    name: "PRODUCT_DETAILS",
    module: MODULES.PRODUCT_DETAILS,
    checkAccess: false,
    component: ProductDetails,
  },
  {
    path: "/custom-product-details/:category_id/:product_id",
    exact: true,
    name: "CUSTOM_PRODUCT_DETAILS",
    module: MODULES.CUSTOM_PRODUCT_DETAILS,
    checkAccess: false,
    component: CustomProductDetails,
  },
  {
    path: "/saved-address",
    exact: true,
    name: "Saved Address",
    module: MODULES.SAVED_ADDRESS,
    checkAccess: false,
    component: SavedAddress,
  },
  {
    path: "/saved-address/add-new-address",
    exact: true,
    name: "Add New Address",
    module: MODULES.SAVED_ADDRESS,
    component: AddAddress,
  },
  {
    path: "/saved-address/edit-address/:id",
    exact: true,
    name: "Edit Address",
    module: MODULES.SAVED_ADDRESS,
    component: EditAddress,
  },
  {
    path: "/wishlist",
    exact: true,
    name: "Wishlist",
    module: MODULES.WISHLIST,
    checkAccess: false,
    component: Wishlist,
  },
  {
    path: "/orders",
    exact: true,
    name: "Orders",
    module: MODULES.ORDERS,
    checkAccess: false,
    component: Orders,
  },
  {
    path: "/orders/:id",
    exact: true,
    name: "Orders",
    module: MODULES.ORDERS,
    component: OrderDetails,
  },
  {
    path: "/edit-profile",
    exact: true,
    name: "Edit Profile",
    module: MODULES.PROFILE,
    checkAccess: false,
    component: EditProfile,
  },
  {
    path: "/change-password",
    exact: true,
    name: "Change Password",
    module: MODULES.CHANGE_PASSWORD,
    checkAccess: false,
    component: ChangePassword,
  },
  {
    path: "/cart",
    exact: true,
    name: "Cart",
    module: MODULES.CART,
    checkAccess: false,
    component: Cart,
  },
  {
    path: "/order_success",
    exact: true,
    name: "Order Success",
    module: MODULES.ORDER_SUCCESS,
    checkAccess: false,
    component: OrderSuccess,
  },
  {
    path: "/review/view-all/:product_id",
    exact: true,
    name: "ViewAllReview",
    module: MODULES.Rating,
    checkAccess: false,
    component: ViewAllReview,
  },
  {
    path: "/designers",
    exact: true,
    name: "Designers",
    module: MODULES.DESIGNERS,
    checkAccess: false,
    component: Designers,
  },
  {
    path: "/designers/:id",
    exact: true,
    name: "Designers",
    module: MODULES.DESIGNERS,
    component: DesignerDetails,
  },
  {
    path: "/cms/:id",
    exact: true,
    name: "Cms",
    module: MODULES.CMS,
    component: CmsPage,
  },
  {
    path: "/cms/faqs/:id",
    exact: true,
    name: "FAQs",
    module: MODULES.FAQs,
    component: FAQs,
  },
  {
    path: "/credit-notes",
    exact: true,
    name: "Credit Notes",
    module: MODULES.CREDIT,
    checkAccess: false,
    component: CreditNote,
  },
  {
    path: "/credit-notes/detail/:id",
    exact: true,
    name: "FAQs",
    module: MODULES.CREDIT,
    component: CreditNoteDetail,
  },
  {
    path: "/appointment",
    exact: false,
    name: "Appointment",
    module: MODULES.APPOINTMENT,
    component: Appointment,
  },
  {
    path: "/create-appointment/:id",
    exact: true,
    name: "Appointment",
    module: MODULES.APPOINTMENT,
    component: CreateAppointment,
  },
  {
    path: "/appointment-overview/:id",
    exact: true,
    name: "Appointment",
    module: MODULES.APPOINTMENT,
    component: AppointmentSuccess,
  },
  {
    path: "/appointment-details/:id",
    exact: true,
    name: "Appointment",
    module: MODULES.APPOINTMENT,
    component: AppointmentDetails,
  },
  {
    path: "/orders/instore-order/:id",
    exact: true,
    name: "Orders",
    module: MODULES.ORDERS,
    component: InstoreOrderDetails,
  },
  {
    path: "/cms/faqs/:id/user-agreement",
    exact: true,
    name: "FAQs",
    module: MODULES.FAQs,
    component: UserAgreement,
  },
];

export default routes;

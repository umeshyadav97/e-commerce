const AUTH_ROUTES = {
  LOGIN: "customer/login",
  SIGNUP: "/customer/signup",
  GoogleSignUp: "customer/login/google",
  FACEBOOK_SIGNUP: "customer/login/facebook",
  CUSTOMER_PHONE: "/customer/send-otp",
  CUSTOMER_PROFILE: "/customer/profile",
  UPDATE_PHONE: "/customer/update/phone",
  LOGOUT: "user/logout",
  FORGOT_PASSWORD: "user/forgot-password",
  RESET_PASSWORD: "/user/reset-password",
  CHANGE_PASSWORD: "/user/change-password",
  OTP_LOGIN: "user/login/send-otp",
  VERIFY_OTP: "user/login/verify-otp",
  CMS: "/public/cms",
  MEDIA: "/media",
  MEDIA_GET: "/media/get",
  APN_ROUTES: "user/update/session/",
};

const COMMON = {
  COUNTRY_LIST: "country/list",
  PROFILE: "customer/profile",
  SEND_OTP: "customer/send-otp",
  UPDATE_PHONE: "customer/update/phone",
  MEDIA: "/media",
  MEDIA_GET: "/media/get",
  NOTIFICATION: `/notification/logs`,
  NOTIFICATION_COUNT: `/notification/mark-as-read`,
  INVOICE_DATA: `order/invoice`,
  PARENT_CATEGORY_LIST: "product/common/category/",
};

const HEADER = {
  PARENT_CATEGORIES: "/categories",
  PRODUCT_LIST: "product/customer/",
  SAVED_ADDRESS: "customer/saved-address",
  WISHLIST: "customer/wishlist",
  ORDERS: "order/customer",
  STOREORDER: "store/customer/order-list",
  STOREORDERDETAIL: "store/customer/order/",
};

const PRODUCT = {
  READY_TO_WEAR_DETAIL: "product/customer/product/detail/",
  GET_AVG_RATING_REVIEW: "review/rating/",
  GET_CUSTOMER_REVIEW: "review/customer/product/",
  LIKE_REVIEW: "review/customer/like/",
  REPORT_REVIEW: "review/customer/report/",
  VIEW_COUNT: "product/common/views",
  ALL: "product/customer/",
  SEARCH: "customer/designer/search-by-product",
};
const CART = {
  CART: "customer/cart",
  CART_LIST: "customer/cart/list",
  EDIT_CART: "customer/cart/rtw/edit",
  INVENTORY_CHECK: "order/customer/checkout",
  SHIPPING_COST: "order/customer/checkout/shipping-address",
  CALCULATE_TAX: "order/customer/checkout/payment-detail",
  PAYMENT_INTENT: "payment/customer/create/payment-intent",
  PAYMENT_LIST: "payment/customer/payment-method",
  REMOVE_PAYMENT_METHOD: "payment/customer/payment",
  CONFIRM_METHOD: "order/customer/pay",
  PLACE_ORDER: "order/customer/place/order",
};

const COUPONS = {
  REDEEM_COUPON: "discount-coupon/customer/redeem",
  APPLICABLE_COUPONS: "discount-coupon/customer/suggest-coupons",
};

const DESIGNERS = {
  GET_DESIGNERS_LIST: "/customer/designer",
  GET_DESIGNER_DETAILS: "/customer/designer",
  GET_DESIGNER_PRODUCTS: "/customer/designer",
  BRAND_LIST: "/customer/designer/brand",
  Designer_Name_LIST: "/customer/designer/dropdown",
};

const STORECREDIT = {
  CREDITLIST: `/store/customer/store-credits/designer-wise`,
  DETAIL: `/store/customer/store-list/`,
  STORECREDITS: `/store/customer/store-credits/`,
  STORELIST: `/store/customer/stores-all`,
  CSVREPORT: `/store/customer/csv-report`,
};

const APPOINTMENT = {
  LIST: `/appointments/customer/list`,
  DETAILS: `/appointments/customer/`,
  PRODUCT_LIST: `/appointments/customer/`,
};

const ENDPOINTS = {
  ...AUTH_ROUTES,
  ...COMMON,
  ...HEADER,
  ...PRODUCT,
  ...CART,
  ...COUPONS,
  ...DESIGNERS,
  ...STORECREDIT,
  ...APPOINTMENT,
};

export { ENDPOINTS };

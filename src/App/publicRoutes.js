import React from "react";
const CustomerSignUp = React.lazy(() =>
  import("./pages/Auth/components/CustomerSignUp")
);
const CustomerTellUs = React.lazy(() =>
  import("./pages/Auth/components/CustomerTellUs")
);
const OTPLogin = React.lazy(() => import("./pages/Auth/components/OTPLogin"));
const OTPSubmit = React.lazy(() => import("./pages/Auth/components/OTPSubmit"));
const CmsPage = React.lazy(() => import("./pages/Auth/components/CmsPage"));
const CustomerGenderDetail = React.lazy(() =>
  import("./pages/Auth/components/CustomerGenderDetail")
);
const Login = React.lazy(() => import("./pages/Auth/Login"));
const ResetPassword = React.lazy(() => import("./pages/Auth/ResetPassword"));
const ChangePassword = React.lazy(() => import("./pages/Auth/ChangePassword"));

const route = [
  { path: "/auth/login", exact: true, name: "Login", component: Login },
  {
    path: "/auth/customer-signup",
    exact: true,
    name: "CustomerSignUp",
    component: CustomerSignUp,
  },
  {
    path: "/auth/customer-tell-us-about",
    exact: true,
    name: "CustomerTellUs",
    component: CustomerTellUs,
  },
  {
    path: "/auth/customer-basic-profile",
    exact: true,
    name: "CustomerGenderDetail",
    component: CustomerGenderDetail,
  },

  {
    path: "/auth/otp-login",
    exact: true,
    name: "OTPLogin",
    component: OTPLogin,
  },
  {
    path: "/auth/submit-otp",
    exact: true,
    name: "OTPSubmit",
    component: OTPSubmit,
  },

  {
    path: "/auth/reset-password",
    exact: true,
    name: "ResetPassword",
    component: ResetPassword,
  },
  {
    path: "/set-password/:token",
    exact: true,
    name: "ChangePassword",
    component: ChangePassword,
  },
  {
    path: "/auth/public/cms/:id",
    exact: true,
    name: "CMS Page",
    component: CmsPage,
  },
  {
    path: "/privacy-policy-customers",
    exact: true,
    name: "CMS Page",
    component: CmsPage,
  },
  {
    path: "/terms-and-conditions-customers",
    exact: true,
    name: "CMS Page",
    component: CmsPage,
  },
];

export default route;

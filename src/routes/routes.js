import React from "react";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import PageNotFound from "../pages/PageNotFound";
import PrivacyPolicyEn from "../pages/PrivacyPolicyEn";
import PrivacyPolicyBm from "../pages/PrivacyPolicyBm";

const routes = [
  {
    path: "/privacy/en",
    element: <PrivacyPolicyEn />,
    isPrivate: false,
  },
  {
    path: "/privacy/bm",
    element: <PrivacyPolicyBm />,
    isPrivate: false,
  },
  {
    path: "/login",
    element: <Login />,
    isPrivate: false,
  },
  // {
  //   path: "/register",
  //   element: <Register />,
  //   isPrivate: false,
  // },
  {
    path: "/dashboard/*",
    element: <Home />,
    isPrivate: true,
  },
  {
    path: "/*",
    element: <PageNotFound />,
    isPrivate: false,
  },
];

export default routes;

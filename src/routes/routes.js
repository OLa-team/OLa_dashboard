import React from "react";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import PageNotFound from "../pages/PageNotFound";
import PrivacyPolicy from "../pages/PrivacyPolicy";

const routes = [
  {
    path: "/privacy",
    element: <PrivacyPolicy />,
    isPrivate: false,
  },
  {
    path: "/login",
    element: <Login />,
    isPrivate: false,
  },
  {
    path: "/register",
    element: <Register />,
    isPrivate: false,
  },
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

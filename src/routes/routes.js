import React from "react";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import PageNotFound from "../pages/PageNotFound";

const routes = [
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
    isPrivate: true,
  },
];

export default routes;

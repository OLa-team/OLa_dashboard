import React from "react";
import { Navigate } from "react-router-dom";
import Home from "../pages/Home";

function PrivateRoute({ isPrivate, token, element }) {
  function privateRoute(isPrivate, token, element) {
    // if route private and user credentials stored in local storage, directly navigate to Home
    if (isPrivate && Boolean(token)) {
      return <Home />;
    } else if (isPrivate && !Boolean(token)) {
      return <Navigate to="/login" />;
    } else {
      return element;
    }
  }

  return <div>{privateRoute(isPrivate, token, element)}</div>;
}

export default PrivateRoute;

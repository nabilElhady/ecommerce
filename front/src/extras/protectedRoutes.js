import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { useCookies } from "react-cookie";

const AdminRoute = ({ component: Component, ...rest }) => {
  const user = useSelector((state) => state.auth.user);
  const [cookies] = useCookies(["user"]);

  if (cookies.user && cookies.user.isAdmin === true) {
    return <Component {...rest} />;
  } else {
    console.log(cookies.user);
    return <Navigate to="/" />;
  }
};

export default AdminRoute;

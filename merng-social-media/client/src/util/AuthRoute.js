import React, { useContext } from "react";
import { Navigate } from "react-router-dom";

import { AuthContext } from "../context/auth";

function AuthRoute({ component: Component }) {
  const { user } = useContext(AuthContext);
  return user ? <Navigate to="/" /> : Component;
}

export default AuthRoute;

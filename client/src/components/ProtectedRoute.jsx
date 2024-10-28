import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";

//Protect route
const ProtectedRoute = ({ element }) => {
  const { user, loading } = useUserContext();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default ProtectedRoute;

import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    if (!token) {
      Swal.fire({
        icon: "warning",
        title: "Unauthorized",
        text: "You are not logged in. Please log in first.",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/");
      });
    }
    if (allowedRoles && !allowedRoles.includes(userRole)) {
      Swal.fire({
        icon: "error",
        title: "Access Denied",
        text: "You do not have permission.",
        confirmButtonText: "OK",
      }).then(() => {
        navigate("/");
      });
    }
  }, [allowedRoles, token]);


  if (!token || !allowedRoles.includes(userRole)) {
    return null;
  }

  return children;
};

export default ProtectedRoute;

import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { apiUrl } from "../utils/utils";

const ResetPasswordForm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromURL = queryParams.get("token");
    if (!tokenFromURL) {
      toast.error("Invalid or missing token.");
      navigate("/forgot-password");
    } else {
      setToken(tokenFromURL);
    }
  }, [location]);

  const handleReset = async (e) => {
    e.preventDefault();
    if (!newPassword) return toast.warning("New password is required");

    setLoading(true);
    try {
      const res = await fetch(apiUrl() + "user/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Password has been reset! Navigating to Login Page");
        setTimeout(() => {
          navigate("/");
          setLoading(false);
        }, 2000);
      } else {
        toast.error(data.message || "Failed to reset password");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  return (
    <div className="flex justify-center items-center">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
      />
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-[#5664F5] rounded-full animate-spin"></div>
        </div>
      )}
      <div className="w-full sm:w-3/4 md:w-2/3 lg:max-w-xl mx-auto mt-12 text-center p-6 bg-white">
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        <form onSubmit={handleReset}>
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full h-14 px-4 border border-gray-300 rounded-lg text-gray-500 text-sm mb-4"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full h-14 bg-[#007bff] text-white rounded-lg hover:bg-blue-600 transition"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;

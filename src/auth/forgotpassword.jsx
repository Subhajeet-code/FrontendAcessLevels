import React, { useState } from "react";
import { toast } from "react-toastify";
import { apiUrl } from "../utils/utils";
import { FaCheckCircle } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.warning("Email is required");
    setLoading(true);
    try {
      const res = await fetch(apiUrl() + "user/forgotPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(true);
        setLoading(false);
      } else {
        toast.error(data.message || "Something went wrong");
        setLoading(false);
      }
    } catch (err) {
      toast.error("Server error");
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSuccessMessage(false);
    setEmail("");
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
        {successMessage ? (
          <div className="bg-green-500 text-white px-4 py-6 rounded-lg shadow-lg animate-fade-in-down">
            <div className="flex items-start space-x-3">
              <FaCheckCircle className="text-white text-2xl mt-1 flex-shrink-0" />
              <div className="text-sm text-left">
                <p className="font-bold text-white mb-1">Reset Link Sent 🎉</p>
                <p className="text-white">
                  Check your <strong>Inbox</strong> or <strong>Spam</strong>{" "}
                  folder for the password reset link. Click the link to securely
                  reset your password.
                </p>
              </div>
            </div>
            <button
              onClick={resetForm}
              className="mt-4 px-4 py-2 bg-white text-green-500 rounded-lg hover:bg-gray-100 transition"
            >
              Send Another Link
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4">Forgot Password</h2>
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Enter your registered email"
                className="w-full h-14 px-4 border border-gray-300 rounded-lg text-gray-500 text-sm mb-4"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="w-full h-14 bg-[#28A745] text-white rounded-lg hover:bg-green-600 transition"
              >
                Send Reset Link
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordForm;

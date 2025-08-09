import React, { useState } from "react";
import { Alert, Layout } from "antd";
import { FaPhone, FaUser, FaIdBadge } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import {
  setCustomerAKJ,
  setCustomerPrimaryName,
  setCustomerPrimaryNumber,
} from "../redux/customerSlice";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../utils/utils";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../Online Broadband Ordering/Navbar";
import Footer from "../Online Broadband Ordering/Footer";
import Sidebar from "../Customer Portal/Sidebar";

const { Content, Sider } = Layout;

// Custom input field
const InputField = ({ placeholder, type = "text", value, onChange }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="w-full h-14 px-2 border border-gray-300 rounded-lg bg-white text-gray-500 text-sm font-['Lexend_Deca'] outline-none mb-2"
  />
);

const UserAdmin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const customerPrimaryName = useSelector((state) => state.customer.customerPrimaryName);
  const customerPrimaryNumber = useSelector((state) => state.customer.customerPrimaryNumber);
  const customerAKJ = useSelector((state) => state.customer.customerAKJ);

  const userId = localStorage.getItem("userId");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleUpdate = async () => {
    if (!userId || isNaN(userId)) {
      toast.error("Invalid user ID. Please log in again.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(apiUrl() + "user/userUpdate", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: userId,
          name: customerPrimaryName,
          cli: customerPrimaryNumber,
          akj: customerAKJ,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccessMessage(
          "✅ Profile updated successfully! If you want to update again, you can."
        );
        toast.success("Profile Updated", { autoClose: 3000 });
      } else {
        toast.error(data.message || "Update failed.");
      }
    } catch (error) {
      toast.error("Update failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="min-h-screen">
      <Navbar />

      <Layout hasSider>
        <Sider width={250} className="bg-white">
          <Sidebar />
        </Sider>

        <Content className="flex items-center justify-center p-6 bg-gray-50">
          <ToastContainer position="top-right" autoClose={4000} />

          {loading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-[#5664F5] rounded-full animate-spin"></div>
            </div>
          )}

          <div className="w-full max-w-md space-y-4">
            <div className="flex items-center space-x-2">
              <FaPhone className="text-[#28A745]" />
              <InputField
                placeholder="Customer CLI"
                type="tel"
                value={customerPrimaryNumber}
                onChange={(e) => dispatch(setCustomerPrimaryNumber(e.target.value))}
              />
            </div>
            <div className="flex items-center space-x-2">
              <FaUser className="text-[#28A745]" />
              <InputField
                placeholder="Customer Name"
                value={customerPrimaryName}
                onChange={(e) => dispatch(setCustomerPrimaryName(e.target.value))}
              />
            </div>
            <div className="flex items-center space-x-2">
              <FaIdBadge className="text-[#28A745]" />
              <InputField
                placeholder="Customer AKJ"
                value={customerAKJ}
                onChange={(e) => dispatch(setCustomerAKJ(e.target.value))}
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleUpdate}
                className="bg-[#28A745] hover:bg-[#5664F5] text-white text-sm px-12 py-3 rounded-full"
                disabled={loading}
              >
                Update
              </button>
            </div>

            {successMessage && (
              <div className="mb-4 w-full max-w-md bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg shadow-md transition-all duration-300">
                {successMessage}
              </div>
            )}

            {status && (
              <Alert
                className="mt-4"
                message={status.message}
                type={status.type}
                showIcon
              />
            )}
          </div>
        </Content>
      </Layout>

      <Footer />
    </Layout>
  );
};

export default UserAdmin;

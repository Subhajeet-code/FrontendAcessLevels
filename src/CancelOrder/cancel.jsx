import React, { useState,useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Input, Select, Alert, Spin, Layout, Card, Badge, Divider } from "antd";
import Navbar from "../Online Broadband Ordering/Navbar";
import Footer from "../Online Broadband Ordering/Footer";
import Sidebar from "../Customer Portal/Sidebar";
import { apiUrl } from "../utils/utils";
const { Option } = Select;

const Cancel = () => {
  const [orderId, setOrderId] = useState("");
  const [cancellationReason, setCancellationReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [responseData, setResponseData] = useState(null);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     Swal.fire({
  //       icon: "warning",
  //       title: "Unauthorized",
  //       text: "You are not logged in. Please log in first.",
  //       confirmButtonText: "OK",
  //     }).then(() => {
  //       navigate("/");
  //     });
  //   }
  // }, [navigate]);
  const cancellationReasons = [
    "Changed Mind",
    "Partner Request - Lead time too long",
    "Partner Request - Placed order with another provider",
    "Capacity Issues",
    "Order Timed out",
    "ECC Rejection",
    "Wayleave/PTW",
    "Placement Error",
    "Duplicate",
    "Customer Never Contacted",
    "No Transfer Authorisation",
    "Deliberate Mislead",
    "Failure To Cancel",
    "End User Not Moving",
    "No Authorisation",
    "Customer Not Aware",
    "Purchased Different Product",
    "No longer Required",
  ];

  // Get status color based on state
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "cancelled":
        return "error";
      case "completed":
        return "success";
      case "in progress":
        return "processing";
      case "acknowledged":
        return "warning";
      default:
        return "default";
    }
  };

  const handleCancelOrder = async () => {
    if (!orderId || !cancellationReason) {
      setError("Please fill out all required fields.");
      return;
    }

    setError("");
    setSuccessMessage("");
    setResponseData(null);
    setLoading(true);

    const payload = {
      cancellationReason: cancellationReason,
      productOrderCancel: {
        id: orderId,
      },
      "@type": "CancelProductorder",
    };

    try {
      const response = await fetch(
        apiUrl() + `orderstatus/cancel-order/${orderId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage("Order cancellation request submitted successfully.");
        setResponseData(data);
      } else {
        const errorResponse = await response.json();
        console.error("API Error Response:", errorResponse);
        setError(
          errorResponse.message ||
            "An error occurred while cancelling the order."
        );
      }
    } catch (error) {
      console.error("Fetch error:", error);
      setError(
        error.response?.data?.message ||
          "An error occurred while cancelling the order."
      );
    } finally {
      setLoading(false);
    }
  };

  // Render styled response data
  const renderCancellationResponse = () => {
    if (!responseData || !responseData.data) return null;

    const { data, status } = responseData;
    const { id, state, cancellationReason, requestedCancellationDate } = data;

    // Format the cancellation date
    const formattedDate = requestedCancellationDate
      ? new Date(requestedCancellationDate).toLocaleString()
      : "N/A";

    return (
      <Card
        className="shadow-md border-0 overflow-hidden"
        title={
          <div className="flex items-center justify-between">
            <span>Cancellation Request Submitted</span>
            {status && <Badge status="success" text="Success" />}
          </div>
        }
      >
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-gray-800 mb-0">
                Order #{id}
              </h3>
              <Badge
                status={getStatusColor(state)}
                text={
                  <span className="text-base font-medium capitalize">
                    {state}
                  </span>
                }
              />
            </div>
            <Divider className="my-3" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Cancellation Reason
                </p>
                <p className="text-base font-semibold">{cancellationReason}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  Requested On
                </p>
                <p className="text-base font-semibold">{formattedDate}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-700 mb-2">
              Additional Information
            </h3>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <ul className="list-none space-y-2 text-sm">
                <li className="flex justify-between">
                  <span className="text-gray-600">API Endpoint:</span>
                  <span className="font-medium">{responseData.url}</span>
                </li>
                {responseData.payload && (
                  <li className="flex justify-between">
                    <span className="text-gray-600">Payload Type:</span>
                    <span className="font-medium">
                      {responseData.payload["@type"] || "N/A"}
                    </span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="bg-green-50 text-green-700 px-4 py-2 rounded-lg border border-green-200 text-sm">
              Your cancellation request has been logged. Current status:{" "}
              <strong>{state}</strong>
            </div>
            <button
              onClick={() => {
                setResponseData(null);
                setSuccessMessage("");
              }}
              className="text-gray-500 hover:text-gray-700 text-sm px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <Layout className="min-h-screen">
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <Layout>
          <Layout hasSider>
            <Sidebar />
            <div className="flex-grow flex items-center justify-center p-4">
              {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="w-16 h-16 border-4 border-gray-200 border-t-[#5664F5] rounded-full animate-spin"></div>
                </div>
              )}

              <div className="w-full max-w-2xl">
                <h1 className="text-xl font-semibold text-left mb-6">
                  Cancel Order
                </h1>

                {error && (
                  <Alert
                    message={error}
                    type="error"
                    showIcon
                    className="mb-4"
                  />
                )}
                {successMessage && !responseData && (
                  <Alert
                    message={successMessage}
                    type="success"
                    showIcon
                    className="mb-4"
                  />
                )}

                {!responseData && (
                  <Card className="shadow-md mb-6">
                    <div className="flex flex-col justify-start space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Order ID*
                        </label>
                        <Input
                          placeholder="Enter Order ID (e.g., AO6162477)"
                          value={orderId}
                          onChange={(e) => setOrderId(e.target.value)}
                          className="w-full h-12 px-3 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-['Lexend_Deca'] outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cancellation Reason*
                        </label>
                        <Select
                          placeholder="Select Reason for Cancellation"
                          value={cancellationReason || undefined}
                          onChange={(value) => setCancellationReason(value)}
                          className="w-full"
                          size="large"
                        >
                          {cancellationReasons.map((reason) => (
                            <Option key={reason} value={reason}>
                              {reason}
                            </Option>
                          ))}
                        </Select>
                      </div>

                      <div className="flex justify-end mt-4">
                        <button
                          onClick={handleCancelOrder}
                          className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white text-sm px-12 py-3 rounded-full transition-colors duration-300"
                          disabled={loading}
                        >
                          Cancel Order
                        </button>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Display styled response data if available */}
                {responseData && renderCancellationResponse()}
              </div>
            </div>
          </Layout>
        </Layout>
        <Footer />
      </div>
    </Layout>
  );
};

export default Cancel;

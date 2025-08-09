import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Input, Alert, Spin, Layout, Card, Badge, Divider, Tag } from "antd";
import axios from "axios";
import Navbar from "../Online Broadband Ordering/Navbar";
import Footer from "../Online Broadband Ordering/Footer";
import Sidebar from "../Customer Portal/Sidebar";
import { apiUrl } from "../utils/utils";

const StatusChecker = () => {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [orderData, setOrderData] = useState(null);
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

  const handleCheckStatus = async () => {
    if (!orderId) {
      setError("Please enter an Order ID.");
      return;
    }

    setError("");
    setSuccessMessage("");
    setOrderData(null);
    setLoading(true);

    try {
      const response = await axios.get(
        `${apiUrl()}orderstatus/status-checker/${orderId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setSuccessMessage("Order status fetched successfully.");
        setOrderData(response.data); 
      }
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "An error occurred while checking the order status."
      );
    } finally {
      setLoading(false);
    }
  };


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
      case "failed":
        return "error";
      default:
        return "default";
    }
  };

  const renderOrderDetails = () => {
    if (!orderData || !orderData.data) return null;

    const { data } = orderData;
    const orderState = data.state;
    const orderId = data.id;

    const productItem = data.productOrderItem && data.productOrderItem[0];

    const product = productItem?.product;
    const productName = product?.name;

    const place = product?.place && product?.place[0];
    const buildingName = place?.buildingName;
    const streetNr = place?.streetNr;
    const streetName = place?.streetName;
    const postcode = place?.postcode;
    const locality = place?.locality;

    // Find provisioning command
    const provisioningCommand =
      product?.productCharacteristic?.find(
        (char) => char.name === "provisioningCommand"
      )?.value || "Not specified";

    // Format expected completion date
    const expectedDate = data.expectedCompletionDate
      ? new Date(data.expectedCompletionDate).toLocaleDateString()
      : "N/A";

    return (
      <Card
        className="mt-6 shadow-md border-0 overflow-hidden"
        style={{ maxWidth: "100%" }}
      >
        <div className="bg-gray-50 -mx-6 -mt-6 px-6 py-4 mb-4 border-b">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800 mb-0">
                Order #{orderId}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                Order Date: {data.orderDate || "N/A"}
              </p>
            </div>
            <Badge
              status={getStatusColor(orderState)}
              text={
                <span className="text-base font-medium capitalize">
                  {orderState}
                </span>
              }
            />
          </div>
        </div>

        <div className="space-y-6">
          {/* Order Type and Status in a new row */}
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <h3 className="font-semibold text-gray-700 mb-2">Order Type</h3>
              <div className="bg-white rounded-lg p-3 border border-gray-200 h-full">
                <Tag color="purple" className="text-sm py-1 px-3">
                  {provisioningCommand}
                </Tag>
              </div>
            </div>

            <div className="flex-1 min-w-[200px]">
              <h3 className="font-semibold text-gray-700 mb-2">
                Expected Completion
              </h3>
              <div className="bg-white rounded-lg p-3 border border-gray-200 h-full flex items-center">
                <span className="text-base font-medium">{expectedDate}</span>
              </div>
            </div>
          </div>

          {/* Address in its own row */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">
              Installation Address
            </h3>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <p className="m-0">
                {streetNr ? `${streetNr} ` : ""}
                {streetName || "N/A"}
              </p>
              {buildingName && <p className="m-0">{buildingName}</p>}
              <p className="m-0">
                {locality ? `${locality}, ` : ""}
                {postcode || "N/A"}
              </p>
            </div>
          </div>

          {/* Product Section */}
          <div>
            <h3 className="font-semibold text-gray-700 mb-2">
              Product Details
            </h3>
            <div className="bg-white rounded-lg p-3 border border-gray-200">
              <Tag color="blue" className="text-sm py-1 px-3 mr-0">
                {productName || "N/A"}
              </Tag>

              {/* Product characteristics */}
              {product?.productCharacteristic && (
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {product.productCharacteristic
                    .filter((char) =>
                      [
                        "productSpeed",
                        "careLevel",
                        "accessCircuit",
                        "supplierName",
                      ].includes(char.name)
                    )
                    .map((char) => (
                      <div key={char.name} className="flex flex-col">
                        <span className="text-xs text-gray-500">
                          {char.name}
                        </span>
                        <span className="text-sm font-medium">
                          {char.value}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>

          {/* Notes Section - Optional */}
          {data.note && data.note.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-700 mb-2">Order Notes</h3>
              <div className="bg-white rounded-lg p-3 border border-gray-200 max-h-40 overflow-y-auto">
                {data.note.map((note, index) => (
                  <div
                    key={index}
                    className="mb-2 pb-2 border-b border-gray-100 last:border-0 last:mb-0 last:pb-0"
                  >
                    <p className="text-sm m-0">{note.text}</p>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">
                        {note.author}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(note.date).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
                  Check Order Status
                </h1>

                {error && (
                  <Alert
                    message={error}
                    type="error"
                    showIcon
                    className="mb-4"
                  />
                )}
                {successMessage && (
                  <Alert
                    message={successMessage}
                    type="success"
                    showIcon
                    className="mb-4"
                  />
                )}

                <div className="flex flex-col justify-start space-y-4">
                  <Input
                    placeholder="Enter Order ID"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    className="w-full h-14 px-2 border border-gray-300 rounded-lg bg-white text-gray-500 text-sm font-['Lexend_Deca'] outline-none mb-2"
                  />

                  <div className="flex justify-end">
                    <button
                      onClick={handleCheckStatus}
                      className="bg-[#28A745] hover:bg-[#5664F5] text-white text-sm px-12 py-3 rounded-full"
                      disabled={loading}
                    >
                      Check Status
                    </button>
                  </div>
                </div>
                {renderOrderDetails()}

                {orderData && (
                  <div className="mt-6">
                    <h2 className="text-lg font-semibold mb-2">
                      Raw API Response
                    </h2>
                    <pre className="bg-gray-100 p-4 rounded-lg text-xs overflow-x-auto">
                      {JSON.stringify(orderData, null, 2)};
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </Layout>
        </Layout>
        <Footer />
      </div>
    </Layout>
  );
};

export default StatusChecker;

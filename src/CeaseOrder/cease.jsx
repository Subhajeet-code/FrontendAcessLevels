import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Input, Select, Alert, Button, Layout, Card } from "antd";
import axios from "axios";
import Navbar from "../Online Broadband Ordering/Navbar";
import Footer from "../Online Broadband Ordering/Footer";
import Sidebar from "../Customer Portal/Sidebar";
import { apiUrl } from "../utils/utils";

const { Option } = Select;

function getLocalISOString() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Month is 0-based
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.000Z`;
}

const Cancel = () => {
  const [orderId, setOrderId] = useState("");
  const [ceaseReason, setCeaseReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [partnerOrderReference, setPartnerOrderReference] = useState("");
  const [productId, setProductId] = useState("");
  const [requestedDate, setRequestedDate] = useState("");
  const [orderFetched, setOrderFetched] = useState(false);
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

  const ceaseReasons = [
    "Customer Vacating Premises",
    "Property Destroyed",
    "Cable Migration",
    "Working Line Takeover",
    "Migration from WLR",
    "Migration from MPF",
    "Migration from SOGEA",
    "Migration from SMPF",
    "Appointed Modify",
    "Basic Provide",
    "Cease",
    "Modify",
    "Managed Modify",
    "Managed Cease",
    "Migration from GEA Subsequent Provide",
    "Sub Provide With Engineering Visit",
    "Service Ceased by Operator",
    "Change of CP",
    "Change of Product/Technology",
    "Working line takeover",
    "Working line takeover with change of CP",
  ];

  const handleFetchOrder = async () => {
    if (!orderId) {
      setError("Order ID is required.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${apiUrl()}orderstatus/status-checker/${orderId}`
      );
      const data = response.data?.data;
      if (data) {
        const productItem = data.productOrderItem?.[0];
        const partnerRef = productItem?.product?.productCharacteristic?.find(
          (item) => item.name === "partnerOrderReference"
        )?.value;

        setPartnerOrderReference(partnerRef || "");
        setProductId(productItem?.product?.id || "");
        setRequestedDate(data?.requestedCompletionDate || "");

        setOrderFetched(true);
      } else {
        setError("Order not found.");
      }
    } catch (err) {
      setError("Failed to fetch order details.");
    } finally {
      setLoading(false);
    }
  };

  const handleCeaseSubmit = async () => {
    if (!ceaseReason) {
      setError("Please select a cease reason.");
      return;
    }

    setLoading(true);
    setError("");
    const today = new Date();
    const formattedDate = getLocalISOString();
    try {
      const token = localStorage.getItem("token");
      const payload = {
        orderId,
        productId,
        partnerOrderReference,
        reasonForCease: ceaseReason,
        requestedCompletionDate: formattedDate,
      };

      const response = await axios.post(
        `${apiUrl()}orderstatus/ceaseOrder`,
        payload
        // ,
        // {
        //   headers: {
        //     Authorization: `Bearer ${token}`,
        //   },
        // }
      );

      if (response.data?.status) {
        setSuccessMessage("Cease Order submitted successfully.");

        setOrderId("");
        setCeaseReason("");
        setProductId("");
        setPartnerOrderReference("");
        setOrderFetched(false);
      } else {
        setError("Cease order failed.");
      }
    } catch (err) {
      setError("API error while submitting cease request.");
    } finally {
      setLoading(false);
    }
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
                <h1 className="text-xl font-semibold text-left mb-6 text-green-600">
                  Cease Order
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

                <Card className="shadow-md mb-6">
                  <div className="flex flex-col justify-start space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Order ID*
                      </label>
                      <Input
                        placeholder="Enter Order ID"
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                      />
                    </div>

                    {!orderFetched ? (
                      <Button
                        type="primary"
                        onClick={handleFetchOrder}
                        className="w-full"
                      >
                        Fetch Order
                      </Button>
                    ) : (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Partner Order Reference
                          </label>
                          <Input value={partnerOrderReference} disabled />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product ID
                          </label>
                          <Input value={productId} disabled />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Cease Reason*
                          </label>
                          <Select
                            placeholder="Select Cease Reason"
                            value={ceaseReason}
                            onChange={setCeaseReason}
                            className="w-full"
                          >
                            {ceaseReasons.map((reason) => (
                              <Option key={reason} value={reason}>
                                {reason}
                              </Option>
                            ))}
                          </Select>
                        </div>

                        <Button
                          type="primary"
                          onClick={handleCeaseSubmit}
                          className="w-full"
                        >
                          Submit Cease Request
                        </Button>
                      </>
                    )}
                  </div>
                </Card>
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

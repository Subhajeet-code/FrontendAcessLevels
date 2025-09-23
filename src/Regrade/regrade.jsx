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

const Regrade = () => {
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [productId, setProductId] = useState("");
  const [currentSpeed, setCurrentSpeed] = useState("");
  const [accessCircuit, setAccessCircuit] = useState("");
  const [upgradeOptions, setUpgradeOptions] = useState([]);
  const [selectedNewSpeed, setSelectedNewSpeed] = useState("");
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

  const handleFetchOrder = async () => {
    if (!orderId) {
      setError("Order ID is required.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");
    try {
      const response = await axios.get(
        `${apiUrl()}orderstatus/status-checker/${orderId}`
      );
      const data = response.data?.data;

      if (data) {
        const productItem = data.productOrderItem?.[0];
        const productChar = productItem?.product?.productCharacteristic || [];

        const circuit = productChar.find(
          (p) => p.name === "accessCircuit"
        )?.value;
        const speed = productChar.find((p) => p.name === "productSpeed")?.value;

        setAccessCircuit(circuit);
        setCurrentSpeed(speed);
        setProductId(productItem?.product?.id || "");
        setOrderFetched(true);

        const fttpSpeeds = [
          "40/10",
          "80/20",
          "115/20",
          "160/30",
          "220/30",
          "330/50",
          "550/75",
          "1000/115",
        ];

        let available = [];

        if (circuit === "FTTP") {
          available = fttpSpeeds.filter(
            (tier) => fttpSpeeds.indexOf(tier) > fttpSpeeds.indexOf(speed)
          );
        } else if (circuit === "SOGEA") {
          if (speed === "40/10") {
            available = ["80/20"];
          } else {
            available = [];
          }
        }

        setUpgradeOptions(available);
      } else {
        setError("Order not found.");
      }
    } catch (err) {
      setError("Failed to fetch order details.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegrade = async () => {
    if (!selectedNewSpeed) {
      setError("Please select a new speed to regrade.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await axios.post(
        `${apiUrl()}orderstatus/regradeProductSpeed`,
        {
          productId,
          newSpeed: selectedNewSpeed,
        }
      );

      if (response.data.status) {
        setSuccessMessage(response.data.message);
        setSelectedNewSpeed("");
      } else {
        setError(response.data.message || "Failed to regrade.");
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong while submitting the regrade request.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="min-h-screen">
      <div>
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
                  Regrade
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
                        Fetch Order Details
                      </Button>
                    ) : (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Product ID
                          </label>
                          <Input value={productId} disabled />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Current Speed
                          </label>
                          <Input value={currentSpeed} disabled />
                        </div>

                        {upgradeOptions.length > 0 ? (
                          <>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Upgrade To
                              </label>
                              <Select
                                placeholder="Select new speed"
                                value={selectedNewSpeed}
                                onChange={(value) => setSelectedNewSpeed(value)}
                                className="w-full"
                              >
                                {upgradeOptions.map((speed) => (
                                  <Option key={speed} value={speed}>
                                    {speed}
                                  </Option>
                                ))}
                              </Select>
                            </div>

                            <Button
                              type="primary"
                              onClick={handleRegrade}
                              className="w-full mt-4"
                              disabled={!selectedNewSpeed}
                            >
                              Regrade
                            </Button>
                          </>
                        ) : (
                          <Alert
                            message="No upgrade options available for this product."
                            type="info"
                            showIcon
                          />
                        )}
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

export default Regrade;

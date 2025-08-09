// components/OrderDetails.jsx
import React, { useEffect, useState } from "react";
import { Card, Badge, Tag, Alert } from "antd";
import axios from "axios";
import { apiUrl } from "../utils/utils";

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

const OrderDetails = ({ orderId }) => {
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      setError("");
      setOrderData(null);
      try {
        const response = await axios.get(
          `${apiUrl()}orderstatus/status-checker/${orderId}`
        );
        setOrderData(response.data);
      } catch (err) {
        setError("Failed to fetch order details.");
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <Alert message={error} type="error" showIcon />;
  if (!orderData?.data) return null;

  const { data } = orderData;
  const orderState = data.state;

  // Extract product item (assuming first item in array)
  const productItem = data.productOrderItem && data.productOrderItem[0];
  const productId = data.productOrderItem[0].product.id;
  // Extract product details
  const product = productItem?.product;
  const productName = product?.name;

  // Extract place details (location)
  const place = product?.place && product?.place[0];
  const buildingName = place?.buildingName;
  const streetNr = place?.streetNr;
  const streetName = place?.streetName;
  const postcode = place?.postcode;
  const locality = place?.locality;
  const provisioningCommand =
    product?.productCharacteristic?.find(
      (char) => char.name === "provisioningCommand"
    )?.value || "Not specified";

  const expectedDate = data.expectedCompletionDate
    ? new Date(data.expectedCompletionDate).toLocaleDateString()
    : "N/A";

  return (
    <Card className="shadow-md" title={null}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{`Order #${data.id}`}</h2>
        <Badge
          status={getStatusColor(orderState)}
          text={<span className="capitalize">{orderState}</span>}
        />
      </div>

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

      <div>
        <h3 className="font-semibold text-gray-700 mb-2">
          Installation Address
        </h3>
        <div className="bg-white rounded-lg p-3 border border-gray-200 flex justify-between items-start">
          <div>
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
          {product?.productCharacteristic?.find(
            (char) => char.name === "broadbandUsername"
          ) && (
            <div className=" p-3 bg-gray-50 border border-blue-100 rounded-md">
              <h4 className="text-sm font-semibold text-blue-700 mb-1">
                Broadband Username
              </h4>
              <p className="text-sm text-gray-800 font-mono">
                {
                  product.productCharacteristic.find(
                    (char) => char.name === "broadbandUsername"
                  )?.value
                }
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Product Section */}
      <div>
        <h3 className="font-semibold text-gray-700 mb-2">Product Details</h3>
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
                    <span className="text-xs text-gray-500">{char.name}</span>
                    <span className="text-sm font-medium">{char.value}</span>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
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
                  <span className="text-xs text-gray-500">{note.author}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(note.date).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
};

export default OrderDetails;

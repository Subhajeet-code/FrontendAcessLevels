import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import {
  Select,
  Card,
  Typography,
  Button,
  Input,
  Layout,
  DatePicker,
  message,
  Result,
} from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { apiUrl } from "../utils/utils";
import Navbar from "../Online Broadband Ordering/Navbar";
import FooterComponent from "../Online Broadband Ordering/Footer";
import Sidebar from "../Customer Portal/Sidebar";
import { useSelector, useDispatch } from "react-redux";
import {
  setCustomerPrimaryName,
  setCustomerPrimaryNumber,
  setCustomerSecondaryName,
  setCustomerSecondaryNumber,
  setIpBlockSize,
  setAuthor1,
  setAuthor2,
  setAuthor3,
  setCustomerEmail,
  setCustomerAKJ,
} from "../redux/customerSlice";
import { click } from "@testing-library/user-event/dist/click";
dayjs.extend(utc);
const { Title, Text } = Typography;

const Order = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const {
    customerPrimaryName,
    customerPrimaryNumber,
    customerSecondaryName,
    customerSecondaryNumber,
    ipBlockSize,
    author1,
    author2,
    author3,
    customerEmail,
    customerAKJ,
  } = useSelector((state) => state.customer);

  const appointmentDetails = useSelector(
    (state) => state.address.appointmentDetails
  );
  const selectedProductDetails = useSelector(
    (state) => state.address.selectedProductDetails
  );
  const selectedAddress = useSelector((state) => state.address.selectedAddress);

  const uprn = appointmentDetails?.uprn || "";
  const alk = appointmentDetails?.alk || "";
  const districtCode = appointmentDetails?.districtCode || "";
  const supplierName = appointmentDetails?.supplierName || "";
  const accessType = appointmentDetails?.accessType || "";
  const productName = appointmentDetails?.productName || "";
  const productSpeed = appointmentDetails?.productSpeed || "";
  const provisioningCommand = appointmentDetails?.provisioningCommand || "";

  const [selectedAccessLineId, setSelectedAccessLineId] = useState(
    selectedProductDetails?.accessLines || ""
  );

  const accessLines = selectedProductDetails?.accessLines || [];
  const ontReferenceNo = selectedProductDetails?.ontReferenceNo || "";
  const ontPortNo = selectedProductDetails?.ontPortNo || "";
  const { cpwnRef, serviceId } = useSelector((state) => state.address);

  const selectedAppointmentDate = useSelector((state) =>
    state.address.selectedAppointment.appointmentDate
      ? dayjs(state.address.selectedAppointment.appointmentDate)
      : null
  );
  console.log("selectedappointmentdate", selectedAppointmentDate);
  const supplierAppointmentId = useSelector(
    (state) => state.address.selectedAppointment?.supplierAppointmentId
  );

  const [loading, setLoading] = useState(false);
  const [requestedCompletionDate, setRequestedCompletionDate] = useState(
    selectedAppointmentDate
  );
  const [apiResponse, setApiResponse] = useState(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const [postCode, setPostCode] = useState(
    selectedAddress?.site?.address?.postCode || "N/A"
  );
  const [isPostcodeChanged, setIsPostcodeChanged] = useState(false);

  const handleCreateOrder = async () => {
    let errors = [];

    if (!customerPrimaryName.trim()) {
      errors.push("Customer Name");
    }
    if (!customerEmail.trim()) {
      errors.push("Customer Email");
    }
    if (!customerAKJ.trim()) {
      errors.push("Customer AKJ");
    }
    if (!customerPrimaryNumber.trim()) {
      errors.push("Customer CLI");
    }
    if (errors.length > 0) {
      message.error(
        `${errors.join(", ")} ${errors.length > 1 ? "are" : "is"} required.`
      );
      return;
    }

    if (!requestedCompletionDate) {
      message.error("Please select a Requested Completion Date.");
      return;
    }

    let formattedDate = dayjs(requestedCompletionDate)
      .startOf("day")
      .format("YYYY-MM-DDTHH:mm:ss[Z]");

    console.log("PN", productName);
    let transformedProductName = productName;
    switch (provisioningCommand) {
      case "ProvideNew":
        transformedProductName = productName?.startsWith("C-")
          ? productName.substring(2) + "-NEWLINE"
          : productName + "-NEWLINE";
        break;
      case "Switch":
        if (productName === "C-OR-FTTP") {
          transformedProductName = productName?.startsWith("C-")
            ? productName.substring(2) + "-Switch"
            : productName + "-Switch";
        } else if (productName === "C-OR-SOGEA") {
          switch (ipBlockSize) {
            case "Dynamic IP":
              transformedProductName =
                "createProductOrder-SOGEA-Switch-DynamicIP";
              break;
            case "Static IP - 1":
              transformedProductName = "createProductOrder-SOGEA-Switch-INP";
              break;
            case "Static IP - 4":
              transformedProductName =
                "createProductOrder-SOGEA-Switch-StaticIP";
              break;
          }
        } else if (productName === "C-CFH-FTTP") {
          transformedProductName = "createProductOrder-CFH-Switch";
        }
        break;
      case "SwitchToStop":
        transformedProductName = productName?.startsWith("C-")
          ? productName.substring(2) + "-SwitchToStop"
          : productName + "-SwitchToStop";
        break;
      case "SwitchToNew":
        transformedProductName = productName?.startsWith("C-")
          ? productName.substring(2) + "-SwitchToNew"
          : productName + "-SwitchToNew";
        break;
      case "ReplaceToStop":
        if (productName === "C-OR-FTTP") {
          transformedProductName = "createProductOrder-Openreach-ReplaceToStop";
        }
        break;
      case "ReplaceToNew":
        if (productName === "C-OR-FTTP") {
          transformedProductName = "createProductOrder-Openreach-ReplaceToNew";
        }
        break;
      case "Restart":
        if (productName === "C-OR-FTTP") {
          transformedProductName = "createProductOrder-Openreach-Restart";
        } else if (productName === "C-OR-SOGEA") {
          transformedProductName = "createProductOrder-SOGEA-Restart";
        }
        break;
      case "Takeover":
        if (productName === "C-OR-FTTP") {
          transformedProductName = "createProductOrder-Openreach-TakeOver";
        } else if (productName === "C-OR-SOGEA") {
          transformedProductName = "createProductOrder-SOGEA-Takeover";
        } else if (productName === "C-CFH-FTTP") {
          transformedProductName = "createProductOrder-CFH-Takeover";
        }
        break;
      case "Replace":
        if (productName === "C-OR-SOGEA") {
          transformedProductName = "createProductOrder-SOGEA-Replace";
        }
        break;
      default:
        transformedProductName = productName;
    }

    console.log("action", transformedProductName);
    const trimmedServiceId = (serviceId || "").toString().replace(/\s+/g, "");

    const dataToSend = {
      action: transformedProductName,
      appointmentId: supplierAppointmentId,
      districtCode,
      galk: alk,
      ...(uprn ? { uprn: uprn } : {}),
      postCode: isPostcodeChanged
        ? postCode
        : selectedAddress?.site?.address?.postCode,
      locality: selectedAddress?.site?.address?.locality
        ? selectedAddress?.site?.address?.locality
        : selectedAddress?.site?.address?.postTown,
      streetName: selectedAddress?.site?.address?.street
        ? selectedAddress?.site?.address?.street
        : selectedAddress?.site?.address?.subBuilding,
      subUnitNumber: selectedAddress?.site?.address?.subBuilding || "",
      streetNr: selectedAddress?.site?.address?.buildingNumber || "",
      buildingName: selectedAddress?.site?.address?.buildingName || "",
      postTown: selectedAddress?.site?.address?.postTown || "",
      productSpeed: productSpeed,
      requestedCompletionDate: formattedDate,
      ...(selectedAccessLineId ? { accessLineId: selectedAccessLineId } : {}),
      ...(ontReferenceNo ? { ontReferenceNo: ontReferenceNo } : {}),
      ...(ontPortNo ? { ontPortNo: ontPortNo } : {}),
      customerPrimaryName,
      customerPrimaryNumber,
      // customerSecondaryName,
      // customerSecondaryNumber,
      customerSecondaryName: customerSecondaryName?.trim() || "",
      customerSecondaryNumber: customerSecondaryNumber?.trim() || "",

      ipBlockSize,
      author1,
      author2,
      author3,
      customerEmail,
      customerAKJ,
      // ...(serviceId ? { service_id: serviceId } : {}),
      ...(trimmedServiceId ? { service_id: trimmedServiceId } : {}),
      ...(cpwnRef ? { cpwn_ref: cpwnRef } : {}),
    };

    setLoading(true);
    setApiResponse(null);
    try {
      const response = await fetch(apiUrl() + "order/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
      const responseData = await response.json();
      setApiResponse(responseData);
      if (response.ok) {
        message.success("Order created successfully!");

        const saveOrderPayload = {
          order_id: responseData?.data?.id,
          customer_name: customerPrimaryName,
          product_type: accessType,
          provider: supplierName,
          expected_completion_date: formattedDate,
          status: responseData?.data?.state,
          provisioning_command: provisioningCommand,
          productr: productSpeed,
        };

        const saveOrderResponse = await fetch(apiUrl() + "user/saveOrder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(saveOrderPayload),
        });
        if (saveOrderResponse.ok) {
          setOrderSuccess(true); // Set success state
        } else {
          const errorData = await saveOrderResponse.json();
          message.error(errorData.message || "Failed to save order");
        }
      } else {
        message.error(responseData.message || "Failed to create order.");
      }
    } catch (error) {
      message.error("An error occurred while creating the order.");
      setApiResponse({
        type: "error",
        message: "An error occurred while creating the order.",
      });
    }
    setLoading(false);
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
              {orderSuccess ? (
                <Result
                  status="success"
                  title="Order Created Successfully!"
                  subTitle={
                    <>
                      Your order has been placed successfully. You will receive
                      further details soon.
                      <br />
                      <Text strong>Order ID: {apiResponse?.data?.id}</Text>
                    </>
                  }
                />
              ) : (
                <Card
                  title={
                    <Title level={3} style={{ textAlign: "center" }}>
                      Create Order
                    </Title>
                  }
                  style={{
                    maxWidth: 600,
                    margin: "0 auto",
                    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                  }}
                >
                  {/* Form Fields */}
                  <div style={{ marginBottom: 16 }}>
                    <Text strong>Heal Action:</Text>
                    <Input value={productName || "N/A"} disabled />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <Text strong>Supplier Appointment ID:</Text>
                    <Input value={supplierAppointmentId || "N/A"} disabled />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <Text strong>District Code:</Text>
                    <Input value={districtCode || "N/A"} disabled />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <Text strong>Galk:</Text>
                    <Input value={alk || "N/A"} disabled />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <Text strong>Postcode:</Text>
                    <Input
                      value={postCode}
                      onChange={(e) => {
                        setPostCode(e.target.value);
                        setIsPostcodeChanged(true);
                      }}
                    />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <Text strong>Street Name:</Text>
                    <Input
                      value={
                        selectedAddress?.site?.address?.street ||
                        selectedAddress?.site?.address?.subBuilding ||
                        "N/A"
                      }
                      disabled
                    />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <Text strong>
                      {selectedAddress?.site?.address?.buildingName
                        ? "Building Name:"
                        : "Street Number:"}
                    </Text>
                    <Input
                      value={
                        selectedAddress?.site?.address?.buildingName ||
                        selectedAddress?.site?.address?.buildingNumber ||
                        "N/A"
                      }
                      disabled
                    />
                  </div>
                  {accessLines.length > 0 && (
                    <div style={{ marginBottom: 16 }}>
                      <Text strong>Select Access Line:</Text>
                      <Select
                        value={selectedAccessLineId}
                        onChange={(value) => setSelectedAccessLineId(value)}
                        style={{ width: "100%", marginTop: 8 }}
                        placeholder="-- Select Access Line --"
                      >
                        {accessLines.map((line) => (
                          <Select.Option key={line.id} value={line.id}>
                            {line.id} | {line.status} |{line.type} |{" "}
                            {line.location}
                          </Select.Option>
                        ))}
                      </Select>
                    </div>
                  )}
                  {/* Date Picker */}
                  <div style={{ marginBottom: 16 }}>
                    <Text strong>Requested Completion Date:</Text>
                    <DatePicker
                      style={{ width: "100%" }}
                      // showTime={{ format: "HH:mm:ss" }}
                      format="YYYY-MM-DD"
                      value={requestedCompletionDate}
                      onChange={(date) => setRequestedCompletionDate(date)}
                      disabled
                    />
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <Text strong>Customer Primary Name</Text>
                    <Input
                      value={customerPrimaryName}
                      onChange={(e) =>
                        dispatch(setCustomerPrimaryName(e.target.value))
                      }
                      placeholder="Enter Primary Name"
                    />
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <Text strong>Customer Primary Number</Text>
                    <Input
                      value={customerPrimaryNumber}
                      onChange={(e) =>
                        dispatch(setCustomerPrimaryNumber(e.target.value))
                      }
                      placeholder="Enter Primary Number"
                    />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <Text strong>Customer Secondary Name</Text>
                    <Input
                      value={customerSecondaryName}
                      onChange={(e) =>
                        dispatch(setCustomerSecondaryName(e.target.value))
                      }
                      placeholder="Enter Secondary Name"
                    />
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <Text strong>Customer Secondary Number</Text>
                    <Input
                      value={customerSecondaryNumber}
                      onChange={(e) =>
                        dispatch(setCustomerSecondaryNumber(e.target.value))
                      }
                      placeholder="Enter Secondary Number"
                    />
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <Text strong>IP Block Size</Text>
                    <Select
                      value={ipBlockSize}
                      onChange={(value) => dispatch(setIpBlockSize(value))}
                      placeholder="Select IP Block Size"
                      style={{ width: "100%" }}
                    >
                      <Select.Option value="Dynamic IP">
                        Dynamic IP
                      </Select.Option>
                      <Select.Option value="Static IP - 1">
                        Static IP - 1
                      </Select.Option>
                      <Select.Option value="Static IP - 4">
                        Static IP - 4
                      </Select.Option>
                      {!(
                        productName === "C-OR-SOGEA" &&
                        provisioningCommand === "Switch"
                      ) && (
                        <Select.Option value="Static IP - 8">
                          Static IP - 8
                        </Select.Option>
                      )}

                      {/* <Select.Option value="Static IP - 8">
                        Static IP - 8
                      </Select.Option> */}
                    </Select>
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <Text strong>Author 1</Text>
                    <Input
                      value={author1}
                      onChange={(e) => dispatch(setAuthor1(e.target.value))}
                      placeholder="HazardNotes"
                    />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <Text strong>Author 2</Text>
                    <Input
                      value={author2}
                      onChange={(e) => dispatch(setAuthor2(e.target.value))}
                      placeholder="HazardNotes"
                    />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <Text strong>Author 3</Text>
                    <Input
                      value={author3}
                      onChange={(e) => dispatch(setAuthor3(e.target.value))}
                      placeholder="EngineerVisitNotes"
                    />
                  </div>
                  <div style={{ marginBottom: 16 }}>
                    <Text strong>Customer Email</Text>
                    <Input
                      value={customerEmail}
                      onChange={(e) =>
                        dispatch(setCustomerEmail(e.target.value))
                      }
                      placeholder="Enter Customer Email"
                    />
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <Text strong>Customer AKJ</Text>
                    <Input
                      value={customerAKJ}
                      onChange={(e) => dispatch(setCustomerAKJ(e.target.value))}
                      placeholder="Enter Customer CLI"
                    />
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="primary"
                    style={{ width: "100%" }}
                    onClick={handleCreateOrder}
                    loading={loading}
                  >
                    {loading ? "Creating Order..." : "Create Order"}
                  </Button>

                  {/* API Response Message */}
                  {apiResponse && (
                    <div
                      style={{
                        marginTop: 16,
                        padding: 10,
                        border: "1px solid #d9d9d9",
                        borderRadius: 5,
                        backgroundColor: "#fafafa",
                      }}
                    >
                      <Text strong>API Response:</Text>
                      <pre
                        style={{
                          whiteSpace: "pre-wrap",
                          wordWrap: "break-word",
                          maxHeight: "200px",
                          overflowY: "auto",
                        }}
                      >
                        {JSON.stringify(apiResponse, null, 2)}
                      </pre>
                    </div>
                  )}
                </Card>
              )}
            </div>
          </Layout>
          <FooterComponent />
        </Layout>
      </div>
    </Layout>
  );
};

export default Order;

import React, { useEffect, useState } from "react";
import {
  Form,
  Select,
  Layout,
  Button,
  DatePicker,
  Typography,
  Card,
  message,
} from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { apiUrl } from "../utils/utils";
import Navbar from "../Online Broadband Ordering/Navbar";
import Footer from "../Online Broadband Ordering/Footer";
import Sidebar from "../Customer Portal/Sidebar";
import { useSelector, useDispatch } from "react-redux";
import {
  setCpwnRef,
  setServiceId,
  setPhoneNumber,
} from "../redux/addressSlice";
import { setAppointmentDetails } from "../redux/addressSlice";
import { FaPhone } from "react-icons/fa6";
import Swal from "sweetalert2";

const { Title, Text } = Typography;
const { Option } = Select;

const Get = () => {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [showLandlineField, setShowLandlineField] = useState(false);
  const [selectedProvisioningCommand, setSelectedProvisioningCommand] =
    useState("");
  const phoneNumber = useSelector((state) => state.address.phoneNumber);
  const selectedAddress = useSelector((state) => state.address.selectedAddress);
  const selectedProductDetails = useSelector(
    (state) => state.address.selectedProductDetails
  );

  const uprn = selectedAddress?.site?.uprn;
  const alk = selectedAddress?.site?.address?.alk;
  const districtCode = selectedAddress?.site?.address?.districtCode;
  const supplierName = selectedProductDetails?.supplierName || "";
  const accessType = selectedProductDetails?.accessType || "";
  const productName = selectedProductDetails?.productName || "";
  const productSpeed = selectedProductDetails?.productSpeed || "";

  useEffect(() => {
    form.setFieldsValue({ appointmentDate: null });
  }, [form]);

  const disabledDate = (current) => {
    return current && current.isBefore(moment().startOf("day").add(15, "days"));
  };

  const handleProvisioningCommandChange = (value) => {
    setSelectedProvisioningCommand(value);
    setShowLandlineField(value === "ReplaceToNew" || value === "Takeover");
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    values.appointmentDate = values.appointmentDate?.format("YYYY-MM-DD");
    const provisioningCommand = values.provisioningCommand;
    const supplierType =
      supplierName === "Openreach"
        ? "OR"
        : supplierName === "CityFibre"
        ? "CF"
        : supplierName === "SOGEA"
        ? "SOGEA"
        : supplierName;

    const payload = {
      appointmentDate: values.appointmentDate,
      provisioningCommand: values.provisioningCommand,
      type: supplierType,
      productName,
      productSpeed,
      uprn: uprn?.trim() ? uprn : undefined,
      galk: alk?.trim() ? alk : undefined,
      districtCode: districtCode?.trim() ? districtCode : undefined,
    };

    try {
      const response = await fetch(apiUrl() + "appointment/get-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        dispatch(
          setAppointmentDetails({
            appointments: data.data || [],
            uprn,
            alk,
            districtCode,
            supplierName,
            accessType,
            productName,
            productSpeed,
            provisioningCommand: values.provisioningCommand,
          })
        );
        dispatch(setPhoneNumber(phoneNumber));
        navigate("/reserve-appointment");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
      setLoading(false);
    }
  };

  const cpwnRef = useSelector((state) => state.address.cpwnRef);
  const serviceId = useSelector((state) => state.address.serviceId);

  const handleGetCpwn = async () => {
    if (!phoneNumber || !/^\d+$/.test(phoneNumber)) {
      return message.warning("Please enter a valid landline number.");
    }

    try {
      setLoading(true);
      const cpwnRes = await fetch(
        `${apiUrl()}orderstatus/getCpwn?mobile=${encodeURIComponent(
          phoneNumber
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!cpwnRes.ok) {
        const cpwnError = await cpwnRes.text();
        throw new Error(`CPWN Fetch Failed: ${cpwnError}`);
      }

      const cpwnData = await cpwnRes.json();
      const associatedCPWNRef = cpwnData.data?.serviceCharacteristic?.find(
        (item) => item.name === "AssociatedCPWNRef"
      )?.value?.[0]?.value;

      if (!associatedCPWNRef) {
        throw new Error("AssociatedCPWNRef not found in CPWN response.");
      }

      dispatch(setCpwnRef(associatedCPWNRef));
      message.success("CPWN reference fetched successfully.");
    } catch (error) {
      console.error("Error fetching CPWN:", error);
      message.error("CPWN reference could not be fetched. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGetServiceId = async () => {
    if (!cpwnRef) {
      return message.warning(
        "CPWN reference is missing. Please fetch it first."
      );
    }

    try {
      setLoading(true);
      const serviceIdRes = await fetch(
        `${apiUrl()}orderstatus/getServiceID?cpwnReference=${encodeURIComponent(
          cpwnRef
        )}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // const serviceIdRes = await fetch(
      //   `${apiUrl()}orderstatus/getServiceID?cpwnReference=553533378`,
      //   {
      //     method: "GET",
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );

      if (!serviceIdRes.ok) {
        const sidError = await serviceIdRes.text();
        throw new Error(`Service ID Fetch Failed: ${sidError}`);
      }

      const serviceIdJson = await serviceIdRes.json();
      const serviceData =
        serviceIdJson.data?.products?.[0]?.existingLine?.accessLine?.[0]?.lineCharacteristic?.find(
          (item) => item.name === "existingSupplierServiceId"
        )?.value;
      console.log(serviceData);
      if (!serviceData) {
        throw new Error("Service ID not found in response.");
      }

      dispatch(setServiceId(serviceData));
      message.success("Service ID fetched successfully.");
    } catch (error) {
      console.error("Error fetching Service ID:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Service ID could not be fetched. Please try again.",
        confirmButtonText: "OK",
        position: "center",
      });
    } finally {
      setLoading(false);
    }
  };
  const disableSubmit =
    (selectedProvisioningCommand === "ReplaceToNew" ||
      selectedProvisioningCommand === "Takeover") &&
    (!phoneNumber || !cpwnRef || !serviceId);

  return (
    <Layout className="min-h-screen bg-gray-50">
      <Navbar />
      <Layout hasSider>
        <Sidebar />
        <Layout.Content className="flex items-center justify-center p-4">
          {loading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-[#5664F5] rounded-full animate-spin"></div>
            </div>
          )}
          <Card
            className="w-full max-w-md shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-xl"
            bordered={false}
            style={{
              background: "linear-gradient(135deg, #f6f8f9 0%, #e5ebee 100%)",
              borderRadius: "16px",
            }}
          >
            <div className="space-y-6">
              <div className="text-center">
                <Title
                  level={2}
                  className="text-[#2C3E50] mb-2 font-bold tracking-tight"
                >
                  Book Your Appointment
                </Title>
                <Text type="secondary" className="text-sm text-gray-600">
                  Select your preferred date and provisioning command
                </Text>
              </div>

              {selectedAddress && (
                <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                  <Text strong className="block mb-1 text-blue-800">
                    Selected Address
                  </Text>
                  <Text className="text-blue-600">
                    {selectedAddress.fullAddress}
                  </Text>
                </div>
              )}

              {selectedProductDetails && (
                <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                  <Text strong className="block mb-1 text-green-800">
                    Selected Product Details
                  </Text>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Text className="text-green-700 font-semibold">
                        Product Name:
                      </Text>
                      <Text className="text-green-600">
                        {selectedProductDetails.productName}
                      </Text>
                    </div>
                    <div className="flex justify-between">
                      <Text className="text-green-700 font-semibold">
                        Product Speed:
                      </Text>
                      <Text className="text-green-600">
                        {selectedProductDetails.productSpeed}
                      </Text>
                    </div>
                    <div className="flex justify-between">
                      <Text className="text-green-700 font-semibold">
                        Technology:
                      </Text>
                      <Text className="text-green-600">
                        {selectedProductDetails.technology}
                      </Text>
                    </div>
                    <div className="flex justify-between">
                      <Text className="text-green-700 font-semibold">
                        Access Type:
                      </Text>
                      <Text className="text-green-600">
                        {selectedProductDetails.accessType}
                      </Text>
                    </div>
                  </div>
                </div>
              )}

              <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                className="space-y-4"
              >
                <Form.Item
                  name="appointmentDate"
                  label={
                    <Text strong className="text-[#34495E]">
                      Appointment Date
                    </Text>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please select an Appointment Date!",
                    },
                  ]}
                >
                  <DatePicker
                    className="w-full rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    style={{ height: "42px" }}
                    disabledDate={disabledDate}
                    placeholder="Select Date"
                  />
                </Form.Item>
                <Form.Item
                  name="provisioningCommand"
                  label={
                    <Text strong className="text-[#34495E]">
                      Provisioning Command
                    </Text>
                  }
                  rules={[
                    {
                      required: true,
                      message: "Please select a provisioning command!",
                    },
                  ]}
                >
                  <Select
                    placeholder="Select Provisioning Command"
                    className="w-full rounded-lg shadow-sm hover:shadow-md transition-shadow"
                    style={{ height: "42px" }}
                    onChange={handleProvisioningCommandChange}
                  >
                    {selectedProductDetails?.provisioningTypes
                      ?.filter((type) => {
                        const available = ["Y", "P"].includes(
                          type.provisioningDetails?.find(
                            (d) => d.name === "available"
                          )?.value
                        );
                        return available;
                      })
                      .map((type) => (
                        <Option
                          key={type.provisioningCommand}
                          value={type.provisioningCommand}
                        >
                          {type.provisioningCommand}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>

                {showLandlineField && (
                  <>
                    {/* Landline Number and Get CPWN */}
                    <Form.Item label="Landline Number">
                      <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) =>
                          dispatch(setPhoneNumber(e.target.value))
                        }
                        className="w-full px-3 py-2 border rounded-md"
                      />
                    </Form.Item>

                    <Form.Item label="CPWN Reference">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={cpwnRef}
                          onChange={(e) => dispatch(setCpwnRef(e.target.value))}
                          className="flex-1 px-3 py-2 border rounded-md"
                        />
                        {!serviceId && (
                          <Button
                            className="bg-[#28A745] hover:bg-[#5664F5] text-white text-sm px-12 py-5 rounded-lg"
                            onClick={handleGetServiceId}
                          >
                            Get Service ID
                          </Button>
                        )}
                      </div>
                    </Form.Item>

                    {serviceId && (
                      <Form.Item label="Service ID">
                        <input
                          value={serviceId}
                          readOnly
                          className="w-full px-3 py-2 border rounded-md bg-gray-100"
                        />
                      </Form.Item>
                    )}
                  </>
                )}

                <div className="text-right">
                  <Button
                    htmlType="submit"
                    className="
                      bg-[#3498DB] 
                      hover:bg-[#2980B9] 
                      text-white 
                      text-sm 
                      px-8 
                      py-2 
                      rounded-full 
                      transition-colors 
                      duration-300 
                      shadow-md 
                      hover:shadow-lg
                    "
                    disabled={loading || disableSubmit}
                  >
                    {loading ? "Submitting..." : "Submit"}
                  </Button>
                </div>
              </Form>
            </div>
          </Card>
        </Layout.Content>
      </Layout>
      <Footer />
    </Layout>
  );
};

export default Get;

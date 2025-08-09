import React, { useEffect, useState } from "react";
import { Alert, Input, DatePicker, Button, Form, message } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { apiUrl } from "../utils/utils";
import Swal from "sweetalert2";

const EditContactForm = ({ orderId }) => {
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState("");
  const [formOrder] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  const extractField = (list, name) =>
    list.find((item) => item.name === name)?.value || "";

  useEffect(() => {
    if (!orderId) return;
    const fetchOrder = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(
          `${apiUrl()}orderstatus/status-checker/${orderId}`
        );
        setOrderData(response.data);

        const data = response.data.data;
        const characteristics = data.productOrderItem?.[0]?.product?.productCharacteristic || [];
        if (data) {
          formOrder.setFieldsValue({
            requestedCompletionDate: data.requestedCompletionDate
              ? dayjs(data.requestedCompletionDate)
              : null,
            customerPrimaryName: extractField(characteristics, "installationContactNamePrimary"),
            customerEmail: extractField(characteristics,"installationContactEmail"),
            customerPrimaryNumber: extractField(characteristics ,"installationContactNumberPrimary") ,
            customerSecondaryNumber: extractField(characteristics , "installationContactNumberSecondary"),
          });
        }
      } catch (err) {
        setError(`Failed to fetch order details: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, formOrder]);

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-[#5664F5] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) return <Alert message={error} type="error" showIcon />;
  if (!orderData?.data) return null;

  const { data } = orderData;
  const productId = data.productOrderItem?.[0]?.product?.id || "N/A";

  const onFinishOrder = async (values) => {
    setLoading(true);
    setSubmitting(true);
    try {
      const formattedDate = values.requestedCompletionDate?.toISOString();
      const response = await axios.patch(
        `${apiUrl()}orderstatus/editOrder/${orderId}`,
        {
          id: orderId,
          productId,
          requestedCompletionDate: formattedDate,
          customerPrimaryName: values.customerPrimaryName,
          customerEmail: values.customerEmail,
          customerPrimaryNumber: values.customerPrimaryNumber,
          customerSecondaryNumber: values.customerSecondaryNumber,
        }
      );
      const successMessage =
        response?.data?.details?.message || "Order updated successfully";

      Swal.fire({
        icon: "success",
        title: "Success",
        text: successMessage,
      });
    } catch {
      const failureMessage =
        error?.response?.data?.details?.message || "Failed to update order";

      Swal.fire({
        icon: "error",
        title: "Error",
        text: failureMessage,
      });
    } finally {
      setSubmitting(false);
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-[#5664F5] rounded-full animate-spin"></div>
        </div>
      )}
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-blue-600">
          Edit Contact Details
        </h2>
        <p className="text-gray-500 text-sm">
          Modify customer contact details before updating the order.
        </p>
      </div>

      <h2 className="text-xl font-bold mb-2">{`Product ID #${productId}`}</h2>
      <br />

      <Form form={formOrder} layout="vertical" onFinish={onFinishOrder}>
        <Form.Item
          name="requestedCompletionDate"
          label={
            <div className="flex justify-between">
              <span>Requested Completion Date</span>
              {data.expectedCompletionDate && (
                <span className="text-sm text-gray-500">
                  {dayjs(data.expectedCompletionDate).format("DD-MM-YYYY")}
                </span>
              )}
            </div>
          }
          rules={[{ required: true, message: "Please select the date" }]}
        >
          <DatePicker
            className="w-full"
            disabledDate={(current) =>
              current && current < dayjs().endOf("day")
            }
          />
        </Form.Item>

        <Form.Item
          name="customerPrimaryName"
          label="Customer Primary Name"
          rules={[{ required: true, message: "Please enter primary name" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="customerEmail"
          label="Customer Email"
          rules={[{ required: true, message: "Please enter Email" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="customerPrimaryNumber"
          label="Customer Primary Number"
          rules={[{ required: true, message: "Please enter primary number" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="customerSecondaryNumber"
          label="Customer Secondary Number"
          rules={[{ required: true, message: "Please enter Secondary number" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Update Changes
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

export default EditContactForm;

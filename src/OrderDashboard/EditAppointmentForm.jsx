import React, { useEffect, useState } from "react";
import { Alert, Input, DatePicker, Button, Form, Select } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import { apiUrl } from "../utils/utils";
import Swal from "sweetalert2";

const EditAppointmentForm = ({ orderId }) => {
  const [formAppointment] = Form.useForm();
  const [formAppointment2] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [appointDetails, setAppointDetails] = useState([]);
  const [step, setStep] = useState(1);
  const [appointmentEditable, setAppointmentEditable] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${apiUrl()}orderstatus/status-checker/${orderId}`
        );
        setOrderData(response.data);

        const data = response.data.data;
        const appointment = data?.productOrderItem?.[0]?.appointment;
        const installationType =
          data?.productOrderItem?.[0]?.product?.productCharacteristic?.find(
            (item) => item.name === "installationType"
          )?.value;
            const provisioningCommand =
          data?.productOrderItem?.[0]?.product?.productCharacteristic?.find(
            (item) => item.name === "provisioningCommand"
          )?.value;
        formAppointment.setFieldsValue({
          requestedCompletionDate: data.requestedCompletionDate
            ? dayjs(data.requestedCompletionDate)
            : null,
          appointmentId: appointment?.id || "",
          appointmentDate: appointment?.date ? dayjs(appointment.date) : null,
          installationType: installationType,
        });
      } catch (err) {
        setError(`Failed to fetch appointment details: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, formAppointment]);

  useEffect(() => {
    setStep(1);
    setAppointDetails([]);
    setAvailableSlots([]);
    setSelectedSlot(null);
    formAppointment.resetFields();
    formAppointment2.resetFields();
  }, [orderId]);

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
  const appointment = data.productOrderItem?.[0]?.appointment;
  const hello =
    data?.productOrderItem?.[0]?.product?.productCharacteristic || [];

  const provisioningCommand = hello.find(
    (item) => item.name === "provisioningCommand"
  )?.value;

  const productSpeed = hello.find(
    (item) => item.name === "productSpeed"
  )?.value;

  const supplierName = hello.find(
    (item) => item.name === "supplierName"
  )?.value;

  const productName = data?.productOrderItem?.[0]?.product?.name;
  const placeInfo = data?.productOrderItem?.[0]?.product?.place?.[0] || {};
  const districtCode = placeInfo.districtCode;
  const alk = placeInfo.galk;
  const uprn = placeInfo.uprn;

  if (provisioningCommand === "Switch") {
  return (
    <Alert
      message="Appointment can't be edited"
      description="For this command line, appointment can't be edited."
      type="warning"
      showIcon
    />
  );
}
  const type =
    supplierName === "Openreach"
      ? "OR"
      : supplierName === "CityFibre"
      ? "CF"
      : supplierName === "SOGEA"
      ? "SOGEA"
      : supplierName;

  const onFinishAppointment = async () => {
    setLoading(true);
    setSubmitting(true);
    try {
      const payload = {
        order_id: orderId,
        requestedCompletionDate: appointDetails?.payload?.appointmentDate
          ? dayjs.utc(appointDetails.payload.appointmentDate).toISOString()
          : undefined,
        appointmentId: appointDetails?.data?.supplierAppointmentId,
        productId,
        appointmentDate: appointDetails?.payload?.appointmentDate
          ? dayjs.utc(appointDetails.payload.appointmentDate).toISOString()
          : undefined,
      };

      const response = await axios.patch(
        `${apiUrl()}orderstatus/editAppointment/${orderId}`,
        payload
      );
      const successMessage =
        response?.data?.details?.message || "Appointment updated successfully";
      Swal.fire({
        icon: "success",
        title: "Success",
        text: successMessage,
      });
    } catch (error) {
      const failureMessage =
        error?.response?.data?.details?.message ||
        "Failed to update appointment";

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

  const reserveAppointment = async () => {
    if (selectedSlot === null) return;

    const test = productName.split("-");
    let reserveType = "";
    if (test[1] === "OR") {
      reserveType = test[2] === "FTTP" ? "OR" : "SOGEA";
    } else if (test[1] === "CFH") {
      reserveType = "CF";
    }

    const selected = availableSlots[selectedSlot];
    const payload = {
      appointmentDate: selected.appointmentDate,
      appointmentStartTime: selected.appointmentStartTime,
      appointmentEndTime: selected.appointmentEndTime,
      appointmentTimeSlot: selected.appointmentTimeslot,
      provisioningCommand: provisioningCommand,
      type: reserveType,
      productName: productName,
      productSpeed: productSpeed,
      districtCode: districtCode,
      galk: alk,
    };

    try {
      setLoading(true);
      const response = await fetch(
        apiUrl() + "appointment/reserve-appointment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (response.ok) {
        const result = await response.json();
        setAppointDetails(result);
        setStep(3); // Move to Section 3
      }
      Swal.fire({
        icon: "success",
        title: "Slot Reserved",
        text: "Your appointment has been successfully reserved.",
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Reservation Failed",
        text: error?.response?.data?.message || "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getAppointment = async (values) => {
    const appointmentDate = dayjs(values.appointmentDate)
      .startOf("day")
      .format("YYYY-MM-DD");
    const payload = {
      appointmentDate: appointmentDate,
      provisioningCommand: provisioningCommand,
      type: type,
      productName: productName,
      productSpeed: productSpeed,
      ...(uprn?.trim() && { uprn }),
      ...(alk?.trim() && { galk: alk }),
      ...(districtCode?.trim() && { districtCode }),
    };
    try {
      setLoading(true);
      const response = await fetch(apiUrl() + "appointment/get-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const result = await response.json();
        setAvailableSlots(result.data);
        setStep(2); // Move to Section 2
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    } finally {
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
        <h2 className="text-lg font-semibold text-green-600">
          Edit Appointment Details
        </h2>
        <p className="text-gray-500 text-sm">
          Update the appointment details scheduled for this order.
        </p>
      </div>

      <h2 className="text-xl font-bold mb-2">{`Product ID #${productId}`}</h2>

      {step === 1 && (
        <>
        <Form
          form={formAppointment}
          layout="vertical"
          onFinish={getAppointment}
        >
          <Form.Item
            name="appointmentDate"
            label="New Appointment Date"
            rules={[{ required: true, message: "Please select a date" }]}
          >
            <DatePicker
              className="w-full"
              disabledDate={(current) =>
                current && current < dayjs().endOf("day")
              }
            />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={submitting}>
            Get Appointment
          </Button>
        </Form>
        </>
      )}

      {step === 2 && availableSlots.length > 0 && (
        <Form
          form={formAppointment2}
          layout="vertical"
          onFinish={reserveAppointment}
        >
          <Form.Item
            name="appointmentSlot"
            label="Select Available Slot"
            rules={[{ required: true, message: "Please select a slot" }]}
          >
            <Select
              showSearch
              placeholder="Select a time slot"
              onChange={(value) => setSelectedSlot(value)}
              filterOption={(input, option) =>
                option?.label?.toLowerCase().includes(input.toLowerCase())
              }
              options={availableSlots.map((slot, index) => ({
                label: `${dayjs(slot.appointmentDate).format(
                  "dddd, MMMM D, YYYY"
                )} | ${slot.appointmentStartTime} - ${
                  slot.appointmentEndTime
                } (${slot.appointmentTimeslot})`,
                value: index,
              }))}
            />
          </Form.Item>
          <Button type="primary" htmlType="submit">
            Reserve Appointment
          </Button>
        </Form>
      )}

      {step === 3 && (
        <Form layout="vertical">
          <Form.Item label="Appointment ID">
            <Input
              value={appointDetails?.data?.supplierAppointmentId}
              disabled
            />
          </Form.Item>
          <Button type="primary" onClick={onFinishAppointment}>
            Update Appointment
          </Button>
        </Form>
      )}
    </>
  );
};

export default EditAppointmentForm;

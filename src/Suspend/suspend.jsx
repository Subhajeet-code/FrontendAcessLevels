import React, { useState } from "react";
import { Tabs, Layout, Input, Button, Card } from "antd";
import Swal from "sweetalert2";
import axios from "axios";
import Navbar from "../Online Broadband Ordering/Navbar";
import Footer from "../Online Broadband Ordering/Footer";
import Sidebar from "../Customer Portal/Sidebar";
import { apiUrl } from "../utils/utils";

const { TabPane } = Tabs;

const SuspendUnsuspend = () => {
  const [orderId, setOrderId] = useState({ suspend: "", unsuspend: "" });
  const [details, setDetails] = useState({
    suspend: { productId: "", partnerRef: "" },
    unsuspend: { productId: "", partnerRef: "" },
  });
  const [loading, setLoading] = useState(false);

  const fetchOrderDetails = async (type) => {
    const id = orderId[type];
    if (!id) {
      Swal.fire("Error", "Order ID is required", "error");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `${apiUrl()}orderstatus/status-checker/${id}`
      );
      const item = res.data?.data?.productOrderItem?.[0];
      const product = item?.product;
      const partnerRef = product?.productCharacteristic?.find(
        (c) => c.name === "partnerOrderReference"
      )?.value;

      setDetails((prev) => ({
        ...prev,
        [type]: {
          productId: product?.id || "",
          partnerRef: partnerRef || "",
        },
      }));
    } catch (err) {
      Swal.fire("Error", "Failed to fetch order details", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSuspend = async () => {
    setLoading(true);
    const { productId, partnerRef } = details.suspend;
    if (!productId || !partnerRef) {
      Swal.fire("Error", "Fetch order details first", "error");
      return;
    }

    const payload = {
      productId: productId,
      customerAKJ: partnerRef,
    };

    try {
      const res = await axios.post(
        `${apiUrl()}order/product-suspend-full`,
        payload
      );
      const status = res?.data?.status;
      const message = res?.data?.message || "Suspend completed";
      const note = res?.data?.note?.[0]?.text || "";

      Swal.fire({
        icon: status ? "success" : "error",
        title: message,
        footer: note,
      });
    } catch (err) {
      const errorMsg =
        err?.response?.data?.errorDetails?.message || "Suspend API failed";
      Swal.fire("Error", errorMsg, "error");
    }finally {
      setLoading(false);
    }
  };

  const handleUnsuspend = async () => {
    setLoading(true);
    const { productId } = details.unsuspend;
    if (!productId) {
      Swal.fire("Error", "Fetch order details first", "error");
      return;
    }

    const payload = { productId };

    try {
      const res = await axios.post(
        `${apiUrl()}order/product-unsuspend`,
        payload
      );
      const status = res?.data?.status;
      const message = res?.data?.message || "Unsuspend completed";
      const note = res?.data?.note?.[0]?.text || "";

      Swal.fire({
        icon: status ? "success" : "error",
        title: message,
        footer: note,
      });
    } catch (err) {
      const errorMsg =
        err?.response?.data?.errorDetails?.message || "Unsuspend API failed";
      Swal.fire("Error", errorMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  const renderTab = (type, label, handleSubmit) => (
    <Card title={label} bordered={false}>
      <Input
        placeholder="Enter Order ID"
        value={orderId[type]}
        onChange={(e) =>
          setOrderId((prev) => ({ ...prev, [type]: e.target.value }))
        }
        className="mb-3"
      />

      {!details[type].productId && (
        <Button
          type="primary"
          loading={loading[type]}
          onClick={() => fetchOrderDetails(type)}
          className="mb-4 w-full"
        >
          Fetch Product ID
        </Button>
      )}

      {details[type].productId && (
        <>
          <p>
            <strong>Product ID:</strong> {details[type].productId}
          </p>
          <p>
            <strong>Partner Order Reference:</strong> {details[type].partnerRef}
          </p>
          <Button type="primary" className="mt-3 w-full" onClick={handleSubmit}>
            Submit {label}
          </Button>
        </>
      )}
    </Card>
  );

  return (
    <Layout className="min-h-screen">
      <Navbar />
      <Layout hasSider>
        <Sidebar />
         {loading && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-[#5664F5] rounded-full animate-spin"></div>
            </div>
          )}
        <div className="p-6 w-full max-w-5xl mx-auto">
          <Tabs
            defaultActiveKey="1"
            type="card"
            className="bg-white p-4 rounded-lg shadow"
          >
            <TabPane tab="Suspend Order" key="1">
              {renderTab("suspend", "Suspend Order", handleSuspend)}
            </TabPane>
            <TabPane tab="Unsuspend Order" key="2">
              {renderTab("unsuspend", "Unsuspend Order", handleUnsuspend)}
            </TabPane>
          </Tabs>
        </div>
      </Layout>
      <Footer />
    </Layout>
  );
};

export default SuspendUnsuspend;

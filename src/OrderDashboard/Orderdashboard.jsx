import React, { useState, useEffect, useCallback } from "react";
import {
  Layout,
  Table,
  Divider,
  Button,
  Alert,
  Typography,
  Checkbox,
  message,
} from "antd";
import { debounce } from "lodash";
import Navbar from "../Customer Portal/Navbar";
import Footer from "../Customer Portal/Footer";
import { apiUrl } from "../utils/utils";
import OrderDetails from "./Orderdetails";
import EditOrder from "./EditOrder";
import { Modal } from "antd";
import { FaTrashAlt, FaEdit } from "react-icons/fa";

const { Content, Sider } = Layout;
const { Title, Text } = Typography;

const Orderdashboard = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("inflight");

  const [selecetedOrderId, setSelectedOrderId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const handleViewDetails = (orderId) => {
    setSelectedOrderId(orderId);
    setModalVisible(true);
  };

  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editOrderData, setEditOrderData] = useState(null);
  const handleEditOrder = (record) => {
    setEditOrderData(record);
    setEditModalVisible(true);
  };

  const [searchText, setSearchText] = useState("");
  const [selectedProviders, setSelectedProviders] = useState([]);
  const [selectedStatuses, setSelectedStatuses] = useState([]);

  const applyFilters = useCallback(
    debounce(() => {
      setIsLoading(false);
    }, 2000),
    []
  );
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
      return;
    }
    setIsLoading(true);
    setCurrentPage(1);
    applyFilters();
  }, [selectedProviders, selectedStatuses, applyFilters]);
  useEffect(() => {
    filterOrders();
  }, [
    orders,
    selectedProviders,
    selectedStatuses,
    searchText,
    selectedCategory,
  ]);

  const [providers, setProviders] = useState([]);
  const [statuses, setStatuses] = useState([]);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(apiUrl() + "user/orderDashboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();

      if (result.success) {
        setOrders(result.data);
        setFilteredOrders(result.data);

        const uniquep = [
          ...new Set(result.data.map((order) => order.provider)),
        ];
        const uniques = [...new Set(result.data.map((order) => order.status))];
        setProviders(uniquep);
        setStatuses(uniques);
      } else {
        console.error("Failed to fetch orders:", result.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const Sync = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(apiUrl() + "user/updateOrderStatus", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success) {
        console.log("Status sync success:", result.message);
        fetchOrders();
      } else {
        console.error("Status sync failed:", result.message);
      }
    } catch (err) {
      console.error("Error syncing order statuses:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  const filterOrders = () => {
    let filtered = [...orders];

    if (selectedProviders.length > 0) {
      filtered = filtered.filter((order) =>
        selectedProviders.includes(order.provider)
      );
    }

    if (selectedStatuses.length > 0) {
      filtered = filtered.filter((order) =>
        selectedStatuses.includes(order.status)
      );
    }

    if (searchText.trim() !== "") {
      const lowerSearch = searchText.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.order_id.toLowerCase().includes(lowerSearch) ||
          order.customer_name.toLowerCase().includes(lowerSearch)
      );
    }

    let categoryStatuses = [];
    if (selectedCategory === "inflight") {
      categoryStatuses = [
        "acknowledged",
        "inprogress",
        "AssessingAmendment",
        "PendingCancellation",
      ];
    } else if (selectedCategory === "issue") {
      categoryStatuses = ["pending", "rejected", "failed", "held"];
    } else if (selectedCategory === "completed") {
      categoryStatuses = ["cancelled", "completed"];
    } else if (selectedCategory === "all") {
      categoryStatuses = Object.values(categoryStatusMap).flat();
    }
    filtered = filtered.filter((order) =>
      categoryStatuses.includes(order.status?.toLowerCase().trim())
    );

    setFilteredOrders(filtered);
  };
  useEffect(() => {
    const tableContainer = document.querySelector(".ant-table-content");
    if (tableContainer) {
      tableContainer.scrollLeft = 0; // Reset scroll to left
    }
  }, [filteredOrders]);

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-US", options);
  };

  const formatDateForCSV = (dateString) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleExportToCSV = () => {
    if (filteredOrders.length === 0) {
      alert("No orders to export.");
      return;
    }

    // Define CSV headers
    const headers = [
      "Order ID",
      "Customer Name",
      "CASR",
      "Supplier ServiceId",
      "Productr",
      "Product Type",
      "Partner Order Reference",
      "Broadband User Name",
      "Provider",
      "Status",
      "Order Date",
      "Expected Completion",
    ];

    // Convert each order into a CSV row
    const rows = filteredOrders.map((order) => [
      order.order_id,
      order.customer_name,
      order.access_casr,
      order.supplier_service_id,
      order.productr,
      order.product_type,
      order.partner_order_reference,
      order.broadband_username,
      order.provider,
      order.status,
      // formatDate(order.order_date),
      // formatDate(order.expected_completion_date),
      formatDateForCSV(order.order_date),
      formatDateForCSV(order.expected_completion_date),
    ]);

    // Combine headers and rows
    const csvContent = [headers, ...rows]
      .map((row) =>
        row
          .map((value) =>
            typeof value === "string" && value.includes(",")
              ? `"${value}"`
              : value
          )
          .join(",")
      )
      .join("\n");

    // Create a Blob and trigger download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteOrder = async (orderId) => {
    setIsLoading(true);
    const delay = new Promise((resolve) => setTimeout(resolve, 2000));
    try {
      const responsePromise = await fetch(apiUrl() + "user/deleteOrder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId }),
      });
      const [response] = await Promise.all([responsePromise, delay]);
      const result = await response.json();
      if (result.success) {
        fetchOrders();
      } else {
        console.error("Failed to delete order:" + result.message);
      }
    } catch (error) {
      console.error("Error deleting order:", error);
    } finally {
      setIsLoading(false);
    }
  };
  const categoryStatusMap = {
    inflight: [
      "acknowledged",
      "inprogress",
      "assessingamendment",
      "pendingcancellation",
    ],
    issue: ["pending", "rejected", "failed", "held"],
    completed: ["cancelled", "completed"],
  };

  return (
    <Layout className="min-h-screen">
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <Layout>
          <Layout hasSider>
            {/* Sidebar Section */}
            <Sider
              width={260}
              className="bg-white p-6 ml-8 shadow-md mt-6 rounded-lg"
            >
              <h2 className="text-3xl font-bold font-lexend-deca mb-4">
                Filters
              </h2>

              <div className="mt-6 space-y-6">
                {/* Provider */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Provider</h3>
                  <Checkbox.Group
                    className="flex flex-col space-y-2 custom-checkbox"
                    value={selectedProviders}
                    onChange={(checkedValues) =>
                      setSelectedProviders(checkedValues)
                    }
                  >
                    {providers.map((provider) => (
                      <Checkbox key={provider} value={provider}>
                        {provider}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                </div>

                {/* Status */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Status</h3>
                  <Checkbox.Group
                    className="flex flex-col space-y-2 custom-checkbox"
                    value={selectedStatuses}
                    onChange={(checkedValues) =>
                      setSelectedStatuses(checkedValues)
                    }
                  >
                    {statuses
                      .filter((status) =>
                        selectedCategory === "all"
                          ? true
                          : categoryStatusMap[selectedCategory].includes(
                              status.toLowerCase()
                            )
                      )
                      .map((status) => (
                        <Checkbox key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </Checkbox>
                      ))}
                  </Checkbox.Group>
                </div>
              </div>
            </Sider>

            <Content className="p-6">
              <div className="bg-white shadow-md rounded-lg p-4">
                <div className="flex items-center justify-between mt-4 mb-4">
                  <h1 className="text-3xl font-bold font-lexend-deca">
                    Order Dashboard
                  </h1>
                  <div className="flex gap-4">
                    <button
                      className="w-auto btn text-[16px] py-4 px-8 rounded-md bg-[#007bff] hover:bg-blue-700 text-white transition"
                      onClick={Sync}
                    >
                      Sync
                    </button>
                    <button
                      className="w-auto btn text-[16px] py-4 px-8 rounded-md hover:bg-green-600 text-white transition"
                      onClick={handleExportToCSV}
                    >
                      Export To CSV
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Search by Order ID or Customer name"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-64"
                  />
                </div>

                {isLoading ? (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="w-16 h-16 border-4 border-gray-200 border-t-[#5664F5] rounded-full animate-spin"></div>
                  </div>
                ) : filteredOrders.length > 0 ? (
                  <>
                    <Divider />
                    <div className="flex gap-6 mb-4">
                      {["inflight", "issue", "completed", "all"].map(
                        (category) => (
                          <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`py-2 px-4 rounded-lg text-white font-semibold transition ${
                              selectedCategory === category
                                ? "bg-[#007bff]"
                                : "bg-gray-400 hover:bg-gray-500"
                            }`}
                          >
                            {category === "all"
                              ? "All Orders"
                              : category === "inflight"
                              ? "Inflight Orders"
                              : category === "issue"
                              ? "Order Issue"
                              : "Completed"}
                          </button>
                        )
                      )}
                    </div>
                    {/* <div className="overflow-x-auto overflow-y-auto max-h-[80vh]"> */}
                    <Table
                      columns={[
                        {
                          title: "Order ID",
                          dataIndex: "order_id",
                          render: (text) => (
                            <a onClick={() => handleViewDetails(text)}>
                              {text}
                            </a>
                          ),
                        },
                        {
                          title: "Customer Name",
                          dataIndex: "customer_name",
                        },
                        { title: "CASR", dataIndex: "access_casr" },
                        {
                          title: "Supplier ServiceId",
                          dataIndex: "supplier_service_id",
                        },
                        { title: "Productr", dataIndex: "productr" },
                        { title: "Product Type", dataIndex: "product_type" },
                        {
                          title: "Partner Order Reference",
                          dataIndex: "partner_order_reference",
                        },
                        {
                          title: "Broadband User Name",
                          dataIndex: "broadband_username",
                        },
                        { title: "Provider", dataIndex: "provider" },
                        {
                          title: "Order Type",
                          dataIndex: "provisioning_command",
                        },
                        {
                          title: "Status",
                          dataIndex: "status",
                          render: (status) => (
                            <span
                              className={`px-3 py-1 rounded-full text-white text-sm font-medium ${
                                status === "active"
                                  ? "bg-emerald-500"
                                  : status === "pending"
                                  ? "bg-amber-400"
                                  : status === "acknowledged"
                                  ? "bg-sky-500"
                                  : status === "InProgress"
                                  ? "bg-orange-400"
                                  : status === "cancelled"
                                  ? "bg-rose-500"
                                  : status === "failed"
                                  ? "bg-red-500"
                                  : status === "rejected"
                                  ? "bg-fuchsia-600"
                                  : status === "held"
                                  ? "bg-indigo-500"
                                  : status === "inactive"
                                  ? "bg-slate-500"
                                  : status === "completed"
                                  ? "bg-green-500"
                                  : "bg-gray-400"
                              }`}
                            >
                              {status.charAt(0).toUpperCase() + status.slice(1)}
                            </span>
                          ),
                        },
                        {
                          title: "Order Date",
                          dataIndex: "order_date",
                          render: (date) => formatDate(date),
                        },
                        {
                          title: "Expected Completion",
                          dataIndex: "expected_completion_date",
                          render: (date) => formatDate(date),
                        },
                        {
                          title: "Actions",
                          render: (text, record) => (
                            <div className="flex justify-center">
                              <button
                                onClick={() => handleEditOrder(record)}
                                className="p-2 rounded-full hover:bg-blue-100 transition-all duration-200"
                                aria-label="Edit order"
                                title="Edit order"
                              >
                                <FaEdit
                                  className="text-blue-500 hover:text-blue-700"
                                  size={18}
                                />
                              </button>
                              <button
                                onClick={() =>
                                  handleDeleteOrder(record.order_id)
                                }
                                className="p-2 rounded-full hover:bg-red-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                                aria-label="Delete order"
                                title="Delete order"
                              >
                                <FaTrashAlt
                                  className="text-red-500 hover:text-red-700"
                                  size={18}
                                />
                              </button>
                            </div>
                          ),
                        },
                      ]}
                      dataSource={filteredOrders}
                      rowKey="order_id"
                      bordered
                      pagination={{
                        pageSize: 500,
                        current: currentPage,
                        onChange: (page) => setCurrentPage(page),
                        showSizeChanger: false,
                      }}
                      className="w-full border border-gray-300 rounded-lg overflow-x-auto"
                      rowClassName={(record, index) =>
                        selectedOrder &&
                        selectedOrder.order_id === record.order_id
                          ? "bg-green-300"
                          : index % 2 === 0
                          ? "bg-gray-100"
                          : "bg-white"
                      }
                    />
                    {/* </div> */}
                  </>
                ) : (
                  <Alert
                    message="No orders found"
                    type="warning"
                    showIcon
                    style={{ marginTop: 20 }}
                  />
                )}
              </div>

              {selectedOrder && (
                <div className="bg-white shadow-md rounded-lg p-3 mt-6">
                  <div>
                    <h3 className="font-bold font-lexend-deca text-lg">
                      Selected Order Details
                    </h3>
                    <div className="grid grid-cols-2">
                      <div>
                        <p className="font-lexend-deca font-medium">
                          <div className="mb-2 font-[16px]">
                            Order ID: {selectedOrder.order_id}
                          </div>
                          <div className="mb-2 font-[16px]">
                            Customer: {selectedOrder.customer_name}
                          </div>
                          <div className="mb-2 font-[16px]">
                            Product Type: {selectedOrder.product_type}
                          </div>
                        </p>
                      </div>
                      <div className="font-lexend-deca font-medium">
                        <div className="mb-2 font-[16px]">
                          Provider: {selectedOrder.provider}
                        </div>
                        <div className="mb-2 font-[16px]">
                          Order Type: {selectedOrder.provisioning_command}
                        </div>
                        <div className="mb-2 font-[16px]">
                          Status:{" "}
                          {selectedOrder.status.charAt(0).toUpperCase() +
                            selectedOrder.status.slice(1)}
                        </div>
                        <div className="mb-2 font-[16px]">
                          Expected Completion:{" "}
                          {formatDate(selectedOrder.expected_completion_date)}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-x-8 mt-4">
                    <button className="btn py-4 text-[16px] px-8 rounded-lg hover:bg-[#28A745] text-white transition">
                      View Details
                    </button>
                    <button className="py-4 px-8 text-[16px] rounded-lg bg-[#28A745] text-white hover:bg-[#5664F5] transition">
                      Update Status
                    </button>
                  </div>
                </div>
              )}
            </Content>
          </Layout>
        </Layout>
        <Modal
          title={`Order Details - ${selecetedOrderId}`}
          open={modalVisible}
          onCancel={() => setModalVisible(false)}
          footer={null}
          width={800}
        >
          <OrderDetails orderId={selecetedOrderId} />
        </Modal>
        <Modal
          title={`Edit Order - ${editOrderData?.order_id}`}
          open={editModalVisible}
          onCancel={() => setEditModalVisible(false)}
          footer={null}
          width={800}
        >
          {editOrderData && <EditOrder orderId={editOrderData.order_id} />}
        </Modal>
        <Footer />
      </div>
    </Layout>
  );
};

export default Orderdashboard;

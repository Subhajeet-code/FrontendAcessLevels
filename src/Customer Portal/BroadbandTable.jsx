

import React from "react";
import { Table } from "antd";

const BroadbandTable = () => {
  const columns = [
    { title: "Product Page", dataIndex: "product", key: "product" },
    { title: "Service", dataIndex: "service", key: "service" },
    { title: "Technology", dataIndex: "technology", key: "technology" },
    { title: "Access Type", dataIndex: "access", key: "access" },
    { title: "Availability", dataIndex: "availability", key: "availability" },
    { title: "Speed Option", dataIndex: "speed", key: "speed" },
    { title: "Pricing", dataIndex: "pricing", key: "pricing" },
    {
      title: "Select",
      dataIndex: "select",
      key: "select",
      render: () => (
        <button className="bg-green-600 py-2 px-4 rounded-md hover:bg-blue-600 text-white transition-all">
          Check
        </button>
      ),
    },
  ];

  const data = [
    { key: "1", product: "Hybrid S", service: "Ultrafast Fiber", technology: "FTTP", access: "Full Fibre", availability: "Available", speed: "1000Mbps", pricing: "€ 29.99 /month" },
    { key: "2", product: "Cards", service: "Superfast Fiber", technology: "FTTP", access: "Copper / Fibre", availability: "Limited", speed: "70Mbps", pricing: "€ 29.99 /month" },
    { key: "3", product: "Tabular", service: "Basic Broadband", technology: "ADSL", access: "Copper", availability: "Available", speed: "10Mbps", pricing: "€ 29.99 /month" },
    { key: "4", product: "Tabular", service: "Basic Broadband", technology: "FTTP", access: "Copper", availability: "Available", speed: "20Mbps", pricing: "€ 29.99 /month" },
  ];

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 w-full mx-auto mt-6">
  <div className="flex items-center space-x-4 mb-6">
    <img src="/assets/pop-logo.png" alt="Logo" className="w-14 h-14" />
    <h1 className="text-3xl font-bold font-sans">Pop Telecom</h1>
  </div>
  <div className="overflow-x-auto">
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
      className="text-[16px]  rounded-lg w-full"
    />
  </div>
</div>

  );
};

export default BroadbandTable;
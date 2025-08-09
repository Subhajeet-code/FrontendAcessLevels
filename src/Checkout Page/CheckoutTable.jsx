

import React from "react";
import { Table } from "antd";


const CheckoutTable = () => {

  const columns = [
    { title: "Supplier", dataIndex: "supplier", key: "supplier" },
    { title: "Product Name", dataIndex: "productName", key: "productName" },
    { title: "Technology", dataIndex: "technology", key: "technology" },
    { title: "Access Type", dataIndex: "accessType", key: "accessType" },
    { title: "Availability", dataIndex: "availability", key: "availability" },
    { title: "Speed Optioning", dataIndex: "speedOptioning", key: "speedOptioning" },
    { title: "Pricing", dataIndex: "pricing", key: "pricing" },
    {
      dataIndex: "select",
      key: "select",
      render: () => (
        <button className="bg-[#5B66F3] py-2 px-4 w-full rounded-md hover:bg-green-600 text-white transition">
          Select
        </button>
        
      ),
    },
  ];

  const data = [
    { key: "1", supplier: "City Fibre", productName: "SuperFast Fibre", technology: "FTTP", accessType: "FTTP",  availability: "Yes", speedOptioning: "100 mbps", pricing: "€ 29.99 /month" },
    { key: "2", supplier: "Open Reach", productName: "UltraFast Fibre", technology: "GPON", accessType: "FTTC",  availability: "Yes", speedOptioning: "50 mbps", pricing: "€ 29.99 /month" },
    { key: "3", supplier: "SoGEA", productName: "Basic Copper", technology: "Copper", accessType: "FTTC",   availability: "Yes", speedOptioning: "10 mbps", pricing: "€ 29.99 /month" },
  ];

  return (
    <div className="bg-white shadow-md rounded-lg p-4">

      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        className="w-full rounded-lg overflow-x-auto"
        rowClassName={(record, index) => (index % 2 === 0 ? "bg-gray-100" : "bg-white")}
      />


    </div>
  );
};

export default CheckoutTable;
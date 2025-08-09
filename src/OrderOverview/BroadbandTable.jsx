

import React from "react";
import { Table } from "antd";
import { DatePicker, Button } from 'antd';

const { RangePicker } = DatePicker;
const BroadbandTable = () => {
  const columns = [
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "Order No", dataIndex: "orderNo", key: "orderNo" },
    { title: "Starting Status", dataIndex: "startingStatus", key: "startingStatus" },
    { title: "Current Status", dataIndex: "currentStatus", key: "currentStatus" },
    { title: "Product", dataIndex: "product", key: "product" },
    { title: "Sales Person / Channel", dataIndex: "salesPersonChannel", key: "salesPersonChannel" },
    { title: "Actions", dataIndex: "actions", key: "actions" },
    {
      title: "Select",
      dataIndex: "select",
      key: "select",
      render: () => (
        <button className="bg-[#CAFE9E] py-2 px-4 rounded-md hover:bg-[#ADFF67 text-black transition-all">
 Insights
        </button>
      ),
    },
  ];

  const data = [
    { key: "1", date: "10/01/2023", orderNo: "#123456", startingStatus: "Checkout Abandon", currentStatus: "Abandoned Not Interested", product: "Ultrafast 115 with Moneysupermarket", salesPersonChannel: "Kelvin", actions: "Insight" },
    { key: "2", date: "10/02/2023", orderNo: "#123457", startingStatus: "Checkout Complete", currentStatus: "Totally Complete", product: "Standard Broadband", salesPersonChannel: "Moneysupermarket", actions: "Insight" },
    { key: "3", date: "10/03/2023", orderNo: "#123458", startingStatus: "Checkout Complete", currentStatus: "Cancelled by Customer", product: "Standard Broadband", salesPersonChannel: "Moneysupermarket", actions: "Insight" }
  ]

  return (
    <div className="bg-white shadow-md rounded-lg p-6 w-full mx-auto ">
<div className="flex flex-col md:flex-row items-center md:space-x-4 space-y-4 md:space-y-0 mb-6">
  <label className="text-gray-600 font-medium text-center md:text-left">
    Select Date Range:
  </label>
  <RangePicker format="DD/MM/YY" className="w-full md:w-64" />
  <button className="bg-[#CAFE9E] px-6 py-3 rounded-md text-black hover:bg-[#ADFF67] w-full md:w-auto">
    Overview Insights
  </button>
</div>

      {/* Responsive Table */}
      <div className="overflow-x-auto">
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
          className="min-w-max w-full"
        />
      </div>
    </div>
  );
};

export default BroadbandTable;

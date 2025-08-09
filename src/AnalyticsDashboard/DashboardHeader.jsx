import React from "react";
import { Layout } from "antd";
import { SettingOutlined } from "@ant-design/icons";

const { Header } = Layout;

const DashboardHeader = () => {
    return (
        <Header className="bg-white p-4 flex justify-between items-center shadow-md">
            <span>      <h2 className="text-xl font-semibold mb-6">POP Telecom</h2></span>
            <span className="flex items-center">
                <span className="mr-2 font-medium">John Smith</span>
                <SettingOutlined />
            </span>
        </Header>
    );
};

export default DashboardHeader;

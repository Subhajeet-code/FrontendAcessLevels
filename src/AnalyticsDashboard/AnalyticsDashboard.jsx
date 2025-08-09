

import React from "react";
import { Layout, Menu, Card } from "antd";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { SettingOutlined } from "@ant-design/icons";

const { Header, Sider, Content, Footer } = Layout;

const salesData = [
    { name: "Q1", value: 80 },
    { name: "Q2", value: 60 },
    { name: "Q5", value: 70 },
    { name: "Q4", value: 90 },
    { name: "Q5", value: 75 },
    { name: "Q4", value: 98 },
];

const orderData = [
    { name: "Jan", grayPart: 20, greenPart: 20 },
    { name: "Feb", grayPart: 30, greenPart: 30 },
    { name: "Mar", grayPart: 15, greenPart: 15 },
    { name: "Jan", grayPart: 20, greenPart: 20 },
    { name: "Feb", grayPart: 30, greenPart: 30 },
    { name: "Mar", grayPart: 15, greenPart: 15 },
    { name: "Jan", grayPart: 20, greenPart: 20 },
    { name: "Feb", grayPart: 30, greenPart: 30 },
    { name: "Mar", grayPart: 15, greenPart: 15 },
];

const AnalyticsDashboard = () => {
    return (
        <Layout className="bg-gray-100"> <Header className="bg-white w-full fixed top-0 left-0 shadow-md px-6 py-4 flex justify-between items-center z-50">
            <span className="text-lg font-bold">POP Telecom</span>
            <span className="flex items-center">
                <span className="mr-2 font-medium">John Smith</span>
                <SettingOutlined />
            </span>
        </Header> <Layout className="mt-16">
                <Sider width={250} className="bg-[#F0F0F5] p-6 ">
                    <div className="mb-6">
                        <h3 className="text-lg font-medium mb-2">Order Insights</h3>
                        <ul className="text-gray-600 space-y-1">
                            <li>Order Share Change</li>
                            <li>Checkout Abandonment Reasons</li>
                            <li>Conversion Rates</li>
                            <li>Affiliate Performance</li>
                            <li>Operational Efficiency</li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="text-lg font-medium mb-2">AI Predictions</h3>
                        <ul className="text-gray-600 space-y-1">
                            <li>Cancellations</li>
                            <li>Fulfillment Delays</li>
                            <li>Customer Behavior Trends</li>
                        </ul>
                    </div>
                </Sider>
                <Content className="">
                    <div className="grid grid-cols-2 lg:grid-cols-3">
                        <Card className="col-span-2 p-6">
                            <h3 className="text-lg font-bold mb-4">Sales Trends</h3>
                            <ResponsiveContainer width="70%" height={salesData.length * 50}>
                                <BarChart data={salesData} layout="vertical">
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        tick={false}
                                        axisLine={true}
                                    />
                                    <XAxis type="number" tick={false} axisLine={false} />
                                    <Tooltip />
                                    <Bar
                                        dataKey="value"
                                        barSize={20}
                                        shape={(props) => {
                                            const { x, y, width, height } = props;
                                            return (
                                                <g>
                                                    <rect x={x} y={y} width={width / 2} height={height} fill="gray" />
                                                    <rect x={x + width / 2} y={y} width={width / 2} height={height} fill="#8bc34a" />
                                                </g>
                                            );
                                        }}
                                    />
                                </BarChart>
                            </ResponsiveContainer>

                            <div className="mt-6"><h3 className="text-lg font-bold mb-4">Order Heatmap</h3>
                                <ResponsiveContainer width="60%" height={300}>
                                    <BarChart data={orderData}>
                                        <XAxis tick={false} axisLine={true} />
                                        <Tooltip />
                                        <Bar dataKey="grayPart" stackId="stack" fill="gray" />
                                        <Bar dataKey="greenPart" stackId="stack" fill="#8bc34a" />
                                    </BarChart>
                                </ResponsiveContainer>

                            </div>
                        </Card>
                        <div className="p-6">
                            <h3 className="text-lg font-bold mb-4">
                                Actionable Recommendations
                            </h3>
                            <ul className="list-disc pl-4 text-gray-600 space-y-2">
                                <li>Optimize Checkout Process</li>
                                <li>Enhance Customer Engagement</li>
                                <li>Improve Fulfillment Speed</li>
                            </ul>
                        </div>
                    </div>
                </Content>
            </Layout>
            <Footer className="bg-[#F0F0F5] w-full fixed bottom-0 left-0 border-t text-center text-gray-600 text-sm shadow-md flex flex-col sm:flex-row justify-between items-center px-6 py-4">
                <span>© 2025 POP Telecom. All rights reserved.</span>
                <div className="flex space-x-4 mt-2 sm:mt-0">
                    <a href="#" className="text-gray-900 hover:text-green-600 ">
                        Privacy Policy
                    </a>
                    <a href="#" className="text-gray-900 hover:text-green-600 ">
                        Terms of Service
                    </a>
                </div>
            </Footer>
        </Layout>
    );
};

export default AnalyticsDashboard;

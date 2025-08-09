import React from "react";
import { Layout } from "antd";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import BroadbandTable from "./BroadbandTable";
import SupportSection from "./SupportSection";
import FooterComponent from "./Footer";
const { Content } = Layout;
const OrderOverview = () => {
  return (
    <Layout className="min-h-screen">
      <Navbar />
      <Layout>

        <Layout hasSider>

          <Content className="p-6">
            <BroadbandTable />
          </Content>
        </Layout>
        <FooterComponent />
      </Layout>
    </Layout>
  );
};

export default OrderOverview;

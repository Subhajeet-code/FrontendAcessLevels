import React from "react";
import { Layout } from "antd";
import Navbar from "./Navbar";
import FooterComponent from "./Footer";
import Sidebar from "../Customer Portal/Sidebar";
import FindAddress from "./FindAddress";
const { Content } = Layout;
const OnlineBroadbandOrdering = () => {
  return (
    <Layout className="min-h-screen">
      <Navbar />
      <Layout>
        <Layout hasSider>
          <Sidebar />
          <Content className="p-6">
            <FindAddress />
          </Content>
        </Layout>
        <FooterComponent />
      </Layout>
    </Layout>
  );
};

export default OnlineBroadbandOrdering;

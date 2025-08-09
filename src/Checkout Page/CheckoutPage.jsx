import React from "react";
import { Layout } from "antd";
import Navbar from "./Navbar";
import CheckoutTable from "./CheckoutTable";
import CardSection from "./CardSection";
import ChechoutSummmary from "./ChechoutSummmary";
const { Content } = Layout;

const CheckoutPage = () => {
  return (
    <Layout className="min-h-screen">
      <Navbar />
      <Layout>
        <Layout hasSider>
          <Content className="p-6">
            <CheckoutTable />
            <CardSection />
            <ChechoutSummmary/>
          </Content>
        </Layout>

      </Layout>
    </Layout>
  );
};

export default CheckoutPage;

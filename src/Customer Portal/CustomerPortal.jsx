import React , {useEffect} from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { Layout } from "antd";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import BroadbandTable from "./BroadbandTable";
import SupportSection from "./SupportSection";
import FooterComponent from "./Footer";
const { Content } = Layout;
const CustomerPortal = () => {
  const navigate = useNavigate();
    // useEffect(() => {
    //   const token = localStorage.getItem("token");
    //   if (!token) {
    //     Swal.fire({
    //       icon: "warning",
    //       title: "Unauthorized",
    //       text: "You are not logged in. Please log in first.",
    //       confirmButtonText: "OK",
    //     }).then(() => {
    //       navigate("/");
    //     });
    //   }
    // }, [navigate]);
  return (
    <Layout className="min-h-screen">
      <Navbar />
      <Layout>

        <Layout hasSider>
          <Sidebar />
          <Content className="p-6">
            <BroadbandTable />
            <SupportSection />
          </Content>
        </Layout>
        <FooterComponent />
      </Layout>
    </Layout>
  );
};

export default CustomerPortal;

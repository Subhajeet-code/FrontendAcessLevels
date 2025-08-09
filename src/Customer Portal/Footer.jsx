import React from "react";
import { Layout } from "antd";

const { Footer } = Layout;

const FooterComponent = () => {
  return (
    <Footer className="bg-gray-100 mt-6 py-4 w-full border-t text-center flex flex-col md:flex-row items-center md:justify-between px-6 space-y-4 md:space-y-0">
      <div className="font-lexend-deca text-sm md:text-base">
        © 2025 Broadband Buddy Portal - Pop Telecom Company
      </div>
      <div className="flex space-x-6 font-lexend-deca text-sm md:text-base">
        <p className="hover:text-green-600 cursor-pointer">Legal</p>
        <p className="hover:text-green-600 cursor-pointer">Privacy Policy</p>
        <p className="hover:text-green-600 cursor-pointer">Terms Of Service</p>
      </div>
    </Footer>
  );
};

export default FooterComponent;

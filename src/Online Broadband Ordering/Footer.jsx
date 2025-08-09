import React from "react";
import { Layout } from "antd";
const { Footer } = Layout;
const FooterComponent = () => {
  return (
    <Footer className="bg-gray-100 mt-6 py-4 w-full text-center border border-t flex flex-col md:flex-row md:justify-between items-center px-6">
      <div className="font-lexend-deca text-sm md:text-base text-gray-700 text-center md:text-left">
        © 2025 Broadband Buddy Portal - Pop Telecom Company
      </div>
      <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-10 font-lexend-deca text-sm md:text-base">
        <p className="hover:text-green-600 cursor-pointer">Privacy Policy</p>
        <p className="hover:text-green-600 cursor-pointer">Terms Of Service</p>
      </div>
    </Footer>
  );
};

export default FooterComponent;

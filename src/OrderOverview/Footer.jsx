import React from "react";
import { Layout } from "antd";

const { Footer } = Layout;

const FooterComponent = () => {
  return (
    <Footer className="bg-gray-100 mt-6 py-4 w-full border-t text-center flex flex-wrap items-center justify-center md:justify-between px-6 gap-4">
      <div className="font-lexend-deca text-sm md:text-base text-center">
        © 2025 Broadband Buddy Portal - Pop Telecom Company
      </div>
      <div className="flex flex-wrap justify-center md:justify-start space-x-6 font-lexend-deca text-sm md:text-base">
        <p className="hover:text-green-600 cursor-pointer">Legal</p>
        <p className="hover:text-green-600 cursor-pointer">Privacy Policy</p>
        <p className="hover:text-green-600 cursor-pointer">Terms Of Service</p>
        <p className="hover:text-green-600 cursor-pointer">Cookies Policy</p>
      </div>
    </Footer>
  );
};

export default FooterComponent;

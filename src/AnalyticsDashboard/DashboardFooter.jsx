import React from "react";
import { Layout } from "antd";

const { Footer } = Layout;

const FooterBar = () => {
  return (
    <Footer className="bg-white border-t text-center text-gray-600 text-sm py-4 w-full">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center px-6">
        <span>© 2025 POP Telecom. All rights reserved.</span>
        <div className="flex space-x-4 mt-2 sm:mt-0">
          <a href="#" className="text-blue-500 hover:underline">
            Privacy Policy
          </a>
          <a href="#" className="text-blue-500 hover:underline">
            Terms of Service
          </a>
        </div>
      </div>
    </Footer>
  );
};

export default FooterBar;

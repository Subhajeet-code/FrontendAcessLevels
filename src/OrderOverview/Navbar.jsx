import React, { useState } from "react";
import { Layout } from "antd";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";

const { Header } = Layout;

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Header className="bg-white flex justify-between items-center px-6 md:px-10 py-4 shadow-md relative">
         {/* Logo Section */}
         <div className="flex flex-col sm:flex-row items-center sm:space-x-4 mb-6 text-center mt-6 sm:text-left">
        <img src="/assets/pop-logo.png" alt="Logo" className="w-10 h-10" />
        <h1 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold font-sans mt-2 sm:mt-0">
    Orders Overview
        </h1>
      </div>
      <nav className="hidden lg:flex space-x-8">
        <button className="text-black text-lg font-medium hover:text-[#28A745] transition">Dashboard</button>
        <button className="text-black text-lg font-medium hover:text-[#28A745] transition">Reports</button>
        <button className="text-black text-lg font-medium hover:text-[#28A745] transition">Settings</button>
      </nav>
      <button
        className="lg:hidden text-2xl focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <CloseOutlined /> : <MenuOutlined />}
      </button>
      {menuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center space-y-4 py-6 z-50 lg:hidden">
     <button className="text-black text-lg font-medium hover:text-[#28A745] transition">Dashboard</button>
        <button className="text-black text-lg font-medium hover:text-[#28A745] transition">Reports</button>
        <button className="text-black text-lg font-medium hover:text-[#28A745] transition">Settings</button>
        </div>
      )}
    </Header>
  );
};

export default Navbar;

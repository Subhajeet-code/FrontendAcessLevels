import React, { useState } from "react";
import { Layout } from "antd";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
const { Header } = Layout;

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogout = () => {
    setLoading(true);

    setTimeout(() => {
      localStorage.removeItem("token");
      navigate("/");
    }, 2000);
  };

  const handleLogoClick = () => {
    navigate("/customer-portal");
  };

  const handleChecker = () => {
    navigate("/online-broadband-ordering");
  };
  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-[#5664F5] rounded-full animate-spin"></div>
        </div>
      )}
      <Header className="bg-white flex justify-between items-center px-6 md:px-10 py-4 shadow-md relative">
        <div className="flex items-center space-x-3">
          <img
            src="/assets/broadband-logo.png"
            alt="Logo"
            className="w-10 md:w-12"
            onClick={handleLogoClick}
          />
          <h2 className="text-lg md:text-xl font-bold font-lexend-deca">
            Broadband Buddy Customer Portal
          </h2>
        </div>
        <nav className="hidden lg:flex space-x-8">
          <button className="text-black text-lg font-medium hover:text-[#28A745] transition"  onClick={handleLogoClick}>
            Home
          </button>
          <button className="text-black text-lg font-medium hover:text-[#28A745] transition" onClick={handleChecker}>
            Checker
          </button>
          <button className="text-black text-lg font-medium hover:text-[#28A745] transition">
            Broadband Reports
          </button>
          <button
            onClick={handleLogout}
            className="text-black text-lg font-medium hover:text-[#28A745] transition"
          >
            Logout
          </button>
        </nav>
        <button
          className="lg:hidden text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <CloseOutlined /> : <MenuOutlined />}
        </button>
        {menuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-md flex flex-col items-center space-y-4 py-6 z-50 lg:hidden">
            <button className="text-black text-lg font-medium hover:text-[#28A745] transition"  onClick={handleLogoClick}>
              Home
            </button>
            <button className="text-black text-lg font-medium hover:text-[#28A745] transition" onClick={handleChecker}>
              Checker
            </button>
            <button className="text-black text-lg font-medium hover:text-[#28A745] transition">
              Broadband Reports
            </button>
            <button
              onClick={handleLogout}
              className="text-black text-lg font-medium hover:text-[#28A745] transition"
            >
              Logout
            </button>
          </div>
        )}
      </Header>
    </>
  );
};

export default Navbar;

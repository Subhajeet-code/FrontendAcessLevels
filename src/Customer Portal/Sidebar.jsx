import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { menuItems, roles } from "../utils/constant";

const Sidebar = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setUserRole(storedRole);
  }, []);

  const handleLogout = () => {
    setLoading(true);
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      navigate("/");
    }, 2000);
  };

  return (
    <>
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-[#5664F5] rounded-full animate-spin"></div>
        </div>
      )}
      <div className="w-72 bg-white p-6 shadow-md rounded-lg mt-6 ml-8 lg:ml-8 lg:w-72 md:w-60 sm:w-full sm:ml-0">
        <nav>
          <ul>
            {menuItems
              ?.filter((item) => item.roles?.includes(userRole))
              .map((item, index) => (
                <li key={index} className="mb-3">
                  {item.label === "Logout" ? (
                    <button
                      onClick={handleLogout}
                      className="w-full text-left block font-medium lg:text-[15px] md:text-[12px] text-gray-700 rounded-lg p-4 shadow-md transition-all hover:text-red-600"
                    >
                      {item.label}
                    </button>
                  ) : (
                    <NavLink
                      to={item.path}
                      className={({ isActive }) =>
                        `block font-medium text-[15px] rounded-lg p-4 shadow-md transition-all 
     ${isActive ? "text-green-600" : "text-gray-700 hover:text-green-600"}`
                      }
                    >
                      {item.label}
                    </NavLink>
                  )}
                </li>
              ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;

import React, { useState } from "react";
import { Input, Spin, Alert } from "antd";
import { IoLocationSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import {
  setPhoneNumber,
  setPostCode,
  setAddresses,
  setCpwnRef,
  setServiceId,
} from "../redux/addressSlice";
import { FaPhone } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../utils/utils";

const InputField = ({ placeholder, type = "text", value, onChange }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="w-full h-14 px-2 border border-gray-300 rounded-lg bg-white text-gray-500 text-sm font-['Lexend_Deca'] outline-none mb-2"
  />
);

const FindAddress = () => {
  const dispatch = useDispatch();

  const phoneNumber = useSelector((state) => state.address.phoneNumber);
  const postCode = useSelector((state) => state.address.postCode);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!postCode) {
      setStatus({ type: "error", message: "Please enter a postcode!" });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      //Address
      const response = await fetch(apiUrl() + "addresses/check-address", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postCode, phoneNumber }),
      });
      if (response.ok) {
        const data = await response.json();
        if (data.status && data.data.sites.length > 0) {
          const formattedAddresses = data.data.sites.map((site) => {
            const {
              subBuilding,
              organisationName,
              buildingNumber,
              buildingName,
              street,
              locality,
              districtCode,
              postCode,
              postTown,
            } = site.address;

            const addressParts = [
              subBuilding,
              organisationName,
              buildingNumber,
              buildingName,
              street,
              locality,
              districtCode,
              postCode,
              postTown,
            ].filter((part) => part !== undefined);

            return {
              fullAddress: addressParts.join(", "),
              site,
            };
          });
          dispatch(setAddresses(formattedAddresses));
          // dispatch(setPhoneNumber(phoneNumber));
          dispatch(setPostCode(postCode));

          navigate("/select-address");
        } else {
          setStatus({
            type: "error",
            message: "No addresses found for the entered postcode.",
          });
        }
      } else {
        setStatus({ type: "error", message: "Failed to retrieve addresses!" });
      }
    } catch (error) {
      setStatus({ type: "error", message: "Error while fetching addresses!" });
    } finally {
      setLoading(false);
    }
  };
  // console.log("dfgh",associatedCPWNRef);

  return (
    <div className="relative flex flex-col items-center justify-center p-4">
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-[#5664F5] rounded-full animate-spin"></div>
        </div>
      )}
      <nav className="max-w-3xl text-[16px] my-10 font-medium">
        <div className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0 my-10 items-center">
          <a href="#" className="hover:text-green-600">
            Basic Checker
          </a>
          <a href="#" className="hover:text-green-600">
            Full Broadband Check
          </a>
          <a href="#" className="hover:text-green-600">
            GigoClear Checker
          </a>
          <a href="#" className="hover:text-green-600">
            Available Packages
          </a>
          <a href="#" className="hover:text-green-600">
            Bulk Checker
          </a>
        </div>
      </nav>
      <div className="">
        <h1 className="text-[16px] sm:text-xl font-semibold text-left mb-6">
          Welcome! Check Broadband Availability in Your Area
        </h1>
        <div className="flex flex-col justify-start space-y-4 w-full max-w-md">
          {/* <div className="flex items-center space-x-2">
            <FaPhone className="text-[#28A745] text-[16px]" />
            <InputField
              placeholder="Phone Number"
              type="tel"
              value={phoneNumber}
              onChange={(e) => dispatch(setPhoneNumber(e.target.value))}
            />
          </div> */}
          <div className="flex items-center space-x-2">
            <IoLocationSharp className="text-[#28A745] text-[16px]" />
            <InputField
              placeholder="Postcode"
              value={postCode}
              onChange={(e) => dispatch(setPostCode(e.target.value))}
            />
          </div>
          <div className="flex justify-end">
            <button
              onClick={handleSearch}
              className="bg-[#28A745] hover:bg-[#5664F5] text-white text-sm px-12 py-3 rounded-full"
              disabled={loading}
            >
              Search
            </button>
          </div>
          {status && (
            <Alert
              className="mt-4"
              message={status.message}
              type={status.type}
              showIcon
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default FindAddress;

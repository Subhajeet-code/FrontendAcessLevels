import React, { useState } from "react";
import { Layout, Typography } from "antd";
import { Alert, Table, Divider, Select, Button } from "antd";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { apiUrl } from "../utils/utils";
import Navbar from "../Online Broadband Ordering/Navbar";
import FooterComponent from "../Online Broadband Ordering/Footer";
import Sidebar from "../Customer Portal/Sidebar";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedAddress, setAddressType } from "../redux/addressSlice";
import { setProducts } from "../redux/addressSlice";

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;
const { Option } = Select;

const AddressPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { addresses, phoneNumber, postCode, selectedAddress, products } =
    useSelector((state) => state.address);
  console.log("postcode", postCode);
  console.log("phoneNumber", phoneNumber);
  console.log("addresses", addresses);
  console.log("selectedAddress", selectedAddress);

  const [loading, setLoading] = useState(false);

  const handleAddressSelect = (value) => {
    const selected = addresses.find((addr) => addr.fullAddress === value);
    if (selected) {
      dispatch(setSelectedAddress(selected));
    }
  };

  // const selectedAddress = useSelector((state) => state.product.selectedAddress);
  const handleContinue = async () => {
    if (!selectedAddress) {
      alert("Please select an address before proceeding.");
      return;
    }

    setLoading(true);

    let addressType = "";
    let requestBody = {};

    if (
      selectedAddress.site.uprn &&
      !selectedAddress.site.address.alk &&
      !selectedAddress.site.address.districtCode
    ) {
      addressType = "UPRN";
      requestBody = { addressType, uprn: selectedAddress.site.uprn };
    } else if (
      !selectedAddress.site.uprn &&
      selectedAddress.site.address.alk &&
      selectedAddress.site.address.districtCode
    ) {
      addressType = "GALK";
      requestBody = {
        addressType,
        alk: selectedAddress.site.address.alk,
        cssDistrictCode: selectedAddress.site.address.districtCode,
      };
    } else if (
      selectedAddress.site.uprn &&
      selectedAddress.site.address.alk &&
      selectedAddress.site.address.districtCode
    ) {
      addressType = "GALK-UPRN";
      requestBody = {
        addressType,
        uprn: selectedAddress.site.uprn,
        alk: selectedAddress.site.address.alk,
        cssDistrictCode: selectedAddress.site.address.districtCode,
      };
    }

    try {
      const response = await fetch(
        apiUrl() + "addresses/get-all-product-availablity",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        }
      );

      if (response.ok) {
        const data = await response.json();
        dispatch(setProducts(data.data.products || []));
        console.log("At", addressType);
        dispatch(setAddressType(addressType));
        dispatch(setSelectedAddress(selectedAddress));
        navigate("/product-select-layout");
      } else {
        alert("Failed to retrieve products!");
      }
    } catch (error) {
      alert("Error while fetching products!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout className="min-h-screen">
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <Layout>
          <Layout hasSider>
            <Sidebar />
            <div className="flex-grow flex items-center justify-center p-4">
              {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="w-16 h-16 border-4 border-gray-200 border-t-[#5664F5] rounded-full animate-spin"></div>
                </div>
              )}

              <div className={loading ? "blur-sm pointer-events-none" : ""}>
                {/* Navbar */}
                <Header className="bg-white flex flex-col items-start px-10 py-6 shadow-md z-10">
                  <Title level={2} className="font-lexend-deca">
                    Select Address
                  </Title>
                  <div className="flex justify-between items-center text-gray-600 w-full">
                    <div className="flex items-center gap-2 sm:gap-4">
                      <Text className="mb-2 text-base sm:text-lg">
                        Please choose your address from the list below or search
                        for it.
                      </Text>
                      <FaMapMarkerAlt className="text-2xl text-[#5664F5]" />
                    </div>
                  </div>
                </Header>

                {/* Content */}
                <Content className="p-6 mt-6">
                  <div className="mt-2 shadow-md max-w-5xl bg-white p-4 rounded-lg h-[450px] overflow-y-scroll border rounded-md">
                    <div className="space-y-2 mt-2">
                      {addresses.length > 0 && (
                        <div>
                          {addresses.map((addressObj, index) => (
                            <div
                              key={index}
                              onClick={() =>
                                handleAddressSelect(addressObj.fullAddress)
                              }
                              className={`p-5 rounded-lg shadow-md cursor-pointer ${
                                selectedAddress?.fullAddress ===
                                addressObj.fullAddress
                                  ? "bg-green-300"
                                  : index % 2 === 0
                                  ? "bg-gray-100"
                                  : "bg-white"
                              } hover:bg-green-200 transition`}
                            >
                              <p className="text-gray-800">
                                {addressObj.fullAddress}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Content>

                {/* Footer */}
                <Footer className="bg-gray-100 mt-6 flex justify-between border-t py-4 w-full text-center">
                  <div className="font-lexend-deca">
                    <button
                      className="bg-[#5664F5] hover:bg-[#28A745] text-white text-sm px-12 py-3 rounded-lg"
                      onClick={() => navigate(-1)}
                    >
                      Back
                    </button>
                  </div>
                  <div className="flex space-x-10 font-lexend-deca">
                    <button
                      onClick={handleContinue}
                      className={`bg-[#28A745] hover:bg-[#5664F5] text-white text-sm px-12 py-3 rounded-lg ${
                        loading ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      disabled={loading}
                    >
                      Continue
                    </button>
                  </div>
                </Footer>
              </div>
            </div>
          </Layout>
        </Layout>
        <FooterComponent />
      </div>
    </Layout>
  );
};

export default AddressPage;

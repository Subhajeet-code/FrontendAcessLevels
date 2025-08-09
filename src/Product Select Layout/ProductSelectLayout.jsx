import React, { useCallback, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Layout,
  Checkbox,
  Table,
  Divider,
  Select,
  Button,
  Typography,
  Alert,
  Spin,
} from "antd";
import { debounce } from "lodash";
import Navbar from "../Online Broadband Ordering/Navbar";
import Footer from "../Online Broadband Ordering/Footer";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedProductDetails } from "../redux/addressSlice";
const { Option } = Select;
const { Content, Sider } = Layout;
const { Title, Text } = Typography;

const ProductSelectLayout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products = [] } = useSelector((state) => state.address);
  const selectedAddress = useSelector((state) => state.address.selectedAddress);
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedSpeed, setSelectedSpeed] = useState({});
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [siteOnt, setSiteOnt] = useState("");
  const [siteExisting, setSiteExisting] = useState("");
  const [siteInfoAlk, setSiteInfoAlk] = useState("");
  const [siteInfoDc, setSiteInfoDc] = useState("");
  const [siteInfoProvisioningCommands, setSiteInfoProvisioningCommands] =
    useState([]);
  const [lineStatus, setLineStatus] = useState("");

  const flattenedProducts = products
    .filter((product) => product.availability === "Y")
    .flatMap((product) =>
      product.speeds.map((speed) => ({
        ...product,
        productSpeed: speed.productSpeed,
      }))
    );

  const [selectedDownloadSpeeds, setSelectedDownloadSpeeds] = useState([]);
  const [selectedUploadSpeeds, setSelectedUploadSpeeds] = useState([]);
  const [selectedSuppliers, setSelectedSuppliers] = useState([]);
  const [selectedTechnology, setSelectedTechnology] = useState([]);

  const downloadSpeeds = [
    ...new Set(flattenedProducts.map((p) => p.productSpeed?.split("/")[0])),
  ];
  const uploadSpeeds = [
    ...new Set(flattenedProducts.map((p) => p.productSpeed?.split("/")[1])),
  ];
  const suppliers = [...new Set(flattenedProducts.map((p) => p.supplierName))];
  const technologies = [...new Set(flattenedProducts.map((p) => p.technology))];

  const applyFilters = useCallback(
    debounce(() => {
      setIsLoading(false);
    }, 2000),
    []
  );
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  useEffect(() => {
    if (isFirstLoad) {
      setIsFirstLoad(false);
      return;
    }
    setIsLoading(true);
    setCurrentPage(1);
    applyFilters();
  }, [
    selectedDownloadSpeeds,
    selectedUploadSpeeds,
    selectedSuppliers,
    selectedTechnology,
    applyFilters,
  ]);

  const filteredProducts = flattenedProducts.filter((product) => {
    const downloadSpeed = product.productSpeed?.split("/")[0];
    const uploadSpeed = product.productSpeed?.split("/")[1];
    return (
      (selectedDownloadSpeeds.length === 0 ||
        selectedDownloadSpeeds.includes(downloadSpeed)) &&
      (selectedUploadSpeeds.length === 0 ||
        selectedUploadSpeeds.includes(uploadSpeed)) &&
      (selectedSuppliers.length === 0 ||
        selectedSuppliers.includes(product.supplierName)) &&
      (selectedTechnology.length === 0 ||
        selectedTechnology.includes(product.technology))
    );
  });
  const handleShow = (record) => {
    setSelectedProduct(record);
  };
  useEffect(() => {
    if (!selectedProduct) return;

    const ontRef =
      products?.[0]?.existingLine?.opticalNetworkTerminator?.[0]?.ontCharacteristic?.find(
        (item) => item.name === "ontReference"
      )?.value || "";
    setSiteOnt(ontRef);

    setSiteInfoAlk(selectedAddress?.site?.address?.alk);
    setSiteInfoDc(selectedAddress?.site?.address?.districtCode);

    const accessLine = products?.[0]?.existingLine?.accessLine?.[0];

    const status =
      accessLine?.lineCharacteristic?.find((item) => item.name === "lineStatus")
        ?.value || "";

    setLineStatus(status);

    const lineId = accessLine?.id || "";
    setSiteExisting(lineId);

    setLineStatus(status);
    const commands =
      selectedProduct?.provisioningTypes
        ?.filter((cmd) =>
          cmd.provisioningDetails?.some(
            (detail) =>
              detail.name === "available" &&
              (detail.value === "Y" || detail.value === "P")
          )
        )
        ?.map((cmd) => cmd.provisioningCommand) || [];

    setSiteInfoProvisioningCommands(commands);
  }, [selectedProduct, selectedSite, products]);

  const handleCreateOrder = (product) => {
    if (!selectedProduct) {
      alert("Please select a product before proceeding.");
      return;
    }
    if (!selectedProduct.productSpeed) {
      alert("Please select a speed before proceeding.");
      return;
    }
    const extractValidAccessLines = (products) => {
      if (!Array.isArray(products)) return [];

      const accessLines = [];

      for (const product of products) {
        if (product.availability !== "Y") continue;

        const lines = product.existingLine?.accessLine;
        if (!Array.isArray(lines)) continue;

        for (const line of lines) {
          const id = line.id || "-";

          const statusObj = line.lineCharacteristic?.find(
            (c) => c.name === "lineStatus"
          );
          const typeObj = line.lineCharacteristic?.find(
            (c) => c.name === "productType"
          );
          const locationObj = line.locationCharacteristic?.find(
            (c) => c.name === "location"
          );

          const status = statusObj?.value || "-";
          const type = typeObj?.value || "-";
          const location = locationObj?.value?.replace(/\|/g, "") || "-";

          accessLines.push({
            id,
            status,
            type,
            location,
          });
        }
      }

      return accessLines;
    };

    const accessLines = extractValidAccessLines(products);

    const ontReferenceNo =
      products?.[0]?.existingLine?.opticalNetworkTerminator?.[0]?.ontCharacteristic?.find(
        (item) => item.name === "ontReference"
      )?.value || "";
    const ontPortNo =
      products?.[0]?.existingLine?.opticalNetworkTerminator?.[0]?.port?.[0]?.portCharacteristic?.find(
        (item) => item.name === "portNumber"
      )?.value || "";

    const selectedFullProduct = products.find(
      (p) => p.productName === selectedProduct.productName
    );

    const selectedProductDetails = {
      ...selectedProduct,
      accessLines,
      ontReferenceNo,
      ontPortNo,
      provisioningTypes: selectedFullProduct?.provisioningTypes || [],
    };

    if (
      selectedSite?.uprn &&
      !selectedSite?.address?.alk &&
      !selectedSite?.address?.districtCode
    ) {
      selectedProductDetails = {
        ...selectedProductDetails,
        uprn: selectedSite.uprn,
      };
    } else if (
      !selectedSite?.uprn &&
      selectedSite?.address?.alk &&
      selectedSite?.address?.districtCode
    ) {
      selectedProductDetails = {
        ...selectedProductDetails,
        alk: selectedSite.address.alk,
        districtCode: selectedSite.address.districtCode,
      };
    } else if (
      selectedSite?.uprn &&
      selectedSite?.address?.alk &&
      selectedSite?.address?.districtCode
    ) {
      selectedProductDetails = {
        ...selectedProductDetails,
        uprn: selectedSite.uprn,
        alk: selectedSite.address.alk,
        districtCode: selectedSite.address.districtCode,
      };
    }

    dispatch(setSelectedProductDetails(selectedProductDetails));
    navigate("/get-appointment");
  };

  return (
    <Layout className="min-h-screen">
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <Layout>
          <Layout hasSider>
            <Sider
              width={260}
              className="bg-white p-6 ml-8 shadow-md mt-6 rounded-lg"
            >
              <h2 className="text-3xl font-bold font-lexend-deca mb-4">
                Filters
              </h2>

              <div className="mt-6 space-y-6">
                {/* Supplier */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">Supplier</h3>
                  <Checkbox.Group
                    className="flex flex-col space-y-2 custom-checkbox"
                    value={selectedSuppliers}
                    onChange={(checkedValues) =>
                      setSelectedSuppliers(checkedValues)
                    }
                  >
                    {suppliers.map((supplier) => (
                      <Checkbox key={supplier} value={supplier}>
                        {supplier}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                </div>

                {/* Technology Type */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Technology Type
                  </h3>
                  <Checkbox.Group
                    className="flex flex-col space-y-2 custom-checkbox"
                    value={selectedTechnology}
                    onChange={(checkedValues) =>
                      setSelectedTechnology(checkedValues)
                    }
                  >
                    {technologies.map((technology) => (
                      <Checkbox key={technology} value={technology}>
                        {technology}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                </div>

                {/* Download Speed */}
                <div className="h-[150px] overflow-y-scroll">
                  <h3 className="font-semibold text-lg mb-2">
                    Download Speed (Mbps)
                  </h3>
                  <Checkbox.Group
                    className="flex flex-col space-y-2 custom-checkbox"
                    value={selectedDownloadSpeeds}
                    onChange={(checkedValues) =>
                      setSelectedDownloadSpeeds(checkedValues)
                    }
                  >
                    {downloadSpeeds.map((speed) => (
                      <Checkbox key={speed} value={speed}>
                        {speed}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                </div>

                {/* Upload Speed */}
                <div className="h-[150px] overflow-y-scroll">
                  <h3 className="font-semibold text-lg mb-2">
                    Upload Speed (Mbps)
                  </h3>
                  <Checkbox.Group
                    className="flex flex-col space-y-2 custom-checkbox"
                    value={selectedUploadSpeeds}
                    onChange={(checkedValues) =>
                      setSelectedUploadSpeeds(checkedValues)
                    }
                  >
                    {uploadSpeeds.map((speed) => (
                      <Checkbox key={speed} value={speed}>
                        {speed}
                      </Checkbox>
                    ))}
                  </Checkbox.Group>
                </div>

                {/* Contract Length */}
                <div>
                  <h3 className="font-semibold text-lg mb-2">
                    Contract Length (Months)
                  </h3>
                  <Checkbox.Group className="flex flex-col space-y-2 custom-checkbox">
                    <Checkbox value="12">12</Checkbox>
                    <Checkbox value="24">24</Checkbox>
                    <Checkbox value="36">36</Checkbox>
                  </Checkbox.Group>
                </div>
              </div>
            </Sider>

            {/* Main Content */}
            <Content className="p-6">
              {/* Broadband Table */}
              <div className="bg-white shadow-md rounded-lg p-4">
                <div className="flex items-center justify-between mt-4 mb-4">
                  <h1 className="text-3xl font-bold font-lexend-deca">
                    Broadband Plans
                  </h1>
                  <button className="w-auto btn text-[16px] py-4 px-8 rounded-md hover:bg-green-600 text-white transition">
                    Export To CSV
                  </button>
                </div>
                {selectedAddress && (
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <Text strong className="block mb-1 text-blue-800">
                      Selected Address
                    </Text>
                    <Text className="text-blue-600">
                      {selectedAddress.fullAddress}
                    </Text>
                  </div>
                )}
                {isLoading ? (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="w-16 h-16 border-4 border-gray-200 border-t-[#5664F5] rounded-full animate-spin"></div>
                  </div>
                ) : flattenedProducts.length > 0 ? (
                  <>
                    <Divider />
                    <Title level={4}>Products</Title>
                    <Table
                      columns={[
                        { title: "Supplier Name", dataIndex: "supplierName" },
                        { title: "Product Name", dataIndex: "productName" },
                        { title: "Technology", dataIndex: "technology" },
                        { title: "Access Type", dataIndex: "accessType" },
                        {
                          title: "Download Speed",
                          dataIndex: "downloadSpeed",
                          render: (_, record) =>
                            record.productSpeed?.split("/")[0] || "N/A",
                        },
                        {
                          title: "Upload Speed",
                          dataIndex: "downloadSpeed",
                          render: (_, record) =>
                            record.productSpeed?.split("/")[1] || "N/A",
                        },
                        {
                          title: "Availability",
                          dataIndex: "availability",
                          render: (text) => (text === "Y" ? "Yes" : "No"),
                        },
                        {
                          title: "Contract Length (Months)",
                          dataIndex: "contractLength",
                          render: () => "-",
                        },
                        {
                          title: "Pricing (€)",
                          dataIndex: "pricing",
                          render: () => "-",
                        },
                        {
                          title: "Action",
                          render: (_, record) =>
                            record.availability === "Y" ? (
                              <Button
                                type="primary"
                                onClick={() => handleShow(record)}
                              >
                                {selectedProduct &&
                                selectedProduct.productName ===
                                  record.productName &&
                                selectedProduct.productSpeed ===
                                  record.productSpeed
                                  ? "Selected"
                                  : "Select"}
                              </Button>
                            ) : (
                              "N/A"
                            ),
                        },
                      ]}
                      dataSource={filteredProducts}
                      rowKey={(record) =>
                        `${record.productName}-${record.productSpeed}`
                      }
                      bordered
                      pagination={{
                        pageSize: 4,
                        current: currentPage,
                        onChange: (page) => setCurrentPage(page),
                        showSizeChanger: false,
                      }}
                      className="w-full border border-gray-300 rounded-lg overflow-x-auto"
                      rowClassName={(record, index) =>
                        selectedProduct &&
                        selectedProduct.productName === record.productName &&
                        selectedProduct.productSpeed === record.productSpeed
                          ? "bg-green-300"
                          : index % 2 === 0
                          ? "bg-gray-100"
                          : "bg-white"
                      }
                    />
                  </>
                ) : (
                  <Alert
                    message="No available products for this address"
                    type="warning"
                    showIcon
                    style={{ marginTop: 20 }}
                  />
                )}
              </div>

              {/* Selected Plan Summary Section */}
              {selectedProduct && (
                <div className="bg-white shadow-md rounded-lg p-6 mt-6">
                  <div>
                    <h3 className="font-bold font-lexend-deca text-lg">
                      Site Information
                    </h3>
                    <div className="grid grid-cols-2">
                      <div>
                        <p className="font-lexend-deca font-medium">
                          <div className="mb-2 font-[16px]">
                            ALK: {siteInfoAlk || "N/A"}
                          </div>
                          <div className="mb-2 font-[16px]">
                            Product Speed: {selectedProduct.productSpeed}
                          </div>
                          <div className="mb-2 font-[16px]">
                            CSS District Code: {siteInfoDc}
                          </div>
                          <div className="mb-2 font-[16px]">
                            Existing line : {siteExisting || "N/A"}
                          </div>
                          <div className="mb-2 font-[16px]">
                            State : {lineStatus || "N/A"}
                          </div>
                        </p>
                      </div>
                      <div className="font-lexend-deca font-medium">
                        <div className="mb-2 font-[16px]">
                          ONT REF: {siteOnt}
                        </div>

                        <div className="mb-2 font-[16px]">
                          Provisioning Types:
                          {siteInfoProvisioningCommands.length > 0 ? (
                            <ul className="list-disc ml-4">
                              {siteInfoProvisioningCommands.map((cmd) => (
                                <li key={cmd}>{cmd}</li>
                              ))}
                            </ul>
                          ) : (
                            " --"
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-x-8 mt-4">
                    <button
                      className="btn py-4 text-[16px] px-8 rounded-lg hover:bg-[#28A745] text-white transition"
                      onClick={handleCreateOrder}
                      disabled={!selectedProduct}
                    >
                      Checkout
                    </button>
                    <button
                      className=" py-4 px-8 text-[16px] rounded-lg bg-[#28A745] text-white 
                hover:bg-[#5664F5] transition"
                    >
                      Talk to an Expert
                    </button>
                  </div>
                </div>
              )}
            </Content>
          </Layout>
        </Layout>
        <Footer />
      </div>
    </Layout>
  );
};

export default ProductSelectLayout;

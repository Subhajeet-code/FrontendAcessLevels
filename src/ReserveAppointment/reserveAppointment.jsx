import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Layout, Typography, Button, Spin, Radio } from "antd";
import { FaCalendarCheck } from "react-icons/fa";
import { apiUrl } from "../utils/utils";
import Navbar from "../Online Broadband Ordering/Navbar";
import FooterComponent from "../Online Broadband Ordering/Footer";
import Sidebar from "../Customer Portal/Sidebar";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedAppointment } from "../redux/addressSlice";
const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const Appoint = () => {
  const location = useLocation();
  // const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const {
    appointments,
    uprn,
    alk,
    districtCode,
    selectedProductDetails,
    supplierName,
    productName,
    siteAddress,
    selectedAddress,
    productSpeed,
    provisioningCommand,
  } = useSelector((state) => state.address.appointmentDetails);

  const selectedAppointment = useSelector(
    (state) => state.address.selectedAppointment
  );

  const { addressType } = useSelector((state) => state.address);
  const navigate = useNavigate();

  const handleSelect = (e) => {
    setSelectedAppointment(e.target.value);
    dispatch(setSelectedAppointment(e.target.value));
  };

  const test = productName.split("-");
  let type = "";
  if (test[1] === "OR") {
    type = test[2] === "FTTP" ? "OR" : "SOGEA";
  } else if (test[1] === "CFH") {
    type = "CF";
  }

  const handleConfirm = async () => {
    if (!selectedAppointment) {
      alert("Please select an appointment before proceeding.");
      return;
    }
    setLoading(true);
    const payload = {
      appointmentDate: selectedAppointment.appointmentDate,
      appointmentStartTime: selectedAppointment.appointmentStartTime,
      appointmentEndTime: selectedAppointment.appointmentEndTime,
      appointmentTimeSlot:
        selectedAppointment.appointmentTimeSlot ||
        selectedAppointment.appointmentTimeslot,
      provisioningCommand,
      type,
      productName,
      productSpeed,
      addressType,
    };
    if (uprn?.trim()) payload.uprn = uprn;
    if (alk?.trim()) payload.galk = alk;
    if (districtCode?.trim()) payload.districtCode = districtCode;

    try {
      const response = await fetch(
        apiUrl() + "appointment/reserve-appointment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const data = await response.json();
        dispatch(
          setSelectedAppointment({
            appointmentDate: selectedAppointment.appointmentDate,
            appointmentStartTime: selectedAppointment.appointmentStartTime,
            appointmentEndTime: selectedAppointment.appointmentEndTime,
            appointmentTimeSlot:
              selectedAppointment.appointmentTimeSlot ||
              selectedAppointment.appointmentTimeslot,
            supplierAppointmentId: data.data.supplierAppointmentId,
          })
        );

        navigate("/createorder", { replace: true });
      } else {
        alert("Failed to reserve appointment!");
      }
    } catch (error) {
      alert("Error while reserving appointment!");
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
                <Header className="bg-white flex flex-col items-start px-10 py-6 shadow-md z-10">
                  <Title level={2} className="font-lexend-deca">
                    Select Appointment
                  </Title>
                </Header>

                <Content className="p-6 mt-6">
                  <div className="mt-2 shadow-md max-w-5xl bg-white p-4 rounded-lg h-[450px] overflow-y-scroll border rounded-md">
                    <Radio.Group
                      onChange={handleSelect}
                      value={selectedAppointment}
                      className="space-y-4 w-full"
                    >
                      {appointments.length > 0 ? (
                        appointments.map((appointment, index) => (
                          <div
                            key={index}
                            className={`p-4 rounded-lg shadow-md cursor-pointer ${
                              selectedAppointment === appointment
                                ? "bg-green-300"
                                : index % 2 === 0
                                ? "bg-gray-100"
                                : "bg-white"
                            } hover:bg-green-200 transition`}
                          >
                            <Radio value={appointment} className="w-full">
                              {appointment.appointmentDate} |{" "}
                              {appointment.appointmentStartTime} -{" "}
                              {appointment.appointmentEndTime}
                            </Radio>
                          </div>
                        ))
                      ) : (
                        <Text>No available appointments.</Text>
                      )}
                    </Radio.Group>
                  </div>
                </Content>

                <Footer className="bg-gray-100 mt-6 flex justify-between border-t py-4 w-full text-center">
                  <Button
                    className="bg-[#5664F5] hover:bg-[#28A745] text-white px-12 py-3 rounded-lg"
                    onClick={() => navigate(-1)}
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    className={`bg-[#28A745] hover:bg-[#5664F5] text-white px-12 py-3 rounded-lg ${
                      loading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={loading}
                  >
                    Confirm
                  </Button>
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

export default Appoint;

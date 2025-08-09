import React, { useState } from "react";
import { Tabs } from "antd";
import EditContactForm from "./EditContactForm";
import EditAppointmentForm from "./EditAppointmentForm";
import Modify from "./Modify";

const EditOrder = ({ orderId }) => {
  const [activeTab, setActiveTab] = useState("contact");

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 max-w-2xl mx-auto mt-4">
      <Tabs activeKey={activeTab} onChange={handleTabChange} centered>
        <Tabs.TabPane tab="Edit Contact" key="contact">
          <EditContactForm orderId={orderId} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Edit Appointment" key="appointment">
          <EditAppointmentForm orderId={orderId} />
        </Tabs.TabPane>

        <Tabs.TabPane tab="Modify" key="modify">
          <Modify orderId={orderId} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default EditOrder;

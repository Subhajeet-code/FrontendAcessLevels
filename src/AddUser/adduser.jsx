import React, { useState, useEffect } from "react";
import {
  Layout,
  Tabs,
  Table,
  Button as AntButton,
  Popconfirm,
  message,
  Tag,
  Spin,
  Modal,
} from "antd";
import { apiUrl } from "../utils/utils";
import Sidebar from "../Customer Portal/Sidebar";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { FiEye, FiEyeOff } from "react-icons/fi";
const { TabPane } = Tabs;

const InputField = ({ placeholder, type = "text", value, onChange }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="w-full h-14 px-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-['Lexend_Deca'] placeholder:text-[#6787BC] mb-2"
  />
);

const Text = ({ text }) => (
  <div className="text-gray-600 text-sm font-['Lexend_Deca'] mb-1">{text}</div>
);

const SubmitButton = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full h-14 rounded-lg mt-6 bg-[#28A745] hover:bg-green-600 text-white text-sm font-semibold"
  >
    {label}
  </button>
);

const AddUser = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [tabLoading, setTabLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("1");
  const [show, setShow] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editUserId, setEditUserId] = useState(null);

  useEffect(() => {
    getAllRoles();
    getAllUsers();
  }, []);

  const isValidEmail = (email) =>
    /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email);

  const getAllRoles = async () => {
    try {
      const response = await fetch(apiUrl() + "user/getRoles");
      const result = await response.json();
      setRoles(result.dropdownRoles || []);
    } catch {
      toast.error("Failed to fetch roles.");
    }
  };

  const getAllUsers = async () => {
    setTabLoading(true);
    try {
      const response = await fetch(apiUrl() + "user/getUsersAddedByAdmin");
      const result = await response.json();
      if (result.success) setUsers(result.users || []);
    } catch (err) {
      toast.error("Failed to fetch users.");
    }
    setTabLoading(false);
  };

  const handleSignUp = async () => {
    if (!role) return toast.error("Please select a role");
    if (!isValidEmail(email))
      return toast.error("Enter a valid email address.");
    setLoading(true);
    try {
      const response = await fetch(apiUrl() + "user/userRegister", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          user_type_id: role,
          created_by: "Admin",
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("User created successfully!");
        setEmail("");
        setPassword("");
        setRole("");
        getAllUsers();
        setActiveTab("2");
      } else {
        toast.error(data.message || "Failed to create user.");
      }
    } catch {
      toast.error("Something went wrong!");
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(apiUrl() + "user/deleteUser", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await response.json();
      if (data.success) {
        message.success("User deleted successfully.");
        getAllUsers();
      } else {
        message.error(data.message || "Delete failed.");
      }
    } catch {
      message.error("Error occurred while deleting.");
    }
  };

  const handleUpdateUser = async (id, user_type_id) => {
    try {
      const res = await fetch(apiUrl() + `user/userUpdate`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, user_type_id: role }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: data.message,
        });
        getAllUsers();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message || "Something went wrong.",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to update user.",
      });
    }
  };

  const columns = [
    {
      title: "Email",
      dataIndex: "user_email",
      key: "email",
    },
    {
      title: "Role ID",
      dataIndex: "user_type_id",
      key: "role",
      render: (role) => <Tag color="blue">#{role}</Tag>,
    },
     {
      title: "Role Name",
      dataIndex: "user_type_name",
      key: "roleName",
      render: (role) => <Tag color="green">{role}</Tag>,
    },
    {
      title: "Registered On",
      dataIndex: "date_of_registration",
      key: "date",
      render: (text) => new Date(text).toLocaleDateString("en-IN"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <AntButton
            type="link"
            onClick={() => {
              setEditUserId(record.id);
              setEmail(record.user_email);
              setPassword(record.password);
              setRole(record.user_type_id);
              setIsModalVisible(true);
            }}
          >
            Edit
          </AntButton>

          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <AntButton danger type="link">
              Delete
            </AntButton>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <>
      <Layout className="min-h-screen">
        <ToastContainer />
        <Layout hasSider>
          <Sidebar />
          <Layout className="p-6">
            <Tabs
              activeKey={activeTab}
              onChange={(key) => setActiveTab(key)}
              centered
            >
              <TabPane tab="Create User" key="1">
                <div className="max-w-lg mx-auto mt-4">
                  <Text text="Email ID" />
                  <InputField
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Text text="Password" />
                  <div className="relative">
                    <InputField
                      type={show ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                      onClick={() => setShow(!show)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-gray-500"
                    >
                      {show ? <FiEye size={18} /> : <FiEyeOff size={18} />}
                    </span>
                  </div>
                  <Text text="Role" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full h-14 px-2 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm mb-4"
                  >
                    <option value="">Select Role</option>
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>

                  <SubmitButton
                    label={loading ? "Creating..." : "Create User"}
                    onClick={handleSignUp}
                  />
                </div>
              </TabPane>

              <TabPane tab="User List" key="2">
                <Spin spinning={tabLoading}>
                  <Table
                    dataSource={users}
                    rowKey="id"
                    columns={columns}
                    pagination={{ pageSize: 5 }}
                  />
                </Spin>
              </TabPane>
            </Tabs>
          </Layout>
        </Layout>
      </Layout>
      <Modal
        title="Edit User"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={() => {
          handleUpdateUser(editUserId, role);
          setIsModalVisible(false);
        }}
      >
        <Text text="Email ID" />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-14 px-2 border border-gray-300 rounded-lg mb-2"
          disabled
        />
        <Text text="Role" />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full h-14 px-2 border border-gray-300 rounded-lg"
        >
          <option value="">Select Role</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>
      </Modal>
    </>
  );
};

export default AddUser;

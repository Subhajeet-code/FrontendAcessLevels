import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../utils/utils";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const IconComponent = () => (
  <svg
    className="text-[#28A745] w-24 h-22 mx-auto mb-6"
    viewBox="0 0 640 512"
    fill="currentColor"
  >
    <path d="M400 0C426.5 0 448 21.49 448 48V144C448 170.5 426.5 192 400 192H352V224H608C625.7 224 640 238.3 640 256C640 273.7 625.7 288 608 288H512V320H560C586.5 320 608 341.5 608 368V464C608 490.5 586.5 512 560 512H400C373.5 512 352 490.5 352 464V368C352 341.5 373.5 320 400 320H448V288H192V320H240C266.5 320 288 341.5 288 368V464C288 490.5 266.5 512 240 512H80C53.49 512 32 490.5 32 464V368C32 341.5 53.49 320 80 320H128V288H32C14.33 288 0 273.7 0 256C0 238.3 14.33 224 32 224H288V192H240C213.5 192 192 170.5 192 144V48C192 21.49 213.5 0 240 0H400zM256 64V128H384V64H256zM224 448V384H96V448H224zM416 384V448H544V384H416z" />
  </svg>
);

const InputField = ({ placeholder, type = "text", value, onChange }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="w-full h-14 px-2 border border-gray-300 rounded-lg bg-white text-gray-500 text-sm font-['Lexend_Deca'] placeholder:text-[#6787BC] mb-2"
  />
);

const Text = ({ text }) => (
  <div className="text-gray-400 text-sm lg:text-[16px] font-['Lexend_Deca'] text-left font-regular leading-6 mb-1">
    {text}
  </div>
);

const Button = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="w-full h-14 rounded-lg btn mt-10 bg-[#28A745] hover:bg-green-700 text-white text-sm font-['Lexend_Deca'] leading-4 transition"
  >
    {label}
  </button>
);

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [roles, setRoles] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    getAllRoles();
  }, []);

  const isValidEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleSignUp = async () => {
    if (!role) {
      toast.error("Please select a role");
      return;
    }
    if (!isValidEmail(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(apiUrl() + "user/userRegister", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, user_type_id: role }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success("Account created successfully!", { autoClose: 2000 });
        setTimeout(() => {
          navigate("/");
          setLoading(false);
        }, 3000);
      } else {
        toast.error(data.message || "Registration failed.");
        setLoading(false);
      }
    } catch (err) {
      toast.error("Something went wrong. Try again!");
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSignUp();
  };

  const getAllRoles = async () => {
    const response = await fetch(apiUrl() + "user/getRoles", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const result = await response.json();
    setRoles(result.dropdownRoles || []);
  };

  return (
    <div className="flex justify-center items-center">
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
      />
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-[#5664F5] rounded-full animate-spin"></div>
        </div>
      )}
      <div className="w-full sm:w-3/4 md:w-2/3 lg:max-w-xl mx-auto mt-12 text-center p-6 bg-white">
        <div className="text-center mb-6">
          <IconComponent />
          <div className="text-left">
            <p className="text-gray-800 text-3xl sm:text-4xl font-bold py-2 font-lexend-deca">
              Create Your Account
            </p>
            <span className="font-lexend-deca font-regular text-sm lg:text-[16px]">
              Join Broadband Buddy & stay connected
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Text text="Email ID" />
            <InputField
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Text text="Password" />
            <InputField
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <Text text="Role" />
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full h-14 px-2 border border-gray-300 rounded-lg bg-white text-gray-500 text-sm font-['Lexend_Deca'] "
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option value={role.id}>{role.name}</option>
              ))}
            </select>
          </div>

          <Button label="Create Account" />

          <div className="mt-6 text-sm text-gray-500">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/")}
              className="text-[#28A745] cursor-pointer hover:underline"
            >
              Log in here
            </span>
          </div>

          <div className="flex items-center justify-center space-x-2 mt-10">
            <img src="/assets/pop-logo.png" alt="Logo" className="w-6 h-auto" />
            <p className="text-gray-600 font-['Lexend_Deca']">
              Broadband Buddy A Pop Telecom Company
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpForm;

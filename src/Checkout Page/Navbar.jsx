import React from "react";
import { Input } from "antd";


const Navbar = () => {
  return (


    <div className="bg-white flex flex-col items-start px-10 py-6 shadow-md z-10 ">
  
      <div className="w-full ">
        <h1 className="text-2xl font-bold font-lexend-deca">Select Address</h1>


        <Input
          placeholder="Enter Postcode"
          className="w-72 h-14 px-2 mt-2 border border-gray-300 rounded-lg bg-white text-gray-500 text-sm font-['Lexend_Deca']  outline-none mb-4"
        />
         
          <p>Product retrieved successfully !</p>
         
    
      </div>

    </div>

  );
};

export default Navbar;

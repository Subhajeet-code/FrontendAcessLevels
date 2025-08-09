import React from "react";
import { Card, Button } from "antd";

const OrderInsights = () => {
  return (
    <div className="items-center justify-center bg-gray-100 p-6">
      <div className="bg-white rounded-lg shadow-lg w-full p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">#123457 Order Insights</h2>
      
          <button className="bg-[#CAFE9E] py-2 px-4  hover:bg-[#ADFF67 text-black rounded-lg transition-all">
          Close
        </button>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2  gap-4">
          {/* Customer Behavior Analysis */}
          <Card className="shadow-md bg-[#F0F0F5]">
            <h3 className="text-lg font-semibold mb-2">Customer Behavior Analysis</h3>
            <p className="font-medium">Order Journey Timeline:</p>
            <div className="flex justify-between gap-2 my-2">
              <span className="bg-[#CAFE9E] px-3 py-1 text-black rounded-md transition-all">Checkout (5 mins)</span>
              <span className="bg-[#CAFE9E] px-3 py-1 text-black rounded-md transition-all">Completed (2 mins)</span>
              <span className="bg-[#CAFE9E] px-3 py-1 text-black rounded-md transition-all">DD Setup (1 min)</span>
            </div>
            <p>Customer History:</p>
            <p>Previous Order: <span className="font-semibold">None</span></p>
            <p className="mt-2">AI-predicted Re-engagement Likelihood: <span className="text-green-600 font-semibold">75%</span></p>
          </Card>

          {/* Order Risk Assessment */}
          <Card className="shadow-md bg-[#F0F0F5]">
            <h3 className="text-lg font-semibold mb-2">Order Risk Assessment</h3>
            <p>Fraud Likelihood Score: <span className="text-green-600">Low</span></p>
            <p>Cancellation Probability: <span className="text-green-600">Low</span></p>
            <p className="mt-2">Risk Level: <span className="bg-[#219F4E] py-2 px-4  text-white rounded-md transition-all">Low</span></p>
          </Card>

          {/* Conversion Insights */}
          <Card className="shadow-md bg-[#F0F0F5]">
            <h3 className="text-lg font-semibold mb-2">Conversion Insights</h3>
            <p>Key Reasons for Completion: <span className="font-medium">Price, Discounted Installation</span></p>
            <p>Influence: <span className="font-medium">Sales</span></p>
            <p>Sales Member: <span className="text-green-600 font-semibold">Kevin</span></p>
          </Card>

          {/* Notes */} 
          <Card className="shadow-md bg-[#F0F0F5]">
            <h3 className="text-lg font-semibold mb-2">Notes</h3>
            <p>Customer is new and has issues with x, y, and z and requires extra attention.</p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OrderInsights;

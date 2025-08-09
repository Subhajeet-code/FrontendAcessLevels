import React from "react";
import { Card } from "antd";

const Recommendations = () => {
  return (
    <Card className="">
      <h3 className="text-lg font-bold mb-4">Actionable Recommendations</h3>
      <ul className="list-disc pl-4 text-gray-600 space-y-1">
        <li>Optimize Checkout Process</li>
        <li>Enhance Customer Engagement</li>
        <li>Improve Fulfillment Speed</li>
      </ul>
    </Card>
  );
};

export default Recommendations;

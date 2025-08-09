import React from "react";

const SupportSection = () => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6 flex flex-col md:flex-row justify-between items-center text-center md:text-left space-y-4 md:space-y-0">
      <div>
        <h3 className="font-bold font-lexend-deca text-lg">
          Broadband Buddy Support
        </h3>
        <p className="font-lexend-deca font-semibold">
          <div className="mb-2">Customer Pin: 1414</div>
        </p>
        <div className="mb-2">High St</div>
        <div className="mb-2">Ingatestone</div>
        <div className="mb-2">CM4 (DW)</div>
      </div>
      <div>
        <button className="w-full md:w-auto btn py-3 px-6 rounded-md bg-green-500 hover:bg-green-600 text-white transition">
          Raise Ticket
        </button>
      </div>
    </div>
  );
};

export default SupportSection;

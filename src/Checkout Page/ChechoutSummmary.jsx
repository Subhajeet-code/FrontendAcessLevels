import React from "react";
import { BiSolidPhoneCall } from "react-icons/bi";

const CheckoutSummary = () => {
    return (
        <div className="flex justify-between items-center bg-white shadow-md rounded-lg px-4"><div className=" p-6 mt-6 flex flex-col">
            <h3 className="font-bold font-lexend-deca text-lg mb-4">Checkout & Summary</h3>
            <p className="font-lexend-deca font-semibold mb-2">Provider: CityFibre</p>
            <div className="mb-2">Speed: 100 Mbps</div>
            <div className="mb-2">Monthly Cost: €29.99</div>
            <div className="mb-2">Setup Fee: €29.99</div>
            <div className="mb-2">Installation: €29.99</div>
            <div className="mb-4">Contract Length: 12 months</div>
            <div className="mb-4">🏆 Recommended Plan</div>  
<div className="mb-4">✅ Available in Your Area</div>

        </div>
            <div className="space-x-12 mt-4 flex ">
                <button className="btn py-4 text-[16px] px-8 rounded-lg hover:bg-[#28A745] text-white transition">
                    Checkout
                </button>
                <button className="py-4 px-8 text-[16px] rounded-lg bg-[#28A745] text-white flex items-center gap-2
                hover:bg-[#5664F5] transition">
                    <BiSolidPhoneCall size={20} /> 
                    Talk to an Expert
                </button>
            </div></div>
    );
};

export default CheckoutSummary;

import React from "react";
import { Card, Button } from "antd";

const providers = [
    {
        name: "CityFibre",
        speed: "100 Mbps",
        price: "€29.99/mo",
        bgColor: "bg-[#E6F3FF]",
        bgColor1: "bg-[#5B66F3]",
        textColor: "text-[#5B66F3]",
        btnColor: "bg-[#5B66F3] hover:bg-blue-700",
    },
    {
        name: "OpenReach",
        speed: "100 Mbps",
        price: "€29.99/mo",
        bgColor: "bg-green-100",
        textColor: "text-green-600",
        bgColor1: "bg-green-600",
        btnColor: "bg-green-600 hover:bg-green-700",
    },
    {
        name: "SOGEA",
        speed: "100 Mbps",
        price: "€29.99/mo",
        bgColor: "bg-purple-100",
        bgColor1: "bg-purple-600",
        textColor: "text-purple-600",
        btnColor: "bg-purple-600 hover:bg-purple-700",
    },
];

const CardSection = () => {
    return (
        <>
            <div className=" flex gap-6 p-6 ">
                {providers.map((provider, index) => (
                    <Card
                        key={index}
                        className={`rounded-lg shadow-md ${provider.bgColor} p-2  text-center`}
                    >
                        <div className="flex justify-center mb-4">
                            <div
                                className={`w-14 h-14 flex items-center justify-center rounded-full ${provider.textColor} ${provider.bgColor1}`}
                            >
                                <img src="/assets/white-logo.png" alt="" className="w-10" />
                            </div>
                        </div>
                        <h2 className={`text-lg font-bold ${provider.textColor}`}>
                            {provider.name}
                        </h2>
                        <p className="text-gray-600 mt-2">
  Best for: <span className="ml-1">🏠🎮🚀</span>
</p>

                        <p className="text-gray-800 font-semibold">
                            {provider.speed} - {provider.price}
                        </p>

                        <button className={`bg-green-600 w-full py-2 px-4 mt-4 ${provider.btnColor} rounded-md hover:bg-blue-600 text-white transition-all`}>
                            Select
                        </button>
                    </Card>
                ))}
            </div>



        </>

    );
};

export default CardSection;

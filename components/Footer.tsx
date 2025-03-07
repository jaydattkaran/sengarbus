import React from "react";

const Footer = () => {
  return <div className="flex flex-col-reverse md:flex-row md:px-0 px-4 md:gap-[30vw] gap-4 pt-20 pb-10">
    <div className="md:text-lg text-sm">Ⓒ 2025 SengarBus India Pvt Ltd. All rights reserved</div>
    <div className="flex flex-row gap-6">
        <div className="w-8 h-8 border-2"></div>
        <div className="w-8 h-8 border-2"></div>
        <div className="w-8 h-8 border-2"></div>
    </div>
  </div>;
};

export default Footer;

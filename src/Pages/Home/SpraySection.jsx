import React from "react";

import Heading from "../../assets/Sprayelem/Header.png"
import AmratDhara from "../../assets/Sprayelem/AmratDhara.png";
import ChakraBalance from "../../assets/Sprayelem/ChakraBalance.png";
import Maitri from "../../assets/Sprayelem/Maitri.png";
import Shuddhi from "../../assets/Sprayelem/Shuddhi.png";

const SpraySection = () => {
  return (
    <section className="relative w-full">
      {/* <h1 className="text-center text-3xl md:text-5xl font-light tracking-wider mt-12 mb-16 text-[#2F7C97]">
        Explore the Variety of
        <span className="block font-semibold mt-2">AURA SPRAYS</span>
      </h1> */}
      <img src={Heading} alt="" className="w-full" />
      <img src={AmratDhara} alt="" />
      <img src={ChakraBalance} alt="" className="w-full" />
      <img src={Maitri} alt="" className="w-full" />
      <img src={Shuddhi} alt="" className="w-full" />
    </section>
  );
};

export default SpraySection;

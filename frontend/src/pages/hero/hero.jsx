import React from "react";
import InputBox from "../../components/InputBox";

const Hero = () => {
  return (
    <div>
      <h1>Hello this is EMS</h1>
      <InputBox
        LabelName="Enter detail to search"
        Placeholder="Enter Details"
      />
    </div>
  );
};

export default Hero;

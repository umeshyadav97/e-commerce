import React from "react";

import CheckboxOnImage from "./assets/Checkbox-Active.svg";
import CheckboxOffImage from "./assets/Checbox-Inactive.svg";

const Checkbox = ({ isOn = false, style = {}, onToggle }) => {
  return (
    <div
      onClick={onToggle}
      style={{
        ...style,
      }}
      className="cursor-pointer"
    >
      <img
        src={isOn ? CheckboxOnImage : CheckboxOffImage}
        alt="check"
        style={{ marginRight: 14, height: 24, width: 24 }}
      />
    </div>
  );
};

export default Checkbox;

import React from "react";
import SwtichOnImage from "./assets/password-switch-on.svg";
import SwtichOffImage from "./assets/password-switch-off.svg";

const Switch = ({ isOn = false, label = "", style = {}, onToggle }) => {
  return (
    <div
      onClick={onToggle}
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        cursor: "pointer",
        userSelect: "none",
        ...style,
      }}
    >
      <img
        src={isOn ? SwtichOnImage : SwtichOffImage}
        alt="img"
        style={{ marginRight: 14 }}
      />
      <span className="c2">{label}</span>
    </div>
  );
};

export default Switch;

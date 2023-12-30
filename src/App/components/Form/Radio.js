import React, { useState, useEffect } from "react";
import { Typography } from "@material-ui/core";

import RadioOnImage from "./assets/radio-filled.svg";
import RadioOffImage from "./assets/radio-unfilled.svg";

const Radio = ({
  isOn = false,
  label = "",
  style = {},
  onToggle = () => {},
}) => {
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    setEnabled(isOn);
  }, [isOn]);
  return (
    <div
      onClick={() => {
        onToggle();
      }}
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
        src={enabled ? RadioOnImage : RadioOffImage}
        alt="img"
        style={{ marginRight: 14, height: 20, width: 20 }}
      />
      <Typography variant="body2">{label}</Typography>
    </div>
  );
};

export default Radio;

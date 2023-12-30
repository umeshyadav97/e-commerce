import React from "react";
import { Typography } from "@material-ui/core";
import CheckboxEnabled from "../../../assets/icons/checkbox_round_filled.svg";
import CheckboxDisabled from "../../../assets/icons/checkbox_disable_round.svg";

const Checkbox = ({ isOn = false, label = "", style = {}, onToggle }) => {
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
        src={isOn ? CheckboxEnabled : CheckboxDisabled}
        alt="img"
        style={{ height: 22, width: 22 }}
      />
      <Typography variant="body2">{label}</Typography>
    </div>
  );
};

export default Checkbox;

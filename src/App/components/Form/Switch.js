/* eslint-disable react/jsx-no-target-blank */
import React, { useState } from "react";

import SwitchOnImage from "./assets/switch-on.svg";
import SwitchOffImage from "./assets/switch-off.svg";

const Switch = ({
  label1 = "",
  label2 = "",
  label3 = "",
  label4 = "",
  style = {},
  switchOnClick,
  switchOffClick,
}) => {
  const [on, setIsOn] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        color: "#708099",
        fontSize: "14px",
        marginTop: "12px",
        marginBottom: "60px",
        userSelect: "none",
        ...style,
      }}
    >
      <div
        style={{
          height: "24px",
          width: "41px",
          marginRight: 12,
          cursor: "pointer",
        }}
      >
        <img
          src={on ? SwitchOnImage : SwitchOffImage}
          alt="switch"
          onClick={() => {
            setIsOn(!on);
            on ? switchOffClick() : switchOnClick();
          }}
        />
      </div>
      <span>
        {label1}
        <a
          target="_blank"
          href={`/terms-and-conditions-customers`}
          style={{
            color: "#242424",
            fontWeight: 600,
            textDecoration: "none",
          }}
        >
          {label2}
        </a>
        {label3}
        <span style={{ color: "#242424", fontWeight: 600 }}>
          <a
            target="_blank"
            href={`/privacy-policy-customers`}
            style={{
              color: "#242424",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            {label4}
          </a>
        </span>
      </span>
    </div>
  );
};

export default Switch;

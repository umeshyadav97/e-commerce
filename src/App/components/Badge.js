import React from "react";

const Badge = ({ count, children, style }) => {
  return (
    <div style={{ display: "flex", ...style }}>
      <div>{children}</div>
      <div
        style={{
          alignSelf: "flex-start",
          marginLeft: 6,
          backgroundColor: "#E7E8ED",
          padding: "0px 10px",
          borderRadius: 9.5,
        }}
      >
        <span className="label" style={{ padding: 0 }}>
          {count}
        </span>
      </div>
    </div>
  );
};

export default Badge;

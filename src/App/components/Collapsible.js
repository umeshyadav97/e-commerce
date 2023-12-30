import React, { useState } from "react";
import IconButton from "@material-ui/core/IconButton";
import ArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import ArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";

const Collapsible = ({ title, children }) => {
  const [open, setIsOpen] = useState(false);
  return (
    <div
      style={{
        backgroundColor: "#F9F9FA",
        borderRadius: 12,
        padding: 14,
        marginBottom: 20,
      }}
    >
      <div
        className="row-between cursor-pointer"
        onClick={() => setIsOpen(!open)}
      >
        <span className="c1">{title}</span>
        <IconButton onClick={() => setIsOpen(!open)}>
          {open ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </IconButton>
      </div>
      {open && (
        <div>
          <div
            style={{
              backgroundColor: "#E4E4ED",
              height: 1,
              width: "100%",
              marginBottom: 20,
            }}
          />
          <div>{children}</div>
        </div>
      )}
    </div>
  );
};

export default Collapsible;

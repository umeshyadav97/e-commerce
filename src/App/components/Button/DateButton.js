import React, { useState } from "react";
import { format } from "date-fns";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";

import { MuiPickersUtilsProvider, DatePicker } from "@material-ui/pickers";

const DateButton = ({ disabled = false, label, style, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        style={{
          backgroundColor: disabled ? "#EDECF5" : "#fff",
          borderRadius: 20,
          borderColor: disabled ? "transparent" : "rgba(186,0,177,0.8)",
          borderStyle: "solid",
          borderWidth: 1,
          padding: "10px 20px",
          textAlign: "center",
          display: "inline",
          ...style,
        }}
        className="c1 cursor-pointer"
        onClick={() => {
          if (!disabled) {
            setIsOpen(true);
          }
        }}
      >
        <span style={{ color: disabled ? "#82899B" : "#000" }}>{label}</span>
      </div>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <DatePicker
          variant="dialog"
          style={{ display: "none" }}
          open={isOpen}
          onClose={() => setIsOpen(false)}
          format="MMM dd, yyyy"
          value={label}
          onChange={(date) => {
            const formatteDate = format(date, "MMM dd, yyyy");
            onChange(formatteDate);
          }}
        />
      </MuiPickersUtilsProvider>
    </>
  );
};

export default DateButton;

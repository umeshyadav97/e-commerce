import React from "react";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { withStyles } from "@material-ui/core";

import CalendarIcon from "./assets/calendar.svg";

const StyledPicker = withStyles({
  root: {
    "& label.Mui-focused": {},
    "& .MuiOutlinedInput-root": {
      borderRadius: 27,
      borderColor: "#EDECF5",
      padding: "3px 3px",
    },
    minHeight: 80,
    fontSize: 13,
    lineHeight: 20 / 13,
    fontWeight: 500,
  },
})(KeyboardDatePicker);

const Datepicker = ({
  label,
  value,
  minDate = new Date(),
  maxDate = null,
  onChange,
  format = "MMM dd, yyyy",
  disablePast = true,
}) => {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <StyledPicker
        inputVariant="outlined"
        variant="dialog"
        label={label}
        format={format}
        value={value}
        onChange={onChange}
        autoOk
        disablePast={disablePast}
        minDate={minDate}
        maxDate={maxDate}
        minDateMessage="Please select a future date"
        fullWidth
        keyboardIcon={<img src={CalendarIcon} alt="cart" />}
      />
    </MuiPickersUtilsProvider>
  );
};

export default Datepicker;

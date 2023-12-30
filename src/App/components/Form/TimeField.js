import React, { useState } from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import FormHelperText from "@material-ui/core/FormHelperText";

import InputAdornment from "@material-ui/core/InputAdornment";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import { withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";

import { TimeSelection } from "../index";

import ClockIcon from "../../assets/icons/clock.svg";

const InputField = withStyles({
  root: {
    "& .MuiOutlinedInput-root": {
      borderRadius: 27,
      padding: "3px 3px",
      paddingRight: 20,
    },
    minHeight: 68,
    fontSize: 13,
    lineHeight: 20 / 13,
    fontWeight: 500,
  },
})(FormControl);

const TimeField = ({
  label,
  value = null,
  error,
  helperText,
  onChange,
  ...rest
}) => {
  const [time, setTime] = useState("");
  const [timePickerOpen, setTimePickerOpen] = useState(false);

  return (
    <>
      <InputField variant="outlined" {...rest}>
        <InputLabel htmlFor={label} error={error}>
          {label}
        </InputLabel>
        <OutlinedInput
          readOnly
          value={time}
          id={label}
          label={label}
          error={error}
          endAdornment={
            <InputAdornment position="end">
              <IconButton onClick={() => setTimePickerOpen(true)} edge="end">
                <img src={ClockIcon} alt="clock" style={{ height: 18, width: 18 }} />
              </IconButton>
            </InputAdornment>
          }
        />
        <FormHelperText id={label + "helper"} error={error}>
          {helperText}
        </FormHelperText>
      </InputField>
      <TimeSelection
        value={value}
        open={timePickerOpen}
        onChange={(time) => {
          setTime(time.formatted24);
          setTimePickerOpen(false);
          onChange(time.formatted24);
        }}
        handleClose={() => {
          setTimePickerOpen(false);
        }}
      />
    </>
  );
};

export default TimeField;

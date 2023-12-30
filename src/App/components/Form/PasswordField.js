import React, { useState, useEffect } from "react";
import FormControl from "@material-ui/core/FormControl";
import FormHelperText from "@material-ui/core/FormHelperText";

import InputAdornment from "@material-ui/core/InputAdornment";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import Visibility from "./assets/eye.svg";
import VisibilityOff from "./assets/eye-off.svg";

const InputField = withStyles({
  root: {
    "& .MuiOutlinedInput-root": {
      borderRadius: 7,
      padding: "3px 3px",
    },
    fontSize: 14,
    lineHeight: 20 / 13,
    fontWeight: 500,
  },
})(FormControl);

const useStyles = makeStyles(() => ({
  imageSrc: {
    height: "12px",
    width: "16px",
    marginRight: "12px",
    "&:hover": {
      background: "none",
    },
  },
}));

const PasswordField = ({
  handleChange,
  showPassword = false,
  label,
  placeholder,
  error,
  helperText,
  ...rest
}) => {
  const [isVisible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(showPassword);
  }, [showPassword]);

  const classes = useStyles();
  return (
    <InputField variant="outlined" {...rest}>
      {/* <InputLabel htmlFor={label} error={error}>
        {label}
      </InputLabel> */}
      <OutlinedInput
        id={label}
        type={isVisible ? "text" : "password"}
        onChange={handleChange}
        // label={label}
        placeholder={placeholder}
        error={error}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              aria-label="toggle password visibility"
              onClick={() => setVisible(!isVisible)}
              edge="end"
              className={classes.imageSrc}
            >
              {isVisible ? (
                <img src={VisibilityOff} alt="off" />
              ) : (
                <img src={Visibility} alt="on" />
              )}
            </IconButton>
          </InputAdornment>
        }
      />
      <FormHelperText id={label + "helper"} error={error}>
        {helperText}
      </FormHelperText>
    </InputField>
  );
};

export default PasswordField;

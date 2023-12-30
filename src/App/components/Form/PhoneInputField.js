import React from 'react';
import {
  OutlinedInput,
  FormControl,
  FormHelperText,
  withStyles,
} from '@material-ui/core';

const InputField = withStyles({
  root: {
    '& label.Mui-focused': {},
    '& .MuiOutlinedInput-root': {
      borderRadius: 8,
      padding: '3px 3px',
      paddingRight: 20,
    },
    fontSize: 14,
    fontWeight: 500,
  },
})(FormControl);

const PhoneInputField = ({
  label,
  error,
  onChange,
  helperText,
  placeholder,
  ...props
}) => (
  <InputField variant="outlined" {...props}>
    <OutlinedInput
      id={label}
      onChange={onChange}
      placeholder={placeholder}
      type="number"
      error={error}
      {...props}
    />
    <FormHelperText id={label + 'helper'} error={error}>
      {helperText}
    </FormHelperText>
  </InputField>
);

export default PhoneInputField;

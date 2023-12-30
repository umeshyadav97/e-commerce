import React from "react";
import { FormControl, InputLabel, MenuItem } from "@material-ui/core";

import { Select, withStyles } from "@material-ui/core";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = (fullWidth) => ({
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      minWidth: fullWidth ? "100%" : 220,
      borderRadius: 14,
      marginTop: ITEM_HEIGHT + 10,
      boxShadow:
        "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
    },
  },
});

const StyledSelect = withStyles({
  root: {
    "& .MuiOutlinedInput-root": {
      borderRadius: 27,
      borderColor: "#EDECF5",
    },
  },
})(Select);

const StyledMenu = withStyles({
  root: {
    "&:hover": {
      backgroundColor: "#EDECF5",
    },
    fontSize: 14,
    width: "100%",
  },
  selected: {
    backgroundColor: "#EDECF5 !important",
  },
})(MenuItem);

const CustomSelect = ({
  id,
  label,
  items = [],
  value,
  onChange,
  fullWidth,
  style,
}) => (
  <FormControl
    variant="outlined"
    fullWidth
    style={{ width: fullWidth ? "100%" : 240, ...style }}
  >
    <InputLabel id={id}>{label}</InputLabel>
    <StyledSelect
      labelId={id}
      label={label}
      fullWidth
      value={value}
      onChange={(e) => onChange && onChange(e.target.value)}
      MenuProps={() => MenuProps(fullWidth)}
    >
      {items.map((item, index) => (
        <StyledMenu value={item.value} key={index.toString()}>
          {item.label}
        </StyledMenu>
      ))}
      {items.length === 0 && (
        <StyledMenu disabled>No options available</StyledMenu>
      )}
    </StyledSelect>
  </FormControl>
);

export default CustomSelect;

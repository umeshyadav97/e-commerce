import React from "react";

import {
  FormControl,
  InputLabel,
  OutlinedInput,
  Select,
} from "@material-ui/core";

import { DropdownMenu } from "../index";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
      borderRadius: 20,
      marginTop: ITEM_HEIGHT + 10,
      boxShadow:
        "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
    },
  },
};

const MultiSelect = ({
  id,
  label,
  items,
  searchEnabled,
  searchPlaceholder,
  selectedItems,
  onSelect,
  style,
}) => {
  return (
    <FormControl variant="outlined" style={style} fullWidth>
      <InputLabel id={id}>{label}</InputLabel>
      <Select
        labelId={id}
        label={label}
        multiple
        value={selectedItems}
        input={
          <OutlinedInput
            label={label}
            style={{
              borderRadius: 27,
            }}
          />
        }
        renderValue={(selected) => {
          if (selected.length > 0) {
            if (selected.length === 1) {
              return selected[0].label;
            } else {
              return (
                <span>
                  {selected[0].label}{" "}
                  <span className="text-muted">
                    (+ {selected.length - 1} more)
                  </span>
                </span>
              );
            }
          }
        }}
        MenuProps={MenuProps}
      >
        <DropdownMenu
          items={items}
          selectedItems={selectedItems}
          onSelect={onSelect}
          searchEnabled={searchEnabled}
          searchPlaceholder={searchPlaceholder}
        />
      </Select>
    </FormControl>
  );
};

export default MultiSelect;
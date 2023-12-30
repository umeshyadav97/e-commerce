import React, { useEffect } from "react";

import {
  FormControl,
  Grid,
  InputLabel,
  OutlinedInput,
  Select,
  Typography,
} from "@material-ui/core";
import clsx from "clsx";
import styles from "../../pages/Dashboard/Dashboard.module.css";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/core/styles";

import DropdownMenuNoCheckbox from "./DropdownMenuNoCheckbox";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = (fullWidth) => ({
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 5.5 + ITEM_PADDING_TOP,
      minWidth: fullWidth ? "100%" : 250,
      borderRadius: 20,
      marginTop: ITEM_HEIGHT + 10,
      boxShadow:
        "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
    },
  },
});

const useStyles = makeStyles({
  icon: {
    color: "#242424",
  },
});

const SelectSearch = ({
  id,
  label,
  items,
  searchEnabled,
  searchPlaceholder,
  selectedItems,
  onSelect,
  style,
  onReset,
  ShowReset,
  Showcount,
  ShowValue,
  ShowSlider,
  SliderValue,
  SliderMin,
  SliderMax,
  SliderStep,
  SliderStartlabel,
  SliderEndlabel,
  SliderData,
  ShowSliderField,
  LabelClass,
  SlectItemcls,
  fullWidth,
}) => {
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const classes = useStyles();

  const handleOpen = () => {
    setOpen(true);
  };

  useEffect(() => {
    selectedItems !== "" && setOpen(false);
  }, [selectedItems]);
  return (
    <FormControl variant="outlined" style={style} fullWidth>
      <InputLabel
        id={id}
        style={{
          paddingLeft: "0px",
          color: "#242424",
          marginTop: "-6px",
        }}
        className={LabelClass ? LabelClass : ""}
        color="primary"
        shrink={false}
      >
        {typeof label === "string"
          ? label
          : label.map((lbl) =>
              lbl.length > 25 ? lbl.slice(0, 25) + "..." : lbl
            )}
      </InputLabel>
      <Select
        labelId={id}
        label={label}
        value={selectedItems}
        input={
          <OutlinedInput
            style={{
              borderRadius: 27,
            }}
          />
        }
        inputProps={{
          classes: {
            icon: classes.icon,
          },
        }}
        IconComponent={ExpandMoreIcon}
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        className={`${
          selectedItems?.length > 0
            ? clsx(
                styles.multiselectbackground,
                styles.MultiselectInputDesigner
              )
            : styles.MultiselectInputDesigner
        }`}
        renderValue={(selected) => {
          if (ShowValue) {
            if (selected.length > 0) {
              if (selected.length === 1) {
                return selected[0].label;
              } else {
                return (
                  <span>
                    {selected[0].label}{" "}
                    {/* <span className="text-muted">
                      (+ {selected.length - 1} more)
                    </span> */}
                  </span>
                );
              }
            }
          } else {
            if (Showcount && selected.length > 0) {
              return (
                <Grid container justify="center">
                  <Grid
                    style={{
                      width: 23,
                      height: 23,
                      borderRadius: 90,

                      marginRight: 30,
                    }}
                  >
                    <Typography style={{ marginLeft: -10 }}>
                      {/* {selectedItems.length > 0 ? set : ""} */}
                    </Typography>
                  </Grid>
                </Grid>
              );
            } else {
              return label;
            }
          }
        }}
        MenuProps={() => MenuProps(fullWidth)}
      >
        <DropdownMenuNoCheckbox
          items={items}
          selectedItems={selectedItems}
          onSelect={onSelect}
          searchEnabled={searchEnabled}
          searchPlaceholder={searchPlaceholder}
          onReset={onReset}
          ShowReset={ShowReset}
          ShowSlider={ShowSlider}
          SliderValue={SliderValue}
          SliderMin={SliderMin}
          SliderMax={SliderMax}
          SliderStep={SliderStep}
          SliderStartlabel={SliderStartlabel}
          SliderEndlabel={SliderEndlabel}
          SliderData={SliderData}
          ShowSliderField={ShowSliderField}
          SlectItemcls={SlectItemcls}
        />
      </Select>
    </FormControl>
  );
};

export default SelectSearch;

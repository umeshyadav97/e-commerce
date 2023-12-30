/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import clsx from "clsx";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { makeStyles } from "@material-ui/core/styles";

import {
  FormControl,
  Grid,
  InputLabel,
  OutlinedInput,
  Select,
  Typography,
} from "@material-ui/core";

import styles from "../../pages/Dashboard/Dashboard.module.css";

import { DropdownMenuCheckBox } from "../index";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 5.9 + ITEM_PADDING_TOP,
      width: 250,
      borderRadius: 20,
      marginTop: ITEM_HEIGHT + 10,
      boxShadow:
        "0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)",
    },
  },
};

const useStyles = makeStyles({
  icon: {
    color: "#242424"
  }
});

const MultiSelectCheckBox = ({
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
  isDesigner = false,
  ShowApplyClear,
  onApply,
}) => {
  const [Sliderchange, setSliderchange] = useState(false);
  const [Label, setLabel] = useState(label);
  const [open, setOpen] = React.useState(false);
  const handleClose = () => {
    setOpen(false);
  };
  const classes = useStyles();


  const handleOpen = () => {
    setOpen(true);
  };
  useEffect(() => {
    if (
      SliderValue &&
      SliderValue[0] === SliderMin &&
      SliderValue[1] === SliderMax
    ) {
      setLabel(label);
      setSliderchange(false);
    } else if (
      SliderValue &&
      (SliderValue[0] > SliderMin || SliderValue[1] < SliderMax)
    ) {
      setSliderchange(true);
    }
  }, [SliderValue]);
  return (
    <FormControl variant="outlined" style={style} fullWidth>
      <InputLabel
        id={id}
        style={{ paddingLeft: "0px", color: "#242424", marginTop: "-6px" }}
        className={LabelClass ? LabelClass : ""}
        color="primary"
        shrink={false}
      >
        {Label}
      </InputLabel>
      <Select
        labelId={id}
        label={label}
        multiple
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
            icon: classes.icon
          }
        }}
        IconComponent={ExpandMoreIcon}
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
        className={`${
          isDesigner === false
            ? ShowSlider
              ? Sliderchange
                ? clsx(styles.multiselectbackground, styles.MultiselectInput)
                : styles.MultiselectInput
              : selectedItems.length > 0
              ? clsx(styles.multiselectbackground, styles.MultiselectInput)
              : styles.MultiselectInput
            : selectedItems.length > 0
            ? clsx(
                styles.multiselectbackground,
                styles.MultiselectInputDesigner
              )
            : styles.MultiselectInputDesigner
        }`}
        renderValue={(selected) => {
          if (
            ShowSlider &&
            (selected[0].value > SliderMin || selected[1].value < SliderMax)
          ) {
            setLabel("");
            return (
              <Grid container justify="flex-end">
                <Grid
                  style={{
                    marginRight: "auto",
                  }}
                >
                  <Typography>
                    {`$${selected[0].value} - $${selected[1].value}`}
                  </Typography>
                </Grid>
              </Grid>
            );
          }
          if (ShowValue) {
            if (selected.length > 0) {
              if (selected.length === 1) {
                setLabel(selected[0].label);
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
          } else {
            if (Showcount && selected.length > 0 && !ShowSlider) {
              return (
                <Grid container justify="flex-end">
                  <Grid
                    style={{
                      width: selectedItems.length > 9 ? 27 : 23,
                      height: selectedItems.length > 9 ? 27 : 23,
                      borderRadius: 90,
                      background: "#FC68A2",
                      marginRight: 5,
                    }}
                  >
                    <Typography
                      style={{
                        marginLeft: selectedItems.length > 9 ? 5 : 7,
                        marginTop: selectedItems.length > 9 ? 3 : 0,
                      }}
                    >
                      {selectedItems.length > 0 ? selectedItems.length : ""}
                    </Typography>
                  </Grid>
                </Grid>
              );
            } else {
              if (!ShowSlider) {
                return label;
              }
            }
          }
        }}
        MenuProps={MenuProps}
      >
        <DropdownMenuCheckBox
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
          ShowApplyClear={ShowApplyClear}
          onApply={onApply}
          handleClose={handleClose}
        />
      </Select>
    </FormControl>
  );
};

export default MultiSelectCheckBox;

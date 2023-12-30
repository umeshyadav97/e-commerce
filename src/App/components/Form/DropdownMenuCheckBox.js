import React, { useState, useEffect } from "react";
import InputBase from "@material-ui/core/InputBase";

import Checkbox from "./Checkbox";

import SearchIcon from "./assets/search-line.svg";
import CrossIcon from "./assets/cross-icon.svg";
import SecondaryButton from "../Button/secondaryButton";
import { Divider, Grid } from "@material-ui/core";
import CustomSlider from "./Slider";
import PrimaryButton from "../Button/PrimaryButton";
import { capitalizeStr } from "../../../utils/textUtils";

const DropdownMenuCheckBox = ({
  items = [],
  searchEnabled,
  searchPlaceholder = "",
  selectedItems = [],
  onSelect,
  onReset,
  ShowReset,
  ShowSlider,
  SliderValue,
  SliderMax,
  SliderMin,
  SliderStep,
  SliderData,
  SliderStartlabel,
  SliderEndlabel,
  ShowSliderField,
  SlectItemcls,
  ShowApplyClear,
  onApply,
  handleClose,
}) => {
  const [query, setQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  useEffect(() => {
    setFilteredItems(
      items?.filter((item) =>
        item?.label.toLowerCase().includes(query?.toLowerCase())
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const onToggle = (value) => {
    let newSelectedItems = [];
    if (selectedItems.some((item) => item.value === value)) {
      // remove case
      newSelectedItems = selectedItems.filter((item) => item.value !== value);
    } else {
      //add case
      newSelectedItems = [...selectedItems].concat(
        items.filter((item) => item.value === value)
      );
    }
    if (onSelect) {
      onSelect(newSelectedItems);
    }
  };

  const onSliderChange = (min) => {
    if (onSelect) {
      onSelect(min);
    }
  };

  return (
    <div>
      {searchEnabled && (
        <div
          className="row-center"
          style={{
            height: 42,
          }}
        >
          <img
            src={SearchIcon}
            alt="search"
            style={{ marginLeft: 20, marginRight: 10 }}
          />
          <InputBase
            value={query}
            placeholder={searchPlaceholder}
            onChange={(e) => setQuery(e.target.value)}
            fullWidth
            style={{
              fontSize: 13,
              lineHeight: 20 / 13,
              fontWeight: 500,
            }}
          />
          {query !== "" && (
            <div
              onClick={() => {
                setQuery("");
              }}
              className="cursor-pointer"
            >
              <img
                src={CrossIcon}
                alt="cross"
                style={{ marginBottom: -5, marginRight: 20 }}
              />
            </div>
          )}
        </div>
      )}
      {ShowSlider ? (
        <Grid item xs={10} style={{ marginTop: "2em", marginLeft: "15px" }}>
          <CustomSlider
            SliderValue={SliderValue}
            SliderMax={SliderMax}
            SliderMin={SliderMin}
            SliderStep={SliderStep}
            SliderData={SliderData}
            SliderStartlabel={SliderStartlabel}
            SliderEndlabel={SliderEndlabel}
            ShowSliderField={ShowSliderField}
            onToggle={onSliderChange}
          />
        </Grid>
      ) : filteredItems.length > 0 ? (
        filteredItems.map((item) => (
          <div
            key={item.value}
            className="row-center cursor-pointer"
            onClick={() => onToggle(item.value)}
            style={{ padding: 10, borderTop: "solid 1px #F2F2F7" }}
          >
            <Checkbox
              isOn={selectedItems
                .map((item) => item.value)
                .includes(item.value)}
              style={{ marginRight: 10 }}
            />
            <span
              className={SlectItemcls ? SlectItemcls : "c1"}
              style={{ marginTop: -4 }}
            >
              {capitalizeStr(item.label)}
            </span>
            {item?.hexcode && (
              <Grid container justify="flex-end" style={{ marginRight: "1em" }}>
                <span className="c1" style={{ marginTop: -4 }}>
                  <div
                    style={{
                      border: "1px solid #A4B3CC",
                      borderRadius: "12px",
                      height: "22px",
                      width: "22px",
                      background: `${item.hexcode}`,
                    }}
                  ></div>
                </span>
              </Grid>
            )}
          </div>
        ))
      ) : (
        <div
          className="row-center cursor-pointer"
          style={{ padding: 10, borderTop: "solid 1px #F2F2F7" }}
        >
          <Grid container justify="flex-start" style={{ marginRight: "1em" }}>
            <span
              className={SlectItemcls ? SlectItemcls : "c1"}
              style={{ marginTop: -4 }}
            >
              <div
                style={{
                  whiteSpace: "nowrap",
                  height: "22px",
                  width: "22px",
                }}
              >
                No Data Found{" "}
              </div>
            </span>
          </Grid>
        </div>
      )}
      {ShowReset && (
        <Grid>
          <Divider />
          <Grid container justify="flex-end">
            <SecondaryButton
              style={{
                marginRight: "25px",
                marginBottom: "10px",
                marginTop: "15px",
                minWidth: "100px",
              }}
              onClick={onReset}
            >
              Reset
            </SecondaryButton>
          </Grid>
        </Grid>
      )}
      {ShowApplyClear && (
        <Grid>
          <Divider />
          <Grid container justify="flex-end">
            <SecondaryButton
              style={{
                marginRight: "20px",
                marginBottom: "10px",
                marginTop: "15px",
                minWidth: "100px",
              }}
              onClick={onReset}
            >
              Clear
            </SecondaryButton>
            <PrimaryButton
              style={{
                marginRight: "15px",
                marginBottom: "10px",
                marginTop: "15px",
                minWidth: "100px",
              }}
              onClick={() => {
                onApply();
                handleClose();
              }}
            >
              Apply
            </PrimaryButton>
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default DropdownMenuCheckBox;

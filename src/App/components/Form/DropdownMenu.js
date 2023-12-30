import React, { useState, useEffect } from "react";
import InputBase from "@material-ui/core/InputBase";

import Checkbox from "./Checkbox";

import SearchIcon from "./assets/search-line.svg";
import CrossIcon from "./assets/cross-icon.svg";

const DropdownMenu = ({
  items = [],
  searchEnabled,
  searchPlaceholder = "",
  selectedItems = [],
  onSelect,
}) => {
  const [query, setQuery] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    setFilteredItems(items);
  }, [items]);

  useEffect(() => {
    setFilteredItems(
      items.filter((item) =>
        item.label.toLowerCase().includes(query.toLowerCase())
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

  return (
    <div>
      {searchEnabled && (
        <div
          className="row-center"
          style={{
            height: 42,
          }}
        >
          <img src={SearchIcon} alt="search" style={{ marginLeft: 20, marginRight: 10 }} />
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
                style={{ marginBottom: -5, marginRight: 10 }}
              />
            </div>
          )}
        </div>
      )}
      {filteredItems.map((item) => (
        <div
          key={item.value}
          className="row-center cursor-pointer"
          onClick={() => onToggle(item.value)}
          style={{ padding: 10, borderTop: "solid 1px #F2F2F7" }}
        >
          <Checkbox
            isOn={selectedItems.map((item) => item.value).includes(item.value)}
            style={{ marginRight: 10 }}
          />
          <span className="c1" style={{ marginTop: -4 }}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

export default DropdownMenu;
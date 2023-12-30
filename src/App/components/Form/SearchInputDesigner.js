import React, { useEffect, useState } from "react";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "./assets/search.svg";
import CrossIcon from "./assets/cross-icon.svg";

const SearchInputDesigner = ({
  value,
  onChange,
  onClose,
  placeholder,
  style,
}) => {
  const [closeBtn, setcloseBtn] = useState(false);

  useEffect(() => {
    if (value?.length >= 1) {
      setcloseBtn(true);
    } else {
      setcloseBtn(false);
    }
  }, [value]); 

  return (
    <div style={style}>
      <div
        className="row-center"
        style={{
          borderRadius: 8,
          border: "1.4px solid #DFE7F5",
          height: 42,
          backgroundColor: "#F4F7FD",
          color: "#A4B3CC",
          paddingLeft: "15px",
          paddingRight: "15px",
        }}
      >
        <InputBase
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={{
            fontSize: 13,
            lineHeight: 20 / 13,
            fontWeight: 500,
          }}
        />

        {closeBtn ? (
          <div
            onClick={() => {
              setcloseBtn(false);

              if (onClose) {
                onClose();
              }
            }}
            className="cursor-pointer"
          >
            <img
              src={CrossIcon}
              alt="cross"
              style={{ marginBottom: -5, marginRight: 10 }}
            />
          </div>
        ) : (
          ""
        )}
        <div
          className="cursor-pointer row-center"
        >
          <img src={SearchIcon} alt="search" />
        </div>
      </div>
    </div>
  );
};

export default SearchInputDesigner;

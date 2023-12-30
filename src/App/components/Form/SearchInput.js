import React, { useEffect, useState } from "react";
import InputBase from "@material-ui/core/InputBase";
import SearchIcon from "./assets/search.svg";
import CrossIcon from "./assets/cross-icon.svg";

const SearchInput = ({
  value,
  onChange,
  onClose,
  placeholder,
  style,
  is_input_open,
}) => {
  const [isInputOpen, setIsInputOpen] = useState(is_input_open);
  const [closeBtn, setcloseBtn] = useState(false);

  useEffect(() => {
    setIsInputOpen(is_input_open);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (value?.length >= 1) {
      setcloseBtn(true);
    } else {
      setcloseBtn(false);
    }
  }, [value]);

  useEffect(() => {
    setIsInputOpen(is_input_open);
  }, [is_input_open]);
  return (
    <div
      onClick={() => {
        setIsInputOpen(true);
      }}
      className=" cursor-pointer row-center"
      style={
        style
          ? style
          : {
              borderRadius: 8,
              border: "1.4px solid #DFE7F5",
              height: 42,
              backgroundColor: "#F4F7FD",
              color: "#A4B3CC",
              paddingLeft: "15px",
              paddingRight: "15px",
            }
      }
    >
      <div
        onClick={() => {
          setIsInputOpen(true);
        }}
        className="cursor-pointer row-center"
      >
        <img src={SearchIcon} alt="search" />
      </div>
      {isInputOpen ? (
        <InputBase
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          style={{
            fontSize: 14,
            lineHeight: 20 / 13,
            fontWeight: 500,
            marginLeft: "5px",
            backgroundColor: "#F4F7FD",
          }}
        />
      ) : (
        ""
      )}

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
            alt="cross"
            src={CrossIcon}
            style={{ marginBottom: -5, marginLeft: 5 }}
          />
        </div>
      ) : null}
    </div>
  );
};

export default SearchInput;

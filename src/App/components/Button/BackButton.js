import React from "react";

import BackIcon from "../../assets/icons/Back.svg";

const BackButton = ({ onClick }) => {
  return (
    <div onClick={onClick} className="cursor-pointer">
      <img src={BackIcon} alt="back" style={{ marginRight: 14 }} />
    </div>
  );
};

export default BackButton;

import React from "react";
import ViewIcon from "../../assets/icons/view.svg";

const ViewButton = ({ onClick, style }) => {
  return (
    <div onClick={onClick} style={style} className="cursor-pointer">
      <img src={ViewIcon} alt="view" />
    </div>
  );
};

export default ViewButton;

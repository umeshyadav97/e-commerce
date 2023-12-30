import React from "react";

import DeleteIcon from "../../assets/icons/delete-round.svg";

const DeleteButton = ({ onClick, style }) => {
  return (
    <div style={{ ...style }} className="cursor-pointer">
      <img src={DeleteIcon} alt="delete" onClick={onClick} />
    </div>
  );
};

export default DeleteButton;

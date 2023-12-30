import React from 'react';

const ChipButton = ({
  color,
  textColor = 'black',
  outlineColor = 'transparent',
  fontFamily = 'Inter Regular',
  fontSize = 14,
  label,
  style,
  onClick,
}) => (
  <div
    style={{
      backgroundColor: color || '#FFF0C1',
      borderRadius: 19,
      fontFamily: fontFamily,
      fontSize: fontSize,
      borderColor: outlineColor || '#FFF0C1',
      borderStyle: 'solid',
      borderWidth: 1,
      width: 147,
      padding: '7px 33px',
      textAlign: 'center',
      display: 'inline',
      ...style,
    }}
    className="c1 cursor-pointer"
    onClick={onClick}
  >
    <span style={{ color: textColor }}>{label}</span>
  </div>
);

export default ChipButton;

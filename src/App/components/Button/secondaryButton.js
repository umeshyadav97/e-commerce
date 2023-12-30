import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const secondaryButton = withStyles(() => ({
  root: ({ isDisabled, wide, sizeFlag, style }) => ({
    color: isDisabled ? "#050D33" : "black",
    background: isDisabled ? "#EFEFF4" : "white",
    borderRadius: 8,
    border: "2px solid #242424",
    fontFamily: "Inter SemiBold",
    fontWeight: 600,
    fontSize: sizeFlag ? "18px" : "16px",
    minWidth: wide ? 122 : 186,
    minHeight: 48,
    boxShadow: "none",
    "&:hover, &:focus": {
      background: "#242424",
      color: "#ffffff",
    },
    ...style,
  }),
}))(Button);

export default secondaryButton;

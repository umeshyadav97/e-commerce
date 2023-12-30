import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const PrimaryButton = withStyles(() => ({
  root: ({ isDisabled, wide, sizeFlag, mid, style }) => ({
    color: isDisabled ? "#A4B3CC" : "white",
    background: isDisabled ? "#DFE7F5" : "#FC68A2",
    borderRadius: 8,
    fontFamily: "Inter SemiBold",
    fontWeight: 600,
    fontSize: sizeFlag ? "18px" : "16px",
    minWidth: wide ? 186 : mid ? 150 : "unset",
    minHeight: 48,
    "&:hover": {
      background: isDisabled ? "#DFE7F5" : "#F55393",
      boxShadow: "0 0 15px 0 rgba(0,0,0,0.22)",
    },
    ...style,
  }),
}))(Button);

export default PrimaryButton;

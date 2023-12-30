import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const OutlinedPrimaryButton = withStyles(() => ({
  root: ({  wide, style, issecondary = false }) => ({
    color: issecondary ? "#242424": "#FC68A2",
    background: "#FFFFFF" ,
    border: issecondary ? "2px solid #242424" : "2px solid #FC68A2",
    borderRadius: 8,
    minWidth: wide ? 186 : "unset",
    minHeight: 48,
    "&:hover": {
      backgroundColor: issecondary ? "#242424": "#FC68A2",
      color: "white",
      boxShadow: "0 0 15px 0 rgba(0,0,0,0.22)",
    },
    ...style,
  }),
}))(Button);

export default OutlinedPrimaryButton;

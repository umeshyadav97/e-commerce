import { TextField, withStyles } from "@material-ui/core";

const InputField = withStyles({
  root: (props) => ({
    "& .MuiOutlinedInput-root": {
      borderRadius: 8,
      border: "1px solid #DFE7F5",
      paddingLeft: "8px",
    },
    "& .MuiFormHelperText-root": {
      textAlign: props.helpertextright ? "right" : "left",
      fontFamily: "Inter Medium",
      fontSize: 14,
      color: "#F36666",
    },
    "&::placeholder": {
      color: "red",
    },
    fontSize: 14,
    lineHeight: 20 / 13,
    fontWeight: 500,
  }),
})(TextField);
export default InputField;

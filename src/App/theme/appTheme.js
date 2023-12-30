import { createMuiTheme } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "rgba(186,0,177,0.8)",
    },
    secondary: {
      main: "#FD2B88",
    },
    error: {
      main: "#FF0040",
    },
    background: {
      default: "#09092D",
    },
  },
  typography: {
    h1: {
      fontFamily: "Inter Bold",
      fontSize: 54,
      lineHeight: 74 / 34,
      fontWeight: 600,
    },
    h2: {
      fontFamily: "Inter SemiBold",
      fontSize: 46,
      lineHeight: 68 / 30,
      fontWeight: 600,
    },
    h3: {
      fontFamily: "Inter SemiBold",
      fontSize: 32,
      lineHeight: 48 / 26,
      fontWeight: 600,
    },
    h4: {
      fontFamily: "Inter",
      fontSize: 24,
      lineHeight: 40/ 24,
      fontWeight: 400,
    },
    h5: {
      fontFamily: "Inter",
      fontSize: 18,
      lineHeight: 24 / 18,
      fontWeight: 400,
    },
    h6: {
      fontFamily: "Inter",
      fontSize: 14,
      lineHeight: 24 / 20,
      fontWeight: 500,
    },
    p1: {
      fontSize: 16,
      lineHeight: 24 / 15,
      fontWeight: 500,
    },
    p2: {
      fontSize: 16,
      lineHeight: 22 / 14,
      fontWeight: 400,
    },
    button: {
      fontSize: 14,
      lineHeight: 18 / 13,
      letterSpacing: 0.2,
      fontWeight: 700,
      textTransform: "unset",
    },
    c1: {
      fontSize: 13,
      lineHeight: 20 / 13,
      fontWeight: 500,
    },
    c2: {
      fontSize: 12,
      lineHeight: 17 / 12,
      fontWeight: 600,
    },
    label: {
      fontSize: 11,
      lineHeight: 15 / 11,
      fontWeight: 600,
    },
  },
  shadows: ["none", "none"],
  overrides: {},
});

export default theme;

import { makeStyles, Typography } from "@material-ui/core";
import React from "react";

const useStyles = makeStyles(() => ({
  Label: {
    color: "#242424",
    fontFamily: "Inter",
    fontSize: "14px",
    marginBottom: "6px",
    letterSpacing: 0,
    lineHeight: "22px",
    fontWeight: 500,
    textTransform: "capitalize",
  },
}));

export default function InputFieldHeading({ label = "", isMargin = true }) {
  const classes = useStyles();
  return (
    <Typography
      className={classes.Label}
      style={{ marginTop: isMargin ? "22px" : "0px" }}
    >
      {label}
    </Typography>
  );
}

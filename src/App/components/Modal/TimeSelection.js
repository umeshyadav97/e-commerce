import React from "react";
import TimeKeeper from "react-timekeeper";
import Dialog from "@material-ui/core/Dialog";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    padding: "35px 40px 20px 20px",
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  description: {
    width: 364,
    textAlign: "center",
    marginBottom: 40,
  },
  image: {
    marginTop: 15,
    marginBottom: 20,
  },
  footer: {
    backgroundColor: "#F5F6FA",
    width: "100%",
    padding: "23px 0px",
    display: "flex",
    justifyContent: "center",
  },
});

const TimeSelection = ({ open, value, onChange, handleClose }) => {
  const classes = useStyles();
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      className={classes.root}
      PaperProps={{ style: { borderRadius: 16 } }}
      maxWidth="sm"
    >
      <TimeKeeper
        switchToMinuteOnHourSelect
        time={value}
        onDoneClick={onChange}
      />
    </Dialog>
  );
};

export default TimeSelection;

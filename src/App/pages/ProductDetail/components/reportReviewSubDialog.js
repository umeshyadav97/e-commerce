import { Typography } from "@material-ui/core";
import { React, useEffect, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { withStyles, makeStyles } from "@material-ui/core/styles";

export default function ReviewReported(props) {
  const [open, setOpen] = useState(props.reportedDialogOpen);

  useEffect(() => {
    setOpen(props.reportedDialogOpen);
  }, [props.reportedDialogOpen]);

  const handleClose = () => {
    setOpen(false);
    props.reportedDialogClose();
  };
  const classes = useStyles();
  return (
    <div>
      <Dialog
        PaperProps={{ style: { borderRadius: 16 } }}
        maxWidth="xs"
        fullWidth
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Review Reported
        </DialogTitle>

        <DialogContent>
          <Typography className={classes.subHeading}>
            We will evaluate the review and take necessary steps
          </Typography>
          <br />
        </DialogContent>
      </Dialog>
    </div>
  );
}

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(2),
    top: theme.spacing(2),
    color: "#242424",
  },
});
const useStyles = makeStyles({
  root: {
    width: 200,
    display: "flex",
    alignItems: "center",
  },
  subHeading: {
    color: "#708099",
    fontSize: "16px",
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography style={{ fontSize: "18px", margin: "15px 0px -10px 15px " }}>
        <b>{children}</b>
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon fontSize="large" />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
  },
}))(MuiDialogContent);

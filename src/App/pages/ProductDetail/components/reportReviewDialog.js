import { Button, Typography } from "@material-ui/core";
import { React, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { Grid } from "@material-ui/core";
import { PrimaryButton } from "../../../components";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import ReviewReported from "./reportReviewSubDialog";

export default function ReportReviewDialog(props) {
  const [open, setOpen] = useState(false);
  const [reportedSubDialogOpen, setReportedSubDialogOpen] = useState(false);

  const reportedDialogClose = () => {
    setReportedSubDialogOpen(false);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };

  const classes = useStyles();
  return (
    <div>
      <ReviewReported
        reportedDialogClose={reportedDialogClose}
        reportedDialogOpen={reportedSubDialogOpen}
      />
      <Grid item style={{ marginLeft: "5px" }}>
        {
          // props.selfReview ? (
          //   ""
          // ) :
          props.reportedFlag ? (
            <Typography
              style={{
                marginTop: "5px",
                marginLeft: "5px",
                fontWeight: 600,
                fontSize: "16px",
              }}
              color="secondary"
            >
              Review reported
            </Typography>
          ) : (
            <Button className={classes.subHeading} onClick={handleClickOpen}>
              Report abuse
            </Button>
          )
        }
      </Grid>
      <Dialog
        PaperProps={{ style: { borderRadius: 16 } }}
        maxWidth="xs"
        fullWidth
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Report review
        </DialogTitle>

        <DialogContent>
          <Typography className={classes.subHeading}>
            If you find this content inappropriate and think it should be
            removed, let us know by clicking the button below.
          </Typography>
          <br />

          <Grid item xs={12}>
            <PrimaryButton
              onClick={() => {
                props.handleChangeReportReview();
                setReportedSubDialogOpen(true);
                // setReportedFlag(true);
                handleClose();
              }}
              style={{
                fontSize: "18px",
                fontWeight: 600,
              }}
              fullWidth
            >
              Report
            </PrimaryButton>
          </Grid>
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

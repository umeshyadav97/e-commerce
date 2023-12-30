import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { Grid, Typography } from "@material-ui/core";
import { PrimaryButton } from "../../../../components";

const TrackingDetails = ({ open, handleClose, OrderTracking }) => {
  const classes = useStyles();
  return (
    <Dialog open={open} onClose={handleClose} className={classes.root}>
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        Tracking Details
      </DialogTitle>
      <DialogContent className={classes.content}>
        <Grid item xs={12}>
          <Grid item>
            <Typography className={classes.header}>Tracking Number</Typography>
          </Grid>
          <Grid item className={classes.grid}>
            <Typography className={classes.text}>
              {OrderTracking?.tracking_number || "NA"}
            </Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.header}>Tracking URL</Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.text}>
              <a
                href={OrderTracking?.tracking_url}
                rel="noopener noreferrer"
                target="_blank"
              >
                {OrderTracking?.tracking_url}
              </a>
            </Typography>
          </Grid>
          <Grid item>
            <PrimaryButton
              style={{ width: "100%", marginTop: 20 }}
              variant="contained"
              color="primary"
              onClick={() => handleClose()}
            >
              Close
            </PrimaryButton>
          </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

const useStyles = makeStyles({
  root: {
    position: "absolute",
    top: "50%",
    left: "50%",
    borderRadius: 0,
  },
  content: {
    marginBottom: 15,
    maxWidth: 460,
    width: 460,
  },
  header: {
    fontFamily: "Inter Regular",
    fontSize: 16,
    fontWeight: 600,
  },
  text: {
    fontFamily: "Inter Regular",
    fontSize: 14,
    fontWeight: 500,
  },
  grid: {
    marginBottom: 10,
  },
});

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
    background: "#fc68a2",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: "#ffffff",
    height: 45,
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
    color: "#ffffff",
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h4" className={classes.title}>
        {children}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

export default TrackingDetails;

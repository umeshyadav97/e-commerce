import { Dialog, Grid, Paper, Typography, withStyles } from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import React, { useState } from "react";
import styles from "../appointment.module.css";
import { OutlinedPrimaryButton, PrimaryButton } from "../../../components";
import CancelAppointment from "./CancelAppointment";
import RescheduleAppointment from "./RescheduleAppointment";

const CancelWarning = (props) => {
  const {
    open,
    title,
    handleClose,
    ID,
    DesignerId,
    storeList,
    prevStore,
    storeId,
    fetchAppointment,
  } = props;
  const [cancelAppointment, setCancelAppointment] = useState(false);
  const [rescheduleModal, setRescheduleModal] = useState(false);

  const handleCancelAppointment = () => {
    setCancelAppointment(!cancelAppointment);
    handleClose();
  };

  const handleRescheduleModal = () => {
    setRescheduleModal(!rescheduleModal);
    handleClose();
  };

  return (
    <React.Fragment>
      <Dialog
        maxWidth="xs"
        fullWidth
        scroll="body"
        open={open}
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {title}
        </DialogTitle>
        <DialogContent>
          <Paper>
            <Grid item>
              <Typography className={styles.muted_text}>
                Do you want to cancel the meeting or you want to reschedule the
                meeting?
              </Typography>
            </Grid>
          </Paper>
        </DialogContent>
        <DialogActions>
          <OutlinedPrimaryButton
            issecondary
            style={{ width: "180px" }}
            onClick={handleRescheduleModal}
          >
            <Typography variant="h4" className={styles.header_text}>
              Re-schedule
            </Typography>
          </OutlinedPrimaryButton>
          <PrimaryButton
            style={{ width: "180px" }}
            onClick={handleCancelAppointment}
          >
            <Typography variant="h4" className={styles.header_text}>
              Cancel
            </Typography>
          </PrimaryButton>
        </DialogActions>
      </Dialog>
      <CancelAppointment
        header="Are you sure you want to cancel this order request?"
        openModal={cancelAppointment}
        CloseAppointment={handleCancelAppointment}
        fetchAppointment={fetchAppointment}
        id={ID}
        {...props}
      />
      <RescheduleAppointment
        header="Reschedule Request"
        openModal={rescheduleModal}
        handleRescheduleModal={handleRescheduleModal}
        id={ID}
        DesignerId={DesignerId}
        storeList={storeList}
        prevStore={prevStore}
        storeId={storeId}
        fetchAppointment={fetchAppointment}
        {...props}
      />
    </React.Fragment>
  );
};

export default CancelWarning;

const styles2 = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(3),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: "#242424",
  },
  title: {
    fontFamily: "Inter SemiBold",
    fontSize: 18,
  },
});

const DialogTitle = withStyles(styles2)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h5" className={classes.title}>
        {children}
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

const DialogContent = withStyles(() => ({
  root: {
    padding: "10px 30px 6px 30px",
  },
}))(MuiDialogContent);

const DialogActions = withStyles(() => ({
  root: {
    margin: 0,
    padding: 30,
    justifyContent: "space-between",
  },
}))(MuiDialogActions);

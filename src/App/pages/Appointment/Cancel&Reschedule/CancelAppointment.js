import { Dialog, Grid, Paper, Typography, withStyles } from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import React, { useState } from "react";
import styles from "../appointment.module.css";
import { InputField, PrimaryButton, Toast } from "../../../components";
import InputFieldHeading from "../../../components/Form/InputFieldHeading";
import { API } from "../../../../api/apiService";

const CancelAppointment = (props) => {
  const { header, openModal, CloseAppointment, id, fetchAppointment } = props;
  const [notes, setNotes] = useState("");
  const [val, setVal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleNotes = (event) => {
    setNotes(event.target.value);
  };

  const handleCancelAppointment = async () => {
    if (!cancelling) {
      if (notes?.length === 0 || notes === "") {
        setVal(true);
      } else {
        try {
          setCancelling(true);
          const payload = {
            status: "CANCELLED",
            cancel_reason: notes,
          };
          const resp = await API.patch(`appointments/${id}`, payload);
          if (resp.success) {
            Toast.showSuccessToast(resp.data.message);
            CloseAppointment();
            fetchAppointment();
          }
        } catch (e) {
          const msg =
            typeof e.data.error?.message === "string"
              ? e.data.error?.message
              : e.data.error?.message[0];
          Toast.showErrorToast(msg || "Error in Cancelling Appointment!");
        } finally {
          setCancelling(false);
        }
      }
    }
  };

  return (
    <React.Fragment>
      <Dialog
        maxWidth="sm"
        fullWidth
        scroll="body"
        onClose={CloseAppointment}
        aria-labelledby="customized-dialog-title"
        open={openModal}
      >
        <DialogTitle
          id="customized-dialog-title"
          onClose={() => CloseAppointment()}
        >
          {header}
        </DialogTitle>
        <DialogContent>
          <Paper>
            <Grid item>
              <Typography className={styles.muted_text}>
                Specify the reason for cancelling the request.
              </Typography>
            </Grid>
            <Grid item>
              <InputFieldHeading label="Notes" />
              <InputField
                id="Name"
                type="text"
                placeholder="Enter your meeting title"
                variant="outlined"
                fullWidth
                multiline
                rows={6}
                onChange={(event) => handleNotes(event)}
                onInput={(event) => {
                  if (event.target.value?.length > 200) {
                    event.target.value = event.target.value.slice(0, 200);
                  }
                }}
              />
              <Grid container>
                <Grid item xs={10} className={styles.validation}>
                  {val && notes?.length === 0 && "Notes Required!"}
                </Grid>
                <Grid item xs={2} className={styles.grey_limit}>
                  {notes ? notes?.length : 0}/200
                </Grid>
              </Grid>
            </Grid>
          </Paper>
        </DialogContent>
        <DialogActions>
          <PrimaryButton fullWidth onClick={() => handleCancelAppointment()}>
            <Typography variant="h4" className={styles.header_text}>
              Cancel
            </Typography>
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default CancelAppointment;

const styles2 = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(4),
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
    padding: "1px 30px 30px 30px",
  },
}))(MuiDialogContent);

const DialogActions = withStyles(() => ({
  root: {
    margin: 0,
    padding: 30,
    justifyContent: "space-between",
  },
}))(MuiDialogActions);

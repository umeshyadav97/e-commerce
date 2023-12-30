import {
  Dialog,
  Grid,
  IconButton,
  Paper,
  Typography,
  withStyles,
} from "@material-ui/core";
import React, { useEffect } from "react";
import { InputField, PrimaryButton, Select, Toast } from "../../../components";
import InputFieldHeading from "../../../components/Form/InputFieldHeading";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import CloseIcon from "@material-ui/icons/Close";
import styles from "../appointment.module.css";
import { API } from "../../../../api/apiService";
import { useState } from "react";
import DateRange from "../Calender/DateRange";

const ScheduleFollowUp = (props) => {
  const {
    openModal,
    handleFollowUp,
    id,
    storeList,
    storeId,
    fetchAppointment,
    DesignerId,
  } = props;
  const [message, setNotes] = useState(null);
  const [filter, setFilter] = useState({
    store: storeId ? storeId : 0,
    appointmentDate: null,
    startTime: null,
    endTime: null,
  });
  const [rescheduling, setRescheduling] = useState(false);

  const handleMessages = (event) => {
    setNotes(event.target.value);
  };

  const handleChange = () => (event) => {
    let tempData = { ...filter };
    tempData["store"] = event;
    setFilter({
      store: event,
      appointmentDate: null,
      startTime: null,
      endTime: null,
    });
  };

  const handleRescheduleAppointment = async () => {
    if (!rescheduling) {
      try {
        setRescheduling(true);
        const payload = {
          store: filter.store !== 0 ? filter.store : storeId,
          reschedule_date: filter?.appointmentDate,
          start_time: filter?.startTime,
          end_time: filter?.endTime,
          notes: message,
        };
        const resp = await API.patch(
          `appointments/customer/${id}/schedule`,
          payload
        );
        if (resp.success) {
          Toast.showSuccessToast(resp.data.message);
          handleFollowUp();
          fetchAppointment();
          setFilter({
            appointmentDate: null,
            startTime: null,
            endTime: null,
          });
        }
      } catch (e) {
        const msg =
          typeof e.data.error?.message === "string"
            ? e.data.error?.message
            : e.data.error?.message[0];
        Toast.showErrorToast(
          msg || "Error in scheduling follow-up Appointment!"
        );
      } finally {
        setRescheduling(false);
      }
    }
  };

  useEffect(() => {
    setFilter({
      store: storeId,
    });
  }, [storeId, openModal]);

  return (
    <React.Fragment>
      <Dialog
        maxWidth="md"
        fullWidth
        scroll="body"
        onClose={handleFollowUp}
        aria-labelledby="customized-dialog-title"
        open={openModal}
      >
        <DialogTitle
          id="customized-dialog-title"
          onClose={() => handleFollowUp()}
        >
          Schedule Follow-Up Appointment
        </DialogTitle>
        <DialogContent>
          <Paper>
            <Grid item>
              <Typography className={styles.muted_text}>
                Select the Follow-Up Appointment date and time
              </Typography>
            </Grid>
            <Grid container xs={12} spacing={2}>
              <Grid item xs={12} md={5}>
                <InputFieldHeading label="Store Location" />
                <Select
                  id="store"
                  items={storeList}
                  value={filter?.store !== 0 ? filter?.store : storeId}
                  onChange={handleChange("store")}
                  style={{ width: "-webkit-fill-available !important" }}
                />
              </Grid>
              <Grid item xs={12} md={7}>
                <DateRange
                  filter={filter}
                  setFilter={setFilter}
                  storeId={filter?.store !== 0 ? filter?.store : storeId}
                  DesignerId={DesignerId}
                />
              </Grid>
            </Grid>

            <Grid item>
              <InputFieldHeading label="Message" />
              <InputField
                id="message"
                type="text"
                placeholder="Any additional details"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                onChange={(event) => handleMessages(event)}
                onInput={(event) => {
                  if (event.target.value?.length > 200) {
                    event.target.value = event.target.value.slice(0, 200);
                  }
                }}
              />
              <Grid item className={styles.grey_limit}>
                {message ? message?.length : 0}/200
              </Grid>
            </Grid>
          </Paper>
        </DialogContent>
        <DialogActions>
          <PrimaryButton
            fullWidth
            onClick={() => handleRescheduleAppointment()}
          >
            <Typography variant="h4" className={styles.header_text}>
              Schedule Follow-Up Appointment
            </Typography>
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

const styles2 = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(4),
    background: "#fc68a2",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: "#ffffff",
  },
  title: {
    fontFamily: "Inter SemiBold",
    fontSize: 18,
    color: "#ffffff",
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
    padding: "30px 40px 10px 40px",
  },
}))(MuiDialogContent);

const DialogActions = withStyles(() => ({
  root: {
    margin: 0,
    padding: "10px 30px 30px 30px",
    justifyContent: "space-between",
  },
}))(MuiDialogActions);

export default ScheduleFollowUp;

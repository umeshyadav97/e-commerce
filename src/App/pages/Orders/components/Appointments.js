import {
  Box,
  Dialog,
  Divider,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import React from "react";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import styles from "../Orders.module.css";
import moment from "moment";
import { capitalize, removeUnderScore } from "../../../../utils/textUtils";

const styles2 = (theme) => ({
  root: {
    margin: 0,
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(2),
    background: "#FC68A2",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(2),
    top: theme.spacing(2),
    color: "#242424",
  },
  title: {
    fontFamily: "Inter SemiBold !important",
    fontSize: "20px !important",
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

      <IconButton
        aria-label="close"
        className={classes.closeButton}
        onClick={onClose}
      >
        <CloseIcon htmlColor="#ffffff" fontSize="medium" />
      </IconButton>
    </MuiDialogTitle>
  );
});

const Appointments = (props) => {
  const { open, handleClose, list, handleMeeting } = props;

  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll="body"
        maxWidth="md"
        fullWidth
        aria-labelledby="sketch-dialog"
      >
        <DialogTitle id="sketch-dialog-title" onClose={handleClose}>
          Appointments
        </DialogTitle>
        <Divider />
        <Box p={4}>
          <Paper className={styles.paper_shadow}>
            {list?.map((appointment) => (
              <Grid
                container
                key={appointment?.id}
                onClick={() => handleMeeting(appointment?.appointment)}
                className={styles.AppointmentConatiner}
              >
                <Grid container>
                  <Grid item xs={10}>
                    <Typography className={styles.order_number}>
                      {appointment?.store}
                      {" ("}
                      {`${moment(appointment?.appointment_date).format(
                        "DD MMM YYYY"
                      )} `}{" "}
                      |{" "}
                      {moment
                        .utc(appointment?.start_time, "HH:mm")
                        .local()
                        .format("hh:mm A")}
                      -
                      {moment
                        .utc(appointment?.end_time, "HH:mm")
                        .local()
                        .format("hh:mm A")}
                      {" )"}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={2}
                    width="92px !important"
                    className={
                      appointment?.status === "UPCOMING"
                        ? styles.upcoming_status
                        : appointment?.status === "PENDING" ||
                          appointment?.status === "RESCHEDULED"
                        ? styles.pending_status
                        : appointment?.status === "COMPLETED"
                        ? styles.complete_status
                        : appointment?.status === "CANCELLED"
                        ? styles.decline_status
                        : styles.decline_status
                    }
                  >
                    <Typography
                      className={
                        appointment?.status === "UPCOMING"
                          ? styles.upcoming_text
                          : appointment?.status === "PENDING" ||
                            appointment?.status === "RESCHEDULED"
                          ? styles.pending_text
                          : appointment?.status === "COMPLETED"
                          ? styles.complete_text
                          : appointment?.status === "CANCELLED"
                          ? styles.decline_text
                          : styles.decline_text
                      }
                    >
                      {removeUnderScore(capitalize(appointment?.status))}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Paper>
        </Box>
      </Dialog>
    </React.Fragment>
  );
};

export default Appointments;

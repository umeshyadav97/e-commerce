import { Grid, Typography, makeStyles } from "@material-ui/core";
import React, { useState, useEffect } from "react";
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import { getFormattedDate } from "../../../commonFunction";
import styles from "../appointment.module.css";
import { Toast } from "../../../components";
import { API } from "../../../../api/apiService";
import moment from "moment/moment";

const CustomDate = ({ handleClose, filter, setFilter, storeId }) => {
  const classes = useStyles();
  const calenderclass = useStyles1();
  const [fromSelected, setFromSelected] = useState(true);
  const [from, setFrom] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState([]);
  const [start_time, setStart_time] = useState();
  const [end_time, setEnd_time] = useState();
  const [bgcolor, setbgColor] = useState();
  const [holiday, setHoliday] = useState();

  const handleDateChange = (date) => {
    setFrom(date);
  };

  const handleTimeChange = (start_time, end_time, id) => {
    setbgColor(id);
    if (fromSelected) {
      setStart_time(start_time);
      setEnd_time(end_time);
    }
  };

  const handleTimeSlot = async () => {
    let dt = moment(from, "YYYY-MM-DD HH:mm:ss");
    let day = dt.format("dddd").toUpperCase();
    try {
      const resp = await API.get(
        `appointments/availability/${storeId}/${day}/detail`
      );
      if (resp.success) {
        setTimeSlot(resp.data);
      }
    } catch (e) {
      const msg =
        typeof e.data.error?.message === "string"
          ? e.data.error?.message
          : e.data.error?.message[0];
      Toast.showErrorToast(msg || "Error in fetching Time Slot!");
    }
  };

  const isWeekend = (date) => {
    if (holiday !== undefined) {
      return holiday.includes(moment(date).format("YYYY-MM-DD"));
    }
  };

  const handleHoliday = async () => {
    let dt = moment(from, "YYYY-MM-DD");
    var month = dt.format("M");
    var year = dt.format("YYYY");
    const resp = await API.get(
      `appointments/holiday/${storeId}/${month}/${year}`
    );
    if (resp.success) {
      let temp = resp?.data?.map((item) => item.holiday_date);
      setHoliday(temp);
    }
  };

  useEffect(() => {
    if (storeId) {
      handleTimeSlot();
      handleHoliday();
    }
    //eslint-disable-next-line
  }, [from, storeId]);

  const handleDateApply = () => {
    let startDate = getFormattedDate(from, "yyyy-mm-dd");
    setFilter({
      ...filter,
      appointmentDate: startDate,
      startTime: start_time,
      endTime: end_time,
    });
    setFromSelected(true);
    handleClose();
  };

  useEffect(() => {
    setFilter({
      ...filter,
      appointmentDate: null,
      startTime: null,
      endTime: null,
    });
    //eslint-disable-next-line
  }, [storeId]);

  return (
    <div
      id="scroll-content"
      style={{
        top: "318px",
        left: "450px",
        maxWidth: "400px",
        height: "350px",
      }}
    >
      <div className={calenderclass.root}>
        <div className={classes.datePickerContainer}>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
              autoOk
              variant="static"
              openTo="date"
              value={from}
              minDate={new Date()}
              shouldDisableDate={isWeekend}
              initialFocusedDate={new Date()}
              onChange={handleDateChange}
            />
          </MuiPickersUtilsProvider>
        </div>
      </div>
      <Grid item>
        <Grid
          style={{
            width: "348px",
            borderBottom: "1px solid rgba(223, 231, 245, 1)",
            margin: "16px 0px",
          }}
        />
      </Grid>
      <Grid item style={{ marginBottom: "16px" }}>
        <Typography className={styles.time_font_bold}>
          {from ? moment.utc(from).local().format("MMM DD, YYYY") : ""}
        </Typography>
        <Typography className={styles.text}>Available Time Slots</Typography>
      </Grid>
      {timeSlot.length !== 0 ? (
        <Grid container>
          {timeSlot?.map((slot, index) => (
            <Grid
              key={index}
              container
              xs={4}
              className={styles.timeinput}
              onClick={() =>
                handleTimeChange(slot?.start_time, slot?.end_time, slot?.id)
              }
              style={
                bgcolor === slot?.id
                  ? {
                      backgroundColor: "#fc68a2",
                      color: "#fff",
                      border: "1px solid #fc68a2",
                    }
                  : {
                      backgroundColor: "#fff",
                      color: "#242424",
                      border: "1px solid rgba(36, 36, 36, 1)",
                    }
              }
            >
              <Typography className={styles.time_font}>
                {moment
                  .utc(slot?.start_time, "HH:mm")
                  .local()
                  .format("hh:mm A")}
                -{moment.utc(slot?.end_time, "HH:mm").local().format("hh:mm A")}
              </Typography>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Grid
          item
          style={{
            border: "1px solid rgba(36, 36, 36, 1)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "48px",
          }}
        >
          <Typography className={styles.header_1}>
            No Slots Available
          </Typography>
        </Grid>
      )}
      <div className={classes.btnContainer} style={{ marginTop: "10px" }}>
        <div className={classes.btn} onClick={handleDateApply}>
          Apply
        </div>
      </div>
    </div>
  );
};

export default CustomDate;

const useStyles = makeStyles(() => ({
  dateInputContainer: {
    display: "flex",
    justifyContent: "space-between",
    "div:first-child": {
      width: 150,
    },
  },
  label: {
    fontFamily: "Inter Regular",
    fontSize: 14,
    color: "#BBBBBB",
  },
  dateContainer: {
    height: 50,
    width: 148,
    borderRadius: 8,
    border: "1px solid #EBEFFF",
    marginTop: 4,
    cursor: "pointer",
    fontFamily: "Inter Regular",
    fontSize: 16,
    color: "#191919",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  datePickerContainer: {
    marginTop: "5px",
    display: "flex",
    fontFamily: "Inter Regular !important",
    justifyContent: "center",
    "& .MuiToolbar-root": {
      display: "none",
    },
  },
  btnContainer: {
    display: "flex",
    justifyContent: "flex-end",
  },
  btn: {
    height: 50,
    width: 112,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FC68A2",
    fontFamily: "Inter SemiBold",
    fontSize: 18,
    color: "#ffffff",
    cursor: "pointer",
    borderRadius: 8,
    margin: "10px 0px 20px 0px",
  },
}));

const useStyles1 = makeStyles(() => ({
  root: {
    "& .MuiPickersDay-daySelected": {
      backgroundColor: "#FC68A2 !important",
    },
  },
}));

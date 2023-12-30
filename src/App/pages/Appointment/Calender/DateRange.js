import React from "react";
import Menu from "@material-ui/core/Menu";
import { withStyles } from "@material-ui/core";
import CustomDate from "./CustomDate";
import { Grid, Typography } from "@material-ui/core";
import InputFieldHeading from "../../../components/Form/InputFieldHeading";
import Down from "../../../assets/icons/down-white-arrow.svg";
import Calender from "../../../assets/icons/calender-white.svg";
import styles from "../appointment.module.css";
import moment from "moment/moment";

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
    padding: "16px",
    borderRadius: "16px",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

export default function DateRange({ filter, setFilter, storeId }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleClick = (event) => {
    if (storeId !== 0) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Grid item>
        <InputFieldHeading label="Choose a Date and Time" />
        <Grid
          container
          xs={12}
          className={styles.dateinput}
          justifyContent="space-between"
          onClick={storeId !== null && handleClick}
        >
          <Grid item xs={5} sm={7}>
            <Typography
              className={styles.date_font}
              style={
                filter?.appointmentDate
                  ? { color: "#242424", alignSelf: "flex-end" }
                  : { color: "#A4B3CC", alignSelf: "flex-end" }
              }
            >
              {filter?.appointmentDate
                ? moment
                    .utc(filter.appointmentDate)
                    .local()
                    .format("MMM DD, YYYY")
                : "DD/MM/YYYY"}{" "}
              |{" "}
              {filter?.startTime
                ? moment
                    .utc(filter?.startTime, "HH:mm")
                    .local()
                    .format("hh:mm A")
                : "00:00"}{" "}
              -{" "}
              {filter?.endTime
                ? moment.utc(filter?.endTime, "HH:mm").local().format("hh:mm A")
                : "00:00"}
            </Typography>
          </Grid>
          <Grid
            container
            justifyContent="space-between"
            xs={7}
            sm={5}
            className={styles.date_input}
            style={
              storeId === 0 || storeId === null
                ? { backgroundColor: "#A4B3CC" }
                : { backgroundColor: "#fc68a2" }
            }
          >
            <img src={Calender} alt="calender" />
            <Typography
              className={styles.date_font}
              style={{
                color: "#ffffff",
                alignSelf: "center",
              }}
            >
              Select Date
            </Typography>
            <img src={Down} alt="arrow" />
          </Grid>
        </Grid>
      </Grid>
      <StyledMenu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <CustomDate
          handleClose={handleClose}
          filter={filter}
          setFilter={setFilter}
          storeId={storeId}
        />
      </StyledMenu>
    </div>
  );
}

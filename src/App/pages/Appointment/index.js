import { Breadcrumbs, Grid, Link, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Route } from "react-router";
import styles from "./appointment.module.css";
import AppointmentList from "./AppointmentList";

const Appointment = (props) => {
  const [activeTab, setActiveTab] = useState("upcoming");

  const changeTab = (value) => {
    if (value) {
      setActiveTab(value);
      props.history.push(`${props.match.path}/${value}`);
    }
  };

  const setTab = () => {
    let pathName = props.location.pathname;
    pathName = pathName.substring(pathName.lastIndexOf("/") + 1);
    if (pathName === "appointment") {
      setActiveTab("upcoming");
    } else {
      setActiveTab(pathName);
    }
  };

  useEffect(() => {
    setTab();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.location.pathname]);

  return (
    <React.Fragment>
      <Grid item className={styles.list_grid}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/home">
            <Typography className={styles.Link}>Home</Typography>
          </Link>
          <Link color="inherit">
            <Typography className={styles.Link}>Appointment</Typography>
          </Link>
        </Breadcrumbs>
        <Grid
          container
          xs={12}
          justifyContent="space-between"
          className={styles.tabs}
        >
          <Grid container xs={12} className={styles.tabs_container}>
            {steps.map((step) => {
              return (
                <div
                  key={step.id}
                  className={
                    activeTab === step.tab
                      ? styles.activeStepCtr
                      : styles.stepCtr
                  }
                >
                  <div
                    className={
                      activeTab === step.tab
                        ? styles.activeStepText
                        : styles.stepText
                    }
                    onClick={() => changeTab(step.tab)}
                  >
                    {step.title}
                  </div>
                </div>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
      <Route exact path={`${props?.match.path}/`} component={AppointmentList} />
      <Route
        exact
        path={`${props?.match.path}/pending`}
        component={AppointmentList}
      />
      <Route
        exact
        path={`${props?.match.path}/upcoming`}
        component={AppointmentList}
      />
      <Route
        exact
        path={`${props?.match.path}/completed`}
        component={AppointmentList}
      />
      <Route
        exact
        path={`${props?.match.path}/rejected`}
        component={AppointmentList}
      />
    </React.Fragment>
  );
};

export default Appointment;

const steps = [
  {
    title: "Upcoming",
    tab: "upcoming",
    id: 1,
  },
  {
    title: "Pending",
    tab: "pending",
    id: 2,
  },
  {
    title: "Completed",
    tab: "completed",
    id: 3,
  },
  {
    title: "Declined/Cancelled",
    tab: "rejected",
    id: 4,
  },
];

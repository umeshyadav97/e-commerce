import React, { useState, useEffect } from "react";
import { Box, Breadcrumbs, Grid, Typography } from "@material-ui/core";
import styles from "./Orders.module.css";
import "../pages.scss";
import OnlineOrderList from "./OnlineOrderList";
import InstoreOrderList from "./InstoreOrderList";
import Link from "@material-ui/core/Link";

const steps = [
  {
    title: "Online Orders",
    tab: "online",
    id: 1,
  },
  {
    title: "In Store Order",
    tab: "in-store",
    id: 2,
  },
];

const Orders = (props) => {
  const [activeTab, setActiveTab] = useState("online");

  const changeTab = (value) => {
    if (value) {
      setActiveTab(value);
    }
  };

  const setTab = () => {
    let pathName = props.location.pathname;
    pathName = pathName.substring(pathName.lastIndexOf("/") + 1);
    if (pathName === "online-order" || pathName === "orders") {
      setActiveTab("online");
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
      <Box ml={10}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/home">
            <Typography className={styles.Link}>Home</Typography>
          </Link>
          <Link color="inherit">
            <Typography className={styles.Link}>Orders</Typography>
          </Link>
        </Breadcrumbs>
      </Box>
      <Grid container className={styles.tabs}>
        {steps.map((step) => {
          return (
            <div
              key={step.id}
              className={
                activeTab === step.tab ? styles.activeStepCtr : styles.stepCtr
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
      {activeTab === "online" && <OnlineOrderList {...props} />}
      {activeTab === "in-store" && <InstoreOrderList {...props} />}
    </React.Fragment>
  );
};

export default Orders;

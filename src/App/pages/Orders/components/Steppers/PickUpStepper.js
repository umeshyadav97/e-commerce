import React, { useEffect, useState } from "react";
import {
  Grid,
  makeStyles,
  Step,
  StepConnector,
  StepLabel,
  Stepper,
  Typography,
  withStyles,
} from "@material-ui/core";
import clsx from "clsx";
import CompleteIcon from "../../../../assets/icons/stepper-done.svg";
import moment from "moment";
import styles from "../../Orders.module.css";

const PickUpStepper = (props) => {
  const { OrderStatus } = props;
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    OrderStatus?.DELIVERED ? setActiveStep(1) : setActiveStep(0);
  }, [OrderStatus]);

  return (
    <React.Fragment>
      <Stepper
        alternativeLabel
        connector={<QontoConnector />}
        activeStep={activeStep}
      >
        {steps.map((step, index) => {
          const labelProps = {};
          return (
            <Step key={index}>
              <StepLabel {...labelProps} StepIconComponent={QontoStepIcon}>
                <Grid item>
                  <Grid item>
                    <Typography className={styles.cancel_btn_text}>
                      {step?.label}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography className={styles.Address_text}>
                      {step?.id === 0
                        ? moment(OrderStatus?.ORDER_PLACED).format(
                            "MMM DD YYYY"
                          )
                        : OrderStatus?.DELIVERED &&
                          moment(OrderStatus?.DELIVERED).format("MMM DD YYYY")}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography className={styles.Address_text}>
                      {step?.id === 0
                        ? moment(OrderStatus?.ORDER_PLACED).format("hh:mm A")
                        : OrderStatus?.DELIVERED &&
                          moment(OrderStatus?.DELIVERED).format("hh:mm A")}
                    </Typography>
                  </Grid>
                </Grid>
              </StepLabel>
            </Step>
          );
        })}
      </Stepper>
    </React.Fragment>
  );
};

let steps = [
  {
    label: "Order Placed",
    id: 0,
    date: "",
    Time: "",
  },
  {
    label: "Picked Up",
    id: 1,
    date: "",
    Time: "",
  },
];

const QontoConnector = withStyles({
  alternativeLabel: {
    top: 10,
    left: "calc(-50% + 8px)",
    right: "calc(50% + 8px)",
  },
  active: {
    "& $line": {
      borderColor: "#fc68a2",
    },
  },
  completed: {
    "& $line": {
      borderColor: "#fc68a2",
      fontWeight: 600,
    },
  },
  line: {
    borderColor: "#dfe7f5",
    borderTopWidth: 2,
    borderRadius: 1,
  },
})(StepConnector);

const useQontoStepIconStyles = makeStyles({
  root: {
    color: "#dfe7f5",
    display: "flex",
    height: 22,
    alignItems: "center",
  },
  active: {
    color: "#fc68a2",
    zIndex: 5,
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
  completed: {
    color: "#fc68a2",
    zIndex: 5,
    fontSize: 18,
    fontWeight: 600,
  },
});

function QontoStepIcon(props) {
  const classes = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}
    >
      {completed || active ? (
        <img src={CompleteIcon} alt="complete" />
      ) : (
        <div className={classes.circle} />
      )}
    </div>
  );
}

export default PickUpStepper;

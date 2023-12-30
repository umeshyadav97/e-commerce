import React from "react";
import { Grid, Typography } from "@material-ui/core";
import styles from "../Dashboard.module.css";
import DressIcon from "../../../assets/images/dashboard/dress_icon.svg";
import MeasureIcon from "../../../assets/images/dashboard/measure_icon.svg";
import ProdIcon from "../../../assets/images/dashboard/production_icon.svg";
import FittedIcon from "../../../assets/images/dashboard/fitted_icon.svg";
import MeasurementCard from "./MeasurementCard";

const cards = [
  {
    id: 1,
    img: DressIcon,
    header: "Select your Dress",
    content: "",
  },
  {
    id: 2,
    img: MeasureIcon,
    header: "Add Measurement and Options",
    content: "",
  },
  {
    id: 3,
    img: ProdIcon,
    header: "Dress Production Starts",
    content: "",
  },
  {
    id: 4,
    img: FittedIcon,
    border: true,
    header: "Get your Perfect Dress",
    content: "",
  },
];

const Measurements = () => {
  return (
    <div>
      <React.Fragment>
        <Grid container className={styles.measurements}>
          <Grid item container justify="center">
            <Typography variant="h3" className={styles.measurement_header}>
              We Bring Best Custom Outfit for You
            </Typography>
          </Grid>
          <Grid
            item
            container
            justify="center"
            className={styles.header_margin}
          >
            <Grid item className={styles.secondary_text}>
              <Typography className={styles.side_header}>
                Find a perfect outfit that will suit your soul and body and we
                provide a
              </Typography>
              <Typography className={styles.side_header}>
                powerful tool for our customer to customize their perfect
                outfit.
              </Typography>
            </Grid>
          </Grid>
          {/* Stepper */}
          <Grid container>
            <div className={styles.container}>
              <ul className={styles.progressbar}>
                <li className={styles.active}></li>
                <li></li>
                <li></li>
                <li></li>
              </ul>
            </div>
          </Grid>
          <Grid container className={styles.cards}>
            {cards.map((item) => (
              <Grid item xs={12} key={item.id}>
                <MeasurementCard data={item} />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </React.Fragment>
    </div>
  );
};

export default Measurements;

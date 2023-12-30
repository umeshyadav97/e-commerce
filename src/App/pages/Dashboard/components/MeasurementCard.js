import React from 'react';
import { Grid, Typography } from '@material-ui/core';
import styles from '../Dashboard.module.css';

const MeasurementCard = ({ data }) => {
  return (
    <React.Fragment>
      <Grid container direction="column" className={styles.card}>
        <Grid item >
          <img src={data.img} alt={data.header} className={data.border ? styles.card_icon : ''} />
        </Grid>
        <Grid item>
          <Typography variant="h4" className={styles.card_header}>
            {data.header}
          </Typography>
        </Grid>
        <Grid item>
          <Typography className={styles.card_content}>
            {data.content}
          </Typography>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default MeasurementCard;

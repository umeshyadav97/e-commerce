import { Grid, Typography } from "@material-ui/core";
import React from "react";
import styles from "./credit.module.css";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { useHistory } from "react-router-dom";
import { capitalizeStr } from "../../../utils/textUtils";

const CreditDetailCard = (props) => {
  const { record } = props;
  const history = useHistory();

  const handleFindStore = (id) => {
    history.push(`/credit-notes/detail/${id}`);
  };
  return (
    <div className={styles.CreditCartContainer}>
      <Grid
        container
        direction="column"
        justifyContent="space-around"
        spacing={2}
      >
        <Grid item>
          <Grid container direction="column" spacing={1}>
            <Grid item>
              <Typography className={styles.cardName}>
                {capitalizeStr(record?.designer)}
              </Typography>
            </Grid>
            <Grid item>
              <Typography className={styles.CardCredits}>
                Store credit: ${record?.store_credit}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container spacing={1}>
            <Grid
              item
              className={styles.findStores}
              onClick={() => handleFindStore(record?.designer_id)}
            >
              <Typography>Find Stores</Typography>
            </Grid>
            <Grid item className={styles.findStores}>
              <ChevronRightIcon />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default CreditDetailCard;

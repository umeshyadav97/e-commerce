import React, { useEffect, useReducer, useState } from "react";
import {
  Breadcrumbs,
  Divider,
  Grid,
  Link,
  Typography,
} from "@material-ui/core";
import styles from "./credit.module.css";
import creditDollerIcon from "../../assets/icons/creditDollerIcon.svg";
import EmptyCredit from "../../assets/icons/EmptyCredits.svg";
import { API, ENDPOINTS } from "../../../api/apiService";
import ItemsCarousel from "react-items-carousel";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import CreditDetailCard from "./CreditDetailCard";
import { Toast } from "../../components";
import CreditList from "./CreditList";

const detailReducer = (state, action) => {
  switch (action.type) {
    case "DETAIL":
      return {
        ...state,
        record: action?.val?.designer_wise_credits,
        totalStoreCredit: action?.val?.total_store_credits,
      };
    default:
      return { ...state };
  }
};

const CreditNote = () => {
  const [detail, dispatchDetails] = useReducer(detailReducer, {
    record: [],
    totalStoreCredit: 0,
  });
  const [activeItemCoverIndex, setActiveItemCoverIndex] = useState(0);
  const fetchCreditList = async () => {
    try {
      const resp = await API.get(ENDPOINTS.CREDITLIST);
      if (resp.success) {
        dispatchDetails({ type: "DETAIL", val: resp?.data });
      }
    } catch (e) {
      const msg =
        typeof e.data.error?.message === "string"
          ? e.data.error?.message
          : e.data.error?.message[0];
      Toast.showErrorToast(msg || "Error fecthing Credit Notes!");
    }
  };

  useEffect(() => {
    fetchCreditList();
  }, []);

  return (
    <div style={{ margin: 50 }}>
      <Breadcrumbs aria-label="breadcrumb">
        <Link color="inherit" href="/home">
          <Typography className={styles.Link}>Home</Typography>
        </Link>
        <Link color="inherit">
          <Typography className={styles.Link}>Store Credit</Typography>
        </Link>
      </Breadcrumbs>
      <Grid container spacing={2}>
        <Grid item>
          <Grid container>
            <Grid item className={styles.DollerIcon}>
              <img src={creditDollerIcon} alt="icon" />
            </Grid>
            <Grid item className={styles.TotaltextContainer}>
              <Typography className={styles.Totaltext}>
                Total Store Credits:
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container justifyContent="flex-start">
            <Typography className={styles.amountHead}>
              ${detail?.totalStoreCredit}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
      <Divider />

      {detail?.record?.length > 0 ? (
        <Grid container>
          <Grid item xs={12} style={{ padding: 30 }}>
            <ItemsCarousel
              requestToChangeActive={setActiveItemCoverIndex}
              activeItemIndex={activeItemCoverIndex}
              numberOfCards={1}
              infiniteLoop="true"
              leftChevron={
                detail?.record?.length > 4 ? (
                  <ArrowBackIosIcon
                    fontSize="large"
                    style={{ marginRight: "-10px" }}
                  />
                ) : null
              }
              rightChevron={
                detail?.record?.length > 4 ? (
                  <ArrowForwardIosIcon fontSize="large" />
                ) : null
              }
              outsideChevron
              chevronWidth={30}
              chevronHeight={10}
            >
              <Grid container style={{ height: "100%" }}>
                {detail?.record?.length > 0 &&
                  detail?.record.map((item, index) => (
                    <Grid key={index} item xs={12} sm={4} md={3}>
                      <CreditDetailCard record={item} />
                    </Grid>
                  ))}
              </Grid>
            </ItemsCarousel>
          </Grid>
        </Grid>
      ) : (
        <Grid container justifyContent="center">
          <img src={EmptyCredit} alt="credit" />
        </Grid>
      )}
      <Grid container>
        <CreditList />
      </Grid>
    </div>
  );
};

export default CreditNote;

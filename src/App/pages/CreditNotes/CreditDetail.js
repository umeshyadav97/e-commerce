import { Grid, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { API, ENDPOINTS } from "../../../api/apiService";
import styles from "./credit.module.css";
import { Toast } from "../../components";
import StoreCard from "./StoreCard";
import InfiniteScroll from "react-infinite-scroll-component";
import PaginationLoader from "../../components/PaginationLoader";
import DefaultProfile from "../../assets/icons/default_profilr.svg";
import { useHistory } from "react-router-dom";
import { capitalizeStr } from "../../../utils/textUtils";

const CreditDetail = () => {
  let id = window.location.pathname.split("/")[3];
  const [record, setRecord] = useState([]);
  const [storesCount, setStoresCount] = useState(0);
  const [updating, setUpdating] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [details, setDetails] = useState();
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 8;

  const history = useHistory();

  const fetchData = async () => {
    try {
      const resp = await API.get(
        `${ENDPOINTS.DETAIL}${id}?page=1&page_size=${PAGE_SIZE}`
      );
      if (resp.success) {
        setDetails(resp.data);
        setRecord(resp.data.stores.results);
        setStoresCount(resp?.data?.stores.count);
      }
      if (resp.data.stores.next) {
        setHasMore(true);
      } else {
        setHasMore(false);
      }
    } catch (e) {
      const msg =
        typeof e.data.error?.message === "string"
          ? e.data.error?.message
          : e.data.error?.message[0];
      Toast.showErrorToast(msg || "Error fecthing Credit Notes!");
    }
  };

  const fetchMoreData = async () => {
    if (!updating) {
      try {
        setUpdating(true);
        const resp = await API.get(
          `${ENDPOINTS.DETAIL}${id}?page=${page + 1}&page_size=${PAGE_SIZE}`
        );
        if (resp.success) {
          if (resp.data.stores.next) {
            setHasMore(true);
          } else {
            setHasMore(false);
          }
          setPage((prevPage) => prevPage + 1);
          setRecord([...record, ...resp.data.stores.results]);
        }
      } catch (e) {
        const msg =
          typeof e.data.error?.message === "string"
            ? e.data.error?.message
            : e.data.error?.message[0];
        Toast.showErrorToast(msg || `Error Fetching Wishlist. Please Refresh`);
      } finally {
        setUpdating(false);
      }
    }
  };

  const handleBack = () => {
    history.goBack();
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Grid container style={{ margin: "0px 50px" }}>
        <Typography className={styles.back_btn} onClick={handleBack}>
          Back to credit notes
        </Typography>
      </Grid>
      <Grid container style={{ margin: 50, marginBottom: "100px" }}>
        <Grid item xs={11}>
          <Grid
            container
            spacing={2}
            className={styles.CreditDetailCartContainer}
          >
            <Grid item className={styles.DesignImageContainer}>
              <img
                src={details?.profile_photo_url || DefaultProfile}
                alt="profile"
                className={styles.imgDesigner}
              />
            </Grid>
            <Grid item className={styles.DesignerNameContainer}>
              <Typography
                className={styles.DesignerName}
                style={{ marginRight: 10 }}
              >
                {capitalizeStr(details?.designer)}
              </Typography>
            </Grid>
            <Grid item className={styles.StoresListNameContainer}>
              <Typography
                className={styles.StoresListName}
                style={{ marginLeft: 10 }}
              >
                {storesCount} Stores
              </Typography>
            </Grid>
          </Grid>
          <InfiniteScroll
            dataLength={record?.length}
            next={fetchMoreData}
            hasMore={hasMore}
            loader={<PaginationLoader />}
            style={{ overflow: "inherit" }}
          >
            <Grid container spacing={3} style={{ paddingTop: "30px" }}>
              {record?.length > 0 &&
                record?.map((item, index) => (
                  <Grid
                    key={index}
                    item
                    xs={6}
                    sm={4}
                    md={4}
                    lg={3}
                    xl={3}
                    mt={3}
                  >
                    <StoreCard key={index} item={item} />
                  </Grid>
                ))}
            </Grid>
          </InfiniteScroll>
        </Grid>
      </Grid>
    </>
  );
};

export default CreditDetail;

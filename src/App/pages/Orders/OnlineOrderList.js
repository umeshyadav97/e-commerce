import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Grid } from "@material-ui/core";
import { Toast, LoaderContent } from "../../components";
import { API, ENDPOINTS } from "../../../api/apiService";
import PaginationLoader from "../../components/PaginationLoader";
import InfiniteScroll from "react-infinite-scroll-component";
import OrderListCard from "./components/OrderListCard";
import styles from "./Orders.module.css";
import EmptyOrder from "./components/EmptyOrder";

const OnlineOrderList = (props) => {
  const isLoggedIn = props.isAuthenticated;
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [record, setRecord] = useState([]);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const resp = await API.get(
        `${ENDPOINTS.ORDERS}/?page=1&page_size=${PAGE_SIZE}`
      );
      if (resp.success) {
        const temp = resp.data;
        setPage(1);
        setRecord(temp.results);
        if (!temp.next) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      }
    } catch (e) {
      const msg =
        typeof e.data.error?.message === "string"
          ? e.data.error?.message
          : e.data.error?.message[0];
      Toast.showErrorToast(msg || `Error Fetching Orders. Please Refresh`);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreData = async () => {
    if (!updating) {
      try {
        setUpdating(true);
        const resp = await API.get(
          `${ENDPOINTS.ORDERS}/?page=${page + 1}&page_size=${PAGE_SIZE}`
        );
        if (resp.success) {
          const temp = resp.data;
          setPage((prevPage) => prevPage + 1);
          setRecord([...record, ...temp.results]);
          if (!temp.next) {
            setHasMore(false);
          }
        }
      } catch (e) {
        const msg =
          typeof e.data.error?.message === "string"
            ? e.data.error?.message
            : e.data.error?.message[0];
        Toast.showErrorToast(msg || `Error Fetching Orders. Please Refresh`);
        setHasMore(false);
      } finally {
        setUpdating(false);
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchOrders();
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <React.Fragment>
      {!isLoggedIn ? <Redirect to="/auth/login" /> : null}
      <Grid container className={styles.container}>
        <Grid item xs={12}>
          {!loading ? (
            <>
              {record.length ? (
                <InfiniteScroll
                  dataLength={record.length}
                  next={fetchMoreData}
                  hasMore={hasMore}
                  loader={<PaginationLoader />}
                >
                  <Grid container item xs={12}>
                    {record.map((item) => (
                      <OrderListCard
                        key={item.id}
                        data={item}
                        viewDetail={() =>
                          props.history.push(`/orders/${item.id}`)
                        }
                      />
                    ))}
                  </Grid>
                </InfiniteScroll>
              ) : (
                <EmptyOrder />
              )}
            </>
          ) : (
            <LoaderContent />
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const mapStateToProps = ({ auth: { isAuthenticated } }) => ({
  isAuthenticated,
});

export default connect(mapStateToProps, null)(OnlineOrderList);

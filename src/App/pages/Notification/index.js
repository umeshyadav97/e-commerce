import React, { useEffect, useState } from "react";
import { API, ENDPOINTS } from "../../../api/apiService";
import { Grid, Typography, Paper, Box } from "@material-ui/core";
import { Loader, Toast } from "../../components";
import ErrorPage from "../../components/ErrorPage";
import NotificationCard from "./NotificationCard";
import styles from "./Notification.module.css";
import { connect } from "react-redux";
import { getNotification } from "../../../redux/actions/authActions";
import { makeStyles } from "@material-ui/core/styles";
import InfiniteScroll from "react-infinite-scroll-component";
import PaginationLoader from "../../components/PaginationLoader";

const Notification = (props) => {
  const [loading, setLoading] = useState(true);
  const [isApiError, setIsApiError] = useState(false);
  const [statusCode, setStatusCode] = useState(500);
  const [total, setTotal] = useState(0);
  const [record, setRecord] = useState([]);
  const [hasMore, setHasMore] = useState(false);
  const [page, setPage] = useState(1);
  const [unReadCount, setUnReadCount] = useState(0);

  const classes = useStyles();

  const fetchRecord = async () => {
    try {
      setLoading(true);
      const resp = await API.get(
        `${ENDPOINTS.NOTIFICATION}?page=${page}&page_size=${10}`
      );
      if (resp.success) {
        const result = resp.data;
        setUnReadCount(result?.unread_count);
        setTotal(result?.data?.count);
        props.getNotification({
          data: result?.unread_count,
        });
        setPage(1);
        setRecord(result?.data?.results);
        if (result.data.next !== null) {
          setHasMore(true);
        } else {
          setHasMore(false);
        }
      }
    } catch (e) {
      const msg =
        typeof e?.data?.error?.message === "string"
          ? e?.data?.error?.message
          : e?.data?.error?.message[0];
      Toast.showErrorToast(
        msg || `Error Fetching Notifications. Please Refresh`
      );
      setStatusCode(e.status);
      setIsApiError(true);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreData = async () => {
    try {
      setLoading(true);
      const resp = await API.get(
        `${ENDPOINTS.NOTIFICATION}?page=${page + 1}&page_size=${10}`
      );
      if (resp.success) {
        const result = resp.data;
        setUnReadCount(result?.unread_count);
        setPage((prevPage) => prevPage + 1);
        setTotal(result?.data?.count);
        setRecord([...record, ...result?.data?.results]);
        if (result.data.next !== null) {
          setHasMore(true);
        } else {
          setHasMore(false);
        }
        props.getNotification({
          data: result?.unread_count,
        });
      }
    } catch (e) {
      const msg =
        typeof e?.data?.error?.message === "string"
          ? e?.data?.error?.message
          : e?.data?.error?.message[0];
      Toast.showErrorToast(
        msg || `Error Fetching Notifications. Please Refresh`
      );
      setStatusCode(e.status);
      setIsApiError(true);
    } finally {
      setLoading(false);
    }
  };

  const ReadRecord = async (id) => {
    let payload;
    if (id) {
      payload = {
        logs: [id],
      };
    } else {
      payload = {
        logs: [],
        mark_as_read_all: true,
      };
    }

    const resp = await API.patch(ENDPOINTS.NOTIFICATION_COUNT, payload);
    if (resp.success) {
      fetchRecord();
    } else {
      Toast.showErrorToast(`Error Fetching Notifications. Please Refresh`);
    }
  };
  const handleRead = () => {
    ReadRecord();
  };

  useEffect(() => {
    fetchRecord();
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      {loading && <Loader />}
      {isApiError ? (
        <ErrorPage code={statusCode} />
      ) : (
        <Box mx={8}>
          {/* Header */}
          <Paper>
            <Grid container className={styles.header_box}>
              <Grid item xs={12} sm={9}>
                <Grid container justifyContent="flex-start">
                  <Typography variant="h4" className={styles.header}>
                    {`Notification (${total})`}
                  </Typography>
                </Grid>
              </Grid>
              {unReadCount > 0 && (
                <Grid item xs={12} sm={3}>
                  <Grid
                    container
                    justifyContent="flex-end"
                    inc
                    className={classes.notification_read}
                  >
                    <Typography
                      variant="h4"
                      className={styles.header}
                      onClick={() => handleRead()}
                    >
                      Mark All Read
                    </Typography>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Paper>
          {/* Notifications */}
          <Paper className={styles.notification_container}>
            <InfiniteScroll
              dataLength={record.length}
              next={fetchMoreData}
              hasMore={hasMore}
              loader={<PaginationLoader />}
            >
              {record?.map((notification, index) => (
                <NotificationCard
                  key={index.toString()}
                  type={notification.parent_notification_type}
                  notification={notification.payload?.notification}
                  time={notification.updated_at}
                  altText={index.toString()}
                  props={props}
                  ReadRecord={ReadRecord}
                  id={notification.id}
                  fetchNotificationCount={fetchRecord}
                  read={notification?.mark_as_read}
                  type_child={notification.notification_type}
                />
              ))}
            </InfiniteScroll>
          </Paper>
        </Box>
      )}
    </React.Fragment>
  );
};

const useStyles = makeStyles((theme) => ({
  root: () => ({
    top: 0,
  }),
  notification_read: {
    cursor: "pointer",
    color: "#fc68a2",
    justifyContent: "flex-end",
    [theme.breakpoints.down("xs")]: {
      justifyContent: "flex-start",
    },
  },
}));

const mapDispatchToProps = (dispatch) => ({
  getNotification: (data) => dispatch(getNotification(data)),
});

export default connect(null, mapDispatchToProps)(Notification);

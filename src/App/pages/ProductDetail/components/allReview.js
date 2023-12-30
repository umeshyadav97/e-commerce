import { Avatar, Box, Grid, makeStyles, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Rating from "@material-ui/lab/Rating";
import { ENDPOINTS } from "../../../../api/apiRoutes";
import { Select, Toast } from "../../../components";
import { API } from "../../../../api/apiService";
import * as moment from "moment";
import likeIcon from "../../../assets/icons/like.svg";
import likeIconSelected from "../../../assets/icons/like-filled.svg";
import { Button } from "@material-ui/core";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import { withRouter } from "react-router-dom";
import ReportReviewDialog from "./reportReviewDialog";
import PaginationLoader from "../../../components/PaginationLoader";
import InfiniteScroll from "react-infinite-scroll-component";

const AllReview = (props) => {
  const classes = useStyles();
  const isLoggedIn = props.isAuthenticated;
  const [sortValue, setSortValue] = useState(0);
  const [allReview, setAllReview] = useState([]);
  const [loading, setLoading] = useState(true);
  const productId = props.product_id;
  const [count, setCount] = useState(0);
  const [totalProducts, setTotalProducts] = useState("");
  const [nextPage, setNextPage] = useState("");
  const [hasMore, setHasMore] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchAllReview();
    props.newReviewAddedFalse();
  }, [props.reviewAdded]);

  useEffect(() => {
    fetchAllReview();
  }, [sortValue]);

  const handleSort = (e) => {
    setSortValue(e);
  };

  const loginRoute = () => {
    props.history.push("/auth/login");
  };

  const fetchAllReview = async () => {
    const sortByRating = sortValue === 0 ? "" : `&rating=${sortValue}`;
    try {
      const resp = await API.get(
        ENDPOINTS.GET_CUSTOMER_REVIEW +
          `${productId}?` +
          `page=1` +
          `&page_size=3` +
          `${sortByRating}`,
        isLoggedIn ? true : false
      );
      if (resp.success) {
        setLoading(false);
        setCount(resp.data.count);
        setAllReview(resp.data.results || []);
        setTotalProducts(resp.data.count || 0);
        setNextPage(resp.data.next ? resp.data.next : null);
        if (resp.data.next == null) {
          setHasMore(false);
        } else if (resp.data.next !== null) {
          setHasMore(true);
        }
      }
    } catch (e) {
      if (e.data.error) {
        if (
          Array.isArray(e.data.error.message) &&
          e.data.error.message.length > 0
        ) {
          Toast.showErrorToast(e.data.error.message[0]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreReviewData = async () => {
    if (!updating && nextPage !== null) {
      try {
        setUpdating(true);
        let sortByRating = sortValue === 0 ? "" : `&rating=${sortValue}`;
        let endPoint1 = nextPage ? nextPage : "";
        let endPoint2 =
          endPoint1.slice(0, 4) + "s" + endPoint1.slice(4) + `${sortByRating}`;
        const resp = await API.get(endPoint2, isLoggedIn ? true : false);
        if (resp.success) {
          let resData = [...allReview, ...resp.data.results];
          if (resp.data.next == null) {
            setHasMore(false);
          } else if (resp.data.next !== null) {
            setHasMore(true);
          }
          if (resData.length === totalProducts) {
            setHasMore(false);
          } else if (resData.length !== totalProducts) {
            setHasMore(true);
          }

          setAllReview(resData);
          setTotalProducts(resp.data.count);
          setNextPage(resp.data.next ? resp.data.next : null);
        }
      } catch (e) {
        const msg =
          typeof e.data.error?.message === "string"
            ? e.data.error?.message
            : e.data.error?.message[0];
        Toast.showErrorToast(msg || "");
      } finally {
        setUpdating(false);
      }
    }
  };

  return (
    <React.Fragment>
      <Box>
        <Grid container spacing={2} justify="space-between">
          <Grid item>
            <Typography
              style={{
                fontSize: "18px",
                fontWeight: 600,
              }}
            >
              All Reviews ({count})
            </Typography>
          </Grid>

          <Grid item>
            <Typography
              style={{
                fontSize: "14px",
                fontWeight: 500,
                marginBottom: "8px",
              }}
            >
              Rating
            </Typography>

            <Select
              id="sort"
              placeholder="Sort By:"
              style={{
                borderRadius: 8,
                backgroundColor: "#F4F7FD",
              }}
              items={[
                { label: "All Stars", value: 0 },
                { label: "5 star", value: 5 },
                { label: "4 star", value: 4 },
                { label: "3 star", value: 3 },
                { label: "2 star", value: 2 },
                { label: "1 star", value: 1 },
              ]}
              value={sortValue}
              onChange={handleSort}
            />
          </Grid>
        </Grid>
        <br />
        {allReview.length > 0 && props.viewAllButtonHide !== true
          ? allReview.slice(0, 2).map((reviewData, index) => {
              return (
                <ReviewCart
                  key={index}
                  data={reviewData}
                  fetchAllReview={fetchAllReview}
                  fetchMoreReviewData={fetchMoreReviewData}
                  isLoggedIn={isLoggedIn}
                  loginRoute={loginRoute}
                />
              );
            })
          : ""}
        {!loading ? (
          allReview.length && props.viewAllButtonHide === true ? (
            <InfiniteScroll
              dataLength={allReview.length} //This is important field to render the next data
              next={fetchMoreReviewData}
              hasMore={hasMore}
              loader={<PaginationLoader />}
              style={{ overflow: "hidden" }}
            >
              {allReview.map((reviewData, index) => {
                return (
                  <ReviewCart
                    key={index}
                    data={reviewData}
                    fetchAllReview={fetchAllReview}
                    isLoggedIn={isLoggedIn}
                    loginRoute={loginRoute}
                  />
                );
              })}
            </InfiniteScroll>
          ) : (
            ""
          )
        ) : (
          ""
        )}

        {allReview.length > 0 && props.viewAllButtonHide !== true ? (
          <Button
            onClick={() => props.history.push(`/review/view-all/${productId}`)}
            variant="contained"
            className={classes.Button}
          >
            View All
          </Button>
        ) : (
          ""
        )}
        <br />
        <br />
      </Box>
    </React.Fragment>
  );
};
const mapStateToProps = ({ auth: { isAuthenticated } }) => ({
  isAuthenticated,
});

export default connect(mapStateToProps, null)(withRouter(AllReview));

const ReviewCart = (props) => {
  const classes = useStyles();
  const reviewData = props.data;
  const [likeFlag, setLikeFlag] = useState(false);
  const [reportedFlag, setReportedFlag] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [dialogTitle, setDialogTitle] = useState("");

  const handleCloseOpen = () => {
    setOpen(false);
  };
  useEffect(() => {
    setLikeFlag(reviewData.is_liked);
    setReportedFlag(reviewData.is_self_reported);
  }, [reviewData]);

  const handleChangeReportReview = async (reviewId) => {
    if (props.isLoggedIn) {
      if (reportedFlag === false) {
        try {
          const resp = await API.patch(
            ENDPOINTS.REPORT_REVIEW + `${reviewId}?report_type=ADD`,
            true
          );
          if (resp.success) {
            setReportedFlag(!reportedFlag);
            Toast.showSuccessToast(resp.data.message);
          }
        } catch (e) {
          if (e.data.error) {
            if (
              Array.isArray(e.data.error.message) &&
              e.data.error.message.length > 0
            ) {
              Toast.showErrorToast(e.data.error.message[0]);
            }
          }
        }
      }
    } else {
      setDialogTitle("report");
      setOpen(true);
    }
  };

  const handleChangeLikeReview = async (reviewId) => {
    if (props.isLoggedIn) {
      if (likeFlag === false) {
        try {
          const resp = await API.patch(
            ENDPOINTS.LIKE_REVIEW + `${reviewId}?like_type=ADD`,
            true
          );
          if (resp.success) {
            setLikeFlag(!likeFlag);
            props.fetchAllReview();
            Toast.showSuccessToast(resp.data.message);
          }
        } catch (e) {
          if (e.data.error) {
            if (
              Array.isArray(e.data.error.message) &&
              e.data.error.message.length > 0
            ) {
              Toast.showErrorToast(e.data.error.message[0]);
            }
          }
        }
      } else if (likeFlag === true) {
        try {
          const resp = await API.patch(
            ENDPOINTS.LIKE_REVIEW + `${reviewId}?like_type=REMOVE`,
            true
          );
          if (resp.success) {
            setLikeFlag(!likeFlag);
            props.fetchAllReview();
            Toast.showSuccessToast(resp.data.message);
          }
        } catch (e) {
          if (e.data.error) {
            if (
              Array.isArray(e.data.error.message) &&
              e.data.error.message.length > 0
            ) {
              Toast.showErrorToast(e.data.error.message[0]);
            }
          }
        }
      }
    } else {
      setDialogTitle("like");
      setOpen(true);
    }
  };

  return (
    <React.Fragment>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={12} md={7} lg={5} xl={5}>
          <Grid
            container
            direction="column"
            justify="center"
            alignItems="flex-start"
          >
            <Grid container spacing={3}>
              <Grid item>
                <Avatar
                  style={{ height: "60px", width: "60px" }}
                  backgroundColor="#A4B3CC"
                  alt="profile"
                  src={reviewData.customer.profile_picture_url}
                />
              </Grid>
              <Typography
                className="row-center"
                style={{
                  fontSize: "12px",
                  textTransform: "capitalize",
                  fontWeight: 500,
                }}
              >
                {reviewData.customer.first_name +
                  " " +
                  reviewData.customer.last_name}
              </Typography>
            </Grid>

            <Grid item style={{ marginTop: "10px" }}>
              <Rating
                name="read-only"
                value={reviewData.rating ? reviewData.rating : ""}
                readOnly
              />
            </Grid>

            <Grid item>
              <Typography
                style={{
                  fontSize: "16px",
                  marginTop: "10px",
                  wordBreak: "break-word",
                }}
              >
                {reviewData.review_description
                  ? reviewData.review_description.charAt(0).toUpperCase() +
                    reviewData.review_description.slice(1).toLowerCase()
                  : ""}
              </Typography>
            </Grid>

            <Grid item>
              <Typography
                style={{
                  fontSize: "16px",
                  color: "#A4B3CC",
                  marginTop: "10px",
                }}
              >
                Reviewed on{" "}
                {reviewData.reviewed_on
                  ? moment(reviewData.reviewed_on).format(" Do MMMM YYYY")
                  : ""}
              </Typography>
            </Grid>
            <Grid container spacing={1} style={{ marginTop: "10px" }}>
              <Grid item>
                <Typography variant="h5" style={{ marginTop: "3px" }}>
                  {reviewData.likes_count}
                </Typography>
              </Grid>
              <Grid item>
                <div className="row-center">
                  <img
                    onClick={() => handleChangeLikeReview(reviewData.id)}
                    src={reviewData.is_liked ? likeIconSelected : likeIcon}
                    style={{
                      height: "23px",
                      width: "25px",
                      cursor: "pointer",
                    }}
                    alt="like icon"
                    title={reviewData.is_liked ? "Dislike" : "Like"}
                  />
                </div>
              </Grid>
              {reviewData.self_review ? (
                ""
              ) : (
                <Grid item style={{ borderRight: "1px solid #A4B3CC" }}></Grid>
              )}
              <ReportReviewDialog
                reportedFlag={reportedFlag}
                selfReview={reviewData.self_review}
                handleChangeReportReview={() =>
                  handleChangeReportReview(reviewData.id)
                }
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={12} md={5} lg={7} xl={7}>
          <Grid
            container
            spacing={2}
            className={classes.ReviewImageContainer}
            alignItems="center"
          >
            {reviewData.images
              ? reviewData.images.slice(0, 3).map((productImage, index) => {
                  return (
                    <Grid key={index} item>
                      <div
                        style={{
                          height: "180px",
                          maxWidth: "180px",
                          border: "1px solid #DFE7F5",
                          borderRadius: "8px",
                        }}
                      >
                        <img
                          alt="img"
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: "8px",
                            // objectFit: "cover",
                          }}
                          src={productImage}
                        />
                      </div>
                    </Grid>
                  );
                })
              : ""}
          </Grid>
        </Grid>
      </Grid>
      <Grid
        item
        xs={12}
        style={{
          border: "1px dashed #DFE7F5",
          marginBottom: "38.25px",
          marginTop: "38.25px",
        }}
      ></Grid>
      <AlertLoginDialog
        open={open}
        handleCloseOpen={handleCloseOpen}
        loginRoute={props.loginRoute}
        dialogTitle={dialogTitle}
      />
    </React.Fragment>
  );
};

const AlertLoginDialog = (props) => {
  const [open, setOpen] = React.useState(props.open);

  const handleClose = () => {
    setOpen(false);
    props.handleCloseOpen();
  };
  useEffect(() => {
    setOpen(props.open);
  }, [props.open]);

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Please login for {props.dialogTitle} product review
        </DialogTitle>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Close
          </Button>
          <Button onClick={props.loginRoute} color="secondary" autoFocus>
            Login
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const useStyles = makeStyles((theme) => ({
  Heading: {
    fontSize: "24px",
    fontWeight: 600,
    letterSpacing: 0,
    lineHeight: "40px",
  },

  ReviewImageContainer: {
    justifyContent: "flex-end",
    [theme.breakpoints.down("sm")]: {
      justifyContent: "flex-start",
    },
  },

  SubHeading: {
    color: "#242424",
    fontSize: "16px",
    fontWeight: 500,
    letterSpacing: 0,
    lineHeight: "24px",
  },
  Button: {
    height: "48px",
    marginTop: "-10px",
    padding: "0px 40px 0px 40px",
    borderRadius: "8px",
    backgroundColor: "#242424",
    color: "#FFFFFF",
    fontSize: "18px",
    fontWeight: 600,
    "&:hover": {
      background: "#242424",
    },
  },
}));

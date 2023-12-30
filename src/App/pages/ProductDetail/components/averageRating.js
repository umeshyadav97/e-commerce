import {
  Box,
  Grid,
  makeStyles,
  Typography,
  withStyles,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import Rating from "@material-ui/lab/Rating";
import { ENDPOINTS } from "../../../../api/apiRoutes";
import { Toast } from "../../../components";
import { API } from "../../../../api/apiService";
import LinearProgress from "@material-ui/core/LinearProgress";
import { Divider } from "@material-ui/core";
import AllReview from "./allReview";
import AddNewReview from "./AddNewReview";
import noReviewAVailableImage from "../../../assets/images/No-reviews.svg";

const AverageRating = (props) => {
  const classes = useStyles();
  const isLoggedIn = props.isAuthenticated;
  const [customerReview, setCustomerReview] = useState({});
  const productId = props.product_id;
  const is_purchased = props.is_purchased;
  const [reviewAdded, setReviewAdded] = useState(false);
  const fetchProductDetails = props.fetchProductDetails;
  useEffect(() => {
    fetchCustomerReview();
  }, []);
  const newReviewAdded = () => {
    setReviewAdded(true);
  };
  const newReviewAddedFalse = () => {
    setReviewAdded(false);
  };
  const fetchCustomerReview = async () => {
    try {
      const resp = await API.get(
        ENDPOINTS.GET_AVG_RATING_REVIEW + `${productId}`,
        isLoggedIn ? true : false
      );
      if (resp.success) {
        setCustomerReview(resp.data);
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
  };

  return (
    <React.Fragment>
      <Typography className={classes.Heading}>Customer Review</Typography>
      {customerReview.average_rating > 0 ? (
        <Grid container direction="row" spacing={3}>
          <Grid item xs={12} sm={12} md={4} lg={3} xl={3}>
            <div
              style={{
                borderRadius: "8px",
                backgroundColor: "#F4F7FD",
              }}
            >
              <Box mx={2}>
                <Typography
                  style={{
                    paddingTop: "30px",
                    fontSize: "18px",
                    fontWeight: 600,
                  }}
                >
                  Average Rating
                </Typography>
                <div>
                  {customerReview.average_rating > 0 ? (
                    <Grid container spacing={2} style={{ marginTop: "20px" }}>
                      <Grid item>
                        <Rating
                          name="read-only"
                          value={customerReview.average_rating}
                          readOnly
                          precision={0.5}
                        />
                      </Grid>
                      <Grid item>
                        <span className={classes.SubHeading}>
                          {parseFloat(customerReview.average_rating).toFixed(1)}{" "}
                          out of 5
                        </span>
                      </Grid>
                    </Grid>
                  ) : (
                    <Typography style={{ marginTop: "20px" }}>
                      Average rating is not available
                    </Typography>
                  )}

                  {Object.entries(customerReview.percentage).length !== 0 ? (
                    <React.Fragment>
                      <Grid container spacing={2} style={{ marginTop: "25px" }}>
                        <Grid item>
                          <Typography className={classes.SubHeading}>
                            5 star
                          </Typography>
                        </Grid>
                        <Grid item xs={7}>
                          <BorderLinearProgress
                            variant="determinate"
                            value={`${Math.round(
                              customerReview.percentage[5]
                            )}`}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <Typography
                            className={classes.SubHeading}
                          >{`${Math.round(
                            customerReview.percentage[5]
                          )}%`}</Typography>
                        </Grid>
                      </Grid>

                      <Grid container spacing={2} style={{ marginTop: "25px" }}>
                        <Grid item>
                          <Typography className={classes.SubHeading}>
                            4 star
                          </Typography>
                        </Grid>
                        <Grid item xs={7}>
                          <BorderLinearProgress
                            variant="determinate"
                            value={`${Math.round(
                              customerReview.percentage[4]
                            )}`}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <Typography
                            className={classes.SubHeading}
                          >{`${Math.round(
                            customerReview.percentage[4]
                          )}%`}</Typography>
                        </Grid>
                      </Grid>

                      <Grid container spacing={2} style={{ marginTop: "25px" }}>
                        <Grid item>
                          <Typography className={classes.SubHeading}>
                            3 star
                          </Typography>
                        </Grid>
                        <Grid item xs={7}>
                          <BorderLinearProgress
                            variant="determinate"
                            value={`${Math.round(
                              customerReview.percentage[3]
                            )}`}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <Typography
                            className={classes.SubHeading}
                          >{`${Math.round(
                            customerReview.percentage[3]
                          )}%`}</Typography>
                        </Grid>
                      </Grid>

                      <Grid container spacing={2} style={{ marginTop: "25px" }}>
                        <Grid item>
                          <Typography className={classes.SubHeading}>
                            2 star
                          </Typography>
                        </Grid>
                        <Grid item xs={7}>
                          <BorderLinearProgress
                            variant="determinate"
                            value={`${Math.round(
                              customerReview.percentage[2]
                            )}`}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <Typography
                            className={classes.SubHeading}
                          >{`${Math.round(
                            customerReview.percentage[2]
                          )}%`}</Typography>
                        </Grid>
                      </Grid>

                      <Grid container spacing={2} style={{ marginTop: "25px" }}>
                        <Grid item>
                          <Typography className={classes.SubHeading}>
                            1 star
                          </Typography>
                        </Grid>
                        <Grid item xs={7}>
                          <BorderLinearProgress
                            variant="determinate"
                            value={`${Math.round(
                              customerReview.percentage[1]
                            )}`}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <Typography
                            className={classes.SubHeading}
                          >{`${Math.round(
                            customerReview.percentage[1]
                          )}%`}</Typography>
                        </Grid>
                      </Grid>
                    </React.Fragment>
                  ) : (
                    ""
                  )}
                </div>
              </Box>
              <Divider style={{ marginTop: "63.5px" }} />
              {isLoggedIn && is_purchased ? (
                <Box mx={2}>
                  <Typography
                    style={{
                      fontSize: "18px",
                      fontWeight: 600,
                      marginTop: "28.5px",
                      marginBottom: "15px",
                    }}
                  >
                    Review this Product
                  </Typography>
                  <Typography className={classes.SubHeading}>
                    Share your thoughts with other customers.
                  </Typography>
                  <Grid
                    container
                    style={{ paddingTop: "40px", paddingBottom: "30px" }}
                    justify="center"
                  >
                    <AddNewReview
                      buttonTypeBlack={true}
                      product_id={productId}
                      productTitle={props.productTitle}
                      fetchCustomerReview={fetchCustomerReview}
                      newReviewAdded={newReviewAdded}
                      fetchProductDetails={fetchProductDetails}
                    />
                  </Grid>
                </Box>
              ) : (
                ""
              )}
            </div>
          </Grid>
          <Grid item xs={12} sm={12} md={8} lg={9} xl={9}>
            <AllReview
              product_id={productId}
              reviewAdded={reviewAdded}
              newReviewAddedFalse={newReviewAddedFalse}
            />
          </Grid>
        </Grid>
      ) : (
        <Box mb={4}>
          <div style={{ textAlign: "center", marginTop: "45px" }}>
            <img
              height="202px"
              maxWidth="204px"
              alt="product"
              src={noReviewAVailableImage}
            ></img>
            <Typography
              style={{
                marginTop: "24px",
                fontSize: "16px",
                fontWeight: 600,
              }}
            >
              No reviews added
            </Typography>
            {isLoggedIn && is_purchased ? (
              <div>
                <Typography className={classes.NoReviewAddedBody}>
                  Be the first the first one to add review
                </Typography>

                <AddNewReview
                  buttonTypeBlack={false}
                  product_id={productId}
                  productTitle={props.productTitle}
                  fetchCustomerReview={fetchCustomerReview}
                  newReviewAdded={newReviewAdded}
                  fetchProductDetails={fetchProductDetails}
                />
              </div>
            ) : (
              ""
            )}
          </div>
        </Box>
      )}
      <br />
      <br />
    </React.Fragment>
  );
};
const mapStateToProps = ({ auth: { isAuthenticated } }) => ({
  isAuthenticated,
});

export default connect(mapStateToProps, null)(AverageRating);

const useStyles = makeStyles({
  Heading: {
    fontSize: "24px",
    fontWeight: 600,
    letterSpacing: 0,
    lineHeight: "40px",
    marginBottom: "40px",
  },

  SubHeading: {
    color: "#242424",
    fontSize: "16px",
    fontWeight: 500,
    letterSpacing: 0,
    lineHeight: "24px",
  },
  NoReviewAddedBody: {
    color: "#708099",
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: 0,
    lineHeight: "22px",
    textAlign: "center",
    marginTop: "16px",
    marginBottom: "30px",
  },
});
const BorderLinearProgress = withStyles(() => ({
  root: {
    height: 24,
    borderRadius: 4,
  },
  colorPrimary: {
    backgroundColor: "#DFE7F5",
  },
  bar: {
    borderRadius: 4,
    backgroundColor: "#FFBF45",
  },
}))(LinearProgress);

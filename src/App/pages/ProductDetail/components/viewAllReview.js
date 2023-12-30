import { Container, makeStyles } from "@material-ui/core";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import { Box, Grid } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { Rating } from "@material-ui/lab";
import { React, useEffect, useState } from "react";
import { withRouter } from "react-router";
import { API, ENDPOINTS } from "../../../../api/apiService";
import { Loader, Toast } from "../../../components";
import AllReview from "./allReview";
import { connect } from "react-redux";
import { Link } from "react-router-dom";

const ViewAllReview = (props) => {
  const productId = window.location.pathname.split("/")[3];
  const isLoggedIn = props.isAuthenticated;
  const [productDetails, setProductDeatails] = useState({});
  const [loading, setLoading] = useState(false);
  const [coverImage, setCoverImage] = useState(null);
  const [reviewAdded, setReviewAdded] = useState(false);

  const newReviewAddedFalse = () => {
    setReviewAdded(false);
  };

  useEffect(() => {
    fetchProductDeatails();
    window.scrollTo(0, 0);
  }, []);

  const fetchProductDeatails = async () => {
    setLoading(true);
    var resp;
    if (!isLoggedIn) {
      resp = await API.get(
        ENDPOINTS.READY_TO_WEAR_DETAIL + `${productId}`,
        false
      );
    } else {
      resp = await API.get(
        ENDPOINTS.READY_TO_WEAR_DETAIL + `${productId}`,
        true
      );
    }
    try {
      if (resp.success) {
        setLoading(false);
        setProductDeatails(resp.data);
        setCoverImage(
          resp.data.cover_image_url ? resp.data.cover_image_url : ""
        );
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
  const classes = useStyles();
  return (
    <Container maxWidth="xl">
      {loading && <Loader />}
      <Box mx={8} mb={10}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link
            style={{ textDecoration: "none", color: "#242424" }}
            color="inherit"
            to="/home"
          >
            <Typography className={classes.Link}>Home</Typography>
          </Link>
          <Link
            style={{ textDecoration: "none", color: "#242424" }}
            color="inherit"
          >
            <Typography className={classes.Link}>All Reviews</Typography>
          </Link>
        </Breadcrumbs>
        <br />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={12} md={5} lg={5} xl={4}>
            <Link
              style={{ textDecoration: "none", color: "#242424" }}
              to={
                productDetails.is_custom_product
                  ? "/custom-product-details/" +
                    `${productDetails.parent_category}/` +
                    `${productDetails.id}`
                  : "/product-details/" +
                    `${productDetails.parent_category}/` +
                    `${productDetails.id}`
              }
            >
              <Grid container direction="coloumn">
                <Grid item xs={12} sm={12} md={11} lg={11} xl={10}>
                  {coverImage ? (
                    <div className={classes.Image}>
                      <img
                        className={classes.SRC}
                        src={coverImage}
                        alt="cover"
                      />
                    </div>
                  ) : null}
                </Grid>
                <Grid item>
                  <Typography className={classes.Title}>
                    {productDetails.title}
                  </Typography>
                </Grid>
                {productDetails.customer_reviews ? (
                  <Grid container>
                    <div>
                      <Rating
                        name="read-only"
                        value={productDetails.customer_reviews.rating}
                        readOnly
                        precision={0.5}
                      />
                    </div>
                    <div
                      style={{
                        borderRight: "1px solid #FC68A2",
                        marginRight: "22px",
                        marginLeft: "22px",
                      }}
                    ></div>
                    <div>
                      <span style={{ color: "#FC68A2", fontSize: "16px" }}>
                        {productDetails.customer_reviews.reviews} Review
                      </span>
                    </div>
                  </Grid>
                ) : (
                  ""
                )}

                <Grid item>
                  <Typography
                    style={{
                      fontWeight: 600,
                      fontSize: "24px",
                      marginTop: "20px",
                    }}
                  >
                    $ {productDetails.price}
                  </Typography>
                </Grid>
              </Grid>
            </Link>
          </Grid>
          <Grid item xs={12} sm={12} md={7} lg={7} xl={8}>
            <AllReview
              product_id={productId}
              viewAllButtonHide={true}
              reviewAdded={reviewAdded}
              newReviewAddedFalse={newReviewAddedFalse}
            />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};
const mapStateToProps = ({ auth: { isAuthenticated } }) => ({
  isAuthenticated,
});

export default connect(mapStateToProps, null)(withRouter(ViewAllReview));

const useStyles = makeStyles({
  Link: {
    "&:hover": {
      color: "#fc68a2",
    },
    textTransform: "capitalize",
    fontWeight: 500,
    fontSize: "10px",
    textDecoration: "none",
    cursor: "pointer",
  },
  Image: {
    margin: "0px 10px 10px 0px",
    maxHeight: "550px",
    maxWidth: "620px",
    borderRadius: "8px",
    border: "1px solid #DFE7F5",
  },
  SRC: {
    height: "100%",
    width: "100%",
    borderRadius: "8px",
  },
  Title: {
    fontWeight: 600,
    fontSize: "24px",
    textTransform: "capitalize",
    marginBottom: "20px",
    marginTop: "20px",
  },
});

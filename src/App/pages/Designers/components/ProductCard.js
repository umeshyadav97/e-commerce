import { useState, useEffect } from "react";
import { Grid, makeStyles, Typography } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import React from "react";
import { connect } from "react-redux";
import { Toast } from "../../../components";
import { API } from "../../../../api/apiService";
import Rating from "../../../assets/icons/Rating.svg";
import Wishlist from "../../../assets/icons/WishlistIcon.svg";
import WishlistSelected from "../../../assets/icons/WishlistSelected.svg";
import Lottie from "lottie-react";
import ImgLoader from "../../../assets/imageLoader.json";

const ProductCard = (props) => {
  const isLoggedIn = props.isAuthenticated;
  const wishlistFlag = props.data.wishlist === null ? false : true;
  const productData = props.data;
  const [product, setProduct] = useState("");
  const [addedToWishList, setAddedToWishlist] = useState(false);
  const [wishlist, setWishlist] = useState(wishlistFlag);
  const [wishlistId, setWishlistId] = useState(
    props.data.wishlist !== null ? props.data.wishlist.id : ""
  );
  const [imgLoading, setImgLoading] = useState(true);

  useEffect(() => {
    localStorage.removeItem("path_name");
    setAddedToWishlist(localStorage.getItem("wislist_added") ? true : false);
    setProduct(
      localStorage.getItem("product_id")
        ? localStorage.getItem("product_id")
        : ""
    );
  }, []);

  useEffect(() => {
    if (addedToWishList && product === productData.id && isLoggedIn) {
      if (!wishlist) handleChangewishList(product);
      else {
        setAddedToWishlist(false);
        localStorage.removeItem("product_id");
        localStorage.removeItem("wislist_added");
      }
    }
  }, [product, wishlist, isLoggedIn]);

  const history = useHistory();

  const classes = useStyles();

  const handleChangewishList = async (id) => {
    if (isLoggedIn) {
      if (wishlist === false) {
        try {
          const resp = await API.post(
            "/customer/wishlist",
            { product: id },
            isLoggedIn ? true : false
          );
          if (resp.success) {
            setAddedToWishlist(false);
            localStorage.removeItem("product_id");
            localStorage.removeItem("wislist_added");
            setWishlist(!wishlist);
            setWishlistId(resp.data.id);
            Toast.showSuccessToast("Product added successfully to wishlist");
          }
        } catch (e) {
          if (e.data.error) {
            if (
              Array.isArray(e.data.error.message) &&
              e.data.error.message.length > 0
            ) {
              Toast.showErrorToast(e.data.error.message[0]);
            }
          } else {
            Toast.showErrorToast("Error in adding product to wishlist");
          }
        }
      } else if (wishlist === true) {
        try {
          const resp = await API.deleteResource(
            `/customer/wishlist/${wishlistId}`,
            isLoggedIn ? true : false
          );
          if (resp.success) {
            setAddedToWishlist(false);
            localStorage.removeItem("product_id");
            localStorage.removeItem("wislist_added");
            setWishlist(!wishlist);
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
          } else {
            Toast.showErrorToast("Error in removing product from wishlist");
          }
        }
      }
    } else {
      localStorage.setItem("path_name", window.location.pathname);
      localStorage.setItem("wislist_added", true);
      localStorage.setItem("product_id", id);
      Toast.showSuccessToast("Please login for adding product to the wishlist");
      history.push("/auth/login");
    }
  };
  return (
    <React.Fragment key={props.key}>
      <Grid
        container
        direction="column"
        className={classes.cardTop}
        style={{ marginTop: "18px" }}
      >
        <Grid containter justify={"center"} className={classes.Container16To9}>
          <a
            href={
              productData.is_custom_product
                ? "/custom-product-details/" +
                  `${productData?.category?.id}/` +
                  `${productData?.product_id}`
                : "/product-details/" +
                  `${productData?.category?.id}/` +
                  `${productData?.product_id}`
            }
          >
            {imgLoading && (
              <Lottie
                animationData={ImgLoader}
                style={{
                  display: "contents",
                  width: 200,
                  height: 200,
                }}
              />
            )}
            <img
              className={"productsSRC"}
              alt="img"
              src={productData.cover_image_url}
              style={{
                display: imgLoading ? "none" : "inline",
              }}
              onLoad={() => setImgLoading(false)}
            />
          </a>
          <img
            onClick={() => handleChangewishList(productData?.product_id)}
            src={wishlist ? WishlistSelected : Wishlist}
            className={"wishlistIcon"}
            alt=""
            title={wishlist ? "Remove from wishlist" : "Add to wishlist"}
          />
          {productData?.is_custom_product ? (
            <div className={classes.FloatingDiv}>
              <div className={classes.CustomisationAvailable}>
                <Typography className={classes.customText}>
                  Customization Available
                </Typography>
              </div>
            </div>
          ) : (
            ""
          )}
        </Grid>

        {/* <br /> */}
        <a
          style={{ textDecoration: "none", color: "#242424" }}
          href={
            productData?.is_custom_product
              ? "/custom-product-details/" +
                `${productData?.category?.id}/` +
                `${productData?.product_id}`
              : "/product-details/" +
                `${productData?.category?.id}/` +
                `${productData?.product_id}`
          }
        >
          <Grid item style={{ marginLeft: "" }}>
            <Grid container className={classes.cardContent} style={{}}>
              <Grid item>
                <Typography className={classes.Heading}>
                  {productData?.title}
                </Typography>
              </Grid>
              <Grid item style={{ marginRight: "" }}>
                <Grid
                  container
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <Grid item>
                    <Typography className={"price"}>
                      $ {productData?.price}
                    </Typography>
                  </Grid>
                  {productData?.rating ? (
                    <>
                      <Grid item style={{ marginLeft: "15px" }}>
                        <img className={"rating"} src={Rating} alt="" />
                      </Grid>
                      <Grid item style={{ marginLeft: "2px" }}>
                        <Typography className={"ratingVal"}>
                          {productData?.rating}
                        </Typography>
                      </Grid>
                    </>
                  ) : null}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </a>
      </Grid>
    </React.Fragment>
  );
};

const mapStateToProps = ({ auth: { isAuthenticated } }) => ({
  isAuthenticated,
});

export default connect(mapStateToProps, null)(ProductCard);

const useStyles = makeStyles(() => ({
  cardContent: {
    maxWidth: "335px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: "5px",
    paddingRight: "5px",
  },
  Container16To9: {
    position: "relative",
    alignItems: "center",
    alignContent: "center",
    backgroundColor: "#FFF",
    border: "1px solid rgb(223, 231, 245)",
    borderRadius: "8px",
    minWidth: "246px",
    height: "228px",
  },
  CustomisationAvailable: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 5,
  },
  customText: {
    color: "#FFFFFF",
    fontFamily: "Inter Medium",
    fontSize: "13px",
    fontWeight: "bold",
    letterSpacing: 0,
    lineHeight: "22px",
  },
  FloatingDiv: {
    opacity: 0.65,
    backgroundColor: "#000000",
    height: "36px",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  Heading: {
    textTransform: "capitalize",
    fontSize: "14px",
    fontWeight: "bold",
    marginBottom: "4px",
    marginTop: "12px",
    fontFamily: "Inter Medium",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkitLineClamp": "1" /* number of lines to show */,
    "-webkitBoxOrient": "vertical",
  },
  brandName: {
    textTransform: "capitalize",
    fontSize: "14px",
    fontWeight: 500,
    marginBottom: "4px",
    color: "#708099",
    fontFamily: "Inter Medium",
  },
}));

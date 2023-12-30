/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Grid, makeStyles, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import Wishlist from "../../../assets/icons/WishlistIcon.svg";
import WishlistSelected from "../../../assets/icons/WishlistSelected.svg";
import { Toast } from "../../../components";
import { API } from "../../../../api/apiService";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import styles from "../ProductListing.module.css";
import Rating from "../../../assets/icons/Rating.svg";
import RatingYellow from "../../../assets/icons/Staryellow.svg";
import { useHistory } from "react-router-dom";
import Lottie from "lottie-react";
import ImgLoader from "../../../assets/imageLoader.json";

const ProductCard = (props) => {
  const isLoggedIn = props.isAuthenticated;
  const productData = props.data;
  const wishlistFlag = props.data.wishlist === null ? false : true;
  const [wishlist, setWishlist] = useState(wishlistFlag);
  const [wishlistId, setWishlistId] = useState(
    props.data.wishlist !== null ? props.data.wishlist.id : ""
  );
  const [product, setProduct] = useState("");
  const [addedToWishList, setAddedToWishlist] = useState(false);
  const history = useHistory();
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

  const handleChangewishList = async (id, e) => {
    e?.stopPropagation();
    if (isLoggedIn) {
      if (wishlist === false) {
        try {
          const resp = await API.post(
            "/customer/wishlist",
            { product: id },
            true
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
            true
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
  const handleProductChange = (productId, ParentCategoryId) => {
    history.push(`/product-details/${ParentCategoryId}/${productId}`);
    window.scrollTo(0, 0);
    window.location.reload();
  };
  const handleCustomProductChange = (productId, ParentCategoryId) => {
    history.push(`/custom-product-details/${ParentCategoryId}/${productId}`);
    window.scrollTo(0, 0);
    window.location.reload();
  };

  const classes = useStyles();
  return (
    <React.Fragment key={props.key}>
      <Grid container direction="column" style={{ marginTop: "18px" }}>
        <div
          className={classes.Container16To9}
          style={{
            height: props.height ? props.height : "290px",
            minWidth: "290px",
          }}
        >
          <div
            className={classes.FloatingDiv}
            style={{
              backgroundColor: "none",
              height: "0px",
              width: 16,
              position: "relative",
              marginLeft: "auto",
              marginRight: 5,
            }}
          >
            <div className="row-center" style={{ position: "relative" }}>
              <img
                fetchpriority="high"
                onClick={(event) => handleChangewishList(productData.id, event)}
                src={wishlist ? WishlistSelected : Wishlist}
                className={classes.WishlistIcon}
                alt="wishlist icon"
                title={wishlist ? "Remove from wishlist" : "Add to wishlist"}
                style={{ marginTop: 5, objectFit: "none" }}
              />
            </div>
          </div>
          <Link
            to={
              productData.is_custom_product
                ? "/custom-product-details/" +
                  `${productData.category}/` +
                  `${productData.id}`
                : "/product-details/" +
                  `${productData.category}/` +
                  `${productData.id}`
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
              fetchpriority="high"
              alt="img"
              onClick={() =>
                productData.is_custom_product
                  ? handleCustomProductChange(
                      productData.id,
                      productData.category
                    )
                  : handleProductChange(productData.id, productData.category)
              }
              onLoad={() => setImgLoading(false)}
              src={
                productData.thumbnail ? productData.thumbnail : productData.url
              }
              style={{
                display: imgLoading ? "none" : "inline",
              }}
            />
          </Link>
          {productData.is_custom_product ? (
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
        </div>
        <Box>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginLeft: 2,
              marginRight: 2,
            }}
          >
            <Link
              style={{
                textDecoration: "none",
                color: "#242424",
                width: "100%",
              }}
              to={
                productData.is_custom_product
                  ? "/custom-product-details/" +
                    `${productData.category}/` +
                    `${productData.id}`
                  : "/product-details/" +
                    `${productData.category}/` +
                    `${productData.id}`
              }
            >
              <div style={{ marginTop: 5, marginBottom: 5 }}>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: 600,
                    fontFamily: "Inter",
                    fontStyle: "normal",
                  }}
                >
                  {productData.title}
                </span>
                <span style={{ float: "right" }}>
                  <span
                    style={{ marginRight: "1.5em" }}
                    className={styles.ProductPrice}
                  >
                    ${" "}
                    {productData.price % 1 === 0
                      ? productData.price
                      : productData.price.toFixed(1)}
                  </span>

                  <span>
                    <img
                      fetchpriority="high"
                      src={productData.rating > 0 ? RatingYellow : Rating}
                      alt="Rating"
                      style={{ marginRight: "5px", marginBottom: "-2px" }}
                    />
                  </span>
                  <span className={styles.ProductPrice}>
                    {productData.rating}
                  </span>
                </span>
              </div>
            </Link>
          </div>
        </Box>
      </Grid>
    </React.Fragment>
  );
};

const mapStateToProps = ({ auth: { isAuthenticated } }) => ({
  isAuthenticated,
});

export default connect(mapStateToProps, null)(ProductCard);

const useStyles = makeStyles({
  Container16To9: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#FFF",
    border: "1px solid rgb(223, 231, 245)",
    borderRadius: "8px",
    "& img": {
      cursor: "pointer",
      width: "100%",
      height: "100%",
    },
  },
  CustomisationAvailable: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 15,
  },
  customText: {
    color: "#FFFFFF",
    fontFamily: "Inter Medium",
    fontSize: "18px",
    fontWeight: 500,
    letterSpacing: 0,
    lineHeight: "22px",
  },
  FloatingDiv: {
    backgroundColor: "#000000",
    height: "50px",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  WishlistIcon: {
    height: "24px",
    width: "21px",
    cursor: "pointer",
  },
  Heading: {
    textTransform: "capitalize",
    fontSize: "16px",
    fontWeight: 500,
    marginBottom: "2px",
    marginTop: "4px",
    fontFamily: "Inter Regular",
    overflow: "hidden",
    textOverflow: "ellipsis",
    display: "-webkit-box",
    "-webkitLineClamp": "1" /* number of lines to show */,
    "-webkitBoxOrient": "vertical",
  },
});

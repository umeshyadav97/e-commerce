import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import {
  Loader,
  OutlinedPrimaryButton,
  PrimaryButton,
  Toast,
} from "../../components";
import { ENDPOINTS } from "../../../api/apiRoutes";
import { API } from "../../../api/apiService";
import { addToCart } from "../../../redux/actions/authActions";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import wishlistUnFilledIcon from "../../assets/icons/wishlist-selected.svg";
import wishlistFilledIcon from "../../assets/icons/wishlist-filled.svg";
import cartIcon from "../../assets/icons/cart-unselected.svg";
import InputFieldHeading from "../../components/Form/InputFieldHeading";
import SimilarProductCarousal from "../ProductListing/components/SimilarProductCarousal";
import SizeChart from "./components/sizeChart";
import Rating from "@material-ui/lab/Rating";
import CheckIcon from "@material-ui/icons/Check";
import { connect } from "react-redux";
import ItemsCarousel from "react-items-carousel";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import AverageRating from "./components/averageRating";
import Lottie from "lottie-react";
import ImgLoader from "../../assets/imageLoader.json";

const ProductDetails = (props) => {
  const isLoggedIn = props.isAuthenticated;
  const [productDetails, setProductDeatails] = useState({});
  const productId = window.location.pathname.split("/")[3];
  const parentCategoryId = window.location.pathname.split("/")[2];
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlistFlag] = useState(
    productDetails.wishlist === null ? false : true
  );
  const [wishlistId, setWishlistId] = useState(
    productDetails.wishlist == null ? "" : productDetails.wishlist.id
  );
  const [sizeId, setsizeId] = useState(null);
  const [variantId, setvariantId] = useState(null);
  const [colourId, SetColourId] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [productImage, setProductImage] = useState([]);
  const [cartFlag, setCartFlag] = useState(false);
  const [product, setProduct] = useState("");
  const [addedToCart, setAddedToCart] = useState(false);
  const [addedToWishList, setAddedToWishlist] = useState(false);
  const [activeItemCoverIndex, setActiveItemCoverIndex] = useState(0);
  const [activeItemVariantIndex, setActiveItemVariantIndex] = useState(0);
  const [itemExist, setItemExist] = useState("");
  const [variantList, setVariantList] = useState([]);
  const [sizeList, setSizeList] = useState([]);
  const [sizeFlag, setSizeFlag] = useState(false);
  const [colorFlag, setColorFlag] = useState(false);
  const [price, setPrice] = useState("");
  const [imgLoading, setImgLoading] = useState(true);
  const [imgLoadingCursol, setImgLoadingCursol] = useState(true);
  const [isClicked, setIsClicked] = useState(false);
  useEffect(() => {
    setSizeFlag(sizeId ? true : false);
  }, [sizeId]);

  useEffect(() => {
    setColorFlag(variantId ? true : false);
  }, [variantId]);

  useEffect(() => {
    localStorage.removeItem("path_name");
    setsizeId(
      localStorage.getItem("size_id") ? localStorage.getItem("size_id") : ""
    );
    setvariantId(
      localStorage.getItem("variant_id")
        ? localStorage.getItem("variant_id")
        : ""
    );
    SetColourId(
      localStorage.getItem("colour_id") ? localStorage.getItem("colour_id") : ""
    );
    setQuantity(
      localStorage.getItem("quantity") ? localStorage.getItem("quantity") : 1
    );
    setAddedToCart(
      localStorage.getItem("cart_added")
        ? localStorage.getItem("cart_added")
        : false
    );
    setAddedToWishlist(localStorage.getItem("wislist_added") ? true : false);
    setProduct(
      localStorage.getItem("product_id")
        ? localStorage.getItem("product_id")
        : ""
    );
  }, []);

  useEffect(() => {
    checkItemExistInCart();
    //eslint-disable-next-line
  }, [variantId, sizeId]);

  useEffect(() => {
    if (addedToWishList && product && isLoggedIn) {
      if (!wishlist) handleChangewishList(product);
    }
    //eslint-disable-next-line
  }, [product, isLoggedIn, wishlist]);

  useEffect(() => {
    if (
      addedToCart &&
      isLoggedIn &&
      itemExist === false &&
      sizeId &&
      variantId &&
      colourId
    ) {
      handleSaveToCart();
    }
    //eslint-disable-next-line
  }, [variantId, colourId, sizeId, itemExist, isLoggedIn]);

  const checkItemExistInCart = async () => {
    if (isLoggedIn) {
      if (variantId && sizeId) {
        try {
          const resp = await API.get(
            `/customer/cart/check/${variantId}/${sizeId}`,
            true
          );
          if (resp.success) {
            setItemExist(resp.data.is_item_exists);
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
    }
  };

  /*get updated price on the basis of variant and size*/

  const getUpdatedPrice = async () => {
    if (isLoggedIn) {
      if (variantId && sizeId) {
        try {
          const resp = await API.get(
            "/product/customer/" +
              `${variantId}/` +
              `${sizeId}` +
              "/variant/price",
            false
          );
          if (resp.success) {
            setPrice(resp.data.price);
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
    }
  };

  /*get updated price on the basis of variant and size*/

  useEffect(() => {
    getUpdatedPrice();
    //eslint-disable-next-line
  }, [variantId, sizeId]);

  const handleSizeChange = async (size_id) => {
    setCartFlag(false);
    setsizeId(size_id);
    const resp = await API.get(
      "/product/" +
        `${productId}` +
        "/available/variants?size_id=" +
        `${size_id}`,
      true
    );
    if (resp.success) {
      setVariantList(resp.data);
    }
  };

  const handleVariantChange = async (
    variant_id,
    colour_id,
    cover_image_url,
    variantImages
  ) => {
    setCartFlag(false);
    setCoverImage(cover_image_url);
    setvariantId(variant_id);
    setProductImage(variantImages);
    SetColourId(colour_id);
    const resp = await API.get(
      `/product/${productId}/available/variants?variant_id=${variant_id}`,
      true
    );
    if (resp.success) {
      setSizeList(resp.data);
    }
  };

  const handleChangeVariantCaraosalImage = (variantImage) => {
    setCoverImage(variantImage.cover_image_url);
    let variantCoverImageList = [];
    for (const [value] of Object.entries(variantImage.variant_images)) {
      variantCoverImageList.push(value !== null ? value : "");
    }
    setProductImage(variantCoverImageList);
  };

  const fetchProductDetails = async () => {
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
        setPrice(resp.data.price);
        setSizeList(resp.data.product_sizes);
        setVariantList(resp.data.variants);
        setCoverImage(
          resp.data.cover_image_url ? resp.data.cover_image_url : ""
        );
        setProductImage(resp.data.sub_images_url);
        setWishlistId(resp.data.wishlist !== null ? resp.data.wishlist.id : "");
        setWishlistFlag(resp.data.wishlist == null ? false : true);
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
        Toast.showErrorToast("error in fetching product details");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToCart = async () => {
    setIsClicked(true);
    const payload = {
      product: productId,
      size: sizeId,
      variant: variantId,
      colour: colourId,
      quantity: quantity,
    };
    if (isLoggedIn) {
      if (sizeId && variantId) {
        try {
          const resp = await API.post("customer/cart/rtw/add", payload, true);
          if (resp.success) {
            setCartFlag(true);
            setAddedToCart(false);
            props.addToCart();
            Toast.showSuccessToast(resp.data.message);
            localStorage.removeItem("variant_id");
            localStorage.removeItem("colour_id");
            localStorage.removeItem("size_id");
            localStorage.removeItem("quantity");
            localStorage.removeItem("cart_added");
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
            Toast.showErrorToast("Error in adding product to cart");
          }
        }
      } else if (sizeId === "") {
        Toast.showErrorToast("Please select size");
      } else if (variantId === "") {
        Toast.showErrorToast("Please select color");
      }
    } else {
      localStorage.setItem("path_name", window.location.pathname);
      localStorage.setItem("variant_id", variantId);
      localStorage.setItem("colour_id", colourId);
      localStorage.setItem("quantity", quantity);
      localStorage.setItem("size_id", sizeId);
      localStorage.setItem("cart_added", true);
      Toast.showSuccessToast("Please login for adding product to the cart");
      props.history.push("/auth/login");
    }
    setIsClicked(false);
  };

  const handleChangewishList = async (id) => {
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

            setWishlistFlag(!wishlist);
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
            setWishlistFlag(!wishlist);
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
      props.history.push("/auth/login");
    }
  };

  const handleViewProduct = async () => {
    try {
      await API.get(`${ENDPOINTS.VIEW_COUNT}/${productId}`, isLoggedIn);
    } catch (e) {
      const msg =
        typeof e.data.error?.message === "string"
          ? e.data.error?.message
          : e.data.error?.message?.[0];
      console.log(msg || "Error sending view count");
    }
  };

  useEffect(() => {
    fetchProductDetails();
    //eslint-disable-next-line
  }, [isLoggedIn]);

  useEffect(() => {
    handleViewProduct();
    //eslint-disable-next-line
  }, []);

  const classes = useStyles();
  return (
    <React.Fragment>
      <Container maxWidth="xl">
        {loading && <Loader />}
        <Box className={classes.root}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/home">
              <Typography className={classes.Link}>Home</Typography>
            </Link>
            <Link color="inherit">
              <Typography className={classes.Link}>
                {productDetails.title}
              </Typography>
            </Link>
          </Breadcrumbs>
          <br />
          <Grid container spacing={4}>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <Grid container>
                <Grid item xs={12} sm={12} md={12} lg={11} xl={10}>
                  <ItemsCarousel
                    requestToChangeActive={setActiveItemCoverIndex}
                    activeItemIndex={activeItemCoverIndex}
                    numberOfCards={1}
                    infiniteLoop="true"
                    leftChevron={
                      <ArrowBackIosIcon
                        fontSize="large"
                        style={{ marginRight: "-15px" }}
                      />
                    }
                    rightChevron={<ArrowForwardIosIcon fontSize="large" />}
                    outsideChevron
                    chevronWidth={30}
                  >
                    <div className={classes.Image}>
                      {imgLoading && (
                        <Lottie
                          animationData={ImgLoader}
                          style={{
                            display: "contents",
                            width: 600,
                            height: 600,
                          }}
                          className={classes.SRC}
                        />
                      )}
                      <img
                        className={classes.SRC}
                        src={coverImage}
                        alt="cover"
                        onLoad={() => setImgLoading(false)}
                        style={{
                          display: imgLoading ? "none" : "inline",
                        }}
                      />
                    </div>
                    {productImage?.length > 0 &&
                      productImage.map((coverImage, index) =>
                        coverImage !== null ? (
                          <div key={index} className={classes.Image}>
                            <img
                              className={classes.SRC}
                              src={coverImage}
                              alt="cover"
                            />
                          </div>
                        ) : (
                          ""
                        )
                      )}
                  </ItemsCarousel>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={11} xl={10}>
                  <ItemsCarousel
                    requestToChangeActive={setActiveItemVariantIndex}
                    activeItemIndex={activeItemVariantIndex}
                    numberOfCards={2}
                    infiniteLoop="true"
                    leftChevron={
                      <ArrowBackIosIcon
                        fontSize="large"
                        style={{ marginRight: "-15px" }}
                      />
                    }
                    rightChevron={<ArrowForwardIosIcon fontSize="large" />}
                    outsideChevron
                    chevronWidth={35}
                  >
                    {productDetails.variants
                      ? productDetails.variants.length > 1
                        ? productDetails.variants.map((variantImage, index) => (
                            <div
                              key={index}
                              onClick={() =>
                                handleChangeVariantCaraosalImage(variantImage)
                              }
                              className={classes.detailImage}
                            >
                              {imgLoadingCursol && (
                                <Lottie
                                  animationData={ImgLoader}
                                  style={{
                                    display: "contents",
                                    width: 600,
                                    height: 600,
                                  }}
                                  className={classes.SRC}
                                />
                              )}
                              <img
                                className={classes.SRC}
                                src={variantImage.cover_image_url}
                                alt="variant"
                                onLoad={() => setImgLoadingCursol(false)}
                                style={{
                                  display: imgLoadingCursol ? "none" : "inline",
                                }}
                              />
                            </div>
                          ))
                        : ""
                      : ""}
                  </ItemsCarousel>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <Grid container direction="column" style={{ marginTop: "22px" }}>
                <Grid item>
                  <Typography
                    style={{
                      fontWeight: 600,
                      fontSize: "24px",
                      textTransform: "capitalize",
                      marginBottom: "20px",
                    }}
                  >
                    {productDetails.title}
                  </Typography>
                </Grid>
                {productDetails.customer_reviews ? (
                  productDetails.customer_reviews.reviews !== 0 ? (
                    <Grid container style={{ marginBottom: "20px" }}>
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
                  )
                ) : (
                  ""
                )}
                <div>
                  <span
                    style={{
                      textTransform: "capitalize",
                      fontSize: "24px",
                      fontWeight: 600,
                      marginBottom: "8px",
                    }}
                  >
                    $ {price}
                  </span>
                  {/* )} */}
                </div>
                <Grid container spacing={2}>
                  <Grid item xs={4} sm={4} md={3}>
                    <InputFieldHeading label={"Select Size"} />
                  </Grid>
                  <Grid item xs={6}>
                    <SizeChart product_id={productId} />
                  </Grid>
                </Grid>
                <Grid container spacing={2}>
                  {sizeList ? (
                    sizeList.length ? (
                      sizeList.map((size, index) => (
                        <Grid Item key={index}>
                          <div
                            onClick={() => handleSizeChange(size.size_id)}
                            style={{
                              height: "60px",
                              width: "60px",
                              borderRadius: "28px",
                              backgroundColor:
                                sizeId === size.size_id ? "#FC68A2" : "#F4F7FD",
                              marginTop: "20px",
                              marginLeft: "10px",
                              cursor: "pointer",
                              textAlign: "center",
                            }}
                          >
                            <span
                              style={{
                                position: "relative",
                                top: "30%",
                                fontSize: "16px",
                                fontWeight: 600,
                                textTransform: "capitalize",
                                color:
                                  sizeId === size.size_id
                                    ? "#FFFFFF"
                                    : "#242424",
                              }}
                            >
                              {size.title.substring(0, 3)}
                            </span>
                          </div>
                        </Grid>
                      ))
                    ) : (
                      <Grid item>
                        <span style={{ fontSize: "14px" }}>
                          No Size Available
                        </span>
                      </Grid>
                    )
                  ) : (
                    <Grid item>
                      <span style={{ fontSize: "14px" }}>
                        No Size Available
                      </span>
                    </Grid>
                  )}
                </Grid>
                <Grid item>
                  <InputFieldHeading label="Select Color " />
                </Grid>
                <Grid container spacing={3}>
                  {variantList ? (
                    variantList.length ? (
                      <div
                        style={{
                          display: "flex",
                          borderRadius: "24px",
                          marginTop: "20px",
                          marginLeft: "10px",
                          cursor: "p  ointer",
                          border: "1.4px solid #DFE7F5 ",
                        }}
                      >
                        {variantList.map((variantsColour, index) => (
                          <Grid item key={index}>
                            <div
                              title={variantsColour.variant_colour.name}
                              onClick={() =>
                                handleVariantChange(
                                  variantsColour.id,
                                  variantsColour.variant_colour.id,
                                  variantsColour.cover_image_url,
                                  variantsColour.variant_images
                                )
                              }
                              style={{
                                height: "42px",
                                width: "42px",
                                borderRadius: "28px",
                                backgroundColor: `${variantsColour.variant_colour.hex_code}`,
                                margin: "3px 12px 3px 12px",
                                cursor: "pointer",
                              }}
                            >
                              {variantsColour.id === variantId ? (
                                <CheckIcon
                                  style={{
                                    fontSize: "xx-large",
                                    color: "#FFFFFF",
                                    marginTop: "5px",
                                    marginLeft: "5px",
                                  }}
                                />
                              ) : (
                                ""
                              )}
                            </div>
                          </Grid>
                        ))}
                      </div>
                    ) : (
                      <Grid item>
                        <span style={{ fontSize: "14px" }}>
                          No Variant Available
                        </span>
                      </Grid>
                    )
                  ) : (
                    <Grid item>
                      <span style={{ fontSize: "14px" }}>
                        No Variant Available
                      </span>
                    </Grid>
                  )}
                </Grid>

                <Grid
                  container
                  style={{ marginBottom: "36px", marginTop: "35px" }}
                  spacing={3}
                >
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    {cartFlag === true || itemExist === true ? (
                      <PrimaryButton
                        variant="contained"
                        color="primary"
                        style={{ height: 52 }}
                        fullWidth
                        startIcon={<img alt="cart" src={cartIcon} />}
                        onClick={() => props.history.push("/cart")}
                      >
                        Go To Cart
                      </PrimaryButton>
                    ) : (
                      <PrimaryButton
                        disabled={
                          sizeFlag && colorFlag && !isClicked ? false : true
                        }
                        variant="contained"
                        color="primary"
                        style={{ height: 52 }}
                        fullWidth
                        startIcon={<img alt="cart" src={cartIcon} />}
                        onClick={
                          sizeFlag && colorFlag
                            ? () => handleSaveToCart()
                            : null
                        }
                      >
                        Add To Cart
                      </PrimaryButton>
                    )}
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    <Button
                      onClick={() => handleChangewishList(productDetails.id)}
                      startIcon={
                        <img
                          alt="wishlist"
                          src={
                            wishlist ? wishlistFilledIcon : wishlistUnFilledIcon
                          }
                        />
                      }
                      variant="outlined"
                      size="large"
                      fullWidth
                      color="secondary"
                      style={{ height: "52px", borderRadius: "8px" }}
                    >
                      {wishlist ? "Remove from Wishlist" : "Add To wishlist"}
                    </Button>
                  </Grid>
                </Grid>

                <Divider />
                <Grid container justifyContent="space-between">
                  <Grid item xs={12} md={6}>
                    <Typography
                      style={{
                        marginTop: "31px",
                        fontSize: "24px",
                        fontWeight: 600,
                        marginBottom: "36px",
                      }}
                    >
                      Product Detail
                    </Typography>
                  </Grid>
                  {productDetails.designer_info?.is_active === true && (
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      md={6}
                      className={classes.app_btn}
                    >
                      <OutlinedPrimaryButton
                        issecondary
                        style={{ display: "flex", alignItems: "center" }}
                        onClick={() =>
                          props.history.push({
                            pathname: `/create-appointment/${productDetails?.id}`,
                            state: {
                              DesignerId: productDetails?.designer_info?.id,
                              storeId: null,
                              product_id: productDetails?.id,
                              OrderItem: [
                                {
                                  product_id: productDetails?.id,
                                  product: productDetails?.title,
                                  is_custom_product:
                                    productDetails?.product_type ===
                                    "Ready to Wear"
                                      ? false
                                      : true,
                                  cover_image_url:
                                    productDetails?.cover_image_url,
                                },
                              ],
                            },
                          })
                        }
                      >
                        Book An Appointment
                      </OutlinedPrimaryButton>
                    </Grid>
                  )}
                </Grid>
                <Grid item>
                  <Typography className={classes.Heading}>
                    Product Details
                  </Typography>
                  <Typography className={classes.SubHeading}>
                    {productDetails.description}
                  </Typography>
                </Grid>
                <Grid container style={{ marginBottom: "23.5px" }} spacing={2}>
                  <Grid item xs={6}>
                    <Typography className={classes.Heading}>
                      Product Type
                    </Typography>
                    <Typography className={classes.SubHeading}>
                      {productDetails.product_type}
                    </Typography>
                  </Grid>
                  {productDetails.tags ? (
                    <Grid item xs={12} md={6}>
                      <Typography className={classes.Heading}>
                        Product Tags
                      </Typography>
                      <Typography className={classes.SubHeading}>
                        {productDetails.tags.join(", ")}
                      </Typography>
                    </Grid>
                  ) : (
                    ""
                  )}
                </Grid>

                <Divider />

                <Grid container style={{ marginTop: "39.5px" }} spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Grid container spacing={1}>
                      <Grid item>
                        <span className={classes.Heading}>Product Id:</span>
                      </Grid>
                      <Grid item>
                        <span className={classes.Heading}>
                          {productDetails.product_code
                            ? productDetails.product_code
                            : "N/A"}
                        </span>
                      </Grid>
                    </Grid>
                    <Grid container style={{ marginTop: "8px" }} spacing={1}>
                      <Grid item>
                        <span className={classes.SubHeading}>Brand Name: </span>
                      </Grid>
                      <Grid item>
                        <span className={classes.SubHeading}>
                          {productDetails.designer_info
                            ? productDetails.designer_info.brand_name
                              ? productDetails.designer_info.brand_name
                              : ""
                            : ""}
                        </span>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Typography className={classes.Heading}>
                      Product Category
                    </Typography>
                    <a
                      className={classes.Cat_Link}
                      href={`/product-listing/${productDetails.category}/${productDetails.parent_category}`}
                    >
                      <Typography className={classes.Link_text}>
                        {productDetails.category}
                      </Typography>
                    </a>
                  </Grid>
                </Grid>

                <br />
                <br />
              </Grid>
            </Grid>
          </Grid>
          <SimilarProductCarousal
            product_id={productId}
            history={props.history}
            parentCategoryId={parentCategoryId}
            parentCategoryTitle={productDetails.category}
          />

          <AverageRating
            product_id={productId}
            productTitle={productDetails.title}
            is_purchased={productDetails.is_purchased}
            fetchProductDetails={fetchProductDetails}
          />
        </Box>
      </Container>
    </React.Fragment>
  );
};

const mapStateToProps = ({ auth: { isAuthenticated } }) => ({
  isAuthenticated,
});

const mapDispatchToProps = (dispatch) => ({
  addToCart: (count) => dispatch(addToCart(count)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProductDetails);

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: 72,
    marginRight: 72,
    [theme.breakpoints.down("sm")]: {
      marginLeft: 24,
      marginRight: 24,
    },
  },
  Heading: {
    textTransform: "capitalize",
    color: "#242424",
    fontSize: "18px",
    fontWeight: 600,
    letterSpacing: 0,
    lineHeight: "28px",
    marginBottom: "16px",
    fontFamily: "Inter SemiBold",
  },
  SubHeading: {
    textTransform: "capitalize",
    color: "#242424",
    fontSize: "16px",
    letterSpacing: 0,
    lineHeight: "24px",
    marginBottom: "16px",
    fontFamily: "Inter Regular",
    wordBreak: "break-word",
  },
  Link: {
    "&:hover": {
      color: "#fc68a2",
    },
    textTransform: "capitalize",
    fontWeight: 500,
    fontSize: "10px",
    cursor: "pointer",
  },
  detailImage: {
    margin: "30px 10px 10px 10px",
    height: "320px",
    [theme.breakpoints.down("md")]: {
      height: "220px",
    },
    [theme.breakpoints.down("sm")]: {
      height: "120px",
    },
    borderRadius: "8px",
    backgroundColor: "#F4F7FD",
    cursor: "pointer",
  },
  Image: {
    margin: "30px 10px 10px 10px",
    height: "590px",
    [theme.breakpoints.down("md")]: {
      height: "390px",
    },
    [theme.breakpoints.down("sm")]: {
      height: "290px",
    },
    backgroundColor: "#FFF",
    border: "1px solid rgb(223, 231, 245)",
    borderRadius: "8px",
  },
  SRC: {
    height: "100%",
    width: "100%",
    borderRadius: "8px",
  },
  Visible: {
    height: "3em",
    width: "10em",
    background: "yellow",
  },
  app_btn: {
    alignSelf: "center",
    display: "flex",
    justifyContent: "flex-end",
    [theme.breakpoints.down("sm")]: {
      justifyContent: "flex-start",
      marginTop: "10px",
    },
  },
  Cat_Link: {
    textDecoration: "none",
  },
  Link_text: {
    textTransform: "capitalize",
    color: "#fc68a2",
    fontSize: "16px",
    letterSpacing: 0,
    lineHeight: "24px",
    marginBottom: "16px",
    fontFamily: "Inter Regular",
    wordBreak: "break-word",
  },
}));

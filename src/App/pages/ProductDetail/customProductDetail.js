/* eslint-disable array-callback-return */
import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  InputAdornment,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import {
  InputField,
  Loader,
  OutlinedPrimaryButton,
  PrimaryButton,
  Toast,
} from "../../components";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import wishlistUnFilledIcon from "../../assets/icons/wishlist-selected.svg";
import wishlistFilledIcon from "../../assets/icons/wishlist-filled.svg";
import cartIcon from "../../assets/icons/cart-unselected.svg";
import InputFieldHeading from "../../components/Form/InputFieldHeading";
import Rating from "@material-ui/lab/Rating";
import { connect } from "react-redux";
import ItemsCarousel from "react-items-carousel";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import AverageRating from "./components/averageRating";
import SizeChart from "./components/sizeChart";
import SimilarProductCarousal from "../ProductListing/components/SimilarProductCarousal";
import { API, ENDPOINTS } from "../../../api/apiService";
import { addToCart } from "../../../redux/actions/authActions";
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import Lottie from "lottie-react";
import ImgLoader from "../../assets/imageLoader.json";

const CustomProductDetails = (props) => {
  const isLoggedIn = props.isAuthenticated;
  const [productDetails, setProductDeatails] = useState({});
  const productId = window.location.pathname.split("/")[3];
  const parentCategoryId = window.location.pathname.split("/")[2];
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlistFlag] = useState(
    productDetails.wishlist === null ? false : true
  );
  const [wishlistId, setWishlistId] = useState(
    productDetails.wishlist == null ? "" : productDetails.wishlist.id
  );
  const [sizeId, setsizeId] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [productImage, setProductImage] = useState([]);
  const [cartFlag, setCartFlag] = useState(false);
  const [product, setProduct] = useState("");
  const [addedToWishList, setAddedToWishlist] = useState(false);
  const [activeItemCoverIndex, setActiveItemCoverIndex] = useState(0);
  const [sizeList, setSizeList] = useState([]);
  const [materialList, setMaterialList] = useState([]);
  const [accessoriesList, setAccessories] = useState([]);
  const [optionList, setOptionList] = useState([]);
  const [sizeFlag, setSizeFlag] = useState(false);
  const [price, setPrice] = useState("");
  const [imgLoading, setImgLoading] = useState(true);
  const [customSize, setCustomSize] = useState("No");
  const [sizeTitle, setSizeTitle] = useState("");
  const [measurementData, setMeasurementData] = useState({});
  const [measurementFeilds, setmeasurementFields] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedMaterial, setSelectedmaterial] = useState([]);
  const [selectedAccessories, setSelectedaccessories] = useState([]);
  const [materialTitle, setMaterialTitle] = useState("");
  const [accessoriesTitle, setAccessoriesTitle] = useState("");
  const [subOptionTitle, setSubOptionTitle] = useState({});
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (customSize === "No" && selectedMaterial.length !== 0) {
      setSizeFlag(sizeId ? true : false);
    } else if (customSize === "Yes" && selectedMaterial.length !== 0) {
      setSizeFlag(Object.keys(measurementData).length !== 0 ? true : false);
    }
  }, [sizeId, measurementData, customSize, selectedMaterial]);

  const getMeasurementDetails = async () => {
    const resp = await API.get(`/custom/common/${productId}/union`, false);
    if (resp.success) {
      let resData = [];
      let tempData = { ...measurementData };
      for (let i of resp.data) {
        tempData[i.title] = "";
        resData.push({
          id: i.id,
          title: i.title,
        });
      }
      setmeasurementFields(resData);
      setMeasurementData(tempData);
    }
  };

  const handleChangeMeasurement = (e) => {
    let tempData = { ...measurementData };
    tempData[e.target.name] = e.target.value;
    setMeasurementData(tempData);
  };

  useEffect(() => {
    localStorage.removeItem("path_name");
    getMeasurementDetails();
    setAddedToWishlist(localStorage.getItem("wislist_added") ? true : false);
    setProduct(
      localStorage.getItem("product_id")
        ? localStorage.getItem("product_id")
        : ""
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (addedToWishList && product && isLoggedIn) {
      if (!wishlist) handleChangewishList(product);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product, isLoggedIn, wishlist, addedToWishList]);

  /*get updated price on the basis of material and options*/

  const getUpdatedPrice = async () => {
    if (selectedOptions.length !== 0 && selectedMaterial.length !== 0) {
      const payload = {
        product: productId,
        options: selectedOptions,
        material: selectedMaterial,
        accessories: selectedAccessories,
      };
      try {
        const resp = await API.post(
          "/customer/cart/custom/price",
          payload,
          false
        );
        if (resp.success) {
          setPrice(resp.data.total_price);
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
  };

  /*get updated price on the basis of variant and size*/

  useEffect(() => {
    getUpdatedPrice();
    //eslint-disable-next-line
  }, [materialTitle, subOptionTitle, selectedAccessories]);

  const handleSizeChange = async (size_id, size_name) => {
    setsizeId(size_id);
    setSizeTitle(size_name);
  };

  const handleCustomFlagChange = (event) => {
    setCustomSize(event.target.value);
  };

  const handleMaterialSelected = (materialData) => {
    let tempMaterialList = [];
    tempMaterialList.push(materialData);
    setSelectedmaterial(tempMaterialList);
    setMaterialTitle(materialData.title);
  };

  const handleAccessoriesSelected = (accessoriesData) => {
    let tempAccessoriesList = [];
    tempAccessoriesList.push(accessoriesData);
    setSelectedaccessories(tempAccessoriesList);
    setAccessoriesTitle(accessoriesData.title);
  };

  const handleOptionSelected = (data, idx, parentOption) => {
    /*setting option title */

    let optionTitleObject = { ...subOptionTitle };
    optionTitleObject[parentOption.title] = data.title;
    setSubOptionTitle(optionTitleObject);
    /* setting selected option list */
    let tempOptionList = { ...parentOption };
    tempOptionList["child_option"] = data;
    let tempList = selectedOptions;
    let count = 0;
    tempList.length
      ? tempList.map((parentOptions, index) => {
          if (parentOptions.title === parentOption.title) {
            tempList[index] = tempOptionList;
            count = 0;
          } else if (parentOptions.title !== parentOption.title) {
            count = count + 1;
          }
        })
      : tempList.push(tempOptionList);
    if (count > 0) {
      tempList.push(tempOptionList);
      count = 0;
    }
    setSelectedOptions(tempList);
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
        setMaterialList(resp.data.materials);
        setAccessories(resp.data.accessories);
        setOptionList(resp.data.options);
        setPrice(resp.data.price);
        setSizeList(resp.data.product_sizes);
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
    if (!updating) {
      setUpdating(true);
      const payload = {
        product: productId,
        price: price,
        options: selectedOptions,
        material: selectedMaterial,
      };
      let measurementCount = 0;
      for (const [value] of Object.entries(measurementData)) {
        if (value === "") {
          measurementCount = measurementCount + 1;
        }
      }
      if (customSize === "No") {
        payload.size = sizeId;
      } else {
        payload.measurement = measurementData;
      }
      if (isLoggedIn) {
        if (customSize === "No" && sizeId === "") {
          Toast.showErrorToast("Please select size");
        } else if (
          customSize === "Yes" &&
          Object.keys(measurementData).length === 0
        ) {
          Toast.showErrorToast("Please add measurement data");
        } else if (customSize === "Yes" && measurementCount > 0) {
          Toast.showErrorToast("Please fill all measurement field");
        } else if (selectedMaterial.length === 0) {
          Toast.showErrorToast("Please add material");
        } else {
          try {
            const resp = await API.post("customer/cart/custom/", payload, true);
            if (resp.success) {
              setCartFlag(true);
              props.addToCart();
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
              Toast.showErrorToast("Error in adding product to cart");
            }
          }
        }
      } else {
        localStorage.setItem("path_name", window.location.pathname);
        Toast.showSuccessToast("Please login for adding product to the cart");
        props.history.push("/auth/login");
      }
      setUpdating(false);
    }
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
          : e.data.error?.message[0];
      console.log(msg || "Error sending view count");
    }
  };

  useEffect(() => {
    fetchProductDetails();
    //eslint-disable-next-line
  }, []);

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
                            width: 200,
                            height: 200,
                          }}
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
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6} md={6} lg={6} xl={6}>
              <Grid container direction="column" style={{ marginTop: "22px" }}>
                <Grid item>
                  <Typography
                    style={{
                      fontWeight: 600,
                      fontSize: "24px",
                      fontFamily: "Inter SemiBold",
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
                <Grid item>
                  <Typography
                    style={{
                      font: 500,
                      fontSize: "18px",
                      fontFamily: "Inter Medium",
                      textTransform: "capitalize",
                      marginBottom: "20px",
                    }}
                  >
                    Starting from
                  </Typography>
                </Grid>
                <Grid item style={{ marginBottom: "30px" }}>
                  <span
                    style={{
                      textTransform: "capitalize",
                      fontSize: "24px",
                      fontWeight: 600,
                      marginBottom: "30px",
                    }}
                  >
                    $ {price}
                  </span>
                </Grid>
                <Divider />
                <Grid
                  container
                  justifyContent="space-between"
                  xs={12}
                  style={{
                    marginTop: "30px",
                  }}
                >
                  <Grid item xs={12} sm={12} md={6}>
                    <Typography
                      style={{
                        fontWeight: 600,
                        fontSize: "18px",
                        fontFamily: "Inter SemiBold",
                      }}
                    >
                      Customize to see the price {"  "} or
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
                                    productDetails?.is_custom_product,
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
                {optionList?.map((optionData, idx) => {
                  return (
                    <div key={idx} className={classes.customizeBorder}>
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1a-content"
                          id="panel1a-header"
                        >
                          <span className={classes.customizeOptionHeading}>
                            {optionData.title}
                            {subOptionTitle[optionData.title] ? ": " : " "}
                          </span>
                          <span
                            style={{ color: "#FC68A2", marginLeft: "5px" }}
                            className={classes.SubHeading}
                          >
                            {""}{" "}
                            {subOptionTitle[optionData.title]
                              ? subOptionTitle[optionData.title]
                              : ""}
                          </span>
                        </AccordionSummary>
                        <AccordionDetails>
                          <Grid container spacing={2}>
                            {optionData.child_option.map(
                              (subOptionsData, index) =>
                                subOptionsData.is_selected ? (
                                  <Grid
                                    key={index}
                                    item
                                    xs={12}
                                    sm={6}
                                    md={4}
                                    lg={3}
                                    xl={3}
                                  >
                                    <div
                                      onClick={() =>
                                        handleOptionSelected(
                                          subOptionsData,
                                          idx,
                                          optionData
                                        )
                                      }
                                      className={classes.optionImagesDiv}
                                      title={subOptionsData.title}
                                      style={{
                                        border:
                                          subOptionTitle[optionData.title] ===
                                          subOptionsData.title
                                            ? "2px solid #FC68A2"
                                            : "2px solid #FFFFFF",
                                      }}
                                    >
                                      <img
                                        alt="img"
                                        src={subOptionsData.cover_image_url}
                                        style={{
                                          height: "100%",
                                          width: "100%",
                                          borderRadius: "10px",
                                        }}
                                      />
                                    </div>
                                  </Grid>
                                ) : (
                                  ""
                                )
                            )}
                          </Grid>
                        </AccordionDetails>
                      </Accordion>
                    </div>
                  );
                })}
                <div className={classes.customizeBorder}>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <span className={classes.customizeOptionHeading}>
                        Material{materialTitle ? ": " : " "}
                      </span>
                      <span
                        style={{ color: "#FC68A2", marginLeft: "5px" }}
                        className={classes.SubHeading}
                      >
                        {""} {materialTitle}
                      </span>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        {materialList?.map((materialData, index) => {
                          return materialData.is_selected ? (
                            <Grid
                              key={index}
                              item
                              xs={12}
                              sm={6}
                              md={4}
                              lg={3}
                              xl={3}
                            >
                              <div
                                onClick={() =>
                                  handleMaterialSelected(materialData)
                                }
                                className={classes.optionImagesDiv}
                                title={materialData.title}
                                style={{
                                  border:
                                    materialTitle === materialData.title
                                      ? "2px solid #FC68A2"
                                      : "2px solid #FFFFFF",
                                }}
                              >
                                <img
                                  alt="img"
                                  src={materialData.cover_image_url}
                                  style={{
                                    height: "100%",
                                    width: "100%",
                                    borderRadius: "10px",
                                  }}
                                />
                              </div>
                            </Grid>
                          ) : (
                            ""
                          );
                        })}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </div>
                <div className={classes.customizeBorder}>
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <span className={classes.customizeOptionHeading}>
                        Accessories{accessoriesTitle ? ": " : " "}
                      </span>
                      <span
                        style={{ color: "#FC68A2", marginLeft: "5px" }}
                        className={classes.SubHeading}
                      >
                        {""} {accessoriesTitle}
                      </span>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container spacing={2}>
                        {accessoriesList?.map((accessories, index) => {
                          return accessories.is_selected ? (
                            <Grid
                              key={index}
                              item
                              xs={12}
                              sm={6}
                              md={4}
                              lg={3}
                              xl={3}
                            >
                              <div
                                onClick={() =>
                                  handleAccessoriesSelected(accessories)
                                }
                                className={classes.optionImagesDiv}
                                title={accessories.title}
                                style={{
                                  border:
                                    accessoriesTitle === accessories.title
                                      ? "2px solid #FC68A2"
                                      : "2px solid #FFFFFF",
                                }}
                              >
                                <img
                                  alt="img"
                                  src={accessories.cover_image_url}
                                  style={{
                                    height: "100%",
                                    width: "100%",
                                    borderRadius: "10px",
                                  }}
                                />
                              </div>
                            </Grid>
                          ) : (
                            ""
                          );
                        })}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </div>

                <div
                  style={{ marginBottom: "30px" }}
                  className={classes.customizeBorder}
                >
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Grid container spacing={2}>
                        <Grid item>
                          <span className={classes.customizeOptionHeading}>
                            Size & Measurements:
                          </span>
                          <span
                            style={{ color: "#FC68A2" }}
                            className={classes.SubHeading}
                          >
                            {customSize === "Yes"
                              ? " Custom Size"
                              : " Standard Size"}
                            {sizeTitle && customSize === "No" ? ": " : ""}
                            {customSize === "Yes" ? "" : sizeTitle}
                          </span>
                        </Grid>
                      </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Grid container>
                        <Grid item xs={12}>
                          <Typography className={classes.selectSize}>
                            Select Size
                          </Typography>
                          <FormControl component="fieldset">
                            <RadioGroup
                              row
                              aria-label="size"
                              name="size"
                              value={customSize}
                              onChange={handleCustomFlagChange}
                            >
                              <FormControlLabel
                                value="No"
                                control={<Radio />}
                                label="Standard Size"
                              />
                              <FormControlLabel
                                value="Yes"
                                control={<Radio />}
                                label="Custom Size"
                              />
                            </RadioGroup>
                          </FormControl>
                        </Grid>
                        {customSize === "Yes" ? (
                          <Grid container spacing={1}>
                            {measurementFeilds.map((data, index) => {
                              return (
                                <Grid
                                  key={index}
                                  item
                                  xs={12}
                                  sm={12}
                                  md={6}
                                  lg={5}
                                  xl={3}
                                >
                                  <InputFieldHeading label={data.title} />
                                  <InputField
                                    type="number"
                                    name={data.title}
                                    placeholder="Enter value"
                                    variant="outlined"
                                    onWheel={(e) => e.target.blur()}
                                    onChange={(e) => handleChangeMeasurement(e)}
                                    fullWidth
                                    value={measurementData[data.title]}
                                    InputProps={{
                                      endAdornment: (
                                        <InputAdornment
                                          style={{ marginRight: "10px" }}
                                          position="end"
                                        >
                                          in
                                        </InputAdornment>
                                      ),
                                    }}
                                  />
                                </Grid>
                              );
                            })}
                          </Grid>
                        ) : (
                          <>
                            <Grid item xs={8}>
                              <Grid container spacing={2}>
                                {sizeList ? (
                                  sizeList.length ? (
                                    sizeList.map((size, index) => (
                                      <Grid Item key={index}>
                                        <div
                                          onClick={() =>
                                            handleSizeChange(
                                              size.size_id,
                                              size.title
                                            )
                                          }
                                          style={{
                                            height: "60px",
                                            width: "60px",
                                            borderRadius: "28px",
                                            backgroundColor:
                                              sizeId === size.size_id
                                                ? "#FC68A2"
                                                : "#F4F7FD",
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
                            </Grid>
                            <Grid style={{ marginTop: "10px" }} item xs={4}>
                              <SizeChart product_id={productId} />
                            </Grid>
                          </>
                        )}
                      </Grid>
                    </AccordionDetails>
                  </Accordion>
                </div>
                <Divider />

                <Grid
                  container
                  style={{ marginBottom: "36px", marginTop: "35px" }}
                  spacing={3}
                >
                  <Grid item xs={12} sm={12} md={6} lg={6}>
                    {cartFlag === true ? (
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
                        disabled={sizeFlag ? false : true}
                        variant="contained"
                        color="primary"
                        style={{ height: 52 }}
                        fullWidth
                        startIcon={<img alt="cart" src={cartIcon} />}
                        onClick={sizeFlag ? () => handleSaveToCart() : null}
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

                <Grid item>
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
                <Grid item>
                  <Typography className={classes.Heading}>
                    Product Details
                  </Typography>
                  <Typography className={classes.SubHeading}>
                    {productDetails.description}
                  </Typography>
                </Grid>
                <Grid container style={{ marginBottom: "23.5px" }} spacing={2}>
                  <Grid item xs={12} md={6}>
                    <Typography className={classes.Heading}>
                      Product Type
                    </Typography>
                    <Typography className={classes.SubHeading}>
                      {productDetails.is_custom_product
                        ? "Custom Product"
                        : "Ready To Wear"}
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
                        <Typography className={classes.Heading}>
                          Product Id:
                        </Typography>
                      </Grid>
                      <Grid item>
                        <Typography className={classes.Heading}>
                          {productDetails.product_code
                            ? productDetails.product_code
                            : "N/A"}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CustomProductDetails);

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
    fontFamily: "Inter SemiBold",
    fontWeight: 600,
    letterSpacing: 0,
    lineHeight: "28px",
    marginBottom: "16px",
  },
  SubHeading: {
    textTransform: "capitalize",
    color: "#242424",
    fontSize: "16px",
    fontFamily: "Inter Regular",
    letterSpacing: 0,
    lineHeight: "24px",
    marginBottom: "16px",
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
  customizeBorder: {
    boxSizing: "border-box",
    border: "1px solid #DFE7F5",
    borderRadius: "12px",
    paddingLeft: "16px",
    paddingTop: "8px",
    paddingBottom: "10px",
    marginTop: "30px",
  },
  optionImagesDiv: {
    height: "128px",
    maxWidth: "128px",
    borderRadius: "10px",
    backgroundColor: "#F4F7FD",
    cursor: "pointer",
  },
  customizeOptionHeading: {
    textTransform: "capitalize",
    color: "#242424",
    fontSize: "18px",
    fontFamily: "Inter SemiBold",
    fontWeight: 600,
    letterSpacing: 0,
    lineHeight: "24px",
  },
  selectSize: {
    fontSize: "16px",
    fontFamily: "Inter SemiBold",
    fontWeight: 600,
    marginBottom: "5px",
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

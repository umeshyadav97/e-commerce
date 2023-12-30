/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Divider, Grid, Slider, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { API, ENDPOINTS } from "../../../../api/apiService";
import Accordion from "@material-ui/core/Accordion";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AddIcon from "@material-ui/icons/Add";
import MinimizeIcon from "@material-ui/icons/Minimize";
import { makeStyles } from "@material-ui/core/styles";
import { SearchInput } from "../../../components";
import useDebounce from "../../../hooks/useDebounce";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControl from "@material-ui/core/FormControl";

export default function ProductFilter(props) {
  const classes = useStyles();
  const [sub_category_list, setSubCategoryList] = useState([]);
  const [brand_list, setBrandList] = useState([]);
  const [colour_list, setColourList] = useState([]);
  const [size_list, setSizeList] = useState([]);
  const [is_custom_product, setIsCustomProduct] = useState("");
  const [price, setPrice] = React.useState([1, 2000]);
  const [category_filter_list, setFilterCategoryList] = useState([]);
  const [brand_filter_list, setFilterBrandList] = useState([]);
  const [colour_filter_list, setColourFilterList] = useState([]);
  const [size_filter_list, setSizeFilterList] = useState([]);
  const [brandExpanded, setBrandExpanded] = useState(true);
  const [colorExpanded, setcolorExpanded] = useState(true);
  const [categoryExpanded, setCategoryExpanded] = useState(true);
  const [category_search, setCategorySearch] = useState("");
  const [colour_search, setColourSearch] = useState("");
  const [brand_search, setBrandSearch] = useState("");
  const [product_type_state, setProductState] = React.useState({
    ready_to_wear: "",
    custom_product: "",
  });
  const [colourMoreFlag, setColourMoreFlag] = useState(false);
  const [categoryMoreFlag, setCategoryMoreFlag] = useState(false);
  const [brandMoreFlag, setBrandMoreFlag] = useState(false);
  const debouncedPriceTerm = useDebounce(price, 1000);
  const debouncedCategoryTerm = useDebounce(category_search, 1000);
  const debouncedBrandTerm = useDebounce(brand_search, 1000);
  const debouncedColorTerm = useDebounce(colour_search, 1000);
  const [value, setValue] = useState("");
  const [parentcategoryList, setParentCategoryList] = useState([]);
  const [parentId, setParentId] = useState(props.category_id);
  const [search, setSearch] = useState(props.search ? props.search : "");
  useEffect(() => {
    setSearch(props.search ? props.search : "");
  }, [props.search]);

  const getParentCategoryList = async () => {
    try {
      const resp = await API.get(ENDPOINTS.PARENT_CATEGORIES, false);
      if (resp.success) {
        let resData = [];
        for (let i of resp.data) {
          resData.push({
            id: i.id,
            title: i.title,
          });
        }
        setParentCategoryList(resData);
      }
    } catch (e) {
      console.log(e, "error in get parent category list");
    }
  };

  useEffect(() => {
    if (search !== "") {
      getParentCategoryList();
    }
  }, []);

  useEffect(() => {
    setParentId(props.category_id);
  }, [props.category_id]);

  const handleParentCategoryChange = (event) => {
    setValue(event.target.value);
    setParentId(event.target.name);
    props.setParentCategoryId(event.target.name);
  };
  const handleChangeColourFlag = () => {
    setColourMoreFlag(true);
  };
  const handleChangeCategoryFlag = () => {
    setCategoryMoreFlag(true);
  };
  const handleChangeBrandFlag = () => {
    setBrandMoreFlag(true);
  };

  const handleCategorySearchInput = (e) => {
    setCategorySearch(e.target.value);
  };

  const handleCategoryCloseSearch = () => {
    if (category_search !== "") {
      setCategorySearch("");
    }
  };

  const handleColourSearchInput = (e) => {
    setColourSearch(e.target.value);
  };

  const handleColourCloseSearch = () => {
    if (colour_search !== "") {
      setColourSearch("");
    }
  };

  const handleBrandSearchInput = (e) => {
    setBrandSearch(e.target.value);
  };

  const handleBrandCloseSearch = () => {
    if (brand_search !== "") {
      setBrandSearch("");
    }
  };

  useEffect(() => {
    getSubCategoryList();
  }, [debouncedCategoryTerm]);

  useEffect(() => {
    getSizeList();
  }, []);

  useEffect(() => {
    getColourList();
  }, [debouncedColorTerm]);

  useEffect(() => {
    getBrandList();
  }, [debouncedBrandTerm]);

  const handleCategoryAccodionChange = (panel) => (event, isExpanded) => {
    setCategoryExpanded(isExpanded ? panel : false);
  };

  const handleColorAccordionChange = (panel) => (event, isExpanded) => {
    setcolorExpanded(isExpanded ? panel : false);
  };

  const handleBrandAccodionChange = (panel) => (event, isExpanded) => {
    setBrandExpanded(isExpanded ? panel : false);
  };

  const handleSubCategoryChange = (event) => {
    let newCategoryList = [...category_filter_list];
    if (event.target.checked === true) {
      newCategoryList.push(event.target.id);
      setFilterCategoryList(newCategoryList);
    } else if (event.target.checked === false) {
      var index = newCategoryList.indexOf(event.target.id);
      if (index > -1) {
        newCategoryList.splice(index, index + 1);
        setFilterCategoryList(newCategoryList);
      }
    }
  };

  const handleColourFilterChange = (event) => {
    let newColourList = [...colour_filter_list];
    if (event.target.checked === true) {
      newColourList.push(event.target.id);
      setColourFilterList(newColourList);
    } else if (event.target.checked === false) {
      var index = newColourList.indexOf(event.target.id);
      if (index > -1) {
        newColourList.splice(index, index + 1);
        setColourFilterList(newColourList);
      }
    }
  };

  const handleSizeFilterChange = (event) => {
    let newSizeList = [...size_filter_list];
    if (event.target.checked === true) {
      newSizeList.push(event.target.id);
      setSizeFilterList(newSizeList);
    } else if (event.target.checked === false) {
      var index = newSizeList.indexOf(event.target.id);
      if (index > -1) {
        newSizeList.splice(index, index + 1);
        setSizeFilterList(newSizeList);
      }
    }
  };

  const handleBrandFilterChange = (event) => {
    let newBrandList = [...brand_filter_list];
    if (event.target.checked === true) {
      newBrandList.push(event.target.id);
      setFilterBrandList(newBrandList);
    } else if (event.target.checked === false) {
      var index = newBrandList.indexOf(event.target.id);
      if (index > -1) {
        newBrandList.splice(index, index + 1);
        setFilterBrandList(newBrandList);
      }
    }
  };

  const handleProductTypeChange = (event) => {
    setProductState({
      ...product_type_state,
      [event.target.name]: event.target.checked,
    });
  };

  useEffect(() => {
    if (
      (product_type_state.ready_to_wear === true &&
        product_type_state.custom_product === "") ||
      (product_type_state.ready_to_wear === true &&
        product_type_state.custom_product === false)
    ) {
      setIsCustomProduct(false);
    }
    if (
      (product_type_state.ready_to_wear === false &&
        product_type_state.custom_product === "") ||
      (product_type_state.ready_to_wear === false &&
        product_type_state.custom_product === false)
    ) {
      setIsCustomProduct("");
    }
    if (
      (product_type_state.custom_product === true &&
        product_type_state.ready_to_wear === "") ||
      (product_type_state.custom_product === true &&
        product_type_state.ready_to_wear === false)
    ) {
      setIsCustomProduct(true);
    }
    if (
      (product_type_state.custom_product === false &&
        product_type_state.ready_to_wear === "") ||
      (product_type_state.custom_product === false &&
        product_type_state.ready_to_wear === false)
    ) {
      setIsCustomProduct("");
    }
    if (
      product_type_state.ready_to_wear === true &&
      product_type_state.custom_product === true
    ) {
      setIsCustomProduct("");
    }
    if (
      product_type_state.ready_to_wear === "" &&
      product_type_state.custom_product === ""
    ) {
      setIsCustomProduct("");
    }
  }, [product_type_state]);

  const handlePriceChange = (event, newValue) => {
    setPrice(newValue);
  };

  useEffect(() => {
    if (search !== "") {
      props.getProductListFromSearch(
        price,
        is_custom_product,
        size_filter_list,
        category_filter_list,
        brand_filter_list,
        colour_filter_list
      );
    } else {
      props.fetchProductList(
        price,
        is_custom_product,
        size_filter_list,
        category_filter_list,
        brand_filter_list,
        colour_filter_list
      );
    }
  }, [
    debouncedPriceTerm,
    is_custom_product,
    size_filter_list,
    category_filter_list,
    brand_filter_list,
    colour_filter_list,
    props.sortValue,
    parentId,
  ]);

  useEffect(() => {
    getSubCategoryList();
    getColourList();
    getBrandList();
    getSizeList();
  }, [
    debouncedPriceTerm,
    is_custom_product,
    size_filter_list,
    category_filter_list,
    brand_filter_list,
    colour_filter_list,
    parentId,
  ]);

  const start_price = price ? price[0] : 1;
  const end_price = price ? price[1] : 2000;
  const is_custom =
    is_custom_product === undefined || is_custom_product === ""
      ? ""
      : `&is_custom_product=${is_custom_product}`;
  const is_size =
    size_filter_list.length !== 0
      ? `&size=${size_filter_list.join("&size=")}`
      : "";
  const is_Category_filter_list =
    category_filter_list.length !== 0
      ? `&sub_category=${category_filter_list.join("&sub_category=")}`
      : "";
  const is_brand_filter_list =
    brand_filter_list.length !== 0
      ? `&brand=${brand_filter_list.join("&brand=")}`
      : "";
  const is_colour_filter_list =
    colour_filter_list.length !== 0
      ? `&c_id=${colour_filter_list.join("&c_id=")}`
      : "";

  const getSubCategoryList = async () => {
    let categorySearch =
      category_search !== "" ? `&search=${category_search}` : "";
    if (parentId !== "") {
      const resp = await API.get(
        "/product/common/sub-category/" +
          `${parentId}` +
          `?start_price=${start_price}&end_price=${end_price}` +
          `${categorySearch}` +
          `${is_custom}` +
          `${is_Category_filter_list}` +
          `${is_brand_filter_list}` +
          `${is_colour_filter_list}` +
          `${is_size}` +
          `&page=1` +
          `&page_size=20`,
        false
      );
      if (resp.success) {
        let resData = [];
        for (let i of resp.data) {
          resData.push({
            id: i.sub_category_id,
            title: i.title,
            count: i.count,
          });
        }
        setSubCategoryList(resData);
      }
    }
  };

  const getSizeList = async () => {
    if (parentId !== "") {
      const resp = await API.get(
        "product/customer/" +
          `${parentId}` +
          "/used/size" +
          `?start_price=${start_price}&end_price=${end_price}` +
          `${is_custom}` +
          `${is_Category_filter_list}` +
          `${is_brand_filter_list}` +
          `${is_colour_filter_list}` +
          `${is_size}` +
          `&page=1` +
          `&page_size=20`,
        false
      );
      if (resp.success) {
        setSizeList(resp.data);
      }
    }
  };

  const getBrandList = async () => {
    let brandSearch = brand_search !== "" ? `&search=${brand_search}` : "";
    if (parentId !== "") {
      const resp = await API.get(
        "/product/customer/brand/" +
          `${parentId}` +
          `?start_price=${start_price}&end_price=${end_price}` +
          `${brandSearch}` +
          `${is_custom}` +
          `${is_Category_filter_list}` +
          `${is_brand_filter_list}` +
          `${is_colour_filter_list}` +
          `${is_size}` +
          `&page=1` +
          `&page_size=20`,
        false
      );
      if (resp.success) {
        let resData = [];
        for (let i of resp.data) {
          resData.push({
            id: i.id,
            brand: i.brand_name,
          });
        }
        setBrandList(resData);
      }
    }
  };

  const getColourList = async () => {
    let colourSearch =
      colour_search !== "" ? `&colour_search=${colour_search}` : "";
    if (parentId !== "") {
      const resp = await API.get(
        "/product/customer/" +
          `${parentId}` +
          "/used/colour" +
          `?start_price=${start_price}&end_price=${end_price}` +
          `${colourSearch}` +
          `${is_custom}` +
          `${is_Category_filter_list}` +
          `${is_brand_filter_list}` +
          `${is_colour_filter_list}` +
          `${is_size}` +
          `&page=1` +
          `&page_size=20`,
        false
      );
      if (resp.success) {
        let resData = [];
        for (let i of resp.data) {
          resData.push({
            id: i.id,
            name: i.name,
            hex_code: i.hex_code,
          });
        }
        setColourList(resData);
      }
    }
  };

  return (
    <React.Fragment>
      <Grid container justify="space-between">
        <Typography
          style={{ fontSize: "18px", fontWeight: 600, marginBottom: "10px" }}
        >
          Filter
        </Typography>
        <Typography
          onClick={() => window.location.reload()}
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#FC68A2",
            marginTop: "3px",
            cursor: "pointer",
          }}
        >
          CLEAR ALL
        </Typography>
      </Grid>
      <Box>
        <div
          style={{
            border: "1.6px solid #DFE7F5",
            borderRadius: "8px",
            backgroundColor: "#FFFFFF",
            minWidth: "210px",
          }}
        >
          {search !== "" ? (
            <>
              <Grid
                container
                direction="column"
                style={{
                  marginLeft: "12px",
                  marginBottom: "15px",
                  marginTop: "15px",
                }}
              >
                <Typography className={classes.heading}>
                  Product Category
                </Typography>
                <FormControl component="fieldset">
                  <RadioGroup
                    column
                    aria-label="parent"
                    name={parentId}
                    value={value}
                    onChange={handleParentCategoryChange}
                  >
                    {parentcategoryList
                      ? parentcategoryList.slice(0, 4).map((data, index) => {
                          return (
                            <FormControlLabel
                              value={data.title}
                              key={index}
                              name={data.id}
                              control={<Radio />}
                              label={data.title}
                            />
                          );
                        })
                      : ""}
                  </RadioGroup>
                </FormControl>
              </Grid>
              <Divider />
            </>
          ) : (
            ""
          )}
          {search === "" || value !== "" ? (
            <>
              <Grid
                container
                direction="column"
                style={{
                  marginLeft: "12px",
                  marginBottom: "15px",
                  marginTop: "15px",
                }}
              >
                <Typography className={classes.heading}>
                  Product Type
                </Typography>
                <FormGroup column="true">
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={product_type_state.ready_to_wear}
                        onChange={handleProductTypeChange}
                        name="ready_to_wear"
                      />
                    }
                    label="Ready to Wear"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={product_type_state.custom_product}
                        onChange={handleProductTypeChange}
                        name="custom_product"
                      />
                    }
                    label="Custom Wear"
                  />
                </FormGroup>
              </Grid>
              <Divider />
              <Grid container direction="column" className={classes.root}>
                <Accordion
                  expanded={categoryExpanded}
                  onChange={handleCategoryAccodionChange("category")}
                >
                  <AccordionSummary
                    expandIcon={
                      categoryExpanded ? (
                        <MinimizeIcon
                          fontSize="large"
                          style={{ marginTop: "-15px" }}
                        />
                      ) : (
                        <AddIcon />
                      )
                    }
                    aria-controls="category-content"
                    id="category-header"
                  >
                    <Typography className={classes.heading}>
                      Category
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <FormGroup column="true">
                      <Grid item style={{ marginTop: "-15px" }}>
                        <SearchInput
                          is_open={false}
                          is_input_open={true}
                          value={category_search}
                          onChange={handleCategorySearchInput}
                          onClose={handleCategoryCloseSearch}
                          placeholder="Search ..."
                        />
                      </Grid>
                      {sub_category_list.length > 0 &&
                      categoryMoreFlag === false ? (
                        sub_category_list.slice(0, 2).map((data, index) => {
                          return (
                            <FormControlLabel
                              key={index}
                              style={{ textTransform: "capitalize" }}
                              control={
                                <Checkbox
                                  size="small"
                                  key={index}
                                  id={data.id}
                                  onChange={handleSubCategoryChange}
                                  name={data.title}
                                />
                              }
                              label={data.title + `(${data.count})`}
                            />
                          );
                        })
                      ) : sub_category_list.length === 0 ? (
                        <Typography style={{ marginTop: "15px" }}>
                          No Category Available
                        </Typography>
                      ) : (
                        ""
                      )}
                      {categoryMoreFlag === true ? (
                        sub_category_list.map((data, index) => {
                          return (
                            <FormControlLabel
                              key={index}
                              style={{ textTransform: "capitalize" }}
                              control={
                                <Checkbox
                                  size="small"
                                  key={index}
                                  id={data.id}
                                  onChange={handleSubCategoryChange}
                                  name={data.title}
                                />
                              }
                              label={data.title + `(${data.count})`}
                            />
                          );
                        })
                      ) : sub_category_list.length > 2 ? (
                        <span
                          onClick={handleChangeCategoryFlag}
                          className={classes.viewMore}
                        >
                          {" "}
                          + View More
                        </span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </AccordionDetails>
                </Accordion>
              </Grid>
              <Divider />
              <Grid
                container
                direction="column"
                style={{
                  marginLeft: "12px",
                  marginBottom: "15px",
                  marginTop: "15px",
                }}
              >
                <Typography className={classes.heading}>
                  Price Range (USD)
                </Typography>
                <Typography className={classes.subHeading}>
                  ${price[0]} - $ {price[1]}
                </Typography>
                <Grid item xs={10} md={10} sm={10} xl={10} lg={10}>
                  <Slider
                    min={1}
                    max={2000}
                    step={10}
                    value={price}
                    onChange={handlePriceChange}
                    valueLabelDisplay="auto"
                    aria-labelledby="range-slider"
                    color="secondary"
                  />
                </Grid>
              </Grid>
              <Divider />
              <Grid
                container
                direction="column"
                style={{
                  marginLeft: "12px",
                  marginBottom: "15px",
                  marginTop: "15px",
                }}
              >
                <Typography className={classes.heading}>Size</Typography>

                <FormGroup row>
                  {size_list.length > 0 ? (
                    size_list.map((data, index) => {
                      return (
                        <Grid key={index} item xs={12}>
                          <FormControlLabel
                            style={{ textTransform: "capitalize" }}
                            control={
                              <Checkbox
                                size="small"
                                id={data.id}
                                key={index}
                                onChange={handleSizeFilterChange}
                                name={data.title}
                              />
                            }
                            label={data.title}
                          />
                        </Grid>
                      );
                    })
                  ) : (
                    <Typography variant="h6" style={{ marginTop: "15px" }}>
                      No Size Available
                    </Typography>
                  )}
                </FormGroup>
              </Grid>

              <Divider />
              <Grid container direction="column" className={classes.root}>
                <Accordion
                  expanded={brandExpanded}
                  onChange={handleBrandAccodionChange("brand")}
                >
                  <AccordionSummary
                    expandIcon={
                      brandExpanded ? (
                        <MinimizeIcon
                          fontSize="large"
                          style={{ marginTop: "-15px" }}
                        />
                      ) : (
                        <AddIcon />
                      )
                    }
                    aria-controls="brand-content"
                    id="brand-header"
                  >
                    <Typography className={classes.heading}>Brand</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <FormGroup column="true">
                      <Grid item style={{ marginTop: "-15px" }}>
                        <SearchInput
                          is_open={false}
                          is_input_open={true}
                          value={brand_search}
                          onChange={handleBrandSearchInput}
                          onClose={handleBrandCloseSearch}
                          placeholder="Search ..."
                        />
                      </Grid>
                      {brand_list.length > 0 && brandMoreFlag === false ? (
                        brand_list.slice(0, 2).map((data, index) => {
                          return (
                            <FormControlLabel
                              key={index}
                              style={{ textTransform: "capitalize" }}
                              control={
                                <Checkbox
                                  size="small"
                                  key={index}
                                  id={data.id}
                                  onChange={handleBrandFilterChange}
                                  name={data.brand}
                                />
                              }
                              label={data.brand}
                            />
                          );
                        })
                      ) : brand_list.length === 0 ? (
                        <Typography variant="h6" style={{ marginTop: "15px" }}>
                          No Brand Available
                        </Typography>
                      ) : (
                        ""
                      )}
                      {brandMoreFlag === true ? (
                        brand_list.map((data, index) => {
                          return (
                            <FormControlLabel
                              key={index}
                              style={{ textTransform: "capitalize" }}
                              control={
                                <Checkbox
                                  size="small"
                                  id={data.id}
                                  key={index}
                                  onChange={handleBrandFilterChange}
                                  name={data.brand}
                                />
                              }
                              label={data.brand}
                            />
                          );
                        })
                      ) : brand_list.length > 2 ? (
                        <span
                          onClick={handleChangeBrandFlag}
                          className={classes.viewMore}
                        >
                          {" "}
                          + View More
                        </span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </AccordionDetails>
                </Accordion>
              </Grid>
              <Divider />
              <Grid container direction="column" className={classes.root}>
                <Accordion
                  expanded={colorExpanded}
                  onChange={handleColorAccordionChange("color")}
                >
                  <AccordionSummary
                    expandIcon={
                      colorExpanded ? (
                        <MinimizeIcon
                          fontSize="large"
                          style={{ marginTop: "-15px" }}
                        />
                      ) : (
                        <AddIcon />
                      )
                    }
                    aria-controls="colour-content"
                    id="colour-header"
                  >
                    <Typography className={classes.heading}>Color</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <FormGroup column="true">
                      <Grid item style={{ marginTop: "-15px" }}>
                        <SearchInput
                          is_open={false}
                          is_input_open={true}
                          value={colour_search}
                          onChange={handleColourSearchInput}
                          onClose={handleColourCloseSearch}
                          placeholder="Search ..."
                        />
                      </Grid>
                      {colour_list.length > 0 && colourMoreFlag === false ? (
                        colour_list.slice(0, 2).map((data, index) => {
                          return (
                            <Grid container key={index}>
                              <Grid item xs={10}>
                                <FormControlLabel
                                  style={{
                                    textTransform: "capitalize",
                                    marginBottom: "5px",
                                    marginTop: "5px",
                                  }}
                                  control={
                                    <Checkbox
                                      size="small"
                                      id={data.id}
                                      key={index}
                                      onChange={handleColourFilterChange}
                                      name={data.name}
                                    />
                                  }
                                  label={data.name}
                                />
                              </Grid>
                              <Grid item xs={2}>
                                <div
                                  style={{
                                    border: "1px solid #A4B3CC",
                                    borderRadius: "12px",
                                    height: "22px",
                                    width: "22px",
                                    marginTop: "15px",
                                    background: `${data.hex_code}`,
                                  }}
                                ></div>
                              </Grid>
                            </Grid>
                          );
                        })
                      ) : colour_list.length === 0 ? (
                        <Typography variant="h6" style={{ marginTop: "15px" }}>
                          No Color Available
                        </Typography>
                      ) : (
                        ""
                      )}
                      {colourMoreFlag === true ? (
                        colour_list.map((data, index) => {
                          return (
                            <Grid container key={index}>
                              <Grid item xs={10}>
                                <FormControlLabel
                                  style={{
                                    textTransform: "capitalize",
                                    marginBottom: "5px",
                                    marginTop: "5px",
                                  }}
                                  control={
                                    <Checkbox
                                      size="small"
                                      id={data.id}
                                      key={index}
                                      onChange={handleColourFilterChange}
                                      name={data.name}
                                    />
                                  }
                                  label={data.name}
                                />
                              </Grid>
                              <Grid item xs={2}>
                                <div
                                  style={{
                                    border: "1px solid #A4B3CC",
                                    borderRadius: "12px",
                                    height: "22px",
                                    width: "22px",
                                    marginTop: "15px",
                                    background: `${data.hex_code}`,
                                  }}
                                ></div>
                              </Grid>
                            </Grid>
                          );
                        })
                      ) : colour_list.length > 2 ? (
                        <span
                          onClick={handleChangeColourFlag}
                          className={classes.viewMore}
                        >
                          {" "}
                          + View More
                        </span>
                      ) : (
                        ""
                      )}
                    </FormGroup>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            </>
          ) : (
            ""
          )}
        </div>
        <br />
      </Box>
    </React.Fragment>
  );
}

const useStyles = makeStyles(() => ({
  root: {
    width: "100%",
  },
  heading: {
    fontSize: "14px",
    fontWeight: 600,
    fontFamily: "Inter SemiBold",
    marginTop: "-6px",
  },
  subHeading: {
    fontSize: "14px",
    fontWeight: 500,
    fontFamily: "Inter Regular",
    marginBottom: "15px",
    marginTop: "15px",
  },
  viewMore: {
    cursor: "pointer",
    color: "#FC68A2",
    fontWeight: 500,
    fontFamily: "Inter Medium",
    fontSize: "14px",
  },
}));

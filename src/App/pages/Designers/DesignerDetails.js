import React, { useState, useEffect } from "react";
import { Box, Breadcrumbs, Grid, Typography } from "@material-ui/core";
import {
  Toast,
  Select,
  SecondaryButton,
  OutlinedPrimaryButton,
  LoaderContent,
} from "../../components";
import { API, ENDPOINTS } from "../../../api/apiService";
import PaginationLoader from "../../components/PaginationLoader";
import InfiniteScroll from "react-infinite-scroll-component";
import { connect } from "react-redux";
import "./Designer.css";
import ProductCard from "./components/ProductCard";
import { capitalize } from "../../../utils/textUtils";
import noProductAVailableImage from "../../assets/images/No-product-found.svg";
import { List, ListItem, ListItemText } from "@material-ui/core";
import CoverImage from "../../assets/images/CoverImage.png";
import ProfilePlaceholder from "../../assets/images/ProfilePlaceholder.svg";
import { makeStyles } from "@material-ui/core/styles";
import Link from "@material-ui/core/Link";
import styles from "./Dashboard.module.css";

const queryBuilder = (url, ID, options, sortBy, page, searchTerm) => {
  if (options === undefined || !options) return url;
  return `${url}/${ID}/products?page=${page}&page_size=20${
    searchTerm ? `&search=${searchTerm}` : ""
  }${options.category ? `&category=${options.category}` : ""}${
    sortBy > 0 ? `&sort_by=${sortBy}` : ""
  }${options.type ? `&is_custom_product=${options.type}` : ""}`;
};

const DesignerDetails = (props) => {
  const ID = props.match.params.id;
  const isLoggedIn = props.isAuthenticated;
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [record, setRecord] = useState([]);
  const [page, setPage] = useState(1);
  const [details, setDetail] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(0);
  const [categories, setCategories] = useState(null);
  const [sortValue, setSortValue] = useState(1);
  // eslint-disable-next-line no-unused-vars
  const [searchTerm, setSearchTerm] = useState("");
  const [loadMore, setLoadMore] = useState(true);
  const [nextPage, setNextPage] = useState("");
  const [filter, setFilter] = useState({
    type: 0,
    category: 0,
  });

  const classes = useStyles();

  const fetchDesignerDetails = async () => {
    try {
      setLoading(true);
      const resp = await API.get(
        `${ENDPOINTS.GET_DESIGNER_DETAILS}/${ID}`,
        false
      );
      if (resp.success) {
        const temp = resp.data;
        setDetail(temp);
      }
    } catch (e) {
      const msg =
        typeof e.data.error?.message === "string"
          ? e.data.error?.message
          : e.data.error?.message[0];
      Toast.showErrorToast(msg || `Error Fetching Designer. Please Refresh`);
    } finally {
      setLoading(false);
    }
  };

  const fetchDesignerProducts = async () => {
    try {
      setLoading(true);
      const query = queryBuilder(
        ENDPOINTS.GET_DESIGNERS_LIST,
        ID,
        filter,
        sortValue,
        page,
        searchTerm
      );
      const resp = await API.get(query, isLoggedIn ? true : false);
      if (resp.success) {
        const temp = resp.data;
        setNextPage(resp.data.next ? resp.data.next : "");
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
      Toast.showErrorToast(msg || `Error Fetching Designers. Please Refresh`);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreData = async () => {
    if (!updating && nextPage !== null) {
      try {
        setUpdating(true);
        let endPoint1 = nextPage ? nextPage : "";
        let endPoint2 = endPoint1.slice(0, 4) + "s" + endPoint1.slice(4);
        const resp = await API.get(endPoint2, isLoggedIn ? true : false);
        if (resp.success) {
          const temp = resp.data;
          setRecord([...record, ...temp.results]);

          if (!temp.next) {
            setHasMore(false);
          } else {
            if (loadMore === 3) {
              setTimeout(async () => await setLoadMore(1), 1000);
              setHasMore(true);
            } else {
              setTimeout(async () => await setLoadMore(loadMore + 1), 1000);
              if (loadMore + 1 === 3) {
                setHasMore(false);
              } else {
                setHasMore(true);
              }
            }
          }
          setNextPage(resp.data.next ? resp.data.next : "");
        }
      } catch (e) {
        const msg =
          typeof e.data.error?.message === "string"
            ? e.data.error?.message
            : e.data.error?.message[0];
        Toast.showErrorToast(msg || `Error Fetching Designers. Please Refresh`);
        setHasMore(false);
      } finally {
        setUpdating(false);
      }
    }
  };
  const handleChange = (key) => (val) => {
    if (key === "category") {
      setSelectedCategory(val);
    }
    let tempData = { ...filter };
    tempData[key] = val;
    setFilter(tempData);
    setPage(1);
  };

  const handleSort = (e) => {
    setSortValue(e);
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const resp = await API.get(ENDPOINTS.PARENT_CATEGORIES, false);
      if (resp.success) {
        const result = resp.data;
        let temp = result.map((item) => ({
          value: item.id,
          label: item.title,
          id: item.id,
        }));
        setCategories(temp);
        temp.unshift({
          label: "All",
          value: 0,
        });
      }
    } catch (e) {
      const msg =
        typeof e.data.error?.message === "string"
          ? e.data.error?.message
          : e.data.error?.message[0];
      Toast.showErrorToast(msg || `Error Fetching Categories. Please Refresh`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesignerProducts();
    //eslint-disable-next-line
  }, [searchTerm, filter, sortValue]);

  useEffect(() => {
    fetchCategories();
    fetchDesignerDetails();
    window.scrollTo(0, 0);
    //eslint-disable-next-line
  }, []);

  return (
    <React.Fragment>
      <Grid container>
        <Grid container className={"top"}>
          <Box className={styles.main_grid}>
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" href="/home">
                <Typography className={classes.Link}>Home</Typography>
              </Link>
              <Link color="inherit" href="/designers">
                <Typography className={classes.Link}>Designer</Typography>
              </Link>
              <Link color="inherit">
                <Typography className={classes.Link}>
                  {`${capitalize(details?.first_name)} ${capitalize(
                    details?.last_name
                  )}`}
                </Typography>
              </Link>
            </Breadcrumbs>
            <Grid container className={"overlay"}>
              {!loading ? (
                <>
                  <Grid item className={"cover"}>
                    <Grid
                      item
                      className={"designerDetailLeft"}
                      justifyContent="space-between"
                    >
                      <Grid
                        container
                        className={"designerProfile"}
                        xs={12}
                        md={3}
                      >
                        <Grid
                          container
                          style={{ marignLeft: "70px", marginTop: "10px" }}
                        >
                          <div className={"imgCtrDetails"}>
                            {details?.profile_picture !== null ? (
                              <img
                                className={"SRC"}
                                src={details?.profile_picture}
                                alt="profile"
                              />
                            ) : (
                              <img
                                className={"SRC"}
                                src={ProfilePlaceholder}
                                alt="placeholder"
                              />
                            )}
                          </div>
                        </Grid>
                        <Grid container style={{ marignLeft: "70px" }}>
                          <Typography className={"brandName2"}>
                            {`${capitalize(details?.brand_name)}`}
                          </Typography>
                        </Grid>
                        <Grid container style={{ marignLeft: "70px" }}>
                          <Grid item style={{ display: "flex" }}>
                            <Typography className={"desName"}>
                              {`Designer : ${capitalize(
                                details?.first_name
                              )} ${capitalize(details?.last_name)}`}
                            </Typography>
                            <div item className={"separator2"}></div>
                          </Grid>
                          <Grid item>
                            <Typography className={"desName"}>
                              {`Location : ${capitalize(details?.city)}`}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid item>
                          <Grid item>
                            <Typography className={"desMoto"}>
                              {details?.tag_line}
                            </Typography>
                          </Grid>
                        </Grid>
                        <Grid container>
                          <a
                            style={{ textDecoration: "none" }}
                            href={"mailto:" + details?.email}
                          >
                            <SecondaryButton
                              style={{
                                border: "1px solid #242424",
                                backgroundColor: "#ffffff",
                                borderRadius: "8px",
                                minHeight: "10px !important",
                                minWidth: "50px !important",
                                width: "94px",
                                height: "35px !important",
                                "&:hover, &:focus": {
                                  background: "#FC68A2",
                                },
                              }}
                              /* onClick={renderProps.onClick} */
                              variant="outlined"
                              type="submit"
                            >
                              <Typography
                                style={{
                                  fontFamily: "Inter Regular",
                                  fontSize: "14px",
                                  fontWeight: "600",
                                  textAlign: "center",
                                  lineHeight: "22px",
                                  color: "#242424",
                                }}
                              >
                                Email
                              </Typography>
                            </SecondaryButton>
                          </a>
                        </Grid>
                      </Grid>
                      <Grid
                        item
                        md={3}
                        justifyContent="flex-end"
                        className={classes.designerDetailRight}
                        style={{
                          backgroundColor: `${
                            details?.banner_colour_data
                              ? details?.banner_colour_data
                              : "#f59e41"
                          }`,
                        }}
                      ></Grid>
                    </Grid>
                    <img
                      src={
                        details?.cover_image_url
                          ? details?.cover_image_url
                          : CoverImage
                      }
                      className={classes.leftContainer}
                      alt=""
                    />
                  </Grid>
                  <Grid item className={"filters"}>
                    <Grid container className={"topCtr"}>
                      <Grid
                        item
                        lg={8}
                        md={8}
                        sm={12}
                        xs={12}
                        container
                        className={"allProducts"}
                      >
                        <Grid container alignItems="center">
                          <List style={{ display: "contents" }}>
                            {categories?.map((item, index) => (
                              <Grid item key={index}>
                                <ListItem
                                  className={
                                    selectedCategory === item.value
                                      ? "itemSelected"
                                      : "itemUnselected"
                                  }
                                  button={true}
                                  key={item.value}
                                  style={{ whiteSpace: "nowrap" }}
                                  onClick={() =>
                                    handleChange("category")(item.value)
                                  }
                                >
                                  <ListItemText
                                    className={
                                      selectedCategory === item.value
                                        ? "textSelected"
                                        : "textUnselected"
                                    }
                                    primary={`${item?.label}${
                                      item?.label === "All"
                                        ? "(" + details?.total_product + ")"
                                        : ""
                                    }`}
                                  />
                                </ListItem>
                              </Grid>
                            ))}
                          </List>
                        </Grid>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sm={12}
                        lg={4}
                        md={4}
                        className={"filterCtr"}
                      >
                        <Grid container spacing={2} justifyContent="flex-end">
                          {/* Type Filter */}
                          <Grid item className={"category"}>
                            <Select
                              id="sort-type"
                              placeholder="Type"
                              style={{
                                maxWidth: "164px",
                              }}
                              items={[
                                { label: "All", value: 0 },
                                { label: "Custom Wear", value: "True" },
                                { label: "Ready To Wear", value: "False" },
                              ]}
                              value={filter?.type}
                              onChange={handleChange("type")}
                            />
                          </Grid>
                          {/* Category Filter */}

                          <Grid item className={"category"}>
                            <Select
                              id="sort"
                              placeholder="Sort By:"
                              style={{
                                borderRadius: 8,
                                backgroundColor: "#ffffff",
                                maxWidth: "200px",
                              }}
                              items={[
                                { label: "Sort By", value: 1 },
                                { label: "Price: High to Low ", value: 2 },
                                { label: "Price: Low to High ", value: 3 },
                                { label: "Sort By: Latest", value: 4 },
                              ]}
                              value={sortValue}
                              onChange={handleSort}
                            />
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Box className="products-listing">
                    <Grid item className="products-listing">
                      <Grid container>
                        <Grid container spacing={4}>
                          {record.length
                            ? record.map((data, index) => (
                                <Grid
                                  key={index}
                                  item
                                  xs={12}
                                  md={4}
                                  lg={3}
                                  xl={3}
                                  sm={6}
                                >
                                  <ProductCard
                                    key={index}
                                    history={props.history}
                                    data={data}
                                  />
                                </Grid>
                              ))
                            : ""}
                        </Grid>
                        {record.length ? (
                          <Grid container justifyContent="center">
                            <InfiniteScroll
                              dataLength={record.length} //This is important field to render the next data
                              next={loadMore ? fetchMoreData : null}
                              hasMore={hasMore}
                              loader={<PaginationLoader />}
                              style={{ overflow: "hidden" }}
                            >
                              {loadMore === 3 && (
                                <Grid container justifyContent="center">
                                  <OutlinedPrimaryButton
                                    wide
                                    onClick={fetchMoreData}
                                  >
                                    Load More
                                  </OutlinedPrimaryButton>
                                </Grid>
                              )}
                            </InfiniteScroll>
                          </Grid>
                        ) : (
                          <Grid container justify="center">
                            <div
                              style={{ textAlign: "center", marginTop: "45px" }}
                            >
                              <img
                                height="399px"
                                maxWidth="446px"
                                alt="product"
                                src={noProductAVailableImage}
                              ></img>
                              <Typography
                                style={{
                                  marginTop: "24px",
                                  fontSize: "16px",
                                  fontWeight: 600,
                                }}
                              >
                                No products found!!
                              </Typography>
                            </div>
                          </Grid>
                        )}
                      </Grid>
                    </Grid>
                  </Box>
                </>
              ) : (
                <LoaderContent />
              )}
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const useStyles = makeStyles((theme) => ({
  leftContainer: {
    position: "relative",
    width: "40%",
    height: "75%",
    left: "44%",
    top: "-87%",
    borderRadius: "8px",
    display: "-webkit-box",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
    [theme.breakpoints.down("md")]: {
      height: "65%",
    },
  },
  designerDetailRight: {
    width: "35%",
    height: "65%",
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
    [theme.breakpoints.down("md")]: {
      height: "55%",
    },
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
}));

const mapStateToProps = ({ auth: { isAuthenticated } }) => ({
  isAuthenticated,
});

export default connect(mapStateToProps, null)(DesignerDetails);

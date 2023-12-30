/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Container, Grid, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Loader, Toast } from "../../components";
import { API } from "../../../api/apiService";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Link from "@material-ui/core/Link";
import ProductCard from "./components/ProductCard";
import PaginationLoader from "../../components/PaginationLoader";
import InfiniteScroll from "react-infinite-scroll-component";
import { connect } from "react-redux";
import noProductAVailableImage from "../../assets/images/No-product-found.svg";
import styles from "./ProductListing.module.css";
import { useLocation } from "react-router-dom";

const ProductListing = (props) => {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [productList, setProductList] = useState([]);
  const [totalProducts, setTotalProducts] = useState("");
  const [nextPage, setNextPage] = useState("");
  const page_size = 12;
  const [category_id] = useState(
    location.pathname.toString().includes("product-listing")
      ? location.pathname.split("/")[3]
      : ""
  );
  const title = location.pathname.toString().includes("product-listing")
    ? location.pathname.split("/")[2]
    : "";
  const isLoggedIn = props.isAuthenticated;
  const search = props.search ? props.search : "";

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (search !== undefined && search !== "") {
      getProductListFromSearch();
    }
  }, [search]);

  const getProductListFromSearch = async (price, is_custom_product) => {
    setLoading(true);
    let start_price = price ? price[0] : 1;
    let end_price = price ? price[1] : 2000;
    let is_custom =
      is_custom_product === undefined || is_custom_product === ""
        ? ""
        : `&is_custom_product=${is_custom_product}`;
    const parent_id = category_id !== "" ? `${category_id}` : "";
    try {
      const resp = await API.get(
        "/product/customer/" +
          `${parent_id}` +
          `?page=1&page_size=${page_size}` +
          `&start_price=${start_price}&end_price=${end_price}` +
          `${is_custom}`,
        isLoggedIn ? true : false
      );
      if (resp.success) {
        let resData = [];
        for (let i of resp.data.results) {
          resData.push({
            id: i.product_id,
            url: i.cover_image_url,
            title: i.title,
            price: i.price,
            wishlist: i.wishlist,
            is_custom_product: i.is_custom_product,
            brand_name: i.brand_name ? i.brand_name : "",
            offer_price: i.offer ? i.offer.offer_price : "",
            category: i.category ? i.category : "",
            thumbnail: i.p_thumbnail,
            rating: i.rating,
          });
        }
        if (resp.data.next == null) {
          setHasMore(false);
        } else if (resp.data.next !== null) {
          setHasMore(true);
        }
        if (resData.length === totalProducts) {
          setHasMore(false);
        }
        setProductList(resData);
        setTotalProducts(resp.data.count || 0);
        setNextPage(resp.data.next ? resp.data.next : "");
        setLoading(false);
        props.setTotalProductsFromChild(resp.data.count);
      }
    } catch (e) {
      console.log(e, "error in search product from header");
      setLoading(false);
    }
    setLoading(false);
  };

  const fetchMoreData = async () => {
    if (!updating && nextPage !== null) {
      try {
        setUpdating(true);
        let endPoint1 = nextPage ? nextPage : "";
        let endPoint2 = endPoint1.slice(0, 4) + "s" + endPoint1.slice(4);
        const resp = await API.get(endPoint2, isLoggedIn ? true : false);
        if (resp.success) {
          let resData = [...productList];
          for (let i of resp.data.results) {
            resData.push({
              id: i.product_id,
              url: i.cover_image_url,
              title: i.title,
              price: i.price,
              wishlist: i.wishlist,
              is_custom_product: i.is_custom_product,
              offer_price: i.offer ? i.offer.offer_price : "",
              category: i.category ? i.category : "",
              thumbnail: i.p_thumbnail,
              rating: i.rating,
            });
          }
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
          setProductList(resData);
          setTotalProducts(resp.data.count || 0);
          setNextPage(resp.data.next ? resp.data.next : "");
        }
      } catch (e) {
        const msg =
          typeof e.data.error?.message === "string"
            ? e.data.error?.message
            : e.data.error?.message[0];
        Toast.showErrorToast(
          msg || `Error Fetching product list. Please Refresh`
        );
      } finally {
        setUpdating(false);
      }
    }
  };

  useEffect(() => {
    getProductListFromSearch();
  }, []);

  return (
    <React.Fragment>
      <Container maxWidth="xl">
        {loading && <Loader />}
        <Box className={styles.container}>
          {props.search ? (
            ""
          ) : (
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" href="/home">
                <Typography
                  style={{
                    textTransform: "capitalize",
                    fontWeight: 600,
                    color: "#242424",
                  }}
                  variant="h6"
                >
                  Home
                </Typography>
              </Link>
              <Link color="inherit">
                <Typography
                  style={{
                    textTransform: "capitalize",
                    fontWeight: 600,
                  }}
                  variant="h6"
                >
                  {title} Clothing
                </Typography>
              </Link>
            </Breadcrumbs>
          )}
          <Grid item xs={12}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
              {!loading ? (
                <>
                  {productList.length ? (
                    <InfiniteScroll
                      dataLength={productList.length} //This is important field to render the next data
                      next={fetchMoreData}
                      hasMore={hasMore}
                      loader={<PaginationLoader />}
                      style={{ overflow: "hidden" }}
                    >
                      <Grid
                        container
                        spacing={3}
                        style={{ marginTop: "15px", marginBottom: "50px" }}
                      >
                        {productList.length
                          ? productList.map((data, index) => (
                              <Grid
                                item
                                xs={12}
                                md={6}
                                lg={3}
                                sm={12}
                                xl={3}
                                key={index}
                              >
                                <ProductCard
                                  history={props.history}
                                  data={data}
                                  hrefTitle={title}
                                  ParentCategoryId={category_id}
                                />
                              </Grid>
                            ))
                          : ""}
                      </Grid>
                    </InfiniteScroll>
                  ) : (
                    <Grid
                      item
                      style={{ textAlign: "center", marginTop: "45px" }}
                    >
                      <img
                        className={styles.product_card}
                        alt="product"
                        src={noProductAVailableImage}
                        style={{ alignContent: "center" }}
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
                      <br />
                      <br />
                    </Grid>
                  )}
                </>
              ) : (
                <Loader />
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </React.Fragment>
  );
};
const mapStateToProps = ({ auth: { isAuthenticated } }) => ({
  isAuthenticated,
});
export default connect(mapStateToProps, null)(ProductListing);

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Grid, Typography } from "@material-ui/core";
import { Toast, LoaderContent, PrimaryButton } from "../../components";
import PaginationLoader from "../../components/PaginationLoader";
import InfiniteScroll from "react-infinite-scroll-component";
import { API, ENDPOINTS } from "../../../api/apiService";
import NoWishlistFound from "../../assets/images/No-wishlist-items.svg";
import WishlistItem from "./components/WishlistItem";
import styles from "./Wishlist.module.css";

const Wishlist = (props) => {
  const isLoggedIn = props.isAuthenticated;
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [record, setRecord] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 6;

  const handleRemove = async (ID) => {
    if (!deleting) {
      try {
        setDeleting(true);
        const resp = await API.deleteResource(`${ENDPOINTS.WISHLIST}/${ID}`);
        if (resp.success) {
          const msg = resp.data.message;
          Toast.showSuccessToast(msg || "Item removed from wishlist");
          fetchWishlist();
          window.scrollTo(0, 0);
        }
      } catch (e) {
        const msg =
          typeof e.data.error?.message === "string"
            ? e.data.error?.message
            : e.data.error?.message[0];
        Toast.showErrorToast(
          msg || `Error removing item from wishlist. Try again`
        );
      } finally {
        setDeleting(false);
      }
    }
  };

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const resp = await API.get(
        `${ENDPOINTS.WISHLIST}?page=1&page_size=${PAGE_SIZE}`
      );
      if (resp.success) {
        const temp = resp.data;
        setTotal(temp.count || 0);
        setPage(1);
        setRecord(temp.results);
        if (temp.results.length < PAGE_SIZE) {
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
      Toast.showErrorToast(msg || `Error Fetching Wishlist. Please Refresh`);
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreData = async () => {
    if (!updating) {
      try {
        setUpdating(true);
        const resp = await API.get(
          `${ENDPOINTS.WISHLIST}?page=${page + 1}&page_size=${PAGE_SIZE}`
        );
        if (resp.success) {
          const temp = resp.data;
          if (!temp.count) {
            setHasMore(false);
            return;
          }
          setPage((prevPage) => prevPage + 1);
          setRecord([...record, ...temp.results]);
          if (temp.results.length < PAGE_SIZE) {
            setHasMore(false);
          }
        }
      } catch (e) {
        const msg =
          typeof e.data.error?.message === "string"
            ? e.data.error?.message
            : e.data.error?.message[0];
        Toast.showErrorToast(msg || `Error Fetching Wishlist. Please Refresh`);
      } finally {
        setUpdating(false);
      }
    }
  };

  // Since the listing is based on scroll, we want to be at the top of the page everytime
  useEffect(() => {
    if (isLoggedIn) {
      fetchWishlist();
      window.scrollTo(100, 100);
    }
  }, []);

  return (
    <React.Fragment>
      {!isLoggedIn ? <Redirect to="/auth/login" /> : null}
      <Grid container className={styles.container}>
        {/* Heading */}
        <Grid container item>
          <Typography variant="h4" className={styles.header}>
            Wishlist
          </Typography>
          <Typography variant="h4" className={styles.light}>
            {`(${total} Items)`}
          </Typography>
        </Grid>
        {/* Listing */}
        <Grid container>
          {!loading ? (
            <>
              {record.length ? (
                <>
                  <Grid container spacing={2}>
                    {record.map((item, index) => (
                      <Grid
                        item
                        xs={12}
                        md={4}
                        lg={3}
                        xl={3}
                        sm={6}
                        key={index}
                      >
                        <WishlistItem
                          key={item.id}
                          data={item.product_data}
                          onDelete={() => handleRemove(item.id)}
                          props={props}
                        />
                      </Grid>
                    ))}
                  </Grid>
                  <Grid container justifyContent="center">
                    <InfiniteScroll
                      dataLength={record.length} //This is important field to render the next data
                      next={fetchMoreData}
                      hasMore={hasMore}
                      style={{ overflow: "hidden" }}
                      loader={<PaginationLoader />}
                    ></InfiniteScroll>
                  </Grid>
                </>
              ) : (
                <Grid container item direction="column" alignItems="center">
                  <Grid item>
                    <img
                      src={NoWishlistFound}
                      alt="No WishlistFound"
                      className={styles.empty_wishlist}
                    />
                  </Grid>
                  <Grid item className={styles.first_line}>
                    <Typography variant="h4" className={styles.side_header}>
                      Your wishlist is currently empty!!
                    </Typography>
                  </Grid>
                  <Grid item className={styles.muted_line}>
                    <Typography variant="h4" className={styles.muted_text}>
                      Explore from the wide range of products and shortlist
                      items you wish for
                    </Typography>
                  </Grid>
                  <Grid item>
                    <PrimaryButton
                      className={styles.shop_now_btn}
                      onClick={() => props.history.push("/home")}
                    >
                      <Typography variant="h4" className={styles.side_header}>
                        Shop Now
                      </Typography>
                    </PrimaryButton>
                  </Grid>
                </Grid>
              )}
            </>
          ) : (
            <LoaderContent />
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const mapStateToProps = ({ auth: { isAuthenticated } }) => ({
  isAuthenticated,
});

export default connect(mapStateToProps, null)(Wishlist);

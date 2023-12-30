/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  Breadcrumbs,
  Grid,
  Typography,
  useMediaQuery,
} from "@material-ui/core";
import {
  Toast,
  LoaderContent,
  PrimaryButton,
  OutlinedPrimaryButton,
  DeleteModal,
} from "../../components";
import { API, ENDPOINTS } from "../../../api/apiService";
import { capitalize } from "../../../utils/textUtils";
import PaginationLoader from "../../components/PaginationLoader";
import InfiniteScroll from "react-infinite-scroll-component";
import AddressImage from "../../assets/images/No-addresses-saved.svg";
import DeleteIcon from "../../assets/icons/delete-gomble.svg";
import EditIcon from "../../assets/icons/editImage.svg";
import styles from "./Address.module.css";
import Link from "@material-ui/core/Link";

const SavedAddress = (props) => {
  const isLoggedIn = props.isAuthenticated;
  const matches = useMediaQuery("(max-width:600px)");
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [record, setRecord] = useState([]);
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const PAGE_SIZE = 10;

  const handleDelete = async () => {
    if (!deleting) {
      try {
        setDeleting(true);
        const resp = await API.deleteResource(
          `${ENDPOINTS.SAVED_ADDRESS}/${confirmDelete.id}`
        );
        if (resp.success) {
          Toast.showSuccessToast("Address Deleted Successfully");
          fetchSavedAddresses();
          window.scrollTo(0, 0);
        }
      } catch (e) {
        const msg =
          typeof e.data.error?.message === "string"
            ? e.data.error?.message
            : e.data.error?.message[0];
        Toast.showErrorToast(msg || `Error Deleting Address`);
      } finally {
        setDeleting(false);
        setConfirmDelete(false);
      }
    }
  };

  const handleDefault = async (item) => {
    if (!updating) {
      try {
        const payload = {
          is_default: true,
        };
        setUpdating(true);
        const resp = await API.patch(
          `${ENDPOINTS.SAVED_ADDRESS}/${item.id}`,
          payload
        );
        if (resp.success) {
          Toast.showSuccessToast("Address marked as default");
          fetchSavedAddresses();
          window.scrollTo(0, 0);
        }
      } catch (e) {
        const msg =
          typeof e.data.error?.message === "string"
            ? e.data.error?.message
            : e.data.error?.message[0];
        Toast.showErrorToast(msg || `Error updating address default status`);
      } finally {
        setUpdating(false);
      }
    }
  };

  const fetchSavedAddresses = async () => {
    try {
      setLoading(true);
      const resp = await API.get(
        `${ENDPOINTS.SAVED_ADDRESS}?page=1&page_size=${PAGE_SIZE}`
      );
      if (resp.success) {
        const temp = resp.data;
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
      Toast.showErrorToast(
        msg || `Error Fetching Saved Addresses. Please try again`
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchMoreData = async () => {
    if (!updating) {
      try {
        setUpdating(true);
        const resp = await API.get(
          `${ENDPOINTS.SAVED_ADDRESS}?page=${page + 1}&page_size=${PAGE_SIZE}`
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
        Toast.showErrorToast(
          msg || `Error Fetching Saved Addresses. Please try again`
        );
      } finally {
        setUpdating(false);
      }
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchSavedAddresses();
      window.scrollTo(0, 0);
    }
  }, []);

  return (
    <React.Fragment>
      {!isLoggedIn ? <Redirect to="/auth/login" /> : null}
      <Grid container className={styles.container}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/home">
            <Typography className={styles.Link}>Home</Typography>
          </Link>
          <Link color="inherit">
            <Typography className={styles.Link}>Saved Address</Typography>
          </Link>
        </Breadcrumbs>
        {!loading ? (
          <>
            {record.length ? (
              <>
                {/* Heading */}
                <Grid
                  container
                  item
                  justify="space-between"
                  alignItems="center"
                >
                  <Grid item>
                    <Typography variant="h4" className={styles.header}>
                      Saved Addresses
                    </Typography>
                  </Grid>
                  <Grid item>
                    <OutlinedPrimaryButton
                      isSecondary={true}
                      className={styles.newAddressBtn}
                      onClick={() =>
                        props.history.push("/saved-address/add-new-address")
                      }
                    >
                      <Typography variant="h4" className={styles.sideHeader}>
                        Add new Address
                      </Typography>
                    </OutlinedPrimaryButton>
                  </Grid>
                </Grid>
                <div className={styles.infinite_scroll}>
                  <InfiniteScroll
                    dataLength={record.length} //This is important field to render the next data
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={<PaginationLoader />}
                    style={{ overflow: "hidden" }}
                  >
                    <Grid container className={styles.card}>
                      {/* Card */}
                      {record.map((item) => (
                        <Grid
                          container
                          item
                          xs={12}
                          direction="column"
                          spacing={1}
                          className={styles.box}
                          key={item.id}
                          style={{
                            backgroundColor: item.is_default ? "#FFC0CB" : "",
                            border: item.is_default ? "2px solid #FC68A2" : "",
                          }}
                        >
                          <Grid
                            item
                            direction={matches ? "column-reverse" : "row"}
                            container
                            justifyContent="space-between"
                          >
                            <Grid item xs={12} sm={7}>
                              <Typography
                                variant="h4"
                                className={styles.sideHeader}
                              >
                                {`${capitalize(item.first_name)} ${capitalize(
                                  item.last_name
                                )}`}
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              container
                              xs={12}
                              sm={5}
                              spacing={2}
                              justifyContent="flex-end"
                              className={styles.action_buttons}
                            >
                              {!item.is_default && (
                                <Grid item>
                                  <PrimaryButton
                                    variant="outlined"
                                    className={styles.btn}
                                    style={{
                                      border: "2px solid #FC68A2",
                                      width: 125,
                                    }}
                                    onClick={() => handleDefault(item)}
                                  >
                                    <Typography
                                      variant="h4"
                                      className={styles.btnText}
                                    >
                                      Mark Default
                                    </Typography>
                                  </PrimaryButton>
                                </Grid>
                              )}
                              {/* Delete btn */}
                              <Grid item>
                                <div
                                  className={styles.icon}
                                  onClick={() => setConfirmDelete(item)}
                                >
                                  <img src={DeleteIcon} alt="Remove" />
                                </div>
                              </Grid>
                              {/* Edit btn */}
                              <Grid item>
                                <div
                                  className={styles.icon}
                                  onClick={() =>
                                    props.history.push(
                                      `/saved-address/edit-address/${item.id}`
                                    )
                                  }
                                >
                                  <img src={EditIcon} alt="Edit" />
                                </div>
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid item>{`${item.address_one}`}</Grid>
                          <Grid item>{item.address_two}</Grid>
                          <Grid item>{`${item.city}, ${item.state}`}</Grid>
                          <Grid
                            item
                          >{`${item.country} - ${item.zip_code}`}</Grid>

                          <Grid
                            item
                          >{`Phone: ${item.country_code}-${item.phone}`}</Grid>
                        </Grid>
                      ))}
                      <DeleteModal
                        open={!!confirmDelete}
                        title="Delete Address"
                        description={`Are you sure you want to delete this Address ?`}
                        handleClose={() => setConfirmDelete(false)}
                        handleSubmit={handleDelete}
                      />
                    </Grid>
                  </InfiniteScroll>
                </div>
              </>
            ) : (
              <>
                {/* Heading */}
                <Grid container item justify="flex-start">
                  <Grid item>
                    <Typography variant="h4" className={styles.header}>
                      Saved Addresses
                    </Typography>
                  </Grid>
                </Grid>
                <Grid
                  container
                  item
                  xs={12}
                  direction="column"
                  alignItems="center"
                  spacing={4}
                >
                  <Grid item>
                    <img
                      src={AddressImage}
                      alt="No Address Found"
                      className={styles.image}
                    />
                  </Grid>
                  <Grid item>
                    <Typography variant="h4" className={styles.sideHeader}>
                      No Addresses found
                    </Typography>
                  </Grid>
                  <Grid item>
                    <PrimaryButton
                      className={styles.addressBtn}
                      onClick={() =>
                        props.history.push("/saved-address/add-new-address")
                      }
                    >
                      <Typography variant="h4" className={styles.sideHeader}>
                        Add New Address
                      </Typography>
                    </PrimaryButton>
                  </Grid>
                </Grid>
              </>
            )}
          </>
        ) : (
          <LoaderContent />
        )}
      </Grid>
    </React.Fragment>
  );
};

const mapStateToProps = ({ auth: { isAuthenticated } }) => ({
  isAuthenticated,
});

export default connect(mapStateToProps, null)(SavedAddress);

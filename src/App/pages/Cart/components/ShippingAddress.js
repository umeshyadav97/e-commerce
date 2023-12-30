import React, { useEffect } from "react";
import {
  Grid,
  Typography,
  Breadcrumbs,
  useMediaQuery,
} from "@material-ui/core";
import { Radio, OutlinedPrimaryButton, DeleteModal } from "../../../components";
import AddressImage from "../../../assets/images/No-addresses-saved.svg";
import DeleteIcon from "../../../assets/icons/delete-gomble.svg";
import EditIcon from "../../../assets/icons/editImage.svg";
import styles from "./../Cart.module.css";

const ShippingAddress = ({
  record,
  addressId,
  handleTab,
  handleAddressSelection,
  handleDelete,
  confirmDelete,
  setConfirmDelete,
  props,
}) => {
  const MOBILE_SCREEN = useMediaQuery("(max-width:600px)");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <React.Fragment>
      <Grid container item style={{ marginBottom: "auto" }}>
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator="/"
          aria-label="breadcrumb"
          className={styles.breadcrumbs}
        >
          <Typography
            className={styles.breadcrumbs_text}
            onClick={() => props.history.push("/home")}
          >
            Home
          </Typography>
          <Typography
            className={styles.breadcrumbs_text}
            onClick={() => handleTab("cart")}
          >
            Cart
          </Typography>
          <Typography className={styles.breadcrumbs_text}>Shipping</Typography>
        </Breadcrumbs>
        {record.length ? (
          <>
            <Grid
              container
              item
              justify="space-between"
              className={styles.header_border}
            >
              <Grid item>
                <Typography variant="h4" className={styles.header}>
                  {MOBILE_SCREEN ? "Select Address" : "Select Delivery Address"}
                </Typography>
              </Grid>
              <Grid item>
                <OutlinedPrimaryButton
                  isSecondary={true}
                  wide={!MOBILE_SCREEN}
                  onClick={() => handleTab("add-address")}
                >
                  <Typography variant="h4" className={styles.side_header}>
                    {MOBILE_SCREEN ? "Add Address" : "Add new Address"}
                  </Typography>
                </OutlinedPrimaryButton>
              </Grid>
            </Grid>
            <Grid item xs={12} className={styles.cart_container}>
              {record.map((item) => (
                <Grid
                  container
                  item
                  xs={12}
                  spacing={1}
                  className={styles.address_card}
                  key={item.id}
                  style={{
                    border: item.id === addressId ? "2px solid #FC68A2" : "",
                  }}
                >
                  <Grid item xs={1} className={styles.radio}>
                    <Radio
                      isOn={item.id === addressId}
                      onToggle={() => handleAddressSelection(item.id)}
                    />
                  </Grid>
                  <Grid item container direction="column" xs={11} spacing={1}>
                    <Grid
                      item
                      container
                      justify="space-between"
                      direction={MOBILE_SCREEN ? "column-reverse" : "row"}
                    >
                      <Grid item xs={12} sm={6}>
                        <Typography variant="h4" className={styles.side_header}>
                          {`${item.first_name} ${item.last_name}`}
                        </Typography>
                      </Grid>
                      <Grid
                        itemType=""
                        xs={12}
                        sm={6}
                        className={styles.address_action_buttons}
                      >
                        <Grid container spacing={2} justify="flex-end">
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
                              onClick={() => handleTab("edit-address", item.id)}
                            >
                              <img src={EditIcon} alt="Edit" />
                            </div>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>{`${item.address_one}`}</Grid>
                    <Grid item>{item.address_two}</Grid>
                    <Grid item>{`${item.city}, ${item.state}`}</Grid>
                    <Grid item>{`${item.country} - ${item.zip_code}`}</Grid>

                    <Grid
                      item
                    >{`Phone: ${item.country_code}-${item.phone}`}</Grid>
                    <Grid item>{item.email}</Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </>
        ) : (
          <>
            {/* Heading */}
            <Grid container item justify="flex-start">
              <Grid item>
                <Typography variant="h4" className={styles.header}>
                  {MOBILE_SCREEN ? "Select Address" : "Select Delivery Address"}
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
                  className={styles.empty_address_image}
                />
              </Grid>
              <Grid item>
                <Typography variant="h4" className={styles.side_header}>
                  No Addresses found
                </Typography>
              </Grid>
              <Grid item>
                <OutlinedPrimaryButton
                  isSecondary={true}
                  wide={!MOBILE_SCREEN}
                  onClick={() => handleTab("add-address")}
                >
                  <Typography variant="h4" className={styles.side_header}>
                    {MOBILE_SCREEN ? "Add Address" : "Add new Address"}
                  </Typography>
                </OutlinedPrimaryButton>
              </Grid>
            </Grid>
          </>
        )}
        <DeleteModal
          open={!!confirmDelete}
          title="Delete Address"
          description={`Are you sure you want to delete this Address ?`}
          handleClose={() => setConfirmDelete(false)}
          handleSubmit={handleDelete}
        />
      </Grid>
    </React.Fragment>
  );
};

export default ShippingAddress;

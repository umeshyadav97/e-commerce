import React from "react";
import { Grid, Typography, Breadcrumbs } from "@material-ui/core";
import { PrimaryButton } from "../../../components";
import CartRtwItem from "./CartRtwItem";
import CartCustomItem from "./CartCustomItem";
import EmptyCartImage from "../../../assets/images/Empty-cart.svg";
import styles from "./../Cart.module.css";

const CartListing = ({
  record,
  total,
  handleChangeQuantity,
  handleRemoveItem,
  props,
}) => {
  return (
    <React.Fragment>
      <Grid container item style={{ marginBottom: "auto" }}>
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
          <Typography className={styles.breadcrumbs_text}>Cart</Typography>
        </Breadcrumbs>
        <Grid item xs={12}>
          <Typography variant="h4" className={styles.header}>
            Your Shopping Bag
          </Typography>
        </Grid>
        {!!total && (
          <Grid item xs={12}>
            <Typography
              variant="h4"
              className={`${styles.side_header} ${styles.count_text}`}
            >
              {total} Items
            </Typography>
          </Grid>
        )}
        {record.length ? (
          <Grid container className={styles.cart_container}>
            {record.map((item) => {
              if (item.product_details.is_custom) {
                return (
                  <CartCustomItem
                    key={item.id}
                    data={item}
                    handleChangeQuantity={handleChangeQuantity}
                    removeItem={handleRemoveItem}
                    props={props}
                  />
                );
              } else {
                return (
                  <CartRtwItem
                    key={item.id}
                    data={item}
                    handleChangeQuantity={handleChangeQuantity}
                    removeItem={handleRemoveItem}
                  />
                );
              }
            })}
          </Grid>
        ) : (
          <Grid
            container
            item
            direction="column"
            alignItems="center"
            className={styles.empty_orders}
          >
            <Grid item>
              <img
                src={EmptyCartImage}
                alt="Empty Cart"
                className={styles.empty_cart_image}
              />
            </Grid>
            <Grid item className={styles.first_line}>
              <Typography variant="h4" className={styles.side_header}>
                Your shopping bag is empty!!
              </Typography>
            </Grid>
            <Grid item className={styles.muted_line}>
              <Typography variant="h4" className={styles.muted_text}>
                Looks like you haven’t made your choice yet..
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
      </Grid>
    </React.Fragment>
  );
};

export default CartListing;

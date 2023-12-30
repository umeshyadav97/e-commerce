/* eslint-disable react/jsx-no-target-blank */
import React, { useState } from "react";
import { Grid, Typography } from "@material-ui/core";
import styles from "../Cart.module.css";
import Lottie from "lottie-react";
import ImgLoader from "../../../assets/imageLoader.json";
import { capitalizeStr } from "../../../../utils/textUtils";

const CartRtwItem = ({ data, handleChangeQuantity, removeItem }) => {
  const [imgLoading, setImgLoading] = useState(true);
  return (
    <React.Fragment>
      <Grid container className={styles.card}>
        <Grid item>
          <a
            className={styles.link}
            target="_blank"
            href={`product-details/${data.product_details?.parent_category}/${data.product}`}
          >
            {imgLoading && (
              <Lottie
                className={styles.cart_image}
                animationData={ImgLoader}
                style={{
                  width: 180,
                  height: 200,
                }}
              />
            )}
            <img
              className={styles.cart_image}
              src={data.product_details.cover_image_url}
              alt="product-img"
              style={{
                display: imgLoading ? "none" : "inline",
              }}
              onLoad={() => setImgLoading(false)}
            />
          </a>
        </Grid>
        <Grid item xs={12} sm={6} lg={8} container direction="column">
          {/* Product Name */}
          <Grid item container spacing={1}>
            <Grid item sm={12} md={6}>
              <a
                className={styles.link}
                target="_blank"
                href={`product-details/${data.product_details?.parent_category}/${data.product}`}
              >
                <Typography variant="h4" className={styles.product_title}>
                  {data.product_details.title}
                </Typography>
              </a>
              <Grid item>
                <span className={styles.muted_text}>{`Designed By: `}</span>
                <span className={styles.muted_text}>
                  {capitalizeStr(data.designer_name)}
                </span>
              </Grid>
            </Grid>
            <Grid item container sm={12} md={6}>
              {/* Price & Offer */}
              <Grid item className={styles.cart_title} style={{ marginTop: 4 }}>
                {data.offer?.offer_price ? (
                  <>
                    <span
                      className={styles.product_title}
                    >{`$${data.offer.offer_price.toLocaleString()}`}</span>
                    <Grid
                      className={styles.content}
                      style={{
                        marginTop: "10px",
                        textDecoration: data.offer.offer_price
                          ? "line-through"
                          : "",
                      }}
                    >
                      <span
                        className={styles.muted_text}
                      >{`$${data.sub_total.toLocaleString()}`}</span>
                    </Grid>
                  </>
                ) : (
                  <span
                    className={styles.product_title}
                  >{`$${data.sub_total.toLocaleString()}`}</span>
                )}
              </Grid>
              {/* Remove */}
              <Grid item style={{ marginLeft: "auto" }}>
                <Typography
                  className={`${styles.side_header} ${styles.remove}`}
                  onClick={() => removeItem(data.id)}
                >
                  Remove
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          {/* Size */}
          <Grid item container>
            <Grid item className={styles.info_grid}>
              <span className={styles.label}>Size:</span>
              <span className={styles.content}>{data.selected_size}</span>
            </Grid>
          </Grid>
          {/* Color*/}
          <Grid item container>
            <Grid item className={styles.info_grid}>
              <span className={styles.label}>Color:</span>
              <span className={styles.content}>{data.colour}</span>
            </Grid>
          </Grid>
          {/* Inc/Dec Button */}
          <Grid item container justify="space-between">
            <Grid item>
              <div className={styles.min_add_button}>
                <div className="input-group">
                  <span
                    className={`${styles.operation} ${styles.left}`}
                    onClick={() =>
                      handleChangeQuantity(data.id, data.quantity - 1)
                    }
                  >
                    <i className="fa fa-minus" aria-hidden="true"></i>
                  </span>
                  <span className={styles.quantity}>{data.quantity}</span>
                  <span
                    className={`${styles.operation} ${styles.right}`}
                    onClick={() =>
                      handleChangeQuantity(data.id, data.quantity + 1)
                    }
                  >
                    <i className="fa fa-plus" aria-hidden="true"></i>
                  </span>
                </div>
              </div>
            </Grid>
          </Grid>
          {data.is_coupon_applied && (
            <Grid item container justifyContent="space-between">
              <Grid item className={styles.color}>
                <span className={styles.coupon_msg}>{`Coupon Applied!`}</span>
              </Grid>
            </Grid>
          )}
          {!!data.error && (
            <Grid item container justifyContent="space-between">
              <Grid item className={styles.color}>
                <span className={styles.error_msg}>{data.error}</span>
              </Grid>
            </Grid>
          )}
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default CartRtwItem;

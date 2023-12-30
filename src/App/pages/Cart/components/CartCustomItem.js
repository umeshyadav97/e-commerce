/* eslint-disable react/jsx-no-target-blank */
import React, { useState } from "react";
import { Grid, Typography } from "@material-ui/core";
import styles from "../Cart.module.css";
import Lottie from "lottie-react";
import ImgLoader from "../../../assets/imageLoader.json";
import { capitalizeStr } from "../../../../utils/textUtils";

const CartCustomItem = ({ data, handleChangeQuantity, removeItem }) => {
  const [imgLoading, setImgLoading] = useState(true);
  return (
    <React.Fragment>
      <Grid container className={styles.card}>
        <Grid item container>
          <Grid item>
            <a
              className={styles.link}
              target="_blank"
              href={`custom-product-details/${data.product_details?.parent_category}/${data.product}`}
            >
              {imgLoading && (
                <Lottie
                  className={styles.cart_image}
                  animationData={ImgLoader}
                  style={{
                    width: 100,
                    height: 110,
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
          <Grid item xs={8} container direction="column">
            {/* Product Name */}
            <Grid item container spacing={2}>
              <Grid item sm={12} md={6}>
                <a
                  className={styles.link}
                  target="_blank"
                  href={`custom-product-details/${data.product_details?.parent_category}/${data.product}`}
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
                <Grid
                  item
                  className={styles.cart_title}
                  style={{ marginTop: 4 }}
                >
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
            {/* Custom style */}
            <Grid item container>
              <Grid container direction="column">
                <Grid item className={styles.info_grid}>
                  <span className={styles.label}>Style</span>
                </Grid>
                {/* Options */}
                {data.options?.map((item) => (
                  <Grid key={item.title} item className={styles.style_grid}>
                    <span className={styles.content}>{`${item.title}: `}</span>
                    <span className={styles.content}>
                      {item.child_option?.title}
                    </span>
                  </Grid>
                ))}
                {/*TO DO */}
                {/* accessories */}
                {/* <Grid container className={styles.style_grid}>
                  <Grid item>
                    <span className={styles.content}>{`Accessories: `}</span>
                  </Grid>
                  {data?.accessories?.map((item, index) => (
                    <Grid key={item.title} item className={styles.style_grid}>
                      <span className={styles.content}>
                        {index === 0 ? `${item.title} ,` : ` ,${item.title} `}
                      </span>
                    </Grid>
                  ))}
                </Grid> */}
                {/* Materials */}
                <Grid item className={styles.style_grid}>
                  <span className={styles.content}>{`Material: `}</span>
                  <span className={styles.content}>
                    {data.material ? data.material[0].title : "N/A"}
                  </span>
                </Grid>
              </Grid>
            </Grid>
            {/* Size */}
            <Grid item container>
              <Grid item className={styles.info_grid} xs={12}>
                {data.selected_size ? (
                  <>
                    <span className={styles.label}>Size:</span>
                    <span className={styles.content}>{data.selected_size}</span>
                  </>
                ) : (
                  <span className={styles.label}>Size</span>
                )}
              </Grid>
              <Grid item container xs={8}>
                {data.measurement
                  ? Object.keys(data.measurement).map((keyName, i) => (
                      <Grid key={i} item xs={6} className={styles.style_grid}>
                        <span className={styles.content}>{`${keyName}: `}</span>
                        <span className={styles.content}>
                          {data.measurement[keyName]}
                        </span>
                      </Grid>
                    ))
                  : null}
              </Grid>
            </Grid>
            {/* Inc/Dec Button & Remove */}
            <Grid item container>
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
      </Grid>
    </React.Fragment>
  );
};

export default CartCustomItem;

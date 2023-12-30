import React, { useState } from "react";
import { Grid, Typography } from "@material-ui/core";
import styles from "../Wishlist.module.css";
import PlaceholderImage from "../../../assets/images/dummy_image.jpg";
import Wishlisted from "../../../assets/icons/WishlistSelected.svg";
import Lottie from "lottie-react";
import ImgLoader from "../../../assets/imageLoader.json";

const WishlistItem = ({ data, onDelete, props }) => {
  const {
    cover_image_url,
    title,
    brand_name,
    price,
    is_custom_product,
    category,
    product_id,
  } = data;

  const [imgLoading, setImgLoading] = useState(true);

  const handleDeleteItem = (e) => {
    e.stopPropagation();
    onDelete();
  };

  return (
    <React.Fragment>
      <Grid container item className={styles.product_card}>
        <div
          onClick={() =>
            is_custom_product
              ? props.history.push(
                  `custom-product-details/${category}/${product_id}`
                )
              : props.history.push(`product-details/${category}/${product_id}`)
          }
        >
          <Grid item className={styles.image_container}>
            <div className={styles.top_right} onClick={handleDeleteItem}>
              <img src={Wishlisted} alt="Remove" />
            </div>
            {imgLoading && (
              <Lottie
                className={styles.order_image}
                animationData={ImgLoader}
                style={{
                  width: 200,
                  height: 230,
                }}
              />
            )}
            <img
              className={styles.product_image}
              src={cover_image_url || PlaceholderImage}
              alt={title}
              style={{
                display: imgLoading ? "none" : "inline",
              }}
              onLoad={() => setImgLoading(false)}
            />
            {is_custom_product && (
              <div className={styles.customize}>
                <span className={styles.custom_text}>
                  Customization Available
                </span>
              </div>
            )}
          </Grid>
          <Grid item xs={12} className={styles.product_content}>
            <span
              style={{
                textTransform: "capitalize",
                fontSize: "24px",
                fontWeight: 600,
                marginBottom: "8px",
              }}
            >
              $ {price}
            </span>
            {/* )} */}
            <Typography variant="h4" className={styles.product_info}>
              {title}
            </Typography>
            <Typography variant="h4" className={styles.product_info}>
              {brand_name}
            </Typography>
          </Grid>
        </div>
      </Grid>
    </React.Fragment>
  );
};

export default WishlistItem;

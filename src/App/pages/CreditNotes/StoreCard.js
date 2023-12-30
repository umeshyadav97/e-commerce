import React, { useState } from "react";
import { Box, Grid, Typography } from "@material-ui/core";
import styles from "./credit.module.css";
import Placeholder from "../../assets/images/ProfilePlaceholder.svg";
import AddressIcon from "../../assets/icons/address_icon.svg";
import Lottie from "lottie-react";
import ImgLoader from "../../assets/imageLoader.json";

const StoreCard = ({ handleStoreDetails, item }) => {
  const [imgLoading, setImgLoading] = useState(true);
  return (
    <Box
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 16,
        height: "420px",
        boxShadow: "0 6px 18px 0 rgba(180,187,198,0.24)",
      }}
      onClick={() => handleStoreDetails(item.id)}
    >
      <Grid container direction="column" style={{ cursor: "pointer" }}>
        <div className={imgLoading ? "" : styles.container16To9}>
          {imgLoading && (
            <Lottie className={styles.table_image} animationData={ImgLoader} />
          )}
          <img
            className={styles.image_card}
            width="100%"
            height="90%"
            alt="material"
            src={item.cover_image_url || Placeholder}
            onLoad={() => setImgLoading(false)}
            style={{
              display: imgLoading ? "none" : "flex",
            }}
          />
        </div>
        <Grid item>
          <Grid container justifyContent="space-between">
            <Grid item>
              <Typography className={styles.heading}>
                {item?.name?.length > 35
                  ? item.name.slice(0, 35) + "..."
                  : item.name}
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Typography className={styles.subHeading}>
            Primary Staff :{item.store_manager}
          </Typography>
        </Grid>
        <Box className={styles.Box}>
          <img
            src={AddressIcon}
            alt="location"
            className={styles.locationIcon}
          />
          <Typography className={styles.muted_text}>
            {(
              item?.address_line_1 +
              " , " +
              item?.city +
              ", " +
              item?.country +
              ", " +
              item?.postal_code
            ).length > 35
              ? (
                  item?.address_line_1 +
                  " , " +
                  item?.city +
                  ", " +
                  item?.country +
                  ", " +
                  item?.postal_code
                ).slice(0, 35) + "..."
              : item?.address_line_1 +
                " , " +
                item?.city +
                ", " +
                item?.country +
                ", " +
                item?.postal_code}
          </Typography>
        </Box>
      </Grid>
    </Box>
  );
};

export default StoreCard;

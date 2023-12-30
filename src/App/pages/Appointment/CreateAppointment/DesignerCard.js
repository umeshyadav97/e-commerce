import React from "react";
import { capitalize, Grid, Typography } from "@material-ui/core";
import styles from "../appointment.module.css";
import { OutlinedPrimaryButton } from "../../../components";
import Placeholder from "../../../assets/icons/ProfilePlaceholder.svg";

const DesignerCard = ({ designerDetails }) => {
  return (
    <React.Fragment>
      <Grid item className={styles.detail_grid}>
        <Grid container>
          <Grid item xs={12} sm={8}>
            <img
              src={designerDetails?.profile_picture || Placeholder}
              alt="profile"
              className={styles.designer_img}
            />
            <Typography className={styles.header}>
              {capitalize(
                designerDetails?.first_name ? designerDetails?.first_name : ""
              ) +
                " " +
                capitalize(
                  designerDetails?.last_name ? designerDetails?.last_name : ""
                )}
            </Typography>
          </Grid>
          <a
            target="_blank"
            rel="noreferrer"
            href={`mailto:${designerDetails?.email}`}
            style={{ textDecoration: "none", display: "contents" }}
          >
            <Grid item xs={12} sm={4} className={styles.email_btn_grid}>
              <OutlinedPrimaryButton issecondary className={styles.email_btn}>
                Email
              </OutlinedPrimaryButton>
            </Grid>
          </a>
        </Grid>
        <Grid item style={{ marginTop: "8px" }}>
          <Grid item>
            <Typography className={styles.sub_header}>
              {designerDetails?.brand_name}
            </Typography>
          </Grid>
          <Grid container xs={12}>
            <Typography className={styles.pink_content}>
              Location:{" "}
              <span className={styles.grey_address}>
                {designerDetails?.address_line_1 +
                  ", " +
                  designerDetails?.city +
                  ", " +
                  designerDetails?.state +
                  ", " +
                  designerDetails?.postal_code}
              </span>
            </Typography>
          </Grid>
        </Grid>
        <Grid container style={{ marginTop: "16px" }}>
          <Grid item style={{ marginRight: "10px" }}>
            <Grid
              item
              style={{ borderRight: "1px solid #DFE7F5", paddingRight: "10px" }}
            >
              <Grid item>
                <Typography className={styles.content}>
                  Total Products
                </Typography>
              </Grid>
              <Grid item style={{ display: "flex", justifyContent: "center" }}>
                <Typography className={styles.header}>
                  {designerDetails?.product_summary?.total_products}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            style={{ borderRight: "1px solid #DFE7F5", marginRight: "10px" }}
          >
            <Grid item style={{ paddingRight: "10px" }}>
              <Grid item>
                <Typography className={styles.content}>
                  Custom Products
                </Typography>
              </Grid>
              <Grid item style={{ display: "flex", justifyContent: "center" }}>
                <Typography className={styles.header}>
                  {designerDetails?.product_summary?.custom_products}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item style={{ marginRight: "10px" }}>
            <Grid item style={{ paddingRight: "10px" }}>
              <Grid item>
                <Typography className={styles.content}>
                  Ready To Wear
                </Typography>
              </Grid>
              <Grid item style={{ display: "flex", justifyContent: "center" }}>
                <Typography className={styles.header}>
                  {designerDetails?.product_summary?.rtw_products}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/* <Grid
        container
        justifyContent="space-between"
        style={{ marginTop: "32px" }}
        spacing={2}
      >
        <PrimaryButton
          style={{ width: "185px !important", marginBottom: "20px" }}
        >
          Get Directions
        </PrimaryButton>
        <OutlinedPrimaryButton
          issecondary
          style={{ width: "185px !important", marginBottom: "20px" }}
        >
          Contact Info
        </OutlinedPrimaryButton>
      </Grid> */}
    </React.Fragment>
  );
};

export default DesignerCard;

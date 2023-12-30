import React, { useEffect, useState } from "react";
import { Grid, Typography } from "@material-ui/core";
import styles from "../Dashboard.module.css";
import { API, ENDPOINTS } from "../../../../api/apiService";
import HeroImage from "../../../assets/images/dashboard/heroSection.svg";
import GoToImage from "../../../assets/icons/button-icon-go.svg";
import { PrimaryButton } from "../../../components";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  root: () => ({
    top: 0,
    [theme.breakpoints.between("md", "sm")]: {
      paddingLeft: "40px",
    },
    [theme.breakpoints.down("xs")]: {
      paddingLeft: "20px",
    },
  }),
  hero_img: {
    width: "100%",
    maxHeight: "376px",
    [theme.breakpoints.down("md")]: {
      display: "none",
    },
  },
}));

const HeroSection = () => {
  const [parentcategoryList, setParentCategoryList] = useState([]);
  const [Showheader, setShowHeader] = useState(true);

  const classes = useStyles();

  const getCategoryList = async () => {
    try {
      const resp = await API.get(ENDPOINTS.PARENT_CATEGORIES, false);
      if (resp.success) {
        let resData = [];
        for (let i of resp.data) {
          resData.push({
            id: i.id,
            title: i.title,
          });
        }
        setParentCategoryList(resData);
      }
    } catch (e) {
      console.log(e, "error in get category list");
    }
  };

  useEffect(() => {
    getCategoryList();
  }, []);

  return (
    <div>
      {Showheader && (
        <Grid
          container
          justifyContent="space-around"
          alignItems="center"
          spacing={2}
        >
          <Grid item style={{ marginLeft: 20 }}>
            <Typography variant="h4" className={styles.second_header}>
              Fashion That Starts
            </Typography>
            <Typography className={styles.second_header}>With You</Typography>
            <Grid item className={styles.content_section}>
              <Typography variant="h4" className={styles.DashboardSubdata}>
                Find a perfect outfit that will suit your soul and body and we
                provide a powerful tool for our customer to customize their
                perfect outfit.
              </Typography>
            </Grid>
            {parentcategoryList.length ? (
              <Grid item>
                <PrimaryButton
                  className={styles.shop_now_btn}
                  fullWidth
                  onClick={() => setShowHeader(false)}
                >
                  <Typography className={styles.btn_text}>Discover</Typography>
                  <img src={GoToImage} alt="-" className={styles.arrow} />
                </PrimaryButton>
              </Grid>
            ) : null}
          </Grid>
          <Grid item>
            <img src={HeroImage} alt="HeroImage" className={classes.hero_img} />
          </Grid>
        </Grid>
      )}
    </div>
  );
};

export default HeroSection;

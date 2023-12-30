/* eslint-disable react/jsx-no-target-blank */
import React from "react";
import { Grid, Typography } from "@material-ui/core";
import TwitterIcon from "../../assets/icons/twitter.svg";
import FacebookIcon from "../../assets/icons/facebook.svg";
import LinkedInIcon from "../../assets/icons/linkedin.svg";
import InstagramIcon from "../../assets/icons/instagram.svg";
import OriginalIcon from "../../assets/images/dashboard/original_logo.svg";
import GoogleStoreIcon from "../../assets/images/dashboard/google_store.svg";
import AppleStoreIcon from "../../assets/images/dashboard/apple_store.svg";

import "./FooterStyles.scss";

const footerRow2 = [
  {
    id: 1,
    text: `FAQ's`,
    link: "/cms/faqs/faq-customers",
  },
  {
    id: 2,
    text: `Terms & Conditions`,
    link: "/cms/terms-and-conditions-customers",
  },
  {
    id: 3,
    text: `Terms of Use`,
    link: "/cms/terms-and-conditions-customers",
  },
  {
    id: 4,
    text: `Shipping`,
    link: "/cms/shipping-customers",
  },
  {
    id: 5,
    text: `Cancellation`,
    link: "/cms/cancellation-customers",
  },
  {
    id: 6,
    text: `Returns`,
    link: "/cms/returns-customers",
  },
  {
    id: 7,
    text: `Privacy Policy`,
    link: "/cms/privacy-policy-customers",
  },
  {
    id: 8,
    text: `Site Map`,
    link: "/cms/sitemap-customers",
  },
];

const footerRow3 = [
  {
    id: 1,
    img: OriginalIcon,
    text1: "100 % ORIGINAL ",
    text2: "products at gomble.com",
  },
];

const Footer = () => {
  const DAY = new Date();
  const YEAR = DAY.getFullYear();


  return (
    <React.Fragment>
      <Grid container className="footer_main" direction="column">
        <Grid item container spacing={4} className="footer_top">
          {/* Row-2 */}
          <Grid item container direction="column" xs={12} sm={6} md={2}>
            <Grid item>
              <Typography variant="h4" className="footer_header">
                Useful Links
              </Typography>
            </Grid>
            {footerRow2.map((item) => (
              <Grid item key={item.id}>
                <Typography variant="h4" className="links">
                  {item.link ? <a href={item.link}>{item.text}</a> : item.text}
                </Typography>
              </Grid>
            ))}
          </Grid>
          {/* Row-3 */}
          <Grid item container direction="column" xs={12} sm={6} md={4}>
            {footerRow3.map((item) => (
              <Grid
                item
                container
                direction="row"
                key={item.id}
                spacing={2}
                className="footer_header"
                style={{ gap: 10 }}
              >
                <Grid item xs={2}>
                  <img src={item.img} alt="logo" />
                </Grid>
                <Grid item xs={8}>
                  <span>{item.text1}</span>
                  <span className="static_content_font">{item.text2}</span>
                </Grid>
              </Grid>
            ))}
          </Grid>
          {/* Row-4 */}
          <Grid item container direction="column" xs={12} sm={6} md={4}>
            <Grid item>
              <Typography variant="h4" className="footer_header">
                Experience Gomble App on Mobile
              </Typography>
            </Grid>
            <Grid item className="store_box">
              <img src={GoogleStoreIcon} alt="google_store" className="store" />
              <img src={AppleStoreIcon} alt="apple_store" />
            </Grid>
            <Grid item>
              <Typography variant="h4" className="footer_header">
                Get in touch
              </Typography>
            </Grid>
            <Grid item container>
              <Grid item>
                <img src={TwitterIcon} alt="Twitter" className="social" />
              </Grid>
              <Grid item>
                <img src={FacebookIcon} alt="Facebook" className="social" />
              </Grid>
              <Grid item>
                <img src={LinkedInIcon} alt="LinkedIn" className="social" />
              </Grid>
              <Grid item>
                <img src={InstagramIcon} alt="Insta" className="social" />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        {/* Below-divider */}
        <Grid item container className="footer_bottom" justify="flex-end">
          <Grid item>
            <Typography variant="h4" className="links" noWrap>
              &#169;
              {`${YEAR || "2021"} Gomble, Inc. All Rights Reserved`}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Footer;

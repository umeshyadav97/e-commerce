import React from "react";
import { Grid, Typography, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    height: "100%",
    padding: "48px 80px",
    background: "#fff",
  },
  content: {
    display: "flex",
    justifyContent: "center",
    textAlign: "justify",
    fontFamily: "Inter Regular",
    fontSize: "16px",
    lineHeight: "24px",
    color: "#242424",
  },
  appbar: {
    backgroundColor: "#FFFFFF",
    color: "black",
    padding: "13px 0px 13px 21px",
  },
  logo: {
    cursor: "pointer",
    fontSize: 24,
    fontWeight: 600,
  },
  header: {
    fontSize: 18,
    fontWeight: 600,
  },
  title: {
    fontFamily: "Inter SemiBold",
    fontSize: "24px",
    lineHeight: "40px",
    color: "#242424",
  },
  paper: {
    paddingBottom: "20px",
    borderBottom: "1px solid #D3DCEB",
    marginBottom: "20px",
  },
  text: {
    fontFamily: "Inter Regular",
    fontSize: "16px",
    color: "#242424",
  },
}));

const UserAgreement = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid container className={classes.headerBox}>
        <Grid container alignItems={"center"} className={classes.paper}>
          <Grid item className={classes.header}>
            <Typography className={classes.title}>User Agreement</Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Typography className={classes.text}>
            &emsp; &ensp; Welcome to Gomble, the online platform that allows
            fashion designers to sell clothing and custom clothing both
            in-person and online. Please read this User Agreement carefully
            before using our services.
          </Typography>
        </Grid>
        <Grid item>
          <Grid item className={classes.header}>
            <Typography className={classes.title}>
              Acceptance of Terms
            </Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.text}>
              &emsp; &ensp; By accessing and using Gomble, you agree to be bound
              by this User Agreement, as well as any additional terms,
              guidelines and rules that are posted on the website from time to
              time. If you do not agree with any part of this User Agreement,
              you may not use our services.
            </Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Grid item className={classes.header}>
            <Typography className={classes.title}>Use of Services</Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.text}>
              &emsp; &ensp; Gomble is a platform that allows fashion designers
              to sell clothing and custom clothing both in-person and online.
              The platform allows users to purchase products using cash or card
              in-store through our POS system. By using our services, you agree
              to comply with all applicable laws, rules and regulations.
            </Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Grid item className={classes.header}>
            <Typography className={classes.title}>User Conduct</Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.text}>
              &emsp; &ensp; You agree not to use Gomble for any illegal or
              unauthorized purpose. You also agree not to use the platform to
              harass, intimidate, threaten, impersonate or harm any person.
              Furthermore, you agree not to use our services to upload, post or
              otherwise transmit any content that is offensive, abusive,
              defamatory, or in any way violates the rights of any person.
            </Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Grid item className={classes.header}>
            <Typography className={classes.title}>Payment and Fees</Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.text}>
              &emsp; &ensp; Gomble charges a fee for each transaction completed
              on the platform. The fee amount will be clearly stated on the
              platform before you make a purchase. All fees are non-refundable.
            </Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Grid item className={classes.header}>
            <Typography className={classes.title}>
              Intellectual Property
            </Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.text}>
              &emsp; &ensp; All content on Gomble, including but not limited to
              logos, trademarks, text, graphics, photographs, videos, music and
              software, is the property of Gomble or its licensors and is
              protected by copyright, trademark and other laws. You may not use
              any of the content on the platform for commercial purposes without
              our express written consent.
            </Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Grid item className={classes.header}>
            <Typography className={classes.title}>
              Limitation of Liability
            </Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.text}>
              &emsp; &ensp; Gomble shall not be liable for any damages, whether
              direct, indirect, incidental, special or consequential, arising
              from the use of our services, including but not limited to loss of
              profits, business interruption or any other pecuniary loss.
              Furthermore, Gomble shall not be liable for any damages arising
              from any breach of security or any unauthorized access to your
              personal information.
            </Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Grid item className={classes.header}>
            <Typography className={classes.title}>Indemnification</Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.text}>
              &emsp; &ensp; You agree to indemnify and hold harmless Gomble, its
              officers, directors, employees and agents, from and against any
              claims, damages, liabilities, costs and expenses, including but
              not limited to reasonable attorneys' fees, arising from your use
              of our services or your breach of this User Agreement.
            </Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Grid item className={classes.header}>
            <Typography className={classes.title}>
              Modification of Terms
            </Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.text}>
              &emsp; &ensp; Gomble reserves the right to modify this User
              Agreement at any time, without prior notice. Your continued use of
              our services following any such modification constitutes your
              agreement to be bound by the revised User Agreement.
            </Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Grid item className={classes.header}>
            <Typography className={classes.title}>Termination</Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.text}>
              &emsp; &ensp; Gomble reserves the right to terminate your access
              to our services at any time, without prior notice, for any reason
              whatsoever. Upon termination, you must immediately cease using our
              services.
            </Typography>
          </Grid>
        </Grid>
        <Grid item>
          <Grid item className={classes.header}>
            <Typography className={classes.title}>Governing Law</Typography>
          </Grid>
          <Grid item>
            <Typography className={classes.text}>
              &emsp; &ensp; This User Agreement shall be governed by and
              construed in accordance with the laws of the State of California,
              without regard to its conflicts of laws provisions. By using
              Gomble, you acknowledge that you have read, understood and agreed
              to the terms and conditions of this User Agreement. If you have
              any questions or concerns, please contact us at
              support@gomble.com.
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </div>
  );
};

export default UserAgreement;

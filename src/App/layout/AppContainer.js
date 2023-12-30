import React from "react";
import { withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import Header from "../components/Layout/Header";
import Footer from "../components/Layout/Footer";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100vw",
    minHeight: "100vh",

    [theme.breakpoints.up("xl")]: {
      width: "100%",
      backgroundColor: '#f0f1f4'
    },
    [theme.breakpoints.up("xl")]: {
      maxWidth: "1550px",
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  rootMain: {
    [theme.breakpoints.up("xl")]: {
      maxWidth: "1550px",
      marginLeft: "auto",
      marginRight: "auto",
    },
  }
}));

const Content = (props) => (
  <div
    style={{
      marginTop: "50px", //changed 110 to 50 px
      marginBottom:"15px",
    }}
  >
    {props.children}
  </div>
);

const AppContainer = (props) => {
  const classes = useStyles();
  return (
    <div className={classes.rootMain}>
      <Header />
      <Content>{props.children}</Content>
      <Footer />
    </div>
  );
};

const mapStateToProps = ({ auth: { user } }) => ({
  user,
});

export default connect(mapStateToProps)(withRouter(AppContainer));

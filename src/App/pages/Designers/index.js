import React from "react";
import Filters from "./components/Filters";
import { connect } from "react-redux";
import { Breadcrumbs, Typography, makeStyles } from "@material-ui/core";
import Link from "@material-ui/core/Link";

const Dashboard = (props) => {
  const classes = useStyles();
  return (
    <React.Fragment>
      <div className={classes.root}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/home">
            <Typography className={classes.Link}>Home</Typography>
          </Link>
          <Link color="inherit">
            <Typography className={classes.Link}>Designer</Typography>
          </Link>
        </Breadcrumbs>
      </div>
      <br />
      <Filters search={props.search} />
    </React.Fragment>
  );
};

const mapStateToProps = ({ auth: { isAuthenticated } }) => ({
  isAuthenticated,
});
export default connect(mapStateToProps, null)(Dashboard);

const useStyles = makeStyles((theme) => ({
  root: {
    marginLeft: 20,
    marginRight: 20,
    [theme.breakpoints.down("sm")]: {
      marginLeft: 24,
      marginRight: 24,
    },
  },
  Link: {
    "&:hover": {
      color: "#fc68a2",
    },
    textTransform: "capitalize",
    fontWeight: 500,
    fontSize: "10px",
    cursor: "pointer",
  },
}));

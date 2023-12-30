import gombleLogo from "../../../assets/images/auth/gomble-customer-logo.svg";
import { React } from "react";
import { Typography, Grid, makeStyles, Box } from "@material-ui/core";

export default function GombleLogo() {
  const classes = useStyles();

  return (
    <div>
      <Box className={classes.container} mt={4}>
        <Grid item>
          <span
            onClick={() => window.location.replace("/home")}
            className={classes.Heading}
          >
            Gomble
          </span>
        </Grid>
        <Grid item xs={11} sm={9}>
          <Typography className={classes.SubHeading}>
            Innovative software tool to help fashion brands & manufacturers to
            produce faster.
          </Typography>
        </Grid>
      </Box>
      <Grid
        container
        justifyContent="center"
        style={{ backgroundColor: "#FFD5DA", height: "100vh" }}
      >
        <Grid item xs={11} sm={9}>
          <img
            className={classes.Image}
            width="100%"
            src={gombleLogo}
            alt="logo"
          />
        </Grid>
      </Grid>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  Heading: {
    color: "#242424",
    fontFamily: "Inter Bold",
    fontSize: "28px",
    fontWeight: "bold",
    letterSpacing: 0,
    lineHeight: "40px",
    cursor: "pointer",
    "&:hover": {
      color: "#FC68A2",
    },
  },
  SubHeading: {
    color: "#242424",
    fontFamily: "Inter SemiBold",
    fontSize: "24px",
    fontWeight: "bold",
    letterSpacing: 0,
    lineHeight: "40px",
    marginTop: "85px",
    marginBottom: "91px",
  },
  Image: {
    [theme.breakpoints.down("lg")]: {
      height: "auto",
      maxWidth: "490px",
    },
    [theme.breakpoints.up("lg")]: {
      height: "auto",
      maxWidth: "80%",
    },
  },
  container: {
    marginLeft: "96px",
    [theme.breakpoints.down("sm")]: {
      marginLeft: "28px",
    },
  },
}));

import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  AppBar,
  Toolbar,
  makeStyles,
} from "@material-ui/core";
import { API, ENDPOINTS } from "../../../../api/apiService";
import { Toast } from "../../../components";

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    height: "100%",
    backgroundColor: "#F5F7FA",
  },
  content: {
    display: "flex",
    justifyContent: "center",
    textAlign: "justify",
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
  headerBox: {
    padding: "20px",
  },
  contentBox: {
    padding: "0 20px 55px",
  },
  paper: {
    borderRadius: 14,
    padding: "26px 26px 26px 26px",
    paddingLeft: "auto",
    backgroundColor: "#FFFFFF",
  },
}));

const CmsPage = (props) => {
  const classes = useStyles();
  const [record, setRecord] = useState(null);
  const ID = props.match.params.id
    ? `/${props.match.params.id}`
    : props.match.path;

  const fetchCMSPage = async () => {
    try {
      const resp = await API.get(`${ENDPOINTS.CMS}${ID}`, false);
      if (resp.success) {
        const result = resp.data;
        setRecord(result);
      }
    } catch (e) {
      const msg =
        typeof e.data.error?.message === "string"
          ? e.data.error?.message
          : e.data.error?.message[0];
      Toast.showErrorToast(msg || `Error Fetching CMS Page. Please Refresh`);
    }
  };

  useEffect(() => {
    fetchCMSPage();
  }, []);

  return (
    <div>
      {record && (
        <>
          <div className={classes.root}>
            <AppBar position="sticky" className={classes.appbar}>
              <Toolbar>
                <Typography
                  variant="h4"
                  className={classes.logo}
                  onClick={() => props.history.push("/auth/login")}
                >
                  Gomble.
                </Typography>
              </Toolbar>
            </AppBar>
            <Grid container className={classes.headerBox}>
              <Grid container className={classes.paper}>
                <Grid item className={classes.header}>
                  {record.title}
                </Grid>
              </Grid>
            </Grid>
            <Grid container className={classes.contentBox}>
              <Grid container className={classes.paper}>
                <Grid item className={classes.content}>
                  <div
                    className="Container"
                    dangerouslySetInnerHTML={{
                      __html: record.body,
                    }}
                  ></div>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </>
      )}
    </div>
  );
};

export default CmsPage;

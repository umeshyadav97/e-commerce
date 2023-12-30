import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  CssBaseline,
  Drawer,
  Grid,
  Hidden,
  Typography,
  Divider,
  Popper,
  ClickAwayListener,
  Box,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { SIDEBAR_WIDTH } from "../../constants/uiConstants";
import { useTheme } from "@material-ui/core/styles";
import { ErrorModal, Toast } from "../index";
import StorageManager from "../../../storage/StorageManager";
import { LOGOUT_TOKEN } from "../../../storage/StorageKeys";
import { API, ENDPOINTS } from "../../../api/apiService";
import gombleLogoIcon from "../../assets/icons/gomble.png";
import { baseURL } from "../../../api/apiConsts";
import ArrowRight from "../../assets/icons/ArrowRight.svg";

const drawerWidth = SIDEBAR_WIDTH;
const useSidebarStyles = makeStyles((theme) => ({
  sidebarRoot: {
    width: "100%",
    marginTop: "20px",
  },
  company_logo: {
    fontFamily: "Inter SemiBold",
    fontSize: "24px",
    color: "#242424",
  },
  wrapper: {},
  menuContainer: {
    marginTop: 33,
    paddingLeft: "36px",
    paddingRight: "36px",
    paddingBottom: 30,
    borderBottom: "1px solid #DFE7F5",
  },
  popper: {
    boxShadow: "0 6px 14px 0 rgba(149, 157, 171, 0.4)",
    borderRadius: 8,
    padding: 25,
    background: "#FFFFFF",
    border: "1px solid #DFE7F5",
  },
  popperTitle: {
    fontFamily: "Inter",
    fontStyle: "Normal",
    fontWeight: 600,
    color: "#242424",
    fontSize: 16,
    cursor: "pointer",
  },
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  toolbar: {
    padding: "30px",
    display: "flex",
  },
  drawerPaper: {
    width: "100%",
    overflowX: "hidden",
    borderRight: "hidden",
  },
  topRoot: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: "22px",
    paddingRight: "22px",
  },
  title: {
    color: "#242424",
    fontFamily: "Inter SemiBold",
    fontSize: "18px",
    fontWeight: 600,
    letterSpacing: "normal",
    lineHeight: "28px",
    cursor: "pointer",
    textTransform: "capitalize",
    textDecoration: "none",
    "&:hover": {
      color: "#FC68A2",
    },
  },
  titleSelected: {
    color: "#FC68A2",
    fontFamily: "Inter SemiBold",
    fontSize: "18px",
    fontWeight: 600,
    letterSpacing: "normal",
    lineHeight: "28px",
    cursor: "pointer",
    textTransform: "capitalize",
    textDecoration: "none",
  },
  parentItem: {
    paddingBottom: "19px",
  },
  bottomMenu: {
    marginTop: 33,
    paddingLeft: "36px",
    paddingRight: "36px",
    paddingBottom: 30,
  },
  titleBottom: {
    color: "#242424",
    fontFamily: "Inter Medium",
    fontSize: "14px",
    fontWeight: 600,
    letterSpacing: "normal",
    lineHeight: "28px",
    cursor: "pointer",
    textTransform: "capitalize",
    textDecoration: "none",
    "&:hover": {
      color: "#FC68A2",
    },
  },
  parentItemBottom: {
    paddingTop: "10px",
    paddingBottom: "10px",
    display: "flex",
    alignItems: "center",
  },
}));

const Sidebar = (props) => {
  const { windows } = props;
  const history = useHistory();
  const classes = useSidebarStyles();
  const theme = useTheme();
  const [ShowDropDown, setShowDropDown] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [anchorElMenu, setAnchorElMenu] = useState(null);
  const [placement, setPlacement] = useState();
  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };
  const handleClickMenu = (newPlacement) => (event) => {
    setAnchorElMenu(event.currentTarget);
    setPlacement(newPlacement);
  };

  const openLogoutModal = () => {
    setShowLogout(true);
  };

  const handleClickAway = () => {
    setShowDropDown(false);
  };

  const handleLogout = async () => {
    const refresh_token = StorageManager.get(LOGOUT_TOKEN);
    const payload = {
      refresh_token,
    };
    try {
      const resp = await API.deleteResource(ENDPOINTS.LOGOUT, payload, true);
      if (resp.success) {
        history.replace("/auth/login");
        localStorage.clear();
        Toast.showSuccessToast(resp.data.message || "Logout successfully!");
      }
    } catch (e) {
      const msg =
        typeof e.data.error?.message === "string"
          ? e.data.error?.message
          : e.data.error?.message[0];
      Toast.showErrorToast(msg || `Error logging out`);
    }
  };

  const drawer = (
    <div className={classes.sidebarRoot}>
      <div className={classes.topRoot}>
        <a href="/home">
          <img src={gombleLogoIcon} style={{ width: "120px" }} alt="Home" />
        </a>
        <div onClick={props.handleToggleDrawer}>X</div>
      </div>
      <div className={classes.wrapper}>
        <div className={classes.menuContainer}>
          <Grid
            item
            className={classes.parentItem}
            onClick={() => setShowDropDown(!ShowDropDown)}
          >
            <Typography
              className={classes.title}
              onClick={handleClickMenu("bottom")}
            >
              Platforms
            </Typography>
          </Grid>
          <Grid item className={classes.parentItem}>
            <a className={classes.title} href={"/designers"}>
              <Typography className={classes.title}>Designer</Typography>
            </a>
          </Grid>
        </div>
      </div>
      {props.isLoggedIn && (
        <div className={classes.bottomMenu}>
          <Grid item className={classes.parentItemBottom}>
            <a className={classes.titleBottom} href={`/orders`}>
              <Typography className={classes.titleBottom}>My Orders</Typography>
            </a>
          </Grid>
          <Grid item className={classes.parentItemBottom}>
            <a className={classes.titleBottom} href={`/edit-profile`}>
              <Typography className={classes.titleBottom}>
                Edit Profile
              </Typography>
            </a>
          </Grid>
          {props?.passwordFlag && (
            <Grid item className={classes.parentItemBottom}>
              <a className={classes.titleBottom} href={`/change-password`}>
                <Typography className={classes.titleBottom}>
                  Change Password
                </Typography>
              </a>
            </Grid>
          )}
          <Grid item className={classes.parentItemBottom}>
            <a className={classes.titleBottom} href={`/saved-address`}>
              <Typography className={classes.titleBottom}>
                Saved Address
              </Typography>
            </a>
          </Grid>
          <Grid item className={classes.parentItemBottom}>
            <a className={classes.titleBottom} href={`/credit-notes`}>
              <Typography className={classes.titleBottom}>
                Credit Notes
              </Typography>
            </a>
          </Grid>
          <Grid item className={classes.parentItemBottom}>
            <a className={classes.titleBottom} href={`/appointment`}>
              <Typography className={classes.titleBottom}>
                Appointments
              </Typography>
            </a>
          </Grid>
          <Grid item className={classes.parentItemBottom}>
            <div onClick={openLogoutModal}>
              <Typography className={classes.titleBottom}>Logout</Typography>
            </div>
          </Grid>
        </div>
      )}
      <ErrorModal
        isWarning={true}
        open={showLogout}
        title="Logout"
        description="Are you sure that you want to logout?"
        handleClose={() => setShowLogout(false)}
        handleSubmit={handleLogout}
      />
      {ShowDropDown && (
        <Box>
          <ClickAwayListener onClickAway={handleClickAway}>
            <Popper
              open={ShowDropDown}
              anchorEl={anchorElMenu}
              placement={placement}
              transition
              style={{ zIndex: 10000 }}
            >
              <Grid
                container
                justifyContent="center"
                className={classes.popper}
              >
                <Grid item style={{ border: "1px ", marginTop: "-5px" }}>
                  <Grid container style={{ marginLeft: 10, marginBottom: 20 }}>
                    <Grid
                      item
                      xs={11}
                      className={classes.popperTitle}
                      onClick={() =>
                        openInNewTab(baseURL.replace("api", "manufacturer"))
                      }
                      style={{ marginTop: 20, paddingRight: "3em" }}
                    >
                      Become a Manufacturer
                    </Grid>
                    <Grid item xs={1}>
                      <img
                        src={ArrowRight}
                        alt="Right"
                        style={{ marginTop: "1.6em" }}
                      />
                    </Grid>
                  </Grid>
                  <Divider />
                  <Grid container style={{ marginLeft: 10 }}>
                    <Grid
                      item
                      xs={11}
                      className={classes.popperTitle}
                      onClick={() =>
                        openInNewTab(baseURL.replace("api", "supplier"))
                      }
                      style={{ marginTop: 20, paddingRight: "3em" }}
                    >
                      Become a Supplier
                    </Grid>
                    <Grid item xs={1}>
                      <img
                        src={ArrowRight}
                        alt="Right"
                        style={{ marginTop: "1.6em" }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Popper>
          </ClickAwayListener>
        </Box>
      )}
    </div>
  );

  const container =
    windows !== undefined ? () => window().document.body : undefined;
  return (
    <div className={classes.root}>
      <CssBaseline />
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden smUp implementation="css">
          <Drawer
            container={container}
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
            open={props.open}
            onClose={props.handleToggleDrawer}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            className=""
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown implementation="css">
          <Drawer
            classes={{
              paper: classes.drawerPaper,
            }}
            variant="permanent"
            open
          >
            {drawer}
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
};
export default Sidebar;

import React, { useEffect, useState } from "react";
import { useHistory, useLocation, Link } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { connect } from "react-redux";
import { API, ENDPOINTS } from "../../../api/apiService";
import { baseURL } from "../../../api/apiConsts";
import {
  logout,
  setParentCategories,
} from "../../../redux/actions/authActions";
import { ErrorModal, SearchInput, Toast } from "../index";
import CartUpdated from "../../assets/icons/CartUpdated.svg";
import accountIcon from "../../assets/icons/my-account.svg";
import WishListUpdated from "../../assets/icons/WishListUpdated2.svg";
import gombleLogoIcon from "../../assets/icons/gomble.png";
import ArrowRight from "../../assets/icons/ArrowRight.svg";
import {
  Divider,
  Grid,
  IconButton,
  Box,
  Popper,
  ClickAwayListener,
} from "@material-ui/core";
import StorageManager from "../../../storage/StorageManager";
import { API_TOKEN, LOGOUT_TOKEN } from "../../../storage/StorageKeys";
import { Typography } from "@material-ui/core";
import useDebounce from "../../hooks/useDebounce";
import MenuIcon from "@material-ui/icons/Menu";
import Notification from "../../assets/icons/NotificationUpdated.svg";
import Sidebar from "./Sidebar";
import { PrimaryButton } from "../index";
import { getSession, removeSession } from "./sessionStorage";
const drawerWidth = 240;

const Header = (props) => {
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState(null);
  const [showLogout, setShowLogout] = useState(false);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [sending, setSending] = useState(false);
  const [parentcategoryList, setParentCategoryList] = useState([]);
  const [search, setSearch] = useState(null);
  const [passwordFlag, setPasswordFlag] = useState(false);
  const [parentId, setParentId] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const location = useLocation();
  const [ShowDropDown, setShowDropDown] = useState(false);
  const [anchorElMenu, setAnchorElMenu] = useState(null);
  const [placement, setPlacement] = useState();
  const deviceToken = getSession("device-token");
  const debouncedSearchTerm = useDebounce(search, 1000);

  const ShowSearch =
    window.location.pathname === "/change-password" ? false : true;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClickMenu = (newPlacement) => (event) => {
    setAnchorElMenu(event.currentTarget);
    setPlacement(newPlacement);
  };

  const checkActiveDesigner = (item) => {
    let isActive = location.pathname.toLowerCase().match(item.toLowerCase());
    return isActive;
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    if (!sending) {
      setSending(true);
      const refresh_token = StorageManager.get(LOGOUT_TOKEN);
      const payload = {
        refresh_token,
      };
      try {
        const resp = await API.deleteResource(ENDPOINTS.LOGOUT, payload, true);
        if (resp.success) {
          localStorage.clear();
          history.replace("/auth/login");
          Toast.showSuccessToast(resp.data.message || "Logout successfully");
        }
      } catch (e) {
        if (e.data.error) {
          if (
            Array.isArray(e.data.error.message) &&
            e.data.error.message.length > 0
          ) {
            Toast.showErrorToast(e.data.error.message[0]);
          }
        }
      } finally {
        handleClose();
        setSending(false);
      }
    }
  };

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
        setParentCategories(resData);
      }
    } catch (e) {
      console.log(e, "error in header get category list");
    }
  };

  const handleParentCategoryChange = (id) => {
    setParentId(id);
    history.push(`/home/${id}`);
  };
  const handleSearchInput = (e) => {
    setSearch(e.target.value);
  };

  const handleCloseSearch = () => {
    if (search !== "") {
      setSearch("");
    }
  };

  const handleToggleDrawer = () => {
    setShowSidebar(!showSidebar);
  };

  useEffect(() => {
    if (debouncedSearchTerm !== null) {
      if (debouncedSearchTerm || "") {
        history.push({
          pathname: `/product-search/${search}`,
          state: { search: search },
        });
      } else {
        history.push({
          pathname: `/home`,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (!!StorageManager.get(API_TOKEN)) {
      setLoggedIn(true);
    }
    getCategoryList();
    let isSocialLogged = localStorage.getItem("social_signup");
    if (isSocialLogged === "false") {
      setPasswordFlag(true);
    }
  }, []);

  const checkDeviceToken = async () => {
    const sessionId = getSession("session-id");
    const payload = {
      device_token: JSON.parse(deviceToken),
      device_type: "IOS",
      is_safari: "true",
    };

    // const instance = new NetworkManager(
    //   API.APN_ROUTES,
    //   payload,
    //   JSON.parse(sessionId)
    // );

    const resp = await API.patch(
      ENDPOINTS.APN_ROUTES,
      payload,
      JSON.parse(sessionId)
    );

    // const response = await instance.httpRequest();
    if (resp.success) {
      removeSession("safari-device-token");
    }
  };
  useEffect(() => {
    if (deviceToken) {
      checkDeviceToken();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceToken]);

  const handleClickAway = () => {
    setShowDropDown(false);
  };

  const openInNewTab = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid
          item
          xs={2}
          sm={5}
          md={6}
          lg={5}
          xl={5}
          className={classes.sidebar}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleToggleDrawer}
            className={classes.menuButton}
          >
            <MenuIcon />
          </IconButton>
        </Grid>
        <Grid
          item
          xs={2}
          sm={5}
          md={6}
          lg={5}
          xl={5}
          className={classes.leftContainer}
        >
          <Grid container direction="row" spacing={5} alignItems="center">
            <Grid item className="row-center">
              <a href="/home">
                <img src={gombleLogoIcon} className={classes.icon} alt="Home" />
              </a>
            </Grid>
            <Grid
              item
              className={
                checkActiveDesigner("Designer")
                  ? classes.activeTitle
                  : classes.disableTitle
              }
            >
              <Link to="/designers" className={classes.title}>
                <Typography className={classes.title}>Designer</Typography>
              </Link>
            </Grid>
            <Grid item onClick={() => setShowDropDown(!ShowDropDown)}>
              <Typography
                className={classes.title}
                onClick={handleClickMenu("bottom")}
              >
                Platforms
              </Typography>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={10} sm={7} md={6} lg={7} xl={7}>
          <Grid
            container
            direction="row-reverse"
            alignItems="center"
            className={classes.rightContainer}
          >
            {isLoggedIn ? (
              <React.Fragment>
                <Grid
                  container
                  justifyContent="flex-end"
                  spacing={1}
                  className={classes.loginContainer}
                >
                  {ShowSearch && (
                    <Grid item className={classes.searchItem}>
                      <SearchInput
                        is_open={false}
                        is_input_open={isLoggedIn ? true : false}
                        value={search}
                        onChange={handleSearchInput}
                        onClose={handleCloseSearch}
                        placeholder="Search products,designer"
                      />
                    </Grid>
                  )}
                  <Grid item>
                    <Grid container className={classes.IconContainer}>
                      <Grid item className={classes.Notification}>
                        <div
                          style={{ position: "relative", cursor: "pointer" }}
                          onClick={() => history.replace("/notification")}
                        >
                          {props?.notification?.data > 0 ? (
                            <div
                              style={{
                                height: "18px",
                                width: "18px",
                                border: "1px solid #FFFFFF",
                                backgroundColor: "#FC68A2",
                                textAlign: "center",
                                marginLeft: "12px",
                                position: "absolute",
                                borderRadius: "50%",
                                color: "#FFFFFF",
                                fontFamily: "Inter",
                                fontSize: "8px",
                                fontWeight: 600,
                                letterSpacing: 0,
                                lineHeight: "10px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              {props?.notification?.data || ""}
                            </div>
                          ) : (
                            ""
                          )}
                          <img
                            src={Notification}
                            style={{
                              height: "24px",
                              width: "24px",
                              cursor: "pointer",
                            }}
                            alt="notify icon"
                          />
                        </div>
                      </Grid>
                      <Grid item className={classes.wishlistItem}>
                        <Link to="/wishlist">
                          <img
                            src={WishListUpdated}
                            style={{
                              height: "23.5px",
                              width: "18px",
                              cursor: "pointer",
                            }}
                            alt="wishlist icon"
                          />
                        </Link>
                      </Grid>
                      <Grid item className={classes.cartItem}>
                        <Link to="/cart">
                          <img
                            src={CartUpdated}
                            style={{
                              height: "24.2px",
                              width: "24.2px",

                              cursor: "pointer",
                            }}
                            alt="cart icon"
                          />
                        </Link>
                        {props.cartItems > 0 && (
                          <span className={classes.badge} id="lblCartCount">
                            <span>{props.cartItems}</span>
                          </span>
                        )}
                      </Grid>
                      <Grid item className={classes.accountItem}>
                        <img
                          src={accountIcon}
                          onClick={handleClick}
                          style={{
                            height: "24px",
                            width: "21px",
                            cursor: "pointer",
                          }}
                          alt="account icon"
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <Grid container spacing={1} justifyContent="flex-end">
                  <Grid item>
                    <SearchInput
                      is_open={false}
                      is_input_open={isLoggedIn ? true : false}
                      value={search}
                      onChange={handleSearchInput}
                      onClose={handleCloseSearch}
                      placeholder="Search"
                    />
                  </Grid>
                  <Grid item className={classes.signupItem}>
                    <Typography
                      onClick={() => {
                        history.push("/auth/login");
                      }}
                      className={classes.SignInbtn}
                    >
                      Sign In
                    </Typography>
                  </Grid>
                  <Grid item className={classes.signupBreak}>
                    <Typography style={{ color: "#708099" }}> / </Typography>
                  </Grid>
                  <Grid item className={classes.loginItem}>
                    <Typography
                      onClick={() => {
                        history.push("/auth/customer-signup");
                      }}
                      className={classes.SignInbtn}
                    >
                      Sign Up
                    </Typography>
                  </Grid>
                  <PrimaryButton
                    style={{ fontWeight: 500 }}
                    className={classes.DesignerButton}
                    onClick={() =>
                      openInNewTab(baseURL.replace("api", "designer"))
                    }
                  >
                    Become a Designer
                  </PrimaryButton>
                </Grid>
              </React.Fragment>
            )}
            <Menu
              id="account-menu"
              anchorEl={anchorEl}
              keepMounted
              autoFocus={false}
              disableAutoFocusItem={true}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              getContentAnchorEl={null}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              transformOrigin={{ vertical: "top", horizontal: "center" }}
              style={{ marginTop: "4px" }}
            >
              <Link to="/orders" className={classes.link}>
                <MenuItem
                  onClick={() => {
                    handleClose();
                  }}
                >
                  My Orders
                </MenuItem>
              </Link>
              <Link to="/edit-profile" className={classes.link}>
                <MenuItem
                  onClick={() => {
                    handleClose();
                  }}
                >
                  Edit Profile
                </MenuItem>
              </Link>
              {passwordFlag ? (
                <Link to="/change-password" className={classes.link}>
                  <MenuItem
                    onClick={() => {
                      handleClose();
                    }}
                  >
                    Change Password
                  </MenuItem>
                </Link>
              ) : null}
              <Link to="/saved-address" className={classes.link}>
                <MenuItem
                  onClick={() => {
                    handleClose();
                  }}
                >
                  Saved Address
                </MenuItem>
              </Link>
              <Link to="/credit-notes" className={classes.link}>
                <MenuItem
                  onClick={() => {
                    handleClose();
                  }}
                >
                  Credit Notes
                </MenuItem>
              </Link>
              <Link to="/appointment" className={classes.link}>
                <MenuItem
                  onClick={() => {
                    handleClose();
                  }}
                >
                  Appointments
                </MenuItem>
              </Link>
              <MenuItem
                className={classes.logout}
                onClick={() => {
                  setShowLogout(true);
                }}
              >
                Logout
              </MenuItem>
            </Menu>

            <ErrorModal
              isWarning={true}
              open={showLogout}
              title="Logout"
              description="Are you sure you want to logout?"
              handleClose={() => setShowLogout(false)}
              handleSubmit={handleLogout}
            />
            {showSidebar && (
              <Sidebar
                open={showSidebar}
                drawerWidth={drawerWidth}
                handleToggleDrawer={handleToggleDrawer}
                parentcategoryList={parentcategoryList}
                handleParentCategoryChange={handleParentCategoryChange}
                parentId={parentId}
                passwordFlag={passwordFlag}
                isLoggedIn={isLoggedIn}
              />
            )}
          </Grid>
        </Grid>
      </Grid>
      <Divider style={{ background: "#DFE7F5", marginTop: 10 }} />
      {ShowDropDown && (
        <Box>
          <ClickAwayListener onClickAway={handleClickAway}>
            <Popper
              open={ShowDropDown}
              anchorEl={anchorElMenu}
              placement={placement}
              transition
              style={{ zIndex: 1000, marginLeft: "13em" }}
            >
              <Grid
                container
                justifyContent="center"
                className={classes.popper}
                // style={{
                //   marginLeft: "0.8em",
                //   boxShadow: "0 6px 14px 0 rgba(149, 157, 171, 0.4)",
                //   borderRadius: 8,
                //   padding: 25,
                // }}
              >
                <Grid item style={{ border: "1px ", marginTop: "-5px" }}>
                  <Grid container style={{ marginLeft: 10, marginBottom: 20 }}>
                    <Grid
                      item
                      xs={11}
                      className={classes.popperTitle}
                      style={{ marginTop: 20, paddingRight: "3em" }}
                    >
                      <a
                        className={classes.link}
                        href={baseURL.replace("api", "manufacturer")}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Become a Manufacturer
                      </a>
                    </Grid>
                    <Grid item xs={1}>
                      <a
                        className={classes.link}
                        href={baseURL.replace("api", "manufacturer")}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={ArrowRight}
                          alt="Right"
                          style={{ marginTop: "1.6em" }}
                        />
                      </a>
                    </Grid>
                  </Grid>
                  <Divider />
                  <Grid container style={{ marginLeft: 10 }}>
                    <Grid
                      item
                      xs={11}
                      className={classes.popperTitle}
                      style={{ marginTop: 20, paddingRight: "3em" }}
                    >
                      <a
                        className={classes.link}
                        href={baseURL.replace("api", "supplier")}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Become a Supplier
                      </a>
                    </Grid>
                    <Grid item xs={1}>
                      <a
                        href={baseURL.replace("api", "supplier")}
                        target="_blank"
                        className={classes.link}
                        rel="noreferrer"
                      >
                        <img
                          src={ArrowRight}
                          alt="Right"
                          style={{ marginTop: "1.6em" }}
                        />
                      </a>
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
};

const mapStateToProps = ({ auth: { profile, cartItems, notification } }) => ({
  profile,
  cartItems,
  notification,
});

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout()),
    setParentCategories: () => dispatch(setParentCategories()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);

const useStyles = makeStyles((theme) => ({
  root: () => ({
    backgroundColor: "white",
    paddingRight: "0px",
    paddingLeft: "0px",
    paddingTop: "5px",
    zIndex: 99,
    width: "100%",
    top: 0,
    [theme.breakpoints.between("md", "sm")]: {
      paddingLeft: "40px",
    },
    // [theme.breakpoints.down("xs")]: {
    //   paddingLeft: "20px",
    // },
  }),
  loginContainer: {
    [theme.breakpoints.down("sm")]: {
      marginRight: 15,
    },
  },
  leftContainer: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  rightContainer: {
    display: "flex",
    [theme.breakpoints.down("sm")]: {
      marginRight: "48px",
    },
    [theme.breakpoints.down("xs")]: {
      marginRight: "0px",
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
    [theme.breakpoints.down("sm")]: {
      marginRight: "0px",
      marginLeft: "0px",
    },
  },
  sidebar: {
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  title: {
    color: "#708099",
    fontFamily: "Inter SemiBold",
    fontSize: "16px",
    fontWeight: 500,
    letterSpacing: 0,
    lineHeight: "28px",
    cursor: "pointer",
    textTransform: "capitalize",
    textDecoration: "none",
    "&:hover": {
      color: "#FC68A2",
    },
  },
  popper: {
    // marginLeft: "8em",
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
  SignInbtn: {
    color: "#708099",
    fontFamily: "Inter Medium",
    fontSize: "14px",
    fontWeight: 500,
    letterSpacing: 0,
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
    letterSpacing: 0,
    lineHeight: "28px",
    cursor: "pointer",
    textTransform: "capitalize",
    textDecoration: "none",
  },
  badge: {
    borderRadius: "50%",
    backgroundColor: "#fc68a2",
    fontFamily: "Inter Regular",
    color: "#fff",
    fontSize: 14,
    width: 24,
    height: 20,
    textAlign: "center",
    paddingTop: 4,
    verticalAlign: "top",
    marginTop: -30,
    marginLeft: -10,
  },
  icon: {
    width: 132,
    cursor: "pointer",
    marginBottom: -5,
  },
  link: {
    cursor: "pointer",
    textDecoration: "none",
    color: "#242424",
    "&:hover": {
      color: "#FC68A2",
    },
  },
  logout: {
    cursor: "pointer",
    color: "#F36666",
  },
  activeTitle: {
    marginTop: 4,
    borderBottom: "4px solid #FC68A2",
  },
  cartItem: {
    marginLeft: 16,
    marginRight: 10,
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      marginLeft: 12,
    },
  },
  wishlistItem: {
    marginLeft: 16,
    marginRight: 16,
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      marginLeft: 12,
      marginRight: 12,
    },
  },
  IconContainer: {
    marginTop: 10,
    [theme.breakpoints.down("sm")]: {
      justifyContent: "flex-end",
    },
  },
  accountItem: {
    marginLeft: 16,
    marginRight: 16,
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
  Notification: {
    marginLeft: 16,
    marginRight: 16,
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {},
  },
  loginItem: {
    marginRight: 16,
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      marginRight: 32,
    },
  },
  DesignerButton: {
    marginRight: 10,
    [theme.breakpoints.down("sm")]: {
      marginRight: 30,
    },
  },
  signupItem: {
    marginLeft: 16,
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {
      marginLeft: 12,
    },
  },
  signupBreak: {
    display: "flex",
    alignItems: "center",
    [theme.breakpoints.down("sm")]: {},
  },
  searchItem: {
    marginRight: 5,
    [theme.breakpoints.down("sm")]: {
      marginRight: 12,
    },
  },
}));

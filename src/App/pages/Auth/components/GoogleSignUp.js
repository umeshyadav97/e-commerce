import React from "react";
import { GoogleLogin } from "react-google-login";
import { withRouter } from "react-router-dom";
import { API, ENDPOINTS } from "../../../../api/apiService";
import { loginSuccess } from "../../../../redux/actions/authActions";
import { SecondaryButton, Toast } from "../../../components";
import { InputAdornment } from "@material-ui/core";
import StorageManager from "../../../../storage/StorageManager";
import { API_TOKEN, LOGOUT_TOKEN } from "../../../../storage/StorageKeys";
import { connect } from "react-redux";
import googlelogo from "../../../components/Form/assets/google.png";
import { askForPermissioToReceiveNotifications } from "../../../../pushNotification";
import { setSession } from "../../../components/Layout/sessionStorage";

const GoogleSignUp = (props) => {
  const signup = async (email, auth_token, unique_key, profile_picture) => {
    const payload = {
      email,
      auth_token,
      unique_key,
      profile_picture: profile_picture
        ? profile_picture.replace("=s96-c", "=s296-c")
        : null,
    };

    if (window.safari && window.safari.pushNotification) {
      let permissionData = window.safari.pushNotification.permission(
        "web.com.designer.gomble"
      );
      await checkRemotePermission(permissionData);
    } else {
      let deviceToken = await askForPermissioToReceiveNotifications();
      if (deviceToken) {
        payload.device = {
          device_token: deviceToken,
          device_type: "WEB",
          is_safari: false,
        };
      }
    }
    try {
      const resp = await API.post(ENDPOINTS.GoogleSignUp, payload, false, {
        "Content-Type": "application/json",
      });
      if (resp.success) {
        const { refresh, access } = resp.data.tokens;
        StorageManager.put(LOGOUT_TOKEN, refresh);
        StorageManager.put(API_TOKEN, access);
        localStorage.setItem("social_signup", resp.data.social_signup);
        props.loginSuccess({
          access,
          refresh,
        });
        if (resp.data.is_gender_provided === true) {
          localStorage.getItem("path_name")
            ? props.history.push(`${localStorage.getItem("path_name")}`)
            : props.history.push("/home");
        } else if (resp.data.is_gender_provided === false) {
          props.history.push({
            pathname: "/auth/customer-basic-profile",
            payload: {
              first_name: resp.data.first_name,
              last_name: resp.data.last_name,
              profile_picture_url: resp.data.profile_picture_url,
            },
          });
        }
      }
    } catch (e) {
      if (e.data.error) {
        if (
          Array.isArray(e.data.error.message) &&
          e.data.error.message.length > 0
        ) {
          Toast.showErrorToast(e.data.error.message[0]);
        }
      } else {
        Toast.showErrorToast("Error in google sign up,please reload the page");
      }
    }
  };

  const onSignIn = (googleUser) => {
    const email = googleUser.getBasicProfile().getEmail();
    const auth_token = googleUser.tokenId;
    const unique_key = googleUser.getBasicProfile().getId();
    const profile_picture = googleUser.getBasicProfile().getImageUrl();
    signup(email, auth_token, unique_key, profile_picture);
  };
  const onFail = (googleUser) => {
    console.log(googleUser, "signup with google fail");
  };

  const checkRemotePermission = (permissionData) => {
    if (permissionData.permission === "default") {
      window.safari.pushNotification.requestPermission(
        process.env.REACT_APP_API_Endpoint,
        "web.com.designer.gomble",
        { panel: "gomble" },
        checkRemotePermission
      );
    } else if (permissionData.permission === "denied") {
      console.log("DENIED");
      console.log(permissionData);
      // The user said no.
    } else if (permissionData.permission === "granted") {
      console.log("GRANTED", permissionData);
      setSession("device-token", permissionData.deviceToken);
      return permissionData.deviceToken;
      // The web service URL is a valid push provider, and the user said yes.
      // permissionData.deviceToken is now available to use.
    }
  };

  return (
    <GoogleLogin
      clientId="512507394622-s391794mem330thdbimf6hlulrejjcsv.apps.googleusercontent.com"
      render={(renderProps) => (
        <SecondaryButton
          style={{
            border: "1.6px solid #DFE7F5",
            "&:hover, &:focus": {
              background: "#FC68A2",
              color: "#ffffff",
            },
          }}
          onClick={renderProps.onClick}
          variant="outlined"
          type="submit"
        >
          <InputAdornment style={{ marginRight: "20px" }}>
            <img
              style={{ maxHeight: 24, maxWidth: 24 }}
              width="100%"
              src={googlelogo}
              alt="logo"
            />
          </InputAdornment>
          <span style={{ fontSize: "18px" }}> Google </span>
        </SecondaryButton>
      )}
      onSuccess={onSignIn}
      onFailure={onFail}
      prompt="select_account"
      cookiePolicy={"single_host_origin"}
    ></GoogleLogin>
  );
};

const mapStateToProps = ({ auth: { isAuthenticated } }) => ({
  isAuthenticated,
});

const mapDispatchToProps = (dispatch) => ({
  loginSuccess: (data) => dispatch(loginSuccess(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(GoogleSignUp));

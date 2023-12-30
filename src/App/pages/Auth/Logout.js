import React, { Component } from "react";
import { InputAdornment } from "@material-ui/core";
import { connect } from "react-redux";
import ArrowForwardSharpIcon from "@material-ui/icons/ArrowForwardSharp";
import { withRouter } from "react-router-dom";

import { PrimaryButton, Loader, Toast } from "../../components";

import { logout } from "../../../redux/actions/authActions";

import StorageManager from "../../../storage/StorageManager";

import { API, ENDPOINTS } from "../../../api/apiService";
import { LOGOUT_TOKEN } from "../../../storage/StorageKeys";

class Logout extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rememberMe: false,
      loading: false,
      refresh_token: "",
    };
  }

  handleLogout = async () => {
    const refresh_token = StorageManager.get(LOGOUT_TOKEN);
    this.setState({ loading: true });
    const payload = {
      refresh_token,
    };

    try {
      const resp = await API.deleteResource(ENDPOINTS.LOGOUT, payload, true);
      if (resp.success) {
        this.props.logout();
        localStorage.clear();
        sessionStorage.clear();
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
        Toast.showErrorToast("error in logout");
      }
    } finally {
      localStorage.clear();
      sessionStorage.clear();
      this.setState({ loading: false });
      this.props.history.replace("/auth/login");
    }
  };

  render() {
    const { loading } = this.state;
    return (
      <React.Fragment>
        {loading && <Loader />}
        <PrimaryButton type="submit" wide="true" onClick={this.handleLogout}>
          Log Out
          <InputAdornment position="end">
            <ArrowForwardSharpIcon size="small" />
          </InputAdornment>
        </PrimaryButton>
      </React.Fragment>
    );
  }
}

const mapStateToProps = ({ auth: { isAuthenticated } }) => ({
  isAuthenticated,
});

const mapDispatchToProps = (dispatch) => ({
  logout: (data) => dispatch(logout(data)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Logout));

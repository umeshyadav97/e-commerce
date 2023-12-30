import React from "react";
import { toast } from "react-toastify";
import { Grid } from "@material-ui/core";
import ToastErrorIcon from "../assets/icons/toast_error_icon.svg";
import ToastSuccessIcon from "../assets/icons/toast_success_icon.svg";

const customMessage = (icon, msg) => {
  return (
    <Grid container>
      <Grid item xs={2}>
        <img style={{ marginLeft: 15, marginRight: 20 }} src={icon} alt="I" />
      </Grid>
      <Grid item xs={10}>
        {msg}
      </Grid>
    </Grid>
  );
};

const showErrorToast = (message) => {
  toast.error(customMessage(ToastErrorIcon, message), {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    // closeButton: false,
  });
};

const showInfoToast = (message) => {
  toast.info(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    // closeButton: false,
  });
};

const showSuccessToast = (message) => {
  toast.success(customMessage(ToastSuccessIcon, message), {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    // closeButton: false,
  });
};

const showWarnToast = (message, position) => {
  toast.warn(message, {
    position: position ? position : "top-right",
    autoClose: 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    // closeButton: false,
  });
};

const Toast = {
  showErrorToast,
  showInfoToast,
  showWarnToast,
  showSuccessToast,
};

export default Toast;

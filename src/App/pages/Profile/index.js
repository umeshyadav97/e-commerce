/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import {
  Grid,
  Typography,
  Radio,
  RadioGroup,
  FormControlLabel,
  CircularProgress,
  Menu,
  MenuItem,
  withStyles,
  IconButton,
  InputAdornment,
  Breadcrumbs,
} from "@material-ui/core";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import {
  Toast,
  PrimaryButton,
  OutlinedPrimaryButton,
  InputField,
  CancelModal,
  LoaderContents,
  Loader,
} from "../../components";
import EditIcon from "../../assets/icons/editImage.svg";
import Verified from "../../assets/icons/Valid.svg";
import DefaultImage from "../../assets/images/Deafult_image_3.svg";
import CropModal from "./components/CropModal";
import { API, ENDPOINTS } from "../../../api/apiService";
import { profileConstants } from "./components/ProfileConstants";
import styles from "./Profile.module.css";
import helpers from "../../../utils/helpers";
import { useHistory } from "react-router-dom";
import Link from "@material-ui/core/Link";

const ITEM_HEIGHT = 48;
const StyledMenu = withStyles({
  paper: {
    border: "1.4px solid #DFE7F5",
    maxHeight: ITEM_HEIGHT * 4.5,
    paddingTop: "10px",
    paddingBottom: "10px",
    width: "20ch",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "left",
    }}
    {...props}
  />
));

const EditProfile = (props) => {
  const isLoggedIn = props.isAuthenticated;
  const [loading, setLoading] = useState(true);
  const [imageLoader, setImageLoader] = useState(true);
  const [sending, setSending] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [sendOtpBtn, setSendOtpBtn] = useState(false);
  const [verifyOtpBtn, setVerifyOtpBtn] = useState(false);
  const [verifyOtp, setVerifyOtp] = useState(false);
  const [original, setOrginal] = useState(null);
  const [record, setRecord] = useState(null);
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState(profileConstants.validationRules());
  const [cropModal, setCropModal] = useState(false);
  const [cancelModal, setCancelModal] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const history = useHistory();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCropModal = (status) => {
    setCropModal(status);
    setFile(null);
    setFileName(null);
    handleClose();
  };

  const handleCancelModal = () => {
    handleClose();
    setCancelModal(true);
  };

  const handleFileChange = (e) => {
    setAnchorEl(null);
    const temp = e.target.files[0];
    const size = temp.size / 1024 / 1024; // Calculated file size in mb
    if (size > 50) {
      Toast.showErrorToast(
        "Sorry, Your file is too large. Only 50MB is allowed."
      );
      return;
    }
    // This is done so that you can upload the same pic again
    e.target.value = "";
    setFile(URL.createObjectURL(temp));
    setFileName(temp);
    setCropModal(true);
  };

  const handleCropImage = async (canvas, status) => {
    if (status) {
      canvas.toBlob(
        (blob) => {
          changeImage(blob);
        },
        "image/png",
        1
      );
    } else {
      changeImage(fileName);
    }
    setCropModal(false);
  };

  const changeImage = (file) => {
    if (file) {
      setImageLoader(true);
      const data = new FormData();
      data.append("media", file);
      data.append("media_type", "IMAGE");
      data.append("content_type", "IMG/JPG");
      uploadToServer(data);
    }
  };

  const uploadToServer = async (data) => {
    try {
      const resp = await API.post(ENDPOINTS.MEDIA, data, true);
      if (resp.success) {
        const img_id = resp.data.id;
        const res = await API.post(ENDPOINTS.MEDIA_GET, { id: img_id }, true);
        if (res.success) {
          const img_url = res.data.media_url;
          setRecord({
            ...record,
            profile_picture: img_id,
            profile_picture_url: img_url,
          });
        }
      }
    } catch (e) {
      const msg =
        typeof e.data.error?.message === "string"
          ? e.data.error?.message
          : e.data.error?.message[0];
      Toast.showErrorToast(msg || `Error Uploading Image`);
    } finally {
      setFile(null);
      setFileName(null);
      setImageLoader(false);
    }
  };

  const handleRemoveImage = () => {
    setRecord({ ...record, profile_picture: null, profile_picture_url: null });
    setCancelModal(false);
  };

  const handleChange = (key) => (event) => {
    let tempData = { ...record };
    tempData[key] = event.target.value;
    setRecord(tempData);

    if (errors[key] !== undefined) {
      let tempErrors = { ...errors };
      tempErrors[key] = helpers.onChangeValidate(
        tempData[key],
        tempErrors[key]
      );
      setErrors(tempErrors);
    }
  };

  const handleCountryCode = (value) => {
    let tempData = { ...record };
    tempData["country_code"] = `+${value}`;
    setRecord(tempData);
  };

  const tick = () => {
    setTimeout(function () {
      setSendOtpBtn(true);
    }, 30000);
    setSendOtpBtn(false);
  };

  const handleSendOTP = async () => {
    if (!sending) {
      const payload = {
        phone: record.phone,
        country_code: record.country_code,
      };
      try {
        setSending(true);
        const resp = await API.post(ENDPOINTS.SEND_OTP, payload);
        if (resp.success) {
          Toast.showSuccessToast(resp.data.message || "OTP sent successfully");
          tick();
          setVerifyOtp(true);
        }
      } catch (e) {
        const msg =
          typeof e.data.error?.message === "string"
            ? e.data.error?.message
            : e.data.error?.message[0];
        Toast.showErrorToast(msg || `Error Sending OTP`);
      } finally {
        setSending(false);
      }
    }
  };

  const handleVerifyOTP = async () => {
    if (!sending) {
      const payload = {
        otp_code: otp,
        phone: record.phone,
        country_code: record.country_code,
      };
      try {
        setSending(true);
        const resp = await API.patch(ENDPOINTS.UPDATE_PHONE, payload);
        if (resp.success) {
          Toast.showSuccessToast(
            resp.data.message || "Phone number updated successfully"
          );
          fetchRecord();
          setSendOtpBtn(false);
          setVerifyOtp(false);
        }
      } catch (e) {
        const msg =
          typeof e.data.error?.message === "string"
            ? e.data.error?.message
            : e.data.error?.message[0];
        Toast.showErrorToast(msg || `Error verifying OTP`);
      } finally {
        setOtp("");
        setSending(false);
      }
    }
  };

  const handleUpdateProfile = async () => {
    if (!sending) {
      const { isValid, error } = helpers.validate(record, errors);
      setErrors({ ...error });
      if (isValid) {
        const payload = { ...record };
        delete payload.country_code;
        delete payload.phone;
        try {
          setSending(true);
          const resp = await API.patch(ENDPOINTS.PROFILE, payload);
          if (resp.success) {
            setOrginal(record);
            Toast.showSuccessToast(
              resp.data.message || "Profile Updated Successfully"
            );
            history.push("/home");
          }
        } catch (e) {
          const msg =
            typeof e.data.error?.message === "string"
              ? e.data.error?.message
              : e.data.error?.message[0];
          Toast.showErrorToast(msg || `Error Updating Profile`);
        } finally {
          setSending(false);
        }
      }
    }
  };

  const handleUpdateProfileImage = async () => {
    if (!sending) {
      const { isValid, error } = helpers.validate(record, errors);
      setErrors({ ...error });
      if (isValid) {
        const payload = { ...record };
        delete payload.country_code;
        delete payload.phone;
        try {
          setSending(true);
          const resp = await API.patch(ENDPOINTS.PROFILE, payload);
          if (resp.success) {
            setOrginal(record);
            Toast.showSuccessToast(
              resp.data.message || "Profile Updated Successfully"
            );
          }
        } catch (e) {
          const msg =
            typeof e.data.error?.message === "string"
              ? e.data.error?.message
              : e.data.error?.message[0];
          Toast.showErrorToast(msg || `Error Updating Profile`);
        } finally {
          setSending(false);
        }
      }
    }
  };

  const fetchRecord = async () => {
    try {
      setLoading(true);
      const resp = await API.get(ENDPOINTS.PROFILE);
      if (resp.success) {
        let result = resp.data;
        if (!result.country_code) {
          result.country_code = "+1";
        }
        setRecord(result);
        setOrginal(result);
        setIsPhoneVerified(result.phone_verified);
      }
    } catch (e) {
      const msg =
        typeof e.data.error?.message === "string"
          ? e.data.error?.message
          : e.data.error?.message[0];
      Toast.showErrorToast(msg || `Error Fetching Profile. Please Refresh`);
    } finally {
      setLoading(false);
      setImageLoader(false);
    }
  };

  // Activating the verify-otp-btn when otp length is 6
  useEffect(() => {
    if (otp.length >= 6) {
      setVerifyOtpBtn(true);
    } else {
      setVerifyOtpBtn(false);
    }
  }, [otp]);

  // Activating the send-otp button when user changes phone/country-code
  useEffect(() => {
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!original) {
      if (
        (record?.country_code !== original?.country_code ||
          record?.phone !== original?.phone) &&
        record?.country_code !== "+" &&
        record?.phone !== "" &&
        record?.phone?.length > 6
      ) {
        setSendOtpBtn(true);
      } else {
        setSendOtpBtn(false);
      }
      if (
        record?.country_code === original?.country_code &&
        record?.phone === original?.phone
      ) {
        setIsPhoneVerified(true);
        setVerifyOtp(false);
      } else {
        setIsPhoneVerified(false);
      }
    }
  }, [record?.country_code, record?.phone]);

  // Triggers update profile everytime image id edited/removed
  useEffect(() => {
    // eslint-disable-next-line no-extra-boolean-cast
    if (!!original) {
      if (record?.profile_picture !== original?.profile_picture) {
        handleUpdateProfileImage();
      }
    }
  }, [record?.profile_picture]);

  useEffect(() => {
    if (isLoggedIn) {
      fetchRecord();
    }
  }, []);

  return (
    <React.Fragment>
      {!isLoggedIn ? <Redirect to="/auth/login" /> : null}
      {loading ? (
        <LoaderContents />
      ) : (
        <Grid container className={styles.container}>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/home">
              <Typography className={styles.Link}>Home</Typography>
            </Link>
            <Link color="inherit">
              <Typography className={styles.Link}>Edit Profile</Typography>
            </Link>
          </Breadcrumbs>
          {sending && <Loader />}
          {/* Heading */}
          <Grid container item>
            <Grid item>
              <Typography variant="h4" className={styles.header}>
                Edit Profile
              </Typography>
            </Grid>
          </Grid>
          <Grid container direction="row">
            {/* Profile Photo for safari small screen */}
            <Grid
              item
              container
              direction="column"
              xs={10}
              md={5}
              className={styles.mobile_profile_container}
            >
              <Grid className={styles.image_container}>
                <div className={styles.top_right}>
                  {record.profile_picture && (
                    <IconButton
                      aria-label="more"
                      aria-controls="long-menu"
                      aria-haspopup="true"
                      onClick={handleClick}
                    >
                      <img src={EditIcon} alt="Edit" />
                    </IconButton>
                  )}
                  <StyledMenu
                    id="long-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={open}
                    onClose={handleClose}
                  >
                    <input
                      type="file"
                      id="upload-button"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                      accept="image/x-png,image/jpeg"
                    />
                    <label htmlFor="upload-button">
                      <MenuItem>Edit Photo</MenuItem>
                    </label>
                    <MenuItem onClick={handleCancelModal}>
                      <Typography className={styles.danger}>
                        Remove Photo
                      </Typography>
                    </MenuItem>
                  </StyledMenu>
                </div>
                {imageLoader ? (
                  <CircularProgress
                    color="secondary"
                    className={styles.image_loader}
                  />
                ) : (
                  <img
                    className={styles.profile_image}
                    src={record.profile_picture_url || DefaultImage}
                    alt="Profile"
                  />
                )}
              </Grid>
              {!record.profile_picture && (
                <Grid>
                  <OutlinedPrimaryButton wide size="large">
                    <label htmlFor="upload-button">
                      <Typography variant="h4" className={styles.sideHeader}>
                        Upload Photo
                      </Typography>
                    </label>
                  </OutlinedPrimaryButton>
                </Grid>
              )}
            </Grid>
            {/* Personal Details */}
            <Grid container item xs={10} md={7} className={styles.details}>
              {/* First Name */}
              <Grid item className={styles.input_field}>
                <Typography variant="h4" className={styles.label}>
                  First Name
                </Typography>
                <InputField
                  id="first_name"
                  type="text"
                  placeholder="Enter First Name"
                  variant="outlined"
                  onChange={handleChange("first_name")}
                  value={record.first_name}
                  fullWidth
                  error={!errors.first_name.valid}
                  helperText={
                    !errors.first_name.valid ? errors.first_name.message : " "
                  }
                />
              </Grid>
              {/* Last Name */}
              <Grid item className={styles.input_field}>
                <Typography variant="h4" className={styles.label}>
                  Last Name
                </Typography>
                <InputField
                  id="last_name"
                  type="text"
                  placeholder="Enter Last Name"
                  variant="outlined"
                  onChange={handleChange("last_name")}
                  value={record.last_name}
                  fullWidth
                  error={!errors.last_name.valid}
                  helperText={
                    !errors.last_name.valid ? errors.last_name.message : " "
                  }
                />
              </Grid>
              {/* Email Address */}
              <Grid item className={styles.input_field}>
                <Typography variant="h4" className={styles.label}>
                  Email Address
                </Typography>
                <InputField
                  id="email"
                  type="text"
                  disabled
                  placeholder="Enter Email Address"
                  variant="outlined"
                  onChange={handleChange("email")}
                  value={record.email}
                  fullWidth
                  error={!errors.email.valid}
                  helperText={!errors.email.valid ? errors.email.message : " "}
                />
              </Grid>
              {/* Gender */}
              <Grid item className={styles.input_field}>
                <Typography variant="h4" className={styles.label}>
                  Gender
                </Typography>
                <RadioGroup
                  row
                  aria-label="gender"
                  name="gender"
                  value={
                    record.gender === "male"
                      ? "male"
                      : record.gender === "female"
                      ? "female"
                      : ""
                  }
                  onChange={handleChange("gender")}
                >
                  <FormControlLabel
                    value="male"
                    control={<Radio className={styles.gender_text} />}
                    label="Male"
                  />
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Female"
                  />
                </RadioGroup>
              </Grid>
            </Grid>
            {/* Profile Photo */}
            <Grid
              item
              container
              direction="column"
              xs={10}
              md={5}
              className={styles.profile_container}
            >
              <Grid className={styles.image_container}>
                <div className={styles.top_right}>
                  {record.profile_picture && (
                    <IconButton
                      aria-label="more"
                      aria-controls="long-menu"
                      aria-haspopup="true"
                      onClick={handleClick}
                    >
                      <img src={EditIcon} alt="Edit" />
                    </IconButton>
                  )}
                  <StyledMenu
                    id="long-menu"
                    anchorEl={anchorEl}
                    keepMounted
                    open={open}
                    onClose={handleClose}
                  >
                    <input
                      type="file"
                      id="upload-button"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                      accept="image/x-png,image/jpeg"
                    />
                    <label htmlFor="upload-button">
                      <MenuItem>Edit Photo</MenuItem>
                    </label>
                    <MenuItem onClick={handleCancelModal}>
                      <Typography className={styles.danger}>
                        Remove Photo
                      </Typography>
                    </MenuItem>
                  </StyledMenu>
                </div>
                {imageLoader ? (
                  <CircularProgress
                    color="secondary"
                    className={styles.image_loader}
                  />
                ) : (
                  <img
                    className={styles.profile_image}
                    src={record.profile_picture_url || DefaultImage}
                    alt="Profile"
                  />
                )}
              </Grid>
              {!record.profile_picture && (
                <Grid>
                  <OutlinedPrimaryButton wide size="large">
                    <label htmlFor="upload-button">
                      <Typography variant="h4" className={styles.sideHeader}>
                        Upload Photo
                      </Typography>
                    </label>
                  </OutlinedPrimaryButton>
                </Grid>
              )}
            </Grid>
          </Grid>
          {/* Crop Modal */}
          {cropModal && (
            <CropModal
              open={cropModal}
              imgSrc={file}
              handleClose={() => handleCropModal(false)}
              handleSubmit={handleCropImage}
              changeImage={changeImage}
            />
          )}
          <CancelModal
            open={cancelModal}
            title="Delete Profile Image"
            description={`Are you sure you want to remove this profile image ?`}
            handleClose={() => setCancelModal(false)}
            handleSubmit={handleRemoveImage}
          />
          {/* Update Btn */}
          <Grid container item>
            <PrimaryButton
              type="submit"
              onClick={handleUpdateProfile}
              className={styles.updateBtn}
            >
              <Typography variant="h4" className={styles.sideHeader}>
                Update Profile
              </Typography>
            </PrimaryButton>
          </Grid>
          {/* Country Code + Phone No */}
          <Grid container item xs={12} md={7} style={{ marginTop: 30 }}>
            <Typography variant="h4" className={styles.label}>
              Phone Number
            </Typography>
            <Grid container item spacing={2}>
              {/* Country Code */}
              <Grid item xs={10} sm={2}>
                <PhoneInput
                  country={"us"}
                  excludeCountries={["ca", "pr", "do"]}
                  countryCodeEditable={false}
                  enableSearch={true}
                  disableSearchIcon={true}
                  onChange={handleCountryCode}
                  value={record.country_code}
                  inputStyle={{
                    border: "1px solid #A4B3CC",
                    borderRadius: "4px",
                    fontSize: "15px",
                    width: "100%",
                    height: "55px",
                    marginLeft: "3px",
                  }}
                  dropdownStyle={{
                    width: "700%",
                  }}
                  buttonStyle={{
                    borderRadius: "4px",
                    border: "1px solid #A4B3CC",
                    paddingRight: "10px",
                  }}
                />
              </Grid>
              {/* Phone no. */}
              <Grid item xs={10} sm={4}>
                <InputField
                  id="phone"
                  type="number"
                  variant="outlined"
                  placeholder="Enter phone number"
                  fullWidth
                  onWheel={(e) => e.target.blur()}
                  onChange={handleChange("phone")}
                  value={record.phone}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment>
                        <IconButton>
                          {isPhoneVerified && (
                            <img src={Verified} alt="Valid" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              {/* Send OTP */}
              <Grid item xs={12} sm={6}>
                <PrimaryButton
                  isDisabled={!sendOtpBtn}
                  disabled={!sendOtpBtn}
                  type="submit"
                  onClick={handleSendOTP}
                  className={styles.verifyBtn}
                >
                  <Typography variant="h4" className={styles.sideHeader}>
                    Send OTP
                  </Typography>
                </PrimaryButton>
              </Grid>
            </Grid>
            <Typography variant="h4" className={styles.otpHelperText}>
              OTP will be sent to your number for verification
            </Typography>
            {verifyOtp && (
              <Grid container item spacing={2} style={{ marginTop: 15 }}>
                {/* Verification Otp */}
                <Grid item>
                  <InputField
                    id="otp"
                    type="text"
                    placeholder="Enter OTP"
                    variant="outlined"
                    onChange={(e) => setOtp(e.target.value)}
                    value={otp}
                    fullWidth
                  />
                </Grid>
                {/* Verify OTP */}
                <Grid item>
                  <PrimaryButton
                    isDisabled={!verifyOtpBtn}
                    disabled={!verifyOtpBtn}
                    type="submit"
                    onClick={handleVerifyOTP}
                    className={styles.verifyBtn}
                  >
                    <Typography variant="h4" className={styles.sideHeader}>
                      Verify OTP
                    </Typography>
                  </PrimaryButton>
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = ({ auth: { isAuthenticated } }) => ({
  isAuthenticated,
});

export default connect(mapStateToProps, null)(EditProfile);

import React, { Component } from "react";
import {
  Box,
  Grid,
  InputAdornment,
  Typography,
  withTheme,
} from "@material-ui/core";
import ArrowForwardSharpIcon from "@material-ui/icons/ArrowForwardSharp";
import { PrimaryButton, Loader, Toast } from "../../../components";
import { API, ENDPOINTS } from "../../../../api/apiService";
import GombleLogo from "./GombleCustomerBanner";
import InputFieldHeading from "../../../components/Form/InputFieldHeading";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import AddImage from "./AddImage";

class CustomerGenderDetail extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      imageLoading: false,
      value: "male",
      profile_picture_id: "",
      profile_picture_url: this.props.history.location.payload
        .profile_picture_url,
      first_name: this.props.history.location.payload.first_name,
      last_name: this.props.history.location.payload.last_name,
    };
  }

  handleGenderChange = (event) => {
    this.setState({ value: event.target.value });
  };

  handleImageChange = (e) => {
    const temp = e.target.files[0];
    const size = temp.size / 1024 / 1024; // Calculated file size in mb
    if (size > 50) {
      Toast.showErrorToast(
        "Sorry, Your file is too large. Only 50MB is allowed."
      );
      return;
    }
    this.setState({ imageLoading: true });
    if (e.target.files) {
      const data = new FormData();
      data.append("media", e.target.files[0]);
      data.append("media_type", "IMAGE");
      data.append("content_type", "IMG/JPG");
      this.uploadImageToServer(data);
    }
  };

  uploadImageToServer = async (data) => {
    try {
      const resp = await API.post(ENDPOINTS.MEDIA, data, false);
      if (resp.success) {
        this.setState({ profile_picture_id: resp.data.id });
        this.setState({ imageLoading: false });

        Toast.showSuccessToast(resp.data.message);

        const res = await API.post(
          ENDPOINTS.MEDIA_GET,
          { id: resp.data.id },
          false
        );
        if (res.success) {
          this.setState({ profile_picture_url: res.data.media_url });
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
      }
    } finally {
      this.setState({ imageLoading: false });
    }
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    var payload = {};
    if (this.state.profile_picture_id === "") {
      payload = {
        gender: this.state.value,
      };
    } else if (this.state.profile_picture_id !== "") {
      payload = {
        gender: this.state.value,
        profile_picture: this.state.profile_picture_id,
      };
    }

    try {
      const resp = await API.patch(ENDPOINTS.CUSTOMER_PROFILE, payload, true);
      if (resp.success) {
        Toast.showSuccessToast("email registered successfully");
        if (resp.data.phone_verified === true) {
          localStorage.getItem("path_name")
            ? this.props.history.push(`${localStorage.getItem("path_name")}`)
            : this.props.history.push("/home");
        } else if (resp.data.phone_verified === false) {
          this.props.history.push("/auth/customer-tell-us-about");
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
        Toast.showErrorToast("Error in basic details,please reload the page");
      }
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { loading } = this.state;
    return (
      <React.Fragment>
        {loading && <Loader />}
        <Grid container style={{ height: "100vh" }}>
          <Grid item xs={6} style={{ backgroundColor: "#FFD5DA" }}>
            <GombleLogo />
          </Grid>
          <Grid item xs={6} style={{ background: "white" }}>
            <Box ml={14} mt={5}>
              <Grid item>
                <span style={{ fontSize: "26px", fontWeight: "500" }}>
                  Hey{" "}
                  <span
                    style={{ color: "#FC68A2", textTransform: "capitalize" }}
                  >
                    {this.state.first_name + " " + this.state.last_name},
                  </span>
                </span>
              </Grid>
              <br />
              <Grid item>
                <Typography variant="h4">
                  Please fill the following details.
                </Typography>
                <br />
                <form onSubmit={this.handleSubmit}>
                  <Grid item xs={9} style={{ marginTop: "10px" }}>
                    <AddImage
                      btnText={
                        this.state.profile_picture_url
                          ? "Change Profile Picture"
                          : "Add Profile Picture"
                      }
                      imageLoading={this.state.imageLoading}
                      imageUrl={this.state.profile_picture_url}
                      handleImageChange={this.handleImageChange}
                    />
                  </Grid>
                  <Grid item xs={9}>
                    <InputFieldHeading label="Gender" />
                    <FormControl component="fieldset">
                      <RadioGroup
                        row
                        // aria-label="gender"
                        name="gender"
                        value={this.state.value}
                        onChange={this.handleGenderChange}
                      >
                        <FormControlLabel
                          value="male"
                          control={<Radio />}
                          label="Male"
                        />
                        <FormControlLabel
                          value="female"
                          control={<Radio />}
                          label="Female"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <br />
                  <PrimaryButton
                    variant="outlined"
                    sizeFlag={true}
                    type="submit"
                    wide={true}
                  >
                    Save
                    <InputAdornment position="end">
                      <ArrowForwardSharpIcon size="small" />
                    </InputAdornment>
                  </PrimaryButton>
                </form>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </React.Fragment>
    );
  }
}

export default withTheme(CustomerGenderDetail);

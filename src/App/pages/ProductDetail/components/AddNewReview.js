import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import InputFieldHeading from "../../../components/Form/InputFieldHeading";
import { Input, Grid, makeStyles, TextField } from "@material-ui/core";
import { PrimaryButton, Toast } from "../../../components";
import { Formik } from "formik";
import * as Yup from "yup";
import { ENDPOINTS } from "../../../../api/apiRoutes";
import { API } from "../../../../api/apiService";
import { Button } from "@material-ui/core";
import Rating from "@material-ui/lab/Rating";
import imageUploadIcon from "../../../assets/icons/image-upload.svg";
import crossColoured from "../../../assets/icons/crossColoured.svg";
import CropModal from "./ReviewCropper";

export default function AddNewReview(props) {
  const [buttonFlag, setButtonFlag] = useState(true);
  const [open, setOpen] = React.useState(false);
  const [rating, setRating] = React.useState("");
  const [cover, setCover] = useState([]);
  const [imageIdList, setImageId] = useState([]);
  const [cropModal, setCropModal] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setRating(0);
    setImageId([]);
    setCover([]);
  };

  const handleRemoveImage = (index) => {
    let urls = [...cover];
    let ids = [...imageIdList];
    urls.splice(index, 1);
    ids.splice(index, 1);
    setCover(urls);
    setImageId(ids);
  };

  const handleCropModal = (status) => {
    setCropModal(status);
    setFile(null);
    setFileName(null);
  };

  const handleFileChange = (e) => {
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
          coverChange(blob);
        },
        "image/png",
        1
      );
    } else {
      coverChange(fileName);
    }
    setCropModal(false);
  };

  const coverChange = (file) => {
    if (file) {
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
        let reviewImageList = [...imageIdList];
        reviewImageList.push(resp.data.id);
        setImageId(reviewImageList);

        const res = await API.post(
          ENDPOINTS.MEDIA_GET,
          { id: resp.data.id },
          true
        );
        if (res.success) {
          let coverList = [...cover];
          coverList.push(res.data.media_url);
          setCover(coverList);
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
      setFile(null);
      setFileName(null);
    }
  };

  const handleSaveReview = async (review) => {
    const payload = {
      product: props.product_id,
      review_description: review,
      rating: rating,
      images: imageIdList,
    };
    if (rating === "" || rating == null) {
      Toast.showErrorToast("Rating is required");
    } else if (rating !== "" && rating !== null) {
      try {
        const resp = await API.post("/review/customer/product", payload, true);
        if (resp.success) {
          setButtonFlag(false);
          if (props.fetchProductDetails) {
            props.fetchProductDetails();
            props.fetchCustomerReview();
            props.newReviewAdded();
          }
          if (props.fetchRecord) {
            props.fetchRecord();
          }

          handleClose();
          Toast.showSuccessToast(
            resp.data.message ? resp.data.message : "Review added successfully"
          );
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
        setButtonFlag(true);
      }
    }
  };
  const classes = useStyles();
  return (
    <React.Fragment>
      <Grid item>
        {props.buttonTypeBlack ? (
          <Button
            variant="contained"
            type="submit"
            onClick={handleClickOpen}
            className={classes.Button}
          >
            Write a review
          </Button>
        ) : (
          <PrimaryButton
            variant="contained"
            type="submit"
            onClick={handleClickOpen}
            style={{ fontSize: "18px", fontFamily: "Inter SemiBold" }}
          >
            Write Review
          </PrimaryButton>
        )}
      </Grid>
      <Dialog
        PaperProps={{ style: { borderRadius: 16 } }}
        maxWidth="xs"
        fullWidth
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Write review
        </DialogTitle>

        <DialogContent>
          <Formik
            initialValues={{
              review: "",
            }}
            validationSchema={Yup.object().shape({
              review: Yup.string()
                .required("Review is required")
                .max(100, "Maximum text limit is 100 characters"),
            })}
            onSubmit={({ review }) => {
              handleSaveReview(review);
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <form onSubmit={handleSubmit}>
                <Typography className={classes.subHeading}>
                  Write review for {props.productTitle}{" "}
                </Typography>
                <br />
                <Grid item className={classes.root}>
                  <Rating
                    size="large"
                    name="hover-feedback"
                    value={rating}
                    precision={1}
                    onChange={(event, newValue) => {
                      setRating(newValue);
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <InputFieldHeading label="Review" />

                  <TextField
                    id="review"
                    type="text"
                    placeholder="Please write product review here "
                    variant="outlined"
                    multiline
                    rows={3}
                    value={values.review}
                    onChange={handleChange("review")}
                    onBlur={handleBlur("review")}
                    error={touched.review && errors.review}
                    helperText={touched.review && errors.review}
                    fullWidth
                    onInput={(event) => {
                      if (event.target.value?.length > 100) {
                        event.target.value = event.target.value.slice(
                          0,

                          100
                        );
                      }
                    }}
                  />
                  <span>
                    {values.review ? values.review.length : 0} /{100}
                  </span>
                </Grid>
                <br />
                <Grid item xs={12}>
                  <ImageUpload
                    cover={cover}
                    imageIdList={imageIdList}
                    addImage={handleFileChange}
                    handleRemoveImage={handleRemoveImage}
                  />
                </Grid>
                <br />
                <Grid item xs={12}>
                  {buttonFlag ? (
                    <PrimaryButton
                      type="submit"
                      style={{
                        fontSize: "18px",
                        fontWeight: 600,
                      }}
                      fullWidth
                    >
                      Submit
                    </PrimaryButton>
                  ) : (
                    <PrimaryButton
                      disabled
                      style={{
                        fontSize: "18px",
                        fontWeight: 600,
                        color: "white",
                      }}
                      fullWidth
                    >
                      Submit
                    </PrimaryButton>
                  )}
                </Grid>
              </form>
            )}
          </Formik>
        </DialogContent>
      </Dialog>
      {cropModal && (
        <CropModal
          open={cropModal}
          imgSrc={file}
          handleClose={() => handleCropModal(false)}
          handleSubmit={handleCropImage}
          changeImage={coverChange}
        />
      )}
    </React.Fragment>
  );
}

const ImageUpload = (props) => {
  const classes = useStyles();
  return (
    <Grid container className={classes.MarginBottom}>
      {props.cover.length ? (
        <React.Fragment>
          <br />
          <Grid container spacing={2} alignItems="center">
            {props.cover.map((coverImage, index) => (
              <Grid
              key={index}
                item
                className={index !== 0 ? classes.LeftImgContainer : ""}
              >
                <div style={{ position: "relative" }}>
                  <div className={classes.AddImg}>
                    <img
                      style={{
                        height: "100%",
                        width: "100%",
                        borderRadius: "8px",
                      }}
                      src={coverImage}
                      alt="cover"
                    />
                  </div>
                  <div>
                    <img
                      src={crossColoured}
                      alt="cross"
                      className={classes.ImgCross}
                      onClick={() => props.handleRemoveImage(index)}
                    />
                  </div>
                </div>
              </Grid>
            ))}
            <br />
            {props.imageIdList.length < 3 ? (
              <div className={classes.LeftImgContainerUpload}>
                <Input
                  multiple
                  accept="image/x-png,image/gif,image/jpeg"
                  id="contained-button-file"
                  style={{ display: "none" }}
                  type="file"
                  onChange={props.addImage}
                />
                <label
                  htmlFor="contained-button-file"
                  style={{ width: "100%" }}
                >
                  <div className={classes.AddImg}>
                    <Button component="span" onChange={props.handleImageChange}>
                      <img
                        src={imageUploadIcon}
                        alt="cover"
                        style={{
                          marginTop: "40px",
                          height: "18px",
                          width: "20px",
                          objectFit: "contain",
                        }}
                      />
                    </Button>
                  </div>
                </label>
              </div>
            ) : (
              ""
            )}{" "}
          </Grid>
          <br />
        </React.Fragment>
      ) : (
        <Grid item className={classes.MarginLeft}>
          <Input
            multiple
            accept="image/x-png,image/gif,image/jpeg"
            id="contained-button-file"
            style={{ display: "none" }}
            type="file"
            onChange={props.addImage}
          />
          <label htmlFor="contained-button-file" style={{ width: "100%" }}>
            <div className={classes.AddImg}>
              <Button component="span" onChange={props.handleImageChange}>
                <img
                  src={imageUploadIcon}
                  alt="cover"
                  style={{
                    marginTop: "40px",
                    height: "18px",
                    width: "20px",
                  }}
                />
              </Button>
            </div>
          </label>
        </Grid>
      )}
    </Grid>
  );
};

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(2),
    top: theme.spacing(2),
    color: "#242424",
  },
});
const useStyles = makeStyles((theme) => ({
  Button: {
    height: "48px",
    padding: "0px 25px 0px 25px",
    borderRadius: "8px",
    backgroundColor: "#242424",
    color: "#FFFFFF",
    fontSize: "18px",
    fontWeight: 600,
    "&:hover": {
      background: "#242424",
    },
    root: {
      width: 200,
      display: "flex",
      alignItems: "center",
    },
    subHeading: {
      color: "#708099",
      fontSize: "16px",
    },
  },
  ImgCross: {
    cursor: "pointer",
    position: "absolute",
    left: "90px",
    bottom: "85%",
  },
  LeftImgContainer: {},

  LeftImgContainerUpload: {
    [theme.breakpoints.down("sm")]: {
      marginLeft: "10px",
    },
    [theme.breakpoints.down("xs")]: {
      marginLeft: "10px",
    },
  },
  MarginBottom: {
    marginBottom: "7px",
  },
  MarginLeft: {
    marginLeft: "1px",
  },
  AddImg: {
    boxSizing: "borderBox",
    height: "105px",
    width: "105px",
    border: "1px dashed #708099",
    borderRadius: "8px",
    textAlign: "center",
    cursor: "pointer",
  },
}));

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography style={{ fontSize: "18px", margin: "15px 0px -10px 15px " }}>
        <b>{children}</b>
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon fontSize="large" />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(4),
  },
}))(MuiDialogContent);

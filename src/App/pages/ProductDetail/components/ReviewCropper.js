import React, { useState, useCallback } from "react";
import "react-image-crop/dist/ReactCrop.css";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import MuiDialogActions from "@material-ui/core/DialogActions";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { PrimaryButton, OutlinedPrimaryButton } from "../../../components";
import Cropper from "react-easy-crop";
import Slider from "@material-ui/core/Slider";
import getCroppedImg from "../../Profile/components/cropImage";
import { Grid } from "@material-ui/core";
import ZoomInIcon from "@material-ui/icons/ZoomIn";
import ZoomOutIcon from "@material-ui/icons/ZoomOut";
import RotateLeftIcon from "@material-ui/icons/RotateLeft";
import RotateRightIcon from "@material-ui/icons/RotateRight";

const styles2 = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(3),
    backgroundColor: "#242424",
  },
  title: {
    fontFamily: "Inter SemiBold",
    fontSize: 18,
    color: "#ffffff",
  },
});

const DialogTitle = withStyles(styles2)((props) => {
  const { children, classes, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h5" className={classes.title}>
        {children}
      </Typography>
    </MuiDialogTitle>
  );
});

const DialogActions = withStyles(() => ({
  root: {
    margin: 0,
    padding: "20px 10px",
    display: "flex",
    justifyContent: "space-around",
  },
}))(MuiDialogActions);

const useStyles = makeStyles({
  root: {
    position: "absolute",
    top: "50%",
    left: "50%",
    borderRadius: 0,
  },
  content: {
    marginTop: 20,
  },
  backIcon: {
    marginRight: 16,
  },
  frontIcon: {
    marginLeft: 16,
  },
  btnText: {
    fontFamily: "Inter SemiBold",
    fontSize: 18,
  },
  cropContainer: {
    position: "relative",
    width: "100%",
    background: "#333",
    height: 400,
  },
});

const CropModal = ({ imgSrc, open, handleClose, changeImage }) => {
  const classes = useStyles();
  const matches = useMediaQuery("(max-width:600px)");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const showCroppedImage = useCallback(async () => {
    try {
      // eslint-disable-next-line no-unused-vars
      const croppedImage = await getCroppedImg(
        imgSrc,
        croppedAreaPixels,
        rotation,
        changeImage
      );
      HandleCloseDialog();
    } catch (e) {
      console.error(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [croppedAreaPixels, rotation]);

  const HandleCloseDialog = () => {
    setRotation(0);
    setZoom(1);
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={HandleCloseDialog}
      scroll="body"
      className={classes.root}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle id="customized-dialog-title">Crop Image</DialogTitle>
      <DialogContent>
        <div>
          <div className={classes.cropContainer}>
            <Cropper
              image={imgSrc}
              crop={crop}
              rotation={rotation}
              zoom={zoom}
              showGrid={false}
              aspect={4 / 4}
              onCropChange={setCrop}
              onRotationChange={setRotation}
              onCropComplete={onCropComplete}
              onZoomChange={setZoom}
              maxZoom={50}
              objectFit="vertical-cover"
            />
          </div>
          <div>
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              style={{ marginTop: "1.5em" }}
            >
              <Grid item xs={12} sm={10}>
                <Grid container>
                  <Grid item xs={12} sm={1}>
                    <ZoomOutIcon
                      style={{ color: "#FD2B88", cursor: "pointer" }}
                      onClick={() => zoom > 1 && setZoom(zoom - 1)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={10}>
                    <Slider
                      value={zoom}
                      min={1}
                      max={50}
                      step={1}
                      aria-labelledby="Zoom"
                      onChange={(e, zoom) => setZoom(zoom)}
                      style={{ width: "95%", marginTop: "2px" }}
                    />
                  </Grid>
                  <Grid itemxs={12} sm={1}>
                    <ZoomInIcon
                      style={{ color: "#FD2B88", cursor: "pointer" }}
                      onClick={() => zoom < 50 && setZoom(zoom + 1)}
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Grid container>
                  <Grid item>
                    <RotateLeftIcon
                      style={{ color: "#FD2B88", cursor: "pointer" }}
                      onClick={() => setRotation(rotation + 90)}
                    />
                  </Grid>
                  <Grid item>
                    <RotateRightIcon
                      style={{ color: "#FD2B88", cursor: "pointer" }}
                      onClick={() => setRotation(rotation - 90)}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </div>
        </div>
      </DialogContent>
      <DialogActions>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <OutlinedPrimaryButton
              fullWidth
              variant="outlined"
              wide={matches ? false : true}
              isSecondary={true}
              onClick={HandleCloseDialog}
            >
              <Typography variant="h4" className={classes.btnText}>
                Cancel
              </Typography>
            </OutlinedPrimaryButton>
          </Grid>
          <Grid item xs={12} sm={6}>
            <PrimaryButton
              fullWidth
              variant="contained"
              wide={matches ? false : true}
              color="primary"
              onClick={showCroppedImage}
            >
              <Typography variant="h4" className={classes.btnText}>
                Upload
              </Typography>
            </PrimaryButton>
          </Grid>
        </Grid>
      </DialogActions>
    </Dialog>
  );
};

export default CropModal;

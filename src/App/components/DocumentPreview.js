import React from "react";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";

import { makeStyles } from "@material-ui/core/styles";

import { convertToHumanSize } from "../../utils/fileUtils";

import CloseIcon from "../assets/icons/close.svg";

const useStyles = makeStyles({
  root: {
    backgroundColor: "#F5F6FA",
    borderRadius: 14,
    padding: "30px 20px",
    display: "flex",
  },
  image: {
    width: 54,
    height: 54,
    objectFit: "cover",
    marginRight: 16,
  },
  metadata: {
    width: "100%",
  },
  closeButton: {
    float: "right",
    marginTop: -20,
    cursor: "pointer",
  },
});

const ImagePreview = ({
  thumbUrl,
  fileName,
  size,
  progress = true,
  onRemove,
  style,
}) => {
  const classes = useStyles();
  return (
    <div className={classes.root} style={style}>
      <img src={thumbUrl} alt="img" className={classes.image} />
      <div className={classes.metadata}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="button" align="center">
            {fileName ?? "main_image.jpg"}
          </Typography>
          <img
            src={CloseIcon}
            alt="img"
            className={classes.closeButton}
            onClick={onRemove}
          />
        </div>
        {progress ? (
          <LinearProgress
            variant="determinate"
            color="secondary"
            value={80}
            style={{ borderRadius: 4 }}
          />
        ) : (
          <Typography variant="button" className="text-muted">
            {convertToHumanSize(size)}
          </Typography>
        )}
      </div>
    </div>
  );
};

export default ImagePreview;

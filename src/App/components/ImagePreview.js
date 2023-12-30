import React, { useEffect } from "react";
import Typography from "@material-ui/core/Typography";

import { makeStyles } from "@material-ui/core/styles";

import { convertToHumanSize } from "../../utils/fileUtils";
import { ellipsizeText } from "../../utils/textUtils";

import CloseIcon from "../assets/icons/close.svg";

const useStyles = makeStyles({
  root: {
    backgroundColor: "#F5F6FA",
    borderRadius: 14,
    padding: 8,
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
    cursor: "pointer",
  },
});

const ImagePreview = ({
  file,
  src,
  name,
  size,
  id,
  progress = false,
  onRemove,
  style,
}) => {
  const classes = useStyles();

  useEffect(() => {
    const reader = new FileReader();
    const preview = document.getElementById("image-" + id);
    if (src) {
      preview.src = src;
      return;
    }

    reader.addEventListener(
      "load",
      function () {
        // convert image file to base64 string
        preview.src = reader.result;
      },
      false
    );

    if (file) {
      reader.readAsDataURL(file);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);
  return (
    <div className={classes.root} style={{ width: "100%", ...style }}>
      <img src={null} alt="img" className={classes.image} id={"image-" + id} />
      <div className={classes.metadata}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            paddingBottom: progress ? 14 : 0,
          }}
        >
          <Typography variant="button" align="center">
            {ellipsizeText(src ? name : file?.name ?? "", 16)}
          </Typography>
          <img
            src={CloseIcon}
            alt="img"
            className={classes.closeButton}
            onClick={onRemove}
          />
        </div>
        <div>
          <Typography variant="button" className="text-muted">
            {convertToHumanSize(src ? size : file.size)}
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;

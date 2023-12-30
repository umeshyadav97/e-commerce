import React from "react";
import {
  Avatar,
  Button,
  CircularProgress,
  makeStyles,
} from "@material-ui/core";

export default function AddImage(props) {
  const classes = useStyles();
  return (
    <div style={{ display: "flex" }}>
      {props.imageUrl ? (
        <Avatar
          alt="profile"
          src={props.imageUrl}
          style={{
            height: "106px",
            width: "106px",
            objectFit: "cover",
          }}
        />
      ) : (
        <div className={classes.logoDivStyle}>
          {props.imageLoading ? (
            <CircularProgress style={{ margin: "auto" }} />
          ) : (
            <div style={{ marginTop: "35%", marginLeft: "18%" }}>
              <span style={{ color: "#708099", fontSize: "12px" }}>
                Add Photo
              </span>
            </div>
          )}
        </div>
      )}
      <div className="row-center">
        <label style={{ width: "100%" }}>
          <Button
            variant="outlined"
            color="secondary"
            component="span"
            onChange={props.handleImageChange}
            className={classes.logoButtonStyle}
          >
            <input
              id="upload-button"
              type="file"
              hidden
              accept="image/x-png,image/jpeg"
            />
            {props.btnText}
          </Button>
        </label>
      </div>
    </div>
  );
}
const useStyles = makeStyles(() => ({
  logoButtonStyle: {
    marginLeft: "20px",
    height: "40px",
    border: "1.6px solid #FC68A2",
    borderRadius: "8px",
  },
  logoDivStyle: {
    height: "86px",
    width: "86px",
    borderRadius: "43px",
    backgroundColor: "#F4F7FD",
    display: "flex",
  },
}));

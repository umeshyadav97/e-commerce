import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { Typography } from "@material-ui/core";
import useMediaQuery from '@material-ui/core/useMediaQuery';

import PrimaryButton from "../Button/PrimaryButton";
import TransparentButton from "../Button/TransparentButton";

const useStyles = makeStyles((theme)=>({
  root: {
    padding: "35px 40px 20px 20px",
  },
  header: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: 600,
  },
  footer: {
    display: "flex",
  },
  noBtn: {
    marginRight: 20,
    [theme.breakpoints.down("xs")]: {
      marginRight: 10,
    }
  },
}));

const CancelModal = ({
  title,
  description,
  open,
  handleClose,
  handleSubmit,
}) => {
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:600px)');
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Typography variant="h4" className={classes.header}>
            {title}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <div className={classes.footer}>
            <div className={classes.noBtn}>
            <TransparentButton
              onClick={handleClose}
              style={{ borderRadius: 8, height: 48, width: matches ? 110: 186}}
            >
              NO
            </TransparentButton>
            </div>
           <div>
           <PrimaryButton  onClick={handleSubmit} autoFocus style={{ width: matches ? 110: 186}}>
              YES
            </PrimaryButton>
           </div>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CancelModal;

import React from "react";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { makeStyles } from "@material-ui/core/styles";
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { PrimaryButton, TransparentButton } from "../index";
import DeleteImage from "../../assets/images/popup-delete.svg";

const useStyles = makeStyles({
  root: {
    padding: "35px 40px 20px 20px",
  },
  title: {
    fontFamily: 'Inter SemiBold'
  },
  content: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: 20,
  },
  description: {
    fontFamily: 'Inter Medium',
    textAlign: "center",
    marginBottom: 64,
  },
  image: {
    marginTop: 15,
    marginBottom: 20,
    height: 110,
    width: 110,
  },
  footer: {
    backgroundColor: "#F5F6FA",
    width: "100%",
    padding: "23px 0px",
    display: "flex",
    justifyContent: "center",
  },
  cancelBtn: {
    fontFamily: 'Inter SemiBold',
    fontSize: '18px',
    marginRight: 20
  },
  submitBtn: {
    fontFamily: 'Inter SemiBold',
    fontSize: '18px',
    borderRadius: 27,
  },
});

const DeleteModal = ({
  title,
  description,
  open,
  handleClose,
  handleSubmit,
}) => {
  const classes = useStyles();
  const matches = useMediaQuery('(max-width:600px)');
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="sm"
      scroll="body"
      fullWidth
    >
      <DialogContent style={{ padding: 0 }}>
        <div className={classes.content}>
          <img src={DeleteImage} alt="delete" className={classes.image} />
          <Typography variant="h4" align="center" className={classes.title}>
            {title}
          </Typography>
          <div className={classes.description}>
            <span className="p2 text-muted">{description}</span>
          </div>
          <div className={classes.footer}>
            <TransparentButton
              wide={matches ? false: true}
              onClick={handleClose}
              className={classes.cancelBtn}
              style={{width: matches ? 100: 186}}
            >
              Cancel
            </TransparentButton>
            <PrimaryButton
              wide={matches ? false: true}
              onClick={handleSubmit}
              className={classes.submitBtn}
              style={{width: matches ? 100: 186}}
            >
              Delete
            </PrimaryButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;

import React from "react";
import Typography from "@material-ui/core/Typography";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { capitalize } from "../../../utils/textUtils";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    top: "50%",
    left: "50%",
    borderRadius: 0,
  },
  content: {
    marginBottom: 6,
    padding: 0,
    maxWidth: 460,
    width: 460,
    [theme.breakpoints.down("xs")]: {
      width: 315,
    },
  },
  column: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    borderBottom: "1px solid #DFE7F5",
    padding: "24px 26px",
  },
  last_column: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr 1fr",
    padding: "24px 26px",
  },
  text: {
    fontFamily: "Inter Regular",
    fontSize: 16,
  },
  title: {
    fontFamily: "Inter SemiBold",
    fontSize: 16,
  },
}));

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(3),
    color: theme.palette.grey[900],
    height: 40,
  },
  title: {
    fontFamily: "Inter SemiBold",
    fontSize: 18,
    marginLeft: 14,
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h4" className={classes.title}>
        {children}
      </Typography>
      {onClose ? (
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={onClose}
        >
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const BreakupModal = ({ title, open, handleClose, data }) => {
  const classes = useStyles();

  return (
    <Dialog open={open} onClose={handleClose} className={classes.root}>
      <DialogContent className={classes.content}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          {title}
        </DialogTitle>
        <div>
          <div className={classes.column}>
            <div className={classes.title}>Name</div>
            <div className={classes.title}>Percent</div>
            <div className={classes.title}>Amount</div>
          </div>
          {data.map((item, index) => {
            if (data.length - 1 !== index) {
              return (
                <div key={index} className={classes.column}>
                  <div className={classes.text}>{item.name}</div>
                  <div className={classes.text}>{`${item.rate} %`}</div>
                  <div className={classes.text}>{`$ ${item.amount}`}</div>
                </div>
              );
            } else {
              return (
                <div key={index} className={classes.last_column}>
                  <div className={classes.text}>{capitalize(item.name)}</div>
                  <div className={classes.text}>{`${item.rate} %`}</div>
                  <div className={classes.text}>{`$ ${item.amount}`}</div>
                </div>
              );
            }
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BreakupModal;

import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { API } from "../../../../api/apiService";

export default function SizeChart(props) {
  const [open, setOpen] = React.useState(false);
  const [measurementData, setMeasurementData] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
    if (!measurementData.length) {
      getMeasurementDetails();
    }
  };
  const handleClose = () => {
    setOpen(false);
  };

  const getMeasurementDetails = async () => {
    const resp = await API.get(
      `/custom/common/${props.product_id}/union`,
      false
    );
    if (resp.success) {
      let resData = [];
      for (let i of resp.data) {
        resData.push({
          id: i.id,
          title: i.title,
          size_name: i.size,
          tol_positive: i.tol_positive,
          tol_negative: i.tol_negative,
        });
      }
      setMeasurementData(resData);
    }
  };
  const classes = useStyles();
  return (
    <div>
      <Button
        onClick={handleClickOpen}
        color="secondary"
        style={{ marginTop: "16px" }}
        endIcon={<ChevronRightIcon style={{ marginBottom: "-3px" }} />}
      >
        Size Chart
      </Button>

      <Dialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={open}
        maxWidth="lg"
      >
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Size Chart(in)
        </DialogTitle>
        {measurementData.length > 0 && measurementData[0].size_name !== null ? (
          <DialogContent>
            <TableContainer component={Paper}>
              <Table className={classes.table} aria-label="customized table">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Title</StyledTableCell>
                    <StyledTableCell>TOL(+)</StyledTableCell>
                    <StyledTableCell>TOL(-)</StyledTableCell>
                    {measurementData[0].size_name.map((data, index) => (
                      <StyledTableCell key={index} align="left">
                        {data.title}
                      </StyledTableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {measurementData.map((data, index) => (
                    <TableRow key={index}>
                      <StyledTableCell component="th" scope="row">
                        {data.title} (in)
                      </StyledTableCell>
                      <StyledTableCell key={index} align="left">
                        {data.tol_positive || "-"}
                      </StyledTableCell>

                      <StyledTableCell key={index} align="left">
                        {data.tol_negative || "-"}
                      </StyledTableCell>
                      {measurementData[index].size_name.map((data, index) => (
                        <StyledTableCell key={index} align="left">
                          {data.value || "-"}
                        </StyledTableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </DialogContent>
        ) : (
          <Typography style={{ padding: "0px 28px 28px 28px" }}>
            Size chart is not available
          </Typography>
        )}
      </Dialog>
    </div>
  );
}

const StyledTableCell = withStyles(() => ({
  head: {
    backgroundColor: "#F4F7FD",
    fontColor: "#242424",
    fontSize: "14px",
    fontWeight: 500,
  },
  body: {
    fontSize: "14px",
    textTransform: "capitalize",
  },
}))(TableCell);

const useStyles = makeStyles({
  table: {
    minWidth: 500,
  },
});

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(3),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: "black",
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography style={{ fontSize: "18px", fontWeight: 600 }}>
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

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

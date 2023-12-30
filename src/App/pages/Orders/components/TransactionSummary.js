import {
  Box,
  DialogContent,
  Divider,
  Grid,
  Typography,
  withStyles,
} from "@material-ui/core";
import React from "react";
import styles from "../Orders.module.css";
import DownArrow from "../../../assets/icons/down-arrow.svg";
import UpArrow from "../../../assets/icons/up_arrow.svg";
import { useState } from "react";
import { Dialog } from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import { convertDateFormat, getTime } from "../../../../utils/dateUtils";

const TransactionSummary = (props) => {
  const { open, handleClose, transactions } = props;
  const [detailOpen, setDetailOpen] = useState("");

  const handleDetailOpen = (id) => {
    if (id === detailOpen) {
      setDetailOpen("");
    } else {
      setDetailOpen(id);
    }
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll="body"
      fullWidth
      maxWidth="md"
      aria-labelledby="sketch-dialog"
    >
      <DialogTitle id="sketch-dialog-title" onClose={handleClose}>
        Transaction Summary
      </DialogTitle>
      <DialogContent>
        {transactions?.length && (
          <Box mt={2} mb={2}>
            <Grid item>
              <Typography className={styles.heading}>
                Installment details
              </Typography>
            </Grid>
            {transactions?.map((transaction, index) => (
              <Grid
                key={transaction.id}
                container
                style={{ marginTop: "16px", padding: "16px" }}
                className={styles.custom_paymentDetail}
              >
                <Grid container style={{ marginTop: "16px" }}>
                  <Grid item xs={10}>
                    <Typography className={styles.order_number}>
                      Store Transaction Id :{transaction?.store_transaction_id}
                    </Typography>
                  </Grid>
                  <Grid item xs={2}>
                    <Grid container justifyContent="flex-end">
                      <img
                        className={styles.pointer}
                        src={
                          detailOpen === transaction?.id ? UpArrow : DownArrow
                        }
                        alt="downarrow"
                        onClick={() => handleDetailOpen(transaction.id)}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  container
                  style={{ marginBottom: !detailOpen ? "16px" : 0 }}
                >
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={2}
                    style={{ marginTop: "10px" }}
                  >
                    <Typography color="#708099" className={styles.user_count}>
                      Installment
                    </Typography>
                    <Typography className={styles.PaymentModeText}>
                      {transactions?.length - index}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={4}
                    style={{ marginTop: "10px" }}
                  >
                    <Typography color="#708099" className={styles.user_count}>
                      Date & Time
                    </Typography>
                    <Typography className={styles.PaymentModeText}>
                      {convertDateFormat(transaction?.created_at)} |{" "}
                      {getTime(transaction?.created_at)}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={3}
                    style={{ marginTop: "10px" }}
                  >
                    <Typography color="#708099" className={styles.user_count}>
                      Mode Of Payment
                    </Typography>
                    <Typography className={styles.PaymentModeText}>
                      {transaction?.payment_method_name?.includes("Cash Box")
                        ? "Cash"
                        : transaction?.payment_method_name === "Card"
                        ? `${transaction?.card_info?.brand}....${transaction?.card_info?.last4}`
                        : transaction?.payment_method_name}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={6}
                    lg={3}
                    style={{ marginTop: "10px" }}
                  >
                    <Typography color="#708099" className={styles.user_count}>
                      Total Paid Amount
                    </Typography>
                    <Typography mt={1} className={styles.PaymentModeText}>
                      ${transaction?.amount_paid}
                    </Typography>
                  </Grid>
                </Grid>
                {detailOpen === transaction.id && (
                  <Grid item xs={12}>
                    <Divider className={styles.sucess_store_divider} />
                    {transaction?.payment_method_name === "Card" && (
                      <Grid container className={styles.sucess_Store_margin}>
                        <Grid item xs={12} sm={8} alignSelf="center">
                          <Typography className={styles.sucessStore_text}>
                            Date & Time :
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Grid container justifyContent="flex-end">
                            <Typography className={styles.SecondaryButton}>
                              {convertDateFormat(transaction?.created_at)} |{" "}
                              {getTime(transaction?.created_at)}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    )}
                    {/*Bank transaction id */}
                    {transaction?.payment_method_name === "Card" && (
                      <Grid container className={styles.sucess_Store_margin}>
                        <Grid item xs={12} sm={8} alignSelf="center">
                          <Typography className={styles.sucessStore_text}>
                            Bank Transaction Id :
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Grid container justifyContent="flex-end">
                            <Typography className={styles.SecondaryButton}>
                              #{transaction?.bank_transaction}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    )}
                    {/*Amount */}
                    <Grid container className={styles.sucess_Store_margin}>
                      <Grid item xs={12} sm={8} alignSelf="center">
                        <Typography className={styles.sucessStore_text}>
                          Amount :
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Grid container justifyContent="flex-end">
                          <Typography className={styles.SecondaryButton}>
                            ${transaction?.total_amount}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    {/*Store Credit */}
                    {transaction?.store_credit_amount > 0 && (
                      <Grid container className={styles.sucess_Store_margin}>
                        <Grid item xs={12} sm={8} alignSelf="center">
                          <Typography className={styles.sucessStore_text}>
                            Store Credit :
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Grid container justifyContent="flex-end">
                            <Typography className={styles.Amount}>
                              -${transaction?.store_credit_amount}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    )}
                    {/*cash Box */}
                    {transaction?.payment_method_name?.includes("Cash Box") && (
                      <Grid container className={styles.sucess_Store_margin}>
                        <Grid item xs={12} sm={8} alignSelf="center">
                          <Typography className={styles.sucessStore_text}>
                            Cashbox :
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Grid container justifyContent="flex-end">
                            <Typography className={styles.SecondaryButton}>
                              {transaction?.payment_method_name}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    )}
                    {/* cash Box Notes */}
                    {transaction?.payment_method_name?.includes("Cash Box") && (
                      <Grid container className={styles.sucess_Store_margin}>
                        <Grid item xs={12} sm={8} alignSelf="center">
                          <Typography className={styles.sucessStore_text}>
                            Notes :
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                          <Grid container justifyContent="flex-end">
                            <Typography className={styles.SecondaryButton}>
                              {transaction?.note}
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    )}
                    {/*Other notes */}
                    {!transaction?.payment_method_name?.includes("Cash Box") &&
                      transaction?.payment_method_name !== "Card" && (
                        <Grid container className={styles.sucess_Store_margin}>
                          <Grid item xs={12} sm={8} alignSelf="center">
                            <Typography className={styles.sucessStore_text}>
                              Notes :
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <Grid container justifyContent="flex-end">
                              <Typography className={styles.SecondaryButton}>
                                {transaction?.note}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      )}
                    <Divider className={styles.sucess_store_divider} />
                    {/*Amount */}
                    <Grid container>
                      <Grid item xs={12} sm={8} alignSelf="center">
                        <Typography className={styles.header_1}>
                          Total Paid :
                        </Typography>
                      </Grid>
                      <Grid item xs={12} sm={4}>
                        <Grid container justifyContent="flex-end">
                          <Typography className={styles.Detail_Text}>
                            ${transaction?.amount_paid}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Divider className={styles.sucess_store_divider} />
                  </Grid>
                )}
              </Grid>
            ))}
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default TransactionSummary;

const styles2 = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(3),
    backgroundColor: "#FC68A2",
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: "#ffffff",
  },
  title: {
    fontFamily: "Inter SemiBold",
    fontSize: 18,
    color: "#ffffff",
  },
});

const DialogTitle = withStyles(styles2)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h5" className={classes.title}>
        {children}
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

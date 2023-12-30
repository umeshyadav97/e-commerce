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
import { convertDateFormat } from "../../../../utils/dateUtils";
import { capitalize, capitalizeStr, removeUnderScore } from "../../../../utils/textUtils";
import { Dialog } from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import { PrimaryButton } from "../../../components";

const RefundSummary = (props) => {
  const { open, handleClose, refundInfo, order_id, created_at, mode } = props;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      scroll="body"
      fullWidth
      maxWidth="md"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" onClose={handleClose}>
        Refund #{order_id} | {convertDateFormat(created_at)}
      </DialogTitle>
      <DialogContent style={{ padding: "0px" }}>
        <div className={styles.Overflow}>
          <Box mt={2} className={styles.table_header_box}>
            <Grid container className={styles.summary_header}>
              <Grid item>
                <Typography variant="h5" className={styles.varientSize}>
                  Product
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h5" className={styles.varientSize}>
                  Quantity
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h5" className={styles.varientSize}>
                  Sub-Total
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h5" className={styles.varientSize}>
                  Discount
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h5" className={styles.varientSize}>
                  Tax
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h5" className={styles.varientSize}>
                  Final Price
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h5" className={styles.varientSize}>
                  Store Credit
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h5" className={styles.varientSize}>
                  Type
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h5" className={styles.varientSize}>
                  Customer Paid
                </Typography>
              </Grid>
            </Grid>
          </Box>
          <Box mb={4} className={styles.table_cell_box}>
            {refundInfo?.products?.map((product, index) => (
              <>
                <Grid container key={index} className={styles.summary_body}>
                  {/* Product */}
                  <Grid item>
                    <Typography
                      style={{ wordBreak: "break-all" }}
                      variant="h5"
                      className={styles.Address_text}
                    >
                      {product?.product}
                    </Typography>
                  </Grid>
                  {/* Quantity */}
                  <Grid item>
                    <Typography variant="h5" className={styles.Address_text}>
                      {product?.quantity}
                    </Typography>
                  </Grid>
                  {/* Sub Total */}
                  <Grid item>
                    <Typography variant="h5" className={styles.Address_text}>
                      ${product?.sub_total}
                    </Typography>
                  </Grid>
                  {/* Discount */}
                  <Grid item>
                    <Typography variant="h5" className={styles.Address_text}>
                      ${product?.discount}
                    </Typography>
                  </Grid>
                  {/* Tax */}
                  <Grid item>
                    <Typography variant="h5" className={styles.Address_text}>
                      ${product?.tax}
                    </Typography>
                  </Grid>
                  {/* Final Price */}
                  <Grid item>
                    <Typography variant="h5" className={styles.Address_text}>
                      ${product?.final_price}
                    </Typography>
                  </Grid>
                  {/* Store Credit */}
                  <Grid item>
                    <Typography variant="h5" className={styles.Address_text}>
                      ${product?.store_credit_amount}
                    </Typography>
                  </Grid>
                  {/* Type */}
                  <Grid item>
                    <Typography variant="h5" className={styles.Address_text}>
                      {capitalize(removeUnderScore(product?.type))}
                    </Typography>
                  </Grid>
                  {/* You Paid */}
                  <Grid item>
                    <Typography variant="h5" className={styles.Agenda_Text}>
                      ${product?.you_paid}
                    </Typography>
                  </Grid>
                </Grid>
                <Divider className={styles.divider} />
              </>
            ))}
          </Box>
        </div>
        <Box mt={3} mx={4} pb={4}>
          <Grid container style={{ marginBottom: "20px" }}>
            <Typography className={styles.summary_Heading}>
              Customer Refund Summary
            </Typography>
          </Grid>
          {/* Staff Name */}
          <Grid container className={styles.marginTop12}>
            <Grid item xs={6}>
              <Typography className={styles.summary_sub_heading}>
                Refunded By
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Grid container justifyContent="flex-end">
                <Typography className={styles.summary_sub_heading}>
                  {capitalizeStr(refundInfo?.summary?.refunded_by)}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          {/* Product Price */}
          <Grid container className={styles.marginTop12}>
            <Grid item xs={6}>
              <Typography className={styles.summary_sub_heading}>
                Total product price
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Grid container justifyContent="flex-end">
                <Typography className={styles.summary_sub_heading}>
                  ${refundInfo?.summary?.total_amount}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          {/* Refund In Cash */}
          {mode === "CASH" && (
            <Grid container className={styles.marginTop12}>
              <Grid item xs={6}>
                <Typography className={styles.summary_sub_heading}>
                  Refund in cash
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Grid container justifyContent="flex-end">
                  <Typography className={styles.summary_sub_heading}>
                    ${refundInfo?.summary?.total_refund_amount}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          )}
          {/* Refund In Store Credit */}
          {refundInfo?.summary?.store_credit_amount > 0 && (
            <Grid container className={styles.marginTop12}>
              <Grid item xs={6}>
                <Typography className={styles.summary_sub_heading}>
                  Refund in store credit
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Grid container justifyContent="flex-end">
                  <Typography className={styles.summary_sub_heading}>
                    ${refundInfo?.summary?.store_credit_amount}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          )}
          {/* Refund Online */}
          {mode === "ONLINE" && (
            <Grid container className={styles.marginTop12}>
              <Grid item xs={6}>
                <Typography className={styles.summary_sub_heading}>
                  Refund online
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Grid container justifyContent="flex-end">
                  <Typography className={styles.summary_sub_heading}>
                    ${refundInfo?.summary?.total_refund_amount}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          )}
          {/* Total Refund Amount */}
          <Grid container className={styles.marginTop12}>
            <Grid item xs={6}>
              <Typography className={styles.order_number}>
                Total refund amount
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Grid container justifyContent="flex-end">
                <Typography className={styles.order_number}>
                  ${refundInfo?.summary?.total_refund_amount}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          {/* Detail */}
          {mode === "ONLINE" && (
            <Grid container className={styles.marginTop12}>
              <Grid item>
                <Typography className={styles.summary_Heading}>
                  You will receive the amount in the same account which was used
                  while placing an order.
                </Typography>
              </Grid>
            </Grid>
          )}
        </Box>
        <Divider />
        <Box m={3} display="flex" justifyContent="flex-end">
          <PrimaryButton wide onClick={handleClose}>
            Okay
          </PrimaryButton>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default RefundSummary;

const styles2 = (theme) => ({
  root: {
    margin: 0,
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4),
    paddingLeft: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: window.innerWidth > 320 ? "0px" : "-10px",
    top: theme.spacing(2),
    color: "#242424",
  },
  title: {
    fontFamily: "Inter Regular",
    fontWeight: "600",
    fontSize: "18px",
    wordBreak: "break-all",
  },
});

const DialogTitle = withStyles(styles2)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h5" className={classes.title}>
        {children}
      </Typography>

      <IconButton
        aria-label="close"
        className={classes.closeButton}
        onClick={onClose}
      >
        <CloseIcon htmlColor="#242424" fontSize="large" />
      </IconButton>
    </MuiDialogTitle>
  );
});

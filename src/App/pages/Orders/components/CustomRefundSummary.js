import {
  Box,
  ClickAwayListener,
  DialogContent,
  Divider,
  Grid,
  Tooltip,
  Typography,
  withStyles,
  Zoom,
} from "@material-ui/core";
import React, { useState } from "react";
import styles from "../Orders.module.css";
import { convertDateFormat } from "../../../../utils/dateUtils";
import { capitalizeStr, removeUnderScore } from "../../../../utils/textUtils";
import { Dialog } from "@material-ui/core";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import CloseIcon from "@material-ui/icons/Close";
import IconButton from "@material-ui/core/IconButton";
import { PrimaryButton } from "../../../components";

const CustomRefund = (props) => {
  const { open, handleClose, refundInfo, order_id, created_at } = props;
  const [openCustomer, setOpenCustomer] = useState(false);

  const handleTooltipClose = () => {
    setOpenCustomer(false);
  };

  const handleTooltipOpen = (event) => {
    event.stopPropagation();
    setOpenCustomer(true);
  };

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
            <Grid container className={styles.custom_summary_header}>
              <Grid item>
                <Typography variant="h5" className={styles.varientSize}>
                  Product
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
                  Store Credit
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h5" className={styles.varientSize}>
                  Order Amount
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h5" className={styles.varientSize}>
                  Total
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="h5" className={styles.varientSize}>
                  Payment Mode
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
                <Grid
                  container
                  key={index}
                  className={styles.custom_summary_body}
                >
                  {/*product */}
                  <Grid item>
                    <Typography
                      style={{ wordBreak: "break-all" }}
                      variant="h5"
                      className={styles.Address_text}
                    >
                      {product?.product}
                    </Typography>
                  </Grid>
                  {/*sub_total */}
                  <Grid item>
                    <Typography variant="h5" className={styles.Address_text}>
                      ${product?.sub_total}
                    </Typography>
                  </Grid>
                  {/*discount */}
                  <Grid item>
                    <Typography variant="h5" className={styles.Address_text}>
                      ${product?.discount}
                    </Typography>
                  </Grid>
                  {/*tax */}
                  <Grid item>
                    <Typography variant="h5" className={styles.Address_text}>
                      ${product?.tax}
                    </Typography>
                  </Grid>
                  {/*store_credit_amount */}
                  <Grid item>
                    <Typography variant="h5" className={styles.Address_text}>
                      ${product?.store_credit_amount}
                    </Typography>
                  </Grid>
                  {/*Order_amount */}
                  <Grid item>
                    <Typography variant="h5" className={styles.Agenda_Text}>
                      ${product?.final_amount}
                    </Typography>
                  </Grid>
                  {/* Total */}
                  <Grid item>
                    <Typography variant="h5" className={styles.Agenda_Text}>
                      ${product?.total_order_amount}
                    </Typography>
                  </Grid>
                  {/* type */}
                  <Grid item>
                    <Grid container spacing={0.5}>
                      <Grid item className={styles.centerAlign}>
                        <Typography
                          variant="h4"
                          className={styles.Address_text}
                        >
                          {capitalizeStr(
                            removeUnderScore(product?.type[0]?.mode)
                          )}
                        </Typography>
                      </Grid>
                      {product?.type?.length > 1 && (
                        <Grid item className={styles.discount_count_grid}>
                          <ClickAwayListener onClickAway={handleTooltipClose}>
                            <LightTooltip
                              onClose={handleTooltipClose}
                              open={openCustomer}
                              disableFocusListener
                              disableHoverListener
                              disableTouchListener
                              TransitionComponent={Zoom}
                              title={
                                <React.Fragment>
                                  <Grid container spacing={0.5}>
                                    {product?.type?.map((type, index) => (
                                      <Grid item key={index}>
                                        <Box mr={1}>
                                          <Grid
                                            item
                                            className={
                                              styles.discount_container
                                            }
                                          >
                                            <Typography
                                              className={styles.discount_text1}
                                            >
                                              {capitalizeStr(
                                                removeUnderScore(type?.mode)
                                              )}
                                            </Typography>
                                          </Grid>
                                        </Box>
                                      </Grid>
                                    ))}
                                  </Grid>
                                </React.Fragment>
                              }
                              arrow={true}
                            >
                              <Typography
                                className={
                                  product?.type?.length > 1
                                    ? styles.discount_count
                                    : null
                                }
                                onClick={(e) => handleTooltipOpen(e)}
                              >
                                {product?.type?.length > 1
                                  ? "+" + (product?.type?.length - 1)
                                  : null}
                              </Typography>
                            </LightTooltip>
                          </ClickAwayListener>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                  {/* Customer_paid */}
                  <Grid item>
                    <Typography variant="h5" className={styles.Agenda_Text}>
                      ${product?.final_amount}
                    </Typography>
                  </Grid>
                </Grid>
                <Divider className={styles.divider} />
              </>
            ))}
          </Box>
        </div>
        <Box mt={3} mx={3}>
          <Grid container style={{ marginBottom: "20px" }}>
            <Typography className={styles.summary_Heading}>
              Customer Refund Summary
            </Typography>
          </Grid>
          {/*Staff name */}
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
          {/*Product price */}
          <Grid container className={styles.marginTop12}>
            <Grid item xs={6}>
              <Typography className={styles.summary_sub_heading}>
                Total product price
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <Grid container justifyContent="flex-end">
                <Typography className={styles.summary_sub_heading}>
                  ${refundInfo?.summary?.total_order_amount}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          {/*Refund in cash */}
          {refundInfo?.summary?.refund_in_cash > 0 && (
            <Grid container className={styles.marginTop12}>
              <Grid item xs={6}>
                <Typography className={styles.summary_sub_heading}>
                  Refund in cash
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Grid container justifyContent="flex-end">
                  <Typography className={styles.summary_sub_heading}>
                    ${refundInfo?.summary?.refund_in_cash}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          )}
          {/*Refund in store credit */}
          {refundInfo?.summary?.refund_in_store_credit > 0 && (
            <Grid container className={styles.marginTop12}>
              <Grid item xs={6}>
                <Typography className={styles.summary_sub_heading}>
                  Refund in store credit
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Grid container justifyContent="flex-end">
                  <Typography className={styles.summary_sub_heading}>
                    ${refundInfo?.summary?.refund_in_store_credit}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          )}
          {/*Refund online */}
          {refundInfo?.summary?.refund_online > 0 && (
            <Grid container className={styles.marginTop12}>
              <Grid item xs={6}>
                <Typography className={styles.summary_sub_heading}>
                  Refund online
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Grid container justifyContent="flex-end">
                  <Typography className={styles.summary_sub_heading}>
                    ${refundInfo?.summary?.refund_online}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          )}
          {/*Total refund amount */}
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
          {/*detail   */}
          {refundInfo?.summary?.refund_online > 0 && (
            <Grid container className={styles.marginTop12}>
              <Grid item>
                <Typography className={styles.summary_Heading}>
                  You will receive the amount in the same account which was used
                  while placing an order.
                </Typography>
              </Grid>
            </Grid>
          )}
          <Divider className={styles.marginTop12} />
          <Box my={3} display="flex" justifyContent="flex-end">
            <PrimaryButton wide onClick={handleClose}>
              Okay
            </PrimaryButton>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

const LightTooltip = withStyles(() => ({
  tooltip: {
    backgroundColor: "#FFFFFF !important",
    color: "rgba(0, 0, 0, 0.87)",
    border: "1px solid #DFE7F5",
    boxShadow: "0 6px 14px 6px rgba(149,157,171,0.4)",
    fontSize: 12,
    fontFamily: "Inter Regular",
    maxWidth: "max-content",
    display: "flex",
    justifyContent: "center",
    padding: 10,
    height: "auto",
  },
  arrow: {
    color: "#FFFFFF",
    marginLeft: 8,
  },
}))(Tooltip);

export default CustomRefund;

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
    fontFamily: "Inter SemiBold !important",
    fontSize: "20px !important",
    color: "#242424",
    wordBreak: "break-word",
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

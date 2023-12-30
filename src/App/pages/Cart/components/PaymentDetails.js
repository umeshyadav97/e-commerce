import React, { useState } from "react";
import { Grid, Typography } from "@material-ui/core";
import { PrimaryButton, BreakupModal } from "../../../components";
import styles from "../Cart.module.css";
import { PDFDownloadLink } from "@react-pdf/renderer";
import InvoicePDF from "../../Orders/components/InvoicePDF";

const PaymentDetails = ({
  data,
  btnText,
  handleClick,
  hideButton = false,
  shippingText = "Calculated at next step",
  title = "Payment Details",
  totalText = "Total",
  Invoice,
  InvoiceData,
}) => {
  const [openBreakupModal, setOpenBreakupModal] = useState(false);

  return (
    <React.Fragment>
      <Grid container direction="column" className={styles.promo_card}>
        <Grid container>
          <Grid item>
            <Typography
              variant="h4"
              className={`${styles.side_header} ${styles.payment_header}`}
            >
              {title}
            </Typography>
          </Grid>
          {Invoice && InvoiceData && (
            <Grid
              item
              className={styles.breakup_text}
              style={{ marginLeft: "auto" }}
            >
              {" "}
              <PDFDownloadLink
                document={<InvoicePDF record={InvoiceData} />}
                fileName="Gomble_Invoice.pdf"
                style={{ textDecoration: "none" }}
              >
                {({ loading }) =>
                  loading ? (
                    ""
                  ) : (
                    <Typography className={styles.Invoice_Button_text}>
                      Invoice #{InvoiceData?.invoice_number}
                    </Typography>
                  )
                }
              </PDFDownloadLink>
            </Grid>
          )}
        </Grid>
        {/* Sub-total */}
        <Grid
          item
          container
          justify="space-between"
          className={styles.sub_total}
        >
          <Grid item>
            <Typography variant="h4" className={styles.payment_text}>
              {`Subtotal (${data?.total_items || 0} items)`}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h4" className={styles.payment_amount}>
              {`$${data?.sub_total ? data?.sub_total?.toLocaleString() : 0}`}
            </Typography>
          </Grid>
        </Grid>
        {/* Discount */}
        {!!data?.total_discount && (
          <Grid
            item
            container
            justify="space-between"
            className={styles.shipping}
          >
            <Grid item>
              <Typography variant="h4" className={styles.payment_text}>
                Discount
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h4" className={styles.payment_amount}>
                {`-$${data?.total_discount?.toLocaleString()}`}
              </Typography>
            </Grid>
          </Grid>
        )}
        {/* Shipping Charges */}
        <Grid
          item
          container
          justify="space-between"
          className={styles.shipping}
        >
          <Grid item>
            <Typography variant="h4" className={styles.payment_text}>
              Shipping
            </Typography>
          </Grid>
          <Grid item>
            {!!data?.total_shipping_fee ? (
              <Typography variant="h4" className={styles.payment_amount}>
                {`$${data?.total_shipping_fee?.toLocaleString()}`}
              </Typography>
            ) : (
              <Typography variant="h4" className={styles.payment_text}>
                {shippingText}
              </Typography>
            )}
          </Grid>
        </Grid>
        {/* Tax */}
        {!!data?.total_tax && (
          <Grid
            item
            container
            justify="space-between"
            className={styles.shipping}
          >
            <Grid item>
              <span className={styles.payment_text}>Tax</span>
              {data?.tax_details?.length ? (
                <>
                  <span
                    className={styles.breakup_text}
                    onClick={() => setOpenBreakupModal(true)}
                  >
                    View Breakup
                  </span>
                  <BreakupModal
                    open={openBreakupModal}
                    title="Tax Breakup"
                    handleClose={() => setOpenBreakupModal(false)}
                    data={data.tax_details}
                  />
                </>
              ) : null}
            </Grid>
            <Grid item>
              <Typography variant="h4" className={styles.payment_amount}>
                {`$${data?.total_tax?.toLocaleString()}`}
              </Typography>
            </Grid>
          </Grid>
        )}
        {/* Stripe Fee */}
        {!!data?.total_stripe_fee && (
          <Grid
            item
            container
            justifyContent="space-between"
            className={styles.shipping}
          >
            <Grid item>
              <Typography variant="h4" className={styles.payment_text}>
                Processing Fee
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h4" className={styles.payment_amount}>
                {`$${data?.total_stripe_fee?.toLocaleString()}`}
              </Typography>
            </Grid>
          </Grid>
        )}
        {/* Total */}
        <Grid item container justify="space-between" className={styles.total}>
          <Grid item>
            <Typography variant="h4" className={styles.total_text}>
              {totalText}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="h4" className={styles.total_text}>
              {`$${
                data?.total_amount ? data?.total_amount?.toLocaleString() : 0
              }`}
            </Typography>
          </Grid>
        </Grid>
        {!hideButton && (
          <Grid item className={styles.continue_btn}>
            <PrimaryButton type="submit" fullWidth onClick={handleClick}>
              <Typography variant="h4" className={styles.side_header}>
                {btnText}
              </Typography>
            </PrimaryButton>
          </Grid>
        )}
      </Grid>
    </React.Fragment>
  );
};

export default PaymentDetails;

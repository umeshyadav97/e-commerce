import React, { useState } from "react";
import { Grid, Typography } from "@material-ui/core";
import { InputField, OutlinedPrimaryButton, Toast } from "../../../components";
import { API, ENDPOINTS } from "../../../../api/apiService";
import CouponModal from "./CouponModal";
import styles from "../Cart.module.css";

const PromoCode = ({ appliedCoupon, handlePromoCode }) => {
  const [sending, setSending] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [promoCode, setPromoCode] = useState(appliedCoupon || "");
  const [isPromoCode, setIsPromoCode] = useState(!!appliedCoupon);

  const handleChange = (event) => {
    const temp = event.target.value.toUpperCase().trim();
    setPromoCode(temp);
  };

  const applyfromList = async (data) => {
    if (!sending) {
      try {
        setSending(true);
        const payload = {
          code: data,
        };
        const resp = await API.post(`${ENDPOINTS.REDEEM_COUPON}`, payload);
        if (resp.success) {
          const msg = resp.data?.message;
          Toast.showSuccessToast(
            msg || "Promo code applied to cart successfully"
          );
          setIsPromoCode(true);
          setPromoCode(data);
          setIsModalOpen(false);
          handlePromoCode();
        }
      } catch (e) {
        const msg =
          typeof e.data.error?.message === "string"
            ? e.data.error?.message
            : e.data.error?.message[0];
        Toast.showErrorToast(
          msg || `Error adding Promo code. Please try again`
        );
      } finally {
        setSending(false);
      }
    }
  };

  const applyPromocode = async (e) => {
    e.preventDefault();
    if (!sending) {
      try {
        setSending(true);
        if (promoCode === "") {
          Toast.showErrorToast(`Promo code can't be empty!`);
          return;
        }
        const payload = {
          code: promoCode,
        };
        const resp = await API.post(`${ENDPOINTS.REDEEM_COUPON}`, payload);
        if (resp.success) {
          const msg = resp.data?.message;
          Toast.showSuccessToast(
            msg || "Promo code applied to cart successfully"
          );
          setIsPromoCode(true);
          handlePromoCode();
        }
      } catch (e) {
        const msg =
          typeof e.data.error?.message === "string"
            ? e.data.error?.message
            : e.data.error?.message[0];
        Toast.showErrorToast(
          msg || `Error adding Promo code. Please try again`
        );
      } finally {
        setSending(false);
      }
    }
  };

  const removePromocode = async () => {
    if (!sending) {
      try {
        setSending(true);
        const resp = await API.deleteResource(ENDPOINTS.REDEEM_COUPON);
        if (resp.success) {
          const msg = resp.data?.message;
          Toast.showSuccessToast(
            msg || "Promo code removed from cart successfully"
          );
          setPromoCode("");
          setIsPromoCode(false);
          handlePromoCode();
        }
      } catch (e) {
        const msg =
          typeof e.data.error?.message === "string"
            ? e.data.error?.message
            : e.data.error?.message[0];
        Toast.showErrorToast(
          msg || `Error removing Promo code. Please try again`
        );
      } finally {
        setSending(false);
      }
    }
  };

  return (
    <Grid container direction="column" className={styles.promo_card}>
      <Grid item>
        <Typography variant="h4" className={styles.side_header}>
          Apply Promo Code
        </Typography>
      </Grid>
      {isPromoCode ? (
        <>
          <Grid item className={styles.applied_code}>
            <Typography>
              <span className={styles.applied_code_text}>Code</span>
              <span className={styles.applied_code_header}>
                {`"${promoCode}"`}
              </span>
              <span className={styles.applied_code_text}> {`applied!!`}</span>
            </Typography>
          </Grid>
          <Grid item>
            <OutlinedPrimaryButton
              wide
              style={{ width: "100%", marginTop: 30 }}
              onClick={removePromocode}
              className={styles.cancel_btn}
            >
              <Typography variant="h4" className={styles.side_header}>
                Remove
              </Typography>
            </OutlinedPrimaryButton>
          </Grid>
        </>
      ) : (
        <form onSubmit={applyPromocode}>
          <Grid item>
            <Typography variant="h4" className={styles.input_label}>
              Code
            </Typography>
            <InputField
              id="promod_code"
              type="text"
              placeholder="Enter discount code"
              variant="outlined"
              onChange={handleChange}
              value={promoCode}
              fullWidth
            />
          </Grid>
          <Grid item>
            <OutlinedPrimaryButton
              wide
              style={{ width: "100%", marginTop: 30 }}
              onClick={applyPromocode}
              className={styles.cancel_btn}
            >
              <Typography variant="h4" className={styles.side_header}>
                Apply
              </Typography>
            </OutlinedPrimaryButton>
          </Grid>
        </form>
      )}
      <Grid item container justifyContent="center">
        <Typography
          variant="h4"
          className={styles.view_coupon_text}
          onClick={() => setIsModalOpen(true)}
        >
          View Applicable Coupons
        </Typography>
      </Grid>
      {isModalOpen && (
        <CouponModal
          open={isModalOpen}
          title="Applicable Coupons"
          isCodeApplied={isPromoCode}
          promoCode={promoCode}
          handleClose={() => setIsModalOpen(false)}
          handleSubmit={applyfromList}
        />
      )}
    </Grid>
  );
};

export default PromoCode;

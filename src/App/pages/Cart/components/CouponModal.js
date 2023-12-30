import React, { useEffect, useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import MuiDialogTitle from "@material-ui/core/DialogTitle";
import MuiDialogContent from "@material-ui/core/DialogContent";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import MuiDialogActions from "@material-ui/core/DialogActions";
import { Grid } from "@material-ui/core";
import {
  PrimaryButton,
  Radio,
  Toast,
  LoaderContent,
} from "../../../components";
import { API, ENDPOINTS } from "../../../../api/apiService";
import { convertDateFormat, getTime } from "../../../../utils/dateUtils";
import EmptyCoupons from "../../../assets/images/No-Discount-added.svg";
import styles from "./Coupon.module.css";

const styles2 = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(3),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: "#242424",
  },
  title: {
    fontFamily: "Inter SemiBold",
    fontSize: 18,
    color: "#242424",
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

const DialogContent = withStyles(() => ({
  root: {
    padding: "10px 30px 30px 30px",
  },
}))(MuiDialogContent);

const DialogActions = withStyles(() => ({
  root: {
    margin: 0,
    padding: 30,
    borderTop: "1px solid #DFE7F5",
  },
}))(MuiDialogActions);

const CouponModal = ({
  title,
  open,
  isCodeApplied,
  promoCode,
  handleClose,
  handleSubmit,
}) => {
  const [loading, setLoading] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState("");
  const [record, setRecord] = useState([]);

  const handleRadio = (code) => {
    setSelectedCoupon(code);
  };

  const handleCloseModal = () => {
    handleClose();
  };

  const handleApplyCoupon = () => {
    handleSubmit(selectedCoupon);
  };

  const fetchApplicableCoupons = async () => {
    if (!loading) {
      try {
        setLoading(true);
        if (isCodeApplied) {
          setSelectedCoupon(promoCode);
        }
        const resp = await API.get(ENDPOINTS.APPLICABLE_COUPONS);
        if (resp.success) {
          const temp = resp.data;
          setRecord(temp);
        }
      } catch (e) {
        const msg =
          typeof e.data?.error?.message === "string"
            ? e.data?.error?.message
            : e.data?.error?.message[0];
        Toast.showErrorToast(
          msg || `Error fetching applicable coupons. Please refresh`
        );
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchApplicableCoupons();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      <Dialog
        maxWidth="xs"
        scroll="body"
        fullWidth
        onClose={handleCloseModal}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <DialogTitle id="customized-dialog-title" onClose={handleCloseModal}>
          {title}
        </DialogTitle>
        <DialogContent>
          <Grid container className={styles.modal_grid}>
            {loading ? (
              <LoaderContent />
            ) : (
              <>
                {record.map((item, index) => (
                  <Grid
                    key={index}
                    item
                    container
                    justifyContent="space-between"
                    alignItems="center"
                    className={styles.coupon_box}
                  >
                    <Grid item container xs={12} sm={6}>
                      <Grid item className={styles.modal_radio}>
                        <Radio
                          isOn={item.code === selectedCoupon}
                          onToggle={() => handleRadio(item.code)}
                        />
                      </Grid>
                      <Grid item>
                        <Typography variant="h4" className={styles.label}>
                          {item.code}
                        </Typography>
                        <Typography variant="h4" className={styles.off_text}>
                          {`${item.discount_type} ${
                            item.discount_type === "PERCENTAGE"
                              ? `${item.discount_value}%`
                              : `$${item.discount_value}`
                          } Off`}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid item>
                      <Typography variant="h4" className={styles.expiry_date}>
                        {`Valid Till: ${convertDateFormat(item.expiry_date)} `}
                      </Typography>
                      <Typography variant="h4" className={styles.expiry_date}>
                        {`${getTime(item.expiry_date)} `}
                      </Typography>
                      {item.discount_type === "PERCENTAGE" && (
                        <Typography variant="h4" className={styles.expiry_date}>
                          {`Max Discount: $${item.cap_value}`}
                        </Typography>
                      )}
                    </Grid>
                  </Grid>
                ))}
                {!record.length && (
                  <Grid container item direction="column" alignItems="center">
                    <Grid item>
                      <img
                        src={EmptyCoupons}
                        alt="Empty Coupons"
                        className={styles.empty_image}
                      />
                    </Grid>
                    <Grid item className={styles.first_line}>
                      <Typography variant="h4" className={styles.btn_text}>
                        You have no coupon codes!
                      </Typography>
                    </Grid>
                    {/* <Grid item className={styles.muted_line}>
                  <Typography variant="h4" className={styles.muted_text}>
                    Add a new card for speedy checkout.
                  </Typography>
                </Grid> */}
                  </Grid>
                )}
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions>
          <PrimaryButton
            type="submit"
            wide
            style={{ width: "100%" }}
            onClick={handleApplyCoupon}
            disabled={!selectedCoupon}
            isDisabled={!selectedCoupon}
          >
            <Typography variant="h4" className={styles.btn_text}>
              Apply
            </Typography>
          </PrimaryButton>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default CouponModal;

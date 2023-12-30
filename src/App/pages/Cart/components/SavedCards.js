import React, { useState, useEffect } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import { Grid, Typography } from "@material-ui/core";
import {
  Radio,
  Toast,
  Loader,
  LoaderContent,
  PrimaryButton,
  SecondaryButton,
  InputField,
  DeleteModal,
} from "../../../components";
import StorageManager from "../../../../storage/StorageManager";
import { CHECKOUT_TOKEN } from "../../../../storage/StorageKeys";
import NoSavedCards from "../../../assets/images/No-saved-card.svg";
import VisaImg from "../../../assets/icons/visa.svg";
import MasterCardImg from "../../../assets/icons/mastercard.svg";
import AmexImg from "../../../assets/icons/amex.svg";
import JcbImg from "../../../assets/icons/jcb.svg";
import UnionPayImg from "../../../assets/icons/unionpay.svg";
import DinersImg from "../../../assets/icons/diners.svg";
import DiscoverImg from "../../../assets/icons/discover.svg";
import UnknownImg from "../../../assets/icons/unknown.svg";
import { API, ENDPOINTS } from "../../../../api/apiService";
import styles from "../Cart.module.css";
import { makeStyles } from "@material-ui/core/styles";

const SavedCards = ({
  cartItems,
  payment,
  addressId,
  handleOrderSuccess,
  onlyCustom,
  handlePaymentFailure,
}) => {
  const stripe = useStripe();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [isDisabled, setIsDisabled] = useState(true);
  const [cards, setCards] = useState([]);
  const [cvv, setCvv] = useState("");

  const classes = useStyles();

  const chooseIcon = (key) => {
    switch (key) {
      case "visa":
        return VisaImg;
      case "mastercard":
        return MasterCardImg;
      case "amex":
        return AmexImg;
      case "jcb":
        return JcbImg;
      case "unionpay":
        return UnionPayImg;
      case "diners":
        return DinersImg;
      case "discover":
        return DiscoverImg;
      default:
        return UnknownImg;
    }
  };

  const handleToggle = (id) => {
    setActiveCard(id);
    setCvv("");
    setIsDisabled(true);
  };

  const handleCvvChange = (e) => {
    let value = e.target.value;
    if (value.length > 4) {
      value = value.substr(0, 4);
    }
    if (value.length >= 3) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
    setCvv(value);
  };

  const handlePlaceOrder = async (card, order_id) => {
    try {
      const payload = {
        order_id: order_id,
        shipping: addressId,
        cart_items: cartItems,
      };
      const token = StorageManager.get(CHECKOUT_TOKEN);
      const customHeader = { "session-id": token };
      let resp;
      if (onlyCustom) {
        resp = await API.post(ENDPOINTS.PLACE_ORDER, payload);
      } else {
        resp = await API.post(
          ENDPOINTS.PLACE_ORDER,
          payload,
          true,
          customHeader
        );
      }
      if (resp.success) {
        const temp = { ...resp.data };
        temp.order_data["card_info"] = card;
        handleOrderSuccess(temp);
      }
    } catch (e) {
      const msg =
        typeof e.data?.error?.message === "string"
          ? e.data?.error?.message
          : e.data?.error?.message[0];
      Toast.showErrorToast(msg || `Error Processing Payment. Please try again`);
    }
  };

  const handleSubmit = async () => {
    try {
      setUpdating(true);
      const arr = cards.filter((item) => item.id === activeCard);
      const card = arr[0].card;

      const token = StorageManager.get(CHECKOUT_TOKEN);
      const customHeader = { "session-id": token };

      const payload = {
        ...payment,
        currency: "usd",
        payment_method_type: "card",
        payment_method: activeCard,
        shipping: addressId,
      };
      let resp;
      if (onlyCustom) {
        resp = await API.post(ENDPOINTS.CONFIRM_METHOD, payload);
      } else {
        resp = await API.post(
          ENDPOINTS.CONFIRM_METHOD,
          payload,
          true,
          customHeader
        );
      }
      if (resp.success) {
        if (resp.data?.payment_status === "succeeded") {
          handlePlaceOrder(card, resp.data?.order_id);
        } else if (resp.data?.payment_status === "requires_action") {
          const result = await stripe.handleCardAction(
            resp.data.client_secrete
          );
          if (result.paymentIntent?.status === "requires_confirmation") {
            const payload2 = {
              ...payload,
              order_num: resp.data.order_num,
            };
            let res;
            if (onlyCustom) {
              res = await API.post(ENDPOINTS.CONFIRM_METHOD, payload2);
            } else {
              res = await API.post(
                ENDPOINTS.CONFIRM_METHOD,
                payload2,
                true,
                customHeader
              );
            }
            if (res.success) {
              if (res.data?.payment_status === "succeeded") {
                handlePlaceOrder(card, res.data?.order_id);
              }
            }
          } else {
            const msg = resp?.error?.message||
              `We are unable to authenticate your payment method at this time. 
            Please choose a different payment method and try again.`;
            Toast.showErrorToast(msg);
            handlePaymentFailure(msg);
          }
        }
      }
    } catch (e) {
      const msg =
        typeof e.data?.error?.message === "string"
          ? e.data?.error?.message
          : e.data?.error?.message[0];
      Toast.showErrorToast(msg || `Error Processing Payment. Please try again`);
      handlePaymentFailure(msg || `Error Processing Payment. Please try again`);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) {
      try {
        setDeleting(true);
        const resp = await API.deleteResource(
          `${ENDPOINTS.REMOVE_PAYMENT_METHOD}/${confirmDelete.id}`
        );
        if (resp.success) {
          const msg = resp.data?.message;
          Toast.showSuccessToast(msg || "Card removed successfully");
          fetchSavedCards();
        }
      } catch (e) {
        const msg =
          typeof e.data?.error?.message === "string"
            ? e.data?.error?.message
            : e.data?.error?.message[0];
        Toast.showErrorToast(msg || `Error removing card`);
      } finally {
        setDeleting(false);
        setConfirmDelete(false);
      }
    }
  };

  const fetchSavedCards = async () => {
    try {
      setLoading(true);
      const resp = await API.get(ENDPOINTS.PAYMENT_LIST);
      if (resp.success) {
        const temp = resp.data;
        let tempData = temp.data;
        if (tempData.length) {
          setActiveCard(tempData[0].id);
          tempData = tempData.map((item) => ({
            ...item,
            card_type: chooseIcon(item.card.brand),
          }));
        }
        setCards(tempData);
      }
    } catch (e) {
      const msg =
        typeof e.data.error?.message === "string"
          ? e.data.error?.message
          : e.data.error?.message[0];
      Toast.showErrorToast(
        msg || `Error fetching saved cards. Please try again`
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedCards();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      {updating && <Loader />}
      {loading ? (
        <LoaderContent />
      ) : (
        <>
          <Grid container style={{ marginBottom: 20 }}>
            <Typography variant="h4" className={styles.side_header}>
              SAVED CARDS
            </Typography>
          </Grid>
          <Grid container direction="column" style={{ width: "90%" }}>
            {cards.length ? (
              <>
                {cards.map((item) => (
                  <Grid
                    item
                    container
                    key={item.id}
                    className={styles.saved_card}
                  >
                    <Grid item container>
                      <Grid item>
                        <Radio
                          isOn={item.id === activeCard}
                          onToggle={() => handleToggle(item.id)}
                        />
                      </Grid>
                      <Grid item>
                        <img
                          src={item.card_type}
                          alt={item.card.brand}
                          className={styles.brand_icon}
                        />
                      </Grid>
                      <Grid item>
                        <Typography
                          className={styles.card_no}
                        >{`XXXX-XXXX-XXXX-${item.card.last4}`}</Typography>
                        {item.id === activeCard && (
                          <Typography className={styles.card_name}>
                            {item.billing_details?.name || ""}
                          </Typography>
                        )}
                      </Grid>
                      <Grid item style={{ marginLeft: "auto" }}>
                        {item.id === activeCard && (
                          <InputField
                            id="cvv"
                            type="password"
                            placeholder="CVC"
                            variant="outlined"
                            onChange={handleCvvChange}
                            value={cvv}
                            style={{ width: "96px" }}
                          />
                        )}
                      </Grid>
                      {item.id === activeCard && (
                        <Grid container spacing={2} style={{ marginTop: 20 }}>
                          <Grid item xs={12} sm={6}>
                            <SecondaryButton
                              variant="outlined"
                              className={classes.remove_btn}
                              onClick={() => setConfirmDelete(item)}
                            >
                              <Typography
                                variant="h4"
                                className={styles.paymnet_mode_text}
                              >
                                Remove
                              </Typography>
                            </SecondaryButton>
                          </Grid>
                          <Grid item xs={12} sm={6}>
                            <PrimaryButton
                              type="submit"
                              fullWidth
                              disabled={isDisabled}
                              isDisabled={isDisabled}
                              onClick={handleSubmit}
                            >
                              <Typography
                                variant="h4"
                                className={styles.side_header}
                              >
                                Pay Now
                              </Typography>
                            </PrimaryButton>
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                  </Grid>
                ))}
              </>
            ) : (
              <Grid container item direction="column" alignItems="center">
                <Grid item>
                  <img
                    src={NoSavedCards}
                    alt="Empty Saved Cards"
                    className={styles.empty_card_image}
                  />
                </Grid>
                <Grid item className={styles.first_line}>
                  <Typography variant="h4" className={styles.side_header}>
                    You have no cards saved!!
                  </Typography>
                </Grid>
                <Grid item className={styles.muted_line}>
                  <Typography variant="h4" className={styles.muted_text}>
                    Add a new card for speedy checkout.
                  </Typography>
                </Grid>
              </Grid>
            )}
          </Grid>
          <DeleteModal
            open={!!confirmDelete}
            title="Delete Card"
            description={`Are you sure you want to delete this Card ?`}
            handleClose={() => setConfirmDelete(false)}
            handleSubmit={handleDelete}
          />
        </>
      )}
    </React.Fragment>
  );
};

const useStyles = makeStyles((theme) => ({
  root: () => ({
    top: 0,
  }),
  cvc: {
    justifyContent: "flex-end",
    [theme.breakpoints.down("md")]: {
      justifyContent: "flex-start",
    },
  },
  remove_btn: {
    width:"140px",
    minWidth:"140px",
    height:"48px",
    minHeight:"48px",
    [theme.breakpoints.down("sm")]:{
      width:"100%",
      minWidth:"100%",
    }
  }
}));

export default SavedCards;

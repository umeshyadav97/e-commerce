import React, { useState, useMemo, useEffect } from "react";
import {
  useElements,
  useStripe,
  CardCvcElement,
  CardNumberElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import { Grid, Typography, Breadcrumbs, Paper } from "@material-ui/core";
import {
  Radio,
  Toast,
  PrimaryButton,
  InputField,
  Checkbox,
} from "../../../components";
import { API, ENDPOINTS } from "../../../../api/apiService";
import Dialog from "@material-ui/core/Dialog";
import { withStyles } from "@material-ui/core/styles";
import MuiDialogContent from "@material-ui/core/DialogContent";
import StorageManager from "../../../../storage/StorageManager";
import CrossIcon from "../../../assets/icons/cross_icon.svg";
import { CHECKOUT_TOKEN } from "../../../../storage/StorageKeys";
import PaymentFailureImg from "../../../assets/icons/Payment-Failure.svg";
import styles from "../Cart.module.css";
import SavedCards from "./SavedCards";


const DialogContent = withStyles(() => ({
  root: {
    padding: "0px",
  },
}))(MuiDialogContent);

const useOptions = (type) => {
  const cardNumberOptions = useMemo(() => ({
    style: {
      base: {
        placeholder: "Enter Card Number",
        fontSize: "16px",
        color: "black",
        letterSpacing: "0.025em",
        fontFamily: "Source Code Pro, monospace",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
    showIcon: true,
  }));

  const cardExpiryOptions = useMemo(() => ({
    style: {
      base: {
        fontSize: "16px",
        color: "black",
        letterSpacing: "0.025em",
        fontFamily: "Source Code Pro, monospace",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  }));

  const cardCvvOptions = useMemo(() => ({
    style: {
      base: {
        fontSize: "16px",
        color: "black",
        letterSpacing: "0.025em",
        fontFamily: "Source Code Pro, monospace",
        "::placeholder": {
          color: "#aab7c4",
        },
      },
      invalid: {
        color: "#9e2146",
      },
    },
  }));
  if (type === "number") return cardNumberOptions;
  if (type === "expiry") return cardExpiryOptions;
  return cardCvvOptions;
};

const PaymentListing = ({
  record,
  cartItems,
  payment,
  addressId,
  handleTab,
  handleOrderSuccess,
  onlyCustom,
  props,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const options1 = useOptions("number");
  const options2 = useOptions("expiry");
  const options3 = useOptions("cvv");
  const [mode, setMode] = useState("credit-card");
  const [checkBox, setCheckBox] = useState(false);
  const [sending, setSending] = useState(false);
  const [paymentFailure, setPaymentFailure] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [name, setName] = useState("");
  const [cardComplete, setCardComplete] = useState(false);
  const [cardStatus, setCardStatus] = useState({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false,
    name: false,
  });

  const addBorder = (id) => {
    const note = document.getElementById(id);
    note.style.border = "2px solid #FC68A2";
  };

  const removeBorder = (id) => {
    const note = document.getElementById(id);
    note.style.border = "1px solid rgba(55, 37, 168, 0.25)";
  };

  const handleNameChange = (e) => {
    const n = e.target.value.trim();
    setName(e.target.value);
    const temp = { ...cardStatus };
    if (n.length) {
      temp["name"] = true;
      setCardStatus(temp);
    } else {
      temp["name"] = false;
      setCardStatus(temp);
    }
    if (
      temp["cardNumber"] &&
      temp["cardExpiry"] &&
      temp["cardCvc"] &&
      temp["name"]
    ) {
      setCardComplete(true);
    } else {
      setCardComplete(false);
    }
  };

  const handleMode = (status) => {
    setMode(status);
  };

  const handlePaymentFailure = (msg) => {
    setErrorMessage(msg);
    setPaymentFailure(true);
  };

  const handlePaymentFailureClose = () => {
    setPaymentFailure(false);
  };

  const handleCompleteStatus = (e) => {
    const temp = { ...cardStatus };
    temp[e.elementType] = e.complete;
    setCardStatus(temp);
    if (
      temp["cardNumber"] &&
      temp["cardExpiry"] &&
      temp["cardCvc"] &&
      temp["name"]
    ) {
      setCardComplete(true);
    } else {
      setCardComplete(false);
    }
  };

  const handleCheckBox = () => {
    setCheckBox((prev) => !prev);
  };

  const handlePlaceOrder = async (payload, order_id) => {
    try {
      const payload2 = {
        order_id: order_id,
        shipping: addressId,
        cart_items: cartItems,
      };
      const token = StorageManager.get(CHECKOUT_TOKEN);
      const customHeader = { "session-id": token };
      let resp;
      if (onlyCustom) {
        resp = await API.post(ENDPOINTS.PLACE_ORDER, payload2);
      } else {
        resp = await API.post(
          ENDPOINTS.PLACE_ORDER,
          payload2,
          true,
          customHeader
        );
      }
      if (resp.success) {
        const temp = { ...resp.data };
        temp.order_data["card_info"] = payload.paymentMethod.card;
        handleOrderSuccess(temp);
      }
    } catch (e) {
      const msg =
        typeof e.data?.error?.message === "string"
          ? e.data?.error?.message
          : e.data?.error?.message[0];
      Toast.showErrorToast(msg || `Error Processing Payment. Please try again`);
      setSending(false);
    }
  };

  const handleSubmit = async (event) => {
    if (cardComplete) {
      try {
        setSending(true);
        event.preventDefault();

        const token = StorageManager.get(CHECKOUT_TOKEN);
        const customHeader = { "session-id": token };

        if (!stripe || !elements) {
          // Stripe.js has not loaded yet. Make sure to disable
          // form submission until Stripe.js has loaded.
          return;
        }

        // Setting Payment_Method_ID
        const payload = await stripe.createPaymentMethod({
          type: "card",
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: name,
          },
        });
        const paymentId = payload.paymentMethod.id;

        // Saving Card if selected
        if (checkBox) {
          const payload2 = {
            payment_method_id: paymentId,
          };
          await API.post(ENDPOINTS.PAYMENT_LIST, payload2);
        }

        const payload3 = {
          ...payment,
          currency: "usd",
          payment_method_type: "card",
          payment_method: paymentId,
          shipping: addressId,
        };
        let resp;
        if (onlyCustom) {
          resp = await API.post(ENDPOINTS.CONFIRM_METHOD, payload3);
        } else {
          resp = await API.post(
            ENDPOINTS.CONFIRM_METHOD,
            payload3,
            true,
            customHeader
          );
        }
        if (resp.success) {
          if (resp.data?.payment_status === "succeeded") {
            handlePlaceOrder(payload, resp.data?.order_id);
          } else if (resp.data?.payment_status === "requires_action") {
            const result = await stripe.handleCardAction(
              resp.data.client_secrete
            );
            if (result.paymentIntent?.status === "requires_confirmation") {
              const payload4 = {
                ...payload3,
                order_num: resp.data.order_num,
              };
              let res;
              if (onlyCustom) {
                res = await API.post(ENDPOINTS.CONFIRM_METHOD, payload4);
              } else {
                res = await API.post(
                  ENDPOINTS.CONFIRM_METHOD,
                  payload4,
                  true,
                  customHeader
                );
              }
              if (res.success) {
                if (res.data?.payment_status === "succeeded") {
                  handlePlaceOrder(payload, res.data?.order_id);
                }
              }
            } else {
              const msg =
                resp?.error?.message ||
                `We are unable to authenticate your payment method at this time. 
              Please choose a different payment method and try again.`;
              Toast.showErrorToast(msg);
              setSending(false);
              handlePaymentFailure(msg);
            }
          }
        }
      } catch (e) {
        const msg =
          typeof e.data?.error?.message === "string"
            ? e.data?.error?.message
            : e.data?.error?.message[0];
        Toast.showErrorToast(
          msg || `Error Processing Payment. Please try again`
        );
        handlePaymentFailure(msg);
        setSending(false);
      }
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div>
      <React.Fragment>
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator="/"
          aria-label="breadcrumb"
          className={styles.breadcrumbs}
        >
          <Typography
            className={styles.breadcrumbs_text}
            onClick={() => props.history.push("/home")}
          >
            Home
          </Typography>
          <Typography
            className={styles.breadcrumbs_text}
            onClick={() => handleTab("cart")}
          >
            Cart
          </Typography>
          <Typography
            className={styles.breadcrumbs_text}
            onClick={() => handleTab("shipping")}
          >
            Shipping
          </Typography>
          <Typography className={styles.breadcrumbs_text}>Payment</Typography>
        </Breadcrumbs>
        {/* Header */}
        <Grid item xs={12}>
          <Typography
            variant="h4"
            className={`${styles.header} ${styles.header_border}`}
          >
            Payment
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h4" className={styles.choose_payment}>
            Choose Payment Mode
          </Typography>
        </Grid>
        <Grid container id="checkout">
          {/* Select Payment mode */}
          <Grid
            container
            direction="column"
            item
            xs={12}
            md={5}
            className={styles.payment_selection}
          >
            <Grid
              item
              container
              className={`${styles.payment_mode_card} ${
                mode === "saved-card" ? styles.active : ""
              }`}
            >
              <Grid item>
                <Radio
                  isOn={mode === "saved-card"}
                  onToggle={() => handleMode("saved-card")}
                />
              </Grid>
              <Grid item>
                <Typography className={styles.paymnet_mode_text}>
                  SAVED CARDS
                </Typography>
              </Grid>
            </Grid>
            <Grid
              item
              container
              className={`${styles.payment_mode_credit} ${
                mode === "credit-card" ? styles.active : ""
              }`}
            >
              <Grid item>
                <Radio
                  isOn={mode === "credit-card"}
                  onToggle={() => handleMode("credit-card")}
                />
              </Grid>
              <Grid item>
                <Typography className={styles.paymnet_mode_text}>
                  CREDIT/DEBIT CARD
                </Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid container item xs={12} md={7} className={styles.chosen_payment}>
            {mode === "saved-card" && (
              <SavedCards
                record={record}
                cartItems={cartItems}
                payment={payment}
                addressId={addressId}
                handleOrderSuccess={handleOrderSuccess}
                onlyCustom={onlyCustom}
                props={props}
                handlePaymentFailure={(msg) => handlePaymentFailure(msg)}
              />
            )}
            {mode === "credit-card" && (
              <Grid container>
                <Grid item xs={12}>
                  <Typography variant="h4" className={styles.side_header}>
                    Credit/Debit Card
                  </Typography>
                </Grid>
                <form
                  className="Form"
                  onSubmit={handleSubmit}
                  style={{ width: "100%", marginTop: 20 }}
                >
                  <Grid item xs={12}>
                    <Typography className={styles.card_label}>
                      Card Number
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    xs={12}
                    id="stripe_card_number"
                    style={{
                      background: "white",
                      height: "48px",
                      marginBottom: "30px",
                      padding: "14px 2px 14px 12px",
                      borderRadius: "8px",
                      border: "1px solid rgba(55, 37, 168, 0.25)",
                    }}
                  >
                    <CardNumberElement
                      options={options1}
                      placeholder="Card Number"
                      onReady={() => {
                      }}
                      onChange={(event) => handleCompleteStatus(event)}
                      onBlur={() => {
                        removeBorder("stripe_card_number");
                      }}
                      onFocus={() => {
                        addBorder("stripe_card_number");
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} className={styles.card_input}>
                    <Typography variant="h4" className={styles.card_label}>
                      Name on Card
                    </Typography>
                    <InputField
                      id="name"
                      type="text"
                      placeholder="Enter name"
                      variant="outlined"
                      onChange={handleNameChange}
                      value={name}
                      fullWidth
                    />
                  </Grid>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Grid item xs={12}>
                        <Typography className={styles.card_label}>
                          Valid (MM/YY)
                        </Typography>
                      </Grid>
                      <Grid
                        id="stripe_expiry"
                        item
                        xs={12}
                        style={{
                          background: "white",
                          height: "48px",
                          padding: "14px 2px 14px 12px",
                          borderRadius: "8px",
                          border: "1px solid rgba(55, 37, 168, 0.25)",
                        }}
                      >
                        <CardExpiryElement
                          options={options2}
                          onReady={() => {
                          }}
                          onChange={(event) => handleCompleteStatus(event)}
                          onBlur={() => {
                            removeBorder("stripe_expiry");
                          }}
                          onFocus={() => {
                            addBorder("stripe_expiry");
                          }}
                        />
                      </Grid>
                    </Grid>
                    <Grid item xs={6}>
                      <Grid item xs={12}>
                        <Typography className={styles.card_label}>
                          CVC
                        </Typography>
                      </Grid>
                      <Grid
                        id="stripe_cvv"
                        item
                        xs={12}
                        style={{
                          background: "white",
                          height: "48px",
                          padding: "14px 2px 14px 12px",
                          borderRadius: "8px",
                          border: "1px solid rgba(55, 37, 168, 0.25)",
                        }}
                      >
                        <CardCvcElement
                          options={options3}
                          onReady={() => {
                          }}
                          onChange={(event) => handleCompleteStatus(event)}
                          onBlur={() => {
                            removeBorder("stripe_cvv");
                          }}
                          onFocus={() => {
                            addBorder("stripe_cvv");
                          }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid container item style={{ marginTop: 20 }}>
                    <Grid item xs={1}>
                      <Checkbox
                        isOn={checkBox}
                        isFilled={true}
                        onToggle={handleCheckBox}
                      />
                    </Grid>
                    <Grid item xs={11}>
                      <Typography className={styles.payment_text}>
                        Save this card for future payment. To view stripe{" "}
                        <a href="https://stripe.com/en-i6n/legal/checkout">
                          terms and conditions click here
                        </a>
                        .
                      </Typography>
                    </Grid>
                  </Grid>
                  <PrimaryButton
                    type="submit"
                    fullWidth
                    disabled={!cardComplete || sending}
                    isDisabled={!cardComplete || sending}
                    style={{ marginTop: 20 }}
                  >
                    <Typography variant="h4" className={styles.side_header}>
                      {sending ? "Processing..." : "Pay"}
                    </Typography>
                  </PrimaryButton>
                </form>
              </Grid>
            )}
          </Grid>
        </Grid>
        {paymentFailure && (
          <Dialog
            maxWidth="xs"
            fullWidth
            onClose={handlePaymentFailureClose}
            open={paymentFailure}
            scroll={"paper"}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
          >
            <DialogContent id="scroll-dialog-title">
              <Grid container>
                <Paper>
                  <Grid container id="checkout" style={{ padding: "0 10px" }}>
                    <Grid
                      container
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Grid item></Grid>
                      <Grid item>
                        <img
                          style={{ marginRight: "10px" }}
                          src={CrossIcon}
                          alt="img"
                          onClick={handlePaymentFailureClose}
                        />
                      </Grid>
                    </Grid>
                    <Grid
                      container
                      style={{
                        alignItems: "center",
                        marginBottom: "10px",
                        marginTop: "10px",
                      }}
                    >
                      <Grid
                        container
                        direction="column"
                        item
                        xs={12}
                        md={12}
                        lg={12}
                        style={{ alignItems: "center" }}
                      >
                        {/* Select to pay through credit/debit card */}
                        <Grid item>
                          <img src={PaymentFailureImg} alt="img" />
                        </Grid>
                      </Grid>
                      <Grid
                        container
                        direction="column"
                        style={{
                          alignItems: "center",
                          marginBottom: "10px",
                          marginTop: "50px",
                        }}
                      >
                        <Grid
                          item
                          className={styles.secondary_btn_text}
                          style={{ alignItems: "center", marginBottom: "50px" }}
                        >
                          Oops!! Payment Failed
                        </Grid>
                        <Grid
                          item
                          className={styles.muted_text}
                          style={{ alignItems: "center" }}
                        >
                          Your payment has been declined.
                        </Grid>
                        <Grid
                          item
                          className={styles.muted_text}
                          style={{ alignItems: "center" }}
                        >
                          Amount will be refunded within 24 hr if deducted.
                        </Grid>
                        {errorMessage ? (
                          <Grid
                            item
                            className={styles.muted_err}
                            style={{ alignItems: "center", marginTop: "20px" }}
                          >
                            {errorMessage}
                          </Grid>
                        ) : null}
                      </Grid>
                    </Grid>
                  </Grid>
                </Paper>
              </Grid>
            </DialogContent>
          </Dialog>
        )}
      </React.Fragment>
    </div>
  );
};

export default PaymentListing;

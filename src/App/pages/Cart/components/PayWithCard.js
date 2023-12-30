import React, { useState, useMemo } from "react";
import {
  useElements,
  useStripe,
  CardCvcElement,
  CardNumberElement,
  CardExpiryElement,
} from "@stripe/react-stripe-js";
import { Grid, Typography } from "@material-ui/core";
import {
  Toast,
  PrimaryButton,
  InputField,
  Checkbox,
} from "../../../components";
import { API, ENDPOINTS } from "../../../../api/apiService";
import styles from "../Cart.module.css";

const useOptions = () => {
  const options = useMemo(() => ({
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
    showIcon: true,
  }));

  return options;
};
const PayWithCard = ({ cartItems, payment, addressId, handleOrderSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const options = useOptions();
  const [checkBox, setCheckBox] = useState(false);
  const [sending, setSending] = useState(false);
  const [name, setName] = useState("");
  const [cardComplete, setCardComplete] = useState(false);
  const [cardStatus, setCardStatus] = useState({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false,
    name: false,
  });

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
      const order = await API.post(ENDPOINTS.PLACE_ORDER, payload2);
      if (order.success) {
        const temp = { ...order.data };
        temp.order_data["card_info"] = payload.paymentMethod.card;
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

  const handleSubmit = async (event) => {
    try {
      setSending(true);
      event.preventDefault();

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
        total_discount: 0.0,
        currency: "usd",
        payment_method_type: "card",
        payment_method: paymentId,
        shipping: addressId,
      };

      const resp = await API.post(ENDPOINTS.CONFIRM_METHOD, payload3);

      if (resp.success) {
        if (resp.data?.payment_status === "succeeded") {
          handlePlaceOrder(payload, resp.data?.order_id);
        } else if (resp.data?.payment_status === "requires_action") {
          console.log("inside 3d secure");
          stripe
            .handleCardAction(resp.data.client_secrete)
            .then(function (result) {
              // Handle result.error or result.paymentIntent
              console.log(result, "final");
            });
        }
      }
    } catch (e) {
      const msg =
        typeof e.data?.error?.message === "string"
          ? e.data?.error?.message
          : e.data?.error?.message[0];
      Toast.showErrorToast(msg || `Error Processing Payment. Please try again`);
    } finally {
      setSending(false);
    }
  };

  return (
    <React.Fragment>
      <Grid container>
        <Grid item xs={12}>
          <Typography variant="h4" className={styles.side_header}>
            Credit/Debit CARD
          </Typography>
        </Grid>
        <form
          className="Form"
          onSubmit={handleSubmit}
          style={{ width: "100%", marginTop: 20 }}
        >
          <Grid item xs={12}>
            <Typography className={styles.card_label}>Card Number</Typography>
          </Grid>
          <Grid
            item
            xs={12}
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
              options={options}
              onReady={() => {
                console.log("CardNumberElement [ready]");
              }}
              onChange={(event) => handleCompleteStatus(event)}
              onBlur={() => {
                console.log("CardNumberElement [blur]");
              }}
              onFocus={() => {
                console.log("CardNumberElement [focus]");
              }}
            />
          </Grid>
          <Grid item xs={12} className={styles.card_input}>
            <Typography variant="h4" className={styles.label}>
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
                  options={options}
                  onReady={() => {
                    console.log("CardNumberElement [ready]");
                  }}
                  onChange={(event) => handleCompleteStatus(event)}
                  onBlur={() => {
                    console.log("CardNumberElement [blur]");
                  }}
                  onFocus={() => {
                    console.log("CardNumberElement [focus]");
                  }}
                />
              </Grid>
            </Grid>
            <Grid item xs={6}>
              <Grid item xs={12}>
                <Typography className={styles.card_label}>CVC</Typography>
              </Grid>
              <Grid
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
                  options={options}
                  onReady={() => {
                    console.log("CardNumberElement [ready]");
                  }}
                  onChange={(event) => handleCompleteStatus(event)}
                  onBlur={() => {
                    console.log("CardNumberElement [blur]");
                  }}
                  onFocus={() => {
                    console.log("CardNumberElement [focus]");
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid container item style={{ marginTop: 20 }}>
            <Grid item>
              <Checkbox isOn={checkBox} onToggle={handleCheckBox} />
            </Grid>
            <Grid item>
              <Typography variant="h4" className={styles.breadcrumbs_text}>
                Save this card for future payment
              </Typography>
            </Grid>
          </Grid>
          <PrimaryButton
            variant="outlined"
            type="submit"
            fullWidth
            disabled={!cardComplete && !sending}
            isDisabled={!cardComplete && !sending}
            style={{ marginTop: 20 }}
          >
            <Typography variant="h4" className={styles.side_header}>
              Pay
            </Typography>
          </PrimaryButton>
        </form>
      </Grid>
    </React.Fragment>
  );
};

export default PayWithCard;

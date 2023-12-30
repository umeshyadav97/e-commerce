import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { Grid } from "@material-ui/core";
import { Toast, LoaderContent } from "../../components";
import ErrorPage from "../../components/ErrorPage";
import { API, ENDPOINTS } from "../../../api/apiService";
import { setCart } from "../../../redux/actions/authActions";
import StorageManager from "../../../storage/StorageManager";
import { CHECKOUT_TOKEN } from "../../../storage/StorageKeys";
import CartListing from "./components/CartListing";
import ShippingAddress from "./components/ShippingAddress";
import AddAddress from "./components/AddAddress";
import EditAddress from "./components/EditAddress";
import PaymentListing from "./components/PaymentListing";
import PromoCode from "./components/PromoCode";
import PaymentDetails from "./components/PaymentDetails";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import styles from "./Cart.module.css";

const Cart = (props) => {
  const isLoggedIn = props.isAuthenticated;
  const [loading, setLoading] = useState(true);
  const [isApiError, setIsApiError] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [onlyCustom, setOnlyCustom] = useState(false);
  const [record, setRecord] = useState([]);
  const [address, setAddress] = useState([]);
  const [addressId, setAddressId] = useState(null);
  const [editaddressId, setEditAddressId] = useState(null);
  const [payment, setPayment] = useState([]);
  const [list, setList] = useState(null);
  const [total, setTotal] = useState(0);
  const [activeTab, setActiveTab] = useState("cart");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState("");

  const handleActiveTab = (tab, id) => {
    setActiveTab(tab);
    if (tab === "shipping") {
      fetchSavedAddresses();
    } else if (tab === "edit-address") {
      setEditAddressId(id);
    }
  };

  const handleOrderSuccess = (data) => {
    props.history.push({
      pathname: "/order_success",
      state: { data: data },
    });
  };

  const handlePromoCode = async () => {
    try {
      setUpdating(true);
      const resp = await API.get(ENDPOINTS.CART_LIST);
      if (resp.success) {
        const temp = resp.data;
        setRecord(temp.items);
        setPayment(temp.payment_details);
        setCurrentCoupon(temp.payment_details.coupon_code);
      }
    } catch (e) {
      const msg =
        typeof e.data?.error?.message === "string"
          ? e.data?.error?.message
          : e.data?.error?.message[0];
      Toast.showErrorToast(
        msg || `Error applying promo code to cart. Please try again`
      );
    } finally {
      setUpdating(false);
    }
  };

  const handleChangeQuantity = async (ID, count) => {
    if (!updating) {
      if (count === 0) {
        handleRemoveItem(ID);
        return;
      }
      try {
        setUpdating(true);
        const payload = {
          quantity: count,
        };
        const resp = await API.patch(`${ENDPOINTS.EDIT_CART}/${ID}`, payload);
        if (resp.success) {
          const newPayment = resp.data.payment_details;
          const newData = resp.data.item_data;
          const temp = [...record];
          const index = temp.findIndex((el) => el.id === ID);
          temp[index] = newData;
          setRecord(temp);
          setPayment(newPayment);
        }
      } catch (e) {
        const msg =
          typeof e.data.error?.message === "string"
            ? e.data.error?.message
            : e.data.error?.message[0];
        Toast.showErrorToast(
          msg || `Error changing quantity. Please try again`
        );
      } finally {
        setUpdating(false);
      }
    }
  };

  const handleRemoveItem = async (ID) => {
    if (!deleting) {
      try {
        setDeleting(true);
        const resp = await API.deleteResource(`${ENDPOINTS.EDIT_CART}/${ID}`);
        if (resp.success) {
          const msg = resp.data?.message;
          Toast.showSuccessToast(
            msg || "Product removed from cart successfully"
          );
          fetchCartItems();
        }
      } catch (e) {
        const msg =
          typeof e.data.error?.message === "string"
            ? e.data.error?.message
            : e.data.error?.message[0];
        Toast.showErrorToast(msg || `Error removing product. Please try again`);
      } finally {
        setDeleting(false);
      }
    }
  };

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const resp = await API.get(ENDPOINTS.CART_LIST);
      if (resp.success) {
        const temp = resp.data;
        setTotal(temp.items?.length || 0);
        props.setCart(temp.items?.length || 0);
        setRecord(temp.items);
        setPayment(temp.payment_details);
        setCurrentCoupon(temp.payment_details.coupon_code);
      }
    } catch (e) {
      const msg =
        typeof e.data?.error?.message === "string"
          ? e.data?.error?.message
          : e.data?.error?.message[0];
      Toast.showErrorToast(
        msg || `Error fetching cart items. Please try again`
      );
      setIsApiError(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedAddresses = async () => {
    try {
      setLoading(true);
      const resp = await API.get(`${ENDPOINTS.SAVED_ADDRESS}?PAGE_SIZE=100`);
      if (resp.success) {
        const temp = resp.data;
        if (temp.results.length) {
          let arr = [];
          arr = temp.results.map((item) => ({
            ...item,
            is_delivery_address: item.is_default,
          }));
          setAddressId(arr[0].id);
          handleShippingFee(arr[0].id);
          setAddress(arr);
        } else {
          setAddress(temp.results);
        }
      }
    } catch (e) {
      const msg =
        typeof e.data.error?.message === "string"
          ? e.data.error?.message
          : e.data.error?.message[0];
      Toast.showErrorToast(
        msg || `Error Fetching Addresses List. Please Refresh`
      );
      setIsApiError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressSelection = (ID) => {
    const arr = address.map((item) => ({
      ...item,
      is_delivery_address: item.id === ID,
    }));
    setAddress(arr);
    handleShippingFee(ID);
  };

  const handleDeleteAddress = async () => {
    if (!deleting) {
      try {
        setDeleting(true);
        const resp = await API.deleteResource(
          `${ENDPOINTS.SAVED_ADDRESS}/${confirmDelete.id}`
        );
        if (resp.success) {
          Toast.showSuccessToast("Address Deleted Successfully");
          if (confirmDelete.id === addressId) {
            setAddressId(null);
          }
          fetchSavedAddresses();
        }
      } catch (e) {
        const msg =
          typeof e.data.error?.message === "string"
            ? e.data.error?.message
            : e.data.error?.message[0];
        Toast.showErrorToast(msg || `Error Deleting Address`);
      } finally {
        setDeleting(false);
        setConfirmDelete(false);
      }
    }
  };

  const handleShippingFee = async (id) => {
    try {
      const payload = {
        shipping: id,
        total_amount: payment.sub_total,
        total_discount: payment.total_discount,
      };
      setAddressId(id);
      let resp;
      if (onlyCustom) {
        resp = await API.post(`${ENDPOINTS.SHIPPING_COST}`, payload);
      } else {
        const token = StorageManager.get(CHECKOUT_TOKEN);
        const customHeader = { "session-id": token };
        resp = await API.post(
          `${ENDPOINTS.SHIPPING_COST}`,
          payload,
          true,
          customHeader
        );
      }
      if (resp.success) {
        const temp = resp.data;
        setList(temp.items);
        setPayment({
          total_items: payment.total_items,
          total_discount: temp.total_discount,
          total_shipping_fee: temp.total_shipping_fee,
          sub_total: temp.sub_total,
          total_amount: temp.total_amount,
          shipping_id: temp.shipping,
        });
      }
    } catch (e) {
      const msg =
        typeof e.data.error?.message === "string"
          ? e.data.error?.message
          : e.data.error?.message[0];
      Toast.showErrorToast(
        msg || `Error Fetching Shipping Fees. Please Refresh`
      );
      setIsApiError(true);
    }
  };

  const handleProceedToPayment = async () => {
    try {
      const payload = {
        shipping: payment.shipping_id,
        total_shipping_fee: payment.total_shipping_fee,
        sub_total: payment.sub_total,
        total_discount: payment.total_discount,
        cart_items: list,
      };
      let resp;
      if (onlyCustom) {
        resp = await API.post(`${ENDPOINTS.CALCULATE_TAX}`, payload);
      } else {
        const token = StorageManager.get(CHECKOUT_TOKEN);
        const customHeader = { "session-id": token };
        resp = await API.post(
          `${ENDPOINTS.CALCULATE_TAX}`,
          payload,
          true,
          customHeader
        );
      }
      if (resp.success) {
        const temp = resp.data;
        setList(temp.items);
        setPayment({
          ...payment,
          ...{
            total_shipping_fee: temp.total_shipping_fee,
            sub_total: temp.sub_total,
            total_tax: temp.total_tax,
            total_stripe_fee: temp.total_stripe_fee,
            total_amount: temp.total_amount,
            tax_details: temp.tax_details,
          },
        });
        handleActiveTab("payment");
      }
    } catch (e) {
      const msg =
        typeof e.data.error?.message === "string"
          ? e.data.error?.message
          : e.data.error?.message[0];
      Toast.showErrorToast(msg || `Error Fetching Taxes. Please try again`);
    }
  };

  const handleProceedToCheckout = async () => {
    try {
      const resp = await API.post(ENDPOINTS.INVENTORY_CHECK);
      if (resp.success) {
        const temp = resp.data;
        const arr = temp.stock_n_items;
        if (arr.length) {
          let tempData = [...record];
          for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < record.length; j++) {
              if (arr[i].id === record[j].id) {
                tempData[j][
                  "error"
                ] = `Available Stock: ${arr[i].available_stock}`;
                break;
              }
            }
          }
          setRecord(tempData);
          Toast.showErrorToast(
            "Some items in your cart are not available. Please remove them"
          );
        } else {
          if (temp.checkout_session_id) {
            StorageManager.put(CHECKOUT_TOKEN, temp.checkout_session_id);
          } else {
            StorageManager.put(CHECKOUT_TOKEN, null);
            setOnlyCustom(true);
          }
          handleActiveTab("shipping");
        }
      }
    } catch (e) {
      const msg =
        typeof e.data.error?.message === "string"
          ? e.data.error?.message
          : e.data.error?.message[0];
      Toast.showErrorToast(
        msg ||
          `Some items in your cart are not available. Please try again in some time`
      );
    }
  };

  useEffect(() => {
    if (isLoggedIn && activeTab === "cart") {
      fetchCartItems();
      window.scrollTo(0, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  return (
    <React.Fragment>
      {!isLoggedIn ? <Redirect to="/auth/login" /> : null}
      {isApiError ? (
        <ErrorPage code="500" header="Server is down!" />
      ) : (
        <Grid container className={styles.container}>
          {loading ? (
            <LoaderContent />
          ) : (
            <>
              {activeTab === "cart" && (
                <Grid container className={total > 0 ? styles.box : ""}>
                  <CartListing
                    record={record}
                    total={total}
                    handleChangeQuantity={handleChangeQuantity}
                    handleRemoveItem={handleRemoveItem}
                    props={props}
                  />
                  {!!total && (
                    <Grid container spacing={3} className={styles.cart_box}>
                      <Grid item>
                        <PromoCode
                          appliedCoupon={currentCoupon}
                          handlePromoCode={handlePromoCode}
                        />
                      </Grid>
                      <Grid item>
                        <PaymentDetails
                          data={payment}
                          btnText={"Proceed to Checkout"}
                          handleClick={handleProceedToCheckout}
                        />
                      </Grid>
                    </Grid>
                  )}
                </Grid>
              )}
              {activeTab === "shipping" && (
                <Grid container spacing={2} className={styles.box}>
                  <Grid item>
                  <ShippingAddress
                    record={address}
                    addressId={addressId}
                    handleAddressSelection={handleAddressSelection}
                    handleDelete={handleDeleteAddress}
                    confirmDelete={confirmDelete}
                    setConfirmDelete={setConfirmDelete}
                    handleTab={handleActiveTab}
                    props={props}
                  />
                  </Grid>
                  <Grid item>
                  <Grid
                    container
                    direction="column"
                    className={styles.shipping_box}
                  >
                    <PaymentDetails
                      data={payment}
                      btnText={"Proceed to Payment"}
                      handleClick={handleProceedToPayment}
                      hideButton={!addressId}
                    />
                  </Grid>
                  </Grid>
                </Grid>
              )}
              {activeTab === "add-address" && (
                <Grid container>
                  <AddAddress handleTab={handleActiveTab} props={props} />
                </Grid>
              )}
              {activeTab === "edit-address" && (
                <Grid container>
                  <EditAddress
                    handleTab={handleActiveTab}
                    id={editaddressId}
                    props={props}
                  />
                </Grid>
              )}
              {activeTab === "payment" && (
                <Grid container spacing={2} className={styles.box}>
                  <Grid item>
                  <Elements
                    stripe={loadStripe(process.env.REACT_APP_STRIPE_KEY)}
                  >
                    <PaymentListing
                      record={record}
                      cartItems={list}
                      payment={payment}
                      addressId={addressId}
                      handleTab={handleActiveTab}
                      handleOrderSuccess={handleOrderSuccess}
                      onlyCustom={onlyCustom}
                      props={props}
                    />
                  </Elements>
                  </Grid>
                  <Grid item>
                  <Grid
                    container
                    direction="column"
                    className={styles.shipping_box}
                  >
                    <PaymentDetails data={payment} hideButton={true} />
                  </Grid>
                  </Grid>
                </Grid>
              )}
            </>
          )}
        </Grid>
      )}
    </React.Fragment>
  );
};

const mapStateToProps = ({ auth: { isAuthenticated } }) => ({
  isAuthenticated,
});

const mapDispatchToProps = (dispatch) => ({
  setCart: (count) => dispatch(setCart(count)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Cart);

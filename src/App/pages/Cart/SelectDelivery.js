import React, { useState, useEffect } from 'react';
import { Grid, Typography } from '@material-ui/core';
import {
  Toast,
  LoaderContent,
  Radio,
  DeleteModal,
} from '../../components';
import { API, ENDPOINTS } from '../../../api/apiService';
import DeleteIcon from '../../assets/icons/delete-gomble.svg';
import EditIcon from '../../assets/icons/editImage.svg';
import PromoCode from './components/PromoCode';
import PaymentDetails from './components/PaymentDetails';
import styles from './Cart.module.css';

const SelectDelivery = (props) => {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [record, setRecord] = useState([]);
  const [payment, setPayment] = useState([]);
  const page =  1;
  const [confirmDelete, setConfirmDelete] = useState(false);

  const fetchSavedAddresses = async () => {
    try {
      setLoading(true);
      const resp = await API.get(`${ENDPOINTS.SAVED_ADDRESS}?page=${page}`);
      if (resp.success) {
        const temp = resp.data;
        const arr = temp.results.map((item) => ({
          ...item,
          is_delivery_address: item.is_default,
        }));
        setRecord(arr);
      }
    } catch (e) {
      const msg =
        typeof e.data.error?.message === 'string'
          ? e.data.error?.message
          : e.data.error?.message[0];
      Toast.showErrorToast(
        msg || `Error Fetching Saved Addresses. Please Refresh`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleting) {
      try {
        setDeleting(true);
        const resp = await API.deleteResource(
          `${ENDPOINTS.SAVED_ADDRESS}/${confirmDelete.id}`
        );
        if (resp.success) {
          Toast.showSuccessToast('Address Deleted Successfully');
          fetchSavedAddresses();
        }
      } catch (e) {
        const msg =
          typeof e.data.error?.message === 'string'
            ? e.data.error?.message
            : e.data.error?.message[0];
        Toast.showErrorToast(msg || `Error Deleting Address`);
      } finally {
        setDeleting(false);
        setConfirmDelete(false);
      }
    }
  };

  const handleSubmit = () => {
    console.log('address selected');
  };

  const handleAddressSelection = (ID) => {
    const arr = record.map((item) => ({
      ...item,
      is_delivery_address: item.id === ID,
    }));
    setRecord(arr);
  };

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const resp = await API.get(ENDPOINTS.CART_LIST);
      if (resp.success) {
        const temp = resp.data;
        setPayment(temp.payment_details);
      }
    } catch (e) {
      const msg =
        typeof e.data.error?.message === 'string'
          ? e.data.error?.message
          : e.data.error?.message[0];
      Toast.showErrorToast(
        msg || `Error fetching cart items. Please try again`
      );
    }
  };


  useEffect(() => {
    fetchSavedAddresses();
    fetchCartItems();
  }, [page]);

  return (
    <React.Fragment>
      <Grid container className={styles.container}>
        {/* Heading */}
        <Grid container item>
          <Grid item xs={12}>
            <Typography variant="h4" className={styles.header}>
              Select Delivery Address
            </Typography>
          </Grid>
        </Grid>
        {!loading ? (
          <Grid container className={styles.box}>
            <Grid item xs={12} className={styles.cart_container}>
              {record.map((item) => (
                <Grid
                  container
                  item
                  xs={12}
                  spacing={1}
                  className={styles.address_card}
                  key={item.id}
                  style={{
                    border: item.is_delivery_address ? '2px solid #FC68A2' : '',
                  }}
                >
                  <Grid item xs={1} className={styles.radio}>
                    <Radio
                      isOn={item.is_delivery_address}
                      onToggle={() => handleAddressSelection(item.id)}
                    />
                  </Grid>
                  <Grid item container direction="column" xs={11} spacing={1}>
                    <Grid
                      item
                      direction="row"
                      container
                      justifyContent="space-between"
                    >
                      <Grid item xs={12} sm={6}>
                        <Typography variant="h4" className={styles.side_header}>
                          {`${item.first_name} ${item.last_name}`}
                        </Typography>
                      </Grid>
                      <Grid
                        item
                        container
                        xs={12}
                        sm={6}
                        spacing={2}
                        justify="flex-end"
                      >
                        {/* Delete btn */}
                        <Grid item>
                          <div
                            className={styles.icon}
                            onClick={() => setConfirmDelete(item)}
                          >
                            <img src={DeleteIcon} alt="Remove" />
                          </div>
                        </Grid>
                        {/* Edit btn */}
                        <Grid item>
                          <div
                            className={styles.icon}
                            onClick={() =>
                              props.history.push(
                                `/saved-address/edit-address/${item.id}`
                              )
                            }
                          >
                            <img src={EditIcon} alt="Edit" />
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>
                    <Grid item>{`${item.address_one}`}</Grid>
                    <Grid item>{item.address_two}</Grid>
                    <Grid item>{`${item.city}, ${item.state}`}</Grid>
                    <Grid item>{`${item.country} - ${item.zip_code}`}</Grid>

                    <Grid
                      item
                    >{`Phone: ${item.country_code}-${item.phone}`}</Grid>
                    <Grid item>{item.email}</Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
            <DeleteModal
              open={!!confirmDelete}
              title="Delete Address"
              description={`Are you sure you want to delete this Address ?`}
              handleClose={() => setConfirmDelete(false)}
              handleSubmit={handleDelete}
            />
            {payment && (
              <Grid item container direction="column" xs={12}>
                <PromoCode />
                <PaymentDetails
                  data={payment}
                  btnText={'Proceed to Payment'}
                  handleClick={handleSubmit}
                />
              </Grid>
            )}
          </Grid>
        ) : (
          <LoaderContent />
        )}
      </Grid>
    </React.Fragment>
  );
};

export default SelectDelivery;

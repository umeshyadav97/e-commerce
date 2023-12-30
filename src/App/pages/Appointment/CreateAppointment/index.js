import React, { useState, useEffect } from "react";
import { Breadcrumbs, Grid, Typography } from "@material-ui/core";
import styles from "../appointment.module.css";
import DesignerCard from "./DesignerCard";
import AppointmentForm from "./AppointmentForm";
import { Loader, Toast } from "../../../components";
import { API } from "../../../../api/apiService";
import { connect } from "react-redux";
import moment from "moment/moment";
import { ellipsizeText } from "../../../../utils/textUtils";
import Link from "@material-ui/core/Link";

const CreateAppointment = (props) => {
  const { DesignerId, storeId, OrderItem, OrderID, product_id } =
    (props?.location && props?.location?.state) || {};
  const [storeList, setStoreList] = useState([]);
  const [designerDetails, setDesignerDetails] = useState();
  const OrderDetails = props?.orderDetails;
  const orderId = props?.orderDetails;
  const [orderData, setOrderData] = useState();
  const [loading, setLoading] = useState(false);
  const designerId = OrderDetails
    ? OrderDetails?.designer_info?.designer_id
    : DesignerId;

  const OrderApp = props?.match?.params?.id === OrderDetails?.id ? true : false;

  const ProductID = orderData?.products_list
    ? orderData?.products_list?.map((item) => item.product_id)
    : typeof product_id === "string"
    ? [product_id]
    : product_id;

  const getStoreLocation = async () => {
    setLoading(true);
    try {
      const resp = await API.get(
        `appointments/customer/${designerId}/store-list`
      );
      if (resp.success) {
        const result = resp.data;
        let temp = result.map((item) => ({
          value: item.id,
          label:
            ellipsizeText(item.name, 20) +
            "-" +
            item.address_line_1 +
            ", " +
            item.state +
            ", " +
            item.postal_code,
          id: item.id,
        }));
        temp.unshift({
          label: "Store Location",
          value: 0,
        });
        setStoreList(temp);
      }
    } catch (e) {
      const msg =
        typeof e.data.error?.message === "string"
          ? e.data.error?.message
          : e.data.error?.message[0];
      Toast.showErrorToast(msg || "Error in fetching Store List!");
    }
    setLoading(false);
  };

  const getDesignerDetails = async () => {
    setLoading(true);
    try {
      const resp = await API.get(`appointments/designer/${designerId}`);
      if (resp.success) {
        const result = resp.data;
        setDesignerDetails(result);
      }
    } catch (e) {
      const msg =
        typeof e.data.error?.message === "string"
          ? e.data.error?.message
          : e.data.error?.message[0];
      Toast.showErrorToast(msg || "Error in fetching Store List!");
    }
    setLoading(false);
  };

  const getOrderProductDetails = async () => {
    setLoading(true);
    try {
      const payload = {
        order_id: OrderDetails?.id,
      };
      const resp = await API.post(
        `appointments/customer/${OrderDetails?.designer_info?.designer_id}/order-details`,
        payload
      );
      if (resp.success) {
        const result = resp.data;
        setOrderData(result);
      }
    } catch (e) {
      const msg =
        typeof e.data.error?.message === "string"
          ? e.data.error?.message
          : e.data.error?.message[0];
      Toast.showErrorToast(msg || "Error in fetching Store List!");
    }
    setLoading(false);
  };

  const handleAPIs = async () => {
    await getStoreLocation();
    await getDesignerDetails();
  };

  useEffect(() => {
    if (designerId) {
      handleAPIs();
    }
    // eslint-disable-next-line
  }, [designerId]);

  useEffect(() => {
    if (orderId) {
      getOrderProductDetails();
    }
    // eslint-disable-next-line
  }, [orderId]);

  return (
    <React.Fragment>
      {loading && <Loader />}
      <Grid item className={styles.create_app_grid}>
        <Breadcrumbs aria-label="breadcrumb">
          <Link color="inherit" href="/home">
            <Typography className={styles.Link}>Home</Typography>
          </Link>
          <Link color="inherit">
            <Typography className={styles.Link}>Appointment</Typography>
          </Link>
        </Breadcrumbs>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Grid item>
              <Typography className={styles.header}>
                Request An Appointment
              </Typography>
            </Grid>
            <Grid item>
              <Typography className={styles.grey_content}>
                Provide information to request a walk-in appointment with the
                designer
              </Typography>
            </Grid>
          </Grid>
          {OrderApp ? (
            <Grid item>
              <Grid item>
                <Typography className={styles.header}>
                  Order Id #{orderData?.order_details?.order_number}
                </Typography>
              </Grid>
              <Grid item>
                <Typography className={styles.grey_content}>
                  {moment
                    .utc(orderData?.order_details?.created_at)
                    .local()
                    .format("MMM DD, YYYY")}
                  |
                  {moment
                    .utc(orderData?.order_details?.created_at, "HH:mm")
                    .local()
                    .format("hh:mm A")}
                </Typography>
              </Grid>
            </Grid>
          ) : null}
        </Grid>
        <Grid container spacing={3} style={{ marginTop: "24px" }}>
          <Grid item xs={12} md={4}>
            <DesignerCard designerDetails={designerDetails} />
          </Grid>
          <Grid item xs={12} md={8}>
            <AppointmentForm
              {...props}
              storeList={storeList}
              productDetails={props?.productDetails?.data}
              designerId={designerId}
              orderData={orderData}
              orderId={OrderDetails?.id}
              OrderApp={OrderApp}
              StoreId={storeId}
              OrderItem={OrderItem}
              OrderID={OrderID}
              ProductID={ProductID}
            />
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

const mapStateToProps = ({ auth: { orderDetails } }) => ({
  orderDetails,
});
export default connect(mapStateToProps, null)(CreateAppointment);

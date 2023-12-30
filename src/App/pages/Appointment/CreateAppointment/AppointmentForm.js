import { Grid, Typography } from "@material-ui/core";
import React from "react";
import {
  InputField,
  PrimaryButton,
  SelectSearch,
  Toast,
} from "../../../components";
import InputFieldHeading from "../../../components/Form/InputFieldHeading";
import styles from "../appointment.module.css";
import Add from "../../../assets/icons/pink-add.svg";
import Placeholder from "../../../assets/icons/ProfilePlaceholder.svg";
import AddProduct from "./AddProduct";
import { useState } from "react";
import DateRange from "../Calender/DateRange";
import { API } from "../../../../api/apiService";
import { useHistory } from "react-router";
import CrossIcon from "../../../assets/icons/cross_icon.svg";
import { getOrdertDetail } from "../../../../redux/actions/authActions";
import { connect } from "react-redux";

const defaultFilter = {
  store: 0,
  appointmentDate: null,
  startTime: null,
  endTime: null,
  agenda: "",
  message: "",
};

const AppointmentForm = ({
  storeList,
  productDetails,
  designerId,
  orderData,
  orderId,
  props,
  OrderApp,
  OrderItem,
  StoreId,
  OrderID,
  ProductID,
}) => {
  const history = useHistory();
  const [customModal, setCustomModal] = useState(false);
  const [productIds, setProductIds] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [filter, setFilter] = useState(defaultFilter);
  const [creating, setCreating] = useState(false);
  const [val, setVal] = useState(false);

  const handleOpenModal = () => {
    setCustomModal(!customModal);
  };

  const handleChange = (key) => (event) => {
    let tempData = { ...filter };
    if (key === "store") {
      tempData[key] = event;
    } else {
      tempData[key] = event.target.value;
    }
    setFilter(tempData);
  };

  const handleCreateAppointment = async () => {
    if (!creating) {
      if (filter?.agenda.length === 0 || filter?.agenda.length === "") {
        setVal(true);
      } else {
        try {
          let OrderIds = [...selectedIds];
          orderData?.products_list?.forEach((item) => {
            OrderIds.push(item.product_id);
          });
          let OrderDetailsIds = [...selectedIds];
          OrderItem?.forEach((item) => {
            item.item_info
              ? OrderDetailsIds.push(item.item_info.product)
              : OrderDetailsIds.push(item.product_id);
          });
          setCreating(true);
          let order_id = orderId ? orderId : null;
          const payload = {
            store: filter.store !== 0 ? filter.store : StoreId,
            meeting_agenda: filter?.agenda,
            message: filter?.message,
            appointment_date: filter?.appointmentDate,
            start_time: filter?.startTime,
            end_time: filter?.endTime,
            products: OrderDetailsIds,
          };
          const payload_1 = {
            store: filter.store !== 0 ? filter.store : StoreId,
            meeting_agenda: filter?.agenda,
            message: filter?.message,
            appointment_date: filter?.appointmentDate,
            start_time: filter?.startTime,
            end_time: filter?.endTime,
            products: OrderIds,
            order_id,
          };
          const payload_2 = {
            store: filter.store !== 0 ? filter.store : StoreId,
            meeting_agenda: filter?.agenda,
            message: filter?.message,
            appointment_date: filter?.appointmentDate,
            start_time: filter?.startTime,
            end_time: filter?.endTime,
            products: OrderDetailsIds,
            order_id: OrderID,
          };
          const resp = await API.post(
            `appointments/create`,
            orderId ? payload_1 : OrderID ? payload_2 : payload
          );
          if (resp.success) {
            Toast.showSuccessToast("Appointment Created Successfully!");
            history.replace(`/appointment-overview/${resp?.data?.id}`);
            props.getOrdertDetail(null);
            setSelectedIds([]);
          }
        } catch (e) {
          if (e?.data?.error) {
            const msg =
              typeof e.data?.error?.message === "string"
                ? e.data.error?.message
                : e.data.error?.message[0];
            Toast.showErrorToast(msg || "Error in Creating an Appointment!");
          }
        } finally {
          setCreating(false);
        }
      }
    }
  };

  const handleFileCross = (index) => {
    const selectedId = [...selectedIds];
    selectedId.splice(index, 1);
    setSelectedIds(selectedId);
    const addProducts = [...productIds];
    addProducts.splice(index, 1);
    setProductIds(addProducts);
  };

  return (
    <React.Fragment>
      <Grid item xs={12}>
        <Grid container xs={12} spacing={1}>
          <Grid item xs={12} sm={5} md={4} lg={5}>
            <InputFieldHeading label="Store Location" isMargin={false} />
            <Grid item>
              <SelectSearch
                id="location"
                isSecondary
                items={storeList}
                selectedItems={filter.store !== 0 ? filter.store : StoreId}
                searchEnabled={true}
                searchPlaceholder="Search Store"
                label={
                  filter?.store !== 0
                    ? storeList.map(
                        (store) => store.id === filter.store && store.label
                      )
                    : StoreId
                    ? storeList.map(
                        (store) => store.id === StoreId && store.label
                      )
                    : "Select Store"
                }
                onSelect={handleChange("store")}
                Showcount={true}
                LabelClass={styles.Multiselectlabel}
                SlectItemcls={styles.MultiSelectListItems}
                MultiSelectCss={styles.MultiselectDesigner}
                isDesigner={true}
                ShowValue={true}
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid xs={12} sm={7} md={8} lg={7} style={{ marginTop: "-16px" }}>
            <DateRange
              filter={filter}
              setFilter={setFilter}
              storeId={filter.store !== 0 ? filter.store : StoreId}
            />
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <InputFieldHeading label="How can I help You?" />
          <InputField
            id="agenda"
            type="agenda"
            placeholder="Enter your meeting title"
            variant="outlined"
            fullWidth
            value={filter?.agenda}
            onChange={handleChange("agenda")}
            onInput={(event) => {
              if (event.target.value?.length > 40) {
                event.target.value = event.target.value.slice(0, 40);
              }
            }}
          />
          <Grid container justifyContent="space-between">
            <Grid item xs={10} className={styles.validation}>
              {val && filter?.agenda?.length === 0 && "This field is required!"}
            </Grid>
            <span
              className={styles.grey_limit}
              style={{ display: "flex", justifyContent: "flex-end" }}
            >
              {filter?.agenda ? filter?.agenda.length : 0}/40
            </span>
          </Grid>
        </Grid>
        <Grid item>
          <InputFieldHeading label="Message" isMargin={false} />
          <InputField
            id="message"
            type="message"
            placeholder="Any additional details"
            variant="outlined"
            fullWidth
            multiline
            rows={6}
            value={filter?.message}
            onChange={handleChange("message")}
            onInput={(event) => {
              if (event.target.value?.length > 200) {
                event.target.value = event.target.value.slice(0, 200);
              }
            }}
          />
          <span className={styles.grey_limit}>
            {filter?.message ? filter?.message.length : 0}/200
          </span>
        </Grid>
        <Grid container>
          <img
            src={Add}
            alt="add"
            onClick={handleOpenModal}
            style={{ cursor: "pointer", marginRight: "10px" }}
          />
          <Typography
            className={styles.pink_content}
            onClick={handleOpenModal}
            style={{ cursor: "pointer" }}
          >
            Add Product
          </Typography>
        </Grid>

        <Grid
          container
          spacing={2}
          style={{ margin: "24px 0px 0px", justifyContent: "space-between" }}
        >
          {OrderItem ? (
            <>
              {OrderItem?.map((pro, index) => (
                <>
                  {pro?.item_info ? (
                    <Grid
                      container
                      justifyContent="space-between"
                      xs={12}
                      sm={6}
                      md={6}
                      className={styles.product_grid}
                      key={index}
                      style={{ marginBottom: "2%" }}
                    >
                      <img
                        src={
                          pro?.item_info?.product_details?.cover_image_url ||
                          Placeholder
                        }
                        alt="profile"
                        className={styles.product_img}
                      />
                      <Grid item xs={9}>
                        <Grid item>
                          <Typography className={styles.product_title}>
                            {pro?.item_info?.product_details?.title}
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          style={
                            pro?.item_info?.product_details?.is_custom === true
                              ? {
                                  backgroundColor: "#FBE1E1",
                                  width: "fit-content",
                                }
                              : {
                                  backgroundColor: "#A0BEFF",
                                  width: "fit-content",
                                }
                          }
                          className={styles.type}
                        >
                          <Typography
                            style={
                              pro?.item_info?.product_details?.is_custom ===
                              true
                                ? { color: "#FC68A2", width: "fit-content" }
                                : { color: "#363676", width: "fit-content" }
                            }
                            className={styles.type_name}
                          >
                            {pro?.item_info?.product_details?.is_custom === true
                              ? `Custom`
                              : `RTW`}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  ) : (
                    <Grid
                      container
                      justifyContent="space-between"
                      xs={12}
                      sm={6}
                      md={6}
                      className={styles.product_grid}
                      key={index}
                      style={{ marginBottom: "2%" }}
                    >
                      <img
                        src={pro?.cover_image_url || Placeholder}
                        alt="profile"
                        className={styles.product_img}
                      />
                      <Grid item xs={9}>
                        <Grid item>
                          <Typography className={styles.product_title}>
                            {pro?.product}
                          </Typography>
                        </Grid>
                        <Grid
                          item
                          style={
                            pro?.is_custom_product === true
                              ? {
                                  backgroundColor: "#FBE1E1",
                                  width: "fit-content",
                                }
                              : {
                                  backgroundColor: "#A0BEFF",
                                  width: "fit-content",
                                }
                          }
                          className={styles.type}
                        >
                          <Typography
                            style={
                              pro?.is_custom_product === true
                                ? { color: "#FC68A2", width: "fit-content" }
                                : { color: "#363676", width: "fit-content" }
                            }
                            className={styles.type_name}
                          >
                            {pro?.is_custom_product === true ? `Custom` : `RTW`}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}
                </>
              ))}
            </>
          ) : OrderApp ? (
            <>
              {orderData?.products_list.map((pro, index) => (
                <Grid
                  container
                  justifyContent="space-between"
                  xs={12}
                  sm={6}
                  md={6}
                  className={styles.product_grid}
                  key={index}
                  style={{ marginBottom: "2%" }}
                >
                  <img
                    src={pro?.cover_image_url || Placeholder}
                    alt="profile"
                    className={styles.product_img}
                  />
                  <Grid item xs={9}>
                    <Grid item>
                      <Typography className={styles.product_title}>
                        {pro?.title}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      style={
                        pro?.type === "Custom"
                          ? {
                              backgroundColor: "#FBE1E1",
                              width: "fit-content",
                            }
                          : {
                              backgroundColor: "#A0BEFF",
                              width: "fit-content",
                            }
                      }
                      className={styles.type}
                    >
                      <Typography
                        style={
                          pro?.type === "Custom"
                            ? { color: "#FC68A2", width: "fit-content" }
                            : { color: "#363676", width: "fit-content" }
                        }
                        className={styles.type_name}
                      >
                        {pro?.type === "Custom" ? `Custom` : `RTW`}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </>
          ) : (
            <Grid
              container
              justifyContent="space-between"
              xs={12}
              sm={6}
              md={6}
              className={styles.product_grid}
              style={{ marginBottom: "2%" }}
            >
              <img
                src={productDetails?.cover_image_url || Placeholder}
                alt="profile"
                className={styles.product_img}
              />
              <Grid item xs={9}>
                <Grid item>
                  <Typography className={styles.product_title}>
                    {productDetails?.title}
                  </Typography>
                </Grid>
                <Grid
                  item
                  style={
                    productDetails?.is_custom_product === "true"
                      ? { backgroundColor: "#FBE1E1", width: "fit-content" }
                      : { backgroundColor: "#A0BEFF", width: "fit-content" }
                  }
                  className={styles.type}
                >
                  <Typography
                    style={
                      productDetails?.is_custom_product === "true"
                        ? { color: "#FC68A2", width: "fit-content" }
                        : { color: "#363676", width: "fit-content" }
                    }
                    className={styles.type_name}
                  >
                    {productDetails?.is_custom_product === "true"
                      ? `Custom`
                      : `RTW`}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          )}
          {productIds.map((pro, index) => (
            <Grid
              container
              justifyContent="space-between"
              xs={12}
              sm={6}
              md={6}
              className={styles.product_grid_1}
              key={index}
              style={{ marginBottom: "2%" }}
            >
              <img
                src={pro?.cover_image_url || Placeholder}
                alt="profile"
                className={styles.product_img}
              />
              <Grid item xs={9}>
                <Grid item>
                  <Typography className={styles.product_title}>
                    {pro?.title?.length > 15
                      ? `${pro?.title.slice(0, 15)}...`
                      : pro?.title}
                  </Typography>
                </Grid>
                <Grid
                  item
                  style={
                    pro?.type === "Custom"
                      ? { backgroundColor: "#FBE1E1", width: "fit-content" }
                      : { backgroundColor: "#A0BEFF", width: "fit-content" }
                  }
                  className={styles.type}
                >
                  <Typography
                    style={
                      pro?.type === "Custom"
                        ? { color: "#FC68A2", width: "fit-content" }
                        : { color: "#363676", width: "fit-content" }
                    }
                    className={styles.type_name}
                  >
                    {pro?.type === "Custom" ? `Custom` : `RTW`}
                  </Typography>
                </Grid>
              </Grid>
              <span className={styles.cross}>
                <img
                  style={{ cursor: "pointer" }}
                  onClick={() => handleFileCross(index)}
                  src={CrossIcon}
                  alt="i"
                />
              </span>
            </Grid>
          ))}
        </Grid>

        <Grid
          item
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "10px",
          }}
        >
          <PrimaryButton
            style={{ minWidth: "288px" }}
            onClick={() => handleCreateAppointment()}
          >
            Request Appointment
          </PrimaryButton>
        </Grid>
      </Grid>
      <AddProduct
        title="Add Product"
        open={customModal}
        handleClose={handleOpenModal}
        designerId={designerId}
        setProductIds={setProductIds}
        setSelectedIds={setSelectedIds}
        ProductID={ProductID}
        {...props}
      />
    </React.Fragment>
  );
};

const mapDispatchToProps = (dispatch) => ({
  getOrdertDetail: () => dispatch(getOrdertDetail()),
});

export default connect(null, mapDispatchToProps)(AppointmentForm);

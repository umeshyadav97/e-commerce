import { Grid, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import styles from "../appointment.module.css";
import GreenTick from "../../../assets/icons/green-tick.svg";
import SimilarProductCarousal from "../../ProductListing/components/SimilarProductCarousal";
import Placeholder from "../../../assets/icons/ProfilePlaceholder.svg";
import { ENDPOINTS } from "../../../../api/apiRoutes";
import { API } from "../../../../api/apiService";
import { Loader, Toast } from "../../../components";
import moment from "moment/moment";
import { capitalizeStr } from "../../../../utils/textUtils";

const AppointmentSuccess = (props) => {
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState([]);

  const fetchAppointmentDetails = async () => {
    setLoading(true);
    const query = `${ENDPOINTS.DETAILS}${props?.match?.params?.id}/details`;
    const resp = await API.get(query, {});
    if (resp.success) {
      const result = resp.data;
      setRecord(result);
    } else {
      Toast.showErrorToast(
        resp.message?.[0] || `Error in fetching Appointment Details`
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAppointmentDetails();
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <React.Fragment>
      {loading && <Loader />}
      <Grid item className={styles.success_app_grid}>
        <Grid item>
          <Grid item style={{ display: "flex", justifyContent: "center" }}>
            <img src={GreenTick} alt="success" />
          </Grid>
          <Grid item>
            <Typography
              className={styles.header}
              style={{ textAlign: "center" }}
            >
              Congratulations!
            </Typography>
          </Grid>
          <Grid item>
            <Typography className={styles.success_content}>
              Your booking Request has been sent to designer
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={3} style={{ marginTop: "24px" }}>
          <Grid item xs={12} md={6}>
            <Typography
              className={styles.success_boldcontent}
              style={{ marginBottom: "10px" }}
            >
              With
            </Typography>
            <Grid item className={styles.detail_success_grid}>
              <Grid container>
                <Grid item xs={12} sm={3} md={4} lg={3}>
                  <img
                    src={
                      record?.designer_details?.profile_picture || Placeholder
                    }
                    alt="profile"
                    className={styles.designer_img}
                  />
                </Grid>
                <Grid item xs={12} sm={9} md={8} lg={9}>
                  <Grid item>
                    <Typography className={styles.header}>
                      {capitalizeStr(record?.designer)}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography className={styles.sub_header}>
                      {record?.designer_details?.brand_name}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item style={{ marginTop: "8px" }}>
                <Grid container xs={12}>
                  <Typography className={styles.header_1}>
                    Location:{" "}
                    <span className={styles.success_text}>
                      {record?.designer_details?.address_line_1 +
                        ", " +
                        record?.designer_details?.city +
                        ", " +
                        record?.designer_details?.state +
                        ", " +
                        record?.designer_details?.postal_code}
                    </span>
                  </Typography>
                </Grid>
              </Grid>
              <Grid container style={{ marginTop: "16px" }}>
                <Grid item style={{ marginRight: "16px" }}>
                  <Grid
                    item
                    style={{
                      borderRight: "1px solid #DFE7F5",
                      paddingRight: "16px",
                    }}
                  >
                    <Grid item>
                      <Typography className={styles.content}>
                        Total Products
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Typography className={styles.header}>
                        {
                          record?.designer_details?.product_summary
                            ?.total_products
                        }
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid
                  item
                  style={{
                    borderRight: "1px solid #DFE7F5",
                    marginRight: "16px",
                  }}
                >
                  <Grid item style={{ paddingRight: "16px" }}>
                    <Grid item>
                      <Typography className={styles.content}>
                        Custom Products
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Typography className={styles.header}>
                        {
                          record?.designer_details?.product_summary
                            ?.custom_products
                        }
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item style={{ marginRight: "16px" }}>
                  <Grid item style={{ paddingRight: "16px" }}>
                    <Grid item>
                      <Typography className={styles.content}>
                        Ready To Wear{" "}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      style={{ display: "flex", justifyContent: "center" }}
                    >
                      <Typography className={styles.header}>
                        {
                          record?.designer_details?.product_summary
                            ?.rtw_products
                        }
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography
              className={styles.success_boldcontent}
              style={{ marginBottom: "10px" }}
            >
              Store Info
            </Typography>
            <Grid item className={styles.detail_success_grid}>
              <Grid container justifyContent="space-between">
                <Grid item>
                  <Grid item>
                    <Typography className={styles.header}>
                      {moment
                        .utc(record?.meeting_list?.[0]?.start_time, "HH:mm")
                        .local()
                        .format("hh:mm A")}{" "}
                      -{" "}
                      {moment
                        .utc(record?.meeting_list?.[0]?.end_time, "HH:mm")
                        .local()
                        .format("hh:mm A")}
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography className={styles.app_date}>
                      {record?.meeting_list?.[0]?.day}{" "}
                      {moment
                        .utc(record?.meeting_list?.[0]?.reschedule_date)
                        .local()
                        .format("MMM DD, YYYY")}
                    </Typography>
                  </Grid>
                </Grid>
                {record?.order_id !== "NA" && (
                  <Grid item>
                    <Typography className={styles.header}>
                      Order Id #{record?.order_id}
                    </Typography>
                  </Grid>
                )}
              </Grid>
              <Grid className={styles.divider} />
              <Grid item>
                <Grid item style={{ marginBottom: "16px" }}>
                  <Typography className={styles.header_1}>
                    Store Name:{" "}
                    <span className={styles.success_text}>{record?.store}</span>
                  </Typography>
                </Grid>
                <Grid item style={{ marginBottom: "16px" }}>
                  <Typography className={styles.header_1}>
                    Store Location:{" "}
                    <span className={styles.success_text}>
                      {record?.store_address?.address_line_1 +
                        ", " +
                        record?.store_address?.city +
                        ", " +
                        record?.store_address?.state +
                        ", " +
                        record?.store_address?.postal_code}
                    </span>
                  </Typography>
                </Grid>
                <Grid item style={{ marginBottom: "16px" }}>
                  <Typography className={styles.header_1}>
                    Store Email:{" "}
                    <span className={styles.success_text}>
                      {record?.store_email}
                    </span>
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Grid container spacing={3} justifyContent="space-between">
            <Grid item>
              <Typography className={styles.success_boldcontent}>
                Product
              </Typography>
            </Grid>
            <Grid item>
              <Typography
                className={styles.pink_boldcontent}
                style={{ cursor: "pointer" }}
                onClick={() =>
                  props.history.push(
                    `/designers/${record?.designer_details?.id}`
                  )
                }
              >
                View All
              </Typography>
            </Grid>
          </Grid>
          <Grid
            container
            style={{
              border: "1px solid #dfe7f5",
              padding: "20px",
              borderRadius: "8px",
              marginTop: "10px",
            }}
          >
            {record?.product_list?.map((pro, index) => (
              <Grid
                container
                justifyContent="space-between"
                xs={12}
                sm={4}
                lg={3}
                key={index}
                style={{
                  marginBottom: "10px",
                  border: "1px solid rgb(223, 231, 245)",
                  borderRadius: "4px",
                  padding: "10px",
                  marginRight: "10px",
                }}
              >
                <img
                  src={pro?.cover_image_url || Placeholder}
                  alt="product"
                  className={styles.product_img}
                />
                <Grid item xs={8} md={9} lg={8}>
                  <Grid item>
                    <Typography>{pro?.product_name}</Typography>
                  </Grid>
                  <Grid
                    item
                    style={
                      pro?.product_type === "CUSTOM"
                        ? { backgroundColor: "#FBE1E1", width: "fit-content" }
                        : { backgroundColor: "#A0BEFF", width: "fit-content" }
                    }
                    className={styles.type}
                  >
                    <Typography
                      style={
                        pro?.product_type === "CUSTOM"
                          ? { color: "#FC68A2", width: "fit-content" }
                          : { color: "#363676", width: "fit-content" }
                      }
                      className={styles.type_name}
                    >
                      {pro?.product_type === "CUSTOM" ? `Custom` : `RTW`}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
        {record.length !== 0 && (
          <SimilarProductCarousal
            product_id={record?.products?.[0]}
            history={props.history}
            parentCategoryId={props?.productDetails?.data?.parent_category}
            parentCategoryTitle={props?.productDetails?.data?.category}
          />
        )}
      </Grid>
    </React.Fragment>
  );
};

export default AppointmentSuccess;

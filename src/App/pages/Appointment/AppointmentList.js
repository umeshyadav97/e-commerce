import { Box, Button, Grid, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { Loader, Toast } from "../../components";
import styles from "./appointment.module.css";
import Reschedule from "../../assets/icons/reschedule-clock.svg";
import { ENDPOINTS } from "../../../api/apiRoutes";
import { API } from "../../../api/apiService";
import { Pagination } from "@material-ui/lab";
import CancelWarning from "./Cancel&Reschedule/CancelWarning";
import NoAppointment from "../../assets/icons/no-appointment.svg";
import RescheduleAppointment from "./Cancel&Reschedule/RescheduleAppointment";
import moment from "moment/moment";
import { capitalizeStr } from "../../../utils/textUtils";

const queryBuilder = (url, options) => {
  if (options === undefined || !options) return url;
  return `${url}?${options.status === "pending" ? "status=PENDING" : ""}${
    options.status === "upcoming" ? "status=UPCOMING" : ""
  }${options.status === "completed" ? "status=COMPLETED" : ""}${
    options.status === "rejected" ? "status=REJECTED" : ""
  }&page_size=${options.page_size}${
    options.page ? `&page=${options.page}` : ""
  }`;
};

const AppointmentList = (props) => {
  let location = "upcoming";
  let pathName = props.location.pathname;
  pathName = pathName.substring(pathName.lastIndexOf("/") + 1);
  if (pathName === "appointment") {
    location = "upcoming";
  } else {
    location = pathName;
  }
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState([]);
  const [filter, setFilter] = useState({
    status: location,
    page: 1,
    page_size: 10,
  });
  const [cancelModal, setCancelModal] = useState(false);
  const [rescheduleModal, setRescheduleModal] = useState(false);
  const [appointmentId, setAppointmentId] = useState();
  const [designerId, setDesignerId] = useState();
  const [storeList, setStoreList] = useState([]);
  const [prevStore, setPrevStore] = useState();

  const handleOpenModal = (Store) => {
    setCancelModal(true);
    setPrevStore(Store);
  };

  const handlecloseModal = () => {
    setCancelModal(false);
  };

  const handleRescheduleModal = (DesignerId, Store) => {
    setRescheduleModal(!rescheduleModal);
    setDesignerId(DesignerId);
    setPrevStore(Store);
  };

  const handleIds = (AppId, DesignerId) => {
    setAppointmentId(AppId);
    setDesignerId(DesignerId);
  };

  const handlePage = (event, value) => {
    let tempData = { ...filter };
    tempData["page"] = value;
    setFilter(tempData);
  };

  const fetchAppointment = async () => {
    setLoading(true);
    const query = queryBuilder(ENDPOINTS.LIST, filter);
    const resp = await API.get(query);
    if (resp.success) {
      const result = resp.data;
      if (result.count === null) {
        let tempData = { ...filter };
        tempData["page"] = tempData["page"] - 1;
        setFilter(tempData);
        return;
      }
      setRecord(result.results);
    } else {
      Toast.showErrorToast(
        resp.message?.[0] || `Error in fetching Appointment List`
      );
    }
    setLoading(false);
  };

  const getStoreLocation = async () => {
    try {
      const resp = await API.get(
        `appointments/customer/${designerId}/store-list`
      );
      if (resp.success) {
        const result = resp.data;
        let temp = result.map((item) => ({
          value: item.id,
          label:
            item.name +
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
  };

  useEffect(() => {
    if (designerId) {
      getStoreLocation();
    }
    // eslint-disable-next-line
  }, [designerId]);

  useEffect(() => {
    fetchAppointment();
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const handleViewAppointmentDetails = (ID) => {
    props.history.push(`/appointment-details/${ID}`);
  };

  return (
    <React.Fragment>
      <Grid item className={styles.app_grid}>
        {loading && <Loader />}
        {record.length > 0 ? (
          <>
            <Box className={styles.Overflow}>
              <Box className={styles.table_header_box}>
                <Grid
                  container
                  className={
                    location === "upcoming"
                      ? styles.table_header
                      : location === "completed"
                      ? styles.table_header_completed
                      : location === "rejected"
                      ? styles.table_header_rejected
                      : styles.table_header
                  }
                >
                  <Grid item>
                    <Typography variant="h5" className={styles.header}>
                      Designer
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h5" className={styles.header}>
                      Store
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h5" className={styles.header}>
                      Order ID
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h5" className={styles.header}>
                      Date
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h5" className={styles.header}>
                      Slot
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h5" className={styles.header}>
                      Product
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h5" className={styles.header}>
                      Meeting Agenda
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h5" className={styles.header}>
                      Appointment
                    </Typography>
                  </Grid>
                  {location !== "completed" ? (
                    <Grid item>
                      <Typography variant="h5" className={styles.header}>
                        {location === "rejected" ? "Status" : ""}
                      </Typography>
                    </Grid>
                  ) : null}
                </Grid>
              </Box>
              {record?.map((item, index) => (
                <Box
                  key={index}
                  className={styles.table_cell_box}
                  onClick={() => handleIds(item.id, item.designer_id)}
                >
                  <Grid
                    container
                    className={
                      location === "upcoming"
                        ? styles.tablecell
                        : location === "completed"
                        ? styles.tablecell_completed
                        : location === "rejected"
                        ? styles.tablecell_rejected
                        : styles.tablecell
                    }
                  >
                    <Grid
                      item
                      onClick={() => handleViewAppointmentDetails(item.id)}
                    >
                      <Typography variant="h5" className={styles.content}>
                        {capitalizeStr(item?.designer)}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      onClick={() => handleViewAppointmentDetails(item.id)}
                    >
                      <Typography variant="h5" className={styles.content}>
                        {item?.store}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      onClick={() => handleViewAppointmentDetails(item.id)}
                    >
                      <Typography variant="h5" className={styles.content}>
                        {item?.order_id !== "NA" ? `#${item?.order_id}` : "NA"}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      onClick={() => handleViewAppointmentDetails(item.id)}
                    >
                      <Typography variant="h5" className={styles.content}>
                        {moment
                          .utc(item?.appointment_date)
                          .local()
                          .format("MMM DD, YYYY")}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      onClick={() => handleViewAppointmentDetails(item.id)}
                    >
                      <Typography variant="h5" className={styles.content}>
                        {moment
                          .utc(item?.start_time, "HH:mm")
                          .local()
                          .format("hh:mm A")}
                        -
                        {moment
                          .utc(item?.end_time, "HH:mm")
                          .local()
                          .format("hh:mm A")}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      onClick={() => handleViewAppointmentDetails(item.id)}
                    >
                      <Typography variant="h5" className={styles.content}>
                        {item?.products}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      onClick={() => handleViewAppointmentDetails(item.id)}
                    >
                      <Typography variant="h5" className={styles.content}>
                        {item?.meeting_agenda || "-"}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      onClick={() => handleViewAppointmentDetails(item.id)}
                    >
                      <Typography variant="h5" className={styles.app_no}>
                        {item?.appointments}
                      </Typography>
                    </Grid>
                    {location !== "completed" ? (
                      <Grid container justifyContent="space-between">
                        {location === "upcoming" ? (
                          <>
                            <Button
                              className={styles.cancel_btn}
                              onClick={() => handleOpenModal(item.store_id)}
                            >
                              Cancel
                            </Button>
                            <img
                              src={Reschedule}
                              alt="pending"
                              onClick={() =>
                                handleRescheduleModal(
                                  item.designer_id,
                                  item.store_id
                                )
                              }
                            />
                          </>
                        ) : location === "rejected" ? (
                          <div
                            className={
                              item?.status === "DECLINED"
                                ? styles.rejected
                                : styles.cancelled
                            }
                          >
                            <Typography
                              variant="h5"
                              className={
                                item?.status === "DECLINED"
                                  ? styles.rejected_txt
                                  : styles.cancelled_txt
                              }
                              onClick={() =>
                                handleViewAppointmentDetails(item.id)
                              }
                            >
                              {item?.status === "DECLINED"
                                ? "Cancelled"
                                : "Rejected"}
                            </Typography>
                          </div>
                        ) : location === "pending" ? (
                          <>
                            <Button
                              className={styles.cancel_btn}
                              onClick={() => handleOpenModal(item.store_id)}
                            >
                              Cancel
                            </Button>
                            <img
                              src={Reschedule}
                              alt="pending"
                              onClick={() =>
                                handleRescheduleModal(
                                  item.designer_id,
                                  item?.store_id
                                )
                              }
                            />
                          </>
                        ) : null}
                      </Grid>
                    ) : null}
                  </Grid>
                </Box>
              ))}
            </Box>
            <Box pt={2}>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Pagination
                    color="secondary"
                    shape="rounded"
                    count={Math.ceil(record?.length / 10)}
                    page={filter?.page}
                    onChange={handlePage}
                  />
                </Grid>
              </Grid>
            </Box>
          </>
        ) : (
          <>
            <Box style={{ display: "flex", justifyContent: "center" }}>
              <img src={NoAppointment} alt="No Appointment" />
            </Box>
          </>
        )}
      </Grid>
      <CancelWarning
        title="Cancel Appointment"
        open={cancelModal}
        handleClose={handlecloseModal}
        ID={appointmentId}
        storeList={storeList}
        DesignerId={designerId}
        storeId={prevStore}
        fetchAppointment={fetchAppointment}
        {...props}
      />
      <RescheduleAppointment
        header="Reschedule Request"
        openModal={rescheduleModal}
        handleRescheduleModal={handleRescheduleModal}
        id={appointmentId}
        DesignerId={designerId}
        storeList={storeList}
        storeId={prevStore}
        fetchAppointment={fetchAppointment}
        {...props}
      />
    </React.Fragment>
  );
};

export default AppointmentList;

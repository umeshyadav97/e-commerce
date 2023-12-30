import {
  Button,
  Grid,
  makeStyles,
  Step,
  StepConnector,
  StepLabel,
  Stepper,
  Typography,
  withStyles,
} from "@material-ui/core";
import React from "react";
import styles from "../appointment.module.css";
import Reschedule from "../../../assets/icons/reschedule-clock.svg";
import Placeholder from "../../../assets/icons/ProfilePlaceholder.svg";
import clsx from "clsx";
import CompleteIcon from "../../../assets/icons/stepper-complete.svg";
import InCompleteIcon from "../../../assets/icons/stepper-incomplete.svg";
import { useState } from "react";
import { API, ENDPOINTS } from "../../../../api/apiService";
import { Loader, PrimaryButton, Toast } from "../../../components";
import { useEffect } from "react";
import { capitalize, capitalizeStr } from "../../../../utils/textUtils";
import CancelWarning from "../Cancel&Reschedule/CancelWarning";
import RescheduleAppointment from "../Cancel&Reschedule/RescheduleAppointment";
import moment from "moment/moment";
import ScheduleFollowUp from "../Cancel&Reschedule/ScheduleFollowUp";

const AppointmentDetails = (props) => {
  const ID = props.match.params.id;
  const classes = useStyles();
  const [loading, setLoading] = useState(false);
  const [record, setRecord] = useState([]);
  const [cancelModal, setCancelModal] = useState(false);
  const [rescheduleModal, setRescheduleModal] = useState(false);
  const [appointmentId, setAppointmentId] = useState();
  const [designerId, setDesignerId] = useState();
  const [storeList, setStoreList] = useState([]);
  const [update, setUpdate] = useState();
  const [activeStep, setActiveStep] = useState(0);
  const [isReadMore, setIsReadMore] = useState(true);
  const [isViewAll, setIsViewAll] = useState(0);
  const [followUp, setFollowUp] = useState(false);

  const handelFollowUp = (DesignerId) => {
    setFollowUp(!followUp);
    setDesignerId(DesignerId);
  };

  const toggleReadMore = () => {
    setIsReadMore(!isReadMore);
  };

  const toggleViewAll = (id) => {
    setIsViewAll(id);
  };

  const toggleViewLess = () => {
    setIsViewAll(0);
  };

  const handleOpenModal = () => {
    setCancelModal(true);
  };

  const handlecloseModal = () => {
    setCancelModal(false);
  };

  const handleRescheduleModal = () => {
    setRescheduleModal(!rescheduleModal);
  };

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
    setLoading(false);
  };

  useEffect(() => {
    if (designerId) {
      getStoreLocation();
    }
    // eslint-disable-next-line
  }, [designerId]);

  const fetchAppointmentDetails = async () => {
    setLoading(true);
    const query = `${ENDPOINTS.DETAILS}${ID}/details`;
    const resp = await API.get(query, {});
    if (resp.success) {
      const result = resp.data;
      result?.meeting_list.forEach((item) => {
        if (item?.status === "PENDING") {
          setActiveStep(item?.meeting_number - result?.meeting_list.length);
        }
        if (item?.status === "UPCOMING") {
          setActiveStep(item?.meeting_number - result?.meeting_list.length);
        }
        if (result?.status === "COMPLETED") {
          setActiveStep(-1);
        }
      });
      setRecord(result);
      setAppointmentId(resp.data?.id);
      setDesignerId(resp.data?.designer_id);
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
  }, [update]);

  return (
    <React.Fragment>
      {loading && <Loader />}
      <Grid item className={styles.app_grid}>
        <Grid item>
          <span
            onClick={() => props.history.goBack()}
            className={styles.pink_txt}
          >
            Back to Appointments
          </span>
        </Grid>
        <Grid container justifyContent="space-between">
          <Grid container xs={12} md={9}>
            <Grid item>
              <Typography className={styles.header}>
                {capitalizeStr(record?.designer)}
              </Typography>
            </Grid>
            <div
              style={{
                borderLeft: "2px solid #dfe7f5",
                height: "22px",
                alignSelf: "center",
                margin: "0 18px",
              }}
            />
            <Grid item style={{ alignSelf: "center", marginRight: "40px" }}>
              <Typography className={styles.txt}>
                Appointment: {record?.appointments}
              </Typography>
            </Grid>
            <Grid item style={{ alignSelf: "center" }}>
              <Typography
                className={styles.status}
                style={
                  record?.status === "PENDING"
                    ? { backgroundColor: "#FDF0C6", color: "#D18F2C" }
                    : record?.status === "UPCOMING"
                    ? { backgroundColor: "#A0BEFF", color: "#363576" }
                    : record?.status === "DECLINED"
                    ? { backgroundColor: "#FFD5CD", color: "#F36666" }
                    : record?.status === "COMPLETED"
                    ? { backgroundColor: "#DAF9EE", color: "rgb(1, 191, 129)" }
                    : { backgroundColor: "#f4f7fd", color: "#708099" }
                }
              >
                {capitalize(record?.status)}
              </Typography>
            </Grid>
          </Grid>
          {record?.status === "COMPLETED" ||
          record?.status === "CANCELLED" ||
          record?.status === "DECLINED" ? (
            <Grid item xs={12} md={3} className={styles.followUp_btn}>
              <PrimaryButton
                onClick={() => handelFollowUp(record?.designer_id)}
              >
                Schedule Follow-Up
              </PrimaryButton>
            </Grid>
          ) : null}
        </Grid>
        <div className={styles.divider} />
        <Grid item className={styles.detailBox}>
          <Grid
            container
            justifyContent="space-between"
            style={{ marginBottom: "26px" }}
          >
            <Grid item xs={4}>
              <Typography className={styles.sub_header}>Overview</Typography>
            </Grid>
            {record?.status === "PENDING" || record?.status === "UPCOMING" ? (
              <Grid container xs={8} justifyContent="flex-end">
                <Button className={styles.cancel_btn} onClick={handleOpenModal}>
                  Cancel
                </Button>
                <img
                  src={Reschedule}
                  alt="pending"
                  style={{ marginLeft: "10px", cursor: "pointer" }}
                  onClick={handleRescheduleModal}
                />
              </Grid>
            ) : null}
          </Grid>
          <Grid container className={styles.detail_table}>
            <Grid item xs={12} sm={4} md={3} lg={2}>
              <Grid item>
                <Typography variant="h5" className={styles.deatail_header}>
                  Store Name
                </Typography>
              </Grid>
              <Grid item style={{ margin: "5px 0px" }}>
                <Typography variant="h5" className={styles.txt}>
                  {record?.store}
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={4} md={3} lg={2}>
              <Grid item>
                <Typography variant="h5" className={styles.deatail_header}>
                  Order ID
                </Typography>
              </Grid>
              <Grid item style={{ margin: "5px 0px" }}>
                <Typography variant="h5" className={styles.txt}>
                  {record?.order_id !== "NA" ? `#${record?.order_id}` : "NA"}
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={4} md={3} lg={2}>
              <Grid item>
                <Typography variant="h5" className={styles.deatail_header}>
                  Created By
                </Typography>
              </Grid>
              <Grid item style={{ margin: "5px 0px" }}>
                <Typography variant="h5" className={styles.txt}>
                  {capitalizeStr(record?.created_by)}
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={4} md={3} lg={2}>
              <Grid item>
                <Typography variant="h5" className={styles.deatail_header}>
                  Meeting Agenda
                </Typography>
              </Grid>
              <Grid item style={{ margin: "5px 0px" }}>
                <Typography variant="h5" className={styles.txt}>
                  {record?.meeting_agenda}
                </Typography>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={8} md={12} lg={4}>
              <Grid item>
                <Typography variant="h5" className={styles.deatail_header}>
                  Message
                </Typography>
              </Grid>
              <Grid item style={{ margin: "5px 0px" }}>
                <Typography className={styles.txt}>
                  {isReadMore ? record?.message?.slice(0, 32) : record?.message}
                  {record?.message?.length > 32 && (
                    <span
                      onClick={toggleReadMore}
                      style={{ cursor: "pointer" }}
                      className={styles.header_1}
                    >
                      {isReadMore ? "...read more" : " ...show less"}
                    </span>
                  )}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid item className={styles.detailBox} style={{ marginTop: "20px" }}>
          <Grid item style={{ marginBottom: "26px" }}>
            <Typography className={styles.sub_header}>
              Product Details
            </Typography>
          </Grid>
          <Grid container xs={12}>
            {record?.product_list?.map((product, index) => (
              <Grid
                container
                xs={6}
                sm={6}
                md={4}
                lg={3}
                key={index}
                style={{
                  marginBottom: "10px",
                }}
              >
                <Grid
                  item
                  style={{
                    marginRight: "5%",
                  }}
                >
                  <img
                    src={product?.cover_image_url || Placeholder}
                    alt="product"
                    className={styles.product_img}
                  />
                </Grid>
                <Grid item>
                  <Grid item>
                    <Typography>
                      {" "}
                      {product?.product_name?.length > 20
                        ? `${product?.product_name.slice(0, 20)}...`
                        : product?.product_name}
                    </Typography>
                  </Grid>
                  <Grid
                    item
                    style={
                      product?.product_type !== "READY_TO_WEAR"
                        ? { backgroundColor: "#FBE1E1", width: "fit-content" }
                        : { backgroundColor: "#A0BEFF", width: "fit-content" }
                    }
                    className={styles.type}
                  >
                    <Typography
                      style={
                        product?.product_type !== "READY_TO_WEAR"
                          ? { color: "#FC68A2", width: "fit-content" }
                          : { color: "#363676", width: "fit-content" }
                      }
                      className={styles.type_name}
                    >
                      {product?.product_type === "CUSTOM" ? `Custom` : `RTW`}
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item className={styles.detailBox} style={{ marginTop: "20px" }}>
          <Grid item style={{ marginBottom: "26px" }}>
            <Typography className={styles.sub_header}>Meeting Info</Typography>
          </Grid>
          <Grid
            item
            xs={12}
            md={12}
            sm={12}
            lg={12}
            style={{ marginTop: "24px" }}
          >
            <Stepper
              activeStep={activeStep}
              orientation="vertical"
              connector={<QontoConnector />}
              style={{ paddingLeft: "0px", paddingRight: "10px" }}
            >
              {record?.meeting_list?.map((step, index) => (
                <Step key={index}>
                  <StepLabel StepIconComponent={QontoStepIcon}>
                    <Grid
                      container
                      justifyContent="space-between"
                      style={{ marginTop: "-20px" }}
                    >
                      <Grid item xs={8}>
                        <Typography
                          variant="h4"
                          className={styles.sub_header}
                          style={{
                            color: "#242424",
                          }}
                        >
                          Appointment {step?.meeting_number}
                        </Typography>
                      </Grid>
                      {step?.status !== "PENDING" && (
                        <Grid item xs={2} className={styles.stepper_status}>
                          <Typography
                            className={styles.stepper_status_txt}
                            style={{
                              backgroundColor:
                                step?.status === "COMPLETED"
                                  ? "rgba(1, 191, 129, 0.2)"
                                  : step?.status === "UPCOMING"
                                  ? "#A0BEFF"
                                  : "#F4F7FD",
                              color:
                                step?.status === "COMPLETED"
                                  ? "#01BF81"
                                  : step?.status === "UPCOMING"
                                  ? "#363576"
                                  : "#708099",
                            }}
                          >
                            {capitalize(step?.status)}
                          </Typography>
                        </Grid>
                      )}
                    </Grid>
                  </StepLabel>
                  <div className={classes.stepContent}>
                    <div
                      TransitionProps={{ in: true }}
                      style={{ border: "none !important" }}
                    >
                      {step?.reschedule_date && (
                        <Typography
                          className={styles.txt}
                          style={{
                            color: "#242424",
                          }}
                        >
                          {moment
                            .utc(step?.reschedule_date)
                            .local()
                            .format("MMM DD, YYYY")}
                          |{" "}
                          {moment
                            .utc(step?.start_time, "HH:mm")
                            .local()
                            .format("hh:mm A")}
                          -
                          {moment
                            .utc(step?.end_time, "HH:mm")
                            .local()
                            .format("hh:mm A")}
                        </Typography>
                      )}
                      {step?.status !== "PENDING" &&
                      step?.status !== "UPCOMING" ? (
                        <Typography className={styles.detail_message}>
                          By:{" "}
                          {step?.updated_by
                            ? capitalizeStr(step?.updated_by)
                            : capitalizeStr(step?.created_by)}{" "}
                          {step?.status === "DECLINED"
                            ? null
                            : `| ${moment
                                .utc(
                                  step?.updated_at
                                    ? step?.updated_at
                                    : step?.created_at
                                )
                                .local()
                                .format("MMM DD, YYYY")}`}
                        </Typography>
                      ) : null}
                      {step?.notes && (
                        <Typography className={styles.detail_message}>
                          Notes:{" "}
                          {isViewAll !== step.id
                            ? step?.notes?.slice(0, 70)
                            : step?.notes}
                          {step?.notes?.length > 70 && (
                            <>
                              {isViewAll !== step?.id ? (
                                <span
                                  onClick={() => toggleViewAll(step?.id)}
                                  className={styles.header_1}
                                  style={{ cursor: "pointer" }}
                                >
                                  ...View All
                                </span>
                              ) : (
                                <span
                                  onClick={() => toggleViewLess()}
                                  className={styles.header_1}
                                  style={{ cursor: "pointer" }}
                                >
                                  ...View Less
                                </span>
                              )}
                            </>
                          )}
                        </Typography>
                      )}
                      <Grid container>
                        {step?.image_urls?.map((image,index) => (
                          <Grid
                            item
                            key={index}
                            style={{
                              paddingTop: "2px",
                              paddingBottom: "5px",
                              marginRight: "5px",
                            }}
                          >
                            <img
                              style={{
                                height: "62px",
                                width: "62px",
                                borderRadius: "8px",
                              }}
                              src={image}
                              alt="img"
                            />
                          </Grid>
                        ))}
                      </Grid>
                    </div>
                  </div>
                </Step>
              ))}
            </Stepper>
          </Grid>
        </Grid>
      </Grid>
      <CancelWarning
        title="Cancel Appointment"
        open={cancelModal}
        handleClose={handlecloseModal}
        ID={appointmentId}
        storeList={storeList}
        DesignerId={designerId}
        prevStore={record?.store}
        storeId={record?.store_id}
        setUpdate={setUpdate}
        fetchAppointment={fetchAppointmentDetails}
        {...props}
      />
      <RescheduleAppointment
        header="Reschedule Request"
        openModal={rescheduleModal}
        handleRescheduleModal={handleRescheduleModal}
        id={appointmentId}
        DesignerId={designerId}
        storeList={storeList}
        prevStore={record?.store}
        storeId={record?.store_id}
        setUpdate={setUpdate}
        fetchAppointment={fetchAppointmentDetails}
        {...props}
      />
      <ScheduleFollowUp
        openModal={followUp}
        handleFollowUp={handelFollowUp}
        id={record?.id}
        DesignerId={designerId}
        storeList={storeList}
        storeId={record?.store_id}
        fetchAppointment={fetchAppointmentDetails}
        {...props}
      />
    </React.Fragment>
  );
};

export default AppointmentDetails;

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    "& .MuiStepIcon-active": {
      width: "40px",
      height: "40px",
      marginBottom: "-8px",
    },
    "& .MuiStepIcon-completed": {
      width: "40px",
      height: "40px",
      marginBottom: "-8px",
    },
    "& .MuiStepIcon-root": {
      width: "40px",
      height: "40px",
      marginBottom: "-6px",
    },
    "& .MuiStepConnector-vertical": { marginLeft: "20px", padding: "0px" },
    "& .MuiStep-completed": {
      "& .makeStyles-stepContent-115": {
        borderLeft: "1px solid #FC68A2",
      },
      "& .MuiStepConnector-lineVertical": {
        minHeight: "100px",
        backgroundColor: "#FC68A2",
      },
    },
    "& .MuiStepConnector-active": {
      padding: "0px !important",
      marginLeft: "20px !important",
      "& .MuiStepConnector-line": {
        borderColor: "#FC68A2",
      },
    },
    "& .MuiStepper-root": {
      borderRadius: "0px 0px 20px 20px",
      paddingBottom: "45px",
      marginBottom: "10px",
      marginLeft: "-10px",
    },
    "& .MuiStepConnector-completed": {
      padding: "0px !important",
      marginLeft: "20px !important",
      "& .MuiStepConnector-lineVertical": {
        borderColor: "#FC68A2",
        padding: "0px !important",
      },
    },
    "& .MuiStepConnector-lineVertical": {
      minHeight: "20px",
    },
    "& .MuiStepLabel-label": {
      display: "flex",
      alignItems: "baseline",
      justifyContent: "space-between",
      fontWeight: "400",
      fontFamily: "Inter",
      fontSize: "16px",
      lineHeight: "19px",
    },
    "& .MuiStepLabel-label.MuiStepLabel-active": {
      fontFamily: "Inter",
      fontSize: "16px",
      lineHeight: "19px",
      fontWeight: "600",
    },
  },
  stepContent: {
    marginTop: "-14px",
    marginLeft: "11px",
    paddingLeft: "20px",
    paddingRight: "8px",
    borderLeft: "1px solid #FC68A2",
  },
  stepContentOfTitle: {
    marginTop: "5px",
    marginLeft: "12px",
    paddingLeft: "20px",
    paddingRight: "8px",
    paddingTop: "5px",
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
    backgroundColor: "#FC68A2",
    paddingInline: "30px",
  },
  actionsContainer: {
    marginBottom: theme.spacing(1),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
  paper: {
    borderRadius: "20px",
  },
  bold: {
    fontWeight: "bold",
  },
}));

const QontoConnector = withStyles({
  alternativeLabel: {
    top: 0,
    padding: "0px",
  },
  active: {
    "& $line": {
      borderColor: "#A4B3CC",
      fontWeight: 600,
    },
  },
  completed: {
    "& $line": {
      borderColor: "#A4B3CC",
      fontWeight: 600,
    },
  },
  line: {
    borderColor: "#fc68a2",
    borderTopWidth: 2,
    marginLeft: "-1px",
    borderLeft: "1px solid #A4B3CC",
    marginBottom: "-18px",
  },
})(StepConnector);

const useQontoStepIconStyles = makeStyles({
  root: {
    "& .MuiStepLabel-iconContainer": {
      alignSelf: "baseline",
    },
    color: "#eaeaf0",
    display: "flex",
    height: 50,
    alignItems: "center",
  },
  active: {
    color: "#A4B3CC",
    zIndex: 5,
  },
  circle: {
    width: 16,
    height: 16,
    borderRadius: "50%",
    backgroundColor: "currentColor",
  },
  completed: {
    color: "#A4B3CC",
    zIndex: 5,
    fontSize: 18,
    fontWeight: 600,
    marginTop: "26px",
  },
});

function QontoStepIcon(props) {
  const classes = useQontoStepIconStyles();
  const { active, completed } = props;

  return (
    <div
      className={clsx(classes.root, {
        [classes.active]: active,
      })}
    >
      {completed || active ? (
        <img src={InCompleteIcon} alt="complete" />
      ) : (
        <img src={CompleteIcon} alt="incomplete" />
      )}
    </div>
  );
}

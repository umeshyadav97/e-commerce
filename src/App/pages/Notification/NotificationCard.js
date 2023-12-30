import React, { useState } from "react";
import { Grid, Typography, Avatar } from "@material-ui/core";
import { getFormattedDate } from "../../commonFunction";
import { getTime } from "../../../utils/dateUtils";
import { ellipsizeText } from "../../../utils/textUtils";
import DefaultIcon from "../../assets/icons/Default_Notification_Icon.png";
import styles from "./Notification.module.css";
import { connect } from "react-redux";
import { getNotification } from "../../../redux/actions/authActions";
import OrderIcon from "../../assets/icons/order_notification.svg";
import AppointmentIcon from "../../assets/icons/appointment_notification.svg";
import DiscountIcon from "../../assets/icons/discount_notification.svg";
import CreditIcon from "../../assets/icons/credit.notification.svg";
import AnnouncementIcon from "../../assets/icons/announcement_notification.svg";
import { useHistory } from "react-router-dom";

const NotificationCard = ({
  type,
  notification,
  time,
  altText,
  props,
  ReadRecord,
  id,
  fetchNotificationCount,
  read,
  type_child,
}) => {
  const [hide, setHide] = useState(true);
  const history = useHistory();
  const handleHideText = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setHide(false);
  };

  let customer_name = "";
  const { title, body, image_url, url } = notification;
  if (type !== "CUSTOM_NOTIFICATION") {
    customer_name = notification.customer_name;
  }
  const TIME = `${getFormattedDate(time)} ${getTime(time)}`;

  const openNotification = () => {
    if (type === "APPOINTMENT") {
      history.push(`/appointment-details/${notification.appointment_id}`);
    } else if (type === "ORDER") {
      if (notification?.order_type === "CUSTOMER_TO_DESIGNER") {
        history.push({
          pathname: `/orders/${notification.order_id}`,
          state: {
            id: notification.order_id,
            orderNo: notification.order_id,
          },
        });
      } else {
        history.push({
          pathname: `/orders/instore-order/${notification?.order_id}`,
          state: {
            id: notification.order_id,
            orderNo: notification.order_id,
          },
        });
      }
    } else if (type === "STORE_CREDIT") {
      history.push(`/credit-notes`);
    }
  };

  return (
    <Grid
      container
      className={read ? styles.card_read : styles.card}
      onClick={() => {
        openNotification();
        ReadRecord(id);
        fetchNotificationCount();
      }}
    >
      {type === "CUSTOM_NOTIFICATION" ? (
        <Grid item xs={12}>
          <a
            target="_blank"
            rel="noreferrer"
            href={url ? url : null}
            className={styles.link}
          >
            <Grid container spacing={1}>
              {/* Icon */}
              <Grid item className={styles.AlignCenter}>
                {type !== "CUSTOM_NOTIFICATION" ? (
                  <Avatar
                    variant="rounded"
                    alt={customer_name}
                    src={
                      type === "ORDER"
                        ? OrderIcon
                        : type === "DISCOUNT"
                        ? DiscountIcon
                        : type === "STORE_CREDIT"
                        ? CreditIcon
                        : AppointmentIcon
                    }
                    className={styles.notification_icon}
                  />
                ) : image_url ? (
                  <Avatar
                    variant="rounded"
                    alt={altText}
                    src={image_url}
                    className={styles.notification_icon}
                  />
                ) : (
                  <Avatar
                    variant="rounded"
                    alt={customer_name}
                    src={
                      type_child === "Promotion of Deal / Offer"
                        ? DiscountIcon
                        : type_child === "System Announcements"
                        ? AnnouncementIcon
                        : DefaultIcon
                    }
                    className={styles.notification_icon}
                  />
                )}
              </Grid>
              {/* Content */}
              <Grid item xs={12} sm={12} md={10} lg={10}>
                {/* Title */}
                <Grid item xs={12} lg={12} sm={12} md={12}>
                  <Typography
                    className={read ? styles.title_read : styles.title}
                  >
                    {title}
                  </Typography>
                </Grid>
                {/* Body */}
                <Grid item xs={12} lg={12} sm={12} md={12}>
                  {hide ? (
                    <>
                      <span className={styles.custom_body}>
                        {ellipsizeText(body, 100)}
                      </span>

                      {body.length > 100 && (
                        <span
                          onClick={(e) => handleHideText(e)}
                          className={styles.more_text}
                        >
                          View More
                        </span>
                      )}
                    </>
                  ) : (
                    <span className={styles.custom_body}>{body}</span>
                  )}
                </Grid>
                {/* Time */}
                <Grid item xs={12} lg={12} sm={12} md={12}>
                  <Typography className={styles.date_text}>{TIME}</Typography>
                </Grid>
              </Grid>
            </Grid>
          </a>
        </Grid>
      ) : (
        <>
          {/* Icon */}
          <Grid item className={styles.AlignCenter}>
            {type !== "CUSTOM_NOTIFICATION" ? (
              <Avatar
                variant="rounded"
                alt={customer_name}
                src={
                  type === "ORDER"
                    ? OrderIcon
                    : type === "DISCOUNT"
                    ? DiscountIcon
                    : type === "STORE_CREDIT"
                    ? CreditIcon
                    : AppointmentIcon
                }
                className={styles.notification_icon}
              />
            ) : image_url ? (
              <Avatar
                variant="rounded"
                alt={altText}
                src={image_url}
                className={styles.notification_icon}
              />
            ) : (
              <Avatar
                variant="rounded"
                alt={customer_name}
                src={
                  type_child === "Promotion of Deal / Offer"
                    ? DiscountIcon
                    : type_child === "System Announcements"
                    ? AnnouncementIcon
                    : DefaultIcon
                }
                className={styles.notification_icon}
              />
            )}
          </Grid>
          {/* Content */}
          <Grid item xs={12} sm={12} md={10} lg={10}>
            {/* Title */}
            <Grid item xs={12} lg={12} sm={12} md={12}>
              <Typography className={read ? styles.title_read : styles.title}>
                {title}
              </Typography>
            </Grid>
            {/* Body */}
            <Grid item xs={12} lg={12} sm={12} md={12}>
              {hide ? (
                <>
                  <span className={styles.custom_body}>
                    {ellipsizeText(body, 100)}
                  </span>

                  {body.length > 100 && (
                    <span
                      onClick={(e) => handleHideText(e)}
                      className={styles.more_text}
                    >
                      View More
                    </span>
                  )}
                </>
              ) : (
                <span className={styles.custom_body}>{body}</span>
              )}
            </Grid>
            {/* Time */}
            <Grid item xs={12} lg={12} sm={12} md={12}>
              <a href={url ? url : ""} className={styles.link}>
                <Typography className={styles.date_text}>{TIME}</Typography>
              </a>
            </Grid>
          </Grid>
        </>
      )}
    </Grid>
  );
};

const mapDispatchToProps = (dispatch) => ({
  getNotification: (data) => dispatch(getNotification(data)),
});

export default connect(null, mapDispatchToProps)(NotificationCard);

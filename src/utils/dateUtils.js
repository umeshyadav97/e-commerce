import { differenceInHours, differenceInSeconds } from "date-fns";

const getHoursFromDates = (startDate, startTime, endDate, endTime) => {
  const startDateTime = new Date(`${startDate} ${startTime}`);
  const endDateTime = new Date(`${endDate} ${endTime}`);

  const hours = differenceInHours(endDateTime, startDateTime);

  return hours;
};

const convertToHoursAndMinutes = (startDate, startTime, endDate, endTime) => {
  const startDateTime = new Date(`${startDate} ${startTime}`);
  const endDateTime = new Date(`${endDate} ${endTime}`);

  const time = differenceInSeconds(endDateTime, startDateTime);

  const hours = Math.floor(time / 3600);
  const minutes = Math.floor(time / 60) - hours * 60;
  // const seconds = time - hours * 60 * 60 - minutes * 60;

  if (hours > 0) {
    return `${hours} ${hours > 1 ? "hrs" : "hr"} ${minutes} ${
      minutes > 1 ? "mins" : "min"
    }`;
  } else if (minutes > 0) {
    return `${minutes} ${minutes > 1 ? "mins" : "min"}`;
  } else return "0 sec";
};

const convertDateFormat = (date) => {
  const timeStamp = new Date(date);
  const timeString = timeStamp.toString().split(" ");
  const customDate = `${timeString[1]} ${timeString[2]}, ${timeString[3]}`;
  return customDate;
};

const getLocalTime = (date) => {
  const localTime = new Date(`${date} UTC`);
  let hours = localTime.getHours();
  const AmOrPm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  let minutes = localTime.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  const customTime = `${hours}:${minutes} ${AmOrPm}`;
  return customTime;
};

const getTime = (date) => {
  const temp = new Date(date);
  let hours = temp.getHours();
  const AmOrPm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  let minutes = temp.getMinutes();
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  const customTime = `${hours}:${minutes} ${AmOrPm}`;
  return customTime;
};

const convertTo12Hour = (oldFormatTime) => {
  var oldFormatTimeArray = oldFormatTime?.split(":");

  var HH = parseInt(oldFormatTimeArray?.[0]);
  var min = oldFormatTimeArray?.[1];

  var AMPM = HH >= 12 ? "PM" : "AM";
  var hours;
  if (HH === 0) {
    hours = HH + 12;
  } else if (HH > 12) {
    hours = HH - 12;
  } else {
    hours = HH;
  }
  var newFormatTime = hours + ":" + min + " " + AMPM;
  return newFormatTime;
};

export {
  getHoursFromDates,
  convertToHoursAndMinutes,
  convertDateFormat,
  getLocalTime,
  getTime,
  convertTo12Hour,
};

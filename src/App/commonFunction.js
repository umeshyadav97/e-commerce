const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "April",
  "May",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export const getFormattedDate = (date, format) => {
  if (date) {
    if (format) {
      date = new Date(date);
      var year = date.getFullYear();
      var month = (1 + date.getMonth()).toString();
      month = month.length > 1 ? month : "0" + month;
      var day = date.getDate().toString();
      day = day.length > 1 ? day : "0" + day;
      let monthName = monthNames[date.getMonth()];
      if (format.toLowerCase() === "yyyy-mm-dd".toLowerCase()) {
        return year + "-" + month + "-" + day;
      } else if (format.toLowerCase() === "mmddyyyy".toLowerCase()) {
        return monthName + " " + day + " " + year;
      }
    } else {
      date = new Date(date);
      let year = date.getFullYear();
      let month = monthNames[date.getMonth()];
      let day = date.getDate().toString();
      day = day.length > 1 ? day : "0" + day;

      return day + "-" + month + "-" + year;
    }
  }
};

export const getOlderDateYears = (date, years) => {
  var d = new Date(date);
  var pastYear = d.getFullYear() - years;
  d.setFullYear(pastYear);
  return d;
};

export const getOlderDateMonth = (date, month) => {
  var d = new Date(date);
  var pastMonth = d.getMonth() - month;
  d.setMonth(pastMonth);
  return d;
};

export const getOlderDateDays = (date, days) => {
  var d = new Date(date);
  var pastDate = d.getDate() - days;
  d.setDate(pastDate);
  return d;
};

export const getTimeFormat12hour = (time) => {
  // Check correct time format and split into components
  if (time) {
    time = time
      .toString()
      .match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? " AM" : " PM"; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(""); // return adjusted time or original string
  } else {
    return "";
  }
};

export const getNewerDateDays = (date, days) => {
  var d = new Date(date);
  var pastDate = d.getDate() + days;
  d.setDate(pastDate);
  return d;
};

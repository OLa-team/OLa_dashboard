function getCurrentDate() {
  var today = new Date();
  var currentDate =
    today.getDate() + "." + (today.getMonth() + 1) + "." + today.getFullYear();

  return currentDate;
}

function getCurrentTime() {
  var today = new Date();

  var hour = today.getHours() > 12 ? today.getHours() - 12 : today.getHours();
  var amOrPm = today.getHours() >= 12 ? "pm" : "am";
  var currentTime =
    (hour === 0 ? 12 : hour) +
    ":" +
    (today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes()) +
    amOrPm;

  return currentTime;
}

export { getCurrentDate, getCurrentTime };

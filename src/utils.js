import emailjs from "emailjs-com";

function sendEmail(e) {
  emailjs
    .sendForm(
      "service_6sjfn5k",
      "template_cebkue4",
      e.target,
      "Zcvto6WUPOUtNW8KT"
    )
    .then(
      (result) => {
        console.log(result.text);
      },
      (error) => {
        console.log(error.text);
      }
    );
}

function getCurrentDate(date) {
  if (date === "") return "";

  var today = new Date(date);
  var currentDate =
    today.getDate() + "." + (today.getMonth() + 1) + "." + today.getFullYear();

  return currentDate;
}

function getCurrentTime(date) {
  if (date === "") return "";

  var today = new Date(date);

  var hour = today.getHours() > 12 ? today.getHours() - 12 : today.getHours();
  var amOrPm = today.getHours() >= 12 ? "pm" : "am";
  var currentTime =
    (hour === 0 ? 12 : hour) +
    ":" +
    (today.getMinutes() < 10 ? "0" + today.getMinutes() : today.getMinutes()) +
    amOrPm;

  return currentTime;
}

export { getCurrentDate, getCurrentTime, sendEmail };

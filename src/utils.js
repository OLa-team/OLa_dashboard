import CryptoJS from "crypto-js";

export function convertDateObjToDateInput(dateObj) {
  if (dateObj === "") return "";

  var today = new Date(dateObj);
  var month =
    today.getMonth() + 1 < 10
      ? "0" + (today.getMonth() + 1)
      : today.getMonth() + 1;
  var currentDate = today.getFullYear() + "-" + month + "-" + today.getDate();

  return currentDate;
}

export function getCurrentDate(date) {
  if (date === "") return "";

  var today = new Date(date);
  var currentDate =
    today.getDate() + "." + (today.getMonth() + 1) + "." + today.getFullYear();

  return currentDate;
}

export function getCurrentTime(date) {
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

export const encryptData = (data, salt) =>
  CryptoJS.AES.encrypt(JSON.stringify(data), salt).toString();

export const decryptData = (ciphertext, salt) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, salt);
  try {
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (err) {
    return null;
  }
};

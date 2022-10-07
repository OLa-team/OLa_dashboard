import CryptoJS from "crypto-js";

export function getMaxDate() {
  var now = new Date();

  var year = now.getFullYear();
  var month =
    now.getMonth() + 1 < 10 ? "0" + (now.getMonth() + 1) : now.getMonth() + 1;
  var date = now.getDate() < 10 ? "0" + now.getDate() : now.getDate();

  var maxDate = year + "-" + month + "-" + date;

  return maxDate;
}

export function convertDateObjToDateInput(dateObj) {
  if (dateObj === "") return "";

  var dateTime = new Date(dateObj);
  var month =
    dateTime.getMonth() + 1 < 10
      ? "0" + (dateTime.getMonth() + 1)
      : dateTime.getMonth() + 1;
  var date =
    dateTime.getDate() < 10 ? "0" + dateTime.getDate() : dateTime.getDate();

  var currentDate = dateTime.getFullYear() + "-" + month + "-" + date;

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

export function encryptLocalData(data, item) {
  const salt = process.env.SALT || "6d090796-ecdf-11ea-adc1-0242ac112345";
  const encryptedData = encryptData(data, salt);
  console.log(`encrypt ${item}`, encryptedData);
  localStorage.setItem(item, encryptedData);
}

export function decryptLocalData(item) {
  let localData = localStorage.getItem(item)
    ? localStorage.getItem(item)
    : null;

  if (!localData) {
    alert("No data stored");
  }

  const salt = process.env.SALT || "6d090796-ecdf-11ea-adc1-0242ac112345";
  const originalData = decryptData(localData, salt);
  if (!originalData) {
    alert("Data have been altered");
  }
  console.log(`decrypted local data ${item}`, originalData);

  return originalData;
}

const encryptData = (data, salt) =>
  CryptoJS.AES.encrypt(JSON.stringify(data), salt).toString();

const decryptData = (ciphertext, salt) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, salt);
  try {
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  } catch (err) {
    return null;
  }
};

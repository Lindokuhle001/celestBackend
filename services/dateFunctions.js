const { DateTime } = require("luxon");

const getPaymentExpiryTime = () => DateTime.now().plus({ minutes: 10 }).toISO();
const getRequestDate = () => DateTime.now().toISO();

module.exports = {
  getPaymentExpiryTime,
  getRequestDate,
};

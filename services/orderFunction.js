const { DateTime } = require("luxon");
const { v4: uuidv4 } = require("uuid");

const getPaymentExpiryTime = () => {
  return DateTime.now().plus({ weeks: 1 }).toISO();
};

const createOrder = (referenceBuyerId, orderDescription, value) => {
  return {
    productCode: "CASHIER_PAYMENT",
    salesCode: "51051000101000000011",
    paymentRequestId: uuidv4(),
    paymentNotifyUrl: "https://celesteapi.herokuapp.com/payment-notification",
    paymentExpiryTime: getPaymentExpiryTime(),
    paymentAmount: {
      currency: "ZAR",
      value,
    },
    order: {
      goods: {
        referenceGoodsId: "goods123",
        goodsUnitAmount: {
          currency: "ZAR",
          value,
        },
        goodsName: "meal and drink",
      },
      env: {
        terminalType: "MINI_APP",
      },
      orderDescription,
      buyer: {
        referenceBuyerId,
      },
    },
  };
};

module.exports = { createOrder };

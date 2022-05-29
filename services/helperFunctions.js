const axios = require("axios");
const { DateTime } = require("luxon");
const getRequestDate = () => DateTime.now().toISO();

const makeVodapayRequest = async (requestBody, path) => {
  const headers = {
    "Content-Type": "application/json; charset=UTF-8",
    "client-id": clientId,
    "request-time": getRequestDate(),
    Signature: "algorithm=RSA256, keyVersion=1, signature=testing_signatur",
  };

  const options = {
    method: "POST",
    url: path,
    headers,
    data: requestBody,
  };

  const response = await axios(options);
  return response.data;
};

module.exports = makeVodapayRequest;
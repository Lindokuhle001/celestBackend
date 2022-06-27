const axios = require("axios");
const { getRequestDate } = require("./dateFunctions");
const { getSignature } = require("./signature");
const { CLIENT_ID: clientId } = process.env;

const makeVodapayRequest = async (requestBody, path) => {
  const requestTime = getRequestDate();
  const uriPath = new URL(path).pathname;
  const signature = getSignature(requestBody, requestTime, uriPath);

  const headers = {
    "Content-Type": "application/json; charset=UTF-8",
    "client-id": clientId,
    "request-time": requestTime,
    signature: `algorithm=RSA256, keyVersion=1, signature=${signature}`,
  };

  const options = {
    method: "POST",
    url: path,
    headers,
    data: requestBody,
  };

  const response = await axios(options).catch((err) => {
    console.log(errz);
  });

  return response;
};

module.exports = { makeVodapayRequest };

const axios = require("axios");
const { createPrivateKey, createSign } = require("crypto");
const { DateTime } = require("luxon");
const { sign } = require("jsonwebtoken");
const { readFileSync } = require("fs");
const { CLIENT_ID: clientId } = process.env;

const signToken = (userInfo, secretToken) => {
  return sign(userInfo, secretToken);
};

const getRequestDate = () => DateTime.now().toISO();

const getSignature = (requestBody, requestTime, endPoint) => {
  const unsignedContent = `POST ${endPoint}\n${clientId}.${requestTime}.${JSON.stringify(
    requestBody
  )}`;

  const key = readFileSync("rsa_private_key.PEM", "utf8");
  const privateKey = createPrivateKey(key);
  const sign = createSign("RSA-SHA256");
  sign.write(unsignedContent);
  sign.end();
  const signature = sign.sign(privateKey, "base64");
  return signature;
};

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
    console.log(err);
  });

  return response;
};

module.exports = { makeVodapayRequest, signToken };

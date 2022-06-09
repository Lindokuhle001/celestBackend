const axios = require("axios");
const crypto = require("crypto");

const { DateTime } = require("luxon");
const { CLIENT_ID: clientId } = process.env;
const jwt = require("jsonwebtoken");
const fs = require("fs");

const signToken = (userInfo, secretToken) => {
  return jwt.sign(userInfo, secretToken);
};

const getRequestDate = () => DateTime.now().toISO();

const getSignature = (requestBody, requestTime, endPoint) => {
  const unsignedContent = `POST ${endPoint}\n${clientId}.${requestTime}.${JSON.stringify(
    requestBody
  )}`;

  // console.log(unsignedContent);
  const key = fs.readFileSync("rsa_private_key.PEM", "utf8");

  const privateKey = crypto.createPrivateKey(key);
  const sign = crypto.createSign("RSA-SHA256");
  sign.write(unsignedContent);
  sign.end();
  const signature = sign.sign(privateKey, "base64");
  // console.log(signature);
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
  // console.log(response);
  return response;
};

module.exports = { makeVodapayRequest, signToken, getRequestDate };

const { createPrivateKey, createSign } = require("crypto");
const { readFileSync } = require("fs");
const { CLIENT_ID: clientId } = process.env;

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

module.exports = { getSignature };

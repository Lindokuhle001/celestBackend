require("dotenv").config();
const express = require("express");
const { authorise } = require("./services/middleware");
const { makeVodapayRequest, signToken } = require("./services/helperFunctions");
const { menu, price } = require("./services/database");
const { createOrder } = require("./services/orderFunction");

const app = express();
app.use(express.json());
app.use(authorise);

const {
  PORT: port = 3000,
  BASE_URL: baseURL,
  TOKEN_END_POINT: tokenEndPoint,
  USER_DETAILS_END_POINT: userDetailsEndPoint,
  SECRET_TOKEN: secretToken,
  PAYMENT_END_POINT: paymentEndPoint,
} = process.env;

app.post("/price", (req, res) => {
  res.send(price);
});

app.post("/menu", (req, res) => {
  res.send(menu);
});

app.post("/login", async (req, res) => {
  console.log(req.body);
  const { authCode } = req.body;

  const accessTokenPath = `${baseURL}${tokenEndPoint}`;
  const accessTokenBody = {
    grantType: "AUTHORIZATION_CODE",
    authCode,
  };

  const accessTokenResponse = await makeVodapayRequest(
    accessTokenBody,
    accessTokenPath
  );
  const { accessToken } = accessTokenResponse.data;

  const userDetailsPath = `${baseURL}${userDetailsEndPoint}`;
  const userDetailsBody = {
    accessToken,
  };
  const userDetails = await makeVodapayRequest(
    userDetailsBody,
    userDetailsPath
  );
  const userInfo = userDetails.data;
  const jsonWebToken = signToken(userInfo, secretToken);
  res.send({ userInfo, jsonWebToken });
});

app.post("/payment-notification", async (req, res) => {
  console.log(req.body.data);
  // const notification = req.body;
  // res.send(notification);
});

app.post("/pay", async (req, res) => {
  const path = `${baseURL}${paymentEndPoint}`;
  const { referenceBuyerId, orderDescription, value } = req.body;
  const order = createOrder(referenceBuyerId, orderDescription, value);

  const response = await makeVodapayRequest(order, path);
  res.send(response.data);
});

app.listen(port, () => {
  console.log(`app listening on port: ${port}`);
});

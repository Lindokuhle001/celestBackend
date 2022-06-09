require("dotenv").config();
const express = require("express");
const { authorise } = require("./services/middleware");
const { makeVodapayRequest, signToken } = require("./services/helperFunctions");

const app = express();
app.use(authorise);
app.use(express.json());

const {
  PORT: port = 3000,
  BASE_URL: baseURL,
  TOKEN_END_POINT: tokenEndPoint,
  USER_DETAILS_END_POINT: userDetailsEndPoint,
  SECRET_TOKEN: secretToken,
  PAYMENT_END_POINT: paymentEndPoint,
} = process.env;
let { menu, price, orders } = require("./services/database");

app.get("/price", (req, res) => {
  res.send(price);
});

app.get("/menu", (req, res) => {
  res.send(menu);
});

app.post("/orders", (req, res) => {
  const newOrder = req.body;
  orders.push(newOrder);
  console.log(orders);
  res.send("price updated");
});

app.post("/login", async (req, res) => {
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

app.post("/pay", async (req, res) => {
  const path = `${baseURL}${paymentEndPoint}`;
  const requestBody = req.body;

  const response = await makeVodapayRequest(requestBody, path);
  res.send(response.data);
});

app.listen(port, () => {
  console.log(`app listening on port: ${port}`);
});

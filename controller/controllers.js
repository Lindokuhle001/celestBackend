require("dotenv").config();
const { makeVodapayRequest } = require("../services/vodapayRequest");
const { getJwt } = require("../services/signToken");
const { menu, price } = require("../model/database");
const { createOrder } = require("../services/orderFunction");

const {
  PORT: port = 3000,
  BASE_URL: baseURL,
  TOKEN_END_POINT: tokenEndPoint,
  USER_DETAILS_END_POINT: userDetailsEndPoint,
  SECRET_TOKEN: secretToken,
  PAYMENT_END_POINT: paymentEndPoint,
} = process.env;

const priceController = (req, res) => {
  res.send(price);
};

const menuController = (req, res) => {
  res.send(menu);
};

const loginController = async (req, res) => {
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
  let userDetails = await makeVodapayRequest(userDetailsBody, userDetailsPath);
  userDetails = userDetails.data;
  const jsonWebToken = getJwt(userDetails, secretToken);
  res.send({ userDetails, jsonWebToken });
};

const paymentNotificationController = async (req, res) => {
  console.log(req.body.data);
};

const paymentController = async (req, res) => {
  const path = `${baseURL}${paymentEndPoint}`;
  const { referenceBuyerId, orderDescription, value } = req.body;
  const order = createOrder(referenceBuyerId, orderDescription, value);

  const response = await makeVodapayRequest(order, path);
  res.send(response.data);
};

module.exports = {
  priceController,
  paymentController,
  loginController,
  menuController,
  paymentNotificationController,
};

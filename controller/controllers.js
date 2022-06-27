require("dotenv").config();
const { makeVodapayRequest } = require("../services/vodapayRequest");
const { signToken } = require("../services/signToken");
const { menu, price } = require("../model/database");
const { createOrder } = require("../services/orderFunction");

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
  const userDetails = await makeVodapayRequest(
    userDetailsBody,
    userDetailsPath
  );
  const userInfo = userDetails.data;
  const jsonWebToken = signToken(userInfo, secretToken);
  res.send({ userInfo, jsonWebToken });
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

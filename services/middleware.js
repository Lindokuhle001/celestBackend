require("dotenv").config();
const jwt = require("jsonwebtoken");

const { basicAuthPaths } = require("../model/database");
const { SECRET_TOKEN: secretToken, MERCHANT_ID: secretMerchantId } =
  process.env;

const authorise = (req, res, next) => {
  if (basicAuthPaths.includes(req.path)) {
    verifyMerchant(req, res, next);
  } else if (req.path === "/pay") {
    verifyToken(req, res, next);
  }
};

const verifyMerchant = (req, res, next) => {
  const { merchantid } = req.body;
  if (!merchantid) return res.sendStatus(401);
  if (merchantid === secretMerchantId) {
    next();
  } else {
    res.sendStatus(403);
  }
};

const verifyToken = (req, res, next) => {
  const { authorization } = req.headers;
  const token = authorization && authorization.split(" ")[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, secretToken, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

module.exports = { authorise };

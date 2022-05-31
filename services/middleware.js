require("dotenv").config();
const jwt = require("jsonwebtoken");

const {
    SECRET_TOKEN: secretToken,
    MERCHANT_ID: secretMerchantId,
  } = process.env;


const verify = (req, res, next) => {
    console.log("verify");
    const { merchantid } = req.body;
    console.log(merchantid, secretMerchantId);

    if (req.path === "/login") {
      console.log("login middleware");
      verifyMerchant(req, res, next);
    } else {
      console.log("test middleware");
      verifyToken(req, res, next);
    }
  };
  
  const verifyMerchant = (req, res, next) => {
    console.log("merchantId middleware");
    const { merchantid } = req.body;
    console.log(merchantid, secretMerchantId);
    if (!merchantid) return res.sendStatus(401);
    if (merchantid === secretMerchantId) {
      next();
    } else {
      res.sendStatus(403);
    }
  };
  
  const verifyToken = (req, res, next) => {
      console.log("verify token");
    const { authorization } = req.headers;
    const token = authorization && authorization.split(" ")[1];
  
    if (token == null) return res.sendStatus(401);
  
    jwt.verify(token, secretToken, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  module.exports={verify};
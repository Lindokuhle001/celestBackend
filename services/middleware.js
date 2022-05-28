require("dotenv").config();
const jwt = require("jsonwebtoken");

const {
    SECRET_TOKEN: secretToken,
    MERCHANT_ID: secretMerchantId,
  } = process.env;


const verify = (req, res, next) => {
    console.log("verify");
    if (req.path === "/login") {
      console.log("login middleware");
      verifyMerchant(req, res, next);
    } else {
      console.log("test middleware");
      verifyToken(req, res, next);
    }
  };
  
  const verifyMerchant = (req, res, next) => {
    // console.log(req);
    const { merchantid } = req.headers;
    // console.log(req.headers);
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
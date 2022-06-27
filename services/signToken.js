const { sign, verify } = require("jsonwebtoken");

const signToken = (userInfo, secretToken) => {
  return sign(userInfo, secretToken);
};

const verifyJwt = (token, secretToken, next) => {
  verify(token, secretToken, (err) => {
    if (err) return res.sendStatus(403);
    next();
  });
};

module.exports = { signToken, verifyJwt };

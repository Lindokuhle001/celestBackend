const { sign, verify } = require("jsonwebtoken");

const getJwt = (userInfo, secretToken) => {
  return sign(userInfo, secretToken);
};

const verifyJwt = (token, secretToken, next, res) => {
  verify(token, secretToken, (err) => {
    if (err) return res.sendStatus(403);
    next();
  });
};

module.exports = { getJwt, verifyJwt };

require("dotenv").config();
const express = require("express");
const axios = require("axios");
const { DateTime } = require("luxon");
const jwt = require("jsonwebtoken");

const app = express();
const {
  PORT: port = 3000,
  BASE_URL: baseURL,
  CLIENT_ID: clientId,
  TOKEN_END_POINT: tokenEndPoint,
  USER_DETAILS_END_POINT: userDetailsEndPoint,
  SECRET_TOKEN: secretToken,
  // MERCHANT_ID: secretMerchantId,
} = process.env;
const {verify} = require("./services/middleware");
app.use(express.json());
app.use(verify)

/* menu, user and price apis */
// const maxTables = 10
// const getTable = (max) => {
//     return Math.floor(Math.random() * max) +1
// }
// const user ={
//     name : "Lindo",
//     email: "lindo@bbd.co.za",
//     table: getTable(maxTables),
//     maxNumberOfPeople:4
// }

// const price = {
//     perPersonCost: 126
// }

// const orders =[]

// const menu = [
//     {
//       meal: "Glazed oysters with zucchini pearls and sevruga caviar",
//       drink: "Wine pairing: kleine zalze brut rose"
//     },
//     {
//       meal:
//         "Seared anhi tuna with provincial vegetables and tapenade croutons",
//       drink: "Wine pairing: bizoe semillon"
//     },
//     {
//       meal: "Bream with asparagus, tempura mussels and a lime velouté",
//       drink: "Wine pairing:  red city blend"
//     },

//     {
//       meal: "Aged gouda with espresso, hazelnut and onion",
//       drink: "Wine pairing: thelema early harvest"
//     },
//     {
//       meal: "Dark chocolate panna cotta with a rhubarb and cherry compote",
//       drink: "Wine pairing: clarington sauvignon blanc"
//     }
//   ]

// /* price */
// app.get("/price", (req, res) => {

//     res.send(price)
// })

// app.put("/price", (req, res) => {
//     const {newPrice} = req.body
//     price = newPrice
//     res.send("price updated")

// })

// app.post("/price", (req, res) => {
//     const {newPrice} = req.body
//     price = newPrice
//     res.send("price updated")

// })

// const now = new Date()
// console.log(now);
// /* menu */
// app.get("/menu", (req, res) => {

//     res.send(menu)
// })

// app.put("/menu", (req, res) => {
//     const {newMenuItem} = req.body
//     menu.push(newMenuItem)
//     res.send("new menu item added")
// })

// /* orders */
// app.post("/orders", (req, res) => {
//     const newOrder = req.body
//     orders.push(newOrder)
//     console.log(orders);
//     res.send("price updated")

// })

// /* user */
// app.get("/user", (req, res) => {
//     res.send(user)
// })

// const verify = (req, res, next) => {
//   if (req.path === "/login") {
//     console.log("login middleware");
//     verifyMerchant(req, res, next);
//   } else {
//     console.log("test middleware");
//     verifyToken(req, res, next);
//   }
// };

// const verifyMerchant = (req, res, next) => {
//   console.log("merchantid", req.headers["merchantid"]);
//   const { merchantid } = req.headers;
//   // console.log(req.headers);
//   if (!merchantid) return res.sendStatus(401);
//   if (merchantid === secretMerchantId) {
//     next();
//   } else {
//     res.sendStatus(403);
//   }
// };

// const verifyToken = (req, res, next) => {
//   console.log("token verification");
//   const { authorization } = req.headers;
//   const token = authorization && authorization.split(" ")[1];

//   if (token == null) return res.sendStatus(401);

//   jwt.verify(token, secretToken, (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     console.log("here");
//   });
//   next(); 
// };

// app.use(verify);

const date = () => DateTime.now().toISO();

const makeVodapayRequest = async (requestBody, path) => {
  const headers = {
    "Content-Type": "application/json; charset=UTF-8",
    "client-id": clientId,
    "request-time": date(),
    Signature: "algorithm=RSA256, keyVersion=1, signature=testing_signatur",
  };

  const options = {
    method: "POST",
    url: path,
    headers,
    data: requestBody,
  };

  const response = await axios(options);
  return response.data;
};

app.post("/login", async (req, res) => {
  const { authCode } = req.body;
  console.log("login path");

  const accessTokenPath = `${baseURL}${tokenEndPoint}`;
  const accessTokenBody = JSON.stringify({
    grantType: "AUTHORIZATION_CODE",
    authCode,
  });
  const accessTokenResponse = await makeVodapayRequest(
    accessTokenBody,
    accessTokenPath
  );
  const { accessToken } = accessTokenResponse;

  const userDetailsPath = `${baseURL}${userDetailsEndPoint}`;
  const userDetailsBody = JSON.stringify({
    accessToken,
  });
  const userDetails = await makeVodapayRequest(
    userDetailsBody,
    userDetailsPath
  );
  const userInfo = userDetails;

  const jsonWebToken = jwt.sign(userInfo, secretToken);
  res.header("authorization", `${jsonWebToken}`);
  res.send(userInfo);
});

app.post("/test", (req, res) => {
  console.log("test path");
  res.send("success");
});

app.listen(port, () => {
  console.log(`app listening on port: ${port}`);
});

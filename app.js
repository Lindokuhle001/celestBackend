require("dotenv").config();
const fs = require("fs");
const crypto = require("crypto");
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

// menu, user and price apis
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
//
// user
// app.get("/user", (req, res) => {
//     res.send(user)
// })

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

app.post("/encription", async (req, res) => {
  const requestBody = req.body;
  const path =
    "https://vodapay-gateway.sandbox.vfs.africa/v2/authorizations/applyTokenSigned";

  const response = await makeVodapayRequest(requestBody, path);
  res.send(response);
});

app.post("/test", (req, res) => {
  console.log("test path");
  res.send("success");
});

app.listen(port, () => {
  console.log(`app listening on port: ${port}`);
});

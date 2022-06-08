require("dotenv").config();
const axios = require("axios");
const fs = require("fs");
const express = require("express");
const { verify } = require("./services/middleware");
const crypto = require("crypto");
const buffer = require("buffer");
const {
  makeVodapayRequest,
  signToken,
  getRequestDate,
} = require("./services/helperFunctions");

const {
  PORT: port = 3000,
  BASE_URL: baseURL,
  TOKEN_END_POINT: tokenEndPoint,
  USER_DETAILS_END_POINT: userDetailsEndPoint,
  SECRET_TOKEN: secretToken,
  PAYMENT_END_POINT: paymentEndPoint,
  // PRIVATE_KEY: privateKey,
  CLIENT_ID: clientId,
} = process.env;

const app = express();
app.use(express.json());
// app.use(verify);

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
//
/* user */
// app.get("/user", (req, res) => {
//     res.send(user)
// })

app.post("/login", async (req, res) => {
  const { authCode } = req.body;
  console.log("login path");
  console.log(authCode);

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
  console.log(accessTokenResponse);

  const userDetailsPath = `${baseURL}${userDetailsEndPoint}`;
  const userDetailsBody = JSON.stringify({
    accessToken,
  });
  const userDetails = await makeVodapayRequest(
    userDetailsBody,
    userDetailsPath
  );
  console.log(userDetails);
  const userInfo = userDetails;
  const jsonWebToken = signToken(userInfo, secretToken);
  res.send({ userInfo, jsonWebToken });
});

app.post("/pay", async (req, res) => {
  // const { authCode } = req.body;
  // console.log("payment path");

  // const accessTokenPath = `${baseURL}${tokenEndPoint}`;
  // const accessTokenBody = JSON.stringify({
  //   grantType: "AUTHORIZATION_CODE",
  //   authCode,
  // });
  // const accessTokenResponse = await makeVodapayRequest(
  //   accessTokenBody,
  //   accessTokenPath
  // );
  // const { accessToken } = accessTokenResponse;

  // const userDetailsPath = `${baseURL}${userDetailsEndPoint}`;
  // const userDetailsBody = JSON.stringify({
  //   accessToken,
  // });
  // const userDetails = await makeVodapayRequest(
  //   userDetailsBody,
  //   userDetailsPath
  // );
  // const userInfo = userDetails;

  // const paymentPath = `${baseURL}${paymentEndPoint}`;
  // const paymentBody = JSON.stringify({
  //   productCode: "CASHIER_PAYMENT",
  //   salesCode: "51051000101000000011",
  //   paymentRequestId: "c0a83b17161398737179310015310",
  //   paymentNotifyUrl: "https://www.merchant.com/paymentNotifyxxx",
  //   paymentRedirectUrl: "https://www.merchant.com/redirectxxx",
  //   paymentExpiryTime: "2022-02-22T17:49:31+08:00",
  //   paymentAmount: {
  //     currency: "ZAR",
  //     value: "6234",
  //   },
  //   order: {
  //     goods: {
  //       referenceGoodsId: "goods123",
  //       goodsUnitAmount: {
  //         currency: "ZAR",
  //         value: "6234",
  //       },
  //       goodsName: "mobile1",
  //     },
  //     env: {
  //       terminalType: "MINI_APP",
  //     },
  //     orderDescription: "Car",
  //     buyer: {
  //       referenceBuyerId: "216610000000259832353",
  //     },
  //   },
  // });
  // const requestBody = req.body;
  // const requestBody = {
  //   order: {
  //     orderId: "OrderID_0101010101",
  //     orderDescription: "sample_order",
  //     orderAmount: {
  //       value: "100",
  //       currency: "JPY",
  //     },
  //   },
  //   paymentAmount: {
  //     value: "100",
  //     currency: "JPY",
  //   },
  //   paymentFactor: {
  //     isInStorePayment: "true",
  //   },
  // };
  const unsignedContent = `POST ${paymentEndPoint}
  ${clientId}.${getRequestDate()}.${requestBody}`;

  fs.readFile("testCredentials/rsa_private_key.PEM", (err, key) => {
    const privateKey = key;
    // create key with crypto
    // create signer with crypto RSA- SHA256
    // write unsigned payload to the singer
    // signature = signer sign with base 64

    const data = Buffer.from(unsignedContent);
    const sign = crypto.sign("SHA256", data, privateKey);
    const signature = sign.toString("base64");
    console.log(signature);
  });

  // const signature = crypto
  //   .createHmac("sha256", privateKey)
  //   .update(unsignedContent)
  //   .digest("hex");

  //   console.log(signature);

  //   const headers = {
  //     "Content-Type": "application/json; charset=UTF-8",
  //     "client-id": clientId,
  //     "request-time": getRequestDate(),
  //   Signature: `algorithm=RSA256, keyVersion=0, signature=${signature}`,
  // };

  //   const options = {
  //     method: "POST",
  //     url: `${baseURL}${paymentEndPoint}`,
  //     headers,
  //     data: requestBody,
  //   };

  //   const response = await axios(options);
  //   console.log(response);
});

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

// const requestBody = {
//   order: {
//     orderId: "OrderID_0101010101",
//     orderDescription: "sample_order",
//     orderAmount: {
//       value: "100",
//       currency: "JPY",
//     },
//   },
//   paymentAmount: {
//     value: "100",
//     currency: "JPY",
//   },
//   paymentFactor: {
//     isInStorePayment: "true",
//   },
// };

// const unsignedContent = `POST ${paymentEndPoint}
// ${clientId}.${getRequestDate()}.${requestBody}`;

// const { privateKey } = crypto.generateKeyPairSync("rsa", {
//   modulusLength: 2048,
// });

// const data = Buffer.from(unsignedContent);
// const sign = crypto.sign("SHA256", data, privateKey);
// const signature = sign.toString("base64");
// console.log(signature);

// // >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

app.post("/encription", async (req, res) => {
  const requestBody = req.body;

  const unsignedContent = `POST ${paymentEndPoint}
  ${clientId}.${getRequestDate()}.${requestBody}`;

  fs.readFile("testCredentials/rsa_private_key.PEM", (err, data) => {
    if (err) throw err;

    const privateKey = crypto.createPrivateKey(data);
    const sign = crypto.createSign("RSA-SHA256");
    sign.write(unsignedContent);
    sign.end();
    const signature = sign.sign(privateKey, "base64");
    console.log(signature);
    res.send(signature);
  });
});

app.post("/test", (req, res) => {
  console.log("test path");
  res.send("success");
});

app.listen(port, () => {
  console.log(`app listening on port: ${port}`);
});

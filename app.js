require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const moment = require("moment");
const axios = require("axios");
const port = 3000;

const getRequestTime = () => {
  const now = moment();
  const time = now.format("yyyy-MM-DDTHH:mm:ssZ");
  return time;
};

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

app.get("/auth", async (req, res) => {
  const path =
    "https://vodapay-gateway.sandbox.vfs.africa/v2/authorizations/applyAuthCode";
  const headers = {
    "Content-Type": "application/json",
    "client-id": process.env.clientId,
    "request-time": getRequestTime(),
  };

  const body = {
    clientId: process.env.clientId,
    userId: process.env.userId,
    scopes: "auth_user",
  };

  const options = {
    method: "POST",
    url: path,
    headers,
    data: body,
  };

  let response;
  try {
    response = await axios(options);
  } catch (e) {
    console.error("FAILED");
    console.error(e.message);
  }
  authCode = response.data.authCode;

  res.send(response.data);
});

app.post("/token", async (req, res) => {
  const { authCode } = req.body;
  console.log(authCode);
  const path =
    "https://vodapay-gateway.sandbox.vfs.africa/v2/authorizations/applyToken";
  const headers = {
    "Content-Type": "application/json; charset=UTF-8",
    "client-id": process.env.clientId,
    "request-time": getRequestTime(),
    Signature: "algorithm=RSA256, keyVersion=1, signature=testing_signatur",
  };

  const body = JSON.stringify({
    grantType: "AUTHORIZATION_CODE",
    authCode: authCode,
  });

  const options = {
    method: "POST",
    url: path,
    headers,
    data: body,
  };

  try {
    let response = await axios(options);
    console.log(response);
    console.log(response.data);
    res.send(response.data);
  } catch (e) {
    console.error("FAILED");
    console.error(e.message);
  }
});

app.listen(port, () => {
  console.log(`app listening on port: ${port}`);
});

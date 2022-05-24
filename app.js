require("dotenv").config();
const express = require("express");
const moment = require("moment");
const axios = require("axios");
const { DateTime } = require("luxon");

const app = express();
app.use(express.urlencoded({ extended: false }));/* check */
app.use(express.json());

const port = process.env.PORT ||3000;
const clientId= process.env.CLIENT_ID;
const baseURL= process.env.BASE_URL;
// const tokenPath= process.env.BASE_URL;

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



const date = ()=> DateTime.now().toISO();
const getRequestTime = () => {
  const now = moment();
  const time = now.format("yyyy-MM-DDTHH:mm:ssZ");
  return time;
};
console.log(date());
// console.log(getRequestTime);

const requestFunction = async(requestBody,path) =>{
    const headers = {
        "Content-Type": "application/json; charset=UTF-8",
        "client-id": clientId,
        "request-time": date(),
        "Signature": "algorithm=RSA256, keyVersion=1, signature=testing_signatur",
    };
    
    const options = {
    method: "POST",
    url: path,
    headers,
    data:requestBody,
    };

    const response = await axios(options);
    return response.data;

}



app.post("/token", async (req, res) => {
  const { authCode } = req.body;
  const path =
  `${baseURL}/v2/authorizations/applyToken`;

  const body = JSON.stringify({
    grantType: "AUTHORIZATION_CODE",
    authCode: authCode,
    });

 res.send(await requestFunction(body,path))
});


app.post("/userDetails", async (req, res) => {
  const { accessToken } = req.body;
  const path =
  `${baseURL}/v2/customers/user/inquiryUserInfo`;

  const body = JSON.stringify({
    accessToken
  });
  let user = await requestFunction(body,path);
  console.log(user.userInfo);
 res.send(user.userInfo)
});


app.listen(port, () => {
  console.log(`app listening on port: ${port}`);
});

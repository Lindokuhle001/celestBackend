require("dotenv").config();
const express = require("express");
const { authorise } = require("./services/middleware");
const {
  priceController,
  paymentController,
  loginController,
  menuController,
  paymentNotificationController,
} = require("./controller/controllers");

const app = express();
app.use(express.json());
app.use(authorise);

const { PORT: port = 3000 } = process.env;

app.post("/price", priceController);

app.post("/menu", menuController);

app.post("/login", loginController);

app.post("/payment-notification", paymentNotificationController);

app.post("/pay", paymentController);

app.listen(port, () => {
  console.log(`app listening on port: ${port}`);
});

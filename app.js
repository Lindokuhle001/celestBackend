const express = require("express");
const app = express();
const path = require("path");
const port = 3000;

const user = {
    name: "lindokuhle shabalala",
    email: "lindokuhle@email.com",

}
let price = "100"

let menu = [
    {
      meal: "Glazed oysters with zucchini pearls and sevruga caviar",
      drink: "Wine pairing: kleine zalze brut rose"
    },
    {
      meal:
        "Seared anhi tuna with provincial vegetables and tapenade croutons",
      drink: "Wine pairing: bizoe semillon"
    },
    {
      meal: "Bream with asparagus, tempura mussels and a lime velouté",
      drink: "Wine pairing:  red city blend"
    },
    {
      meal: "Aged gouda with espresso, hazelnut and onion",
      drink: "Wine pairing: thelema early harvest"
    },
    {
      meal: "Aged gouda with espresso, hazelnut and onion",
      drink: "Wine pairing: thelema early harvest"
    },
    {
      meal: "Aged gouda with espresso, hazelnut and onion",
      drink: "Wine pairing: thelema early harvest"
    },
    {
      meal: "Aged gouda with espresso, hazelnut and onion",
      drink: "Wine pairing: thelema early harvest"
    },
    {
      meal: "Aged gouda with espresso, hazelnut and onion",
      drink: "Wine pairing: thelema early harvest"
    },
    {
      meal: "Aged gouda with espresso, hazelnut and onion",
      drink: "Wine pairing: thelema early harvest"
    },
    {
      meal: "Aged gouda with espresso, hazelnut and onion",
      drink: "Wine pairing: thelema early harvest"
    },
    {
      meal: "Dark chocolate panna cotta with a rhubarb and cherry compote",
      drink: "Wine pairing: clarington sauvignon blanc"
    }
  ]

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.get("/user", (req, res) => {

    res.send(user)
})



app.get("/price", (req, res) => {

    res.send(price)
})

app.get("/menu", (req, res) => {

    res.send(menu)
})


app.put("/menu", (req, res) => {
    const {newMenu} = req.body
    menu = newMenu
})


app.put("/price", (req, res) => {
    const {newPrice} = req.body
    price = newPrice
})


app.listen(port, () => {
    console.log(`app listening on port: ${port}`);
});
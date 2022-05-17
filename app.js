const express = require("express");
const app = express();
const path = require("path");
const port = 3000;


const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.json());

app.get("/user",(req,res)=>{
    const user ={
        name:"lindokuhle shabalala",
        email:"lindokuhle@email.com",

    }
    res.send(user)
})



app.get("/price",(req,res)=>{
    const price ="100"
    res.send(price)
})


app.listen(port, () => {
    console.log(`app listening on port: ${port}`);
  });
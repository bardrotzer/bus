import bodyParser from "body-parser";
import express from "express";
import router from "./routes/index";
import dotenv from 'dotenv';
// load the dotenv lib
dotenv.config();

// start express
const app = express();

// set datatype to json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// set app to accept any incoming
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, application/json");
  res.header("Content-Type", "application/json")
  next();
});

// app.use((req, res, next) => {
//   const secret = req.get('secret');
//   if (secret === process.env.SECRET) {
//     next();
//   } else {
//     res.status(401).send({
//       message: 'You need to authenticate, and are probaby not allowed to be here'
//     });
//   }
// })

// use the router defined in routes/index,js
app.use("/", router);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Bus running on ', port);
});

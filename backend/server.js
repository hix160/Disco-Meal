const express = require("express");
const path = require("path");
require("dotenv").config();

const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const session = require("express-session");

const cors = require("cors");


require("dotenv").config();

const indexRouter = require("./routers/indexRouter");

const corsOptions = {
    origin: ['https://disco-meal.vercel.app', 'http://192.168.0.111:3000'],
    credentials: true,
    optionsSuccessStatus: 200
  };


const app = express();

app.use(session({
    secret:"1234",
    resave:false,
    saveUninitialized:false,
    cookie:{
        secure:false,
        maxAge:1000*60*60,
    },

}))

app.use(cors(corsOptions));


app.use(passport.initialize())
app.use(passport.session());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use("/", indexRouter);

const PORT = process.env.PORT;
const IP = process.env.IP;


app.listen(PORT,IP, ()=> {
    console.log(`Listening on port ${PORT}!`)
})
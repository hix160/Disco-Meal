const express = require("express");
const path = require("path");

const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const session = require("express-session");


require("dotenv").config();

const indexRouter = require("./routers/indexRouter");


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

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use(passport.initialize())
app.use(passport.session());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use("/", indexRouter);


const IP = "192.168.0.111" //ethernet
const PORT = 5000;
app.listen(PORT,IP, ()=> {
    console.log(`Listening on port ${PORT}!`)
})
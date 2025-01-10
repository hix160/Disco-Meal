const express = require("express");
const path = require("path");
require("dotenv").config();

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

const PORT = process.env.PORT;
const IP = process.env.IP;


app.listen(PORT,IP, ()=> {
    console.log(`Listening on port ${PORT}!`)
})
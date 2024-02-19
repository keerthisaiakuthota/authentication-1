const express = require("express");
const app = express();
const session = require("express-session");
const mongoose = require("mongoose");
const path = require("path");
const ejsMate = require("ejs-mate");
const passport = require("passport");
const User = require("./models/users.js");
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.engine("ejs", ejsMate)
app.use(express.static(path.join(__dirname, "public")));
const LocalStratergy = require("passport-local");







const MONGO_URL = 'mongodb://127.0.0.1:27017/sumeen';

main()
    .then((res) => {
        console.log("connection succesfull");
    })
    .catch((err) => {
        console.log(err);
    })
async function main() {
    await mongoose.connect(MONGO_URL);
}

const sessionOptions = {
    secret: "supersecretcode",
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly :true
    }
};

app.use(session(sessionOptions));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStratergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/signup", (req, res) => {
    res.render("signup.ejs");
});


app.post("/login", async (req, res) => {
    try {
        let { username, password } = req.body;
        console.log(username, password);
        let newUser = new User({ username });
        let registeredUser = await User.register(newUser, password);
        console.log(registeredUser);

    }
    catch(e){
        console.log(`the error was ${e}`);
    }


    res.render("login.ejs");
});

app.post("/entry",passport.authenticate("local", { failureRedirect: "/login" }),(req,res)=>{
    res.redirect("/entry");
});

app.get("/", (req, res) => {
    res.send("Welcome to the application");
});


app.get("/", (req, res) => {
    res.redirect("/login");
});


app.get("/app", (req, res) => {
    res.send("the user has logged in and redirected to app")
})

app.listen(8080, () => {
    console.log("connection to sever was successfull");
})


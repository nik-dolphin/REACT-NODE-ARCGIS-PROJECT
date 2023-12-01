// index.js

/*  EXPRESS */

const express = require("express");
const app = express();
const session = require("express-session");

app.set("view engine", "ejs");

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: "SECRET",
  })
);

app.get("/", function (req, res) {
  res.render("pages/auth");
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log("App listening on port " + port));

/*  PASSPORT SETUP  */

const passport = require("passport");
var userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");

app.get("/success", (req, res) => res.send(userProfile));
app.get("/error", (req, res) => res.send("error logging in"));

passport.serializeUser(function (user, cb) {
  cb(null, user);
});

passport.deserializeUser(function (obj, cb) {
  cb(null, obj);
});

/*  Google AUTH  */

const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const GOOGLE_CLIENT_ID =
  "357201915488-e828i4j2rtnncukt5qf7pom0tf3nginr.apps.googleusercontent.com";
const GOOGLE_CLIENT_SECRET = "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";
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000",
    },
    function (accessToken, refreshToken, profile, done) {
      userProfile = profile;
      localStorage.setItem("UserData", userProfile);
      console.log("__userProfile", userProfile);
      // return done(null, userProfile);
    }
  )
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
  function (req, res) {
    localStorage.setItem("UserData2", res);
    console.log("__res", res);
    res.redirect("/success");
    // Successful authentication, redirect success.
  }
);

// app.get(
//   "/auth/google/callback",
//   passport.authenticate("google", { failureRedirect: "/error" }),
//   function (req, res) {
//     console.log("__res2", res);
//     // Successful authentication, redirect success.
//     res.redirect("/success");
//   }
// );

var express = require('express');
var router = express.Router();
var userModel = require("./users.js");
var passport = require('passport');
var GoogleStrategy = require('passport-google-oidc');
require("dotenv").config();
passport.use(new GoogleStrategy({
  clientID: process.env['GOOGLE_CLIENT_ID'],
  clientSecret: process.env['GOOGLE_CLIENT_SECRET'],
  callbackURL: '/oauth2/redirect/google',
  scope: ['email','profile' ]
}, async function verify(issuer, profile,cb) {

  let exitingUser = await userModel.findOne({email : profile.emails[0].value });

  if(exitingUser)
  {
    return cb(null,exitingUser);
  }
  else
  {
    let newUser = await userModel.create({username : profile.name.givenName,email : profile.emails[0].value})
    return cb(null,newUser);
  }
}));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('login',);
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get("/profile",function(req,res)
{
  res.render('profile');
})
router.get('/login/federated/google', passport.authenticate('google'));

router.get('/oauth2/redirect/google', passport.authenticate('google', {
  successRedirect: '/profile',
  failureRedirect: '/login'
}));

module.exports = router;

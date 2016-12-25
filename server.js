var express = require('express');
var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;
var expressSession = require('express-session');

var app = express();

app.use(expressSession({ secret: 'mySecretKey' }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/auth/twitter', passport.authenticate('twitter'));

passport.use(new TwitterStrategy({
    consumerKey:  '0Cvs2271v1n34pekrjtnahqqE',
    consumerSecret: 'ecnydq4dUlZmkEwzH0hrkuJuF04cV4SiQSInovqSQWyI8LnV0s',
    callbackURL: "http://127.0.0.1:3000/auth/twitter/callback"
  },
  function(token, tokenSecret, profile, cb) {
    // User.findOrCreate({ twitterId: profile.id }, function (err, user) {
      return cb("", profile);
    // });
  }
));

app.get('/auth/twitter/callback',
  passport.authenticate('twitter', {
    successRedirect : '/profile',
    failureRedirect : '/twitterCanceled'
  }));

// route for showing the profile page
app.get('/profile', function(req, res) {
  console.log(req.user);
  res.render('profile.ejs', {
    user: req.user // get the user out of session and pass to template
  });
});

app.get('/twitterCanceled', function(req, res) {
  res.send("fail!");
});

// used to serialize the user for the session
passport.serializeUser(function(user, done) {
  done(null, user);
});

// used to deserialize the user
passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.get('/logout', function(req, res) {
  req.logout();
  res.redirect('/');
});

app.listen(3000);
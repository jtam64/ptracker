const express = require('express');
const passport = require('passport');

const router = express.Router();

const { forwardIfAuthenticated, ensureAuthenticated } = require('../middleware/checkAuth')

const FAILURE_LOGIN_URL = process.env.APP_URL + '/auth/login/error';



router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('.././');
});

// router.post('/login/email',
//     passport.authenticate('local', {
//         failureRedirect: '/', successRedirect: '/dashboard',
//     }));

// router.post('/login/email',
//     passport.authenticate('local', { failureRedirect: './', failureMessage: true }),
//     function (req, res) {
//         console.log(`test redirect baseurl`)
//         console.log(req.originalUrl)
//         console.log(req.baseUrl)
//         console.log(req.url)
//         console.log(req.headers)
//         console.log(req.path)
//         console.log(req.hostname)
//         res.redirect(process.env.APP_URL + '/dashboard');
//     });

// router.post("/login/email",
//  function(req,res,next){
//    passport.authenticate("local", function(err, user, info){
//     console.log("/login/email error:",err);
//     console.log("user:",user);
//     console.log("info:",info);
//     // handle succes or failure

//   })(req,res,next); 
// })

// router.post('/login/email', passport.authenticate('local'), 
// function(req, res) {
//     console.log("parse", req.user);
// });

router.get('/login', function (req, res, next) {
    res.render('auth/login');
});

router.get('/google', passport.authenticate('google', {
    scope: [
        'profile',
        'email',
    ]
}));

router.get('/login/error', (req, res) => {
    res.send('Error logging in');
});

router.get('/google/callback', passport.authenticate('google', { failureRedirect: FAILURE_LOGIN_URL }), (req, res) => {
    res.redirect('/dashboard');
});

module.exports = router;

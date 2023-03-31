/**
 * @fileoverview This file exports an Express router that handles authentication-related routes.
 * @module routes/authRoutes
 */

const express = require('express');
const passport = require('passport');

const router = express.Router();

const { forwardIfAuthenticated, ensureAuthenticated } = require('../middleware/checkAuth')

const FAILURE_LOGIN_URL = process.env.APP_URL + '/auth/login/error';

/**
 * Route for logging out the current user and redirecting to the home page.
 * @name GET auth/logout
 * @function
 * @memberof module:routes/auth
 * @param {callback} callback - Callback function that logs the user out and redirects to the home page.
 */
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

/**
 * Route for rendering the login page.
 * @name GET auth/login
 * @function
 * @memberof module:routes/auth
 * @param {callback} callback - Callback function that renders the login page.
 */
router.get('/login', function (req, res, next) {
    res.render('auth/login');
});

/**
 * Route for initiating a Google OAuth2.0 authentication flow.
 * @name GET auth/google
 * @function
 * @memberof module:routes/auth
 * @param {middleware} passport.authenticate - Middleware function that initiates a Google OAuth2.0 authentication flow.
 * @param {string[]} scope - The permissions to request from the user's Google account.
 */
router.get('/google', passport.authenticate('google', {
    scope: [
        'profile',
        'email',
    ]
}));

router.get('/login/error', (req, res) => {
    res.send('Error logging in');
});

/**
 * Route for handling the callback from a successful Google OAuth2.0 authentication flow.
 * @name GET auth/google/callback
 * @function
 * @memberof module:routes/auth
 * @param {middleware} passport.authenticate - Middleware function that completes the Google OAuth2.0 authentication flow.
 * @param {string} failureRedirect - The URL to redirect to if authentication fails.
 * @param {callback} callback - Callback function that redirects to the dashboard upon successful authentication.
 */
router.get('/google/callback', passport.authenticate('google', { failureRedirect: FAILURE_LOGIN_URL }), (req, res) => {
    res.redirect('/dashboard');
});

module.exports = router;


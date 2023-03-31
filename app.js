/**
 * @fileOverview This module represents the entry point for the application. It sets up the middleware, routes, and logging for the application.
 * @module app
 * @requires dotenv
 * @requires http-errors
 * @requires path
 * @requires express
 * @requires cookie-session
 * @requires express-session
 * @requires express-ejs-layouts
 * @requires ./auth/passport
 * @requires ./middleware/passUser
 * @requires ./middleware/flashMessages
 * @requires ./middleware/sectionChecker
 * @requires ./middleware/ndaChecker
 * @requires ./routes/authRoutes
 * @requires ./routes/indexRoutes
 * @requires ./routes/shiftRoutes
 * @requires ./routes/dataRoutes
 * @requires ./routes/adminRoutes
 * @requires ./routes/emailRoutes
 * @requires ./routes/instructorRoutes
 * @requires method-override
 * @requires morgan
 * @requires cors
 */

require('dotenv').config();
const createError = require('http-errors');
const path = require('path');
const express = require('express');
const cookieSession = require('cookie-session');
const session = require('express-session');
const ejsLayouts = require('express-ejs-layouts');
const passport = require('./auth/passport');
const passUser = require('./middleware/passUser');
const flashMessages = require('./middleware/flashMessages');
const sectionChecker = require('./middleware/sectionChecker');
const ndaChecker = require('./middleware/ndaChecker');
const authRouter = require('./routes/authRoutes');
const indexRouter = require('./routes/indexRoutes');
const shiftRouter = require('./routes/shiftRoutes');
const dataRouter = require('./routes/dataRoutes');
const adminRouter = require('./routes/adminRoutes');
const emailRouter = require('./routes/emailRoutes');
const instructorRouter = require('./routes/instructorRoutes');
const methodOverride = require('method-override');
const logger = require('morgan');
const cors = require('cors');

const app = express();

// const {PrismaClient} = require('@prisma/client');
// const prisma = new PrismaClient();
// const User = require('../models/user');

// const initializePassport = require('./auth/passport')
// initializePassport(
//     passport,
//     email => prisma.user.find(user => user.email === email),
//     id => prisma.user.findUnique(user => user.id)
// )

/**
 * Import passport library.
 * @const {Object} passport
 * @see {@link https://www.npmjs.com/package/passport}
 */

require('./auth/passport');
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public'), { redirect: true }));

if (process.env.NODE_ENV !== 'test') {
app.use(logger('dev'));
}

/**
 * Use ejsLayouts for the views.
 * @name use ejsLayouts
 * @function
 * @memberof module:app
 */

app.use(ejsLayouts);

/**
 * Use JSON body parsing.
 * @name use json
 * @function
 * @memberof module:app
 */

app.use(express.json());

/**
 * Use urlencoded body parsing.
 * @name use urlencoded
 * @function
 * @memberof module:app
 */

app.use(express.urlencoded({ extended: false }));

/**
 * Set the view engine to EJS.
 * @name set view engine
 * @function
 * @memberof module:app
 */

app.set('view engine', 'ejs');


app.use(cookieSession({
maxAge: 24 * 60 * 60 * 1000,
keys: [process.env.COOKIE_KEY],
}));

/**
 * Use cors.
 * @name use cors
 * @function
 * @memberof module:app
 */


app.use(cors());

/**
 * Use cookieSession.
 * @name use cookieSession
 * @function
 * @memberof module:app
 */


app.use(cookieSession({
secret: 'melody hensley is my spirit animal',
resave: false,
saveUninitialized: false,
cookie: {
httpOnly: true,
secure: false,
maxAge: 24 * 60 * 60 * 1000
}
}));


/**
 * Initialize Passport and use it for authentication.
 * @name use passport
 * @function
 * @memberof module:app
 */

app.use(passport.initialize());
app.use(passport.session());


app.use(passUser);
// app.post('/auth/login',
//     passport.authenticate('local', { failureRedirect: '/login', failureMessage: 'auth failed' }),
//     function (req, res) {
//         res.redirect('/dashboard');
//     });
app.use(flashMessages);
// app.use(sectionChecker);
// app.use(ndaChecker);

//Set up routes
app.use('/', indexRouter);
app.use('/shifts', shiftRouter);
app.use('/auth', authRouter);
app.use('/data', dataRouter);
app.use('/admin', adminRouter);
app.use('/email', emailRouter);
app.use('/instr_panel', instructorRouter);

/**
 * Handle 404 errors.
 * @name use 404 error handler
 * @function
 * @memberof module:app
 */

app.use((req, res, next) => {
next(createError(404));
});

module.exports = app;
/////////////////////////////
//         Imports        //
////////////////////////////
require('dotenv').config();
const createError = require('http-errors');
const path = require('path') // used to make a dynamic route for the 'public' folder
//DEBUG
// Express server
const express = require('express');
const cookieSession = require('cookie-session');
const session = require('express-session');
const ejsLayouts = require('express-ejs-layouts');

///////////////////////////////////
//          Middleware          //
//////////////////////////////////
const passport = require('./auth/passport');
const passUser = require('./middleware/passUser');
const flashMessages = require('./middleware/flashMessages');
const sectionChecker = require('./middleware/sectionChecker');
const ndaChecker = require('./middleware/ndaChecker');

////////////////////////////////
//          Routes           //
///////////////////////////////
const authRouter = require('./routes/authRoutes');
const indexRouter = require('./routes/indexRoutes');
const shiftRouter = require('./routes/shiftRoutes');
const dataRouter = require('./routes/dataRoutes')
const adminRouter = require('./routes/adminRoutes');
const emailRouter = require('./routes/emailRoutes');
const instructorRouter = require('./routes/instructorRoutes');

// Method Override
const methodOverride = require('method-override')

// Loggers and cors
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

require('./auth/passport');
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public'), { redirect: true }));

if (process.env.NODE_ENV !== 'test') {
    app.use(logger('dev'));
}


app.use(ejsLayouts)
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.set('view engine', 'ejs');
app.use(cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [process.env.COOKIE_KEY],
}));

app.use(cors());

app.use(cookieSession({
    secret: 'melody hensley is my spirit animal',
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        maxAge: 24 * 60 * 60 * 1000
    }
}
));

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


app.use('/', indexRouter);
app.use('/shifts', shiftRouter);
app.use('/auth', authRouter);
app.use('/data', dataRouter);
app.use('/admin', adminRouter);
app.use('/email', emailRouter);
app.use('/instr_panel', instructorRouter);

app.use((req, res, next) => {
    next(createError(404));
});

module.exports = app;

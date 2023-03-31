/**
 * @fileoverview This file exports an Express router that handles index-related routes.
 * @module routes/indexRoutes
 */

const express = require('express');
const passport = require('passport');

// Prisma
const {PrismaClient} = require("@prisma/client");
const prisma = new PrismaClient();

// Authentication
const {ensureAuthenticated, isInstructor} = require('../middleware/checkAuth')

// Date
const date = new Date()

// User and Section classes
const User = require('../models/user');
const Section = require('../models/section');
const Site = require('../models/site')

// Router
const router = express.Router();

/**
 * Returns an array of shifts for the current month.
 * @param {Array} shifts - An array of shift objects.
 * @returns {Array} An array of shifts for the current month.
 */
const getShifts = (shifts) => {
    const shiftsPerMonth = [];
    const currentMonthYear = `${convertMonth(date.getMonth())} ${date.getFullYear()}`
    if (shifts.length === 0) {
        return 0;
    }

    for (const shift of shifts) {
        const shiftMonth = new Date(shift.date)
        const monthYear = `${convertMonth(shiftMonth.getMonth())} ${shiftMonth.getFullYear()}`
        if (monthYear === currentMonthYear) {
            shiftsPerMonth.push(shift)
        }
    }
    return shiftsPerMonth;
}

/**
 * Converts a month number to the month name.
 * @param {number} monthNum - A month number.
 * @returns {string} A month name.
 */
const convertMonth = (monthNum) => {
    return [
        'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
    ][monthNum];
}

/**
 * Finds the name of a site based on its ID.
 * @async
 * @param {number} siteId - A site ID.
 * @returns {Promise<string>} The name of the site.
 */
const findNameOfSite = async (siteId) => {
    const findSite = await prisma.site.findUnique({
        where: {
            id: parseInt(siteId)
        }
    })

    return findSite.name;
}

/**
 * Finds the main site where a user is working based on their shifts.
 * @async
 * @function
 * @param {Array} shifts - An array of objects representing shifts worked by a user.
 * @returns {Promise<string|undefined>} A promise that resolves with the name of the user's main site or undefined if no shifts were provided.
 */
const findMainSite = async (shifts) => {
    const numOfShifts = {};
    let siteNum = [];
    for (const shift of shifts) {
        // console.log(Object.keys(numOfShifts).length)
        if (numOfShifts[shift.siteId] === undefined && shift.status !== 'DELETED') {
            numOfShifts[shift.siteId] = 1;
        } else {
            if (shift.status !== 'DELETED') {
                numOfShifts[shift.siteId] += 1;
            }
        }
    }
    for (const [key, value] of Object.entries(numOfShifts)) {
        if (siteNum.length === 0) {
            siteNum.push(key);
            siteNum.push(value);
        } else {
            if (value > siteNum[1]) {
                siteNum[0] = key;
                siteNum[1] = value;
            }
        }
    }
    if (siteNum.length !== 0) {
        return await findNameOfSite(parseInt(siteNum[0]));
    } else {
        return undefined;
    }
}

/**
 * Renders the index page.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.get('/', (req, res) => {
    res.render('./index', { page: 'index'})
})

/**
 * Renders the login page.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.get('/auth/login', (req, res) => {
    res.render('./auth/login', { page: 'login'})
})

/**
 * Renders the NDA page and sets session variables to indicate the NDA must be accepted.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.get('/nda', ensureAuthenticated, (req, res) => {
    req.session.error_message = 'You must accept the NDA to continue.';
    req.session.error_perm = true;

    res.render('nda', {
        page: 'nda',
    });
});

/**
 * Renders the pending section page if the user's section ID is 1. Otherwise, redirects to the dashboard.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.get('/pendingSection', ensureAuthenticated, (req, res) => {
    if (req.user.section.id !== 1) {
        return res.redirect('.././dashboard');
    }

    res.render('pendingSection', {
        page: 'assign',
    });
});

/**
 * Updates the user's acceptedNda status to true and redirects to the dashboard.
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.post('/nda', ensureAuthenticated, async (req, res) => {
    if (req.body.secret_nda_thing === 'yes-i-actually-used-the-button') {
        await User.update(req.user.id, {
            acceptedNda: true
        });

        req.session.success_message = 'Thanks for accepting the NDA!';
    }

    return res.redirect('/dashboard');
});

/**
 * Renders the dashboard page.
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.get('/dashboard', async (req, res) => {
    res.render('./dashboard', {
        page: 'dashboard',
    });
});

/**
 * Renders the calendar page with site and main site information.
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.get('/calendar', ensureAuthenticated, async (req, res) => {
    res.render('./calendar', {
        page: 'calendar',
        sites: await Site.all(),
        mainSite: await findMainSite(req.user.shifts),
    });
});

/**
 * Renders the FAQ page with site and main site information.
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.get('/faq', ensureAuthenticated, async (req, res) => {
    res.render('faq', {
        page: 'faq',
        sites: await Site.all(),
        mainSite: await findMainSite(req.user.shifts),
    });
});


/**
 * Renders the section overview page if the user is an instructor and assigned to a valid section. Otherwise, redirects to the dashboard with an error message.
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.get('/section', [ensureAuthenticated, isInstructor], async (req, res) => {
    const section = await Section.whereIsInstructor(req.user.id);
    if (!section) {
        req.session.error_message = 'You are not assigned to a section.';
        res.redirect(req.header('Referer') || '/dashboard');
    } else if (section.id === 1) {
        req.session.error_message = 'You are assigned to an invalid section. Please contact an administrator.';
        res.redirect(req.header('Referer') || '/dashboard');
    } else {
        res.render('././section/overview', {
            page: 'section',
            sectionName: section.name,
            sectionId: section.id,
            students: await User.allInSection(section.id),
        });
    }
});

/**
 * Renders the page to update a student's shifts.
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.get('/update/:id', ensureAuthenticated, async (req, res) => {
    const studentId = parseInt(req.params.id)
    const findUser = await User.find(studentId)
    const allShifts = getShifts(findUser.shifts)
    res.render('././section/updateStudent', {
        page: 'section',
        student: findUser,
        shifts: allShifts,
        sites: await Site.all(),
    });
})

/**
 * Updates a student's shifts and redirects to the section overview page.
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.post('/update/:id', async (req, res) => {
    const studentId = parseInt(req.params.id)
    const findUser = await User.find(studentId)
    for (const num in req.body.shiftID) {
        if (typeof(req.body.shiftID) === "string") {
            await prisma.shift.update({
                where: {
                    id: parseInt(req.body.shiftID)
                },
                data: {
                    date: new Date(req.body.date),
                    type: req.body.shiftType,
                    siteId: parseInt(req.body.site),
                }
            })
        } else {
            await prisma.shift.update({
                where: {
                    id: parseInt(req.body.shiftID[num])
                },
                data: {
                    date: new Date(req.body.date[num]),
                    type: req.body.shiftType[num],
                    siteId: parseInt(req.body.site[num]),
                }
            })
        }
    }

    if (req.body.date !== undefined) {
        req.session.success_message = `Shift updated successfully on ${req.body.date} for ${findUser.name}!`;
    }

    res.redirect('../section')
})

/**
 * Renders the page to add a site.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.get('/addSite', ensureAuthenticated, async (req, res) => {
    res.render('././admin/addSite', {
        page: 'admin',
    });
})


/**
 * Adds a new site to the database if the site input is not empty and redirects to the admin page.
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.post('/addSite', ensureAuthenticated, async (req, res) => {
    if (req.body.site.length !== 0) {
        await Site.create(req.body)
    } else {
        req.session.error_message = `You must input a valid site`;
    }
    res.redirect('././admin#tab3')
})

/**
 * Removes a student's section assignment and redirects to the section overview page.
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.post('/sectionDelete/:studentId', isInstructor, async (req, res) => {
    await prisma.user.update({
        where: {
            id: parseInt(req.params.studentId)
        },
        data: {
            sectionId: 1
        }
    })
    res.redirect('.././section')
})

/**
 * Sets a student's shift status to 'DELETED' and redirects to the student's shift update page.
 * @async
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.post('update/section/shiftDelete/:studentId/:shiftId', isInstructor, async (req, res) => {
    await prisma.shift.update({
        where: {
            id: parseInt(req.params.shiftId)
        },
        data: {
            status: 'DELETED',
        }
    });
    res.redirect(`././update/${parseInt(req.params.studentId)}`)
});

/// LOGIN ROUTES ///

/**
 * Authenticates a user's email and password and redirects to the dashboard upon successful login.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.post('/login/email',
    passport.authenticate('local', { failureRedirect: './error', failureMessage: true }),
    function (req, res) {
        console.log(`test redirect baseurl`)
        console.log(req.originalUrl)
        console.log(req.baseUrl)
        console.log(req.url)
        console.log(req.headers)
        console.log(req.path)
        console.log(req.hostname)
        res.redirect(process.env.APP_URL + '/dashboard');
    });

/**
 * Renders the failed login page with an error message.
 * @function
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.get('/login/error', (req, res) => {
    req.session.error_message = 'Invalid email or password.';
    res.render('auth/failed')
});

module.exports = router;


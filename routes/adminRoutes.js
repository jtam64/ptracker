/**
 * @fileoverview This file exports an Express router that handles admin-related routes.
 * @module routes/admin
 */

const express = require('express');
const router = express.Router();

const {check, validationResult} = require("express-validator");

const User = require("../models/user");
const Section = require("../models/section");
const Shift = require("../models/shift");
const Site = require("../models/site")

const {ensureAuthenticated, isAdmin, isInstructor} = require("../middleware/checkAuth");

const adminController = require("../controllers/adminController");

/**
 * Route for rendering the admin overview page.
 * @name GET admin/
 * @function
 * @memberof module:routes/admin
 * @param {middleware} ensureAuthenticated - Middleware function that ensures the user is authenticated.
 * @param {middleware} isAdmin - Middleware function that ensures the user is an admin.
 * @param {callback} callback - Callback function that renders the admin overview page.
 */

router.get('/', [ensureAuthenticated, isAdmin], async (req, res) => {
    res.render('admin/overview', {
        page: 'admin',
        users: await User.all(),
        sections: await Section.all(),
        sites: await Site.all(),
    });
});

/**
 * Route for rendering the resetPtracker page.
 * @name GET /resetPtracker
 * @function
 * @memberof module:routes/admin
 * @param {middleware} ensureAuthenticated - Middleware function that ensures the user is authenticated.
 * @param {middleware} isAdmin - Middleware function that ensures the user is an admin.
 * @param {callback} callback - Callback function that renders the resetPtracker page.
 */

router.get('/resetPtracker', [ensureAuthenticated, isAdmin], (req, res) => {
    res.render('admin/resetPtracker', {
        page: 'admin'
    })
})

/**
 * Route for handling the deletion of PTracker data.
 * @name POST /deletePtrackerData
 * @function
 * @memberof module:routes/admin
 * @param {middleware} ensureAuthenticated - Middleware function that ensures the user is authenticated.
 * @param {middleware} isAdmin - Middleware function that ensures the user is an admin.
 * @param {callback} callback - Callback function that calls the resetPtracker function in the adminController.
 */


router.post('/deletePtrackerData', [ensureAuthenticated, isAdmin], async(req, res) => {
    return adminController.resetPtracker(req, res)
})

/**
 * Route for changing a user's role.
 * @name POST /changeRole
 * @function
 * @memberof module:routes/admin
 * @param {middleware} check - Middleware function that validates the input.
 * @param {string} check.userId - The user ID to modify the role of.
 * @param {string} check.role - The new role of the user.
 * @param {callback} callback - Callback function that calls the changeRole function in the adminController.
 */

router.post(
    '/changeRole',
    [
        check('userId').isInt(),
        check('role').isIn(['STUDENT', 'INSTRUCTOR', 'ADMIN']),
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            let err = '';
            for (const error of errors.array()) {
                err += `invalid value for ${error.param}`
            }
            req.session.error_message = `Invalid input: ${err}!`;
            return res.redirect('.././admin');
        }

        return adminController.changeRole(req, res, req.body.userId, req.body.role);
    }
);

/**
 * Route for changing a user's section.
 * @name POST /changeSection
 * @function
 * @memberof module:routes
 * @param {middleware} check - Middleware function that validates the input.
 * @param {string} check.userId - The user ID to modify the section of.
 * @param {string} check.section - The new section of the user.
 * @param {callback} callback - Callback function that calls the changeSection function in the adminController.
 */


router.post(
    '/changeSection',
    [
        check('userId').isInt(),
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            let err = '';
            for (const error of errors.array()) {
                err += `invalid value for ${error.param}`
            }
            req.session.error_message = `Invalid input: ${err}!`;
            return res.redirect('.././admin');
        }

        return adminController.changeSection(req, res, req.body.userId, req.body.section);
    }
);


/**
 * Route for changing the instructor of a section.
 * @name POST /changeSectionInstructor
 * @function
 * @memberof module:routes/admin
 * @param {middleware} check - Middleware function that validates the input.
 * @param {string} check.sectionId - The ID of the section to modify the instructor of.
 * @param {string} check.instructor - The ID of the new instructor of the section.
 * @param {callback} callback - Callback function that calls the changeSectionInstructor function in the adminController.
 */ 


router.post(
    '/changeSectionInstructor',
    [
        check('sectionId').isInt(),
        check('instructor').isInt(),
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            let err = '';
            for (const error of errors.array()) {
                err += `invalid value for ${error.param}`
            }
            req.session.error_message = `Invalid input: ${err}!`;
            return res.redirect('.././admin#tab4');
        }

        return adminController.changeSectionInstructor(req, res, req.body.sectionId, req.body.instructor);
    }
);

/**
 * Route for deleting a user.
 * @name GET /userDelete/:id
 * @function
 * @memberof module:routes/admin
 * @param {middleware} ensureAuthenticated - Middleware function that ensures the user is authenticated.
 * @param {middleware} isAdmin - Middleware function that ensures the user is an admin.
 * @param {string} id - The ID of the user to delete.
 * @param {callback} callback - Callback function that calls the userDelete function in the adminController.
 */


router.get(
    '/userDelete/:id',
    [
        ensureAuthenticated,
        isAdmin
    ],
    async (req, res) => {
        return adminController.userDelete(req, res, req.params.id);
});

/**
 * Route for deleting a site.
 * @name POST /siteDelete/:id
 * @function
 * @memberof module:routes/admin
 * @param {middleware} isInstructor - Middleware function that ensures the user is an instructor.
 * @param {string} id - The ID of the site to delete.
 * @param {callback} callback - Callback function that calls the delete function of the Site model and redirects to the admin page.
 */

router.post('/siteDelete/:id', isInstructor, async (req, res) => {
    await Site.delete(req.params.id);
    res.redirect('../../admin#tab3');
});

/**
 * Route for adding a new section.
 * @name POST /addSection
 * @function
 * @memberof module:routes/admin
 * @param {callback} callback - Callback function that calls the create function of the Section model and redirects to the admin page.
 */


router.post('/addSection', async (req, res) => {
    await Section.create(req.body.sectionName, req.body.sectionInstructor);
    res.redirect('.././admin#tab4');
});

/**
 * Route for deleting a section.
 * @name DELETE /deleteSection/:id/:length
 * @function
 * @memberof module:routes/admin
 * @param {string} id - The ID of the section to delete.
 * @param {string} length - The number of sections in the system.
 * @param {callback} callback - Callback function that calls the delete function of the Section model and redirects to the admin page.
 */

router.delete('/deleteSection/:id/:length', async (req, res) => {
    if (req.params.length > 2) {
        await Section.delete(req.params.id);
        res.redirect('../../../admin#tab4');
    }
    else {
        // Do not allow deletion of sections if there is only 1 section left, otherwise you will not be able to access admin features
        // Note that we check if sectionsLength is > 2 because the default "Pending Users Section" counts as one. 
        req.session.error_message = 'Failed to delete section: At least 1 section must be active.'
        res.redirect('../../../admin#tab4');
    }
});

module.exports = router;

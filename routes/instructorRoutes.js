/**
 * @fileoverview This file exports an Express router that handles instructor-related routes.
 * @module routes/instructorRoutes
 */

const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator');

const User = require('../models/user');
const Section = require('../models/section');
const Site = require('../models/site');

const { ensureAuthenticated, isInstructor } = require('../middleware/checkAuth');

const instructorController = require('../controllers/instructorController');

/**
 * Route for rendering the instructor panel view with a list of all users, sections and sites.
 * @name GET instructor/
 * @function
 * @async
 * @memberof module:routes/instructorRoutes
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
router.get('/', [ensureAuthenticated, isInstructor], async (req, res) => {
    res.render('././instr_panel', {
        page: 'instr_panel',
        users: await User.all(),
        sections: await Section.all(),
        sites: await Site.all(),
    });
});

/**
 * Route for changing a user's section.
 * @name POST instructor/changeSection
 * @function
 * @memberof module:routes/instructorRoutes
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @param {number} req.body.userId - The user id to update the section for.
 * @param {number} req.body.section - The new section id.
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
            return res.redirect('././instr_panel');
        }

        return instructorController.changeSection(req, res, req.body.userId, req.body.section);
    }
);

module.exports = router;
/**
 * @fileoverview This file exports an Express router that handles email-related routes.
 * @module routes/emailRoutes
 */

const express = require('express');
const router = express.Router();

const emailController = require('../controllers/emailController');

const Email = require("../classes/email");

/**
 * Route for changing email status.
 * @name POST email/changeEmailStatus/:userId
 * @function
 * @memberof module:routes/emailRoutes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {number} req.user.id - User id
 * @returns {Promise} - Promise representing the result of the emailController.changeEmailStatus function.
 */
router.post('/changeEmailStatus/:userId', async (req,res) => {
    return emailController.changeEmailStatus(req, res, req.user.id);
});

/**
 * Route for sending a notification email to admins about a new user registration.
 * @name POST email/newUser
 * @function
 * @memberof module:routes/emailRoutes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise} - Promise representing the result of the Email.sendToAdmins function.
 */
router.post('/newUser', async (req, res) => {
    res.sendStatus(200);

    await Email.sendToAdmins(
        'PTracker - New user registered',
        `Hi, a new user has signed up for PTracker. Please assign them to a section. Name: ${req.body.name}`,
    );
});

/**
 * Route for sending a welcome email to a user who has been assigned a section.
 * @name POST email/userAssignedSection
 * @function
 * @memberof module:routes/emailRoutes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {string} req.body.sendTo - Email address of the user
 * @param {string} req.body.sectionName - Name of the section
 * @returns {Promise} - Promise representing the result of the Email.send function.
 */
router.post('/userAssignedSection', async (req, res) => {
    res.sendStatus(200);

    await Email.send(
        req.body.sendTo,
        'PTracker - Welcome',
        `Hi, you have been assigned the: ${req.body.sectionName} section.`,
    );
});

/**
 * Route for sending a notification email to admins about an instructor being deleted from the application.
 * @name POST email/instructorDeleted
 * @function
 * @memberof module:routes/emailRoutes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {string} req.body.name - Name of the deleted instructor
 * @returns {Promise} - Promise representing the result of the Email.sendToAdmins function.
 */
router.post('/instructorDeleted', async (req, res) => {
    res.sendStatus(200);

    await Email.sendToAdmins(
        'PTracker - Instructor deleted',
        `Hi, the instructor named ${req.body.name} has been deleted from the application.`,
    );
});

/**
 * Route for sending an email to all section instructors when a student creates a shift.
 * @name POST email/shiftCreated
 * @function
 * @memberof module:routes/emailRoutes
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise} - A promise that resolves to the sendToSectionInstructor function in the Email class.
 */
router.post('/shiftCreated', async (req, res) => {
    res.sendStatus(200);

    await Email.sendToSectionInstructor(
        req.body.sectionId,
        'PTracker - Student shift created',
        `Hi, ${req.body.studentName} has created a ${req.body.shiftType} shift on ${req.body.shiftDate}.`,
    );
});

/**
 * Route for sending an email to the instructor of a section when a student's shift is updated.
 * @name POST email/shiftUpdated
 * @function
 * @memberof module:routes/emailRoutes
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.post('/shiftUpdated', async (req, res) => {
    res.sendStatus(200);

    await Email.sendToSectionInstructor(
        req.body.sectionId,
        'PTracker - Student shift updated',
        `Hi, ${req.body.studentName} has modified their shift on ${req.body.shiftDate}.`,
    );
});

/**
 * Route for sending an email to the instructor of a section when a student's shift is deleted.
 * @name POST email/shiftDeleted
 * @function
 * @memberof module:routes/emailRoutes
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
router.post('/shiftDeleted', async (req, res) => {
    res.sendStatus(200);

    await Email.sendToSectionInstructor(
        req.body.sectionId,
        'PTracker - Student shift deleted',
        `Hi, ${req.body.studentName} has deleted a shift on ${req.body.shiftDate}.`,
    );
});

module.exports = router;

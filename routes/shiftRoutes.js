/**
 * @fileoverview This file exports an Express router that handles shift-related routes.
 * @module routes/shiftRoutes
 */

const express = require('express');
const router = express.Router();

const {check, validationResult} = require('express-validator');
const shiftController = require('../controllers/shiftController');

/**
 * Route for creating a new shift.
 * @name POST /shifts/
 * @function
 * @memberof module:routes/shiftRoutes
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise} Promise representing the result of the create operation.
 */
router.post(
    '/',
    [
        check('userId').isInt(),
        check('siteId').isInt(),
        check('date').isDate({
            format: 'YYYY-MM-DD'
        }),
        check('type').isIn(['DAY', 'EVENING', 'NIGHT']),
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            let err = '';
            for (const error of errors.array()) {
                err += `invalid value for ${error.param}`;
            }
            req.session.error_message = `Invalid shift data: ${err}!`;
            return res.redirect('././calendar');
        }

        return shiftController.create(req, res, req.body);
    }
);

/**
 * Route for updating an existing shift.
 * @name PUT /shifts/:id
 * @function
 * @memberof module:routes/shiftRoutes
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise} Promise representing the result of the update operation.
 */
router.put(
    '/:id',
    [
        check('userId').isInt(),
        check('siteId').isInt(),
        check('date').isDate(),
        check('type').isIn(['DAY', 'EVENING', 'NIGHT']),
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            let err = '';
            for (const error of errors.array()) {
                err += `invalid value for ${error.param}`;
            }
            req.session.error_message = `Invalid shift data: ${err}!`;
            return res.redirect('././calendar');
        }

        return shiftController.update(req, res, req.params.id, req.body);
    }
);

/**
 * Route for deleting an existing shift.
 * @name DELETE /shifts/delete/:id
 * @function
 * @memberof module:routes/shiftRoutes
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @returns {Promise} Promise representing the result of the delete operation.
 */
router.delete(
    '/delete/:id',
    async (req, res) => {
        return shiftController.del(req, res, req.params.id, req.user);
    }
);

module.exports = router;

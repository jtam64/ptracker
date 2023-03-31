/**
 * @fileoverview This file exports an Express router that handles data-related routes.
 * @module routes/dataRoutes
 */

const express = require('express');
const router = express.Router();

const dataController = require('../controllers/dataController');

/**
 * Route for getting a student's sites for the dashboard.
 * @name GET data/dashboardStudentSites
 * @function
 * @memberof module:routes/data
 * @param {callback} callback - Callback function that calls the dashboardStudentSites function in the dataController.
 */
router.get("/dashboardStudentSites", async (req, res) => {
    return dataController.dashboardStudentSites(req, res, req.user, req.query.start);
});

/**
 * Route for getting a student's shifts for the dashboard.
 * @name GET data/dashboardShifts
 * @function
 * @memberof module:routes/data
 * @param {callback} callback - Callback function that calls the dashboardShifts function in the dataController.
 */
router.get("/dashboardShifts", async (req, res) => {
    return dataController.dashboardShifts(req, res, req.user);
});

/**
 * Route for getting all shifts for an instructor or admin.
 * @name GET data/allShifts
 * @function
 * @memberof module:routes/data
 * @param {callback} callback - Callback function that calls the allShifts function in the dataController.
 */
router.get('/allShifts', async (req, res) => {
    return dataController.allShifts(req, res, req.user);
});

module.exports = router;

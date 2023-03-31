/**
 * Launches the app in Docker and runs the tests with `npm test`.
 */

// IMPORTS
// Modules
const assert = require("assert");
const request = require("request");
const chai = require("chai");

// TESTS

/**
 * Test suite for App redirects.
 */
describe("App redirects", function() {
    /**
     * Test if index page loads correctly.
     */
    it("checks if index shows correctly", function(done) {
        request.get("http://localhost:8007", function(err, res, body) {
            chai.expect(res.statusCode).to.equal(200);
            done();
        })
    });

    /**
     * Test if login button redirects to login page.
     */
    it("checks if login button redirects to login", function(done) {
        request.get("http://localhost:8007/auth/login", function(err, res, body) {
            chai.expect(res.statusCode).to.equal(200);
            chai.expect(body).to.include("email");
            done();
        })
    })
});

/**
 * Test suite for checking shifts.
 */
describe("Checking shifts", function() {
    /**
     * Test if calendar returns the correct view.
     */
    it("checks calendar return the correct view", function(done) {
        request.get("http://localhost:8007/calendar", function(err, res, body) {
            chai.expect(res.statusCode).to.equal(200);
            chai.expect(body).to.include("Mon");
            done();
        })
    })
});

/**
 * Test suite for checking the FAQ.
 */
describe("Checking FAQ", function() {
    /**
     * Test if FAQ returns the correct view.
     */
    it("checks if FAQ returns correct view", function(done) {
        request.get("http://localhost:8007/faq", function(err, res, body) {
            chai.expect(res.statusCode).to.equal(200);
            done();
        })
    })
});

/**
 * Test suite for checking the dashboard.
 */
describe("Checks dashboard", function() {
    /**
     * Test if dashboard returns the correct view.
     */
    it("checks if dashboard returns correct view", function(done) {
        request.get("http://localhost:8007/dashboard", function(err, res, body) {
            chai.expect(res.statusCode).to.equal(200);
            chai.expect(body).to.include("calendar-container");
            done();
        })
    })
});

/**
 * Test suite for checking the section.
 */
describe("Check section", function() {
    /**
     * Test if section returns the correct view.
     */
    it("checks if section returns correct view", function(done) {
        request.get("http://localhost:8007/section", function(err, res, body) {
            chai.expect(res.statusCode).to.equal(200);
            done();
        })
    });

    /**
     * Test if update returns the correct view.
     */
    it("checks if update returns correct view", function(done) {
        request.get("http://localhost:8007/update/109", function(err, res, body) {
            chai.expect(res.statusCode).to.equal(200);
            done();
        })
    })
});

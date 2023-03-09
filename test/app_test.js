// Launch APP in docker, login as dev, run the tests with `npm test`


// IMPORTS
// Modules
const assert = require("assert");
const request = require("request");
const chai = require("chai");


// TESTS
describe("App redirects", function() {
    it("checks if index shows correctly", function(done) {
        request.get("http://localhost:8007", function(err, res, body) {
            chai.expect(res.statusCode).to.equal(200);
            done();
        })
    })
    it("checks if login button redirects to login", function(done) {
        request.get("http://localhost:8007/auth/login", function(err, res, body) {
            chai.expect(res.statusCode).to.equal(200);
            chai.expect(body).to.include("email")
            done();
        })
    })
});

describe("Checking shifts", function() {
    it("checks calendar return the correct view", function(done) {
        request.get("http://localhost:8007/calendar", function(err, res, body) {
            chai.expect(res.statusCode).to.equal(200);
            chai.expect(body).to.include("Mon")
            done();
        })
    })
});

describe("Checking FAQ", function() {
    it("checks if FAQ returns correct view", function(done) {
        request.get("http://localhost:8007/faq", function(err, res, body) {
            chai.expect(res.statusCode).to.equal(200);
            done();
        })
    })
});

describe("Checks dashboard", function() {
    it("checks if dashboard returns correct view", function(done) {
        request.get("http://localhost:8007/dashboard", function(err, res, body) {
            chai.expect(res.statusCode).to.equal(200);
            chai.expect(body).to.include("calendar-container")
            done();
        })
    })
});

describe("Check section", function() {
    it("checks if section returns correct view", function(done) {
        request.get("http://localhost:8007/section", function(err, res, body) {
            chai.expect(res.statusCode).to.equal(200);
            done();
        })
    });
    it("checks if update returns correct view", function(done) {
        request.get("http://localhost:8007/update/109", function(err, res, body) {
            chai.expect(res.statusCode).to.equal(200);
            done();
        })
    })
});
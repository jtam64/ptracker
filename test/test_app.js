// TESTING IMPORTS
const assert = require("assert");

// WEB APP IMPORTS
const app = require("../app");

// SESSION DATA
const sesh = request.send({"email": "dev@bcit.ca", "secret": "melody hensley is my spirit animal"})

describe("Array", function() {
	  describe("#indexOf()", function() {
	it("should return -1 when the value is not present", function() {
	  assert.equal([1, 2, 3].indexOf(4), -1);
	});
  });
});

describe("Redirect to login", function() {
	it("should redirect to login", function() {
		assert.equal(app.get('/'), '/auth/login');
	});
})
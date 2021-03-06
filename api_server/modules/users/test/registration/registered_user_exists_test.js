'use strict';

const RegistrationTest = require('./registration_test');

class RegisteredUserExistsTest extends RegistrationTest {

	get description () {
		return 'should return an object exists error when registering an email that already exists as a registerd and confirmed user';
	}

	getExpectedFields () {
		return null;
	}

	getExpectedError () {
		return {
			code: 'RAPI-1004'
		};
	}

	// before the test runs...
	before (callback) {
		// create a user, we'll then try to register with that same user's email
		this.userFactory.createRandomUser((error, data) => {
			if (error) { return callback(error); }
			this.data = this.userFactory.getRandomUserData();
			this.data.email = data.user.email;
			callback();
		});
	}
}

module.exports = RegisteredUserExistsTest;

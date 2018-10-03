'use strict';

const Assert = require('assert');
const CodeStreamAPITest = require(process.env.CS_API_TOP + '/lib/test_base/codestream_api_test');
const UserTestConstants = require('../user_test_constants');

class ConfirmationTest extends CodeStreamAPITest {

	constructor (options) {
		super(options);
		this.userOptions = this.userOptions || {};
	}
	
	get description () {
		return 'should return valid user data and an access token when confirming a registration';
	}

	get method () {
		return 'post';
	}

	get path () {
		return '/no-auth/confirm';
	}

	getExpectedFields () {
		return UserTestConstants.EXPECTED_LOGIN_RESPONSE;
	}

	dontWantToken () {
		return true;	// don't need a registered user with a token for this test
	}

	// before the test runs...
	before (callback) {
		// register a random user, they will be unconfirmed and we will confirm for the test
		this.userFactory.registerRandomUser((error, data) => {
			if (error) { return callback(error); }
			// form the data to send with the confirmation request
			this.userId = data.user._id;
			this.data = {
				email: data.user.email
			};
			if (this.userOptions.wantLink) {
				this.data.token = data.user.confirmationToken;
			}
			else {
				this.data.confirmationCode = data.user.confirmationCode;
			}
			this.beforeConfirmTime = Date.now();	// to confirm registeredAt set during the request
			callback();
		}, this.userOptions || {});
	}

	// validate the response to the test request
	validateResponse (data) {
		// validate that we got back the expected user, with an access token and pubnub key
		let user = data.user;
		let errors = [];
		let result = (
			((user.email === this.data.email) || errors.push('incorrect email')) &&
			((user._id === this.userId) || errors.push('incorrect user id')) &&
			((user.isRegistered ) || errors.push('isRegistered not set')) &&
			((typeof user.registeredAt === 'number' && user.registeredAt > this.beforeConfirmTime) || errors.push('registeredAt not properly set'))
		);
		Assert(result === true && errors.length === 0, 'response not valid: ' + errors.join(', '));
		Assert(data.accessToken, 'no access token');
		Assert(data.pubnubKey, 'no pubnub key');
		Assert(data.pubnubToken, 'no pubnub token');
		this.validateSanitized(user, UserTestConstants.UNSANITIZED_ATTRIBUTES_FOR_ME);
	}
}

module.exports = ConfirmationTest;

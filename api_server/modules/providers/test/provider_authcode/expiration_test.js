'use strict';

const ProviderAuthCodeTest = require('./provider_authcode_test');
const TokenHandler = require(process.env.CSSVC_BACKEND_ROOT + '/shared/server_utils/token_handler');
const Assert = require('assert');

class ExpirationTest extends ProviderAuthCodeTest {

	constructor (options) {
		super(options);
		this.expiresIn = 1000;
	}

	get description () {
		return 'returned auth code should fail verification if expired';
	}

	before (callback) {
		super.before(error => {
			if (error) { return callback(error); }
			this.path += '&expiresIn=' + this.expiresIn;
			callback();
		});
	}

	run (callback) {
		super.run(error => {
			if (error) { return callback(error); }
			setTimeout(() => {
				try {
					new TokenHandler(this.apiConfig.sharedSecrets.auth).verify(this.response.code);
				}
				catch (error) {
					Assert.equal(error.name, 'TokenExpiredError', 'did not receive expiration error');
					return callback();
				}
				Assert.fail('payload not expired');
			}, this.expiresIn + 1000);
		});
	}
}

module.exports = ExpirationTest;

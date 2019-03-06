'use strict';

const APIRequest = require(process.env.CS_API_TOP + '/lib/api_server/api_request.js');
const LoginCore = require(process.env.CS_API_TOP + '/modules/users/login_core');
const WebErrors = require('./errors');

class WebSigninRequest extends APIRequest {

	async authorize () {
		// no authorization needed
	}

	async process () {
		const { email, password } = this.request.body;
		if (!email || !password) {
			return this.loginError();
		}

		// attempt to login with email and password, and fetch the user
		try {
			this.user = await new LoginCore({
				request: this
			}).login(email, password);
		}
		catch (error) {
			return this.loginError();
		}

		// send a cookie in the response
		if (!this.issueCookie()) {
			return this.loginError();
		}

		// now we can go to the intended url, if any
		this.finishFlow();
	}

	loginError () {
		const error = WebErrors.invalidLogin.code;
		const email = encodeURIComponent(this.request.body.email || '');
		const url = encodeURIComponent(this.request.body.finishUrl || '');
		const redirect = `/web/login?error=${error}&email=${email}&url=${url}`;
		this.response.redirect(redirect);
		this.responseHandled = true;
	}

	issueCookie () {
		this.token = 
			(this.user.get('accessTokens') || {}) &&
			(this.user.get('accessTokens').web || {}) &&
			this.user.get('accessTokens').web.token;
		if (!this.token) {
			return false;
		}

		this.response.cookie('t', this.token, {
			secure: true,
			signed: true
		});
		return true;
	}

	finishFlow () {
		if (this.request.body.finishUrl) {
			this.response.redirect(this.request.body.finishUrl);
		}
		else {
			this.response.redirect('/web/finish');
		}
		this.responseHandled = true;
	}
}

module.exports = WebSigninRequest;

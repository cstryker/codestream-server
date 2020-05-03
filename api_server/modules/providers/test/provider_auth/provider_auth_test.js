'use strict';

const CodeStreamAPITest = require(process.env.CS_API_TOP + '/lib/test_base/codestream_api_test');
const BoundAsync = require(process.env.CS_API_TOP + '/server_utils/bound_async');
const Assert = require('assert');
const OktaConfig = require(process.env.CS_API_TOP + '/config/okta');
const ApiConfig = require(process.env.CS_API_TOP + '/config/config');
const RandomString = require('randomstring');
const TokenHandler = require(process.env.CS_API_TOP + '/server_utils/token_handler');

class ProviderAuthTest extends CodeStreamAPITest {

	constructor (options) {
		super(options);
		this.userOptions.numRegistered = 1;
		this.apiRequestOptions = {
			noJsonInResponse: true,
			expectRedirect: true
		};
	}

	get description () {
		let description = `should provide the appropriate redirect, when initiating an authorization flow to ${this.provider}`;
		if (this.testHost) {
			description += ', enterprise version';
		}
		return description;
	}

	get method () {
		return 'get';
	}

	// before the test runs...
	before (callback) {
		BoundAsync.series(this, [
			super.before,
			this.addTestHost,
			this.getAuthCode
		], callback);
	}

	// add a test-host for testing enterprise connections, as needed
	addTestHost (callback) {
		if (!this.testHost) {
			return callback();
		}
		const starredHost = this.testHost.replace(/\./g, '*');
		this.doApiRequest(
			{
				method: 'put',
				path: '/teams/' + this.team.id,
				data: {
					providerHosts: {
						[this.provider]: {
							[starredHost]: {
								appClientId: 'testClientId',
								appClientSecret: 'testClientSecret'
							}
						}
					}
				},
				token: this.token
			},
			callback
		);
	}

	// get an auth-code for initiating the authorization flow
	getAuthCode (callback) {
		this.doApiRequest(
			{
				method: 'get',
				path: '/provider-auth-code?teamId=' + this.team.id,
				token: this.currentUser.accessToken
			},
			(error, response) => {
				if (error) { return callback(error); }
				this.authCode = response.code;
				this.path = `/no-auth/provider-auth/${this.provider}?code=${this.authCode}`;
				if (this.provider === 'jiraserver') {
					this.mockToken = RandomString.generate(12);
					this.mockTokenSecret = RandomString.generate(12);
					this.path += `&_mockToken=${this.mockToken}&_mockTokenSecret=${this.mockTokenSecret}&_secret=${encodeURIComponent(ApiConfig.getPreferredConfig().secrets.confirmationCheat)}`;
				}
				const authOrigin = this.provider === 'youtrack' ? `${ApiConfig.getPreferredConfig().api.publicApiUrl}/no-auth` : ApiConfig.getPreferredConfig().api.authOrigin;
				this.redirectUri = `${authOrigin}/provider-token/${this.provider}`;
				this.state = `${ApiConfig.getPreferredConfig().api.callbackEnvironment}!${this.authCode}`;
				const testHost = this.testRequestHost || this.testHost;
				if (testHost) {
					this.path += `&host=${testHost}`;
					this.state += `!${testHost}`;
				}
				callback();
			}
		);
	}

	validateResponse (data) {
		let redirectData;
		switch (this.provider) {
		case 'trello':
			redirectData = this.getTrelloRedirectData(); 
			break;
		case 'github':
		case 'github_enterprise': 
			redirectData = this.getGithubRedirectData();
			break;
		case 'asana':
			redirectData = this.getAsanaRedirectData();
			break;
		case 'jira':
			redirectData = this.getJiraRedirectData();
			break;
		case 'jiraserver':
			redirectData = this.getJiraServerRedirectData();
			break;
		case 'gitlab':
		case 'gitlab_enterprise': 
			redirectData = this.getGitlabRedirectData();
			break;
		case 'bitbucket':
			redirectData = this.getBitbucketRedirectData();
			break;
		case 'youtrack':
			redirectData = this.getYouTrackRedirectData();
			break;
		case 'azuredevops':
			redirectData = this.getAzureDevOpsRedirectData();
			break;
		case 'slack':
			redirectData = this.getSlackRedirectData();
			break;
		case 'msteams':
			redirectData = this.getMSTeamsRedirectData();
			break;
		case 'glip':
			redirectData = this.getGlipRedirectData();
			break;
		case 'okta':
			redirectData = this.getOktaRedirectData();
			break;
		default:
			throw `unknown provider ${this.provider}`;
		}
		const { url, parameters } = redirectData;
		const query = Object.keys(parameters)
			.map(key => `${key}=${encodeURIComponent(parameters[key])}`)
			.join('&');
		const expectedUrl = `${url}?${query}`;
		Assert.equal(data, expectedUrl, `redirect url not correct for ${this.provider}`);
	}

	getTrelloRedirectData () {
		this.redirectUri += `?state=${this.state}`;
		const parameters = {
			response_type: 'token',
			scope: 'read,write',
			expiration: 'never',
			name: 'CodeStream',
			callback_method: 'fragment',
			return_url: this.redirectUri,
			key: ApiConfig.getPreferredConfig().trello.apiKey
		};
		const url = 'https://trello.com/1/authorize';
		return { url, parameters };
	}

	getGithubRedirectData () {
		const appClientId = this.testHost ? 'testClientId' : ApiConfig.getPreferredConfig().github.appClientId;
		const parameters = {
			client_id: appClientId,
			redirect_uri: this.redirectUri,
			response_type: 'code',
			state: this.state,
			scope: 'repo,read:user,user:email'
		};
		const host = this.testHost || 'https://github.com';
		const url = `${host}/login/oauth/authorize`;
		return { url, parameters };
	}

	getAsanaRedirectData () {
		const parameters = {
			client_id: ApiConfig.getPreferredConfig().asana.appClientId,
			redirect_uri: this.redirectUri,
			response_type: 'code',
			state: this.state
		};
		const url = 'https://app.asana.com/-/oauth_authorize';
		return { url, parameters };
	}

	getJiraRedirectData () {
		const appClientId = this.testHost ? 'testClientId' : ApiConfig.getPreferredConfig().jira.appClientId;
		const parameters = {
			client_id: appClientId,
			redirect_uri: this.redirectUri,
			response_type: 'code',
			state: this.state,
			scope: 'read:jira-user read:jira-work write:jira-work offline_access',
			audience: 'api.atlassian.com',
			prompt: 'consent',
		};
		const host = this.testHost || 'https://auth.atlassian.com';
		const url = `${host}/authorize`;
		return { url, parameters };
	}

	getJiraServerRedirectData () {
		const encodedSecret = new TokenHandler(ApiConfig.getPreferredConfig().secrets.auth).generate({ sec: this.mockTokenSecret }, 'oasec');
		const callback = `${ApiConfig.getPreferredConfig().api.publicApiUrl}/no-auth/provider-token/${this.provider}?state=${this.state}!${encodedSecret}`;
		const parameters = {
			oauth_token: this.mockToken,
			oauth_callback: callback
		};
		const url = `${this.testHost}/plugins/servlet/oauth/authorize`;
		return { url, parameters };
	}

	getGitlabRedirectData () {
		const appClientId = this.testHost ? 'testClientId' : ApiConfig.getPreferredConfig().gitlab.appClientId;
		const parameters = {
			client_id: appClientId,
			redirect_uri: `${this.redirectUri}`,
			response_type: 'code',
			state: this.state
		};
		if (this.testHost) {
			parameters.scope = 'api';
		}
		const host = this.testHost || 'https://gitlab.com';
		const url = `${host}/oauth/authorize`;
		return { url, parameters };
	}

	getBitbucketRedirectData () {
		const parameters = {
			client_id: ApiConfig.getPreferredConfig().bitbucket.appClientId,
			redirect_uri: this.redirectUri,
			response_type: 'code',
			state: this.state,
			scope: 'account team repository issue:write'
		};
		const url = 'https://bitbucket.org/site/oauth2/authorize';
		return { url, parameters };
	}

	getYouTrackRedirectData () {
		const appClientId = this.testHost ? 'testClientId' : ApiConfig.getPreferredConfig().youtrack.appClientId;
		const parameters = {
			client_id: appClientId,
			redirect_uri: this.redirectUri,
			response_type: 'token',
			state: this.state,
			scope: 'YouTrack',
			request_credentials: 'default'
		};
		const host = this.testHost || 'youtrack.com';
		const url = `https://${host}/hub/api/rest/oauth2/auth`;
		return { url, parameters };
	}

	getAzureDevOpsRedirectData () {
		const parameters = {
			client_id: ApiConfig.getPreferredConfig().devops.appClientId,
			redirect_uri: this.redirectUri,
			response_type: 'Assertion',
			state: this.state,
			scope: 'vso.identity vso.work_write'
		};
		const url = 'https://app.vssps.visualstudio.com/oauth2/authorize';
		return { url, parameters };
	}

	getSlackRedirectData () {
		const parameters = {
			client_id: ApiConfig.getPreferredConfig().slack.appClientId,
			redirect_uri: this.redirectUri,
			response_type: 'code',
			state: this.state,
			scope: 'identify client'
		};
		const url = 'https://slack.com/oauth/authorize';
		return { url, parameters };
	}

	getMSTeamsRedirectData () {
		const parameters = {
			client_id: ApiConfig.getPreferredConfig().msteams.appClientId,
			redirect_uri: this.redirectUri,
			response_type: 'code',
			state: this.state,
			scope: 'User.Read.All Group.ReadWrite.All offline_access',
			response_mode: 'query'
		};
		const url = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize';
		return { url, parameters };
	}

	getOktaRedirectData () {
		const parameters = {
			client_id: OktaConfig.appClientId,
			redirect_uri: this.redirectUri,
			response_type: 'code',
			state: this.state
		};
		const url = 'https://codestream.okta.com/oauth2/v1/authorize';
		return { url, parameters };
	}
}

module.exports = ProviderAuthTest;

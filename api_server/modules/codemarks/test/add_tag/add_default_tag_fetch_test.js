'use strict';

const FetchTest = require('./fetch_test');
const DefaultTags = require(process.env.CSSVC_BACKEND_ROOT + '/api_server/modules/teams/default_tags');

class AddDefaultTagFetchTest extends FetchTest {

	constructor (options) {
		super(options);
		this.tagId = Object.keys(DefaultTags)[4];
	}

	get description () {
		return 'should be ok to add a default tag to a codemark, checked by fetching the codemark';
	}
}

module.exports = AddDefaultTagFetchTest;

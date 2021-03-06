// provide a base class for most tests of the "DELETE /team-tags/:teamId/:id" request

'use strict';

const Aggregation = require(process.env.CSSVC_BACKEND_ROOT + '/shared/server_utils/aggregation');
const CodeStreamAPITest = require(process.env.CSSVC_BACKEND_ROOT + '/api_server/lib/test_base/codestream_api_test');
const Assert = require('assert');
const CommonInit = require('./common_init');

class DeleteTagTest extends Aggregation(CodeStreamAPITest, CommonInit) {

	get description () {
		return 'should delete a tag and respond with appropriate directive when deleting a tag for a team';
	}

	get method () {
		return 'delete';
	}

	// before the test runs...
	before (callback) {
		this.init(callback);
	}

	// validate the response to the test request
	validateResponse (data) {
		Assert(data.team.$set.modifiedAt >= this.updatedAt, 'modifiedAt was not changed');
		this.expectedResponse.team.$set.modifiedAt = data.team.$set.modifiedAt;
		Assert.deepEqual(data, this.expectedResponse);
	}
}

module.exports = DeleteTagTest;

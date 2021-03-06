'use strict';

const GetPostWithCodemarkTest = require('./get_post_with_codemark_test');
const PostTestConstants = require('../post_test_constants');

class GetPostWithMarkerTest extends GetPostWithCodemarkTest {

	constructor (options) {
		super(options);
		this.postOptions.wantMarker = true;
	}

	get description () {
		return 'should return a valid post with a marker when requesting a post created with a marker';
	}

	// vdlidate the response to the request
	validateResponse (data) {
		const marker = data.markers[0];
		const codemark = this.postData[0].codemark;
		// verify we got the right post, and that there are no attributes we don't want the client to see
		this.validateMatchingObject(codemark.markerIds[0], marker, 'marker');
		this.validateSanitized(marker, PostTestConstants.UNSANITIZED_MARKER_ATTRIBUTES);
		super.validateResponse(data);
	}
}

module.exports = GetPostWithMarkerTest;

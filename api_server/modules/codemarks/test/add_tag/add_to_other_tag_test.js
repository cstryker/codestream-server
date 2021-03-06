'use strict';

const AddTagTest = require('./add_tag_test');

class AddToOtherTagTest extends AddTagTest {

	constructor (options) {
		super(options);
		this.expectedVersion = 3;
	}
	
	get description () {
		return 'should be ok to add a tag to a codemark that already has at least one tag';
	}

	init (callback) {
		// after initializing, add a different tag to the codemark
		super.init(error => {
			if (error) { return callback(error); }
			this.doApiRequest(
				{
					method: 'put',
					path: `/codemarks/${this.codemark.id}/add-tag`,
					data: {
						tagId: this.otherTagId
					},
					token: this.users[1].accessToken
				},
				callback
			);
		});
	}
}

module.exports = AddToOtherTagTest;

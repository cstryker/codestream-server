// provide a factory for creating random markers, for testing purposes

'use strict';

const RandomString = require('randomstring');

class RandomCodemarkFactory {

	constructor (options) {
		Object.assign(this, options);
	}

	// get some random codemark data
	getRandomCodemarkData (options = {}) {
		const data = {
			title: RandomString.generate(50),
			type: options.codemarkType || 'comment',
			status: RandomString.generate(10),
			text: RandomString.generate(100)
		};
		if (options.wantMarkers) {
			data.markers = this.markerFactory.createRandomMarkers(options.wantMarkers, options);
		}
		return data;
	}
}

module.exports = RandomCodemarkFactory;

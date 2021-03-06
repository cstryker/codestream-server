// handle the "PUT /read/:streamId" request to indicate the user is "caught up"
// on reading the posts in a particular stream

'use strict';

const RestfulRequest = require(process.env.CSSVC_BACKEND_ROOT + '/api_server/lib/util/restful/restful_request.js');
const ModelSaver = require(process.env.CSSVC_BACKEND_ROOT + '/api_server/lib/util/restful/model_saver');

class ReadRequest extends RestfulRequest {

	// authorize the request before processing....
	async authorize () {
		// they must have access to the stream, unless "all" is specified
		const streamId = this.request.params.streamId.toLowerCase();
		if (streamId === 'all') {
			// all doesn't need authorization, it applies only to the current user
			return;
		}
		const authorized = await this.user.authorizeStream(streamId, this);
		if (!authorized) {
			throw this.errorHandler.error('updateAuth', { reason: 'user not in stream' });
		}
	}

	// process the request...
	async process () {
		// unset the lastReads value for the given stream, or simply remove the lastReads
		// value completely if "all" specified
		this.streamId = this.request.params.streamId.toLowerCase();
		let op = {
			$set: {
				modifiedAt: Date.now()
			}
		};
		if (this.streamId === 'all') {
			op = {
				'$unset': {
					lastReads: true
				}
			};
		}
		else {
			op = {
				'$unset': {
					['lastReads.' + this.streamId]: true
				}
			};
		}
		this.updateOp = await new ModelSaver({
			request: this,
			collection: this.data.users,
			id: this.user.id
		}).save(op);
	}

	async handleResponse () {
		if (this.gotError) {
			return await super.handleResponse();
		}
		this.responseData = { user: this.updateOp };
		super.handleResponse();
	}

	// after the response is returned....
	async postProcess () {
		// send the lastReads update on the user's me-channel, so other active
		// sessions get the message
		const channel = 'user-' + this.user.id;
		const message = Object.assign({}, this.responseData, { requestId: this.request.id });
		Object.assign(message.user, this.op);
		try {
			await this.api.services.broadcaster.publish(
				message,
				channel,
				{ request: this	}
			);
		}
		catch (error) {
			// this doesn't break the chain, but it is unfortunate
			this.warn(`Unable to publish lastReads message to channel ${channel}: ${JSON.stringify(error)}`);
		}
	}

	// describe this route for help
	static describe () {
		return {
			tag: 'read',
			summary: 'Indicates user has read all messages in a stream',
			access: 'User must have access to the given stream (for public streams, must be in the team that owns the stream, for private streams, must be in the stream)',
			description: 'Indicates user has read all messages in a stream (or all streams, if \'all\' is specified)',
			input: 'Specify ID of the stream in the path',
			returns: 'Empty object',
			publishes: {
				summary: 'Publishes a user object, with directives, to the user\'s user channel, indicating how the lastReads attribute for the user object should be updated',
				looksLike: {
					user: {
						id: '<ID of the user>',
						$unset: {
							lastReads: {
								['<streamId>']: true
							}
						}
					}
				}
			},
			errors: [
				'notFound',
				'updateAuth'
			]
		};
	}
}

module.exports = ReadRequest;

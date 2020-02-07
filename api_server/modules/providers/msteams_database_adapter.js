// This is the bridge between an ms teams bot and the CodeStream backend
// They both roughly have the same method surface.
// This class should be instantiated for each request that the ms teams bot handles

'use strict';

/*eslint complexity: ["error", 666]*/

const SignupTokens = require(process.env.CS_API_TOP + '/modules/users/signup_tokens');
const TeamIndexes = require(process.env.CS_API_TOP + '/modules/teams/indexes');
const MSTeamsTeamsIndexes = require(process.env.CS_API_TOP + '/modules/msteams_teams/indexes');
const MSTeamsConversationIndexes = require(process.env.CS_API_TOP + '/modules/msteams_conversations/indexes');
const ModelSaver = require(process.env.CS_API_TOP + '/lib/util/restful/model_saver');
const UserIndexes = require(process.env.CS_API_TOP + '/modules/users/indexes');

class MSTeamsDatabaseAdapter {
	constructor (options) {
		Object.assign(this, options);
	}

	async process () {
		// eventually this will need to capture state for replies / telemetry
		return false;
	}

	async disconnect (conversationReference) {
		try {
			this.api.log('disconnecting...');
			const conversationIdString = conversationReference.conversation.conversation.id.split(';');

			const conversationId = conversationIdString[0];
			const query = {
				conversationId: conversationId
			};
			const conversation = await this.data.msteams_conversations.getOneByQuery(
				query,
				{
					hint: MSTeamsConversationIndexes.byConversationIds
				}
			);
			if (conversation) {
				await this.data.msteams_conversations.deleteById(conversation.id);
				this.api.log(`tenantId=${conversationReference.tenantId} conversationId=${conversationId} deleted`);
				return true;
			}

			return true;
		}
		catch (ex) {
			this.api.log(ex);
			return false;
		}
	}

	async disconnectAll (data) {
		try {
			this.api.log('disconnecting all...');
			const query = {
				tenantId: data.tenantId,
				msTeamsTeamId: data.teamId
			};
			const conversations = await this.data.msteams_conversations.getByQuery(
				query,
				{
					hint: MSTeamsConversationIndexes.byTenantIdMsTeamsTeamIds
				}
			);
			if (conversations && conversations.length) {
				await this.data.msteams_conversations.deleteByIds(conversations.map(_ => _.id));
				this.api.log(`${conversations.length} tenantId=${data.tenantId} msTeamsTeamId=${data.teamId} conversations deleted`);
				return true;
			}

			return true;
		}
		catch (ex) {
			this.api.log(ex);
			return false;
		}
	}

	async signout (/*data*/) {
		this.api.log('signing out...');
		// TODO not really much to do here		
		return true;
	}

	// compare the user's token with what is stored	
	async complete (data) {
		this.api.log('completing...');
		try {
			const signupTokenService = new SignupTokens({ api: this.api });
			signupTokenService.initialize();
			const signupToken = await signupTokenService.find(data.token);
			if (signupToken && signupToken.token === data.token) {
				const team = await this.data.teams.getById(signupToken.teamId);
				if (!team || team.get('deactivated')) return false;

				let op = {
					$set: {
						'providerBotInfo.msteams': {
							tenantId: data.tenantId,
							data: {
								connected: true
							}
						}
					}
				};

				const providerIdentities = team.get('providerIdentities');
				let addToSet = false;
				if (providerIdentities) {
					// we have providerIdentities but not this one...
					const msteam = providerIdentities.find(_ => _ === `msteams::${data.tenantId}`);
					if (!msteam) {
						addToSet = true;
					}
				}
				else {
					addToSet = true;
				}

				if (addToSet) {
					op.$addToSet = {
						providerIdentities: `msteams::${data.tenantId}`
					};
				}

				this.transforms.teamUpdate = await new ModelSaver({
					request: this.request,
					collection: this.data.teams,
					id: team.id
				}).save(op);
				return true;
			}
			return false;
		}
		catch (ex) {
			this.api.log(ex);
		}
		return false;
	}

	async connect (conversationReference) {
		try {
			this.api.log(`connecting tenantId=${conversationReference.tenantId}...`);
			const team = await this.getTeamByTenant(conversationReference.tenantId);
			const isConnected = await this.isTeamConnected(conversationReference.tenantId, team);
			if (isConnected) {
				this.api.log(`tenantId=${conversationReference.tenantId} is already connected, but we'll go ahead`);
			}
			// the conversationId comes in as a two part string like...
			// 19:d2a0123443734813413414@thread.skype;messageid=184127312832193
			// the entire string will continue a conversation at a specific point (aka a reply)
			// in order to post to a "channel" we need the part of the string before the ;
			const conversationIdString = conversationReference.conversation.conversation.id.split(';');
			const messageId = conversationIdString[1] && conversationIdString[1].length ?
				conversationIdString[1].replace('messageid=', '') :
				undefined;
			const conversationId = conversationIdString[0];
			const query = {
				conversationId: conversationId
			};
			const conversation = await this.data.msteams_conversations.getOneByQuery(
				query,
				{
					hint: MSTeamsConversationIndexes.byConversationIds
				}
			);
			if (conversation) {
				await this.updateUsers(team, conversationReference);
				this.api.log(`tenantId=${conversationReference.tenantId} conversationId=${conversationId} already stored`);
				return true;
			}

			let channelName = undefined;
			const teamChannel = conversationReference.teamChannels.find(_ => _.id == conversationId);

			if (teamChannel) {
				// the General channel does not come with a name
				channelName = teamChannel.name || 'General';
			}
			if (!channelName) {
				this.api.log('cannot go ahead, there is no channel name');
				return false;
			}

			let msTeamsTeam = await this.data.msteams_teams.getByQuery({
				msTeamsTeamId: conversationReference.team.id
			}, {
				hint: MSTeamsTeamsIndexes.byMSTeamsTeamId,
				noCache: true,
				ignoreCache: true
			});
			if (!msTeamsTeam || !msTeamsTeam.length) {
				await this.data.msteams_teams.create({
					// id of the ms teams team
					msTeamsTeamId: conversationReference.team.id,
					name: conversationReference.team.name,
					tenantId: conversationReference.tenantId
				});
			}
			// note, we are adjusting this object by only storing the "channel" part of the message
			// we will store the actual messageId just in case we ever need it
			conversationReference.conversation.conversation.id = conversationId;
			await this.data.msteams_conversations.create({
				// this is the CodeStream teamId
				teamId: team.id,
				// ms properties
				conversationId: conversationId,
				msTeamsTeamId: conversationReference.team.id,
				conversation: conversationReference.conversation,
				tenantId: conversationReference.tenantId,
				channelName: channelName,
				messageId: messageId
			});

			this.updateUsers(team, conversationReference);
			return true;
		}
		catch (ex) {
			this.api.log(ex);
			return false;
		}
	}

	async uninstall (conversationReference) {
		let tenantId;
		try {
			tenantId = conversationReference.tenantId;
			const team = await this.getTeamByTenant(tenantId);
			if (team) {
				const providerIdentities = team.get('providerIdentities');

				if (providerIdentities) {
					const op = {
						$set: {
							modifiedAt: Date.now()
						},
						$pull: {
							providerIdentities: `msteams::${tenantId}`
						},
						$unset: {
							providerBotInfo: 'msteams'
						}
					};
					this.transforms.teamUpdate = await new ModelSaver({
						request: this.request,
						collection: this.data.teams,
						id: team.id
					}).save(op);
				}
			}
		}
		catch (ex) {
			this.api.log(`uninstalling tenantId=${tenantId}...`, ex);
			return false;
		}
		return true;
	}

	async debug (conversationReference) {
		const tenantId = conversationReference.tenantId;
		this.api.log(`debugging tenantId=${tenantId}...`);

		let isTeamConnected = false;
		let conversationsCount = -1;
		let team;
		let error;

		try {
			team = await this.getTeamByTenant(tenantId);
			if (team) {
				isTeamConnected = await this.isTeamConnected(tenantId, team);
				const conversations = await this.data.msteams_conversations.getByQuery(
					{
						teamId: team.id,
						tenantId: tenantId
					},
					{
						hint: MSTeamsConversationIndexes.byTeamIdTenantIds
					}
				);
				conversationsCount = conversations.length;
			}

		}
		catch (ex) {
			this.api.log(`debugging tenantId=${tenantId}...`, ex);
			error = ex.message;
		}
		return {
			csTeamId: team && team.id,
			isTeamConnected: isTeamConnected,
			conversationsCount: conversationsCount,
			error: error
		};
	}

	async getTeamByTenant (tenantId) {
		const query = {
			providerIdentities: `msteams::${tenantId}`,
			deactivated: false
		};
		const teams = await this.data.teams.getByQuery(
			query,
			{ hint: TeamIndexes.byProviderIdentities }
		);

		if (teams && teams.length != 1) {
			this.api.log(`multiple teams for this tenantId=${tenantId}...`);
			return undefined;
		}
		return teams[0];
	}

	async isTeamConnected (tenantId, team) {
		if (!team) {
			team = await this.getTeamByTenant(tenantId);
		}
		if (!team || team.get('deactivated')) return false;

		const providerIdentities = team.get('providerIdentities');
		if (!providerIdentities) return false;

		const msteam = providerIdentities.find(_ => _ === `msteams::${tenantId}`);
		if (!msteam) return false;

		const providerInfo = team.get('providerBotInfo');
		if (!providerInfo) return false;

		const providerMsTeams = providerInfo.msteams;
		if (!providerMsTeams) return false;

		if (providerMsTeams.tenantId === tenantId &&
			providerMsTeams.data &&
			providerMsTeams.data.connected) {
			return true;
		}
		return false;
	}

	async updateUsers (team, conversationReference) {
		const users = await this.data.users.getByQuery({
			teamIds: team.id,
			isRegistered: true,
			deactivated: false
		}, {
			hint: UserIndexes.byTeamIds
		}
		);
		this.transforms.userUpdates = [];
		for (const user of users) {
			const op = {
				$set: {}
			};
			// NOTE: these accessTokens can be anything that isn't empty
			// just the existence of these objects along with an msteams_conversation
			// is enough to post to their tenant/team
			let existingProviderInfo = ((user.get('providerInfo') || {})[team.id] || {})['msteams'] || {};
			if (existingProviderInfo && Object.keys(existingProviderInfo).length) {
				let providerInfoKey = `providerInfo.${team.id}.msteams`;
				op.$set[`${providerInfoKey}.multiple.${conversationReference.tenantId}`] = {
					...{
						accessToken: 'MSTEAMS'
					}, extra: {
						connected: true
					}
				};
			}
			else {
				if (!user.get('providerInfo')) {
					op.$set[`providerInfo.${team.id}.msteams.multiple.${conversationReference.tenantId}`] = {
						...{
							accessToken: 'MSTEAMS'
						}, extra: {
							connected: true
						}
					};
				}
			}

			op.$set.modifiedAt = Date.now();
			this.transforms.userUpdates.push(await new ModelSaver({
				request: this.request,
				collection: this.data.users,
				id: user.id
			}).save(op));
		}
	}
}
module.exports = MSTeamsDatabaseAdapter;

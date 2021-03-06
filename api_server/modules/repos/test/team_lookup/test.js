// handle unit tests for the "GET /no-auth/team-lookup" request,
// to match repo commit hashes to a known repo and the team that owns it

'use strict';

const TeamLookupTest = require('./team_lookup_test');
const ParameterRequiredTest = require('./parameter_required_test');
const EmptyParameterTest = require('./empty_parameter_test');
const EmptyLookupTest = require('./empty_lookup_test');
const TeamMustHaveAutoJoinTest = require('./team_must_have_auto_join_test');
const RepoMustHaveAutoJoinTest = require('./repo_must_have_auto_join_test');
const AddedCommitHashTest = require('./added_commit_hash_test');
const NoTokenTest = require('./no_token_test');
const MultiTeamTest = require('./multi_team_test');
const MultiTeamNoAutoJoinTest = require('./multi_team_no_auto_join_test');
const RepoUpdateTest = require('./repo_update_test');

class TeamLookupRequestTester {

	test() {
		new TeamLookupTest().test();
		new ParameterRequiredTest({ parameter: 'commitHashes' }).test();
		new EmptyParameterTest({ parameter: 'commitHashes' }).test();
		new EmptyLookupTest().test();
		new TeamMustHaveAutoJoinTest().test();
		new RepoMustHaveAutoJoinTest().test();
		new AddedCommitHashTest().test();
		new NoTokenTest().test();
		new MultiTeamTest().test();
		new MultiTeamNoAutoJoinTest().test();
		new RepoUpdateTest().test();
	}
}

module.exports = new TeamLookupRequestTester();

// handle unit tests for the "POST /posts" request

'use strict';

const PostToChannelTest = require('./post_to_channel_test');
const PostToDirectTest = require('./post_to_direct_test');
const CodemarkTest = require('./codemark_test');
const CodemarkMarkerTest = require('./codemark_marker_test');
const PostToFileStreamTest = require('./post_to_file_stream_test');
const NoCodemarkTypeTest = require('./no_codemark_type_test');
const NoCommitHashTest = require('./no_commit_hash_test');
const NoCommitHashWithFileTest = require('./no_commit_hash_with_file_test');
const NoCommitHashWithStreamTest = require('./no_commit_hash_with_stream_test');
const NoCommitHashWithStreamIdTest = require('./no_commit_hash_with_stream_id_test');
const MarkersNotArrayTest = require('./markers_not_array_test');
const MarkersTooLongTest = require('./markers_too_long_test');
const MarkerNotObjectTest = require('./marker_not_object_test');
const MarkerTooBigTest = require('./marker_too_big_test');
const MarkerAttributeRequiredTest = require('./marker_attribute_required_test');
const LocationTooLongTest = require('./location_too_long_test');
const LocationTooShortTest = require('./location_too_short_test');
const LocationMustBeNumbersTest = require('./location_must_be_numbers_test');
const InvalidCoordinateObjectTest = require('./invalid_coordinate_object_test');
const NoLocationOkTest = require('./no_location_ok_test');
const TooManyRemotesTest = require('./too_many_remotes_test');
const TooManyKnownCommitHashesTest = require('./too_many_known_commit_hashes_test');
const MarkerHasInvalidStreamIdTest = require('./marker_has_invalid_stream_id_test');
const MarkerHasUnknownStreamIdTest = require('./marker_has_unknown_stream_id_test');
const MarkerHasInvalidRepoIdTest = require('./marker_has_invalid_repo_id_test');
const MarkerHasUnknownRepoIdTest = require('./marker_has_unknown_repo_id_test');
const MarkerForBadStreamTypeTest = require('./marker_for_bad_stream_type_test');
const MarkerFromDifferentTeamTest = require('./marker_from_different_team_test');
const NumMarkersTest = require('./num_markers_test');
const MarkerStreamOnTheFly = require('./marker_stream_on_the_fly_test');
const FindRepoByRemotesTest = require('./find_repo_by_remotes_test');
const FindRepoByKnownCommitHashesTest = require('./find_repo_by_known_commit_hashes_test');
const FindRepoByCommitHashTest = require('./find_repo_by_commit_hash_test');
const UpdateMatchedRepoWithRemotesTest = require('./update_matched_repo_with_remotes_test');
const UpdateSetRepoWithRemotesTest = require('./update_set_repo_with_remotes_test');
const CreateRepoOnTheFlyTest = require('./create_repo_on_the_fly_test');
const CreateRepoOnTheFlyWithCommitHashesTest = require('./create_repo_on_the_fly_with_commit_hashes_test');
const PostReplyTest = require('./post_reply_test');
const NoStreamIdTest = require('./no_stream_id_test');
const InvalidStreamIdTest = require('./invalid_stream_id_test');
const DuplicateFileStreamTest = require('./duplicate_file_stream_test');
const ACLTeamTest = require('./acl_team_test');
const ACLStreamTest = require('./acl_stream_test');
const NewPostMessageToTeamStreamTest = require('./new_post_message_to_team_stream_test');
const NewPostMessageToChannelTest = require('./new_post_message_to_channel_test');
const NewPostMessageToDirectTest = require('./new_post_message_to_direct_test');
const NewPostNoMessageToChannelTest = require('./new_post_no_message_to_channel_test');
const NewPostNoMessageToDirectTest = require('./new_post_no_message_to_direct_test');
const NewFileStreamMessageToTeamTest = require('./new_file_stream_message_to_team_test');
const NewMarkerStreamMessageToTeamTest = require('./new_marker_stream_message_to_team_test');
const NewRepoMessageToTeamTest = require('./new_repo_message_to_team_test');
const UpdatedSetRepoMessageTest = require('./updated_set_repo_message_test');
const UpdatedMatchedRepoMessageTest = require('./updated_matched_repo_message_test');
const MostRecentPostTest = require('./most_recent_post_test');
const LastReadsNoneTest = require('./last_reads_none_test');
const NoLastReadsForAuthorTest = require('./no_last_reads_for_author_test');
const LastReadsPreviousPostTest = require('./last_reads_previous_post_test');
const NoLastReadsUpdateTest = require('./no_last_reads_update_test');
const SeqNumTest = require('./seqnum_test');
const NumRepliesTest = require('./num_replies_test');
const SecondReplyTest = require('./second_reply_test');
const CodemarkNumRepliesTest = require('./codemark_num_replies_test');
const CodemarkSecondReplyTest = require('./codemark_second_reply_test');
const NumRepliesMessageToStreamTest = require('./num_replies_message_to_stream_test');
const NumRepliesToCodemarkMessageTest = require('./num_replies_to_codemark_message_test');
const MentionTest = require('./mention_test');
const UnregisteredMentionTest = require('./unregistered_mention_test');
const MessageToAuthor = require('./message_to_author_test');
const OnTheFlyMarkerStreamFromDifferentTeamTest = require('./on_the_fly_marker_stream_from_different_team_test');
const OnTheFlyMarkerStreamRepoNotFoundTest = require('./on_the_fly_marker_stream_repo_not_found_test');
const OnTheFlyMarkerStreamNoRemotesTest = require('./on_the_fly_marker_stream_no_remotes_test');
const OnTheFlyMarkerStreamInvalidRepoIdTest = require('./on_the_fly_marker_stream_invalid_repo_id_test');
const OriginFromPluginTest = require('./origin_from_plugin_test');
const InvalidCodemarkTypeTest = require('./invalid_codemark_type_test');
const ValidCodemarkTypeTest = require('./valid_codemark_type_test');
const ValidCodemarkTypeWithMarkerTest = require('./valid_codemark_type_with_marker_test');
const MarkerRequiredForCodemarkTest = require('./marker_required_for_codemark_test');
const InvisibleCodemarkTypeTest = require('./invisible_codemark_type_test');
const RequiredForCodemarkTypeTest = require('./required_for_codemark_type_test');
const RequiredForCodemarkTypeWithMarkerTest = require('./required_for_codemark_type_with_marker_test');
const IssueWithAssigneesTest = require('./issue_with_assignees_test');
const InvalidAssigneeTest = require('./invalid_assignee_test');
const AssigneeNotOnTeamTest = require('./assignee_not_on_team_test');
const AssigneesIgnoredTest = require('./assignees_ignored_test');
const NoReplyToReplyTest = require('./no_reply_to_reply_test');
const ParentPostIdTest = require('./parent_post_id_test');
const CodemarkOriginTest = require('./codemark_origin_test');
const PermalinkTest = require('./permalink_test');
const DuplicateLinkTest = require('./duplicate_link_test');
const RelatedCodemarksTest = require('./related_codemarks_test');
const RelatedCodemarkNotFoundTest = require('./related_codemark_not_found_test');
const RelatedCodemarkACLTest = require('./related_codemark_acl_test');
const RelatedCodemarksDifferentTeamTest = require('./related_codemarks_different_team_test');
const TagsTest = require('./tags_test');
const TagNotFoundTest = require('./tag_not_found_test');
const DeactivatedTagTest = require('./deactivated_tag_test');
const DeactivatedDefaultTagTest = require('./deactivated_default_tag_test');
const CodemarkColorBecomesTagTest = require('./codemark_color_becomes_tag_test');
const CodemarkWithReferenceLocationsTest = require('./codemark_with_reference_locations_test');
const CodemarkWithNoCommitHashInReferenceLocation = require('./codemark_with_no_commit_hash_in_reference_location_test');
const CodemarkWithInvalidCommitHashInReferenceLocation = require('./codemark_with_invalid_commit_hash_in_reference_location_test');
const CodemarkWithEmptyCommitHashInReferenceLocation = require('./codemark_with_empty_commit_hash_in_reference_location_test');
const CodemarkWithNoLocationInReferenceLocationTest = require('./codemark_with_no_location_in_reference_location_test');
const CodemarkWithInvalidLocationInReferenceLocationTest = require('./codemark_with_invalid_location_in_reference_location_test');
const MultipleMarkersTest = require('./multiple_markers_test');
const MultipleMarkersStreamOnTheFlyTest = require('./multiple_markers_stream_on_the_fly_test');
const AddFollowersTest = require('./add_followers_test');
const AddCreatorAsFollowerTest = require('./add_creator_as_follower_test');
const InvalidFollowerTest = require('./invalid_follower_test');
const FollowerNotOnTeamTest = require('./follower_not_on_team_test');
const FollowersFromDirectStreamTest = require('./followers_from_direct_stream_test');
const FollowersMentionedTest = require('./followers_mentioned_test');
const InvalidMentionTest = require('./invalid_mention_test');
const MentionedNotOnTeamTest = require('./mentioned_not_on_team_test');

class PostPostRequestTester {

	postPostTest () {
		new PostToChannelTest().test();
		new PostToDirectTest().test();
		new CodemarkTest().test();
		new CodemarkMarkerTest().test();
		new PostToFileStreamTest().test();	
		new NoCodemarkTypeTest().test();
		new NoCommitHashTest().test();
		new NoCommitHashWithFileTest().test();
		new NoCommitHashWithStreamTest().test();
		new NoCommitHashWithStreamIdTest().test();
		new MarkersNotArrayTest().test();
		new MarkersTooLongTest().test();
		new MarkerNotObjectTest().test();
		new MarkerTooBigTest().test();
		new MarkerAttributeRequiredTest({ attribute: 'code' }).test();
		new LocationTooLongTest().test();
		new LocationTooShortTest().test();
		new LocationMustBeNumbersTest().test();
		new InvalidCoordinateObjectTest().test();
		new NoLocationOkTest().test();
		new TooManyRemotesTest().test();
		new TooManyKnownCommitHashesTest().test();
		new MarkerHasInvalidStreamIdTest().test();
		new MarkerHasUnknownStreamIdTest().test();
		new MarkerHasInvalidRepoIdTest().test();
		new MarkerHasUnknownRepoIdTest().test();
		new MarkerForBadStreamTypeTest({ streamType: 'direct' }).test();
		new MarkerForBadStreamTypeTest({ streamType: 'channel' }).test();
		new MarkerFromDifferentTeamTest().test();
		new NumMarkersTest().test();
		new MarkerStreamOnTheFly({ streamType: 'direct' }).test();
		new MarkerStreamOnTheFly({ streamType: 'channel' }).test();
		new FindRepoByRemotesTest().test();
		new FindRepoByKnownCommitHashesTest().test();
		new FindRepoByCommitHashTest().test();
		new UpdateMatchedRepoWithRemotesTest().test();
		new UpdateSetRepoWithRemotesTest().test();
		new CreateRepoOnTheFlyTest().test();
		new CreateRepoOnTheFlyWithCommitHashesTest().test();
		new PostReplyTest().test();
		new NoStreamIdTest().test();
		new InvalidStreamIdTest().test();
		new DuplicateFileStreamTest().test();
		new ACLStreamTest().test();
		new ACLTeamTest().test();
		new NewPostMessageToTeamStreamTest().test();
		new NewPostMessageToChannelTest().test();
		new NewPostMessageToDirectTest().test();
		new NewPostNoMessageToChannelTest().test();
		new NewPostNoMessageToDirectTest().test();
		new NewFileStreamMessageToTeamTest().test();
		new NewMarkerStreamMessageToTeamTest().test();
		new NewRepoMessageToTeamTest().test();
		new UpdatedSetRepoMessageTest().test();
		new UpdatedMatchedRepoMessageTest().test();
		new MostRecentPostTest().test();
		new LastReadsNoneTest({ type: 'direct' }).test();
		new LastReadsNoneTest({ type: 'channel' }).test();
		new NoLastReadsForAuthorTest().test();
		new LastReadsPreviousPostTest({ type: 'direct' }).test();
		new LastReadsPreviousPostTest({ type: 'channel' }).test();
		new NoLastReadsUpdateTest().test();
		new SeqNumTest().test();
		new NumRepliesTest().test();
		new SecondReplyTest().test();
		new CodemarkNumRepliesTest().test();
		new CodemarkSecondReplyTest().test();
		new NumRepliesMessageToStreamTest({ type: 'direct' }).test();
		new NumRepliesMessageToStreamTest({ type: 'channel' }).test();
		new NumRepliesToCodemarkMessageTest({ type: 'direct' }).test();
		new NumRepliesToCodemarkMessageTest({ type: 'channel' }).test();
		new MentionTest().test();
		new UnregisteredMentionTest().test();
		new MessageToAuthor().test();
		new OnTheFlyMarkerStreamFromDifferentTeamTest().test();
		new OnTheFlyMarkerStreamRepoNotFoundTest().test();
		new OnTheFlyMarkerStreamNoRemotesTest().test();
		new OnTheFlyMarkerStreamInvalidRepoIdTest().test();
		new OriginFromPluginTest().test();
		new InvalidCodemarkTypeTest().test();
		new ValidCodemarkTypeTest({ codemarkType: 'issue' }).test();
		new ValidCodemarkTypeTest({ codemarkType: 'question' }).test();
		new ValidCodemarkTypeWithMarkerTest({ codemarkType: 'bookmark' }).test();
		new ValidCodemarkTypeWithMarkerTest({ codemarkType: 'trap' }).test();
		new ValidCodemarkTypeWithMarkerTest({ codemarkType: 'link' }).test();
		new RequiredForCodemarkTypeTest({ codemarkType: 'comment', attribute: 'text' }).test();
		new RequiredForCodemarkTypeWithMarkerTest({ codemarkType: 'bookmark', attribute: 'title' }).test();
		new RequiredForCodemarkTypeWithMarkerTest({ codemarkType: 'trap', attribute: 'text' }).test();
		new RequiredForCodemarkTypeTest({ codemarkType: 'question', attribute: 'title' }).test();
		new RequiredForCodemarkTypeTest({ codemarkType: 'issue', attribute: 'title' }).test();
		new MarkerRequiredForCodemarkTest({ codemarkType: 'bookmark' }).test();
		new MarkerRequiredForCodemarkTest({ codemarkType: 'trap' }).test();
		new MarkerRequiredForCodemarkTest({ codemarkType: 'link' }).test();
		new InvisibleCodemarkTypeTest({ codemarkType: 'link', attribute: 'text' }).test();
		new InvisibleCodemarkTypeTest({ codemarkType: 'link', attribute: 'title' }).test();
		new IssueWithAssigneesTest().test();
		new InvalidAssigneeTest().test();
		new AssigneeNotOnTeamTest().test();
		new AssigneesIgnoredTest().test();
		new NoReplyToReplyTest().test();
		new ParentPostIdTest().test();
		new CodemarkOriginTest().test();
		new PermalinkTest({ permalinkType: 'public' }).test();
		new PermalinkTest({ permalinkType: 'private' }).test();
		new DuplicateLinkTest({ permalinkType: 'public' }).test();
		new DuplicateLinkTest({ permalinkType: 'private' }).test();
		new RelatedCodemarksTest().test();
		new RelatedCodemarkNotFoundTest().test();
		new RelatedCodemarkACLTest().test();
		new RelatedCodemarksDifferentTeamTest().test();
		new TagsTest().test();
		new TagNotFoundTest().test();
		new DeactivatedTagTest().test();
		new DeactivatedDefaultTagTest().test();
		new CodemarkColorBecomesTagTest().test();
		new CodemarkWithReferenceLocationsTest().test();
		new CodemarkWithNoCommitHashInReferenceLocation().test();
		new CodemarkWithInvalidCommitHashInReferenceLocation().test();
		new CodemarkWithEmptyCommitHashInReferenceLocation().test();
		new CodemarkWithNoLocationInReferenceLocationTest().test();
		new CodemarkWithInvalidLocationInReferenceLocationTest().test();
		new MultipleMarkersTest().test();
		new MultipleMarkersStreamOnTheFlyTest().test();
		new AddFollowersTest().test();
		new AddCreatorAsFollowerTest().test();
		new InvalidFollowerTest().test();
		new FollowerNotOnTeamTest().test();
		new FollowersFromDirectStreamTest().test();
		new FollowersMentionedTest().test();
		new InvalidMentionTest().test();
		new MentionedNotOnTeamTest().test();
	}
}

module.exports = PostPostRequestTester;

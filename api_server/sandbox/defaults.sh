
# Create default variable settings in this file

# Set by development tools
# CS_API_NAME     Name of the sandbox
# CS_API_SANDBOX  /path/to/root/of/sandbox
# CS_API_TOP      /path/to/root/of/primary/git/project

# ============== Optional extra settings =============
if [ -f "$CS_API_SANDBOX/sb.options" ]; then
	echo "Loading extra params from sb.options"
	. $CS_API_SANDBOX/sb.options
	export `grep ^CS_API_ $CS_API_SANDBOX/sb.options|cut -f1 -d=`
fi

# =============== Core Settings =================

# Uncomment and setup if yarn is required. Available versions can be seen
# with the command:
#   ssh $DT_CLOUD_SERVER ls /home/web/SandboxRepos/software/yarn-$DT_OS_TYPE-*
#export CS_API_YARN=true
#export CS_API_YARN_VER=1.3.2

# Uncomment and setup if node is required. Available versions can be seen
# with the command:
#   ssh $DT_CLOUD_SERVER ls /home/web/SandboxRepos/software/node-$DT_OS_TYPE-*
export CS_API_NODE_VER=8.11.3
export PATH=$CS_API_SANDBOX/node/bin:$CS_API_SANDBOX/yarn/bin:$CS_API_TOP/bin:$CS_API_TOP/node_modules/.bin:$PATH

export CS_API_LOGS=$CS_API_SANDBOX/log    # Log directory
export CS_API_LOG_DIRECTORY=$CS_API_SANDBOX/log
export CS_API_TMP=$CS_API_SANDBOX/tmp     # temp directory
export CS_API_CONFS=$CS_API_SANDBOX/conf  # config files directory
export CS_API_DATA=$CS_API_SANDBOX/data   # data directory
export CS_API_PIDS=$CS_API_SANDBOX/pid    # pid files directory

[ -z "$CS_API_PORT" ] && export CS_API_PORT=12079
export CS_API_LOG_CONSOLE_OK=1
export CS_API_HELP_AVAILABLE=1
[ -z "$CS_API_ASSET_ENV" ] && export CS_API_ASSET_ENV=local


# =============== SSL Certificate ==================
[ -z "$SSL_CERT" ] && SSL_CERT=wildcard.codestream.us
export CS_API_SSL_CERT_DIR=$HOME/.certs/$SSL_CERT
[ ! -d $CS_API_SSL_CERT_DIR ] && export CS_API_SSL_CERT_DIR=/etc/pki/$SSL_CERT
export CS_API_SSL_KEYFILE=$CS_API_SSL_CERT_DIR/$SSL_CERT-key
export CS_API_SSL_CERTFILE=$CS_API_SSL_CERT_DIR/$SSL_CERT-crt
export CS_API_SSL_CAFILE=$CS_API_SSL_CERT_DIR/$SSL_CERT-ca



# ================ Mongo Settings ==================
[ -z "$CS_API_MONGO_DATABASE" ] && export CS_API_MONGO_DATABASE=codestream
[ -z "$MONGO_ACCESS_FILE" ] && MONGO_ACCESS_FILE="$HOME/.codestream/mongo/mongo-access"
if [ -f $MONGO_ACCESS_FILE ]; then
	. $MONGO_ACCESS_FILE
	[ -n "$MONGO_HOST" ] && export CS_API_MONGO_HOST=$MONGO_HOST
	[ -n "$MONGO_PORT" ] && export CS_API_MONGO_PORT=$MONGO_PORT
	[ -n "$MONGO_URL" ] && export CS_API_MONGO_URL=$MONGO_URL
	[ -n "$MONGO_APP_USER" ] && export CS_API_MONGO_USER=$MONGO_APP_USER
	[ -n "$MONGO_APP_PASS" ] && export CS_API_MONGO_PASS=$MONGO_APP_PASS
	[ -n "$MONGO_DB" ] && export CS_API_MONGO_DATABASE=$MONGO_DB
else
	# Take the values from the mongo sandbox in the playground
	export CS_API_MONGO_HOST=$MDB_HOST
	export CS_API_MONGO_PORT=$MDB_PORT
	# Define these to tell the API service to use mongo authentication
	#export CS_API_MONGO_USER=api
	#export CS_API_MONGO_PASS=api
fi
[ -n "$CS_API_MONGO_DATABASE" ] && export CS_API_MONGO_DATABASE=codestream
# Construct the mongo URL (needed if authentication is used)
if [ -n "$CS_API_MONGO_USER" -a -z "$CS_API_MONGO_URL" ]; then
	export CS_API_MONGO_URL="mongodb://$CS_API_MONGO_USER:$CS_API_MONGO_PASS@$CS_API_MONGO_HOST:$CS_API_MONGO_PORT/$CS_API_MONGO_DATABASE"
fi

# Define these if you want the mdb-mongo CLI to access the database
# using the system account above (as opposed to 'root')
# export MDB_CLI_USER=$CS_API_MONGO_USER
# export MDB_CLI_PASS=$CS_API_MONGO_PASS

# Tell the API service init script to setup mongo when it's started for the
# first time. This includes creating the database owner in mongo and creating
# the indexes
export CS_API_SETUP_MONGO=true


# ================== SlackBot Secrets ==================
if [ -z "$BOT_SECRETS_FILE" ]; then
	if [ -f $HOME/.codestream/slackbot/codestream-local ]; then
		BOT_SECRETS_FILE=$HOME/.codestream/slackbot/codestream-local
	else
		BOT_SECRETS_FILE=$HOME/.codestream/slackbot/codestream-development
	fi
fi
if [ -f $BOT_SECRETS_FILE ]; then
	. $BOT_SECRETS_FILE
	# All bots use the same shared secret
	export CS_API_INTEGRATION_BOT_SHARED_SECRET=$SHARED_SECRET
else
	echo "*** ERROR: slackbot secrets file ($BOT_SECRETS_FILE) not found"
fi


# ================= Slack API Access ==================
[ -z "$SLACK_API_ACCESS_FILE" ] && SLACK_API_ACCESS_FILE=$HOME/.codestream/slack-api/development
if [ -f $SLACK_API_ACCESS_FILE ]; then
	. $SLACK_API_ACCESS_FILE
	export CS_API_SLACK_CLIENT_ID="$SLACK_CLIENT_ID"
	export CS_API_SLACK_CLIENT_SECRET="$SLACK_CLIENT_SECRET"
else
	echo "********************************************************************"
	echo "WARNING: slack api access file not found ($SLACK_API_ACCESS_FILE)."
	echo "         Run dt-update-secrets and reload your sandbox"
	echo "********************************************************************"
fi


# =============== PubNub Settings ==============
# see README.pubnub for more details
[ -z "$PUBNUB_KEY_FILE" ] && PUBNUB_KEY_FILE="$HOME/.codestream/pubnub/CodeStream-Development-Local_Keyset_1"
if [ -f $PUBNUB_KEY_FILE ]; then
	. $PUBNUB_KEY_FILE
	export CS_API_PUBNUB_PUBLISH_KEY=$PUBNUB_PUBLISH
	export CS_API_PUBNUB_SUBSCRIBE_KEY=$PUBNUB_SUBSCRIBE
	export CS_API_PUBNUB_SECRET=$PUBNUB_SECRET
else
	echo "**************************************************************"
	echo "WARNING: pubnub key files not found ($PUBNUB_KEY_FILE)."
	echo "          Run dt-update-secrets and reload your sandbox"
	echo "**************************************************************"
fi

# =============== MixPanel Settings ==============
[ -z "$MIXPANEL_TOKEN_FILE" ] && MIXPANEL_TOKEN_FILE=$HOME/.codestream/mixpanel/development
if [ -f $MIXPANEL_TOKEN_FILE ]; then
	. $MIXPANEL_TOKEN_FILE
	export CS_API_MIXPANEL_TOKEN=$MIXPANEL_TOKEN
else
	echo "Warning: using old mixpanel development token"
	export CS_API_MIXPANEL_TOKEN=4308967c7435e61d9697ce240bc68d02
fi


# =============== Other Secrets ===============
[ -z "$OTHER_SECRETS_FILE" ] && OTHER_SECRETS_FILE=$HOME/.codestream/codestream-services/dev-api
if [ -f $OTHER_SECRETS_FILE ]; then
	. $OTHER_SECRETS_FILE
	export CS_API_AUTH_SECRET="$AUTH_SECRET"
	# Requests to the API server fromm the inbound email server provide this secret
	# This prevents outside clients from simulating inbound emails
	export CS_API_INBOUND_EMAIL_SECRET="$INBOUND_EMAIL_SECRET"
	# for bypassing email confirmation, used for unit testing
	export CS_API_CONFIRMATION_CHEAT_CODE="$CONFIRMATION_CHEAT_CODE"
	# for allowing unregistered users to subscribe to their me-channel, for testing emails
	export CS_API_SUBSCRIPTION_CHEAT_CODE="$SUBSCRIPTION_CHEAT_CODE"
else
	echo "****"
	echo "**** FATAL ERROR ****"
	echo "**** secrets file ($OTHER_SECRETS_FILE) not found. Run 'dt-update-secrets' to fix this then"
	echo "**** reload your playground / sandbox"
	echo "****"
fi


# =============== Other Services ==============
# The web-app service (for constructing links in email notifications)
[ -z "$CS_API_WEB_CLIENT_ORIGIN" ] && export CS_API_WEB_CLIENT_ORIGIN=http://localhost:1380
[ -z "$CS_API_SLACKBOT_ORIGIN" ] && export CS_API_SLACKBOT_ORIGIN=http://localhost:11079
[ -z "$CS_API_TEAMSBOT_ORIGIN" ] && export CS_API_TEAMSBOT_ORIGIN=http://localhost:10079


# ============ Testing Settings ==============
# Location of the TestRepo repo used For maintaining test scripts
export CS_API_TEST_REPO_PATH=$CS_API_SANDBOX/TestRepo

# Set if this sandbox is for test-only client (no api service)
# export CS_API_TEST_ONLY=true



# ============ Email Settings ================
# Outbound email events are placed on this queue. The outbound email
# server processes the queue and sends the emails (a lambda function)
export CS_API_OUTBOUND_EMAIL_SQS="dev_${DT_USER}_outboundEmail"

# Set the interval (in ms) between emails being sent
export CS_API_EMAIL_NOTIFICATION_INTERVAL=300000

# Suppress all email sends
export CS_API_SUPPRESS_EMAILS=1

# By default we require email confirmation, but for developer convenience
# during testing, the requirement of email confirmation can be turned off
# To turn off the email confirmation requrement, set the below to "1"
# export CS_API_CONFIRMATION_NOT_REQUIRED=

# Domain to use when setting a reply-to for outgoing emails
# This is used when sending email notifications, we want replies to come back
# to us and for the stream where the original post originated to be identified
# in the reply-to address
export CS_API_REPLY_TO_DOMAIN=dev.codestream.com

# Emails sent from CodeStream will be sent using this address
export CS_API_SENDER_EMAIL=alerts@codestream.com

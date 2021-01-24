
. $DT_TOP/lib/sandbox_utils.sh

if [ -n "$CSBE_TOP" ]; then
	# ----- mono-repo
	export CS_BROADCASTER_REPO_ROOT=$CSBE_TOP
else
	# ----- single-service (api only)
	export CS_BROADCASTER_REPO_ROOT=$(. $CS_BROADCASTER_SANDBOX/sb.info; echo $CS_BROADCASTER_SANDBOX/$SB_REPO_ROOT)
	export CSSVC_BACKEND_ROOT=$CS_BROADCASTER_REPO_ROOT
fi
. $CSSVC_BACKEND_ROOT/sandbox/shared/sandbox_config.sh || return 1

# common sandbox initialization routines
sbcfg_initialize CS_BROADCASTER

if [ -n "$CSSVC_CFG_URL" ]; then 
	# hope these match the mongo config
	[ -z "$CS_BROADCASTER_INBOUND_EMAIL_DIRECTORY" ] && export CS_BROADCASTER_INBOUND_EMAIL_DIRECTORY=${CS_BROADCASTER_SANDBOX}/mailq/new
	[ -z "$CS_BROADCASTER_TEMP_ATTACHMENT_DIRECTORY" ] && export CS_BROADCASTER_TEMP_ATTACHMENT_DIRECTORY=${CS_BROADCASTER_SANDBOX}/mailq/attachments
	[ -z "$CS_BROADCASTER_PROCESS_DIRECTORY" ] && export CS_BROADCASTER_PROCESS_DIRECTORY=${CS_BROADCASTER_SANDBOX}/mailq/process
else
	# Check Core Variables
	sbcfg_check_cfg_prop broadcastEngine.codestreamBroadcaster.logger.directory inboundEmailServer.logger.directory CS_BROADCASTER_LOGS 2>/dev/null
	sbcfg_check_cfg_prop inboundEmailServer.tmpDirectory CS_BROADCASTER_TMP

	[ -z "`eval echo $(get-json-property -j $CSSVC_CFG_FILE -p broadcastEngine.codestreamBroadcaster.host 2>/dev/null)`" ] && echo "The config file does not support the codestream broadcaster as a broadcastEngine. This sandbox is DOA." && export CS_BROADCASTER_DOA=1
fi

return 0
























# [ "$CS_BROADCASTER_SANDBOX" != "$CSBE_SANDBOX" ] && { sandutil_load_options $CS_BROADCASTER_SANDBOX || { echo "failed to load options" >&2 && return 1; } }

# # ------------- Node --------------
# # Uncomment and setup if node is required. Available versions can be seen
# # with the command:
# #   ssh $DT_CLOUD_SERVER ls /home/web/SandboxRepos/software/node-$DT_OS_TYPE-*
# [ -z "$CS_BROADCASTER_NODE_VER" ] && export CS_BROADCASTER_NODE_VER=12.14.1
# export PATH=$CS_BROADCASTER_SANDBOX/node/bin:$CS_BROADCASTER_TOP/node_modules/.bin:$PATH
# export NODE_PATH=$CS_BROADCASTER_TOP/node_modules:$NODE_PATH

# # Add $MY_SANDBOX/bin to the search path
# export PATH=$CS_BROADCASTER_TOP/bin:$PATH

# # if you want to short circuit the sandbox hooks (see hooks/git_hooks.sh) either uncomment
# # this in defaults.sh or add 'CS_BROADCASTER_DISABLE_GIT_HOOKS=1' to CS_BROADCASTER_SANDBOX/sb.options
# # export CS_BROADCASTER_DISABLE_GIT_HOOKS=1

# # ---- Core Variables
# [ -z "$CS_BROADCASTER_LOGS" ] && export CS_BROADCASTER_LOGS=$CS_BROADCASTER_SANDBOX/log
# [ -z "$CS_BROADCASTER_PIDS" ] && export CS_BROADCASTER_PIDS=$CS_BROADCASTER_SANDBOX/pid
# [ -z "$CS_BROADCASTER_TMP" ] && export CS_BROADCASTER_TMP=$CS_BROADCASTER_SANDBOX/tmp
# [ -z "$CS_BROADCASTER_CONFS" ] && export CS_BROADCASTER_CONFS=$CS_BROADCASTER_SANDBOX/conf
# [ -z "$CS_BROADCASTER_DATA" ] && export CS_BROADCASTER_DATA=$CS_BROADCASTER_SANDBOX/data

# # ---- RUN TIME ENVIRONMENT  usually  'local', 'qa', 'prod', 'loadtest1', ...
# # https://github.com/TeamCodeStream/dev_tools/blob/master/README/README.deployments.md)
# [ -n "$CSSVC_ENV" ] && export CS_BROADCASTER_ENV=$CSSVC_ENV || { [ -n "$CS_BROADCASTER_ENV" ] && export CSSVC_ENV=$CS_BROADCASTER_ENV; }
# [ -z "$CSSVC_ENV" ] && export CSSVC_ENV=local && export CS_BROADCASTER_ENV=local && [ -n "$DT_VERBOSE" ] && echo "setting up local env"

# # These variables are used by shell scripts
# [ -z "$CS_BROADCASTER_ASSET_ENV" ] && export CS_BROADCASTER_ASSET_ENV=local

# ---- CONFIG
# if [ -n "$CSSVC_CFG_URL" ]; then 
# 	echo "CSSVC_CFG_FILE=$CSSVC_CFG_URL"
# else
# 	[ -n "$CS_BROADCASTER_CFG_FILE" ] && configParm=$CS_BROADCASTER_CFG_FILE || configParm="$CSSVC_CONFIGURATION"
# 	[ -z "$CSSVC_CFG_FILE" ] && sandutil_get_codestream_cfg_file "$CS_BROADCASTER_SANDBOX" "$configParm" "$CSSVC_ENV"
# 	# ---- Pull values from config file
# 	# export CS_BROADCASTER_LOGS=`eval echo $(get-json-property -j $CSSVC_CFG_FILE -p broadcastEngine.codestreamBroadcaster.logger.directory 2>/dev/null)`
# 	# ---- File Config Sanity Check
# 	# _x=`eval echo $(get-json-property -j $CSSVC_CFG_FILE -p sharedGeneral.runTimeEnvironment)`
# 	# [ "$_x" != "$CSSVC_ENV" ] && echo "Error: CSSVC_ENV ($CSSVC_ENV) != sharedGeneral.runTimeEnvironment ($_x)" && return 1
# 	[ -z "`eval echo $(get-json-property -j $CSSVC_CFG_FILE -p broadcastEngine.codestreamBroadcaster.host 2>/dev/null)`" ] && echo "The config file does not support the codestream broadcaster as a broadcastEngine. This sandbox is DOA." && export CS_BROADCASTER_DOA=1
# fi

# # ---- General Sanity Check
# [ -n "$CS_BROADCASTER_CFG_FILE" -a \( "$CSSVC_CFG_FILE" != "$CS_BROADCASTER_CFG_FILE" \) ] && echo "warning: CS_BROADCASTER_CFG_FILE != CSSVC_CFG_FILE"
# [ -z "$CSSVC_ENV" ] && echo "ERROR: CSSVC_ENV not set" && return 1


# # Mono-repos can be installed as one mono-repo or its individual services (api,
# # broadcaster, ...). These variables will vary accordingly.
# [ -n "$CSBE_TOP" ] && export CS_BROADCASTER_REPO_ROOT=$CSBE_TOP || { . $CS_BROADCASTER_SANDBOX/sb.info; export CS_BROADCASTER_REPO_ROOT=$CS_BROADCASTER_SANDBOX/$SB_REPO_ROOT; }
# [ -z "$CSSVC_BACKEND_ROOT" ] && export CSSVC_BACKEND_ROOT=$CS_BROADCASTER_REPO_ROOT
# return 0

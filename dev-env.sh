
# This file is meant to be sourced into the shell environment

[ ! -d .git -o ! -d ./api_server ] && echo "change to the root of your codestream-server repo before sourcing in this file" && return 1
[ -f .codestream_cfg_url ] && source .codestream_cfg_url && echo "loading .codestream_cfg_url"
[ -z "$CSSVC_BACKEND_ROOT" ] && export CSSVC_BACKEND_ROOT=$(pwd)
[ -z "$CSSVC_ENV" ] && export CSSVC_ENV=local
[ -z "$CSSVC_CFG_URL" ] && export CSSVC_CFG_URL=mongodb://localhost/codestream
[ -n "$PATH" ] && export PATH=$CSSVC_BACKEND_ROOT/api_server/bin:$CSSVC_BACKEND_ROOT/broadcaster/bin:$CSSVC_BACKEND_ROOT/outbound_email/bin:$CSSVC_BACKEND_ROOT/inbound_email/bin:$PATH
[[ "$SHELL" == *zsh* ]] && rehash
return 0

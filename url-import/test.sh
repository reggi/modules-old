#!/bin/bash
BASEDIR="$(cd "$(dirname "$0")"; pwd)";
echo "$BASEDIR"
cd "$BASEDIR"

# # This is meant to test the unix system to if two
# # different change directory commands end up in
# # the same location. Helps Hierarchy determine
# # what the ideal resolve path looks like.
# function test () {
#   pwd
#   START=$1
#   AA=$2
#   BB=$3

#   cd "$START"
#   START=`pwd`

#   cd "$AA"
#   A=`pwd`

#   cd "$START"

#   cd "$BB"
#   B=`pwd`

#   cd "$BASEDIR"

#   [[ "$A" == "$B" ]] || { echo >&2 "Not Match"; exit 1; }
# }

# function pre () {
#   mkdir -p a/a/foo/a/a
#   mkdir -p a/a/bar/a/a
#   mkdir -p a/a/baz/a/a
# }

# function post () {
#   rm -rf ./a
#   cd $BASEDIR
# }

# pre
# test $BASEDIR "../url-import/../url-import/../url-import/../url-import/" "../url-import"
# test ./a/a/foo/a "../../foo/../bar/../baz" "../../baz"
# test ./a/a "./foo/a/../a/" "./foo/a"
# post
# echo "unix cases ✅"

# alias ts-node=../node_modules/.bin/ts-node
# ts-node ./hierarchy_test_node.ts
# echo "typescript cases ✅"
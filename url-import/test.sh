#!/bin/bash
BASEDIR="$(cd "$(dirname "$0")"; pwd)"
cd "$BASEDIR" || exit

# This is meant to test the unix system to if two
# different change directory commands end up in
# the same location. Helps Hierarchy determine
# what the ideal resolve path looks like.

test() {
  START=$1
  AA=$2
  BB=$3

  echo $BASEDIR
  echo $START
  echo $AA
  echo $BB

  cd "$START" || exit
  START=$(pwd)

  cd "$AA" || exit
  A=$(pwd)

  cd "$START" || exit

  cd "$BB" || exit
  B=$(pwd)

  cd "$BASEDIR" || exit

  echo $A
  echo $B

  [[ "$A" == "$B" ]] || { echo >&2 "Not Match"; exit 1; }
}

pre() {
  mkdir -p a/a/foo/a/a
  mkdir -p a/a/bar/a/a
  mkdir -p a/a/baz/a/a
}

post() {
  rm -rf ./a
  cd "$BASEDIR" || exit
}

pre
test "$BASEDIR" "../url-import/../url-import/../url-import/../url-import/" "../url-import"
test "./a/a/foo/a" "../../foo/../bar/../baz" "../../baz"
test "./a/as" "./foo/a/../a/" "./foo/a"
post
echo "unix cases ✅"

alias ts-node=../node_modules/.bin/ts-node
ts-node ./hierarchy_test_node.ts
echo "typescript cases ✅"
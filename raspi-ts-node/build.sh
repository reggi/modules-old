BASEDIR="$(cd "$(dirname "$0")"; pwd)"
tsc $BASEDIR/*.ts --outDir $BASEDIR/../raspi-node
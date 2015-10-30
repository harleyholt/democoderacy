#!/usr/bin/env bash
databaseDir="$(dirname "$0")"
docker inspect --format="{{ .State.Running }}" democoderacy-db 2> /dev/null
if [ $? -eq 1 ]; then
  ${databaseDir}/setup.sh
  exit 0
fi
docker start democoderacy-db

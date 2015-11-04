#!/usr/bin/env bash
docker pull --tag=2.1.5 rethinkdb
docker run -d -p 30080:8080 -p 38015:28015 -p 39015:29015 --name democoderacy-db rethinkdb

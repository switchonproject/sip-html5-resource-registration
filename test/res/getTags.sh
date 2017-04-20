#!/bin/bash

curl -v 'http://localhost:8890/searches/SWITCHON.de.cismet.cids.custom.switchon.search.server.TagsSearch/results?deduplicate=true&limit=100&offset=0&omitNullValues=true' \
-H 'Content-Type: application/json;charset=UTF-8' \
-H 'Accept: application/json, text/plain, */*' \
-H 'Cache-Control: no-cache' \
-H 'Authorization: Basic *****************************' \
-X POST \
--data-binary '{"list":[{"key":"taggroup","value":"access conditions"}]}' \
--output access-conditions.json
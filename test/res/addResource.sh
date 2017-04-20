#!/bin/bash

# http://localhost:8383/sip-html5-resource-registration/app/index.html#?representations=%5B%7B%0A%20%20%20%20%20%20%20%20%22function%22:%20%22download%22,%0A%20%20%20%20%20%20%20%20%22contenttype%22:%20%22application%2Fzip%22,%0A%20%20%20%20%20%20%20%20%22name%22:%20%22The%20K%C3%BChtai%20data%20set:%2025%20years%20of%20lysimetric,%20snow%20pillow%20and%20meteorological%20measurements%22,%0A%20%20%20%20%20%20%20%20%22protocol%22:%20%22WWW:DOWNLOAD-1.0-http--download%22,%0A%20%20%20%20%20%20%20%20%22type%22:%20%22original%20data%22,%0A%20%20%20%20%20%20%20%20%22contentlocation%22:%20%22https:%2F%2Fzenodo.org%2Frecord%2F556110%2Ffiles%2Fsnow_and_meteo_data_kuhtai_1990-2015.zip%22,%0A%20%20%20%20%20%20%20%20%22description%22:%20%22File%20download%22%0A%20%20%20%20%7D%5D&deposition=71764

curl -v 'http://localhost:8890/SWITCHON.resource?requestResultingInstance=true&role=all' \
-H 'Content-Type: application/json;charset=UTF-8' \
-H 'Accept: application/json, text/plain, */*' \
-H 'Cache-Control: no-cache' \
-H 'Authorization: Basic ******************************' \
-X POST \
--data-binary @request.resource.json \
--output response.resource.json
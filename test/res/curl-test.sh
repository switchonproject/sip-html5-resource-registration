curl 'http://localhost:8890/SWITCHON.resource?requestResultingInstance=true&role=all' -H 'Pragma: no-cache' -H 'Origin: http://localhost:8383' -H 'Accept-Encoding: gzip, deflate' -H 'Accept-Language: de-DE,de;q=0.8,en-US;q=0.6,en;q=0.4' -H 'Authorization: Basic YWRtaW5AU1dJVENIT046Y2lzbWV0' -H 'Content-Type: application/json;charset=UTF-8' -H 'Accept: application/json, text/plain, */*' -H 'Cache-Control: no-cache' -H 'User-Agent: Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36' -H 'Connection: keep-alive' -H 'Referer: http://localhost:8383/sip-html5-resource-registration/index.html' -H 'DNT: 1' --data-binary $'{"$self":"/SWITCHON.RESOURCE/-1","id":-1,"fromdate":null,"accessconditions":{"$self":"/SWITCHON.TAG/158","id":158,"name":"Creative Commons (CC BY)","taggroup":{"$self":"/SWITCHON.TAGGROUP/145","id":145,"name":"access conditions","description":"License regulating the conditions for access and use of the data (open group with some predefined tags)."},"description":"<a href=\'http://creativecommons.org/licenses/by/4.0/legalcode\' target=\'_blank\'>Creative Commons Attribution 4.0 International (CC BY 4.0)</a>"},"spatialcoverage":{"$self":"/SWITCHON.GEOM/-1","id":-1,"geo_field":"SRID=4326;POLYGON((-31.5 82.2,74.4 82.2,74.4 34.5,-31.5 34.5,-31.5 82.2))"},"todate":null,"srid":{"$self":"/SWITCHON.TAG/226","id":226,"name":"EPSG:4326","taggroup":{"$self":"/SWITCHON.TAGGROUP/167","id":167,"name":"srid","description":"The Spatial Reference System Identifier (SRID) of the spatial coverage of the resource EPSG format (open group with some predefined tags)."},"description":"WGS 84 / World Geodetic System 1984"},"conformity":{"$self":"/SWITCHON.TAG/253","id":253,"name":"Not evaluated","taggroup":{"$self":"/SWITCHON.TAGGROUP/150","id":150,"name":"conformity","description":"This is a citation of the implementing rules adopted under Article 7(1) of Directive 2007/2/EC or other specification to which a particular resource conforms. (fixed group)"},"description":"Not evaluated"},"language":{"$self":"/SWITCHON.TAG/145","id":145,"name":"eng","taggroup":{"$self":"/SWITCHON.TAGGROUP/157","id":157,"name":"language","description":"The language(s) used within the resource or in which the metadata elements are expressed.  The value domain of this tag is limited to the languages defined in ISO 639-2."},"description":"English"},"description":"SHP Upload TEST 2016-06-13 #3","type":{"$self":"/SWITCHON.TAG/1535","id":1535,"name":"open data","taggroup":{"$self":"/SWITCHON.TAGGROUP/164","id":164,"name":"resource type","description":"SIP internal type of the resource (fixed group)."},"description":"This is data available as open data from any source on the Internet. The data has been registered through the switchon website"},"location":null,"topiccategory":{"$self":"/SWITCHON.TAG/230","id":230,"name":"climatologyMeteorologyAtmosphere","taggroup":{"$self":"/SWITCHON.TAGGROUP/168","id":168,"name":"topic category","description":"High-level classification of resources in accordance with ISO 19115 for grouping and topic-based search (fixed group)."},"description":"processes and phenomena of the atmosphere. Examples: cloud cover, weather, climate, atmospheric conditions, climate change, precipitation"},"creationdate":null,"name":"SHP Upload TEST 2016-06-13","licensestatement":null,"tags":[{"$self":"/SWITCHON.TAG/1425","id":1425,"name":"Other organic chemical","taggroup":{"$self":"/SWITCHON.TAGGROUP/169","id":169,"name":"keywords - X-CUAHSI","description":"X-CUAHSI keywords build on a hierarchical keyword selection from the hydrologic ontology developed by CUAHSI, with additinal hierarchical keywords for relevant non-hydrosphere data."},"description":"n/a"}],"contact":null,"geography":null,"representation":[{"$self":"/SWITCHON.REPRESENTATION/-1","id":-1,"name":"SHP Upload TEST 2016-06-13","description":"File download","content":null,"type":{"$self":"/SWITCHON.TAG/212","id":212,"name":"original data","taggroup":{"$self":"/SWITCHON.TAGGROUP/163","id":163,"name":"representation type","description":"SIP internal type of the representation of the resource (fixed group)."},"description":"The representation holds the original data of the resource"},"function":{"$self":"/SWITCHON.TAG/71","id":71,"name":"download","taggroup":{"$self":"/SWITCHON.TAGGROUP/152","id":152,"name":"function","description":"Function that can be perfomred following the contentLocation link to the resource representation (fixed group, standard codelist)."},"description":"The link will get the dataset. The function of the link is to download a file."},"protocol":{"$self":"/SWITCHON.TAG/1386","id":1386,"name":"WWW:DOWNLOAD-1.0-http--download","taggroup":{"$self":"/SWITCHON.TAGGROUP/161","id":161,"name":"protocol","description":"Protocol of the service that can be accessed at the contentLocation of the resource representation (open group with several predefined tags from standard codelists)."},"description":"Web Address (URL), this is a download URL"},"applicationprofile":null,"uuid":"689fe0bc-29e7-4c05-af23-be44b519eacf","temporalresolution":null,"spatialresolution":null,"spatialscale":null,"contentlocation":"http://dl-ng003.xtr.deltares.nl/data/shp_upload_test_2016_06_13/download.zip","tags":null,"contenttype":{"$self":"/SWITCHON.TAG/53","id":53,"name":"application/zip","taggroup":{"$self":"/SWITCHON.TAGGROUP/151","id":151,"name":"content type","description":"MIME Type of the representation (open group which several predefined tags)."},"description":"ZIP (zip archive file format)"},"uploadstatus":null,"uploadmessage":"deriveSpatialIndex:shp"},{"$self":"/SWITCHON.REPRESENTATION/-1","id":-1,"name":"20141218_GRDC_Stations.shp","description":"WMS service","content":null,"type":{"$self":"/SWITCHON.TAG/212","id":212,"name":"original data","taggroup":{"$self":"/SWITCHON.TAGGROUP/163","id":163,"name":"representation type","description":"SIP internal type of the representation of the resource (fixed group)."},"description":"The representation holds the original data of the resource"},"function":{"$self":"/SWITCHON.TAG/72","id":72,"name":"service","taggroup":{"$self":"/SWITCHON.TAGGROUP/152","id":152,"name":"function","description":"Function that can be perfomred following the contentLocation link to the resource representation (fixed group, standard codelist)."},"description":"link is service endpoint"},"protocol":{"$self":"/SWITCHON.TAG/186","id":186,"name":"OGC:WMS-1.1.1-http-get-capabilities","taggroup":{"$self":"/SWITCHON.TAGGROUP/161","id":161,"name":"protocol","description":"Protocol of the service that can be accessed at the contentLocation of the resource representation (open group with several predefined tags from standard codelists)."},"description":"OGC Web Map Service"},"applicationprofile":null,"uuid":"de0b4065-460b-4843-8d6e-fdea3110a8cd","temporalresolution":null,"spatialresolution":null,"spatialscale":null,"contentlocation":"http://dl-ng003.xtr.deltares.nl/geoserver/shp_upload_test_2016_06_13/wms?service=WMS&version=1.1.0&request=GetCapabilities","tags":null,"contenttype":{"$self":"/SWITCHON.TAG/51","id":51,"name":"application/xml","taggroup":{"$self":"/SWITCHON.TAGGROUP/151","id":151,"name":"content type","description":"MIME Type of the representation (open group which several predefined tags)."},"description":"XML (eXtensible Markup Language)"},"uploadstatus":null,"uploadmessage":null},{"$self":"/SWITCHON.REPRESENTATION/-1","id":-1,"name":"20141218_GRDC_Stations.shp","description":"WFS service","content":null,"type":{"$self":"/SWITCHON.TAG/212","id":212,"name":"original data","taggroup":{"$self":"/SWITCHON.TAGGROUP/163","id":163,"name":"representation type","description":"SIP internal type of the representation of the resource (fixed group)."},"description":"The representation holds the original data of the resource"},"function":{"$self":"/SWITCHON.TAG/72","id":72,"name":"service","taggroup":{"$self":"/SWITCHON.TAGGROUP/152","id":152,"name":"function","description":"Function that can be perfomred following the contentLocation link to the resource representation (fixed group, standard codelist)."},"description":"link is service endpoint"},"protocol":{"$self":"/SWITCHON.TAG/185","id":185,"name":"OGC:WFS-1.0.0-http-get-capabilities","taggroup":{"$self":"/SWITCHON.TAGGROUP/161","id":161,"name":"protocol","description":"Protocol of the service that can be accessed at the contentLocation of the resource representation (open group with several predefined tags from standard codelists)."},"description":"OGC Web Feature Service, a WFS getcapabilities operation"},"applicationprofile":null,"uuid":"7bc8165c-b985-4287-81af-ebbe295120f7","temporalresolution":null,"spatialresolution":null,"spatialscale":null,"contentlocation":"http://dl-ng003.xtr.deltares.nl/geoserver/shp_upload_test_2016_06_13/ows?service=WFS&version=1.0.0&request=GetCapabilities","tags":null,"contenttype":{"$self":"/SWITCHON.TAG/51","id":51,"name":"application/xml","taggroup":{"$self":"/SWITCHON.TAGGROUP/151","id":151,"name":"content type","description":"MIME Type of the representation (open group which several predefined tags)."},"description":"XML (eXtensible Markup Language)"},"uploadstatus":null,"uploadmessage":null},{"$self":"/SWITCHON.REPRESENTATION/-1","id":-1,"name":"20141218_GRDC_Stations","description":"WMS service","content":null,"type":{"$self":"/SWITCHON.TAG/213","id":213,"name":"aggregated data","taggroup":{"$self":"/SWITCHON.TAGGROUP/163","id":163,"name":"representation type","description":"SIP internal type of the representation of the resource (fixed group)."},"description":"The representation holds aggregated data of the resource, e.g. average mean values"},"function":{"$self":"/SWITCHON.TAG/72","id":72,"name":"service","taggroup":{"$self":"/SWITCHON.TAGGROUP/152","id":152,"name":"function","description":"Function that can be perfomred following the contentLocation link to the resource representation (fixed group, standard codelist)."},"description":"link is service endpoint"},"protocol":{"$self":"/SWITCHON.TAG/186","id":186,"name":"OGC:WMS-1.1.1-http-get-capabilities","taggroup":{"$self":"/SWITCHON.TAGGROUP/161","id":161,"name":"protocol","description":"Protocol of the service that can be accessed at the contentLocation of the resource representation (open group with several predefined tags from standard codelists)."},"description":"OGC Web Map Service"},"applicationprofile":null,"uuid":"4670a614-599b-4a9e-8e33-43c56a7eaf3a","temporalresolution":null,"spatialresolution":null,"spatialscale":null,"contentlocation":"http://dl-ng003.xtr.deltares.nl/geoserver/shp_upload_test_2016_06_13/wms?service=WMS&version=1.1.0&request=GetCapabilities","tags":null,"contenttype":{"$self":"/SWITCHON.TAG/51","id":51,"name":"application/xml","taggroup":{"$self":"/SWITCHON.TAGGROUP/151","id":151,"name":"content type","description":"MIME Type of the representation (open group which several predefined tags)."},"description":"XML (eXtensible Markup Language)"},"uploadstatus":null,"uploadmessage":null}],"lastmodificationdate":null,"metadata":[{"$self":"/SWITCHON.METADATA/-1","id":-1,"name":"OpenData Registration Meta-Data","tags":[],"description":"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36","contact":null,"type":{"$self":"/SWITCHON.TAG/177","id":177,"name":"basic meta-data","taggroup":{"$self":"/SWITCHON.TAGGROUP/160","id":160,"name":"meta-data type","description":"SIP internal type of the Meta-Data Record."},"description":"Type of the Meta-Data Record. \\"basic meta-data\\" refers to meta-data collected by switch-on according to the SIM meta-data schema. In fact, this meta-meta-data record refers to enclosing resource meta-data record."},"language":{"$self":"/SWITCHON.TAG/145","id":145,"name":"eng","taggroup":{"$self":"/SWITCHON.TAGGROUP/157","id":157,"name":"language","description":"The language(s) used within the resource or in which the metadata elements are expressed.  The value domain of this tag is limited to the languages defined in ISO 639-2."},"description":"English"},"standard":{"$self":"/SWITCHON.TAG/1387","id":1387,"name":"SWITCH-ON SIM","taggroup":{"$self":"/SWITCHON.TAGGROUP/159","id":159,"name":"meta-data standard","description":"Official standard on which the meta-data record is based (open group with some predefined tags)."},"description":"Meta-Data Record compliant to the Standard Information Model (SIM) of the Spatial Information Platform (SIP) of the EU FP7 project SWITCH-ON."},"uuid":null,"contentlocation":null,"creationdate":1465823383032,"contenttype":{"$self":"/SWITCHON.TAG/40","id":40,"name":"application/json","taggroup":{"$self":"/SWITCHON.TAGGROUP/151","id":151,"name":"content type","description":"MIME Type of the representation (open group which several predefined tags)."},"description":"JSON (Java Script Object Notation)"},"content":"[{\\"key\\":\\"standalone\\",\\"value\\":\\"true\\",\\"lastBuildDate\\":1465792634910},{\\"key\\":\\"startupMode\\",\\"value\\":\\"non-interactive\\",\\"lastBuildDate\\":1465792635575},{\\"key\\":\\"registry\\",\\"value\\":\\"NO-REGISTRY-BECAUSE-OF-STANDALONE-SERVER\\",\\"lastBuildDate\\":1465792634910},{\\"key\\":\\"cachedUsers\\",\\"value\\":\\"1\\",\\"lastBuildDate\\":1465792734638},{\\"key\\":\\"connector\\",\\"value\\":\\"0.0.0.0:8890\\",\\"lastBuildDate\\":1465792635552},{\\"key\\":\\"sslEnabled\\",\\"value\\":\\"false\\",\\"lastBuildDate\\":1465792634910},{\\"key\\":\\"activeCores\\",\\"value\\":[\\"core.legacy.action\\",\\"core.legacy.entity\\",\\"core.legacy.entityInfo\\",\\"core.default.infrastructure\\",\\"core.legacy.node\\",\\"core.legacy.permission\\",\\"core.legacy.search\\",\\"core.legacy.user\\"],\\"lastBuildDate\\":1465792634912},{\\"key\\":\\"serverStart\\",\\"value\\":\\"1465792635573\\",\\"lastBuildDate\\":1465792635573},{\\"key\\":\\"cachedClasses\\",\\"value\\":\\"18\\",\\"lastBuildDate\\":1465792735547},{\\"key\\":\\"request\\",\\"value\\":{\\"localName\\":\\"127.0.0.1\\",\\"Host\\":\\"localhost:8890\\",\\"localAddress\\":\\"127.0.0.1\\",\\"X-Forwarded-Server\\":\\"switchon.cismet.de\\",\\"User-Agent\\":\\"Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36\\",\\"Origin\\":\\"http://localhost:8383\\",\\"Connection\\":\\"Keep-Alive\\",\\"Pragma\\":\\"no-cache\\",\\"Cache-Control\\":\\"no-cache\\",\\"X-Forwarded-Host\\":\\"switchon.cismet.de\\",\\"Accept-Language\\":\\"de-DE,de;q=0.8,en-US;q=0.6,en;q=0.4\\",\\"Referer\\":\\"http://localhost:8383/sip-html5-resource-registration/index.html\\",\\"Accept-Encoding\\":\\"gzip, deflate, sdch\\",\\"DNT\\":\\"1\\",\\"X-Forwarded-For\\":\\"134.96.213.194\\",\\"Accept\\":\\"application/json, text/plain, */*\\"},\\"lastBuildDate\\":1465818748160}]"}],"accesslimitations":{"$self":"/SWITCHON.TAG/1","id":1,"name":"limitation not listed","taggroup":{"$self":"/SWITCHON.TAGGROUP/146","id":146,"name":"access limitations","description":"Limitations on public access in accordance to Article 13 of Directive 2007/2/EC (fixed group with tags from a standard codelist)."},"description":"otherRestrictions (limitation not listed)"},"uuid":"8a95efd1-827c-4421-a5cd-eabef7f1c602","collection":{"$self":"/SWITCHON.TAG/1534","id":1534,"name":"Open Datasets","taggroup":{"$self":"/SWITCHON.TAGGROUP/149","id":149,"name":"collection","description":"Assigns the resource to a collection of resources for cataloguing purposes, e.g. SWITCH-ON Experiment Results, etc. (open group with some predefined tags)."},"description":"Open Datasets registered through the SWITCH-ON Website"},"publicationdate":null}' --compressed
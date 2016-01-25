angular.module(
    'de.cismet.sip-html5-resource-registration.services'
).factory('de.cismet.sip-html5-resource-registration.services.TagGroupService',
    ['$resource', 'eu.water-switch-on.sip.services.Base64', 'AppConfig',
        function ($resource, Base64, AppConfig) {
            'use strict';

            var tagGroups, lazyLoadTagLists, config, authdata,
                tagSearches, searchResource, searchTags, getTagListFunction;


            tagSearches = {
                'keyword-x-cuahsi': 'X-CUAHSI'
            };

            // cached tag group lists
            tagGroups = {};

            config = AppConfig.searchService;
            authdata = Base64.encode(config.username + ':' + config.password);

            // remote legagy search core search
            // FIXME: limit and offset not implemented in legacy search!
            // currently, limit and offset are appended to the POST query parameter!
            searchResource = $resource(config.host + '/searches/SWITCHON.de.cismet.cids.custom.switchon.search.server.ResourceTagsSearch/results',
                {
                    limit: 20,
                    offset: 0,
                    omitNullValues: true,
                    deduplicate: true
                }, {
                    search: {
                        method: 'POST',
                        params: {
                        },
                        isArray: false,
                        headers: {
                            'Authorization': 'Basic ' + authdata
                        }
                    }
                });

            searchTags = function (tagGroups) {
                var queryObject, searchResult;

                queryObject = {
                    'list': [{'key': 'taggroups', 'value': tagGroups}]
                };
                searchResult = searchResource.search(
                    {},
                    queryObject
                );
                return searchResult;
            };

            lazyLoadTagLists = function (tagGroup, array) {
                var intermediateResult, tags, tagResource, i;
                // cached list does exist
                if (tagGroups.hasOwnProperty(tagGroup)) {
                    return tagGroups[tagGroup];
                }


                    intermediateResult = searchTags(tagSearches[tagGroup]);
                    tags = [];
                    tags.$resolved = false;
                    tags.$promise = intermediateResult.$promise.then(function (resource) {
                        for (i = 0; i < resource.$collection.length; i++) {
                            tags.push(resource.$collection[i]);
                        }
                        tags.$resolved = true;
                        return tags;
                    });
                    tagGroups[tagGroup] = tags;
                    return tagGroups[tagGroup];
                
            };

            getTagListFunction =
                function (tagGroup) {
                    return lazyLoadTagLists(tagGroup, true);
                };


            return {
                getTagList: getTagListFunction
            };
        }]
    );

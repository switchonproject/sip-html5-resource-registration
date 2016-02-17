angular.module(
        'de.cismet.sip-html5-resource-registration.services'
        ).factory('de.cismet.sip-html5-resource-registration.services.TagGroupService',
        ['$resource', 'de.cismet.sip-html5-resource-registration.services.Base64', 'AppConfig',
            function ($resource, Base64, AppConfig) {
                'use strict';

                var tagGroups, lazyLoadTagLists, config, authdata,
                        tagSearches, searchResource, searchTags, getTagListFunction, getTagFunction;


                tagSearches = {
                    'keyword-x-cuahsi': 'X-CUAHSI'
                };

                // cached tag group lists
                tagGroups = [];

                config = AppConfig.searchService;
                authdata = Base64.encode(config.username + ':' + config.password);

                // remote legagy search core search
                // FIXME: limit and offset not implemented in legacy search!
                // currently, limit and offset are appended to the POST query parameter!
                searchResource = $resource(config.host + '/searches/SWITCHON.de.cismet.cids.custom.switchon.search.server.TagsSearch/results',
                        {
                            limit: 100,
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

                searchTags = function (taggroup, tags) {
                    var queryObject, searchResult;

                    if (!tags) {
                        queryObject = {
                            'list': [{'key': 'taggroup', 'value': taggroup}]
                        };
                    } else {
                        queryObject = {
                            'list': [{'key': 'taggroup', 'value': taggroup},
                                {'key': 'tags', 'value': tags}]
                        };
                    }


                    searchResult = searchResource.search(
                            {},
                            queryObject
                            );
                    return searchResult;
                };

                lazyLoadTagLists = function (taggroup, tags) {
                    var intermediateResult, resultTags, i;
                    // cached list does exist
                    if (tagGroups.hasOwnProperty(taggroup)) {
                        return tagGroups[taggroup];
                    }


                    intermediateResult = searchTags(taggroup, tags);
                    resultTags = [];
                    resultTags.$resolved = false;
                    resultTags.$promise = intermediateResult.$promise.then(function (resource) {
                        for (i = 0; i < resource.$collection.length; i++) {
                            resultTags.push(resource.$collection[i]);
                        }
                        resultTags.$resolved = true;
                        return resultTags;
                    });
                    tagGroups[taggroup] = resultTags;
                    return tagGroups[taggroup];

                };

                getTagListFunction =
                        function (taggroup, tags) {
                            return lazyLoadTagLists(taggroup, tags);
                        };

                getTagFunction =
                        function (taggroup, tag, callbackFunction) {
                            if (tagGroups.hasOwnProperty(taggroup)) {
                                if (tagGroups[taggroup].$resolved === true) {
                                    for (var i = 0; i < tagGroups[taggroup].length; i++) {
                                        if (tagGroups[taggroup][i].name && tagGroups[taggroup][i].name === tag) {
                                            return tagGroups[taggroup][i];
                                        }
                                    }
                                } else if (callbackFunction) {
                                    tagGroups[taggroup].$promise.then(function (resolvedTaggroup) {
                                        for (var i = 0; i < resolvedTaggroup.length; i++) {
                                            if (resolvedTaggroup[i].name && resolvedTaggroup[i].name === tag) {
                                                callbackFunction(resolvedTaggroup[i]);
                                                return resolvedTaggroup[i];
                                            }
                                        }
                                    });
                                }
                            }
                            return null;
                        };

                return {
                    getTagList: getTagListFunction,
                    getTag: getTagFunction
                };
            }]
        );

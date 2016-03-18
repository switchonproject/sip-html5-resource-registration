/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

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
                        resultTags = tagGroups[taggroup];
                        if (!resultTags.$resolved) {
                            console.warn('possible synchonisation problem for taggroup ' + taggroup);
                            resultTags.$promise.then(function () {
                                lazyLoadTagLists(taggroup, tags);
                            });
                        }

                        if (tags) {
                            var tmpTags, tagArray, i, j;
                            tmpTags = '';
                            tagArray = tags.split(',');
                            j = 0;
                            for (i = 0; i < tagArray.length; ++i) {
                                if (!resultTags.getTagByName(tagArray[i])) {
                                    if (j > 0) {
                                        tmpTags += ',';
                                    }
                                    tmpTags += tagArray[i];
                                    j++;
                                }
                            }

                            // tag list exists but entry not found
                            if (j > 0) {
                                tags = tmpTags;
                            } else {
                                return resultTags;
                            }

                        } else {
                            return resultTags;
                        }
                    } else {
                        resultTags = [];
                        resultTags.getTagByName = function (tagname) {
                            for (var i = 0; i < this.length; i++) {
                                if (this[i].name && this[i].name === tagname) {
                                    return this[i];
                                }
                            }

                            return null;
                        };
                    }

                    resultTags.$resolved = false;
                    intermediateResult = searchTags(taggroup, tags);

                    resultTags.$promise = intermediateResult.$promise.then(function (resource) {
                        for (i = 0; i < resource.$collection.length; i++) {
                            var resultTag = resource.$collection[i];
                            if (!resultTags.getTagByName(resultTag)) {
                                resultTags.push(resource.$collection[i]);
                            }
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
                                    return tagGroups[taggroup].getTagByName(tag);
                                } else if (callbackFunction) {
                                    tagGroups[taggroup].$promise.then(function (resolvedTaggroup) {
                                        var resolvedTag = resolvedTaggroup.getTagByName(tag);
                                        callbackFunction(resolvedTag);
                                        return resolvedTag;
                                    });
                                }
                            } else if (callbackFunction) {
                                lazyLoadTagLists(taggroup, tag).$promise.then(function (resolvedTaggroup) {
                                    var resolvedTag = resolvedTaggroup.getTagByName(tag);
                                    callbackFunction(resolvedTag);
                                    return resolvedTag;
                                });

                            }
                            return null;
                        };

                return {
                    getTagList: getTagListFunction,
                    getTag: getTagFunction
                };
            }]
        );

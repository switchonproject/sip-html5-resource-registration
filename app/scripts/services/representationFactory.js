/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

angular.module('de.cismet.sip-html5-resource-registration.services')
        .factory('de.cismet.sip-html5-resource-registration.services.RepresentationFactory',
                ['$q', 
                    'de.cismet.sip-html5-resource-registration.services.TagGroupService',
                    function ($q, tagGroupService) {
                        'use strict';

                        function Representation(representation) {
                            var _this; //, resourceTemplate;
                            _this = this;

                            _this.$self = '/SWITCHON.REPRESENTATION/-1';
                            _this.id = -1;

                            if (representation) {
                                for (var key in representation) {
                                    if (representation.hasOwnProperty(key) && !_this.hasOwnProperty(key) &&
                                            key !== '$resolved' && key !== '$promise') {
                                        _this[key] = representation[key];
                                    }
                                }
                            } 
//                            else {
//                                _this.contenttype = 'application/octet-stream';
//                                _this.function = 'download';
//                            }
                        }

                        Representation.prototype.updateTags = function () {
                            var promises;
                            var _that = this;
                            promises = [];

                            // resource type
                            if (!_that.type) {
                                _that.type = 'original data';
                            }
                            if (typeof _that.type !== 'object') {
                                promises.push(tagGroupService.getTagList('representation type').$promise.then(
                                        function (tags) {
                                            _that.type = tags.getTagByName(_that.type);
                                        }));
                            }

                            // resource protocol
                            if (!_that.protocol) {
                                _that.protocol = 'WWW:LINK-1.0-http--link';
                            }
                            if (typeof _that.protocol !== 'object') {
                                promises.push(tagGroupService.getTagList('protocol', 'WWW:LINK-1.0-http--link,OGC:WMS-1.1.1-http-get-capabilities,WWW:TILESERVER,OPeNDAP:OPeNDAP').$promise.then(
                                        function (tags) {
                                            _that.protocol = tags.getTagByName(_that.protocol);
                                        }));
                            }

                            // resource function
                            if (!_that.function) {
                                _that.function = 'download';
                            }
                            if (typeof _that.function !== 'object') {
                                promises.push(tagGroupService.getTagList('function').$promise.then(
                                        function (tags) {
                                            _that.function = tags.getTagByName(_that.function);
                                        }));
                            }

                            // resource content type
                            if (!_that.contenttype) {
                                _that.contenttype = 'application/octet-stream';
                            }
                            if (typeof _that.contenttype !== 'object') {
                                promises.push(tagGroupService.getTagList('content type').$promise.then(
                                        function (tags) {
                                            _that.contenttype = tags.getTagByName(_that.contenttype);
                                        }));
                            }

                            //return a fake promise to satisfy progress watch
                            if (promises.length === 0) {
                                promises.push($q(function (resolve) {
                                    setTimeout(function () {
                                        resolve();
                                    }, 500);
                                }));
                            }
                            
                            return $q.all(promises);
                        };

                        Representation.prototype.constructor = Representation;
                        return Representation;

                    }]);

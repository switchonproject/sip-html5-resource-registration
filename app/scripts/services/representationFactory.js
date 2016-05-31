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
                            _this.name = null;
                            _this.description = null;
                            _this.content = null;
                            _this.type = {};
                            _this.function = {};
                            _this.protocol = {};
                            _this.applicationprofile = null;
                            _this.uuid = null;
                            _this.temporalresolution = null;
                            _this.spatialresolution = null;
                            _this.spatialscale = null;
                            _this.contentlocation = null;
                            _this.tags = null;
                            _this.contenttype = {};
                            _this.uploadstatus = null;
                            _this.uploadmessage = null;

                            // copy properties from remote representation object (angular resource)
                            // and ignore $resolved and $promise
                            if (representation) {
                                for (var key in representation) {
                                    if (representation.hasOwnProperty(key) && _this.hasOwnProperty(key) &&
                                            key !== '$resolved' && key !== '$promise') {
                                        // tags need special handling
                                        if (_this[key] !== null && typeof _this[key] === 'object') {
                                            _this[key].name = representation[key];
                                        } else {
                                                 _this[key] = representation[key];
                                            } 
                                        }
                                    }
                                }
                            }

                        Representation.prototype.updateTags = function () {
                            var promises;
                            var _that = this;
                            promises = [];

                            // resource type
                            if (!_that.type) {
                                _that.type = {};
                            }
                            if (!_that.type.name) {
                                _that.type.name = 'original data';
                            }
                            if (!_that.type.$self || !_that.type.$ref) {
                                promises.push(tagGroupService.getTagList('representation type').$promise.then(
                                        function (tags) {
                                            _that.type = tags.getTagByName(_that.type.name);
                                        }));
                            }

                            // resource protocol
                            if (!_that.protocol) {
                                _that.protocol = {};
                            }
                            if (!_that.protocol.name) {
                                _that.protocol.name = 'WWW:LINK-1.0-http--link';
                            }
                            if (!_that.protocol.$self || !_that.protocol.$ref) {
                                promises.push(tagGroupService.getTagList('protocol', 'WWW:LINK-1.0-http--link,OGC:WMS-1.1.1-http-get-capabilities,WWW:TILESERVER,OPeNDAP:OPeNDAP').$promise.then(
                                        function (tags) {
                                            _that.protocol = tags.getTagByName(_that.protocol.name);
                                        }));
                            }

                            // resource function
                            if (!_that.function.name) {
                                _that.function = {};
                            }
                            if (!_that.function.name) {
                                _that.function = 'download';
                            }
                            if (!_that.function.$self || !_that.function.$ref) {
                                promises.push(tagGroupService.getTagList('function').$promise.then(
                                        function (tags) {
                                            _that.function = tags.getTagByName(_that.function.name);
                                        }));
                            }

                            // resource content type
                            if (!_that.contenttype) {
                                _that.contenttype = {};
                            }
                            if (!_that.contenttype.name) {
                                _that.contenttype.name = 'application/octet-stream';
                            }
                            if (!_that.contenttype.$self || !_that.contenttype.$ref) {
                                promises.push(tagGroupService.getTagList('content type').$promise.then(
                                        function (tags) {
                                            _that.contenttype = tags.getTagByName(_that.contenttype.name);
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

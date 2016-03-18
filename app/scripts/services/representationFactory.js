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
                ['de.cismet.sip-html5-resource-registration.services.TagGroupService',
                    function (tagGroupService) {
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
                            } else {
                                _this.contenttype = 'application/octet-stream';
                                _this.function = 'download';
                            } 
                        }
                        
                        Representation.prototype.updateTags = function () {
                                var _this = this;

                                // resource type
                                if (!_this.type) {
                                    _this.type = 'original data';
                                }
                                if (typeof _this.type !== 'object') {
                                    tagGroupService.getTagList('representation type').$promise.then(
                                            function (tags) {
                                                _this.type = tags.getTagByName(_this.type);
                                            });
                                }

                                // resource protocol
                                if (!_this.protocol) {
                                    _this.protocol = 'WWW:LINK-1.0-http--link';
                                }
                                if (typeof _this.type !== 'object') {
                                    tagGroupService.getTagList('protocol', 'WWW:LINK-1.0-http--link,OGC:WMS-1.1.1-http-get-capabilities,WWW:TILESERVER,OPeNDAP:OPeNDAP').$promise.then(
                                            function (tags) {
                                                _this.protocol = tags.getTagByName(_this.protocol);
                                            });
                                }

                                // resource function
                                if (!_this.function) {
                                    _this.function = 'download';
                                }
                                if (typeof _this.type !== 'object') {
                                    tagGroupService.getTagList('function').$promise.then(
                                            function (tags) {
                                                _this.function = tags.getTagByName(_this.function);
                                            });
                                }

                                // resource content type
                                if (!_this.contenttype) {
                                    _this.contenttype = 'application/octet-stream';
                                }
                                if (typeof _this.contenttype !== 'object') {
                                    tagGroupService.getTagList('content type').$promise.then(
                                            function (tags) {
                                                _this.contenttype = tags.getTagByName(_this.contenttype);
                                            });
                                }
                            };

                        Representation.prototype.constructor = Representation;
                        return Representation;

                    }]);

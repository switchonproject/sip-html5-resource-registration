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
                ['$resource',
                    function ($resource) {
                        'use strict';

                        function Representation() {
                            var _this, resourceTemplate;
                            _this = this;
                            resourceTemplate = $resource('data/representationTemplate.json', {}, {
                            query: {
                                method: 'GET',
                                params: {
                                },
                                isArray: false
                            }
                        }).query();
                        
                        resourceTemplate.$promise.then(function (json) {
                            for (var key in json) {
                                if (json.hasOwnProperty(key) && !_this.hasOwnProperty(key)) {
                                    _this[key] = json[key];
                                }
                            }
                        });
                            
                            
                            

                        }

                        Representation.prototype.constructor = Representation;
                        return Representation;
                    }]);



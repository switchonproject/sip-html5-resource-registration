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
        .factory('de.cismet.sip-html5-resource-registration.services.dataset',
                ['$resource',
                    '$location',
                    'de.cismet.sip-html5-resource-registration.services.RepresentationFactory',
                    function ($resource, $location, Representation) {
                        'use strict';
                        var datasetTemplate = $resource('data/datasetTemplate.json', {}, {
                            query: {
                                method: 'GET',
                                params: {
                                },
                                isArray: false
                            }
                        }).query();

                        datasetTemplate.$promise.then(function (dataset) {

                            var tmpRepresentations = [];
                            var representationJson = ($location.search()).representations;
                            if (representationJson) {
                                tmpRepresentations =  JSON.parse(decodeURIComponent(representationJson));
                                if (Array.isArray(tmpRepresentations)) {
                                    tmpRepresentations.forEach(function (representation) {
                                        dataset.representation.push(new Representation(representation));
                                    });
                                }
                            }

                            if (dataset.representation.length > 0 && dataset.representation[0].name !== null) {
                                dataset.name = dataset.representation[0].name;
                                if (dataset.representation[0].contentlocation &&
                                        dataset.representation[0].function.name &&
                                        dataset.representation[0].contenttype.name) {
                                    dataset.$uploaded = true;
                                }

                            } else {
                                dataset.representation[0] = new Representation();
                            }
                        });

                        return datasetTemplate;
                    }]);



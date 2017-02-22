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
                            dataset.$uploaded = undefined;
                            dataset.$geoserverUploaded = false;
                            dataset.$doiGenerated = false;

                            // check request parameters for representations, parse and add to
                            // the dataset's representation array
                            var tmpRepresentations = [];
                            var representationJson = ($location.search()).representations;
                            if (representationJson) {
                                tmpRepresentations = JSON.parse(representationJson);
                                if (Array.isArray(tmpRepresentations)) {
                                    tmpRepresentations.forEach(function (representation) {
                                        //invoke representation constructor
                                        dataset.representation.push(new Representation(representation));

                                        // WKT BBox from Data upload Tool (SHP -> Geoserver)
                                        if (representation.wktboundingbox && !dataset.spatialcoverage.geo_field) { // jshint ignore:line
                                            dataset.spatialcoverage.geo_field = representation.wktboundingbox; // jshint ignore:line
                                            dataset.$geoserverUploaded = true;
                                        }
                                    });
                                }
                            }

                            // choose the name of the first representation as name of the dataset
                            if (dataset.representation.length > 0 && dataset.representation[0].name !== null) {
                                if (dataset.representation.length > 1 && dataset.$geoserverUploaded === true) {
                                    // HOTFIX #26: pick the last representation (swap elements)
                                    // FIXME: name property is lost!
                                    var tmpElement = dataset.representation[0];
                                    dataset.representation[0] = dataset.representation[dataset.representation.length - 1];
                                    dataset.representation[dataset.representation.length - 1] = tmpElement;
                                }
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



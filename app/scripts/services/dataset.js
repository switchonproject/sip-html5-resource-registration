angular.module('de.cismet.sip-html5-resource-registration.services')
        .factory('de.cismet.sip-html5-resource-registration.services.dataset',
                ['$resource',
                    '$location',
                    function ($resource, $location) {
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
                            dataset.name = ($location.search()).name;
                            dataset.representation[0].contentlocation = ($location.search()).link;
                            if (dataset.name && dataset.representation[0].contentlocation) {
                                var linkFunction = ($location.search()).function;
                                var contenttype = $location.search().format;
                                dataset.$uploaded = true;
                                dataset.representation[0].function = {};
                                if (linkFunction && (linkFunction === 'download' || linkFunction === 'information')) {
                                    dataset.representation[0].function.name = linkFunction;
                                } else {
                                    dataset.representation[0].function.name = 'download';
                                }
                                dataset.representation[0].contenttype = {};

                                if (contenttype) {
                                    dataset.representation[0].contenttype.name = contenttype;
                                } else {
                                    dataset.representation[0].contenttype.name = 'application/octet-stream';
                                }
                            }
                        });

                        return datasetTemplate;
                    }]);



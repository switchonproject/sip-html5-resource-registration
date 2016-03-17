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
).factory('de.cismet.sip-html5-resource-registration.services.CountriesService',
    ['$resource',
        function ($resource) {
            'use strict';

            var countryResources, countryGroups, lazyLoadCountryLists,
                getCountryListFunction;

            countryResources = {
                'countries-world': 'data/countriesWorld.json',
                'countries-europe': 'data/countriesEurope.json'
            };

            // cached country group lists
            countryGroups = [];

            lazyLoadCountryLists = function (countryGroup, array) {
                var countryResource;
                // cached list does exist
                if (countryGroups.hasOwnProperty(countryGroup)) {
                    return countryGroups[countryGroup];
                }

                // list not cached but resource does exist
                if (countryResources.hasOwnProperty(countryGroup)) {
                    countryResource = $resource(countryResources[countryGroup], {}, {
                        query: {
                            method: 'GET',
                            params: {
                            },
                            isArray: array
                        }
                    });

                    countryGroups[countryGroup] = countryResource.query();
                    return countryGroups[countryGroup];
                }

                console.warn('unknown country group:' + countryGroup);
                //return array ? [] : {};
                return null;
            };


            getCountryListFunction =
                function (countryGroup) {
                    return lazyLoadCountryLists(countryGroup, true);
                };

            return {
                getCountryList: getCountryListFunction
            };
        }]
    );

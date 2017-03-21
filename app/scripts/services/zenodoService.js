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
        ).factory('de.cismet.sip-html5-resource-registration.services.zenodoService',
        ['$resource',
            'AppConfig',
            function ($resource, AppConfig) {
                'use strict';
                var config, depositionResource;
                config = AppConfig.zenodo;
                
                // FIXME: retrieve non-sanbox token from the server
                // Promise Synchronisation Problem: depositionResource requires config.token to be resolved!
                depositionResource = $resource(config.host + '/api/deposit/depositions/:depositionId',
                        {
                            depositionId: '@id'
                        }, {
                    delete: {
                        method: 'DELETE',
                        headers: {
                            'Authorization': 'Bearer ' + config.token
                        }
                    },
                    get: {
                        method: 'GET',
                        isArray: false,
                        headers: {
                            'Authorization': 'Bearer ' + config.token
                        }
                    },
                    save: {
                        method: 'PUT',
                        isArray: false,
                        headers: {
                            'Authorization': 'Bearer ' + config.token
                        }
                    },
                    publish: {
                        method: 'POST',
                        isArray: false,
                        url: config.host + '/api/deposit/depositions/:depositionId/actions/publish',
                        headers: {
                            'Authorization': 'Bearer ' + config.token
                        }
                    }
                });
                
                return depositionResource;
            }
        ]);

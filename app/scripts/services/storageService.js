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
        ).factory('de.cismet.sip-html5-resource-registration.services.storageService',
        [
            '$resource',
            'de.cismet.sip-html5-resource-registration.services.Base64',
            'AppConfig',
            function ($resource, Base64, AppConfig) {
                'use strict';
                var config, authdata, storeResource, storeFunction;

                config = AppConfig.searchService;
                authdata = Base64.encode(config.username + ':' + config.password);

                storeResource = $resource(config.host + '/SWITCHON.resource',
                        {
                            requestResultingInstance: true,
                            role: 'all'
                        }, {
                    store: {
                        method: 'POST',
                        isArray: false,
                        headers: {
                            'Authorization': 'Basic ' + authdata
                        }
                    }
                });

                storeFunction = function (dataset) {
                    var storeResult;

                    // remove uploaded flag (unavailable in cids bean);
                    delete dataset.$uploaded;
                    delete dataset.$geoserverUploaded;
                    delete  dataset.$doiGenerated;

                    // result of the remote store operation (promise)
                    // starting the store!
                    storeResult = storeResource.store(dataset);

                    return storeResult;
                };

                return {
                    store: storeFunction
                };
            }
        ]);
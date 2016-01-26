angular.module('de.cismet.sip-html5-resource-registration.services')
        .factory('de.cismet.sip-html5-resource-registration.services.dataset', 
        ['$resource',
    function ($resource) {
            'use strict';
            var datasetTemplate = $resource('data/datasetTemplate.json', {}, {
                    query: {
                        method: 'GET',
                        params: {
                        },
                        isArray: false
                    }
                }).query();
            return datasetTemplate;
            
	    
	}]);



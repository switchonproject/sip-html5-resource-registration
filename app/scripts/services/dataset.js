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
            
            datasetTemplate.$promise.then(function(dataset) {
                  dataset.name=($location.search()).name;
                  dataset.representation[0].contentlocation=($location.search()).link;
                  if(dataset.name && dataset.representation[0].contentlocation) {
                      dataset.$uploaded=true;
                  }
                });   
                
            return datasetTemplate;
	}]);



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
                      dataset.representation[0].function = {};
                      dataset.representation[0].function.name = 'download';
                      dataset.representation[0].contenttype = {};
                      
                      if($location.search().format) {
                        dataset.representation[0].contenttype.name = $location.search().format;
                      } else {
                          dataset.representation[0].contenttype.name = 'application/octet-stream';
                      }
                  }
                });   
                
            return datasetTemplate;
	}]);



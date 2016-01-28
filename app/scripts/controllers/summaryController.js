angular.module(
    'de.cismet.sip-html5-resource-registration.controllers'
).controller(
    'de.cismet.sip-html5-resource-registration.controllers.summaryController',
    [
        '$scope',
        'de.cismet.sip-html5-resource-registration.services.dataset',
        'leafletData',
        // Controller Constructor Function
        function (
            $scope,
            dataset,
            leafletData
        ) {
            'use strict';
            var _this, fireResize;
            
            _this = this;
            _this.dataset = dataset;
            
            
            fireResize = function () {
                leafletData.getMap('summarymap').then(function (map) {
                    setTimeout(function(){ map.invalidateSize();}, 50);
                });
            };

            // validation functions
            $scope.wizard.enterValidators['Summary'] = function(){
                
                if(!$scope.wizard.hasError) {
                    $scope.message.text='Please review the meta-data of the dataset and press <strong>Finish</strong> to register the dataset in the SWITCH-ON Spatial Information Platform.';
                    $scope.message.icon='fa-info-circle';
                    $scope.message.type = 'success';
                }
                fireResize();
                leafletData.getMap('summarymap').then(function (map) {
                    map.addLayer($scope.mapData.layerGroup);
                    setTimeout(function(){ 
                        map.invalidateSize();
                        map.fitBounds($scope.mapData.layerGroup, {
                                animate: true,
                                pan: {animate: true, duration: 0.6},
                                zoom: {animate: true}
                        });
                    }, 50); 
                   });
              
                fireResize();
                
                return true;
            };

            $scope.wizard.exitValidators['Summary'] = function(){

                $scope.wizard.hasError = null;
                return true;
                
            };
        }
    ]
);
angular.module(
    'de.cismet.sip-html5-resource-registration.controllers'
).controller(
    'de.cismet.sip-html5-resource-registration.controllers.geoLocationController',
    [
        '$scope',
        'AppConfig',
        'WizardHandler',
        'leafletData',
        'de.cismet.sip-html5-resource-registration.services.dataset',
        'de.cismet.sip-html5-resource-registration.services.TagGroupService',
        // Controller Constructor Function
        function (
            $scope,
            AppConfig,
            WizardHandler,
            leafletData,
            dataset,
            tagGroupService
        ) {
            'use strict';

            var _this, config, fireResize, southWest, northEast, maxBounds;
            _this = this;
            
            
            _this.config = AppConfig;
            
            /**
             * overall Form data
             */
            //_this.dataset = dataset;
            
            
            /**
             * Map init data
             */
            _this.mapData = {};
            _this.mapData.center = _this.config.mapView.home;
            _this.mapData.defaults = {
                    tileLayer: _this.config.mapView.backgroundLayer,
                    //tileLayerOptions: {noWrap: true},
                    //maxZoom: 14,
                    minZoom: _this.config.minZoom,
                    path: {
                        weight: 10,
                        color: '#800000',
                        opacity: 1
                    }
                };
            
            
            /**
             * Selection modes
             */
            _this.mode = {};
            _this.mode.drawBBox = true;
            _this.mode.selectEC = false;
            _this.mode.selectEC = false;
            _this.mode.defineBBox = false;
            
            _this.switchMode = function (selectedMode) {
                // simulate option group
                Object.keys(_this.mode).forEach(function(key) {
                     if(selectedMode === key) {
                         if(_this.mode[key] === false) {
                             _this.mode[key] = true;
                         }
                     } else {
                         _this.mode[key] = false;
                     }
                  }, _this.mode);
            };
            
            $scope.wizard.enterValidators[$scope.wzTitle] = function(){
                fireResize();
                
                return true;
            };
            
            
            $scope.wizard.exitValidators[$scope.wzTitle] = function(){
                return true;
            };
            
            fireResize = function () {
                leafletData.getMap('mainmap').then(function (map) {
                    setTimeout(function(){ map.invalidateSize();}, 5);
                });
            };
            
            southWest = (_this.config.maxBounds && angular.isArray(_this.config.maxBounds.southWest)) ?
                            L.latLng(config.maxBounds.southWest[0], _this.config.maxBounds.southWest[1]) :
                            L.latLng(90, -180);
            northEast = (_this.config.maxBounds && angular.isArray(_this.config.maxBounds.northEast)) ?
                            L.latLng(_this.config.maxBounds.northEast[0], _this.config.maxBounds.northEast[1]) :
                            L.latLng(-90, 180);
            maxBounds = L.latLngBounds(southWest, northEast);
            leafletData.getMap('mainmap').then(function (map) {
                map.setMaxBounds($scope.maxBounds);
            });

           
            
            
            
            
            
           
                // To better decouple your Controller from your View, you can define a
                // watch function instead of providing a string-based watch expression.
                // --
                // NOTE: Behind the scenes, this is what the $parse() service is doing
                // anyway; so, don't think of this as more work. In reality, it's actually
                // less work for AngularJS since it doesn't have to parse the expression
                // into a function.
//                $scope.$watch(
//                    function watchFoo( scope ) {
//                        // Return the "result" of the watch expression.
//                        return( vm.fooCount );
//                    },
//                    function handleFooChange( newValue, oldValue ) {
//                        console.log( "fn( vm.fooCount ):", newValue );
//                    }
//                );
        }
    ]
);
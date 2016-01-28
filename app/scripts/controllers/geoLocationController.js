angular.module(
    'de.cismet.sip-html5-resource-registration.controllers'
).controller(
    'de.cismet.sip-html5-resource-registration.controllers.geoLocationController',
    [
        '$scope',
        'AppConfig',
        'leafletData',
        'de.cismet.sip-html5-resource-registration.services.dataset',
        'de.cismet.sip-html5-resource-registration.services.CountriesService',
        // Controller Constructor Function
        function (
            $scope,
            AppConfig,
            leafletData,
            dataset,
            countriesService
        ) {
            'use strict';

            var _this, config, fireResize, southWest, northEast, maxBounds,
                    drawControls, layerGroup, wicket, defaultStyle, defaultDrawOptions,
                    noDrawOptions, writeSpatialCoverage,
                    readSpatialCoverage, drawControlsEnabled;
            _this = this;

            _this.config = AppConfig;
            
            /**
             * overall Form data
             */
            _this.dataset = dataset;
          
            _this.contentLocation = {};
            _this.contentLocation.name = '';
            //_this.contentLocation.type = null;
            //_this.contentLocation.wkt = null;
            //_this.contentLocation.layer = null;
            _this.contentLocation.bounds = {};
            
            _this.countries = [];
            _this.countries['countries-world'] = countriesService.getCountryList('countries-world'); 
            _this.countries['countries-europe'] = countriesService.getCountryList('countries-europe');
            
            //$timeout(function(){
            //    _this.countries['countries-world'] = countriesService.getCountryList('countries-world'); 
            //    _this.countries['countries-europe'] = countriesService.getCountryList('countries-europe'); 
            //},3000);
            
           _this.onSelectedCountry = function(item) {
                wicket.read(item.wkt);
                var layer = wicket.toObject(defaultStyle);
               // _this.contentLocation.layer = layer;
               
                layerGroup.clearLayers();
                layerGroup.addLayer(layer);
                
                leafletData.getMap('mainmap').then(function (map) {
                        map.fitBounds(layerGroup.getBounds(), {
                            animate: true,
                            pan: {animate: true, duration: 0.6},
                            zoom: {animate: true}
                        });
                   });
                   
                   //_this.contentLocation.type = item.type;
                   //_this.contentLocation.wkt = item.wkt;
                   //_this.contentLocation.layer = layer;
           };
            
            wicket = new Wkt.Wkt();
            defaultStyle = {color: '#0000FF', fillOpacity: 0.3, weight: 2, fill: true, fillColor: '#1589FF', riseOnHover: true, clickable: true};
            
            defaultDrawOptions = {
                    polyline: false,
                    polygon: {
                        shapeOptions: defaultStyle,
                        showArea: true,
                        metric: true,
                        allowIntersection: false,
                        drawError: {
                            color: '#e1e100', // Color the shape will turn when intersects
                            message: '<strong>Oh snap!<strong> you can\'t draw that!</strong>' // Message that will show when intersect
                        }       
                    },
                    rectangle: {
                        shapeOptions: defaultStyle,
                        metric: true
                    },
                    // no circles for starters as not compatible with WKT
                    circle: false,
                    marker: false
                };
                
            noDrawOptions = { 
                polyline: false,
                polygon: false,
                rectangle: false,
                circle: false,
                marker: false
            };
                
            
            
            /**
             * Map init data
             */
            $scope.mapData.center = _this.config.mapView.home;
            $scope.mapData.defaults = {
                    tileLayer: _this.config.mapView.backgroundLayer,
                    //tileLayerOptions: {noWrap: true},
                    //maxZoom: 14,
                    minZoom: _this.config.minZoom,
                    path: defaultStyle
                };
            $scope.mapData.defaultDrawOptions = defaultDrawOptions;
            
            
            /**
             * Selection modes
             */
            _this.mode = {};
            _this.mode.drawBBox = true;
            _this.mode.selectEC = false;
            _this.mode.selectWC = false;
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
                  
                // reset error messages
                $scope.message.icon='fa-info-circle';
                $scope.message.type = 'success';
                  
                // perform initialisation of widgets
                if(_this.mode.drawBBox === true && !drawControlsEnabled) {
                    $scope.message.text='Please use the map controls to draw a bounding box or a polygon that represents the spatial extent of the dataset.';
                    
                    drawControls.setDrawingOptions(defaultDrawOptions);
                    leafletData.getMap('mainmap').then(function (map) {
                        map.addControl(drawControls);
                     });
                     drawControlsEnabled = true;
                } else if(drawControlsEnabled) {
                    drawControls.setDrawingOptions(noDrawOptions);
                    leafletData.getMap('mainmap').then(function (map) {
                        map.removeControl(drawControls);
                     });
                     drawControlsEnabled = false;
                }
                
                if(_this.mode.selectEC === true) {
                    $scope.message.text='Select a European country or region that represents the spatial extent of the dataset.';
                }
                
                if(this.mode.selectWC === true) {
                    $scope.message.text='Select a World country or region that represents the spatial extent of the dataset.';
                }
                
                if(_this.mode.defineBBox === true) {
                    $scope.message.text='Please enter a bounding box with westbound and eastbound longitudes, and southbound and northbound latitudes in decimal degrees, with a precision of at least two decimals.'
                    
                    if(layerGroup.getLayers().length >  0) {
                        var bounds = layerGroup.getBounds();
                        _this.contentLocation.bounds = {};
                        _this.contentLocation.bounds.west = bounds.getWest();
                        _this.contentLocation.bounds.south = bounds.getSouth();
                        _this.contentLocation.bounds.east = bounds.getEast();
                        _this.contentLocation.bounds.north = bounds.getNorth();
                    }
                }
            };
            
            _this.applyBoundingBox = function() {
                var bounds = [[_this.contentLocation.bounds.south, 
                        _this.contentLocation.bounds.west], 
                    [_this.contentLocation.bounds.north, 
                        _this.contentLocation.bounds.east]];


                var layer = L.rectangle(bounds, defaultStyle);

                layerGroup.clearLayers();
                layerGroup.addLayer(layer);
                
                leafletData.getMap('mainmap').then(function (map) {
                        map.fitBounds(layer, {
                            animate: true,
                            pan: {animate: true, duration: 0.6},
                            zoom: {animate: true}
                        });
                   });
                   
                   _this.contentLocation.name = 'New user-defined Bounding Box';
                   //_this.contentLocation.type = 'rectangle';
                   //_this.contentLocation.wkt = null;
                   //_this.contentLocation.layer = layer;
            };
            
            // resize the map on enter
            $scope.wizard.enterValidators['Geographic Location'] = function(){
                if(!$scope.wizard.hasError) {
                    if(_this.mode.drawBBox === true) {
                        $scope.message.text='Please specify the extent of the dataset in the geographic space. <br>Use use the map controls to draw a bounding box or a polygon that represents the spatial extent of the dataset.';
                    } else {
                        $scope.message.text='Please specify the extent of the dataset in the geographic space.';
                    }
                    
                    $scope.message.icon='fa-info-circle';
                    $scope.message.type = 'success';
                }
                fireResize();
                var layer = readSpatialCoverage(_this.dataset);
                if(layer !== undefined && layer !== null) {
                    layerGroup.clearLayers();
                    layerGroup.addLayer(layer);
                     leafletData.getMap('mainmap').then(function (map) {
                        setTimeout(function(){map.fitBounds(layer, {
                                animate: true,
                                pan: {animate: true, duration: 0.75},
                                zoom: {animate: true}
                            });}, 100);
                   });
                }
                
                return true;
            };
            
            
            $scope.wizard.exitValidators['Geographic Location'] = function(){
                
                if(_this.mode.defineBBox === true && $scope.coordinatesForm.$invalid) {
                    $scope.message.text='Please specify a valid bounding box or use an other option to  specify the geographic location of the dataset!';
                    $scope.message.icon='fa-warning';
                    $scope.message.type = 'warning';
                    
                    return false;
                }
                                
                if(!layerGroup || layerGroup.getLayers().length === 0) {
                    
                    $scope.message.text='Please specify the geographic location of the dataset!';
                    $scope.message.icon='fa-warning';
                    $scope.message.type = 'warning';
                    
                    return false;
                } 
   
                $scope.wizard.hasError = null;
                $scope.mapData.layerGroup = layerGroup;
                return true;
            };
            
            // local methods and variables
            
            readSpatialCoverage = function(dataset) {
                if(dataset.spatialcoverage && dataset.spatialcoverage.geo_field) { // jshint ignore:line
                    var wktString = dataset.spatialcoverage.geo_field; // jshint ignore:line
                    wicket.read(wktString.substr(wktString.indexOf(';') + 1));

                    var layer = wicket.toObject(defaultStyle);
                    layer.setStyle(defaultStyle);
                    return layer;
                }

                return undefined;
            };
            
            writeSpatialCoverage = function(dataset, wktString) {
                if(wktString && dataset.spatialcoverage) { // jshint ignore:line
                    var wktStringWithSRS = 'SRID=4326;'+wktString;
                    dataset.spatialcoverage.geo_field = wktStringWithSRS; // jshint ignore:line
                    wicket.read(wktString.substr(wktString.indexOf(';') + 1));
                }
            };

            fireResize = function () {
                leafletData.getMap('mainmap').then(function (map) {
                    setTimeout(function(){ map.invalidateSize();}, 50);
                });
            };
            
            
            // leafltet initiaisation
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
            
            //draw control initialisation
            layerGroup = new L.FeatureGroup();
            drawControls = new L.Control.Draw({
                draw: defaultDrawOptions,
                edit: {
                    featureGroup: layerGroup
                }
            });
            drawControlsEnabled = true;
            
            leafletData.getMap('mainmap').then(function (map) {
                map.addLayer(layerGroup);
                map.addControl(drawControls);
                map.on('draw:created', function (event) {
                    //console.log(event.layerType + ' created'); 
                    layerGroup.clearLayers();
                    layerGroup.addLayer(event.layer);
                    
                    //wicket.fromObject(event.layer);
                    _this.contentLocation = {};
                    _this.contentLocation.name = 'New ' + event.layerType;
                    //_this.contentLocation.type = event.layerType;
                    //_this.contentLocation.layer = event.layer;
                    //_this.contentLocation.wkt = wicket.write();
                    
                });
                
                map.on('draw:edited', function (event) {
                    //console.log(event.layers.getLayers().length + ' edited'); 
                    //layerGroup.addLayer(event.layers.getLayers()[0]);
                    
                    //wicket.fromObject(event.layers.getLayers()[0]);
                    _this.contentLocation = Object.create(_this.contentLocation);
                    if(_this.contentLocation.name.indexOf('(edited)') === -1) {
                        _this.contentLocation.name += ' (edited)';
                    }
                    //_this.contentLocation.layer = event.layers.getLayers()[0];
                    //_this.contentLocation.wkt = wicket.write();
                });

                map.on('draw:deleted', function (event) {
                    console.log(event.layers.getLayers().length + ' deleted'); 
                    layerGroup.clearLayers();
                    _this.contentLocation = null;
                });
            });
            
            
            // scope watches
            
            
           
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
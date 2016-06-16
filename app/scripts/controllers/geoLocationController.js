/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

/* global L */
/*jshint sub:true*/

angular.module(
    'de.cismet.sip-html5-resource-registration.controllers'
).controller(
    'de.cismet.sip-html5-resource-registration.controllers.geoLocationController',
    [
        '$scope',
        'AppConfig',
        'leafletData',
        'de.cismet.sip-html5-resource-registration.services.geoTools',
        'de.cismet.sip-html5-resource-registration.services.dataset',
        'de.cismet.sip-html5-resource-registration.services.CountriesService',
        // Controller Constructor Function
        function (
            $scope,
            AppConfig,
            leafletData,
            geoTools,
            dataset,
            countriesService
        ) {
            'use strict';

            var _this, config, fireResize, southWest, northEast, maxBounds,
                    drawControls, layerGroup, wicket, defaultStyle, defaultDrawOptions,
                    noDrawOptions, writeSpatialCoverage,
                    readSpatialCoverage, drawControlsEnabled;
            
            wicket = geoTools.wicket;
            defaultStyle = geoTools.defaultStyle;
            defaultDrawOptions = geoTools.defaultDrawOptions;
            noDrawOptions = geoTools.noDrawOptions;
            readSpatialCoverage = geoTools.readSpatialCoverage;
            writeSpatialCoverage = geoTools.writeSpatialCoverage;
            fireResize = geoTools.fireResize;
            
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
                
            
            // resize the map on enter, read spatial coverage from dataset
            $scope.wizard.enterValidators['Geographic Location'] = function(context){
                if(context.valid === true)
                {
                    if(_this.mode.drawBBox === true) {
                        $scope.message.text='Please specify the extent of the dataset in the map <br>Use the map controls to draw a bounding box or a polygon that represents the spatial extent of the dataset.';
                    } else {
                        $scope.message.text='Please specify the extent of the dataset in the map.';
                    }

                    $scope.message.icon='fa-info-circle';
                    $scope.message.type = 'success';
                    
                    fireResize('mainmap');
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
                }
                
                return context.valid;
            };            
            
            // on exit: write spatial coverage to dataset
            $scope.wizard.exitValidators['Geographic Location'] = function(context){
                context.valid = true;
                if(_this.mode.defineBBox === true && $scope.coordinatesForm.$invalid) {
                    $scope.message.text='Please specify a valid bounding box or use an other option to  specify the geographic location of the dataset!';
                    $scope.message.icon='fa-warning';
                    $scope.message.type = 'warning';
                    
                    context.valid = false;
                } else if(!layerGroup || !layerGroup.getLayers() || layerGroup.getLayers().length === 0) {
                    
                    $scope.message.text='Please specify the geographic location of the dataset!';
                    $scope.message.icon='fa-warning';
                    $scope.message.type = 'warning';
                    
                    context.valid = false;
                }
                
                if(context.valid === true) {
                    $scope.wizard.hasError = null;
                    var wkt = wicket.fromObject(layerGroup.getLayers()[0]);
                    wkt.write();
                    writeSpatialCoverage(_this.dataset, wkt);
                }
                
                return context.valid;
            };
            
            
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
                } else if(_this.mode.drawBBox !== true && drawControlsEnabled) {
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
                    $scope.message.text='Please enter a bounding box with westbound and eastbound longitudes, and southbound and northbound latitudes in decimal degrees, with a precision of at least two decimals.';
                    
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
                
                if(_this.contentLocation.bounds.south !== undefined && 
                        _this.contentLocation.bounds.west !== undefined && 
                        _this.contentLocation.bounds.north !== undefined && 
                        _this.contentLocation.bounds.east !== undefined ) {
                
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
               }
            };
       
            // leaflet initialisation
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
                
                map.on('draw:edited', function () {
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
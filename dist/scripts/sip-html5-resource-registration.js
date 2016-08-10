// main app module registration
var app = angular.module(
    'de.cismet.sip-html5-resource-registration',
    [
        'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'leaflet-directive',
        'mgo-angular-wizard','ui.select', 'uuid',
        'de.cismet.sip-html5-resource-registration.controllers',
        'de.cismet.sip-html5-resource-registration.directives',
        'de.cismet.sip-html5-resource-registration.services',
        'de.cismet.sip-html5-resource-registration.factories',
        'de.cismet.sip-html5-resource-registration.filters' 
    ]
);


app.config(function($logProvider){
  'use strict';
  $logProvider.debugEnabled(false);
});
angular.module(
    'de.cismet.sip-html5-resource-registration.controllers',
    [
         
    ]
);
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
/* global Wkt */
/*jshint sub:true*/

angular.module(
    'de.cismet.sip-html5-resource-registration.controllers'
).controller(
    'de.cismet.sip-html5-resource-registration.controllers.geoLocationController',
    [
        '$scope',
        '$resource',
        'AppConfig',
        'leafletData',
        'de.cismet.sip-html5-resource-registration.services.geoTools',
        'de.cismet.sip-html5-resource-registration.services.dataset',
        'de.cismet.sip-html5-resource-registration.services.CountriesService',
        'de.cismet.sip-html5-resource-registration.services.featureRendererService',
        // Controller Constructor Function
        function (
            $scope,
            $resource,
            AppConfig,
            leafletData,
            geoTools,
            dataset,
            countriesService,
            featureRendererService
        ) {
            'use strict';

            var _this, fireResize, southWest, northEast, maxBounds,
                    drawControls, layerGroup, defaultStyle, countriesStyle, 
                    defaultDrawOptions, noDrawOptions, writeSpatialCoverage,
                    readSpatialCoverage, drawControlsEnabled,
                    countriesResource, countriesLayer, geoserverLayer;
            
            defaultStyle = dataset.$geoserverUploaded ? geoTools.readOnlyStyle : geoTools.defaultStyle;
            countriesStyle = geoTools.countriesStyle;
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
            _this.readOnly = dataset.$geoserverUploaded;
          
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
                var wicket = new Wkt.Wkt();
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

                    if(_this.readOnly && geoserverLayer === undefined) {
                         geoserverLayer = featureRendererService.getFeatureRenderer(_this.dataset);
                            if (geoserverLayer) {
                                geoserverLayer.setOpacity(1.0);
                                leafletData.getMap('mainmap').then(function (map) {
                                    map.addLayer(geoserverLayer);
                                });
                            }
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
                    var wkt;
                    
                    if(layerGroup.getLayers().length > 1) {
                        layerGroup.getLayers().forEach(function (layer) {
                            if(!wkt) {
                                wkt = new Wkt.Wkt().fromObject(layer);
                            } else {
                                var additionalWkt = new Wkt.Wkt().fromObject(layer);
                                if(additionalWkt.type === 'multipolygon' && wkt.type === 'polygon') {
                                    additionalWkt.merge(wkt);
                                    wkt = additionalWkt;
                                } else {
                                    wkt.merge(additionalWkt);
                                } 
                            }
                        });
                    } else {
                         wkt = new Wkt.Wkt().fromObject(layerGroup.getLayers()[0]);
                    }
                    writeSpatialCoverage(_this.dataset, wkt.write());
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
            _this.mode.selectCountry = false;
            
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
                
                if(_this.mode.selectCountry === true) {
                    leafletData.getMap('mainmap').then(function (map) {
                        map.addLayer(countriesLayer);
                    });
                    $scope.message.text='Select one or more countries that represents the spatial extent of the dataset.';
                } else {
                    leafletData.getMap('mainmap').then(function (map) {
                        map.removeLayer(countriesLayer);
                    });
                }

                // deprecated -------------------------------------------------- 
                if(_this.mode.selectEC === true) {
                    $scope.message.text='Select a European country or region that represents the spatial extent of the dataset.';
                }
                
                if(this.mode.selectWC === true) {
                    $scope.message.text='Select a World country or region that represents the spatial extent of the dataset.';
                }
                 // deprecated -------------------------------------------------- 
                 
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
            southWest = (_this.config.mapView.maxBounds && angular.isArray(_this.config.mapView.maxBounds.southWest)) ?
                            L.latLng(_this.config.mapView.maxBounds.southWest[0], _this.config.mapView.maxBounds.southWest[1]) :
                            L.latLng(90, -180);
            northEast = (_this.config.mapView.maxBounds && angular.isArray(_this.config.mapView.maxBounds.northEast)) ?
                            L.latLng(_this.config.mapView.maxBounds.northEast[0], _this.config.mapView.maxBounds.northEast[1]) :
                            L.latLng(-90, 180);
            maxBounds = L.latLngBounds(southWest, northEast);
            leafletData.getMap('mainmap').then(function (map) {
                map.setMaxBounds($scope.maxBounds);
            });
            
            
            // countries layer initialisation ----------------------------------
            countriesResource = $resource(_this.config.mapView.countriesLayer);
            countriesResource.get(function(data) {
                var onEachFeature = function (feature, featureLayer) {
                    featureLayer.bindPopup(feature.properties.name);
                    
                    featureLayer.on('click', function (e) {
                        var addFeature = true;
                        layerGroup.getLayers().forEach(function (layer) {
                            if(!layer.properties) {
                                layerGroup.removeLayer(layer);
                            } else if(e.target.feature.properties.name === layer.properties.name) {
                                 addFeature = false;
                                 layerGroup.removeLayer(layer);
                            }
                        });
                        
                        if(addFeature) {
                            var wicket = new Wkt.Wkt();
                            var wkt = wicket.read(JSON.stringify(e.target.feature));
                            var polygon = wicket.toObject(wkt);
                            polygon.on('click', function (e) {
                                layerGroup.removeLayer(e.target);
                            });
                            layerGroup.addLayer(polygon);
                        }
                    });
                };
                
                countriesLayer = new L.GeoJSON(data, {style:countriesStyle, onEachFeature:onEachFeature});
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
                if(!_this.readOnly)
                {

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
                }
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
/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

/*jshint sub:true*/

angular.module(
        'de.cismet.sip-html5-resource-registration.controllers'
        ).controller(
        'de.cismet.sip-html5-resource-registration.controllers.keywordsController',
        [
            '$scope',
            'de.cismet.sip-html5-resource-registration.services.dataset',
            // Controller Constructor Function
            function (
                    $scope,
                    dataset
                    ) {
                'use strict';
                var _this;

                _this = this;
                _this.dataset = dataset;
                //$scope.dataset = dataset;

                _this.toggleSelection = function (tag) {
                    var idx = _this.dataset.tags.indexOf(tag);

                    if (idx > -1) {
                        $scope.dataset.tags.splice(idx, 1);
                    }

                    else {
                        $scope.dataset.tags.push(tag);
                    }
                };
            }
        ]
        );
/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

/*jshint sub:true*/

angular.module(
    'de.cismet.sip-html5-resource-registration.controllers'
).controller(
    'de.cismet.sip-html5-resource-registration.controllers.licenseController',
    [
        '$scope',
        'de.cismet.sip-html5-resource-registration.services.dataset',
        'de.cismet.sip-html5-resource-registration.services.TagGroupService',
        // Controller Constructor Function
        function (
            $scope,
            dataset,
            tagGroupService
        ) {
            'use strict';
            var _this = this;
            _this.dataset = dataset;
            
            // load taglist
            $scope.tags['accessconditions'] = tagGroupService.getTagList('access conditions', 'Creative Commons (CC BY),Creative Commons (CC BY-NC),Creative Commons (CC BY-NC-ND),Creative Commons (CC BY-NC-SA),Creative Commons (CC BY-ND),Creative Commons (CC BY-SA),for research only,no limitations,other');
                    
            // validation functions
            $scope.wizard.enterValidators['License and Conditions'] = function(context){
                if(context.valid === true){
                    $scope.message.text='Please select a predefined license for regulating the conditions for access and use of the resource and provide a brief statement or URL to the license which applies to the usage of the dataset. This statement should provide additional information.';
                    $scope.message.icon='fa-info-circle';
                    $scope.message.type = 'success';
                }
                
                return context.valid;
            };

            $scope.wizard.exitValidators['License and Conditions'] = function(context){
                context.valid = true;
                // ACCESS CONDITIONS
                var isInvalidAccessconditions = $scope.tags['accessconditions'].every(function(element) {
                    if (_this.dataset.accessconditions && _this.dataset.accessconditions.name && 
                            (element.name === _this.dataset.accessconditions.name)) {
                        _this.dataset.accessconditions = element;
                        return false;
                    } else {
                        return true;
                    } 
                });
                
                if(isInvalidAccessconditions) {
                    $scope.message.text='Please select a valid access condition (e.g. no limitations).';
                    $scope.message.icon='fa-warning';
                    $scope.message.type = 'warning';
                    
                    $scope.wizard.hasError = 'datasetAccessconditions';
                    context.valid = false;
                } else if($scope.licenseForm.datasetLicensestatement.$error.required) {
                    // NAME
                    $scope.message.text='Please provide a description of the license of type <i>other</i> or select another license from the list.';
                    $scope.message.icon='fa-warning';
                    $scope.message.type='warning';
                    
                    $scope.wizard.hasError = 'datasetLicensestatement';
                    context.valid =  false;
                } else if ($scope.licenseForm.datasetContactemail.$error.email) {
                    // CONTENT LOCATION       
                    $scope.message.text = 'The email address to the contact person is not a valid.';
                    $scope.message.icon = 'fa-warning';
                    $scope.message.type = 'warning';

                    $scope.wizard.hasError = 'datasetContactperson';
                    context.valid = false;
                } else if ($scope.licenseForm.datasetOrganisationurl.$error.url) {
                    // CONTENT LOCATION       
                    $scope.message.text = 'The website url of the orgaisation is not a valid <a href=\'https://en.wikipedia.org/wiki/Uniform_Resource_Locator#Syntax\' target=\'_blank\' title=\'Uniform Resource Locator\'>URL</a>.';
                    $scope.message.icon = 'fa-warning';
                    $scope.message.type = 'warning';

                    $scope.wizard.hasError = 'datasetOrganisation';
                    context.valid = false;
                }
                
                if(context.valid === true) {
                    $scope.wizard.hasError = null;
                }

                return context.valid;
                
            };
        }
    ]
);
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
        'de.cismet.sip-html5-resource-registration.controllers'
        ).controller(
        'de.cismet.sip-html5-resource-registration.controllers.masterController',
        [
            '$scope',
            'AppConfig',
            'WizardHandler',
            'de.cismet.sip-html5-resource-registration.services.dataset',
            'de.cismet.sip-html5-resource-registration.services.TagGroupService',
            '$modal',
            function (
                    $scope,
                    AppConfig,
                    WizardHandler,
                    dataset,
                    tagGroupService,
                    $modal
                    ) {
                'use strict';

                var _this;
                
                _this = this;
                _this.config = AppConfig;
                _this.dataset = dataset;            

                // - dataset: the resource meta data, initialized from a template and changed by the app
                // - tags: list of selectable tags
                // - wizard: the wizard status

                // init Scope Soup -------------------------------------------------

                /**
                 * The resource meta data, initilaized from a template and changed by the app
                 */
                $scope.dataset = dataset;
                
                $scope.config = AppConfig;

                /**
                 * list of selectable tags. Initilaized by the controllers
                 */
                $scope.tags = [];

                /**
                 * Message text
                 */
                $scope.message = {};
                $scope.message.text = '<strong>Welcome to the SWITCH-ON tool for the registration of (hydrological) open-data in the <a href=\'http://www.water-switch-on.eu/sip-webclient/sip-beta/\' title=\'Find open data with the SIP BYOD Client\' target=\'_blank\'>SWITCH-ON Spatial Information Platform</a>!</strong> <br>Please provide some general information about the new dataset such as name, description, a (download) link and keywords. ';
                $scope.message.icon = 'fa-info-circle';
                $scope.message.type = 'success';

                $scope.showInfoMessage = function (messageText, messageType, messageIcon) {
                    $scope.message.text = messageText;
                    $scope.message.type = messageType ? messageType : 'success';
                    $scope.message.icon = messageIcon ? messageIcon : 'fa-info-circle';
                };

                /**
                 * Wizard status, etc.
                 */
                $scope.wizard = {};
                $scope.wizard.uploadchoice = false;
                $scope.wizard.enterValidators = [];
                $scope.wizard.exitValidators = [];
                $scope.wizard.currentStep = '';
                $scope.wizard.canProceed = true;
                $scope.wizard.canGoBack = false;
                $scope.wizard.hasError = false;
                $scope.wizard.proceedButtonText = 'Next';
                $scope.wizard.isFinishStep = function () {
                    return $scope.wizard.currentStep === 'Summary';
                };
                $scope.wizard.isFirstStep = function () {
                    return $scope.wizard.currentStep === 'Dataset Description';
                };

                $scope.mapData = {};

                $scope.$watch('wizard.currentStep', function (n) {
                    if (n) {
                        if ($scope.wizard.isFinishStep()) {
                            $scope.wizard.proceedButtonText = 'Finish';
                        } else {
                            $scope.wizard.proceedButtonText = 'Next';
                        }

                        $scope.wizard.canGoBack = !$scope.wizard.isFirstStep();

                    } else {
                        $scope.wizard.proceedButtonText = 'Next';
                    }
                });


                _this.finishedWizard = function () {
                    $modal.open({
                        animation: true,
                        templateUrl: 'templates/confirmation.html',
                        controller: 'de.cismet.sip-html5-resource-registration.controllers.storageController',
                        controllerAs: 'storageController',
                        keyboard: 'false',
                        size: 'lg',
                        backdrop: 'static'
                    });
                };
            }
        ]
        );
/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

/*jshint sub:true*/

angular.module(
        'de.cismet.sip-html5-resource-registration.controllers'
        ).controller(
        'de.cismet.sip-html5-resource-registration.controllers.odRegistrationController',
        [
            '$scope',
            '$modal',
            '$location',
            'AppConfig',
            'de.cismet.sip-html5-resource-registration.services.dataset',
            'de.cismet.sip-html5-resource-registration.services.TagGroupService',
            'de.cismet.sip-html5-resource-registration.services.searchService',
            // Controller Constructor Function
            function (
                    $scope,
                    $modal,
                    $location,
                    AppConfig,
                    dataset,
                    tagGroupService,
                    searchService
                    ) {
                'use strict';

                var _this, duplicateLink;
                duplicateLink = undefined;

                _this = this;
                _this.dataset = dataset;
                _this.config = AppConfig;

                _this.groupBy = function (item) {

                    if (item.name.indexOf(',') > -1) {
                        return item.name.split(',', 1)[0];
                    } else {
                        return item.name.split(' ', 1)[0];
                    }

                };

                _this.checkLink = function (url) {
                    //console.log(url);
                    if (url) {
                        var searchResultPromise, searchSuccess, searchError;
                        searchSuccess = function (searchResult) {
                            if (searchResult && searchResult.$collection && searchResult.$collection.length > 0) {
                                duplicateLink = 'This dataset is already registered in the SWITCH-ON Spatial Information Platform under the name </strong>"' +
                                        searchResult.$collection[0].name + '"</strong>. Click <a href="'+AppConfig.byod.baseUrl+'/#/resource/' +
                                        searchResult.$collection[0].id + '" title="' +
                                        searchResult.$collection[0].name + '" target="_blank">here</a> to view the dataset meta-data.';

                                $scope.message.text = duplicateLink;
                                $scope.message.icon = 'fa-warning';
                                $scope.message.type = 'info';
                                $scope.wizard.hasError = 'datasetContentlocation';
                            } else {
                                // reset the warning!
                                if($scope.wizard.hasError === 'datasetContentlocation') {
                                    $scope.wizard.hasError = null;
                                }
                                
                                //console.log('resource ' + url + ' not in Meta-Data Repository');
                                duplicateLink = undefined;
                            }
                        };

                        searchError = function (data) {
                            console.error('search error: ' + data);
                            duplicateLink = undefined;
                        };

                        searchResultPromise = searchService.search(url).$promise.then(searchSuccess, searchError);
                    }

                    duplicateLink = undefined;
                };
                
                _this.selectKeywords = function () {
                    $modal.open({
                        animation: true,
                        templateUrl: 'templates/keywordSelection.html',
                        controller: 'de.cismet.sip-html5-resource-registration.controllers.keywordsController',
                        controllerAs: 'keywordsController',
                        keyboard: 'true',
                        size: 'lg',
                        scope: $scope
                    });
                };
                
                _this.gotoUploadTool = function () {
                    var uploadToolUrl = _this.config.uploadtool.baseUrl + 
                            '?datasetname=' + _this.dataset.name;
                    //console.log(uploadToolUrl);
                    $location.url(uploadToolUrl); 
                };
                
                _this.checkUploadName = function () {
                     if (!dataset.name) {
                        $scope.message.text = 'Please enter the name / title of the dataset before uploading ';
                        $scope.message.icon = 'fa-warning';
                        $scope.message.type = 'warning';

                        $scope.wizard.hasError = 'datasetUploadchoiceName';
                        return false;
                    }
                    
                    return true;
                };

                // load list
                $scope.tags['function'] = tagGroupService.getTagList('function');
                $scope.tags['content type'] = tagGroupService.getTagList('content type');
                $scope.tags['keywords - X-CUAHSI'] = tagGroupService.getTagList('keywords - X-CUAHSI');

                // set default values
//                _this.dataset.representation[0].function = tagGroupService.getTag('function', 'download',
//                        function (tag) {
//                            _this.dataset.representation[0].function = tag;
//                        });
//                
//                _this.dataset.representation[0].contenttype = tagGroupService.getTag('content type', 'application/octet-stream',
//                        function (tag) {
//                            _this.dataset.representation[0].contenttype = tag;
//                        });

                $scope.wizard.enterValidators['Dataset Description'] = function (context) {
                    if (context.valid === true) {
                        $scope.message.text = 'Please provide some general information about the new dataset such as name, description, a (download) link and keywords.';
                        $scope.message.icon = 'fa-info-circle';
                        $scope.message.type = 'success';
                    }

                    return context.valid;
                };

                $scope.wizard.exitValidators['Dataset Description'] = function (context) {
                    context.valid = true;

                    // CONTENT TYPE
                    var isInvalidContenttype = $scope.tags['content type'].every(function (element) {
                        if (_this.dataset.representation[0] && _this.dataset.representation[0].contenttype &&
                                (element.name === _this.dataset.representation[0].contenttype.name)) {
                            _this.dataset.representation[0].contenttype = element;
                            return false;
                        }

                        return true;
                    });

                    // FUNCTION
                    var isInvalidFunction = $scope.tags['function'].every(function (element) {
                        if (_this.dataset.representation[0] && _this.dataset.representation[0].function &&
                                (element.name === _this.dataset.representation[0].function.name)) {
                            _this.dataset.representation[0].function = element;
                            return false;
                        } else {
                            return true;
                        }
                    });

                    // NAME
                    if (!dataset.name) {
                        $scope.message.text = 'Please enter the name / title of the dataset.';
                        $scope.message.icon = 'fa-warning';
                        $scope.message.type = 'warning';

                        $scope.wizard.hasError = 'datasetName';
                        context.valid = false;
                    } else if (dataset.$uploaded === undefined) {
                        $scope.message.text = 'Please chose wheter you want to upload a new dataset or to provide a link to anexisting dataset.';
                        $scope.message.icon = 'fa-warning';
                        $scope.message.type = 'warning';

                        $scope.wizard.hasError = 'datasetUploadchoice';
                        context.valid = false;
                    } else if (isInvalidFunction) {
                        $scope.message.text = 'Please select a valid function (e.g. download) of the link.';
                        $scope.message.icon = 'fa-warning';
                        $scope.message.type = 'warning';

                        $scope.wizard.hasError = 'datasetContentlocation';
                        context.valid = false;
                    } else if (!dataset.representation[0].function) {
                        $scope.message.text = 'Please select a function (e.g. download) of the link.';
                        $scope.message.icon = 'fa-warning';
                        $scope.message.type = 'warning';

                        $scope.wizard.hasError = 'datasetContentlocation';
                        context.valid = false;
                    }  else if ($scope.odRegistrationForm.datasetContentlocation.$error.url) {
                        // CONTENT LOCATION       
                        $scope.message.text = 'The link to the dataset you have provided is not a valid <a href=\'https://en.wikipedia.org/wiki/Uniform_Resource_Locator#Syntax\' target=\'_blank\' title=\'Uniform Resource Locator\'>URL</a> .';
                        $scope.message.icon = 'fa-warning';
                        $scope.message.type = 'warning';

                        $scope.wizard.hasError = 'datasetContentlocation';
                        context.valid = false;
                    } else if (!dataset.representation[0].contentlocation) {
                        $scope.message.text = 'Please provide link to the dataset.';
                        $scope.message.icon = 'fa-warning';
                        $scope.message.type = 'warning';

                        $scope.wizard.hasError = 'datasetContentlocation';
                        context.valid = false;
                    } else if (duplicateLink) {
                        $scope.message.text = duplicateLink;
                        $scope.message.icon = 'fa-warning';
                        $scope.message.type = 'warning';

                        $scope.wizard.hasError = 'datasetContentlocation';
                        context.valid = false;
                    } else if (isInvalidContenttype) {
                        $scope.message.text = 'Please select a valid content type (e.g. ESRI Shapefile) of the link.';
                        $scope.message.icon = 'fa-warning';
                        $scope.message.type = 'warning';

                        $scope.wizard.hasError = 'datasetContentlocation';
                        context.valid = false;
                    } else if (!dataset.representation[0].contenttype) {
                        $scope.message.text = 'Please select a valid content type (e.g. ESRI Shapefile) of the link.';
                        $scope.message.icon = 'fa-warning';
                        $scope.message.type = 'warning';

                        $scope.wizard.hasError = 'datasetContentlocation';
                        context.valid = false;
                    } else if (!dataset.description) {
                        // DESCRIPTION
                        $scope.message.text = 'Please provide a description of the dataset.';
                        $scope.message.icon = 'fa-warning';
                        $scope.message.type = 'warning';

                        $scope.wizard.hasError = 'datasetDescription';
                        context.valid = false;
                    } else if (!_this.dataset.tags || _this.dataset.tags.length === 0) {
                        $scope.message.text = 'Please assign at least one keyword to the Dataset.';
                        $scope.message.icon = 'fa-warning';
                        $scope.message.type = 'warning';

                        $scope.wizard.hasError = 'datasetTags';
                        context.valid = false;
                    }

                    if (context.valid === true) {
                        $scope.wizard.hasError = null;
                    }
                    // no error? -> reset

                    return context.valid;
                };
            }
        ]
        );
/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

/*jshint sub:true*/

angular.module(
        'de.cismet.sip-html5-resource-registration.controllers'
        ).controller(
        'de.cismet.sip-html5-resource-registration.controllers.storageController',
        [
            '$scope',
            '$http',
            '$window',
            '$interval',
            '$location',
            '$modalInstance',
            'rfc4122',
            'AppConfig',
            'de.cismet.sip-html5-resource-registration.services.dataset',
            'de.cismet.sip-html5-resource-registration.services.TagGroupService',
            'de.cismet.sip-html5-resource-registration.services.storageService',
            // Controller Constructor Function
            function (
                    $scope,
                    $http,
                    $window,
                    $interval,
                    $location,
                    $modalInstance,
                    rfc4122,
                    AppConfig,
                    dataset,
                    tagGroupService,
                    storageService
                    ) {
                'use strict';
                var _this, currentdate, userAgent, maxProgress;

                currentdate = new Date().getTime();
                userAgent = $window.navigator.userAgent;
                maxProgress = 120;

                _this = this;
                _this.dataset = dataset;
                _this.config = AppConfig;

                _this.progress = {};
                _this.progress.message = null;
                _this.progress.currval = 0;
                _this.progress.active = true;
                _this.progress.finished = false;
                _this.progress.error = null;
                _this.progress.type = 'primary';
                _this.progress.message = 'The dataset is now added to the SWITCH-ON Meta-Data Repository. <br>Please do not close this browser window until the uploaded has been completed';

                _this.close = function () {
                    $modalInstance.close();
                    $window.location.reload();
                };

                $modalInstance.rendered.then(function () {

                    // REPRESENTATIONS
                    _this.dataset.representation.forEach(function (representation) {
                        maxProgress += 10;  
                        
                        // TAGS -> REPRESENTATION
                        representation.updateTags().then(function () {
                            _this.progress.currval += 10; // maxProgress + 10
                            //console.log('REPRESENTATIONS: ' + _this.progress.currval);
                        });
                        
                        // the uuid is needed to uniquely indentify the representation 
                        // when the server has to perform an update of the uploadmessage (processing instruction)
                        // UUID -> REPRESENTATION
                        representation.uuid = representation.uuid || rfc4122.v4();
                    });
                    
                    // SRID TAG -> RESOURCE
                    tagGroupService.getTagList('srid', 'EPSG:4326').$promise.then(function (tags) {
                        _this.dataset.srid = tags[0];
                        _this.progress.currval += 10; // 10
                        //console.log('SRID TAG -> RESOURCE: ' + _this.progress.currval);
                    });

                    // CONFORMITY TAG -> RESOURCE
                    tagGroupService.getTagList('conformity', 'Not evaluated').$promise.then(function (tags) {
                        _this.dataset.conformity = tags[0];
                        _this.progress.currval += 10; // 20
                        //console.log('CONFORMITY TAG -> RESOURCE: ' + _this.progress.currval);
                    });

                    // LANGUAGE TAG -> RESOURCE, BASIC METADATA, LINEAGE METADATA
                    tagGroupService.getTagList('language', 'eng').$promise.then(function (tags) {
                        _this.dataset.language = tags[0];
                        _this.dataset.metadata[0].language = tags[0];
                        if (_this.dataset.metadata[1] && _this.dataset.metadata[1].description) {
                            _this.dataset.metadata[1].language = tags[0];
                        }
                        _this.progress.currval += 10; // 30
                        //console.log('LANGUAGE TAG: ' + _this.progress.currval);
                    });

                    // RESOURCE TYPE -> RESOURCE
                    tagGroupService.getTagList('resource type', 'open data').$promise.then(function (tags) {
                        _this.dataset.type = tags[0];
                        _this.progress.currval += 10; // 40
                        //console.log('RESOURCE TYPE -> RESOURCE: ' + _this.progress.currval);
                    });

                    // INSPIRE TOPIC CATEGORY -> 
                    tagGroupService.getTagList('topic category', 'climatologyMeteorologyAtmosphere').$promise.then(function (tags) {
                        _this.dataset.topiccategory = tags[0];
                        _this.progress.currval += 10;  // 50
                        //console.log('INSPIRE TOPIC CATEGORY: ' + _this.progress.currval);
                    });

                    // ROLE -> CONTACT
                    tagGroupService.getTagList('role', 'pointOfContact').$promise.then(function (tags) {
                        if (_this.dataset.contact.organisation ||
                                _this.dataset.contact.name ||
                                _this.dataset.contact.description ||
                                _this.dataset.contact.email ||
                                _this.dataset.contact.url) {
                            _this.dataset.contact.role = tags[0];
                        } else {
                            _this.dataset.contact = null;
                        }
                        _this.progress.currval += 10; // 60
                        //console.log('ROLE -> CONTACT: ' + _this.progress.currval);
                    });

                    // META-DATA TYPE -> BASIC METADATA, LINEAGE METADATA
                    tagGroupService.getTagList('meta-data type', 'basic meta-data,lineage meta-data').$promise.then(function (tags) {
                        _this.dataset.metadata[0].type = tags.getTagByName('basic meta-data');
                        if (_this.dataset.metadata[1] && _this.dataset.metadata[1].description) {
                            _this.dataset.metadata[1].type = tags.getTagByName('lineage meta-data');
                        }
                        _this.progress.currval += 10; // 70
                        //console.log('META-DATA TYPE: ' + _this.progress.currval);
                    });

                    // ACCESS LIMITATIONS
                    tagGroupService.getTagList('access limitations', 'limitation not listed').$promise.then(function (tags) {
                        _this.dataset.accesslimitations = tags[0];
                        _this.progress.currval += 10; // 80
                        //console.log('ACCESS LIMITATIONS: ' + _this.progress.currval);
                    });

                    // COLLECTION -> RESOURCE
                    tagGroupService.getTagList('collection', 'Open Datasets').$promise.then(function (tags) {
                        _this.dataset.collection = tags[0];
                        _this.progress.currval += 10; // 90
                        //console.log('COLLECTION -> RESOURCE: ' + _this.progress.currval);
                    });

                    // META-DATA STANDARD -> BASIC METADATA, LINEAGE METADATA
                    tagGroupService.getTagList('meta-data standard', 'SWITCH-ON SIM').$promise.then(function (tags) {
                        _this.dataset.metadata[0].standard = tags[0];
                        if (_this.dataset.metadata[1] && _this.dataset.metadata[1].description) {
                            _this.dataset.metadata[1].standard = tags[0];
                        }
                        _this.progress.currval += 10; // 100
                        //console.log('META-DATA STANDARD: ' + _this.progress.currval);
                    });


                    // CONTENT TYPE -> BASIC METADATA
                    _this.dataset.metadata[0].contenttype = tagGroupService.getTag('content type', 'application/json', function (tag) {
                        _this.dataset.metadata[0].contenttype = tag;
                        // callback function might get called or might not get called!
                        //_this.progress.currval += 10; // 110
                        //console.log('CONTENT TYPE: ' + _this.progress.currval);
                    });


                    // CONTENT (REQUEST STATUS) -> BASIC METADATA
                    $http({
                        method: 'GET',
                        url: _this.config.cidsRestApi.host + '/service/status'
                    }).then(function (response) {
                        _this.dataset.metadata[0].content = JSON.stringify(response.data.$collection);
                        _this.dataset.metadata[0].creationdate = currentdate;
                        _this.dataset.metadata[0].description = userAgent;
                        _this.progress.currval += 10; // 110
                        //console.log('CONTENT (REQUEST STATUS): ' + _this.progress.currval);
                    });
                    
                    
                    // check first resource name
                    if (!_this.dataset.representation[0].name) {
                        _this.dataset.representation[0].name = _this.dataset.name;
                    }
                    
                    // CLEANUP
                    _this.dataset.uuid = _this.dataset.uuid || rfc4122.v4();
                    
                    // check optional lineage metadata
                    if (!_this.dataset.metadata[1] || !_this.dataset.metadata[1].description) {
                        _this.dataset.metadata.splice(1, 1);
                    } else {
                         _this.dataset.metadata[1].creationdate = currentdate;
                    }
                    
                    _this.progress.currval += 10; // 120
                    //console.log('CLEANUP: ' + _this.progress.currval);
                });

                $scope.$watch(function () {
                    // Return the "result" of the watch expression.
                    return(_this.progress.currval);
                }, function (newProgress) {
                    if (newProgress && newProgress === maxProgress) {
                        var timer = $interval(function () {
                            if (_this.progress.currval < 190) {
                                _this.progress.currval += 1;
                            }
                        }, 200, 50);

                        storageService.store(dataset).$promise.then(
                                function (storedDataset) {
                                    $interval.cancel(timer);

                                    _this.progress.message = 'Your dataset has been successfully registered in the SWITCH-ON Spatial Information Platform. Please click <a href=\'' + AppConfig.byod.baseUrl + '/#/resource/' +
                                            storedDataset.id + '\' title=\'' + storedDataset.name + '\'>here</a> to view the dataset in the SWITCH-ON BYOD Client.';

                                    _this.progress.active = false;
                                    _this.progress.finished = true;
                                    _this.progress.type = 'success';
                                    _this.progress.currval = 200;

                                },
                                function (error) {
                                    $interval.cancel(timer);

                                    if (error.data.userMessage) {
                                        _this.progress.message = 'The dataset could not be saved in the Meta-Data Repository: <br>' +
                                                error.data.userMessage;
                                    } else {
                                        this.progress.message = 'The dataset could not be saved in the Meta-Data Repository.';
                                    }

                                    _this.progress.active = false;
                                    _this.progress.finished = true;
                                    _this.progress.type = 'danger';
                                    _this.progress.currval = 200;
                                });

                    }
                });
            }
        ]
        );
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
    'de.cismet.sip-html5-resource-registration.controllers.summaryController',
    [
        '$scope',
        'AppConfig',
        'de.cismet.sip-html5-resource-registration.services.geoTools',
        'de.cismet.sip-html5-resource-registration.services.dataset',
        'leafletData',
        'de.cismet.sip-html5-resource-registration.services.featureRendererService',
        // Controller Constructor Function
        function (
            $scope,
            AppConfig,
            geoTools,
            dataset,
            leafletData,
            featureRendererService
        ) {
            'use strict';
            var _this, fireResize, wicket, defaultStyle, defaultDrawOptions, noDrawOptions,
                    readSpatialCoverage, writeSpatialCoverage, layerGroup, geoserverLayer;
            
            _this = this;
            _this.dataset = dataset;
            _this.config = AppConfig;
            _this.readOnly = dataset.$geoserverUploaded;
            
            
            wicket = geoTools.wicket;
            defaultStyle = geoTools.defaultStyle;
            defaultDrawOptions = geoTools.defaultDrawOptions;
            noDrawOptions = geoTools.noDrawOptions;
            readSpatialCoverage = geoTools.readSpatialCoverage;
            writeSpatialCoverage = geoTools.writeSpatialCoverage;
            fireResize = geoTools.fireResize;
            
            //draw control initialisation
            layerGroup = new L.FeatureGroup();           
            
            leafletData.getMap('summarymap').then(function (map) {
                map.addLayer(layerGroup);
            });

//            $scope.mapData.center = _this.config.mapView.home;
//            $scope.mapData.defaults = {
//                    tileLayer: _this.config.mapView.backgroundLayer,
//                    //tileLayerOptions: {noWrap: true},
//                    //maxZoom: 14,
//                    minZoom: _this.config.minZoom,
//                    path: defaultStyle
//                };
//            $scope.mapData.defaultDrawOptions = defaultDrawOptions;

            // validation functions
            $scope.wizard.enterValidators['Summary'] = function(context){
                 if(context.valid === true){
                    $scope.message.text='Please review the meta-data of the dataset and press <strong>Finish</strong> to register the dataset in the SWITCH-ON Spatial Information Platform.';
                    $scope.message.icon='fa-info-circle';
                    $scope.message.type = 'success';
                
                    fireResize('summarymap');
                    var layer = readSpatialCoverage(_this.dataset);
                    if(layer !== undefined && layer !== null) {
                        layerGroup.clearLayers();
                        layerGroup.addLayer(layer);
                         leafletData.getMap('summarymap').then(function (map) {
                            setTimeout(function(){map.fitBounds(layer, {
                                    animate: true,
                                    pan: {animate: true, duration: 0.75},
                                    zoom: {animate: true}
                                });}, 100);
                       });
                    }
                    
                    if(_this.readOnly && geoserverLayer === undefined) {
                         geoserverLayer = featureRendererService.getFeatureRenderer(_this.dataset);
                            if (geoserverLayer) {
                                geoserverLayer.setOpacity(1.0);
                                leafletData.getMap('summarymap').then(function (map) {
                                    map.addLayer(geoserverLayer);
                                });
                            }
                    } 
                }
                
                return context.valid;
            };
            
            $scope.wizard.exitValidators['Summary'] = function(){
                $scope.wizard.hasError = null;
                return true;
            };
        }
    ]
);
// module initialiser for the directives, shall always be named like that so that concat will pick it up first!
// however, the actual directives implementations shall be put in their own files
angular.module(
    'de.cismet.sip-html5-resource-registration.directives',
    [
       
    ]
);
angular.module(
    'de.cismet.sip-html5-resource-registration.factories',
    [
    ]
);
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
    'de.cismet.sip-html5-resource-registration.factories'
).factory('AppConfig',
    [function () {
        'use strict'; 

        var appConfig = {};
        
        appConfig.cidsRestApi = {};
        //appConfig.cidsRestApi.host = 'http://localhost:8890';
        appConfig.cidsRestApi.host = 'http://switchon.cismet.de/legacy-rest1';
        //appConfig.cidsRestApi.host = 'http://data.water-switch-on.eu/switchon_server_rest';
        
        appConfig.searchService = {};
        appConfig.searchService.username = 'admin@SWITCHON';
        appConfig.searchService.password = 'cismet';
        appConfig.searchService.defautLimit = 10;
        appConfig.searchService.maxLimit = 50;
        appConfig.searchService.host = appConfig.cidsRestApi.host;
        
        appConfig.mapView = {};
        appConfig.mapView.backgroundLayer = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
        appConfig.mapView.countriesLayer = 'https://raw.githubusercontent.com/switchonproject/world.geo.json/master/countries.geo.json';
        appConfig.mapView.home = {};
        appConfig.mapView.home.lat = 49.245166;
        appConfig.mapView.home.lng = 6.936809;
        appConfig.mapView.home.zoom = 4;
        appConfig.mapView.maxBounds = {};
        appConfig.mapView.maxBounds.southWest = [90, -180]; // top left corner of map
        appConfig.mapView.maxBounds.northEast = [-90, 180];  // bottom right corner  
        appConfig.mapView.minZoom = 2;

        appConfig.gui = {};
        // Development Mode (e.g. enable untested features)
        appConfig.gui.dev = false;

        appConfig.objectInfo = {};
        appConfig.objectInfo.resourceJsonUrl = 'http://' +
        appConfig.searchService.username + ':' +
        appConfig.searchService.password + '@' +
        appConfig.searchService.host.replace(/.*?:\/\//g, '');
        appConfig.objectInfo.resourceXmlUrl = 'http://data.water-switch-on.eu/csw?request=GetRecordById&service=CSW&version=2.0.2&namespace=xmlns%28csw=http://www.opengis.net/cat/csw/2.0.2%29&resultType=results&outputSchema=http://www.isotc211.org/2005/gmd&outputFormat=application/xml&ElementSetName=full&id=';

        appConfig.byod = {};
        //appConfig.byod.baseUrl = 'http://www.water-switch-on.eu/sip-webclient/byod';
        appConfig.byod.baseUrl = 'http://switchon.cismet.de/sip-snapshot';
        
        appConfig.uploadtool = {};
        appConfig.uploadtool.baseUrl = 'http://dl-ng003.xtr.deltares.nl';
        
        return appConfig;
    }]);
angular.module(
    'de.cismet.sip-html5-resource-registration.filters',
    [
    ]
);

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
        'de.cismet.sip-html5-resource-registration.filters'
        ).filter(
        'contenttype',
        function () {
            'use strict';


            return function (items) {
                var filtered = [];
                angular.forEach(items, function (item) {
                    filtered.push(item);
                });

                filtered.sort(function (a, b) {

                    if (a.description.indexOf('unknown') !== -1) {

                        return -1;
                    } else if (b.description.indexOf('unknown') !== -1) {
                        return 1;
                    } else {
                        return a.description.localeCompare(b.description);
                    }
                });
                return filtered;
            };
        });

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
        'de.cismet.sip-html5-resource-registration.filters'
        ).filter(
        'function',
        function () {
            'use strict';


            return function (items) {
                var filtered = [];
                
                angular.forEach(items, function (item) {
                    if(item.name === 'download' || 
                            item.name === 'information' || 
                            item.name === 'link to order data') {
                        filtered.push(item);
                    }
                });

                filtered.sort(function (a, b) {
                    return a.name.localeCompare(b.name);
                });
                return filtered;
            };
        });

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
        'de.cismet.sip-html5-resource-registration.filters'
        ).filter(
        'limit',
        function () {
            'use strict';
            return function (items, begin, end) {
                return items.slice(begin, end);
            };
        });

/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

angular.module('de.cismet.sip-html5-resource-registration.filters').
        filter('htmlToPlaintext', function () {
            'use strict';
            return function (text) {
                return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
            };
        }
        );
// module initialiser for the services, shall always be named like that so that concat will pick it up first!
// however, the actual service implementations shall be put in their own files
angular.module(
    'de.cismet.sip-html5-resource-registration.services',
    [
        'ngResource'
    ]
);
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

/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

angular.module('de.cismet.sip-html5-resource-registration.services')
        .factory('de.cismet.sip-html5-resource-registration.services.dataset',
                ['$resource',
                    '$location',
                    'de.cismet.sip-html5-resource-registration.services.RepresentationFactory',
                    function ($resource, $location, Representation) {
                        'use strict';
                        var datasetTemplate = $resource('data/datasetTemplate.json', {}, {
                            query: {
                                method: 'GET',
                                params: {
                                },
                                isArray: false
                            }
                        }).query();

                        datasetTemplate.$promise.then(function (dataset) {
                            dataset.$uploaded = false;
                            dataset.$geoserverUploaded = false;

                            // check request parameters for representations, parse and add to
                            // the dataset's representation array
                            var tmpRepresentations = [];
                            var representationJson = ($location.search()).representations;
                            if (representationJson) {
                                tmpRepresentations =  JSON.parse(representationJson);
                                if (Array.isArray(tmpRepresentations)) {
                                    tmpRepresentations.forEach(function (representation) {
                                        //invoke representation constructor
                                        dataset.representation.push(new Representation(representation));
                                        
                                        // WKT BBox from Data upload Tool (SHP -> Geoserver)
                                        if(representation.wktboundingbox && !dataset.spatialcoverage.geo_field) { // jshint ignore:line
                                            dataset.spatialcoverage.geo_field = representation.wktboundingbox; // jshint ignore:line
                                            dataset.$geoserverUploaded = true;
                                        }
                                    });
                                }
                            }

                            // choose the name of the first representation as name of the dataset
                            if (dataset.representation.length > 0 && dataset.representation[0].name !== null) {
                                dataset.name = dataset.representation[0].name;
                                if (dataset.representation[0].contentlocation &&
                                        dataset.representation[0].function.name &&
                                        dataset.representation[0].contenttype.name) {
                                    dataset.$uploaded = true;
                                }

                            } else {
                                dataset.representation[0] = new Representation();
                            }
                        });

                        return datasetTemplate;
                    }]);



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
/* global Wkt */

angular.module(
    'de.cismet.sip-html5-resource-registration.services'
).factory(
    'de.cismet.sip-html5-resource-registration.services.featureRendererService',
    [
        // would depend on a provider for features, to be specified
        function () {
            'use strict';

            var getFeatureRenderer, wicket, defaultStyle, highlightStyle;

            wicket = new Wkt.Wkt();

            defaultStyle = {color: '#0000FF', fill: false, weight: 2, riseOnHover: true, clickable: false};
            highlightStyle = {fillOpacity: 0.4, fill: true, fillColor: '#1589FF', riseOnHover: true, clickable: false};

            /**
             * Returns a "Feature Renderer" (Leaflet Layer) for a resource.
             * If the resources contains a WMS preview representation a WMS Layer
             * is instantiated and returned, otherwise, the spatialextent (geom)
             * of the resourc eis used.
             *
             * @param {type} obj
             * @returns {L.TileLayer.WMS|featureRendererService_L7.getFeatureRenderer.renderer}
             */
            getFeatureRenderer = function (obj) {
                // this is only an indirection to hide the conrete implementation
                // however, as not specified yet, we hardcode this for now

                var ewkt, renderer, objectStyle;

                renderer = null;
                if (obj &&
                        obj.$self &&
                        obj.$self.substr(0, 18).toLowerCase() === '/switchon.resource') {
                    if (obj.representation) {
                        obj.representation.every(function (representation) {
                            var capabilities, layername;

                            if (representation.name && representation.contentlocation &&
                                    representation.type && representation.type.name === 'aggregated data' &&
                                    representation['function'] && representation['function'].name === 'service' &&
                                    representation.protocol) {

                                // PRIORITY on TMS!
                                if (representation.protocol.name === 'WWW:TILESERVER') {
                                    renderer = L.tileLayer(representation.contentlocation,
                                        {
                                            // FIXME: make configurable per layer
                                            tms: 'true'
                                        });

                                    // unfortunately leaflet does not parse the capabilities, etc, thus no bounds present :(
                                    // todo: resolve performance problems with multipoint / multipolygon!
                                    renderer.getBounds = function () {
                                        // the geo_field property comes from the server so ...  
                                        if (obj.spatialcoverage && obj.spatialcoverage.geo_field) { // jshint ignore:line
                                            ewkt = obj.spatialcoverage.geo_field; // jshint ignore:line
                                            wicket.read(ewkt.substr(ewkt.indexOf(';') + 1));

                                            return wicket.toObject().getBounds();
                                        }
                                    };

                                    // disable the layer by default and show it only when it is selected!
                                    renderer.setOpacity(0.0);
                                    //renderer.bringToBack();
                                } else if (representation.protocol.name === 'OGC:WMS-1.1.1-http-get-capabilities') {
                                    capabilities = representation.contentlocation;
                                    layername = representation.name;
                                    renderer = L.tileLayer.wms(
                                        capabilities,
                                        {
                                            layers: layername,
                                            format: 'image/png',
                                            transparent: true,
                                            version: '1.1.1'
                                        }
                                    );

                                    // unfortunately leaflet does not parse the capabilities, etc, thus no bounds present :(
                                    // todo: resolve performance problems with multipoint / multipolygon!
                                    renderer.getBounds = function () {
                                        // the geo_field property comes from the server so ...  
                                        if (obj.spatialcoverage && obj.spatialcoverage.geo_field) { // jshint ignore:line
                                            ewkt = obj.spatialcoverage.geo_field; // jshint ignore:line
                                            wicket.read(ewkt.substr(ewkt.indexOf(';') + 1));

                                            return wicket.toObject().getBounds();
                                        }
                                    };

                                    // disable the layer by default and show it only when it is selected!
                                    renderer.setOpacity(0.0);
                                    //renderer.bringToBack();
                                }
                            }

                            // execute callback function until renderer is found 
                            return renderer === null;
                        });
                    }

                    // the geo_field property comes from the server so ...  
                    // if no preview (WMS layer representation) is found,
                    // use the spatial extent
                    if (!renderer && obj.spatialcoverage && obj.spatialcoverage.geo_field) { // jshint ignore:line
                        ewkt = obj.spatialcoverage.geo_field; // jshint ignore:line
                        wicket.read(ewkt.substr(ewkt.indexOf(';') + 1));
                        objectStyle = Object.create(defaultStyle);
                        if (obj.name) {
                            objectStyle.title = obj.name;
                        }
                        renderer = wicket.toObject(objectStyle);
                        renderer.setStyle(defaultStyle);
                    }
                }

                return renderer;
            };

            return {
                getFeatureRenderer: getFeatureRenderer,
                defaultStyle: defaultStyle,
                highlightStyle: highlightStyle
            };
        }
    ]
);
/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

/* global Wkt */

angular.module('de.cismet.sip-html5-resource-registration.services')
        .factory('de.cismet.sip-html5-resource-registration.services.geoTools', 
        ['leafletData',
    function (leafletData) {
            'use strict';
            var defaultStyle, countriesStyle, noDrawOptions, defaultDrawOptions, 
                    readSpatialCoverageFunction, writeSpatialCoverageFunction, 
                    fireResizeFunction, readOnlyStyle;
            
            defaultStyle = {
                color: '#0000FF', 
                fillOpacity: 0.3, 
                weight: 2, 
                fill: true, 
                fillColor: '#1589FF', 
                riseOnHover: true, 
                clickable: true
            };
            
            readOnlyStyle = {
                color: '#0000FF', 
                weight: 2, 
                opacity: 0.25,
                fill: false, 
                riseOnHover: false, 
                clickable: false
            };
            
            countriesStyle = {
                color: '#ff7800',
                weight: 2,
                opacity: 0.65,
                fill: true,
                fillOpacity: 0,
                clickable: true,
                riseOnHover: true
            };
            
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
            
            
            
            readSpatialCoverageFunction = function(dataset) {
                if(dataset.spatialcoverage && dataset.spatialcoverage.geo_field) { // jshint ignore:line
                    var wktString = dataset.spatialcoverage.geo_field; // jshint ignore:line
                    
                    // WKT from REST API contains EPSG definition. 
                    // WKT from data upload tool does not!
                    var wicket = new Wkt.Wkt();
                    if(wktString.indexOf(';') !== -1) {
                        wicket.read(wktString.substr(wktString.indexOf(';') + 1));
                    } else {
                        wicket.read(wktString);
                    }
                    
                    var style = dataset.$geoserverUploaded ? readOnlyStyle : defaultStyle;
                    var layer = wicket.toObject(style);
                    layer.setStyle(style);
                    return layer;
                }

                return undefined;
            };
            
            writeSpatialCoverageFunction = function(dataset, wktString) {
                if(wktString && dataset.spatialcoverage) { // jshint ignore:line
                    var wktStringWithSRS = 'SRID=4326;'+wktString;
                    dataset.spatialcoverage.geo_field = wktStringWithSRS; // jshint ignore:line
                }
            };

            fireResizeFunction = function (mapid) {
                leafletData.getMap(mapid).then(function (map) {
                    setTimeout(function(){ map.invalidateSize();}, 50);
                });
            };
            
        
        return {
            defaultStyle:defaultStyle,
            readOnlyStyle:readOnlyStyle,
            countriesStyle:countriesStyle,
            defaultDrawOptions:defaultDrawOptions,
            noDrawOptions:noDrawOptions,
            readSpatialCoverage:readSpatialCoverageFunction,
            writeSpatialCoverage:writeSpatialCoverageFunction,
            fireResize:fireResizeFunction
        };    
	}]);



/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

angular.module('de.cismet.sip-html5-resource-registration.services')
        .factory('de.cismet.sip-html5-resource-registration.services.RepresentationFactory',
                ['$q',
                    'de.cismet.sip-html5-resource-registration.services.TagGroupService',
                    function ($q, tagGroupService) {
                        'use strict';

                        function Representation(representation) {
                            var _this; //, resourceTemplate;
                            _this = this;

                            _this.$self = '/SWITCHON.REPRESENTATION/-1';
                            _this.id = -1;
                            _this.name = null;
                            _this.description = null;
                            _this.content = null;
                            _this.type = {};
                            _this.function = {};
                            _this.protocol = {};
                            _this.applicationprofile = null;
                            _this.uuid = null;
                            _this.temporalresolution = null;
                            _this.spatialresolution = null;
                            _this.spatialscale = null;
                            _this.contentlocation = null;
                            _this.tags = null;
                            _this.contenttype = {};
                            _this.uploadstatus = null;
                            _this.uploadmessage = null;

                            // copy properties from remote representation object (angular resource)
                            // and ignore $resolved and $promise
                            if (representation) {
                                for (var key in representation) {
                                    if (representation.hasOwnProperty(key) && _this.hasOwnProperty(key) &&
                                            key !== '$resolved' && key !== '$promise') {
                                        // tags need special handling
                                        if (_this[key] !== null && typeof _this[key] === 'object') {
                                            _this[key].name = representation[key];
                                        } else {
                                                 _this[key] = representation[key];
                                            } 
                                        }
                                    }
                                }
                            }

                        // client does not know the internal tag id and provides just the tag name
                        // -> retrieve the actual tag objects from REST API
                        Representation.prototype.updateTags = function () {
                            var promises;
                            var _that = this;
                            promises = [];

                            // resource type
                            if (!_that.type) {
                                _that.type = {};
                            }
                            if (!_that.type.name) {
                                _that.type.name = 'original data';
                            }
                            if (!_that.type.$self || !_that.type.$ref) {
                                promises.push(tagGroupService.getTagList('representation type').$promise.then(
                                        function (tags) {
                                            _that.type = tags.getTagByName(_that.type.name);
                                        }));
                            }

                            // resource protocol
                            if (!_that.protocol) {
                                _that.protocol = {};
                            }
                            if (!_that.protocol.name) {
                                _that.protocol.name = 'WWW:LINK-1.0-http--link';
                            }
                            if (!_that.protocol.$self || !_that.protocol.$ref) {
                                promises.push(tagGroupService.getTagList('protocol').$promise.then(
                                        function (tags) {
                                            _that.protocol = tags.getTagByName(_that.protocol.name);
                                        }));
                            }

                            // resource function
                            if (!_that.function.name) {
                                _that.function = {};
                            }
                            if (!_that.function.name) {
                                _that.function = 'download';
                            }
                            if (!_that.function.$self || !_that.function.$ref) {
                                promises.push(tagGroupService.getTagList('function').$promise.then(
                                        function (tags) {
                                            _that.function = tags.getTagByName(_that.function.name);
                                        }));
                            }

                            // resource content type
                            if (!_that.contenttype) {
                                _that.contenttype = {};
                            }
                            if (!_that.contenttype.name) {
                                _that.contenttype.name = 'application/octet-stream';
                            }
                            if (!_that.contenttype.$self || !_that.contenttype.$ref) {
                                promises.push(tagGroupService.getTagList('content type').$promise.then(
                                        function (tags) {
                                            _that.contenttype = tags.getTagByName(_that.contenttype.name);
                                        }));
                            }

                            //return a fake promise to satisfy progress watch
                            if (promises.length === 0) {
                                promises.push($q(function (resolve) {
                                    setTimeout(function () {
                                        resolve();
                                    }, 500);
                                }));
                            }

                            return $q.all(promises);
                        };

                        Representation.prototype.constructor = Representation;
                        return Representation;

                    }]);

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
).factory('de.cismet.sip-html5-resource-registration.services.searchService',
    ['$resource', 'de.cismet.sip-html5-resource-registration.services.Base64',
        'AppConfig',
        function ($resource, Base64, AppConfig) {
            'use strict';
            var config, authdata, searchResource, searchFunction;

            config = AppConfig.searchService;
            authdata = Base64.encode(config.username + ':' + config.password);

            searchResource = $resource(config.host + '/searches/SWITCHON.de.cismet.cids.custom.switchon.search.server.ResourceContentLocationSearch/results',
                {
                    limit: 1,
                    offset: 0,
                    omitNullValues: true,
                    deduplicate: true
                }, {
                    search: {
                        method: 'POST',
                        params: {
                            limit: '@limit',
                            offset: '@offset'
                        },
                        isArray: false,
                        headers: {
                            'Authorization': 'Basic ' + authdata
                        }
                    }
                });

            searchFunction = function (url) {
                var queryObject, searchResult;
                queryObject = {
                    'list': [{'key': 'url', 'value': url}]
                };

                // result of the remote search operation (promise)
                // starting the search!

                searchResult = searchResource.search(
                    {
                        limit: 1,
                        offset: 0
                    },
                    queryObject
                );
        
                return searchResult;
            };

            return {
                search: searchFunction
            };
        }
        ])

    .factory('de.cismet.sip-html5-resource-registration.services.Base64', function () {
        /* jshint ignore:start */

        var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

        return {
            encode: function (input) {
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;

                do {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);

                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;

                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }

                    output = output +
                        keyStr.charAt(enc1) +
                        keyStr.charAt(enc2) +
                        keyStr.charAt(enc3) +
                        keyStr.charAt(enc4);
                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";
                } while (i < input.length);

                return output;
            },
            decode: function (input) {
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;

                // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
                var base64test = /[^A-Za-z0-9\+\/\=]/g;
                if (base64test.exec(input)) {
                    console.error("There were invalid base64 characters in the input text.\n" +
                        "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                        "Expect errors in decoding.");
                }
                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

                do {
                    enc1 = keyStr.indexOf(input.charAt(i++));
                    enc2 = keyStr.indexOf(input.charAt(i++));
                    enc3 = keyStr.indexOf(input.charAt(i++));
                    enc4 = keyStr.indexOf(input.charAt(i++));

                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;

                    output = output + String.fromCharCode(chr1);

                    if (enc3 !== 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 !== 64) {
                        output = output + String.fromCharCode(chr3);
                    }

                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";

                } while (i < input.length);

                return output;
            }
        };

        /* jshint ignore:end */
    });

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
        ).factory('de.cismet.sip-html5-resource-registration.services.TagGroupService',
        ['$resource', 'de.cismet.sip-html5-resource-registration.services.Base64', 'AppConfig',
            function ($resource, Base64, AppConfig) {
                'use strict';

                var tagGroups, lazyLoadTagLists, config, authdata,
                        tagSearches, searchResource, searchTags, getTagListFunction, getTagFunction;


                tagSearches = {
                    'keyword-x-cuahsi': 'X-CUAHSI'
                };

                // cached tag group lists
                tagGroups = [];

                config = AppConfig.searchService;
                authdata = Base64.encode(config.username + ':' + config.password);

                // remote legagy search core search
                // FIXME: limit and offset not implemented in legacy search!
                // currently, limit and offset are appended to the POST query parameter!
                searchResource = $resource(config.host + '/searches/SWITCHON.de.cismet.cids.custom.switchon.search.server.TagsSearch/results',
                        {
                            limit: 100,
                            offset: 0,
                            omitNullValues: true,
                            deduplicate: true
                        }, {
                    search: {
                        method: 'POST',
                        params: {
                        },
                        isArray: false,
                        headers: {
                            'Authorization': 'Basic ' + authdata
                        }
                    }
                });

                searchTags = function (taggroup, tags) {
                    var queryObject, searchResult;

                    if (!tags) {
                        queryObject = {
                            'list': [{'key': 'taggroup', 'value': taggroup}]
                        };
                    } else {
                        queryObject = {
                            'list': [{'key': 'taggroup', 'value': taggroup},
                                {'key': 'tags', 'value': tags}]
                        };
                    }


                    searchResult = searchResource.search(
                            {},
                            queryObject
                            );
                    return searchResult;
                };

                lazyLoadTagLists = function (taggroup, tags) {
                    var intermediateResult, resultTags, i;
                    // cached list does exist
                    if (tagGroups.hasOwnProperty(taggroup)) {
                        resultTags = tagGroups[taggroup];
                        if (!resultTags.$resolved) {
                            console.warn('possible synchonisation problem for taggroup ' + taggroup);
                            resultTags.$promise.then(function () {
                                lazyLoadTagLists(taggroup, tags);
                            });
                        }

                        if (tags) {
                            var tmpTags, tagArray, j;
                            tmpTags = '';
                            tagArray = tags.split(',');
                            j = 0;
                            for (i = 0; i < tagArray.length; ++i) {
                                if (!resultTags.getTagByName(tagArray[i])) {
                                    if (j > 0) {
                                        tmpTags += ',';
                                    }
                                    tmpTags += tagArray[i];
                                    j++;
                                }
                            }

                            // tag list exists but entry not found
                            if (j > 0) {
                                tags = tmpTags;
                            } else {
                                return resultTags;
                            }

                        } else {
                            return resultTags;
                        }
                    } else {
                        resultTags = [];
                        resultTags.getTagByName = function (tagname) {
                            for (var i = 0; i < this.length; i++) {
                                if (this[i].name && this[i].name === tagname) {
                                    return this[i];
                                }
                            }

                            return null;
                        };
                    }

                    resultTags.$resolved = false;
                    intermediateResult = searchTags(taggroup, tags);

                    resultTags.$promise = intermediateResult.$promise.then(function (resource) {
                        for (i = 0; i < resource.$collection.length; i++) {
                            var resultTag = resource.$collection[i];
                            if (!resultTags.getTagByName(resultTag)) {
                                resultTags.push(resource.$collection[i]);
                            }
                        }
                        resultTags.$resolved = true;
                        return resultTags;
                    });
                    tagGroups[taggroup] = resultTags;
                    return tagGroups[taggroup];

                };

                getTagListFunction =
                        function (taggroup, tags) {
                            return lazyLoadTagLists(taggroup, tags);
                        };

                getTagFunction =
                        function (taggroup, tag, callbackFunction) {
                            if (tagGroups.hasOwnProperty(taggroup)) {
                                if (tagGroups[taggroup].$resolved === true) {
                                    return tagGroups[taggroup].getTagByName(tag);
                                } else if (callbackFunction) {
                                    tagGroups[taggroup].$promise.then(function (resolvedTaggroup) {
                                        var resolvedTag = resolvedTaggroup.getTagByName(tag);
                                        callbackFunction(resolvedTag);
                                        return resolvedTag;
                                    });
                                }
                            } else if (callbackFunction) {
                                lazyLoadTagLists(taggroup, tag).$promise.then(function (resolvedTaggroup) {
                                    var resolvedTag = resolvedTaggroup.getTagByName(tag);
                                    callbackFunction(resolvedTag);
                                    return resolvedTag;
                                });

                            }
                            return null;
                        };

                return {
                    getTagList: getTagListFunction,
                    getTag: getTagFunction
                };
            }]
        );

// main app module registration
var app = angular.module(
    'de.cismet.sip-html5-resource-registration',
    [
        'ngAnimate', 'ngSanitize', 'ui.bootstrap', 'leaflet-directive',
        'uiSwitch', 'mgo-angular-wizard','ui.select',
        'de.cismet.sip-html5-resource-registration.controllers',
        'de.cismet.sip-html5-resource-registration.directives',
        'de.cismet.sip-html5-resource-registration.services',
        'de.cismet.sip-html5-resource-registration.factories'  
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
                
            
            // resize the map on enter
            $scope.wizard.enterValidators['Geographic Location'] = function(context){
                if(context.valid === true)
                {
                    if(_this.mode.drawBBox === true) {
                        $scope.message.text='Please specify the extent of the dataset in the geographic space. <br>Use use the map controls to draw a bounding box or a polygon that represents the spatial extent of the dataset.';
                    } else {
                        $scope.message.text='Please specify the extent of the dataset in the geographic space.';
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
            
            
            $scope.tags['accessconditions'] = tagGroupService.getTagList('access conditions', 'CC BY-NC-SA,for research only,no limitations,other');

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
                }
                
                if(context.valid === true) {
                    $scope.wizard.hasError = null;
                }

                return context.valid;
                
            };
        }
    ]
);
angular.module(
    'de.cismet.sip-html5-resource-registration.controllers'
).controller(
    'de.cismet.sip-html5-resource-registration.controllers.masterController',
    [
        '$scope',
        'AppConfig',
        'WizardHandler',
        'de.cismet.sip-html5-resource-registration.services.dataset',
        '$uibModal',
        function (
            $scope,
            AppConfig,
            WizardHandler, 
            dataset,
            $uibModal
        ) {
            'use strict';

            var _this;
            
            _this = this;
            
            // - dataset: the resource meta data, initilaized from a template and changed by the app
            // - tags: list of selectable tags
            // - wizard: the wizard status

            // init Scope Soup -------------------------------------------------

            /**
             * The resource meta data, initilaized from a template and changed by the app
             */
            $scope.dataset=dataset;
            
            /**
             * list of selectable tags. Initilaized by the controllers
             */
            $scope.tags = [];
            
            /**
             * Message text
             */
            $scope.message = {};
            $scope.message.text='<strong>Welcome to the SWITCH-ON tool for the registration of (hydrological) open-data in the <a href=\'http://www.water-switch-on.eu/sip-webclient/sip-beta/\' title=\'Find open data with the SIP BYOD Client\' target=\'_blank\'>SWITCH-ON Spatial Information Platform</a>!</strong> <br>Please provide some general information about the new dataset such as name, description, a (download) link and keywords. ';
            $scope.message.icon='fa-info-circle';
            $scope.message.type = 'success';
            
            $scope.showInfoMessage = function(messageText) {
                $scope.message.text=messageText;
                $scope.message.icon='fa-info-circle';
                $scope.message.type = 'success';
            };
            
            /**
             * Wizard status, etc.
             */
            $scope.wizard = {};
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
                $uibModal.open({
                    animation: true,
                    templateUrl: 'templates/confirmation.html',
                    size: 'lg'
                });
            };
            
            // the wizard framework is not sufficient for user friendly display of states
            //$scope.wzData.wizard.validators = {noVal: function () { return true; }};
            //$scope.wzData.wizard.validators['Select Area'] = function () {
            //    if ($scope.params.area && $scope.params.area.geometry && $scope.params.area.geometry.coordinates) {
            //        return true;
            //    }

                // TODO: proper validation, this should be false
            //    return true;
            //};

            //$scope.wzData.params = {};
            
                     //$scope.getEnabledSteps = function() {
            //  return WizardHandler.wizard('Open Data Registration').getEnabledSteps().length;
            //};
                       
            
            
//            $scope.$watch('wzData.params', function () {
//                // if currentstep is not set the wizard is just about to start
//                if ($scope.wzData.wizard.currentStep && $scope.wzData.wizard.currentStep !== '') {
//                    $scope.wzData.wizard.canProceed =
//                        ($scope.wzData.wizard.validators[$scope.wzData.wizard.currentStep] || $scope.wzData.wizard.validators.noVal)();
//                } else {
//                    // TODO: proper validation, this should be false instead
//                    $scope.wzData.wizard.canProceed = true;
//                }
//            }, true);
            
            
            /*
            
            
            $scope.$watch('data.resultSet.$collection', function (n, o) {
                var i, objs, message, pages, pageNumber;

                if (n && n !== o && n.length > 0) {
                    objs = [];

                    for (i = 0; i < n.length; ++i) {
                        objs.push(n[i].object);
                    }

                }
            });
            
            */
        }
    ]
);
/*jshint sub:true*/

angular.module(
        'de.cismet.sip-html5-resource-registration.controllers'
        ).controller(
        'de.cismet.sip-html5-resource-registration.controllers.odRegistrationController',
        [
            '$scope',
            '$http',
            'AppConfig',
            'WizardHandler',
            'de.cismet.sip-html5-resource-registration.services.dataset',
            'de.cismet.sip-html5-resource-registration.services.TagGroupService',
            'de.cismet.sip-html5-resource-registration.services.searchService',
            // Controller Constructor Function
            function (
                    $scope,
                    $http,
                    AppConfig,
                    WizardHandler,
                    dataset,
                    tagGroupService,
                    searchService
                    ) {
                'use strict';

                var _this, duplicateLink;
                duplicateLink = undefined;

                _this = this;
                _this.dataset = dataset;

                _this.groupBy = function (item) {

                    if (item.name.indexOf(',') > -1) {
                        return item.name.split(',', 1)[0];
                    } else {
                        return item.name.split(' ', 1)[0];
                    }

                };

                _this.checkLink = function (url) {
                    console.log(url);
                    if (url) {
                        var searchResultPromise, searchSuccess, searchError;
                        searchSuccess = function (searchResult) {
                            if (searchResult && searchResult.$collection && searchResult.$collection.length > 0) {
                                duplicateLink = 'This dataset is alredy registered in the SWITCH-ON Spatial Information Platform under the name </strong>"' +
                                        searchResult.$collection[0].name + '"</strong>. Click <a href="http://tl-243.xtr.deltares.nl/byod/#/resource/' +
                                        searchResult.$collection[0].id + '" title="' +
                                        searchResult.$collection[0].name + '" target="_blank">here</a> to view the dataset meta-data.';

                                $scope.message.text = duplicateLink;
                                $scope.message.icon = 'fa-warning';
                                $scope.message.type = 'info';
                                $scope.wizard.hasError = 'datasetContentlocation';
                            } else {
                                //console.log('resource ' + url + ' not in Meta-Data Repository');
                                duplicateLink = undefined;
                            }
                        };

                        searchError = function (data) {
                            console.log('search error: ' + data);
                            duplicateLink = undefined;
                        };

                        searchResultPromise = searchService.search(url).$promise.then(searchSuccess, searchError);
                    }

                    duplicateLink = undefined;
                };

                $scope.tags['function'] = tagGroupService.getTagList('function', 'download,order,information');
                $scope.tags['content type'] = tagGroupService.getTagList('content type');
                $scope.tags['keywords - X-CUAHSI'] = tagGroupService.getTagList('keywords - X-CUAHSI');

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
                    } else if (isInvalidFunction) {
                        $scope.message.text = 'Please select a valid function (e.g. download) of the link.';
                        $scope.message.icon = 'fa-warning';
                        $scope.message.type = 'warning';

                        $scope.wizard.hasError = 'datasetContentlocation';
                        context.valid = false;
                    } else if ($scope.odRegistrationForm.datasetContentlocation.$error.url) {
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
        // Controller Constructor Function
        function (
            $scope,
            AppConfig,
            geoTools,
            dataset,
            leafletData
        ) {
            'use strict';
            var _this, fireResize, wicket, defaultStyle, defaultDrawOptions, noDrawOptions,
                    readSpatialCoverage, writeSpatialCoverage, layerGroup;
            
            _this = this;
            _this.dataset = dataset;
            _this.config = AppConfig;
            
            
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
        
        appConfig.searchService = {};
        appConfig.searchService.username = 'admin@SWITCHON';
        appConfig.searchService.password = 'cismet';
        appConfig.searchService.defautLimit = 10;
        appConfig.searchService.maxLimit = 50;
        appConfig.searchService.host = 'http://localhost:8890';
        //appConfig.searchService.host = 'http://switchon.cismet.de/legacy-rest1';
        //appConfig.searchService.host = 'http://tl-243.xtr.deltares.nl/switchon_server_rest';

        appConfig.mapView = {};
        appConfig.mapView.backgroundLayer = 'http://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
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
        appConfig.objectInfo.resourceXmlUrl = 'http://tl-243.xtr.deltares.nl/csw?request=GetRecordById&service=CSW&version=2.0.2&namespace=xmlns%28csw=http://www.opengis.net/cat/csw/2.0.2%29&resultType=results&outputSchema=http://www.isotc211.org/2005/gmd&outputFormat=application/xml&ElementSetName=full&id=';

        return appConfig;
    }]);
// module initialiser for the services, shall always be named like that so that concat will pick it up first!
// however, the actual service implementations shall be put in their own files
angular.module(
    'de.cismet.sip-html5-resource-registration.services',
    [
        'ngResource'
    ]
);
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



/* global Wkt */

angular.module('de.cismet.sip-html5-resource-registration.services')
        .factory('de.cismet.sip-html5-resource-registration.services.geoTools', 
        ['leafletData',
    function (leafletData) {
            'use strict';
            var wicket, defaultStyle, noDrawOptions, defaultDrawOptions, 
                    readSpatialCoverageFunction, writeSpatialCoverageFunction, 
                    fireResizeFunction;
            
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
            
            
            
            readSpatialCoverageFunction = function(dataset) {
                if(dataset.spatialcoverage && dataset.spatialcoverage.geo_field) { // jshint ignore:line
                    var wktString = dataset.spatialcoverage.geo_field; // jshint ignore:line
                    wicket.read(wktString.substr(wktString.indexOf(';') + 1));

                    var layer = wicket.toObject(defaultStyle);
                    layer.setStyle(defaultStyle);
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
            wicket:wicket,
            defaultStyle:defaultStyle,
            defaultDrawOptions:defaultDrawOptions,
            noDrawOptions:noDrawOptions,
            readSpatialCoverage:readSpatialCoverageFunction,
            writeSpatialCoverage:writeSpatialCoverageFunction,
            fireResize:fireResizeFunction
        };    
	}]);



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

angular.module(
    'de.cismet.sip-html5-resource-registration.services'
).factory('de.cismet.sip-html5-resource-registration.services.TagGroupService',
    ['$resource', 'de.cismet.sip-html5-resource-registration.services.Base64', 'AppConfig',
        function ($resource, Base64, AppConfig) {
            'use strict';

            var tagGroups, lazyLoadTagLists, config, authdata,
                tagSearches, searchResource, searchTags, getTagListFunction;


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

                if(!tags) {
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
                    return tagGroups[taggroup];
                }


                    intermediateResult = searchTags(taggroup, tags);
                    resultTags = [];
                    resultTags.$resolved = false;
                    resultTags.$promise = intermediateResult.$promise.then(function (resource) {
                        for (i = 0; i < resource.$collection.length; i++) {
                            resultTags.push(resource.$collection[i]);
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


            return {
                getTagList: getTagListFunction
            };
        }]
    );

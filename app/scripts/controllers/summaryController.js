/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

/*global angular,L */
/*jshint sub:true*/
/*jshint camelcase: false */

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
            _this.generateDOI = false;
            
            _this.saveJSON = function () {
                    var blob = new Blob([angular.toJson(_this.dataset, true)], { type:'application/json;charset=utf-8;' });			
                    var downloadLink = angular.element('<a></a>');
                    downloadLink.attr('href',window.URL.createObjectURL(blob));
                    downloadLink.attr('download', 'metadata.json');
                    downloadLink[0].click();
            };
            
            
            if(dataset.$deposition && dataset.$deposition !== null) {
                dataset.$deposition.$promise.then(
                        function success(deposition) {
                    if(deposition.metadata.prereserve_doi.doi !== null) {
                        _this.generateDOI = true;     
                    } else {
                        _this.generateDOI = false;     
                    }
                }, function error() {
                    _this.generateDOI = false;
                });
            }

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
            
            $scope.mapData.layers = {
                    baselayers: _this.config.mapView.baselayers
                };

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
                
                if(_this.config.developmentMode === true) {
                    context.valid = true;
                }
                
                return context.valid;
            };
            
            $scope.wizard.exitValidators['Summary'] = function() {
                
                $scope.wizard.hasError = null;
                return true;
            };
        }
    ]
);
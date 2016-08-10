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
                    fireResizeFunction;
            
            defaultStyle = {
                color: '#0000FF', 
                fillOpacity: 0.3, 
                weight: 2, 
                fill: true, 
                fillColor: '#1589FF', 
                riseOnHover: true, 
                clickable: true
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
            defaultStyle:defaultStyle,
            countriesStyle:countriesStyle,
            defaultDrawOptions:defaultDrawOptions,
            noDrawOptions:noDrawOptions,
            readSpatialCoverage:readSpatialCoverageFunction,
            writeSpatialCoverage:writeSpatialCoverageFunction,
            fireResize:fireResizeFunction
        };    
	}]);



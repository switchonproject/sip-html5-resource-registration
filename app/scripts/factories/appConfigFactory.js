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
        //appConfig.cidsRestApi.host = 'http://switchon.cismet.de/legacy-rest1';
        appConfig.cidsRestApi.host = 'http://data.water-switch-on.eu/switchon_server_rest';
        
        appConfig.searchService = {};
        appConfig.searchService.username = 'admin@SWITCHON';
        appConfig.searchService.password = 'cismet';
        appConfig.searchService.defautLimit = 10;
        appConfig.searchService.maxLimit = 50;
        appConfig.searchService.host = appConfig.cidsRestApi.host;
        
        appConfig.mapView = {};
        appConfig.mapView.backgroundLayer = {};
        appConfig.mapView.baselayers = {
                    agtopo: {
                            name: 'ArcGis World Topographic',
                            type: 'agsBase',
                            layer: 'Topographic',
                            visible: false
                    },
                    agimagery: {
                        name: 'ArcGis Imagery',
                        type: 'agsBase',
                        layer: 'Imagery',
                        visible: false
                    },
                    opentopo: {
                        name: 'OpenTopoMap',
                        url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
                        type: 'xyz',
                        visible: false,
                        layerOptions: {
                            subdomains: ['a', 'b', 'c'],
                            attribution: 'Map data © <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors, SRTM | Rendering: © <a href="http://opentopomap.org" target="_blank">OpenTopoMap</a> (CC-BY-SA)'
                        }
                    },
                    osm: {
                        name: 'OpenStreetMap',
                        url: 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                        type: 'xyz',
                        visible: false,
                        layerOptions: {
                            //noWrap: true,
                            //maxZoom: 14,
                            subdomains: ['a', 'b', 'c'],
                            //continuousWorld: true,
                            attribution: 'Map data © <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors'
                        }
                    },
                    thunderforest: {
                        name: 'Thunderforest Landscape',
                        url: 'https://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png?apikey=7feb2dce64d744278b638428463c452f',
                        type: 'xyz',
                        visible: false,
                        layerOptions: {
                            subdomains: ['a', 'b', 'c'],
                            attribution: 'Map data © <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> contributors, | Rendering: © <a href="http://thunderforest.com" target="_blank">Thunderforest</a>'
                        }
                    },
                    streets: {
                            name: 'ArcGis Streets',
                            type: 'agsBase',
                            layer: 'Streets',
                            visible: false,
                            layerOptions: {
                                 attribution: 'Esri'
                            }
                    }
                };
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
        appConfig.byod.baseUrl = 'http://www.water-switch-on.eu/sip-webclient/byod';
        //appConfig.byod.baseUrl = 'http://switchon.cismet.de/sip-snapshot';
        
        appConfig.uploadtool = {};
        appConfig.uploadtool.baseUrl = 'http://dl-ng003.xtr.deltares.nl';
        
        return appConfig;
    }]);
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
).service('AppConfig',
    [function () {
        'use strict'; 
        
        this.developmentMode = false;

        this.cidsRestApi = {};
        this.cidsRestApi.host = this.developmentMode ? 'http://localhost:8890' : 'http://data.water-switch-on.eu/switchon_server_rest';
        
        this.searchService = {};
        // public API ;-)
        this.searchService.username = 'switchon@SWITCHON';
        this.searchService.password = 'switchon';
        this.searchService.defautLimit = 10;
        this.searchService.maxLimit = 50;
        this.searchService.host = this.cidsRestApi.host;
        
        this.mapView = {};
        this.mapView.backgroundLayer = {};
        this.mapView.baselayers = {
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
        this.mapView.countriesLayer = 'https://raw.githubusercontent.com/switchonproject/world.geo.json/master/countries.geo.json';
        this.mapView.home = {};
        this.mapView.home.lat = 49.245166;
        this.mapView.home.lng = 6.936809;
        this.mapView.home.zoom = 4;
        this.mapView.maxBounds = {};
        this.mapView.maxBounds.southWest = [90, -180]; // top left corner of map
        this.mapView.maxBounds.northEast = [-90, 180];  // bottom right corner  
        this.mapView.minZoom = 2;

        this.gui = {};
        // Development Mode (e.g. enable untested features)
        this.gui.dev = false;

        this.objectInfo = {};
        this.objectInfo.resourceJsonUrl = 'http://' +
        this.searchService.username + ':' +
        this.searchService.password + '@' +
        this.searchService.host.replace(/.*?:\/\//g, '');
        this.objectInfo.resourceXmlUrl = 'http://data.water-switch-on.eu/csw?request=GetRecordById&service=CSW&version=2.0.2&namespace=xmlns%28csw=http://www.opengis.net/cat/csw/2.0.2%29&resultType=results&outputSchema=http://www.isotc211.org/2005/gmd&outputFormat=application/xml&ElementSetName=full&id=';

        this.byod = {};
        this.byod.baseUrl = this.developmentMode ? 'http://switchon.cismet.de/sip-snapshot' : 'http://www.water-switch-on.eu/sip-webclient/byod';
        
        this.uploadtool = {};
        this.uploadtool.baseUrl = 'http://dl-ng003.xtr.deltares.nl';
        
        this.zenodo = {};
        this.zenodo.host = this.developmentMode ? 'https://sandbox.zenodo.org' : 'https://zenodo.org';
        // retrieve non-sanbox token from the server!
        this.zenodo.token = this.developmentMode ? 'A7PpJjp9GmcSs17BXjDzxd1BN5CG1dGGZFRxm5CNzEPPeiaB8HQUdZg5I8Mj' : null;
    }]);
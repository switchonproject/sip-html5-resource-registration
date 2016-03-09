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
        appConfig.cidsRestApi.host = 'http://tl-243.xtr.deltares.nl/switchon_server_rest';
        
        appConfig.searchService = {};
        appConfig.searchService.username = 'admin@SWITCHON';
        appConfig.searchService.password = 'cismet';
        appConfig.searchService.defautLimit = 10;
        appConfig.searchService.maxLimit = 50;
        appConfig.searchService.host = appConfig.cidsRestApi.host;
        
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

        appConfig.byod = {};
        appConfig.byod.baseUrl = 'http://tl-243.xtr.deltares.nl/byod';
        //appConfig.byod.baseUrl = 'http://switchon.cismet.de/sip-snapshot';
        
        appConfig.uploadtool = {};
        appConfig.uploadtool.baseUrl = 'http://dl-ng003.xtr.deltares.nl';
        
        return appConfig;
    }]);
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
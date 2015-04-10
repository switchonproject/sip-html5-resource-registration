angular.module(
    'de.cismet.sip-html5-resource-registration.controllers'
).controller(
    'de.cismet.sip-html5-resource-registration.controllers.MyDirectiveController',
    [
        '$scope',
        'de.cismet.sip-html5-resource-registration.services.MyService',
        function ($scope, MyService) {
            'use strict';
            
            $scope.description = 'The \'scripts/controllers\' folder contains the actual controllers that will automagically be processed during build.';
            $scope.info = MyService.tellMe();
        }
    ]
);

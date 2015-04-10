angular.module(
    'de.cismet.sip-html5-resource-registration.directives'
).directive('myDirective',
    [
        function () {
            'use strict';

            return {
                restrict: 'E',
                templateUrl: 'templates/my-directive.html',
                scope: {},
                controller: 'de.cismet.sip-html5-resource-registration.controllers.MyDirectiveController'
            };
        }
    ]);

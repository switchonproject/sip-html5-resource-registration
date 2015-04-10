// main app module registration
angular.module(
    'de.cismet.sip-html5-resource-registration',
    [
        'de.cismet.sip-html5-resource-registration.controllers',
        'de.cismet.sip-html5-resource-registration.directives',
        'de.cismet.sip-html5-resource-registration.services'
    ]
);


// module initialiser for the controllers, shall always be named like that so that concat will pick it up first!
// however, the actual controller implementations shall be put in their own files
angular.module(
    'de.cismet.sip-html5-resource-registration.controllers',
    [
        'de.cismet.sip-html5-resource-registration.services'
    ]
);
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

// module initialiser for the directives, shall always be named like that so that concat will pick it up first!
// however, the actual directives implementations shall be put in their own files
angular.module(
    'de.cismet.sip-html5-resource-registration.directives',
    [
    ]
);
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

// module initialiser for the services, shall always be named like that so that concat will pick it up first!
// however, the actual service implementations shall be put in their own files
angular.module(
    'de.cismet.sip-html5-resource-registration.services',
    [
    ]
);
angular.module(
    'de.cismet.sip-html5-resource-registration.services'
).factory('de.cismet.sip-html5-resource-registration.services.MyService',
    [
        function () {
            'use strict';

            return {
                tellMe: function () { 
                    return 'The \'scripts/services\' folder contains the actual services that will automagically be processed during build.'; 
                }
            };
        }
    ]);

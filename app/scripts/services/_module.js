// module initialiser for the services, shall always be named like that so that concat will pick it up first!
// however, the actual service implementations shall be put in their own files
angular.module(
    'de.cismet.sip-html5-resource-registration.services',
    [
        'ngResource'
    ]
);
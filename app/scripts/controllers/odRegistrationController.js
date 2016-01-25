angular.module(
    'de.cismet.sip-html5-resource-registration.controllers'
).controller(
    'de.cismet.sip-html5-resource-registration.controllers.odRegistrationController',
    [
        '$scope',
        '$http',
        'AppConfig',
        'WizardHandler',
        'de.cismet.sip-html5-resource-registration.services.dataset',
        'de.cismet.sip-html5-resource-registration.services.TagGroupService',
        // Controller Constructor Function
        function (
            $scope,
            $http,
            AppConfig,
            WizardHandler,
            dataset,
            tagGroupService
        ) {
            'use strict';

            var _this = this;
            
            _this.dataset = dataset;
            
            $scope.wizard.enterValidators[$scope.wzTitle] = function(){
                return true;
            };
            
            
            $scope.wizard.exitValidators[$scope.wzTitle] = function(){
                return true;
            };
            
            
            $scope.tags['function'] = $http.get('data/tags.json')
            .then(function(res){
               $scope.tags['function'] = res.data;                
             });

        }
    ]
);
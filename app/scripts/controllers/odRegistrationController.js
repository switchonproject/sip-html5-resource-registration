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
            
            /**
             * ui-select groupBy furnction for grouping selectable items by
             * name.
             * 
             * @param {String} selected item
             * @returns {String} group of the item
             */
            _this.groupBy = function(item) {
                
                if(item.name.indexOf(',') > -1) {
                    return item.name.split(',', 1)[0]; 
                } else {
                    return item.name.split(' ', 1)[0]; 
                }

            };
            
            $scope.tags['function'] = tagGroupService.getTagList('function', 'download,order,information');
            $scope.tags['content type'] = tagGroupService.getTagList('content type');
            $scope.tags['keywords - X-CUAHSI'] = tagGroupService.getTagList('keywords - X-CUAHSI');

            $scope.wizard.enterValidators[$scope.wzTitle] = function(){
                return true;
            };
            
            
            $scope.wizard.exitValidators[$scope.wzTitle] = function(){
                return true;
            };
        }
    ]
);
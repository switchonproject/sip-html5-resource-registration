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
            
            _this.checkLink = function(url) {
              // TODO: check link
              console.log('checkLink not yet implemented: ' + url);
            };
            
            $scope.tags['function'] = tagGroupService.getTagList('function', 'download,order,information');
            $scope.tags['content type'] = tagGroupService.getTagList('content type');
            $scope.tags['keywords - X-CUAHSI'] = tagGroupService.getTagList('keywords - X-CUAHSI');

            $scope.wizard.enterValidators['Dataset Description'] = function(){
                return true;
            };

            $scope.wizard.exitValidators['Dataset Description'] = function(){
                
                // NAME
                if(!dataset.name) {
                    $scope.message.text='Please enter the name / title of the dataset.';
                    $scope.message.icon='fa-warning';
                    $scope.message.type = 'warning';
                    
                    $scope.wizard.hasError = 'datasetName';
                    return false;
                }
                
                
                // CONTENT LOCATION                
                if($scope.odRegistrationForm.datasetContentlocation.$error.url) {
                    $scope.message.text='The link to the dataset you have provided is not a valid <a href=\'https://en.wikipedia.org/wiki/Uniform_Resource_Locator#Syntax\' target=\'_blank\' title=\'Uniform Resource Locator\'>URL</a> .' ;
                    $scope.message.icon='fa-warning';
                    $scope.message.type = 'warning';
                    
                    $scope.wizard.hasError = 'datasetContentlocation';
                    return false;
                }
                
                if(!dataset.representation[0].contentlocation) {
                    $scope.message.text='Please provide link to the dataset.';
                    $scope.message.icon='fa-warning';
                    $scope.message.type = 'warning';
                    
                    $scope.wizard.hasError = 'datasetContentlocation';
                    return false;
                }

                // DESCRIPTION
                if(!dataset.description) {
                    $scope.message.text='Please provide a description of the dataset.';
                    $scope.message.icon='fa-warning';
                    $scope.message.type = 'warning';
                    
                    $scope.wizard.hasError = 'datasetDescription';
                    return false;
                }

                if(!_this.dataset.tags || _this.dataset.tags.length === 0) {
                    $scope.message.text='Please assign at least one keyword to the Dataset.';
                    $scope.message.icon='fa-warning';
                    $scope.message.type = 'warning';
                    
                    $scope.wizard.hasError = 'datasetTags';
                    return false;
                }
                
                $scope.wizard.hasError = null;
                return true;
                
            };
        }
    ]
);
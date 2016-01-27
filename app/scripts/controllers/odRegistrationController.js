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

            $scope.wizard.enterValidators['Dataset Description'] = function(){
                return true;
            };

            $scope.wizard.exitValidators['Dataset Description'] = function(){

                if(!dataset.name) {
                    $scope.message.text='Please provide the name of the dataset';
                    $scope.message.icon='glyphicon-warning-sign';
                    $scope.message.type = 'warning';
                    
                    $scope.wizard.hasError = 'dataset-name';
                    return false;
                }
                
                if(!dataset.description) {
                    $scope.message.text='Please provide a description of the dataset';
                    $scope.message.icon='glyphicon-warning-sign';
                    $scope.message.type = 'warning';
                    
                    $scope.wizard.hasError = 'dataset-description';
                    return false;
                }
                
                console.log($scope.odRegistrationForm.datasetRepresentationContentlocation.$invalid);
                console.log($scope.odRegistrationForm.datasetRepresentationContentlocation.$error);
                
                if(!dataset.representation[0].contentlocation) {
                    $scope.message.text='Please provide a description of the dataset';
                    $scope.message.icon='glyphicon-warning-sign';
                    $scope.message.type = 'warning';
                    
                    $scope.wizard.hasError = 'dataset-description';
                    return false;
                }
                
                if(!_this.dataset.tags || _this.dataset.tags.length === 0) {
                    $scope.message.text='Please assign at least one keyword to the Dataset.';
                    $scope.message.icon='glyphicon-warning-sign';
                    $scope.message.type = 'warning';
                    
                    $scope.wizard.hasError = 'dataset-tags';
                    return false;
                }
                
                $scope.wizard.hasError = null;
                return true;
                
            };
        }
    ]
);
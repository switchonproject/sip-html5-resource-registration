/*jshint sub:true*/

angular.module(
    'de.cismet.sip-html5-resource-registration.controllers'
).controller(
    'de.cismet.sip-html5-resource-registration.controllers.licenseController',
    [
        '$scope',
        'de.cismet.sip-html5-resource-registration.services.dataset',
        'de.cismet.sip-html5-resource-registration.services.TagGroupService',
        // Controller Constructor Function
        function (
            $scope,
            dataset,
            tagGroupService
        ) {
            'use strict';
            var _this = this;
            _this.dataset = dataset;
            
            
            $scope.tags['accessconditions'] = tagGroupService.getTagList('access conditions', 'CC BY-NC-SA,for research only,no limitations,other');

            // validation functions
            $scope.wizard.enterValidators['License and Conditions'] = function(){
                
                if(!$scope.wizard.hasError) {
                    $scope.message.text='Please select a predefined license for regulating the conditions for access and use of the resource and provide a brief statement or URL to the license which applies to the usage of the dataset. This statement should provide additional information.';
                    $scope.message.icon='fa-info-circle';
                    $scope.message.type = 'success';
                }
                
                return true;
            };

            $scope.wizard.exitValidators['License and Conditions'] = function(){
                
                // ACCESS CONDITIONS
                var isInvalidAccessconditions = $scope.tags['accessconditions'].every(function(element) {
                    if (_this.dataset.accessconditions.name && 
                            (element.name === _this.dataset.accessconditions.name)) {
                        _this.dataset.accessconditions = element;
                        return false;
                    } else {
                        return true;
                    } 
                });
                
                if(isInvalidAccessconditions) {
                    $scope.message.text='Please select a valid access condition (e.g. no limitations).';
                    $scope.message.icon='fa-warning';
                    $scope.message.type = 'warning';
                    
                    $scope.wizard.hasError = 'datasetAccessconditions';
                    return false;
                }
                
                // NAME
                if($scope.licenseForm.datasetLicensestatement.$error.required) {
                    $scope.message.text='Please provide a description of the license of type <i>other</i> or select another license from the list.';
                    $scope.message.icon='fa-warning';
                    $scope.message.type='warning';
                    
                    $scope.wizard.hasError = 'datasetLicensestatement';
                    return false;
                }

                $scope.wizard.hasError = null;
                return true;
                
            };
        }
    ]
);
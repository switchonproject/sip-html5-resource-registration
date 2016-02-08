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
            
            // load taglist
            $scope.tags['accessconditions'] = tagGroupService.getTagList('access conditions', 'CC BY-NC-SA,for research only,no limitations,other');

            // set default values
            _this.dataset.representation[0].function = tagGroupService.getTag('access conditions', 'CC BY-NC-SA',
                    function (tag) {
                        _this.dataset.accessconditions = tag;
                    });
                    
            // validation functions
            $scope.wizard.enterValidators['License and Conditions'] = function(context){
                if(context.valid === true){
                    $scope.message.text='Please select a predefined license for regulating the conditions for access and use of the resource and provide a brief statement or URL to the license which applies to the usage of the dataset. This statement should provide additional information.';
                    $scope.message.icon='fa-info-circle';
                    $scope.message.type = 'success';
                }
                
                return context.valid;
            };

            $scope.wizard.exitValidators['License and Conditions'] = function(context){
                context.valid = true;
                // ACCESS CONDITIONS
                var isInvalidAccessconditions = $scope.tags['accessconditions'].every(function(element) {
                    if (_this.dataset.accessconditions && _this.dataset.accessconditions.name && 
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
                    context.valid = false;
                } else if($scope.licenseForm.datasetLicensestatement.$error.required) {
                    // NAME
                    $scope.message.text='Please provide a description of the license of type <i>other</i> or select another license from the list.';
                    $scope.message.icon='fa-warning';
                    $scope.message.type='warning';
                    
                    $scope.wizard.hasError = 'datasetLicensestatement';
                    context.valid =  false;
                }
                
                if(context.valid === true) {
                    $scope.wizard.hasError = null;
                }

                return context.valid;
                
            };
        }
    ]
);
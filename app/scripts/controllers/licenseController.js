/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

/*jshint sub:true*/
/*jshint camelcase: false */

angular.module(
    'de.cismet.sip-html5-resource-registration.controllers'
).controller(
    'de.cismet.sip-html5-resource-registration.controllers.licenseController',
    [
        '$scope',
        'AppConfig',
        'de.cismet.sip-html5-resource-registration.services.dataset',
        'de.cismet.sip-html5-resource-registration.services.TagGroupService',
        // Controller Constructor Function
        function (
            $scope,
            AppConfig,
            dataset,
            tagGroupService
        ) {
            'use strict';
            var _this = this;
            _this.dataset = dataset;
            _this.config = AppConfig;
            _this.generateDOI = false;
            if(dataset.$deposition && dataset.$deposition !== null) {
                dataset.$deposition.$promise.then(
                        function success(deposition) {
                    if(deposition.metadata.prereserve_doi.doi !== null) {
                        _this.generateDOI = true;     
                    } else {
                        _this.generateDOI = false;     
                    }
                }, function error() {
                    _this.generateDOI = false;
                });
            }
            
            // load taglist
            $scope.tags['accessconditions'] = tagGroupService.getTagList('access conditions', 'Creative Commons (CC BY),Creative Commons (CC BY-NC),Creative Commons (CC BY-NC-ND),Creative Commons (CC BY-NC-SA),Creative Commons (CC BY-ND),Creative Commons (CC BY-SA),for research only,no limitations,other');
                    
            // validation functions
            $scope.wizard.enterValidators['License and Conditions'] = function(context) {
                
                if(context.valid === true){
                    $scope.message.text='Please select a predefined license for regulating the conditions for access and use of the dataset and / or provide a brief statement or URL to the license which applies to the usage of the dataset. This statement should provide additional information.';
                    $scope.message.icon='fa-info-circle';
                    $scope.message.type = 'success';
                }
                
                if(_this.config.developmentMode === true) {
                    context.valid = true;
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
                } else if (dataset.licensestatement && dataset.licensestatement !== null && dataset.licensestatement.length > 0 && dataset.licensestatement.length < 6) {
                    $scope.message.text = 'Statement or URL to the license which applies to the usage of the dataset is too short.';
                    $scope.message.icon = 'fa-warning';
                    $scope.message.type = 'warning';

                    $scope.wizard.hasError = 'datasetLicensestatement';
                    context.valid = false;
                } else if (dataset.contact.name && dataset.contact.name !== null && dataset.contact.name.length > 0 && dataset.contact.name.length < 3) {
                    $scope.message.text = 'Name of the contact person is too short.';
                    $scope.message.icon = 'fa-warning';
                    $scope.message.type = 'warning';

                    $scope.wizard.hasError = 'datasetContactperson';
                    context.valid = false;
                } 
                else if (dataset.contact.organisation && dataset.contact.organisation !== null && dataset.contact.organisation.length > 0 && dataset.contact.organisation.length < 3) {
                    $scope.message.text = 'Name of the organisation is too short.';
                    $scope.message.icon = 'fa-warning';
                    $scope.message.type = 'warning';

                    $scope.wizard.hasError = 'datasetOrganisation';
                    context.valid = false;
                } 
                else if (dataset.contact.description && dataset.contact.description !== null && dataset.contact.description.length > 0 && dataset.contact.description.length < 6) {
                    $scope.message.text = 'Optional citation information is too short.';
                    $scope.message.icon = 'fa-warning';
                    $scope.message.type = 'warning';

                    $scope.wizard.hasError = 'datasetCitation';
                    context.valid = false;
                } 
                else if ($scope.licenseForm.datasetOrganisation.$error.required) {
                    // CONTENT LOCATION       
                    $scope.message.text = 'Please provide a name of the organisation responsible for the establishment, management, maintenance and distribution of dataset or publication to be associated with the DOI.';
                    $scope.message.icon = 'fa-warning';
                    $scope.message.type = 'warning';

                    $scope.wizard.hasError = 'datasetOrganisation';
                    context.valid = false;
                } else if ($scope.licenseForm.datasetContactperson.$error.required) {
                    // CONTENT LOCATION       
                    $scope.message.text = 'Please provide a name of the contact person (Family name, Given name) responsible for the establishment, management, maintenance and distribution of dataset or publication to be associated with the DOI.';
                    $scope.message.icon = 'fa-warning';
                    $scope.message.type = 'warning';

                    $scope.wizard.hasError = 'datasetContactperson';
                    context.valid = false;
                } else if ($scope.licenseForm.datasetContactemail.$error.email) {
                    // CONTENT LOCATION       
                    $scope.message.text = 'The email address of the contact person is not a valid.';
                    $scope.message.icon = 'fa-warning';
                    $scope.message.type = 'warning';

                    $scope.wizard.hasError = 'datasetContactperson';
                    context.valid = false;
                } else if ($scope.licenseForm.datasetOrganisationurl.$error.url) {
                    // CONTENT LOCATION       
                    $scope.message.text = 'The website url of the organisation is not a valid <a href=\'https://en.wikipedia.org/wiki/Uniform_Resource_Locator#Syntax\' target=\'_blank\' title=\'Uniform Resource Locator\'>URL</a>.';
                    $scope.message.icon = 'fa-warning';
                    $scope.message.type = 'warning';

                    $scope.wizard.hasError = 'datasetOrganisation';
                    context.valid = false;
                } else if (dataset.metadata[1].description && dataset.metadata[1].description !== null && dataset.metadata[1].description.length > 0 && dataset.metadata[1].description.length < 10) {
                    $scope.message.text = 'Optional data lineage / data provenance information is too short.';
                    $scope.message.icon = 'fa-warning';
                    $scope.message.type = 'warning';

                    $scope.wizard.hasError = 'datasetLineage';
                    context.valid = false;
                }

                if(context.valid === true) {
                    $scope.wizard.hasError = null;
                }
                
                if(_this.config.developmentMode === true) {
                    context.valid = true;
                }

                return context.valid;
            };
        }
    ]
);
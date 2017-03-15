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
            
            _this.generateDoi = function () {
                //console.log(url);
                
                /*if (url) {
                    var searchResultPromise, searchSuccess, searchError;
                    searchSuccess = function (searchResult) {
                        if (searchResult && searchResult.$collection && searchResult.$collection.length > 0) {
                            duplicateLink = 'This dataset is already registered in the SWITCH-ON Spatial Information Platform under the name </strong>"' +
                                    searchResult.$collection[0].name + '"</strong>. Click <a href="'+AppConfig.byod.baseUrl+'/#/resource/' +
                                    searchResult.$collection[0].id + '" title="' +
                                    searchResult.$collection[0].name + '" target="_blank">here</a> to view the dataset meta-data.';

                            $scope.message.text = duplicateLink;
                            $scope.message.icon = 'fa-warning';
                            $scope.message.type = 'info';
                            $scope.wizard.hasError = 'datasetContentlocation';
                        } else {
                            // reset the warning!
                            if($scope.wizard.hasError === 'datasetContentlocation') {
                                $scope.wizard.hasError = null;
                            }

                            //console.log('resource ' + url + ' not in Meta-Data Repository');
                            duplicateLink = undefined;
                        }
                    };

                    searchError = function (data) {
                        console.error('search error: ' + data);
                        duplicateLink = undefined;
                    };

                    searchResultPromise = searchService.search(url).$promise.then(searchSuccess, searchError);
                }

                duplicateLink = undefined;*/
            };
            
            // load taglist
            $scope.tags['accessconditions'] = tagGroupService.getTagList('access conditions', 'Creative Commons (CC BY),Creative Commons (CC BY-NC),Creative Commons (CC BY-NC-ND),Creative Commons (CC BY-NC-SA),Creative Commons (CC BY-ND),Creative Commons (CC BY-SA),for research only,no limitations,other');
                    
            // validation functions
            $scope.wizard.enterValidators['License and Conditions'] = function(context) {
                
                if(_this.config.developmentMode === true) {
                        return true;
                }
                
                if(context.valid === true){
                    $scope.message.text='Please select a predefined license for regulating the conditions for access and use of the dataset and / or provide a brief statement or URL to the license which applies to the usage of the dataset. This statement should provide additional information.';
                    $scope.message.icon='fa-info-circle';
                    $scope.message.type = 'success';
                }
                
                return context.valid;
            };

            $scope.wizard.exitValidators['License and Conditions'] = function(context){
                context.valid = true;
                
                if(_this.config.developmentMode === true) {
                        return true;
                }
                
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
                }
                
                if(context.valid === true) {
                    $scope.wizard.hasError = null;
                }

                return context.valid;
                
            };
        }
    ]
);
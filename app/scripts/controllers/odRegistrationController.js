/*jshint sub:true*/

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
              //var msg = 'This dataset is alredy registered in the SWITCH-ON Spatial Information Platform under the name *"Corine Land Cover 1990 - 2000 changes formation code in changed areas (change 1990-2000) in 100m resolution "*. Please click [here] to view the dataset meta-data.';
            };
            
            $scope.tags['function'] = tagGroupService.getTagList('function', 'download,order,information');
            $scope.tags['content type'] = tagGroupService.getTagList('content type');
            $scope.tags['keywords - X-CUAHSI'] = tagGroupService.getTagList('keywords - X-CUAHSI');

            $scope.wizard.enterValidators['Dataset Description'] = function(context) {
                if(context.valid === true) {
                    $scope.message.text='Please provide some general information about the new dataset such as name, description, a (download) link and keywords.';
                    $scope.message.icon='fa-info-circle';
                    $scope.message.type = 'success';
                }

                return context.valid;
            };

            $scope.wizard.exitValidators['Dataset Description'] = function(context){
                context.valid = true;
                
                // CONTENT TYPE
                var isInvalidContenttype = $scope.tags['content type'].every(function(element) {
                    if (_this.dataset.representation[0] && _this.dataset.representation[0].contenttype &&
                            (element.name === _this.dataset.representation[0].contenttype.name)) {
                        _this.dataset.representation[0].contenttype = element;
                        return false;
                    }

                    return true;
                });
                
                // FUNCTION
                var isInvalidFunction = $scope.tags['function'].every(function(element) {
                    if (_this.dataset.representation[0] && _this.dataset.representation[0].function &&
                            (element.name === _this.dataset.representation[0].function.name)) {
                        _this.dataset.representation[0].function = element;
                        return false;
                    } else {
                        return true;
                    } 
                });

                // NAME
                if(!dataset.name) {
                    $scope.message.text='Please enter the name / title of the dataset.';
                    $scope.message.icon='fa-warning';
                    $scope.message.type = 'warning';
                    
                    $scope.wizard.hasError = 'datasetName';
                    context.valid = false;
                } else if(isInvalidFunction) {
                    $scope.message.text='Please select a valid function (e.g. download) of the link.';
                    $scope.message.icon='fa-warning';
                    $scope.message.type = 'warning';
                    
                    $scope.wizard.hasError = 'datasetContentlocation';
                    context.valid = false;
                } else if($scope.odRegistrationForm.datasetContentlocation.$error.url) {
                    // CONTENT LOCATION       
                    $scope.message.text='The link to the dataset you have provided is not a valid <a href=\'https://en.wikipedia.org/wiki/Uniform_Resource_Locator#Syntax\' target=\'_blank\' title=\'Uniform Resource Locator\'>URL</a> .' ;
                    $scope.message.icon='fa-warning';
                    $scope.message.type = 'warning';
                    
                    $scope.wizard.hasError = 'datasetContentlocation';
                    context.valid = false;
                } else if(!dataset.representation[0].contentlocation) {
                    $scope.message.text='Please provide link to the dataset.';
                    $scope.message.icon='fa-warning';
                    $scope.message.type = 'warning';
                    
                    $scope.wizard.hasError = 'datasetContentlocation';
                    context.valid = false;
                } else if(isInvalidContenttype) {
                    $scope.message.text='Please select a valid content type (e.g. ESRI Shapefile) of the link.';
                    $scope.message.icon='fa-warning';
                    $scope.message.type = 'warning';
                    
                    $scope.wizard.hasError = 'datasetContentlocation';
                    context.valid = false;
                } else if(!dataset.description) {
                    // DESCRIPTION
                    $scope.message.text='Please provide a description of the dataset.';
                    $scope.message.icon='fa-warning';
                    $scope.message.type = 'warning';
                    
                    $scope.wizard.hasError = 'datasetDescription';
                    context.valid = false;
                } else if(!_this.dataset.tags || _this.dataset.tags.length === 0) {
                    $scope.message.text='Please assign at least one keyword to the Dataset.';
                    $scope.message.icon='fa-warning';
                    $scope.message.type = 'warning';
                    
                    $scope.wizard.hasError = 'datasetTags';
                    context.valid = false;
                }
                
                if(context.valid === true) {
                    $scope.wizard.hasError = null;
                }
                // no error? -> reset
                
                return context.valid; 
            };
        }
    ]
);
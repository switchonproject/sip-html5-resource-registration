angular.module(
    'de.cismet.sip-html5-resource-registration.controllers'
).controller(
    'de.cismet.sip-html5-resource-registration.controllers.masterController',
    [
        '$scope',
        'AppConfig',
        'WizardHandler',
        'de.cismet.sip-html5-resource-registration.services.dataset',
        'de.cismet.sip-html5-resource-registration.services.TagGroupService',
        function (
            $scope,
            AppConfig,
            WizardHandler, 
            dataset,
            tagGroupService
        ) {
            'use strict';

            
            // - dataset: the resource meta data, initilaized from a template and changed by the app
            // - tags: list of selectable tags
            // - wizard: the wizard status

            // init Scope Soup -------------------------------------------------

            /**
             * The resource meta data, initilaized from a template and changed by the app
             */
            $scope.dataset=dataset;
            
            /**
             * list of selectable tags. Initilaized by the controllers
             */
            $scope.tags = [];
            
            /**
             * Message text
             */
            $scope.message = {};
            $scope.message.text='Welcome to the SWITCH-ON Spatial Information Platform!Welcome to the SWITCH-ON Spatial Information Platform!Welcome to the SWITCH-ON Spatial Information Platform!Welcome to the SWITCH-ON Spatial Information Platform!Welcome to the SWITCH-ON Spatial Information Platform!Welcome to the SWITCH-ON Spatial Information Platform!Welcome to the SWITCH-ON Spatial Information Platform!Welcome to the SWITCH-ON Spatial Information Platform!Welcome to the SWITCH-ON Spatial Information Platform!Welcome to the SWITCH-ON Spatial Information Platform!Welcome to the SWITCH-ON Spatial Information Platform!Welcome to the SWITCH-ON Spatial Information Platform!';
            $scope.message.icon='glyphicon-info-sign';
            $scope.message.type = 'success';
            
            /**
             * Wizard status, etc.
             */
            $scope.wizard = {};
            $scope.wizard.enterValidators = [];
            $scope.wizard.exitValidators = [];
            $scope.wizard.currentStep = '';
            $scope.wizard.canProceed = true;
            $scope.wizard.canGoBack = false;
            $scope.wizard.proceedButtonText = 'Next';
            $scope.wizard.isFinishStep = function () {
                return $scope.wizard.currentStep === 'Summary';
            };
            $scope.wizard.isFirstStep = function () {
                return $scope.wizard.currentStep === 'Dataset Description';
            };
            
            $scope.$watch('wizard.currentStep', function (n) {
                if (n) {
                    if ($scope.wizard.isFinishStep()) {
                        $scope.wizard.proceedButtonText = 'Finish';
                    } else {
                        $scope.wizard.proceedButtonText = 'Next';
                    }
                    
                    $scope.wizard.canGoBack = !$scope.wizard.isFirstStep();

                } else {
                    $scope.wizard.proceedButtonText = 'Next';
                }
            });
            
            //$scope.functions = tagGroupService.getTagList('function');
            
            //$scope.wzData.wizard.finish = function () {
            //    $scope.params.run = true;
            //    $scope.$hide();
            //};

            // the wizard framework is not sufficient for user friendly display of states
            //$scope.wzData.wizard.validators = {noVal: function () { return true; }};
            //$scope.wzData.wizard.validators['Select Area'] = function () {
            //    if ($scope.params.area && $scope.params.area.geometry && $scope.params.area.geometry.coordinates) {
            //        return true;
            //    }

                // TODO: proper validation, this should be false
            //    return true;
            //};

            //$scope.wzData.params = {};
            
                     //$scope.getEnabledSteps = function() {
            //  return WizardHandler.wizard('Open Data Registration').getEnabledSteps().length;
            //};
                       
            
            
//            $scope.$watch('wzData.params', function () {
//                // if currentstep is not set the wizard is just about to start
//                if ($scope.wzData.wizard.currentStep && $scope.wzData.wizard.currentStep !== '') {
//                    $scope.wzData.wizard.canProceed =
//                        ($scope.wzData.wizard.validators[$scope.wzData.wizard.currentStep] || $scope.wzData.wizard.validators.noVal)();
//                } else {
//                    // TODO: proper validation, this should be false instead
//                    $scope.wzData.wizard.canProceed = true;
//                }
//            }, true);
            
            
            /*
            
            
            $scope.$watch('data.resultSet.$collection', function (n, o) {
                var i, objs, message, pages, pageNumber;

                if (n && n !== o && n.length > 0) {
                    objs = [];

                    for (i = 0; i < n.length; ++i) {
                        objs.push(n[i].object);
                    }

                }
            });
            
            */
        }
    ]
);
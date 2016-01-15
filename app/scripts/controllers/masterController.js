angular.module(
    'de.cismet.sip-html5-resource-registration.controllers'
).controller(
    'de.cismet.sip-html5-resource-registration.controllers.masterController',
    [
        '$scope',
        'AppConfig',
        'WizardHandler',
        function (
            $scope,
            AppConfig,
            WizardHandler 
        ) {
            'use strict';


            //$scope.config = AppConfig;

            $scope.wzData = {};
            $scope.wzData.message = {};
            $scope.wzData.message.text='Welcome to the SWITCH-ON Spatial Information Platform!Welcome to the SWITCH-ON Spatial Information Platform!Welcome to the SWITCH-ON Spatial Information Platform!Welcome to the SWITCH-ON Spatial Information Platform!Welcome to the SWITCH-ON Spatial Information Platform!Welcome to the SWITCH-ON Spatial Information Platform!Welcome to the SWITCH-ON Spatial Information Platform!Welcome to the SWITCH-ON Spatial Information Platform!Welcome to the SWITCH-ON Spatial Information Platform!Welcome to the SWITCH-ON Spatial Information Platform!Welcome to the SWITCH-ON Spatial Information Platform!Welcome to the SWITCH-ON Spatial Information Platform!';
            $scope.wzData.message.icon='glyphicon-info-sign'
            $scope.wzData.message.type = 'success';
            
            
            $scope.getEnabledSteps = function() {
              return WizardHandler.wizard('Open Data Registration').getEnabledSteps().length;
            };
            
            $scope.wzData.wizard = {};
            $scope.wzData.wizard.currentStep = '';
            // TODO: proper validation, this should be false
            $scope.wzData.wizard.canProceed = true;
            $scope.wzData.wizard.canGoBack = false;
            
            $scope.wzData.wizard.isFinishStep = function () {
                return $scope.wzData.wizard.currentStep === 'Summary';
            };
            
            $scope.wzData.wizard.isFirstStep = function () {
                return $scope.wzData.wizard.currentStep === 'Dataset Description';
            };
            
            $scope.wzData.wizard.finish = function () {
                $scope.params.run = true;
                $scope.$hide();
            };

            // the wizard framework is not sufficient for user friendly display of states
            $scope.wzData.wizard.validators = {noVal: function () { return true; }};
            $scope.wzData.wizard.validators['Select Area'] = function () {
                if ($scope.params.area && $scope.params.area.geometry && $scope.params.area.geometry.coordinates) {
                    return true;
                }

                // TODO: proper validation, this should be false
                return true;
            };
            
            $scope.wzData.wizard.exitValidation = function(context){
                $scope.wzData.message.text="NEXT!";
                return true;
            };

            $scope.wzData.wizard.proceedButtonText = 'Next';
            $scope.wzData.params = {};
            
            $scope.wzData.map = {};
            $scope.wzData.map.center = AppConfig.mapView.home;
            $scope.wzData.map.defaults = {
                    tileLayer: AppConfig.mapView.backgroundLayer,
                    //tileLayerOptions: {noWrap: true},
                    //maxZoom: 14,
                    minZoom: AppConfig.minZoom,
                    path: {
                        weight: 10,
                        color: '#800000',
                        opacity: 1
                    }
                }
            
            
            
           
            $scope.$watch('wzData.wizard.currentStep', function (n) {
                if (n) {
                    if ($scope.wzData.wizard.isFinishStep()) {
                        $scope.wzData.wizard.proceedButtonText = 'Finish';
                    } else {
                        $scope.wzData.wizard.proceedButtonText = 'Next';
                    }
                    
                    $scope.wzData.wizard.canGoBack = !$scope.wzData.wizard.isFirstStep();

/*
                    if (n === 'Parameterize Earthquake') {
                        // this has to be done as the map won't render properly as it is loaded when not displayed yet
                        leafletData.getMap('eqParamMap').then(function (map) {
                            map.invalidateSize(false);
                        });
                    }
 */                   
                } else {
                    $scope.wzData.wizard.proceedButtonText = 'Next';
                }
            });
            
            $scope.$watch('wzData.params', function () {
                // if currentstep is not set the wizard is just about to start
                if ($scope.wzData.wizard.currentStep && $scope.wzData.wizard.currentStep !== '') {
                    $scope.wzData.wizard.canProceed =
                        ($scope.wzData.wizard.validators[$scope.wzData.wizard.currentStep] || $scope.wzData.wizard.validators.noVal)();
                } else {
                    // TODO: proper validation, this should be false instead
                    $scope.wzData.wizard.canProceed = true;
                }
            }, true);
            
            
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
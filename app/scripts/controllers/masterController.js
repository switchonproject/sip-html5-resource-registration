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
            
            
            
            $scope.person = {};
            
            
  $scope.people = [
    { name: 'Adam',      email: 'adam@email.com',      age: 12, country: 'United States' },
    { name: 'Amalie',    email: 'amalie@email.com',    age: 12, country: 'Argentina' },
    { name: 'Estefanía', email: 'estefania@email.com', age: 21, country: 'Argentina' },
    { name: 'Adrian',    email: 'adrian@email.com',    age: 21, country: 'Ecuador' },
    { name: 'Wladimir',  email: 'wladimir@email.com',  age: 30, country: 'Ecuador' },
    { name: 'Samantha',  email: 'samantha@email.com',  age: 30, country: 'United States' },
    { name: 'Nicole',    email: 'nicole@email.com',    age: 43, country: 'Colombia' },
    { name: 'Natasha',   email: 'natasha@email.com',   age: 54, country: 'Ecuador' },
    { name: 'Michael',   email: 'michael@email.com',   age: 15, country: 'Colombia' },
    { name: 'Nicolás',   email: 'nicolas@email.com',    age: 43, country: 'Colombia' }
  ];

  $scope.availableColors = ['Red','Green','Blue','Yellow','Magenta','Maroon','Umbra','Turquoise'];

  $scope.multipleDemo = {};
  $scope.multipleDemo.colors = ['Blue','Red'];
  $scope.multipleDemo.selectedPeople = [$scope.people[5], $scope.people[4]];
  $scope.multipleDemo.selectedPeopleWithGroupBy = [$scope.people[8], $scope.people[6]];
  $scope.multipleDemo.selectedPeopleSimple = ['samantha@email.com','wladimir@email.com'];
            
            
            
            
            
                       
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
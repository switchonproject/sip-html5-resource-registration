/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

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
            '$modal',
            function (
                    $scope,
                    AppConfig,
                    WizardHandler,
                    dataset,
                    tagGroupService,
                    $modal
                    ) {
                'use strict';

                var _this;
                
                _this = this;
                _this.config = AppConfig;
                _this.dataset = dataset;            

                // - dataset: the resource meta data, initialized from a template and changed by the app
                // - tags: list of selectable tags
                // - wizard: the wizard status

                // init Scope Soup -------------------------------------------------

                /**
                 * The resource meta data, initilaized from a template and changed by the app
                 */
                $scope.dataset = dataset;
                
                $scope.config = AppConfig;

                /**
                 * list of selectable tags. Initilaized by the controllers
                 */
                $scope.tags = [];

                /**
                 * Message text
                 */
                $scope.message = {};
                $scope.message.text = '<strong>Welcome to the SWITCH-ON tool for the registration of (hydrological) open-data in the <a href="'+AppConfig.byod.baseUrl+'" title="Find open data with the SIP BYOD Client" target="_blank">SWITCH-ON Spatial Information Platform</a>!</strong> <br>Please provide some general information about the new dataset such as name, description, a (download) link and keywords. ';
                $scope.message.icon = 'fa-info-circle';
                $scope.message.type = 'success';

                $scope.showInfoMessage = function (messageText, messageType, messageIcon) {
                    $scope.message.text = messageText;
                    $scope.message.type = messageType ? messageType : 'success';
                    $scope.message.icon = messageIcon ? messageIcon : 'fa-info-circle';
                };

                /**
                 * Wizard status, etc.
                 */
                $scope.wizard = {};
                $scope.wizard.uploadchoice = false;
                $scope.wizard.enterValidators = [];
                $scope.wizard.exitValidators = [];
                $scope.wizard.currentStep = '';
                $scope.wizard.canProceed = true;
                $scope.wizard.canGoBack = false;
                $scope.wizard.hasError = false;
                $scope.wizard.proceedButtonText = 'Next';
                $scope.wizard.isFinishStep = function () {
                    return $scope.wizard.currentStep === 'Summary';
                };
                $scope.wizard.isFirstStep = function () {
                    return $scope.wizard.currentStep === 'Dataset Description';
                };

                $scope.mapData = {};

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


                _this.finishedWizard = function () {
                    $modal.open({
                        animation: true,
                        templateUrl: 'templates/confirmation.html',
                        controller: 'de.cismet.sip-html5-resource-registration.controllers.storageController',
                        controllerAs: 'storageController',
                        keyboard: 'false',
                        size: 'lg',
                        backdrop: 'static'
                    });
                };
            }
        ]
        );
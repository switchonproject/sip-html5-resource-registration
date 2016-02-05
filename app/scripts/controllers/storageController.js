/*jshint sub:true*/

angular.module(
        'de.cismet.sip-html5-resource-registration.controllers'
        ).controller(
        'de.cismet.sip-html5-resource-registration.controllers.storageController',
        [
            '$scope',
            '$window',
            '$interval',
            '$modalInstance',
            'AppConfig',
            'de.cismet.sip-html5-resource-registration.services.dataset',
            'de.cismet.sip-html5-resource-registration.services.TagGroupService',
            'de.cismet.sip-html5-resource-registration.services.storageService',
            // Controller Constructor Function
            function (
                    $scope,
                    $window,
                    $interval,
                    $modalInstance,
                    AppConfig,
                    dataset,
                    tagGroupService,
                    storageService
                    ) {
                'use strict';
                var _this;

                _this = this;
                _this.dataset = dataset;
                _this.config = AppConfig;

                _this.progress = {};
                _this.progress.message = null;
                _this.progress.currval = 0;
                _this.progress.active = true;
                _this.progress.finished = false;
                _this.progress.error = null;
                _this.progress.type = 'primary';
                _this.progress.message = 'The dataset is now added to the SWITCH-ON Meta-Data Repository. <br>Please do not close this browser window until the uploaded has been completed';


                $modalInstance.rendered.then(function () {
                    tagGroupService.getTagList('srid', 'EPSG:4326').$promise.then(function (tags) {
                        _this.dataset.srid = tags[0];
                        _this.progress.currval += 10;
                    });

                    tagGroupService.getTagList('conformity', 'Not evaluated').$promise.then(function (tags) {
                        _this.dataset.conformity = tags[0];
                        _this.progress.currval += 10;
                    });

                    tagGroupService.getTagList('language', 'eng').$promise.then(function (tags) {
                        _this.dataset.language = tags[0];
                        _this.dataset.metadata[0].language = tags[0];
                        _this.progress.currval += 20;
                    });

                    tagGroupService.getTagList('type', 'external data').$promise.then(function (tags) {
                        _this.dataset.type = tags[0];
                        _this.progress.currval += 10;
                    });

                    tagGroupService.getTagList('topic category', 'climatologyMeteorologyAtmosphere').$promise.then(function (tags) {
                        _this.dataset.topiccategory = tags[0];
                    });

                    tagGroupService.getTagList('role', 'metadataProvider').$promise.then(function (tags) {
                        _this.dataset.contact.role = tags[0];
                        _this.progress.currval += 10;
                    });

                    tagGroupService.getTagList('representation type', 'original data').$promise.then(function (tags) {
                        _this.dataset.contact.role = tags[0];
                        _this.progress.currval += 10;
                    });

                    tagGroupService.getTagList('representation type', 'original data').$promise.then(function (tags) {
                        _this.dataset.representation[0].type = tags[0];
                        _this.progress.currval += 10;
                    });

                    tagGroupService.getTagList('protocol', 'WWW:LINK-1.0-http--link').$promise.then(function (tags) {
                        _this.dataset.representation[0].protocol = tags[0];
                        _this.progress.currval += 10;
                    });

                    tagGroupService.getTagList('meta-data type', 'lineage meta-data').$promise.then(function (tags) {
                        _this.dataset.metadata[0].type = tags[0];
                        _this.progress.currval += 10;
                    });

                    tagGroupService.getTagList('access limitations', 'limitation not listed').$promise.then(function (tags) {
                        _this.dataset.accesslimitations = tags[0];
                        _this.progress.currval += 10;
                    });

                    tagGroupService.getTagList('collection', 'SWITCH-ON - Open Data').$promise.then(function (tags) {
                        _this.dataset.collection = tags[0];
                        _this.progress.currval += 10;
                    });
                });

                _this.close = function () {
                    $modalInstance.close();
                    $window.location.reload();
                };

                $scope.$watch(function () {
                    // Return the "result" of the watch expression.
                    return(_this.progress.currval);
                }, function (newProgress) {
                    if (newProgress && newProgress === 120) {

                        var timer = $interval(function () {
                            if (_this.progress.currval < 190) {
                                _this.progress.currval += 1;
                            }
                        }, 200, 70);

                        storageService.store(dataset).$promise.then(
                                function (storedDataset) {
                                    $interval.cancel(timer);

                                    _this.progress.message = 'Your dataset has been successfully registered in the SWITCH-ON Spatial Information Platform. Please click <a href="' + AppConfig.byod.baseUrl + '/#/resource/' +
                                            storedDataset.id + '" title="' + storedDataset.name + '>here</a> to view the dataset in the SWITCH-ON BYOD Client.';

                                    _this.progress.active = false;
                                    _this.progress.finished = true;
                                    _this.progress.type = 'success';
                                    _this.progress.currval = 200;

                                },
                                function (error) {
                                    $interval.cancel(timer);

                                    if (error.data.userMessage) {
                                        _this.progress.message = 'The dataset could not be saved in the Meta-Data Repository: <br>' +
                                                error.data.userMessage;
                                    } else {
                                        this.progress.message = 'The dataset could not be saved in the Meta-Data Repository.';
                                    }

                                    _this.progress.active = false;
                                    _this.progress.finished = true;
                                    _this.progress.type = 'danger';
                                    _this.progress.currval = 200;
                                });

                    }
                });
            }
        ]
        );
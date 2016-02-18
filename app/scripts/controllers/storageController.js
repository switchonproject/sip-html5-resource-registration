/*jshint sub:true*/

angular.module(
        'de.cismet.sip-html5-resource-registration.controllers'
        ).controller(
        'de.cismet.sip-html5-resource-registration.controllers.storageController',
        [
            '$scope',
            '$http',
            '$window',
            '$interval',
            '$location',
            '$modalInstance',
            'rfc4122',
            'AppConfig',
            'de.cismet.sip-html5-resource-registration.services.dataset',
            'de.cismet.sip-html5-resource-registration.services.TagGroupService',
            'de.cismet.sip-html5-resource-registration.services.storageService',
            // Controller Constructor Function
            function (
                    $scope,
                    $http,
                    $window,
                    $interval,
                    $location,
                    $modalInstance,
                    rfc4122,
                    AppConfig,
                    dataset,
                    tagGroupService,
                    storageService
                    ) {
                'use strict';
                var _this, currentdate, userAgent;
                
                currentdate = new Date().getTime();
                userAgent = $window.navigator.userAgent;
                
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
                    
                    var servicetype, serviceurl;
                    servicetype = $location.search().servicetype;
                    serviceurl = $location.search().serviceurl;
                    
                    if(servicetype && serviceurl) {
                        _this.dataset.representation.contentlocation = serviceurl;
                        _this.dataset.representation.name = _this.dataset.name + ' ' + servicetype;
                    } else {
                        _this.dataset.representation[1] = null;
                    }
                    
                    // SRID TAG -> RESOURCE
                    tagGroupService.getTagList('srid', 'EPSG:4326').$promise.then(function (tags) {
                        _this.dataset.srid = tags[0];
                        _this.progress.currval += 10; // 10
                    });
                    
                    // CONFORMATIY TAG -> RESOURCE
                    tagGroupService.getTagList('conformity', 'Not evaluated').$promise.then(function (tags) {
                        _this.dataset.conformity = tags[0];
                        _this.progress.currval += 10; // 20
                    });

                    // LANGUAGE TAG -> RESOURCE, BASIC METADATA, LINEAGE METADATA
                    tagGroupService.getTagList('language', 'eng').$promise.then(function (tags) {
                        _this.dataset.language = tags[0];
                        _this.dataset.metadata[0].language = tags[0];
                        if(_this.dataset.metadata[1] && _this.dataset.metadata[1].description) {
                            _this.dataset.metadata[1].language = tags[0];
                        } else {
                            _this.dataset.metadata[1] = null;
                        }
                        _this.progress.currval += 10; // 30
                    });

                    // RESOURCE TYPE -> RESOURCE
                    tagGroupService.getTagList('resource type', 'open data').$promise.then(function (tags) {
                        _this.dataset.type = tags[0];
                        _this.progress.currval += 10; // 40
                    });

                    // INSPIRE TOPIC CATEGORY -> 
                    tagGroupService.getTagList('topic category', 'climatologyMeteorologyAtmosphere').$promise.then(function (tags) {
                        _this.dataset.topiccategory = tags[0];
                        _this.progress.currval += 10;  // 50
                    });

                    // ROLE - CONTACT
                    tagGroupService.getTagList('role', 'pointOfContact').$promise.then(function (tags) {
                        if(_this.dataset.contact.organisation || 
                                _this.dataset.contact.name || 
                                _this.dataset.contact.description || 
                                _this.dataset.contact.email || 
                                _this.dataset.contact.url) {
                            _this.dataset.contact.role = tags[0];
                        } else {
                            _this.dataset.contact = null;
                        }
                        _this.progress.currval += 10; // 60
                    });

                    // REPRESENTATION TYPE -> REPRESENTATION
                    tagGroupService.getTagList('representation type', 'original data').$promise.then(function (tags) {
                        _this.dataset.representation[0].type = tags[0];
                        if(_this.dataset.representation[1]) {
                            _this.dataset.representation[1].type = tags[0];
                        }
                        _this.progress.currval += 10; // 70
                    });

                    // PROTOCOL -> REPRESENTATION
                    tagGroupService.getTagList('protocol', 'WWW:LINK-1.0-http--link,OGC:WMS-1.1.1-http-get-capabilities,WWW:TILESERVER,OPeNDAP:OPeNDAP').$promise.then(function (tags) {
                        _this.dataset.representation[0].protocol = tags.getTagByName('WWW:LINK-1.0-http--link');
                        if(_this.dataset.representation[1]) {
                            if(servicetype === 'WMS') {
                                _this.dataset.representation[1].protocol = tags.getTagByName('OGC:WMS-1.1.1-http-get-capabilities'); 
                                _this.dataset.representation[1].contenttype = tagGroupService.getTag('content type', 'application/xml', function (tag) {
                                    _this.dataset.representation[1].contenttype = tag;
                                });
                            } else if(servicetype === 'OPeNDAP') {
                                _this.dataset.representation[1].protocol = tags.getTagByName('OPeNDAP:OPeNDAP'); 
                                _this.dataset.representation[1].contenttype = tagGroupService.getTag('content type', 'application/json', function (tag) {
                                    _this.dataset.representation[1].contenttype = tag;
                                });
                                
                                
                            }
                        }
                        _this.progress.currval += 10; // 80
                    });
                    
                    // META-DATA TYPE -> BASIC METADATA, LINEAGE METADATA
                    tagGroupService.getTagList('meta-data type', 'basic meta-data,lineage meta-data').$promise.then(function (tags) {
                        _this.dataset.metadata[0].type =  tags.getTagByName['basic meta-data'];
                        if(_this.dataset.metadata[1] && _this.dataset.metadata[1].description) {
                            _this.dataset.metadata[1].type = tags.getTagByName['lineage meta-data'];
                        } else {
                            _this.dataset.metadata[1] = null;
                        }
                        _this.progress.currval += 10; // 90
                    });

                    // ACCESS LIMITATIONS
                    tagGroupService.getTagList('access limitations', 'limitation not listed').$promise.then(function (tags) {
                        _this.dataset.accesslimitations = tags[0];
                        _this.progress.currval += 10; // 100
                    });

                    // COLLECTION -> RESOURCE
                    tagGroupService.getTagList('collection', 'Open Datasets').$promise.then(function (tags) {
                        _this.dataset.collection = tags[0];
                        _this.progress.currval += 10; // 110
                    });
                });
                
                // META-DATA STANDARD -> BASIC METADATA, LINEAGE METADATA
                tagGroupService.getTagList('meta-data standard', 'SWITCH-ON SIM').$promise.then(function (tags) {
                        _this.dataset.metadata[0].standard = tags[0];
                        if(_this.dataset.metadata[1] && _this.dataset.metadata[1].description) {
                            _this.dataset.metadata[1].standard = tags[0];
                        } else {
                            _this.dataset.metadata[1] = null;
                        }
                        _this.progress.currval += 10; // 120
                    });
                
                _this.dataset.representation[0].name = _this.dataset.name;
                _this.dataset.uuid = rfc4122.v4();
                _this.dataset.metadata[0].creationdate = currentdate;
                _this.dataset.metadata[0].description = userAgent;
                if(_this.dataset.metadata[1] && _this.dataset.metadata[1].description) {
                    _this.dataset.metadata[1].creationdate = currentdate;
                } else {
                    _this.dataset.metadata[1] = null;
                }
                
                // CONTENT TYPE -> BASIC METADATA
                _this.dataset.metadata[0].contenttype = tagGroupService.getTag('content type', 'application/json', function (tag) {
                    _this.dataset.metadata[0].contenttype = tag;
                });
                
                // FUNCTION
                if(_this.dataset.representation[1]) {
                    _this.dataset.representation[1].function = tagGroupService.getTag('function', 'service', function (tag) {
                        _this.dataset.metadata[1].function = tag;
                    });
                }
                _this.progress.currval += 10; // 130
                
                
                // CONTENCT (REQUEST STATUS) -> BASIC METADATA
                $http({
                    method: 'GET',
                    url: _this.config.cidsRestApi.host + '/service/status'
                  }).then(function (response) {
                      _this.dataset.metadata[0].content = JSON.stringify(response.data.$collection);
                      _this.progress.currval += 10; // 140
                });



                _this.close = function () {
                    $modalInstance.close();
                    $window.location.reload();
                };

                $scope.$watch(function () {
                    // Return the "result" of the watch expression.
                    return(_this.progress.currval);
                }, function (newProgress) {
                    if (newProgress && newProgress === 140) {

                        var timer = $interval(function () {
                            if (_this.progress.currval < 190) {
                                _this.progress.currval += 1;
                            }
                        }, 200, 50);

                        storageService.store(dataset).$promise.then(
                                function (storedDataset) {
                                    $interval.cancel(timer);

                                    _this.progress.message = 'Your dataset has been successfully registered in the SWITCH-ON Spatial Information Platform. Please click <a href=\'' + AppConfig.byod.baseUrl + '/#/resource/' +
                                            storedDataset.id + '\' title=\'' + storedDataset.name + '\'>here</a> to view the dataset in the SWITCH-ON BYOD Client.';

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
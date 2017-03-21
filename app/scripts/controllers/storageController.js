/* 
 * ***************************************************
 * 
 * cismet GmbH, Saarbruecken, Germany
 * 
 *               ... and it just works.
 * 
 * ***************************************************
 */

/*global angular*/
/*jshint sub:true*/
/*jshint camelcase: false */

angular.module(
        'de.cismet.sip-html5-resource-registration.controllers'
        ).controller(
        'de.cismet.sip-html5-resource-registration.controllers.storageController',
        [
            '$scope',
            '$http',
            '$window',
            '$interval',
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
                    $modalInstance,
                    rfc4122,
                    AppConfig,
                    dataset,
                    tagGroupService,
                    storageService
                    ) {
                'use strict';
                
                var _this, currentdate, userAgent, maxProgress, accessConditions, 
                    timer;
                
                /**
                * Update deposition metadata and save to zenodo
                * 
                * @param {type} dataset
                * @param {type} deposition
                * @return {unresolved}
                */
               function saveDeposition(dataset, deposition) {
                   // already set in licenseAndConsitions.html:
                   // deposition.metadata.upload_type
                   if(deposition.metadata.upload_type === 'publication') {
                       // Set to fixed value to avoid bothering end users 
                       deposition.metadata.publication_type = 'conferencepaper';
                   } if(deposition.metadata.upload_type === 'image') {
                       deposition.metadata.image_type = 'figure';
                   }

                   //Date of publication in ISO8601 format (YYYY-MM-DD). Defaults to current date.
                   //deposition.metadata.publication_date

                   deposition.metadata.title = dataset.name;
                   deposition.metadata.description = dataset.description;

                   deposition.metadata.creators = [];

                   if(dataset.contact) {
                       deposition.metadata.creators[0] = {
                           'name' : dataset.contact.name,
                           'affiliation' : dataset.contact.organisation
                       };
                   }

                   // access_conditions vs access_right vs license
                   if(dataset.accessconditions.name === 'research only' || dataset.accessconditions.name === 'other') {
                       deposition.metadata.access_right = 'restricted';
                       if(dataset.licensestatement && dataset.licensestatement !== null) {
                           deposition.metadata.access_conditions = dataset.licensestatement;
                       } else {
                           deposition.metadata.access_conditions = dataset.accessconditions.name;
                       }
                   } else {
                       deposition.metadata.access_right = 'open';

                       if(accessConditions[dataset.accessconditions.name]) {
                           deposition.metadata.license = accessConditions[dataset.accessconditions.name];
                       } else {
                           deposition.metadata.license = 'other-pd';
                       }
                   }

                   deposition.metadata.keywords = [];
                   dataset.tags.forEach(function (tag) {
                       deposition.metadata.keywords.push(tag.name);
                   });

                   if(dataset.metadata[1] && dataset.metadata[1].description && dataset.metadata[1].type.name === 'lineage meta-data') {
                       deposition.metadata.notes = dataset.metadata[1].description;
                   }

                   if(deposition.metadata.grants === true) {
                       deposition.metadata.communities = [{'identifier':'switchon'}];
                       deposition.metadata.grants = [{'id' : '603587'}];
                   }

                   return deposition.$save();
               }

               function storeDataset(deposition) {

                   if(deposition && deposition !== null) {
                       var depositionMetadata = null;
                       if(_this.dataset.metadata[1] && _this.dataset.metadata[1].type && _this.dataset.metadata[1].type.name === 'deposition meta-data') {
                           depositionMetadata = _this.dataset.metadata[1];
                       } else if(_this.dataset.metadata[2] && _this.dataset.metadata[2].type && _this.dataset.metadata[2].type.name === 'deposition meta-data') {
                           depositionMetadata = _this.dataset.metadata[2];
                       }

                       if(depositionMetadata !== null) {
                           depositionMetadata.contentlocation = deposition.links.record;
                           depositionMetadata.content = angular.toJson(deposition);
                           depositionMetadata.description = deposition.doi_url;
                           depositionMetadata.creationdate = currentdate;
                           depositionMetadata.uuid = deposition.doi;
                       }  
                   }

                   return storageService.store(_this.dataset).$promise.then(
                       function (storedDataset) {
                           $interval.cancel(timer);

                           var progressMessage = 'Your dataset has been successfully registered in the SWITCH-ON Spatial Information Platform. Please click <a href=\'' + AppConfig.byod.baseUrl + '/#/resource/' +
                                   storedDataset.id + '\' title=\'' + storedDataset.name + '\'>here</a> to view the dataset in the SWITCH-ON BYOD Client.';

                           if (deposition !== null) {
                               progressMessage += '<br><br>The Digital Object Identifier <a href=\'https://doi.org/' + 
                                       deposition.doi + '\' target=\'_blank\'>' + deposition.doi + '</a> for dataset "' + dataset.name + 
                                       '" has successfully been published!';
                           }

                           _this.progress.message = progressMessage;

                           _this.progress.active = false;
                           _this.progress.finished = true;
                           _this.progress.type = 'success';
                           _this.progress.currval = 200;

                           return storedDataset;
                       });
               }

                function handleError(error) {
                    $interval.cancel(timer);

                    if(error.data) {
                        console.error(JSON.stringify(error.data));
                    }

                    if (error.data && error.data.userMessage) {
                        _this.progress.message = 'The dataset could not be saved in the SWITCH-ON Meta-Data Repository: <br>' +
                        error.data.userMessage;
                    } else if (error.data && error.data.message) {
                        _this.progress.message = 'The dataset could not be saved in the SWITCH-ON Meta-Data Repository: <br>' +
                        error.data.message;
                    } else if(error.status && error.statusText) {
                        _this.progress.message = 'The dataset could not be saved in the SWITCH-ON Meta-Data Repository: <br>' +
                        error.statusText + ' (' + error.status + ')';
                    } else {
                        _this.progress.message = 'The dataset could not be saved in the SWITCH-ON Meta-Data Repository';
                    }

                    _this.progress.active = false;
                    _this.progress.finished = true;
                    _this.progress.type = 'danger';
                    _this.progress.currval = 200;
                }

                currentdate = new Date().getTime();
                userAgent = $window.navigator.userAgent;
                maxProgress = 120;
                
                accessConditions = [];
                accessConditions['Creative Commons (CC BY)'] = 'CC-BY-4.0';
                accessConditions['Creative Commons (CC BY-NC)'] = 'CC-BY-NC-4.0';
                accessConditions['Creative Commons (CC BY-NC-ND)'] = 'CC-BY-NC-4.0';
                accessConditions['Creative Commons (CC BY-NC-SA)'] = 'CC-BY-NC-4.0';
                accessConditions['Creative Commons (CC BY-ND)'] = 'CC-BY-4.0'; 
                accessConditions['Creative Commons (CC BY-SA)'] =  'CC-BY-SA-4.0';
                accessConditions['no limitations'] = 'other-pd';

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
                _this.progress.message = 'The dataset is now beeing added to the SWITCH-ON Meta-Data Repository. <br>Please do not close this browser window until the upload has been completed';

                _this.close = function () {
                    $modalInstance.close();
                    $window.location.reload();
                };



                $modalInstance.rendered.then(function () {

                    // DEPOSITION / DOI
                    _this.generateDOI = dataset.$deposition && dataset.$deposition !== null && dataset.$deposition.metadata.prereserve_doi.doi !== null;

                    // REPRESENTATIONS
                    _this.dataset.representation.forEach(function (representation) {
                        maxProgress += 10;

                        // TAGS -> REPRESENTATION
                        representation.updateTags().then(function () {
                            _this.progress.currval += 10; // maxProgress + 10
                            //console.log('REPRESENTATIONS: ' + _this.progress.currval);
                        });

                        // the uuid is needed to uniquely indentify the representation 
                        // when the server has to perform an update of the uploadmessage (processing instruction)
                        // UUID -> REPRESENTATION
                        representation.uuid = representation.uuid || rfc4122.v4();
                    });

                    // SRID TAG -> RESOURCE
                    tagGroupService.getTagList('srid', 'EPSG:4326').$promise.then(function (tags) {
                        _this.dataset.srid = tags[0];
                        _this.progress.currval += 10; // 10
                        //console.log('SRID TAG -> RESOURCE: ' + _this.progress.currval);
                    });

                    // CONFORMITY TAG -> RESOURCE
                    tagGroupService.getTagList('conformity', 'Not evaluated').$promise.then(function (tags) {
                        _this.dataset.conformity = tags[0];
                        _this.progress.currval += 10; // 20
                        //console.log('CONFORMITY TAG -> RESOURCE: ' + _this.progress.currval);
                    });

                    // LANGUAGE TAG -> RESOURCE, BASIC METADATA, LINEAGE METADATA
                    tagGroupService.getTagList('language', 'eng').$promise.then(function (tags) {
                        _this.dataset.language = tags[0];
                        _this.dataset.metadata[0].language = tags[0];
                        if (_this.dataset.metadata[1] && _this.dataset.metadata[1].description) {
                            _this.dataset.metadata[1].language = tags[0];
                        }
                        if (_this.dataset.metadata[2]) {
                            _this.dataset.metadata[2].language = tags[0];
                        }
                        _this.progress.currval += 10; // 30
                        //console.log('LANGUAGE TAG: ' + _this.progress.currval);
                    });

                    // RESOURCE TYPE -> RESOURCE
                    tagGroupService.getTagList('resource type', 'open data').$promise.then(function (tags) {
                        _this.dataset.type = tags[0];
                        _this.progress.currval += 10; // 40
                        //console.log('RESOURCE TYPE -> RESOURCE: ' + _this.progress.currval);
                    });

                    // INSPIRE TOPIC CATEGORY -> 
                    tagGroupService.getTagList('topic category', 'climatologyMeteorologyAtmosphere').$promise.then(function (tags) {
                        _this.dataset.topiccategory = tags[0];
                        _this.progress.currval += 10;  // 50
                        //console.log('INSPIRE TOPIC CATEGORY: ' + _this.progress.currval);
                    });

                    // ROLE -> CONTACT
                    tagGroupService.getTagList('role', 'pointOfContact').$promise.then(function (tags) {
                        if (_this.dataset.contact.organisation ||
                                _this.dataset.contact.name ||
                                _this.dataset.contact.description ||
                                _this.dataset.contact.email ||
                                _this.dataset.contact.url) {
                            _this.dataset.contact.role = tags[0];
                        } else {
                            _this.dataset.contact = null;
                        }
                        _this.progress.currval += 10; // 60
                        //console.log('ROLE -> CONTACT: ' + _this.progress.currval);
                    });

                    // META-DATA TYPE -> BASIC METADATA, LINEAGE METADATA
                    tagGroupService.getTagList('meta-data type', 'basic meta-data,lineage meta-data,deposition meta-data').$promise.then(function (tags) {
                        _this.dataset.metadata[0].type = tags.getTagByName('basic meta-data');
                        if (_this.dataset.metadata[1] && _this.dataset.metadata[1].description) {
                            _this.dataset.metadata[1].type = tags.getTagByName('lineage meta-data');
                        }
                        if (_this.dataset.metadata[2]) {
                            _this.dataset.metadata[2].type = tags.getTagByName('deposition meta-data');
                        }
                        
                        _this.progress.currval += 10; // 70
                        //console.log('META-DATA TYPE: ' + _this.progress.currval);
                    });

                    // ACCESS LIMITATIONS
                    tagGroupService.getTagList('access limitations', 'limitation not listed').$promise.then(function (tags) {
                        _this.dataset.accesslimitations = tags[0];
                        _this.progress.currval += 10; // 80
                        //console.log('ACCESS LIMITATIONS: ' + _this.progress.currval);
                    });

                    // COLLECTION -> RESOURCE
                    tagGroupService.getTagList('collection', 'Open Datasets').$promise.then(function (tags) {
                        _this.dataset.collection = tags[0];
                        _this.progress.currval += 10; // 90
                        //console.log('COLLECTION -> RESOURCE: ' + _this.progress.currval);
                    });

                    // META-DATA STANDARD -> BASIC METADATA, LINEAGE METADATA
                    tagGroupService.getTagList('meta-data standard', 'SWITCH-ON SIM,Zenodo Depositions').$promise.then(function (tags) {
                        _this.dataset.metadata[0].standard = tags.getTagByName('SWITCH-ON SIM');
                        if (_this.dataset.metadata[1] && _this.dataset.metadata[1].description) {
                            _this.dataset.metadata[1].standard = tags.getTagByName('SWITCH-ON SIM');
                        }
                        if (_this.dataset.metadata[2] && _this.dataset.metadata[2].description) {
                            _this.dataset.metadata[2].standard = tags.getTagByName('Zenodo Depositions');
                        }
                        _this.progress.currval += 10; // 100
                        //console.log('META-DATA STANDARD: ' + _this.progress.currval);
                    });


                    // CONTENT TYPE -> BASIC METADATA
                    _this.dataset.metadata[0].contenttype = tagGroupService.getTag('content type', 'application/json', function (tag) {
                        _this.dataset.metadata[0].contenttype = tag;
                        if (_this.dataset.metadata[2]) {
                            _this.dataset.metadata[2].contenttype = tag;
                        }
                        // callback function might get called or might not get called!
                        //_this.progress.currval += 10; // 110
                        //console.log('CONTENT TYPE: ' + _this.progress.currval);
                    });


                    // CONTENT (REQUEST STATUS) -> BASIC METADATA
                    $http({
                        method: 'GET',
                        url: _this.config.cidsRestApi.host + '/service/status'
                    }).then(function (response) {
                        _this.dataset.metadata[0].content = JSON.stringify(response.data.$collection);
                        _this.dataset.metadata[0].creationdate = currentdate;
                        _this.dataset.metadata[0].description = userAgent;
                        _this.progress.currval += 10; // 110
                        //console.log('CONTENT (REQUEST STATUS): ' + _this.progress.currval);
                    });


                    // check first resource name
                    if (!_this.dataset.representation[0].name) {
                        _this.dataset.representation[0].name = _this.dataset.name;
                    }

                    // CLEANUP
                    _this.dataset.uuid = _this.dataset.uuid || rfc4122.v4();

                    // check optional deposition metadata
                    if(!_this.generateDOI) {
                        _this.dataset.metadata.pop();
                    } else {
                         _this.dataset.metadata[2].creationdate = currentdate;
                    }

                    // check optional lineage metadata
                    if (!_this.dataset.metadata[1] || !_this.dataset.metadata[1].description) {
                        if(!_this.generateDOI) {
                            _this.dataset.metadata.pop();
                        } else {
                            _this.dataset.metadata.splice(1, 1);
                        }   
                    } else {
                        _this.dataset.metadata[1].creationdate = currentdate;
                    }

                    _this.progress.currval += 10; // 120
                    //console.log('CLEANUP: ' + _this.progress.currval);
                });

                $scope.$watch(function () {
                    // Return the "result" of the watch expression.
                    return(_this.progress.currval);
                }, function (newProgress) {
                    if (newProgress && newProgress === maxProgress) {
                        timer = $interval(function () {
                            if (_this.progress.currval < 190) {
                                _this.progress.currval += 1;
                            }
                        }, 200, 50);

                        if (_this.generateDOI) {
                            saveDeposition(dataset, dataset.$deposition)
                                .then(function saveDepositionSuccess(deposition) {
                                        if(deposition && deposition !== null) {
                                            _this.progress.message = 'The Meta-Data of the dataset ' + _this.dataset.name + 
                                            ' has been successfully associated with the Digital Object Identifier "' + 
                                            deposition.doi + '"';
                                            //console.log(_this.progress.message);
                                            return deposition.$publish();
                                        } else {
                                            _this.progress.message = 'The Meta-Data of the dataset ' + _this.dataset.name + 
                                                ' has been successfully associated with the Digital Object Identifier "' + 
                                                dataset.$deposition.metadata.prereserve_doi.doi + '"';
                                            console.error(_this.progress.message);
                                        }  
                                    })
                                .then(function publishDepositionSuccess(deposition) {
                                        if(deposition && deposition !== null) {
                                            _this.progress.message = 'The Digital Object Identifier "' + 
                                                deposition.doi + '" for dataset ' + dataset.name + 
                                                ' has successfully been published!';
                                            //console.info(_this.progress.message);

                                            return storeDataset(deposition);
                                        } else {
                                            _this.progress.message = 'The Digital Object Identifier "' + 
                                                dataset.$deposition.metadata.prereserve_doi.doi + '" for dataset ' + _this.dataset.name + 
                                                ' could not be published!';
                                            console.error(_this.progress.message);
                                        }  
                                    })
                                .catch(function (error) {
                                    handleError(error);
                                });
                        } else {
                            storeDataset(null)
                                .then(null, function (error) {
                                    handleError(error);
                                });
                        }
                    }
                });
            }
        ]
        );
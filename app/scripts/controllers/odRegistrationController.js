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
        'de.cismet.sip-html5-resource-registration.controllers.odRegistrationController',
        [
            '$scope',
            '$modal',
            '$location',
            'AppConfig',
            'de.cismet.sip-html5-resource-registration.services.dataset',
            'de.cismet.sip-html5-resource-registration.services.TagGroupService',
            'de.cismet.sip-html5-resource-registration.services.searchService',
            // Controller Constructor Function
            function (
                    $scope,
                    $modal,
                    $location,
                    AppConfig,
                    dataset,
                    tagGroupService,
                    searchService
                    ) {
                'use strict';

                var _this, duplicateLink;
                duplicateLink = undefined;

                _this = this;
                _this.dataset = dataset;
                _this.config = AppConfig;

                _this.groupBy = function (item) {

                    if (item.name.indexOf(',') > -1) {
                        return item.name.split(',', 1)[0];
                    } else {
                        return item.name.split(' ', 1)[0];
                    }

                };

                _this.checkLink = function (url) {
                    //console.log(url);
                    if (url) {
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

                    duplicateLink = undefined;
                };
                
                _this.selectKeywords = function () {
                    $modal.open({
                        animation: true,
                        templateUrl: 'templates/keywordSelection.html',
                        controller: 'de.cismet.sip-html5-resource-registration.controllers.keywordsController',
                        controllerAs: 'keywordsController',
                        keyboard: 'true',
                        size: 'lg',
                        scope: $scope
                    });
                };
                
                _this.gotoUploadTool = function () {
                    var uploadToolUrl = _this.config.uploadtool.baseUrl + 
                            '?datasetname=' + _this.dataset.name;
                    //console.log(uploadToolUrl);
                    $location.url(uploadToolUrl); 
                };
                
                _this.checkUploadName = function () {
                     if (!dataset.name) {
                        $scope.message.text = 'Please enter the name / title of the dataset before uploading ';
                        $scope.message.icon = 'fa-warning';
                        $scope.message.type = 'warning';

                        $scope.wizard.hasError = 'datasetUploadchoiceName';
                        return false;
                    }
                    
                    return true;
                };

                // load list
                $scope.tags['function'] = tagGroupService.getTagList('function');
                $scope.tags['content type'] = tagGroupService.getTagList('content type');
                $scope.tags['keywords - X-CUAHSI'] = tagGroupService.getTagList('keywords - X-CUAHSI');

                // set default values
//                _this.dataset.representation[0].function = tagGroupService.getTag('function', 'download',
//                        function (tag) {
//                            _this.dataset.representation[0].function = tag;
//                        });
//                
//                _this.dataset.representation[0].contenttype = tagGroupService.getTag('content type', 'application/octet-stream',
//                        function (tag) {
//                            _this.dataset.representation[0].contenttype = tag;
//                        });

                $scope.wizard.enterValidators['Dataset Description'] = function (context) {
                    if (context.valid === true) {
                        $scope.message.text = 'Please provide some general information about the new dataset such as name, description, a (download) link and keywords.';
                        $scope.message.icon = 'fa-info-circle';
                        $scope.message.type = 'success';
                    }

                    return context.valid;
                };

                $scope.wizard.exitValidators['Dataset Description'] = function (context) {
                    context.valid = true;

                    // CONTENT TYPE
                    var isInvalidContenttype = $scope.tags['content type'].every(function (element) {
                        if (_this.dataset.representation[0] && _this.dataset.representation[0].contenttype &&
                                (element.name === _this.dataset.representation[0].contenttype.name)) {
                            _this.dataset.representation[0].contenttype = element;
                            return false;
                        }

                        return true;
                    });

                    // FUNCTION
                    var isInvalidFunction = $scope.tags['function'].every(function (element) {
                        if (_this.dataset.representation[0] && _this.dataset.representation[0].function &&
                                (element.name === _this.dataset.representation[0].function.name)) {
                            _this.dataset.representation[0].function = element;
                            return false;
                        } else {
                            return true;
                        }
                    });

                    // NAME
                    if (!dataset.name) {
                        $scope.message.text = 'Please enter the name / title of the dataset.';
                        $scope.message.icon = 'fa-warning';
                        $scope.message.type = 'warning';

                        $scope.wizard.hasError = 'datasetName';
                        context.valid = false;
                    } else if (dataset.$uploaded === undefined) {
                        $scope.message.text = 'Please chose wheter you want to upload a new dataset or to provide a link to anexisting dataset.';
                        $scope.message.icon = 'fa-warning';
                        $scope.message.type = 'warning';

                        $scope.wizard.hasError = 'datasetUploadchoice';
                        context.valid = false;
                    } else if (isInvalidFunction) {
                        $scope.message.text = 'Please select a valid function (e.g. download) of the link.';
                        $scope.message.icon = 'fa-warning';
                        $scope.message.type = 'warning';

                        $scope.wizard.hasError = 'datasetContentlocation';
                        context.valid = false;
                    } else if (!dataset.representation[0].function) {
                        $scope.message.text = 'Please select a function (e.g. download) of the link.';
                        $scope.message.icon = 'fa-warning';
                        $scope.message.type = 'warning';

                        $scope.wizard.hasError = 'datasetContentlocation';
                        context.valid = false;
                    }  else if ($scope.odRegistrationForm.datasetContentlocation.$error.url) {
                        // CONTENT LOCATION       
                        $scope.message.text = 'The link to the dataset you have provided is not a valid <a href=\'https://en.wikipedia.org/wiki/Uniform_Resource_Locator#Syntax\' target=\'_blank\' title=\'Uniform Resource Locator\'>URL</a> .';
                        $scope.message.icon = 'fa-warning';
                        $scope.message.type = 'warning';

                        $scope.wizard.hasError = 'datasetContentlocation';
                        context.valid = false;
                    } else if (!dataset.representation[0].contentlocation) {
                        $scope.message.text = 'Please provide link to the dataset.';
                        $scope.message.icon = 'fa-warning';
                        $scope.message.type = 'warning';

                        $scope.wizard.hasError = 'datasetContentlocation';
                        context.valid = false;
                    } else if (duplicateLink) {
                        $scope.message.text = duplicateLink;
                        $scope.message.icon = 'fa-warning';
                        $scope.message.type = 'warning';

                        $scope.wizard.hasError = 'datasetContentlocation';
                        context.valid = false;
                    } else if (isInvalidContenttype) {
                        $scope.message.text = 'Please select a valid content type (e.g. ESRI Shapefile) of the link.';
                        $scope.message.icon = 'fa-warning';
                        $scope.message.type = 'warning';

                        $scope.wizard.hasError = 'datasetContentlocation';
                        context.valid = false;
                    } else if (!dataset.representation[0].contenttype) {
                        $scope.message.text = 'Please select a valid content type (e.g. ESRI Shapefile) of the link.';
                        $scope.message.icon = 'fa-warning';
                        $scope.message.type = 'warning';

                        $scope.wizard.hasError = 'datasetContentlocation';
                        context.valid = false;
                    } else if (!dataset.description) {
                        // DESCRIPTION
                        $scope.message.text = 'Please provide a description of the dataset.';
                        $scope.message.icon = 'fa-warning';
                        $scope.message.type = 'warning';

                        $scope.wizard.hasError = 'datasetDescription';
                        context.valid = false;
                    } else if (!_this.dataset.tags || _this.dataset.tags.length === 0) {
                        $scope.message.text = 'Please assign at least one keyword to the Dataset.';
                        $scope.message.icon = 'fa-warning';
                        $scope.message.type = 'warning';

                        $scope.wizard.hasError = 'datasetTags';
                        context.valid = false;
                    }

                    if (context.valid === true) {
                        $scope.wizard.hasError = null;
                    }
                    // no error? -> reset

                    return context.valid;
                };
            }
        ]
        );
/*jshint sub:true*/

angular.module(
        'de.cismet.sip-html5-resource-registration.controllers'
        ).controller(
        'de.cismet.sip-html5-resource-registration.controllers.keywordsController',
        [
            '$scope',
            'de.cismet.sip-html5-resource-registration.services.dataset',
            // Controller Constructor Function
            function (
                    $scope,
                    dataset
                    ) {
                'use strict';
                var _this;

                _this = this;
                _this.dataset = dataset;
                //$scope.dataset = dataset;

                _this.toggleSelection = function (tag) {
                    var idx = _this.dataset.tags.indexOf(tag);

                    if (idx > -1) {
                        $scope.dataset.tags.splice(idx, 1);
                    }

                    else {
                        $scope.dataset.tags.push(tag);
                    }
                };
            }
        ]
        );
/*jshint sub:true*/

angular.module(
        'de.cismet.sip-html5-resource-registration.controllers'
        ).controller(
        'de.cismet.sip-html5-resource-registration.controllers.storageController',
        [
            '$scope',
            'AppConfig',
            'de.cismet.sip-html5-resource-registration.services.dataset',
            'de.cismet.sip-html5-resource-registration.services.tagGroupService',
            // Controller Constructor Function
            function (
                    $scope,
                    AppConfig,
                    dataset,
                    tagGroupService
                    ) {
                'use strict';
                var _this;

                _this = this;
                _this.dataset = dataset;
                _this.config = AppConfig;

                tagGroupService.getTagList('srid', 'EPSG:4326').then(function (tags) {
                    _this.dataset.srid = tags[0];
                });

                tagGroupService.getTagList('conformity', 'Not evaluated').then(function (tags) {
                    _this.dataset.conformity = tags[0];
                });

                tagGroupService.getTagList('language', 'eng').then(function (tags) {
                    _this.dataset.language = tags[0];
                    _this.dataset.metadata[0].language = tags[0];
                });

                tagGroupService.getTagList('type', 'external data').then(function (tags) {
                    _this.dataset.type = tags[0];
                });

                tagGroupService.getTagList('topic category', 'climatologyMeteorologyAtmosphere').then(function (tags) {
                    _this.dataset.topiccategory = tags[0];
                });

                tagGroupService.getTagList('role', 'metadataProvider').then(function (tags) {
                    _this.dataset.contact.role = tags[0];
                });

                tagGroupService.getTagList('representation type', 'original data').then(function (tags) {
                    _this.dataset.contact.role = tags[0];
                });

                tagGroupService.getTagList('representation type', 'original data').then(function (tags) {
                    _this.dataset.representation[0].type = tags[0];
                });

                tagGroupService.getTagList('protocol', 'WWW:LINK-1.0-http--link').then(function (tags) {
                    _this.dataset.representation[0].protocol = tags[0];
                });

                tagGroupService.getTagList('meta-data type', 'lineage meta-data').then(function (tags) {
                    _this.dataset.metadata[0].type = tags[0];
                });

                tagGroupService.getTagList('access limitations', 'limitation not listed').then(function (tags) {
                    _this.dataset.accesslimitations = tags[0];
                });
            }
        ]
        );
'use strict';

describe('Services: representationFactory Test Suite', function () {

    var $tagGroupService, Representation, $q, jsonApiTestData, representations;

    beforeEach(function () {
        module('ngResource');
        module('de.cismet.sip-html5-resource-registration.services');
        module('test/res/jsonApiTestData.json');
        module('de.cismet.sip-html5-resource-registration.factories');
    });

    beforeEach(inject(
            [
                'de.cismet.sip-html5-resource-registration.services.TagGroupService',
                'de.cismet.sip-html5-resource-registration.services.RepresentationFactory',
                '$q',
                function (TagGroupService, RepresentationFactory, q) {
                    $tagGroupService = TagGroupService;
                    $q = q;
                    Representation = RepresentationFactory;
                }
            ]
            ));

    beforeEach(function () {

        inject(function (_testResJsonApiTestData_) {
            jsonApiTestData = _testResJsonApiTestData_;
        });

        representations = [];
        if (Array.isArray(jsonApiTestData)) {
            jsonApiTestData.forEach(function (representation) {
                //invoke representation constructor
                representations.push(new Representation(representation));
            });
        }


    });

    describe('Test to print out jasmine version', function () {
        it('prints jasmine version', function () {
            console.log('jasmine-version:');
            console.log(jasmine.version || (jasmine.getEnv().versionString && jasmine.getEnv().versionString()));
        });
    });

    describe('test test', function () {
        it('should do something', function () {
            expect(representations.length).toBe(4);
        });
    });
});


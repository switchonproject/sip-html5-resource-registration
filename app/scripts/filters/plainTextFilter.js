angular.module('de.cismet.sip-html5-resource-registration.filters').
        filter('htmlToPlaintext', function () {
            'use strict';
            return function (text) {
                return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
            };
        }
        );
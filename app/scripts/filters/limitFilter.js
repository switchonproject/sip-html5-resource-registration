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
        'de.cismet.sip-html5-resource-registration.filters'
        ).filter(
        'limit',
        function () {
            'use strict';
            return function (items, begin, end) {
                return items.slice(begin, end);
            };
        });

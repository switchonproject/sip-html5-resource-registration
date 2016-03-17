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
        'function',
        function () {
            'use strict';


            return function (items) {
                var filtered = [];
                
                angular.forEach(items, function (item) {
                    if(item.name === 'download' || 
                            item.name === 'information' || 
                            item.name === 'link to order data') {
                        filtered.push(item);
                    }
                });

                filtered.sort(function (a, b) {
                    return a.name.localeCompare(b.name);
                });
                return filtered;
            };
        });

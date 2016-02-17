angular.module(
        'de.cismet.sip-html5-resource-registration.filters'
        ).filter(
        'contenttype',
        function () {
            'use strict';

            function customOrder(description) {
                if(description.indexOf('unknown') !== -1) {
                    return 0;
                }
                
                return 1;
            }

            return function (items) {
                var filtered = [];
                angular.forEach(items, function (item) {
//                    var name = item.description.split(' (', 1);
//                    if(name.length === 1) {
//                        item.description = name[0];
//                    } 
                    
                    filtered.push(item);
                });
                
                filtered.sort(function (a, b) {
                    return (customOrder(a.description) > customOrder(b.description) ? 1 : -1);
                });
                return filtered;
            };
        });

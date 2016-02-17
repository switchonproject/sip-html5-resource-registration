angular.module(
        'de.cismet.sip-html5-resource-registration.filters'
        ).filter(
        'contenttype',
        function () {
            'use strict';


            return function (items) {
                var filtered = [];
                angular.forEach(items, function (item) {
                    filtered.push(item);
                });

                filtered.sort(function (a, b) {

                    if (a.description.indexOf('unknown') !== -1) {

                        return -1;
                    } else if (b.description.indexOf('unknown') !== -1) {
                        return 1;
                    } else {
                        return a.description.localeCompare(b.description);
                    }
                });
                return filtered;
            };
        });

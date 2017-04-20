angular.module('').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('templates/confirmation.html',
    "<div class=\"modal-header\">\r" +
    "\n" +
    "    <h3 class=\"modal-title\">SWITCH-ON Meta-Data Repository Upload</h3>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"modal-body\">\r" +
    "\n" +
    "    <p class=\"danger\" ng-bind-html=\"storageController.progress.message\"></p>\r" +
    "\n" +
    "    <progressbar class=\"progress-striped active\" \r" +
    "\n" +
    "                 ng-class=\"{active:storageController.progress.active}\"\r" +
    "\n" +
    "                 max=\"200\" \r" +
    "\n" +
    "                 value=\"storageController.progress.currval\"\r" +
    "\n" +
    "                 type=\"{{storageController.progress.type}}\">\r" +
    "\n" +
    "        <p class=\"danger\" ng-show=\"storageController.progress.error\">Please report this error to SWITCH-ON (Feedback) and attach the erroneous meta-data file (Download Meta-Data).</p>\r" +
    "\n" +
    "    </progressbar>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"modal-footer\">\r" +
    "\n" +
    "    <a class=\"btn btn-primary pull-left\"\r" +
    "\n" +
    "       href=\"mailto:switchon.odr@gmail.com?subject=Open-Data Registration Tool\">\r" +
    "\n" +
    "        <span class=\"fa fa-fw fa-envelope\"></span>\r" +
    "\n" +
    "        <span>Feedback</span>\r" +
    "\n" +
    "    </a>\r" +
    "\n" +
    "    <button class=\"btn btn-danger\" \r" +
    "\n" +
    "            type=\"button\"  \r" +
    "\n" +
    "            ng-if=\"storageController.config.developmentMode === true || storageController.progress.error\"\r" +
    "\n" +
    "            ng-click=\"storageController.saveJSON()\" \r" +
    "\n" +
    "            ng-href=\"{{ url}}\">\r" +
    "\n" +
    "        Download Meta-Data \r" +
    "\n" +
    "    </button>\r" +
    "\n" +
    "    <button class=\"btn btn-primary\" \r" +
    "\n" +
    "            type=\"button\" \r" +
    "\n" +
    "            ng-disabled=\"!storageController.progress.finished\"\r" +
    "\n" +
    "            ng-click=\"storageController.close()\">\r" +
    "\n" +
    "        Close\r" +
    "\n" +
    "    </button>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('templates/geographicLocation.html',
    "<div class=\"row\" ng-controller=\"de.cismet.sip-html5-resource-registration.controllers.geoLocationController as geoController\" >\r" +
    "\n" +
    "    <div class=\"col-md-9\">\r" +
    "\n" +
    "        <leaflet id=\"mainmap\" \r" +
    "\n" +
    "                 defaults=\"mapData.defaults\" \r" +
    "\n" +
    "                 layers=\"mapData.layers\"\r" +
    "\n" +
    "                 center=\"mapData.center\"\r" +
    "\n" +
    "                 height=\"600px\" width=\"820px\">   \r" +
    "\n" +
    "        </leaflet>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    \r" +
    "\n" +
    "    <div class=\"col-md-3\" \r" +
    "\n" +
    "         ng-if=\"!geoController.readOnly\">\r" +
    "\n" +
    "        \r" +
    "\n" +
    "        <div class=\"row\">\r" +
    "\n" +
    "            <div class=\"col-md-12\">\r" +
    "\n" +
    "                <label>Please select one</label>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "        <div class=\"row\">\r" +
    "\n" +
    "             <div class=\"col-md-12\">\r" +
    "\n" +
    "                <div class=\"btn-group-vertical\">\r" +
    "\n" +
    "                    <label class=\"btn btn-primary\" \r" +
    "\n" +
    "                           ng-model=\"geoController.mode.drawBBox\" \r" +
    "\n" +
    "                           ng-click=\"geoController.switchMode('drawBBox')\"\r" +
    "\n" +
    "                           btn-radio=\"true\">\r" +
    "\n" +
    "                        Define bounding box or polygon\r" +
    "\n" +
    "                    </label>\r" +
    "\n" +
    "                    \r" +
    "\n" +
    "                    <label class=\"btn btn-primary\" \r" +
    "\n" +
    "                           ng-model=\"geoController.mode.selectCountry\" \r" +
    "\n" +
    "                           ng-click=\"geoController.switchMode('selectCountry')\"\r" +
    "\n" +
    "                           btn-radio=\"true\">\r" +
    "\n" +
    "                        Select countries\r" +
    "\n" +
    "                    </label>\r" +
    "\n" +
    "                    \r" +
    "\n" +
    "                    <!--\r" +
    "\n" +
    "                    <label class=\"btn btn-primary\" \r" +
    "\n" +
    "                           ng-model=\"geoController.mode.selectEC\" \r" +
    "\n" +
    "                           ng-click=\"geoController.switchMode('selectEC')\"\r" +
    "\n" +
    "                           btn-radio=\"true\">Select European country or region</label>\r" +
    "\n" +
    "                    \r" +
    "\n" +
    "                    <label class=\"btn btn-primary\" \r" +
    "\n" +
    "                           ng-model=\"geoController.mode.selectWC\" \r" +
    "\n" +
    "                           ng-click=\"geoController.switchMode('selectWC')\"\r" +
    "\n" +
    "                           btn-radio=\"true\">Select World country or region</label>\r" +
    "\n" +
    "                    -->\r" +
    "\n" +
    "                    \r" +
    "\n" +
    "                    <label class=\"btn btn-primary\" \r" +
    "\n" +
    "                           ng-model=\"geoController.mode.defineBBox\" \r" +
    "\n" +
    "                           ng-click=\"geoController.switchMode('defineBBox')\"\r" +
    "\n" +
    "                           btn-radio=\"true\">\r" +
    "\n" +
    "                        Enter bounding box coordinates\r" +
    "\n" +
    "                    </label>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <!-- CONTROL SELECT EUROPE \r" +
    "\n" +
    "        <div class=\"row\" ng-show=\"geoController.mode.selectEC\">\r" +
    "\n" +
    "            <div class=\"col-md-12\">\r" +
    "\n" +
    "                <hr>\r" +
    "\n" +
    "                <label>European countries</label>\r" +
    "\n" +
    "                <ui-select ng-model=\"geoController.contentLocation.name\" \r" +
    "\n" +
    "                           theme=\"bootstrap\" \r" +
    "\n" +
    "                           ng-disabled=\"disabled\" \r" +
    "\n" +
    "                           sortable=\"true\"\r" +
    "\n" +
    "                           on-select=\"geoController.onSelectedCountry($item)\">\r" +
    "\n" +
    "                    <ui-select-match>{{$select.selected.name}}</ui-select-match>\r" +
    "\n" +
    "                    <ui-select-choices repeat=\"country.name as country in geoController.countries['countries-europe'] | filter: {name: $select.search}\"\r" +
    "\n" +
    "                                       position=\"down\"\r" +
    "\n" +
    "                                       style=\"max-height:350px\">\r" +
    "\n" +
    "                        <div ng-bind-html=\"country.name | highlight: $select.search\"></div>\r" +
    "\n" +
    "                    </ui-select-choices>\r" +
    "\n" +
    "                </ui-select>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>-->\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <!-- CONTROL SELECT WORLD \r" +
    "\n" +
    "        <div class=\"row\" ng-show=\"geoController.mode.selectWC\">\r" +
    "\n" +
    "            <div class=\"col-md-12\">\r" +
    "\n" +
    "                <hr>\r" +
    "\n" +
    "                <label>World countries</label>\r" +
    "\n" +
    "                <ui-select ng-model=\"geoController.contentLocation.name\" \r" +
    "\n" +
    "                           theme=\"bootstrap\" \r" +
    "\n" +
    "                           ng-disabled=\"disabled\" \r" +
    "\n" +
    "                           sortable=\"true\"\r" +
    "\n" +
    "                           on-select=\"geoController.onSelectedCountry($item)\">\r" +
    "\n" +
    "                    <ui-select-match>{{$select.selected.name}}</ui-select-match>\r" +
    "\n" +
    "                    <ui-select-choices repeat=\"country.name as country in geoController.countries['countries-world'] | filter: {name: $select.search}\"\r" +
    "\n" +
    "                                       position=\"down\"\r" +
    "\n" +
    "                                       style=\"max-height:350px\">\r" +
    "\n" +
    "                        <div ng-bind-html=\"country.name | highlight: $select.search\"></div>\r" +
    "\n" +
    "                    </ui-select-choices>\r" +
    "\n" +
    "                </ui-select>\r" +
    "\n" +
    "            </div>-->\r" +
    "\n" +
    "        \r" +
    "\n" +
    "        <!-- CONTROL ENTER COORDINATES -->\r" +
    "\n" +
    "        <div class=\"row\" ng-show=\"geoController.mode.defineBBox\">\r" +
    "\n" +
    "            <div class=\"col-md-10\">\r" +
    "\n" +
    "                <hr>\r" +
    "\n" +
    "                <form class=\"form-horizontal\" name=\"forms.coordinatesForm\" id=\"forms.coordinatesForm\" novalidate> \r" +
    "\n" +
    "                    <!-- North Bound Latitude -->\r" +
    "\n" +
    "                    <div class=\"row\">\r" +
    "\n" +
    "                        <div class=\"col-md-12\">\r" +
    "\n" +
    "                            <label class=\"control-label\" for=\"north\">North Bound Latitude</label>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"row form-group\" \r" +
    "\n" +
    "                         ng-class=\"{'has-error': !forms.coordinatesForm.north.$error.required && forms.coordinatesForm.north.$invalid,\r" +
    "\n" +
    "                                    'has-success': !forms.coordinatesForm.north.$error.required && !forms.coordinatesForm.north.$invalid}\">\r" +
    "\n" +
    "                        <div class=\"col-md-12\">\r" +
    "\n" +
    "                            <input type=\"number\" class=\"form-control\" id=\"north\" name=\"north\" \r" +
    "\n" +
    "                                   ng-model=\"geoController.contentLocation.bounds.north\" \r" +
    "\n" +
    "                                   ng-change=\"geoController.applyBoundingBox()\"\r" +
    "\n" +
    "                                   min=\"-90.00000000000000000\" max=\"90.0000000000000000\" required>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    \r" +
    "\n" +
    "                    <!-- East Bound Longitude -->\r" +
    "\n" +
    "                    <div class=\"row\">\r" +
    "\n" +
    "                        <div class=\"col-md-12\">\r" +
    "\n" +
    "                            <label class=\"control-label\" for=\"east\">East Bound Longitude</label> \r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"row form-group\" \r" +
    "\n" +
    "                         ng-class=\"{'has-error': !forms.coordinatesForm.east.$error.required && forms.coordinatesForm.east.$invalid,\r" +
    "\n" +
    "                                    'has-success': !forms.coordinatesForm.east.$error.required && !forms.coordinatesForm.east.$invalid}\">\r" +
    "\n" +
    "                        <div class=\"col-md-12\">\r" +
    "\n" +
    "                            <input class=\"form-control\" type=\"number\" id=\"east\" name=\"east\" \r" +
    "\n" +
    "                                   ng-model=\"geoController.contentLocation.bounds.east\" \r" +
    "\n" +
    "                                   ng-change=\"geoController.applyBoundingBox()\"\r" +
    "\n" +
    "                                   min=\"-180.0000000000000000\" max=\"180.0000000000000000\" required>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <!-- South Bound Latitude -->\r" +
    "\n" +
    "                    <div class=\"row\">\r" +
    "\n" +
    "                        <div class=\"col-md-12\">\r" +
    "\n" +
    "                            <label class=\"control-label\" for=\"south\">South Bound Latitude</label> \r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"row form-group\"  \r" +
    "\n" +
    "                         ng-class=\"{'has-error': !forms.coordinatesForm.south.$error.required && forms.coordinatesForm.south.$invalid,\r" +
    "\n" +
    "                                    'has-success': !forms.coordinatesForm.south.$error.required && !forms.coordinatesForm.south.$invalid}\">\r" +
    "\n" +
    "                        <div class=\"col-md-12\">\r" +
    "\n" +
    "                            <input type=\"number\" class=\"form-control\" id=\"south\" name=\"south\" \r" +
    "\n" +
    "                                   ng-model=\"geoController.contentLocation.bounds.south\" \r" +
    "\n" +
    "                                   ng-change=\"geoController.applyBoundingBox()\"\r" +
    "\n" +
    "                                   min=\"-90.00000000000000000\" max=\"90.00000000000000000\" required>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                    <!-- West Bound Longitude -->\r" +
    "\n" +
    "                    <div class=\"row\">\r" +
    "\n" +
    "                        <div class=\"col-md-12\">\r" +
    "\n" +
    "                            <label class=\"control-label\" for=\"west\">West Bound Longitude</label> \r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                    <div class=\"row form-group\"  \r" +
    "\n" +
    "                         ng-class=\"{'has-error': !forms.coordinatesForm.west.$error.required && forms.coordinatesForm.west.$invalid,\r" +
    "\n" +
    "                                    'has-success': !forms.coordinatesForm.west.$error.required && !forms.coordinatesForm.west.$invalid}\">\r" +
    "\n" +
    "                        <div class=\"col-md-12\">\r" +
    "\n" +
    "                            <input type=\"number\" class=\"form-control\" id=\"west\" name=\"west\" \r" +
    "\n" +
    "                                   ng-model=\"geoController.contentLocation.bounds.west\" \r" +
    "\n" +
    "                                   ng-change=\"geoController.applyBoundingBox()\"\r" +
    "\n" +
    "                                   min=\"-180.0000000000000000\" max=\"180.0000000000000000\" required>\r" +
    "\n" +
    "                        </div>\r" +
    "\n" +
    "                    </div>\r" +
    "\n" +
    "                </form>\r" +
    "\n" +
    "            </div>  \r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('templates/keywordSelection.html',
    "<div class=\"modal-header\">\r" +
    "\n" +
    "    <div class=\"row\">\r" +
    "\n" +
    "        <div class=\"col-md-12\">\r" +
    "\n" +
    "            <h3 class=\"modal-title\">Keyword Selection</h3>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <div class=\"row\">\r" +
    "\n" +
    "        <div class=\"col-md-10\">\r" +
    "\n" +
    "            <p>Please chose one or more <a href=\"https://www.cuahsi.org/\" target=\"_blank\">CUAHSI</a> Keywords from the extended <a href=\"https://www.cuahsi.org/Ontology\" title=\"CUAHSI HIS Ontology\" target=\"_blank\">Hydrologic Ontology for Discovery</a>.</p>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"col-md-2\">\r" +
    "\n" +
    "            <button class=\"btn btn-primary pull-right\" \r" +
    "\n" +
    "            type=\"button\" \r" +
    "\n" +
    "            ng-disabled=\"dataset.tags.length === 0\"\r" +
    "\n" +
    "            ng-click=\"$dismiss()\">Close</button>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"modal-body\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"form-group row\" ng-show=\"tags['keywords - X-CUAHSI'].length === 0\">\r" +
    "\n" +
    "        <div class=\"col-md-2\">\r" +
    "\n" +
    "            <!-- empty -->\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"col-md-8\">\r" +
    "\n" +
    "            <p>Please wait while the list of keywords is loaded.</p>\r" +
    "\n" +
    "            <progressbar class=\"progress-striped active\" \r" +
    "\n" +
    "                         max=\"100\" \r" +
    "\n" +
    "                         value=\"storageController.progress.currval\">\r" +
    "\n" +
    "            </progressbar>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"col-md-2\">\r" +
    "\n" +
    "            <!-- empty -->\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <div class=\"form-group row\" ng-show=\"tags['keywords - X-CUAHSI'].length > 0\">\r" +
    "\n" +
    "        <div class=\"col-md-3\">\r" +
    "\n" +
    "            <div class=\"checkbox\" ng-repeat=\"tag in tags['keywords - X-CUAHSI']| limit:0:30\">\r" +
    "\n" +
    "                <label>\r" +
    "\n" +
    "                    <input\r" +
    "\n" +
    "                        type=\"checkbox\"\r" +
    "\n" +
    "                        name=\"selectedKeywords\"\r" +
    "\n" +
    "                        value=\"tag\"\r" +
    "\n" +
    "                        ng-checked=\"dataset.tags.indexOf(tag) > -1\"\r" +
    "\n" +
    "                        ng-click=\"keywordsController.toggleSelection(tag)\"> \r" +
    "\n" +
    "                    {{tag.name}}\r" +
    "\n" +
    "                </label>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"col-md-3\">\r" +
    "\n" +
    "            <div class=\"checkbox\" ng-repeat=\"tag in tags['keywords - X-CUAHSI']| limit:30:60\">\r" +
    "\n" +
    "                <label>\r" +
    "\n" +
    "                    <input\r" +
    "\n" +
    "                        type=\"checkbox\"\r" +
    "\n" +
    "                        name=\"selectedKeywords\"\r" +
    "\n" +
    "                        value=\"tag\"\r" +
    "\n" +
    "                        ng-checked=\"dataset.tags.indexOf(tag) > -1\"\r" +
    "\n" +
    "                        ng-click=\"keywordsController.toggleSelection(tag)\"> \r" +
    "\n" +
    "                    {{tag.name}}\r" +
    "\n" +
    "                </label>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "        <div class=\"col-md-3\">\r" +
    "\n" +
    "            <div class=\"checkbox\" ng-repeat=\"tag in tags['keywords - X-CUAHSI']| limit:60:90\">\r" +
    "\n" +
    "                <label>\r" +
    "\n" +
    "                    <input\r" +
    "\n" +
    "                        type=\"checkbox\"\r" +
    "\n" +
    "                        name=\"selectedKeywords\"\r" +
    "\n" +
    "                        value=\"tag\"\r" +
    "\n" +
    "                        ng-checked=\"dataset.tags.indexOf(tag) > -1\"\r" +
    "\n" +
    "                        ng-click=\"keywordsController.toggleSelection(tag)\"> \r" +
    "\n" +
    "                    {{tag.name}}\r" +
    "\n" +
    "                </label>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"col-md-3\">\r" +
    "\n" +
    "            <div class=\"checkbox\" ng-repeat=\"tag in tags['keywords - X-CUAHSI']| limit:90:120\">\r" +
    "\n" +
    "                <label>\r" +
    "\n" +
    "                    <input\r" +
    "\n" +
    "                        type=\"checkbox\"\r" +
    "\n" +
    "                        name=\"selectedKeywords\"\r" +
    "\n" +
    "                        value=\"tag\"\r" +
    "\n" +
    "                        ng-checked=\"dataset.tags.indexOf(tag) > -1\"\r" +
    "\n" +
    "                        ng-click=\"keywordsController.toggleSelection(tag)\"> \r" +
    "\n" +
    "                    {{tag.name}}\r" +
    "\n" +
    "                </label>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class=\"modal-footer\">\r" +
    "\n" +
    "    <button class=\"btn btn-primary\" \r" +
    "\n" +
    "            type=\"button\" \r" +
    "\n" +
    "            ng-disabled=\"dataset.tags.length === 0\"\r" +
    "\n" +
    "            ng-click=\"$dismiss()\">Close</button>\r" +
    "\n" +
    "</div>"
  );


  $templateCache.put('templates/licenseAndConditions.html',
    "<form class=\"form-horizontal\"\r" +
    "\n" +
    "      id=\"licenseForm\"\r" +
    "\n" +
    "      name=\"licenseForm\"\r" +
    "\n" +
    "      ng-controller=\"de.cismet.sip-html5-resource-registration.controllers.licenseController as licenseController\">\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <!-- Access Conditions -->\r" +
    "\n" +
    "    <div class=\"row form-group\"\r" +
    "\n" +
    "         ng-class=\"{'has-error':wizard.hasError === 'datasetAccessconditions'}\">\r" +
    "\n" +
    "        <label for=\"datasetAccessconditions\" class=\"col-md-2 form-control-label\">Access Conditions</label>\r" +
    "\n" +
    "        <div class=\"col-md-3\">\r" +
    "\n" +
    "            <select class=\"form-control\" id=\"datasetAccessconditions\" name=\"datasetAccessconditions\" \r" +
    "\n" +
    "                    ng-options=\"tag as tag.name for tag in tags['accessconditions'] | orderBy:'name' track by tag.name\"\r" +
    "\n" +
    "                    ng-model=\"dataset.accessconditions\"\r" +
    "\n" +
    "                    ng-change=\"showInfoMessage(dataset.accessconditions.description);\"\r" +
    "\n" +
    "                    required>\r" +
    "\n" +
    "            </select>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "     \r" +
    "\n" +
    "    <!-- License Statement -->\r" +
    "\n" +
    "    <div class=\"row form-group\"\r" +
    "\n" +
    "         ng-class=\"{'has-error':wizard.hasError === 'datasetLicensestatement'}\">\r" +
    "\n" +
    "        \r" +
    "\n" +
    "        <label for=\"datasetLicensestatement\" class=\"col-md-2 form-control-label\">License Statement</label>\r" +
    "\n" +
    "        <div class=\"col-md-8\">\r" +
    "\n" +
    "            <textarea class=\"form-control\" \r" +
    "\n" +
    "                      id=\"datasetDescription\" \r" +
    "\n" +
    "                      name=\"datasetLicensestatement\" \r" +
    "\n" +
    "                      placeholder=\"Additional conditions for accessing and using the data.\"\r" +
    "\n" +
    "                      rows=\"6\"\r" +
    "\n" +
    "                      ng-model=\"dataset.licensestatement\" \r" +
    "\n" +
    "                      ng-focus=\"showInfoMessage('Please provide a brief statement or URL to the license which applies to the usage of the dataset.')\"\r" +
    "\n" +
    "                      ng-required=\"dataset.accessconditions && dataset.accessconditions.name === 'other'\"\r" +
    "\n" +
    "                      ng-disabled=\"(dataset.accessconditions.name !== 'other') \r" +
    "\n" +
    "                                  && (dataset.accessconditions.name !== 'no limitations')\r" +
    "\n" +
    "                                  && (dataset.accessconditions.name !== 'for research only')\"\r" +
    "\n" +
    "                      ></textarea>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    \r" +
    "\n" +
    "    <!-- Contact Person -->\r" +
    "\n" +
    "    <div class=\"form-group row\" \r" +
    "\n" +
    "         ng-class=\"{'has-error':wizard.hasError === 'datasetContactperson'}\">\r" +
    "\n" +
    "        <label for=\"datasetContactperson\" \r" +
    "\n" +
    "               class=\"col-md-2 form-control-label\">Contact Person</label>\r" +
    "\n" +
    "        <div class=\"col-md-5\">\r" +
    "\n" +
    "            <input type=\"text\" class=\"form-control\" \r" +
    "\n" +
    "                   id=\"datasetContactperson\" name=\"datasetContactperson\" \r" +
    "\n" +
    "                   ng-attr-placeholder=\"{{licenseController.generateDOI ? 'Required' : 'Optional'}} point of contact information\"\r" +
    "\n" +
    "                   ng-model=\"dataset.contact.name\"\r" +
    "\n" +
    "                   ng-focus=\"showInfoMessage('Please provide a name of the contact person responsible for the establishment, management, maintenance and distribution of dataset or publication in the format Family name, Given name');\"\r" +
    "\n" +
    "                   ng-required=\"licenseController.generateDOI\">\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"col-md-3\">\r" +
    "\n" +
    "            <input type=\"email\" class=\"form-control\" \r" +
    "\n" +
    "                   id=\"datasetContactperson\" name=\"datasetContactemail\" \r" +
    "\n" +
    "                   placeholder=\"Optional email address\"\r" +
    "\n" +
    "                   ng-model=\"dataset.contact.email\"\r" +
    "\n" +
    "                   ng-focus=\"showInfoMessage('Please provide an email address of the contact person.');\">\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    \r" +
    "\n" +
    "    <!-- Contact Organisation -->\r" +
    "\n" +
    "    <div class=\"form-group row\" \r" +
    "\n" +
    "         ng-class=\"{'has-error':wizard.hasError === 'datasetOrganisation'}\">\r" +
    "\n" +
    "        <label for=\"datasetOrganisation\" \r" +
    "\n" +
    "               class=\"col-md-2 form-control-label\">Institution</label>\r" +
    "\n" +
    "        <div class=\"col-md-4\">\r" +
    "\n" +
    "            <input type=\"text\" class=\"form-control\" \r" +
    "\n" +
    "                   id=\"datasetOrganisation\" name=\"datasetOrganisation\" \r" +
    "\n" +
    "                   ng-attr-placeholder=\"{{licenseController.generateDOI ? 'Required' : 'Optional'}} name of the institution providing the dataset\"\r" +
    "\n" +
    "                   ng-model=\"dataset.contact.organisation\"\r" +
    "\n" +
    "                   ng-focus=\"showInfoMessage('Please provide a name of the organisation responsible for the establishment, management, maintenance and distribution of dataset or publication.');\"\r" +
    "\n" +
    "                   ng-required=\"licenseController.generateDOI\">\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"col-md-4\">\r" +
    "\n" +
    "            <input type=\"url\" class=\"form-control\" \r" +
    "\n" +
    "                   id=\"datasetOrganisationurl\" name=\"datasetOrganisationurl\" \r" +
    "\n" +
    "                   placeholder=\"Optional Website of the organisation\"\r" +
    "\n" +
    "                   ng-model=\"dataset.contact.url\"\r" +
    "\n" +
    "                   ng-focus=\"showInfoMessage('Please provide the url of the website of the name of the organisation.');\">\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    \r" +
    "\n" +
    "    <!-- Citation / self-provided DOI -->\r" +
    "\n" +
    "    <div class=\"row form-group\"\r" +
    "\n" +
    "         ng-class=\"{'has-error':wizard.hasError === 'datasetCitation'}\"\r" +
    "\n" +
    "         ng-if=\"licenseController.generateDOI === false\">\r" +
    "\n" +
    "        <label for=\"datasetCitation\" class=\"col-md-2 form-control-label\">Citation / DOI</label>\r" +
    "\n" +
    "        <div class=\"col-md-6\">\r" +
    "\n" +
    "            <textarea class=\"form-control\" \r" +
    "\n" +
    "                      id=\"datasetDescription\" \r" +
    "\n" +
    "                      name=\"datasetCitation\" \r" +
    "\n" +
    "                      placeholder=\"Optional citation information or manually provided Digital Object Identifier (DOI)\"\r" +
    "\n" +
    "                      rows=\"6\"\r" +
    "\n" +
    "                      ng-model=\"dataset.contact.description\" \r" +
    "\n" +
    "                      ng-disabled=\"dataset.$deposition !== null && dataset.$deposition.metadata.prereserve_doi.doi !== null\"\r" +
    "\n" +
    "                      ng-focus=\"showInfoMessage('Please enter a bibliographic citation or a manually provided Digital Object Identifier (<a href=\\'https://www.doi.org/\\' target=\\'_blank\\'>DOI</a>).<br/> If you want to generate a <strong>new</strong>DOI, you have to enable this Feature under <i>Dataset Description</i> and upload a new dataset.')\">  \r" +
    "\n" +
    "            </textarea>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <!-- Citation / self-provided DOI -->\r" +
    "\n" +
    "    <div class=\"row form-group\"\r" +
    "\n" +
    "         ng-class=\"{'has-error':wizard.hasError === 'datasetDeposition'}\"\r" +
    "\n" +
    "         ng-if=\"licenseController.generateDOI === true\">\r" +
    "\n" +
    "        <div class=\"col-md-2\">\r" +
    "\n" +
    "            <label for=\"datasetDeposition\" \r" +
    "\n" +
    "                   class=\"form-control-label\">Prereserved DOI\r" +
    "\n" +
    "            </label>\r" +
    "\n" +
    "       </div>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "        <!--<div class=\"col-md-10\">\r" +
    "\n" +
    "            <div class=\"row form-group\">-->\r" +
    "\n" +
    "                <div class=\"col-md-2\">\r" +
    "\n" +
    "                    <span class=\"label label-danger\" \r" +
    "\n" +
    "                      title=\"Preresevred DOI\">{{dataset.$deposition.metadata.prereserve_doi.doi}}\r" +
    "\n" +
    "                    </span>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <div class=\"col-md-2\">\r" +
    "\n" +
    "                    <select class=\"form-control\"   \r" +
    "\n" +
    "                        id=\"depositionUploadType\" \r" +
    "\n" +
    "                        name=\"depositionUploadType\" \r" +
    "\n" +
    "                        placeholder=\"DOI Upload Type\"\r" +
    "\n" +
    "                        ng-init=\"dataset.$deposition.metadata.upload_type = 'dataset'\" \r" +
    "\n" +
    "                        ng-model=\"dataset.$deposition.metadata.upload_type\"\r" +
    "\n" +
    "                        size=\"1\"\r" +
    "\n" +
    "                        required \r" +
    "\n" +
    "                        >\r" +
    "\n" +
    "                    <option value=\"publication\">Publication</option>\r" +
    "\n" +
    "                    <option value=\"poster\">Poster</option>\r" +
    "\n" +
    "                    <option value=\"presentation\">Presentation</option>\r" +
    "\n" +
    "                    <option value=\"dataset\">Dataset</option>\r" +
    "\n" +
    "                    <option value=\"image\">Image</option>\r" +
    "\n" +
    "                    <option value=\"video\">Video/Audio</option>\r" +
    "\n" +
    "                    <option value=\"software\">Software</option>\r" +
    "\n" +
    "                    </select> \r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "                <div class=\"col-md-4\">\r" +
    "\n" +
    "                <input type=\"checkbox\" \r" +
    "\n" +
    "                         ng-class=\"{'has-error':wizard.hasError === 'datasetDeposition'}\"\r" +
    "\n" +
    "                         ng-model=\"dataset.$deposition.metadata.grants\" \r" +
    "\n" +
    "                         ng-change=\"showInfoMessage('SWITCH-ON has received funding from the European Union\\'s Seventh Programme for research, technological development and demonstration under grant agreement No 603587. If you check this box, the grant agreement number will be associated with the DOI');\"> \r" +
    "\n" +
    "                SWITCH-ON FP7 Result\r" +
    "\n" +
    "                </div>        \r" +
    "\n" +
    "            <!--</div>\r" +
    "\n" +
    "        </div>-->\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "    <!-- Data Lineage -->\r" +
    "\n" +
    "    <div class=\"row form-group\"\r" +
    "\n" +
    "         ng-class=\"{'has-error':wizard.hasError === 'datasetLineage'}\">\r" +
    "\n" +
    "        <label for=\"datasetLineage\" class=\"col-md-2 form-control-label\">Data Lineage</label>\r" +
    "\n" +
    "        <div class=\"col-md-8\">\r" +
    "\n" +
    "            <textarea class=\"form-control\" \r" +
    "\n" +
    "                      id=\"datasetDescription\" \r" +
    "\n" +
    "                      name=\"datasetLineage\" \r" +
    "\n" +
    "                      placeholder=\"Optional data lineage / data provenance information\"\r" +
    "\n" +
    "                      rows=\"3\"\r" +
    "\n" +
    "                      ng-model=\"dataset.metadata[1].description\" \r" +
    "\n" +
    "                      ng-focus=\"showInfoMessage('Provide information on the sources used to create datasets. Links and citations can be included.')\">  \r" +
    "\n" +
    "            </textarea>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div> \r" +
    "\n" +
    "</form>\r" +
    "\n"
  );


  $templateCache.put('templates/openDataRegistration.html',
    "<form class=\"form-horizontal\"\r" +
    "\n" +
    "      id=\"odRegistrationForm\"\r" +
    "\n" +
    "      name=\"odRegistrationForm\"\r" +
    "\n" +
    "      ng-controller=\"de.cismet.sip-html5-resource-registration.controllers.odRegistrationController as odRegistrationController\">\r" +
    "\n" +
    "    <!-- Name -->\r" +
    "\n" +
    "    <div class=\"form-group row\" \r" +
    "\n" +
    "         ng-class=\"{'has-error':wizard.hasError === 'datasetName'}\">\r" +
    "\n" +
    "        <label for=\"datasetName\" \r" +
    "\n" +
    "               class=\"col-md-1 form-control-label\">Name</label>\r" +
    "\n" +
    "        <div class=\"col-md-8\">\r" +
    "\n" +
    "            <div tooltip=\"{{(dataset.name && dataset.$uploaded === true) ? 'The name of an uploaded dataset cannot be changed afterwards.' : null}}\">\r" +
    "\n" +
    "                <input type=\"text\" class=\"form-control disabled\" \r" +
    "\n" +
    "                       id=\"datasetName\" name=\"datasetName\" \r" +
    "\n" +
    "                       placeholder=\"Name of the dataset\"\r" +
    "\n" +
    "                       ng-model=\"dataset.name\"\r" +
    "\n" +
    "                       required\r" +
    "\n" +
    "                       ng-disabled=\"dataset.name && dataset.$uploaded === true\"\r" +
    "\n" +
    "                       ng-focus=\"showInfoMessage('Please provide a characteristic, and often unique, name by which the dataset is known.');\">\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        \r" +
    "\n" +
    "        <div class=\"col-md-3\">\r" +
    "\n" +
    "        <!-- Get DOI -->\r" +
    "\n" +
    "            <div class=\"input-group\"\r" +
    "\n" +
    "                tooltip=\"{{(dataset.$uploaded !== undefined && odRegistrationController.generateDOI === false) ? 'This feature must be enabled before the dataset is uploaded!' : null}}\">\r" +
    "\n" +
    "                <span class=\"input-group-addon\">\r" +
    "\n" +
    "                  <input type=\"checkbox\" \r" +
    "\n" +
    "                         ng-class=\"{'has-error':wizard.hasError === 'datasetDeposition'}\"\r" +
    "\n" +
    "                         ng-model=\"odRegistrationController.generateDOI\" \r" +
    "\n" +
    "                         ng-change=\"showInfoMessage('By selecting \\'Get Digital Object Identifier\\' you agree that your dataset is also uploaded to <a href=\\'http://help.zenodo.org/features/\\' title=\\'Zenodo Open Science Services\\' target=\\'_blank\\'>Zenodo</a> in order to obtain a persistent <a href=\\'https://en.wikipedia.org/wiki/Digital_object_identifier\\' target=\\'_blank\\'>Digital Object Identifier</a> (DOI).<br/>Zenodo is a research data repository. It was created by <a href=\\'https://www.openaire.eu\\' target=\\'_blank\\'>OpenAIRE<a/> and CERN to provide a place for researchers to deposit datasets. For further information please consult Zenodo\\'s <a href=\\'http://about.zenodo.org/terms\\' target=\\'_blank\\'>Terms of Use</a> and <a href=\\'http://about.zenodo.org/policies\\' target=\\'_blank\\'>Policies</a>.');\"\r" +
    "\n" +
    "                         ng-disabled=\"dataset.$uploaded !== undefined\"> \r" +
    "\n" +
    "                </span>\r" +
    "\n" +
    "                <span class=\"input-group-btn\">\r" +
    "\n" +
    "                    <label class=\"btn btn-success\" \r" +
    "\n" +
    "                                btn-checkbox=\"true\"\r" +
    "\n" +
    "                                ng-class=\"{'btn-danger':wizard.hasError === 'datasetDeposition'}\"\r" +
    "\n" +
    "                                ng-model=\"odRegistrationController.generateDOI\" \r" +
    "\n" +
    "                                ng-click=\"dataset.$uploaded !== undefined || (odRegistrationController.generateDOI = !odRegistrationController.generateDOI); showInfoMessage('By selecting \\'Generate DOI\\' you agree that your dataset is also uploaded to <a href=\\'http://help.zenodo.org/features/\\' title=\\'Zenodo Open Science Services\\' target=\\'_blank\\'>Zenodo</a> in order to obtain a persistent <a href=\\'https://en.wikipedia.org/wiki/Digital_object_identifier\\' target=\\'_blank\\'>Digital Object Identifier</a> (DOI).<br/>Zenodo is a research data repository. It was created by <a href=\\'https://www.openaire.eu\\' target=\\'_blank\\'>OpenAIRE<a/> and CERN to provide a place for researchers to deposit datasets. For further information please consult Zenodo\\'s <a href=\\'http://about.zenodo.org/terms\\' target=\\'_blank\\'>Terms of Use</a> and <a href=\\'http://about.zenodo.org/policies\\' target=\\'_blank\\'>Policies</a>.');\"\r" +
    "\n" +
    "                                ng-disabled=\"dataset.$uploaded !== undefined\"> \r" +
    "\n" +
    "                             Get Digital Object Identifier\r" +
    "\n" +
    "                    </label>\r" +
    "\n" +
    "                </span>\r" +
    "\n" +
    "            </div>    \r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <!-- Link Buttons-->\r" +
    "\n" +
    "    <div class=\"row form-group\"\r" +
    "\n" +
    "         ng-class=\"{'has-error':wizard.hasError === 'datasetUploadchoice'}\"\r" +
    "\n" +
    "         ng-show = \"dataset.$uploaded === undefined\">\r" +
    "\n" +
    "            <label for=\"datasetUploadchoice\" class=\"col-md-1 form-control-label\">Link to Data</label>\r" +
    "\n" +
    "            \r" +
    "\n" +
    "            <div class=\"col-md-5\">\r" +
    "\n" +
    "            <!-- Fake disabled Link Button (tooltips do not work with ng-disabled!) -->    \r" +
    "\n" +
    "            <button class=\"btn btn-primary disabled\" \r" +
    "\n" +
    "                    type=\"button\"\r" +
    "\n" +
    "                    tooltip=\"{{!odRegistrationController.generateDOI ? null : 'Please uncheck \\'Get Digital Object Identifier\\' to enable this functionality'}}\"\r" +
    "\n" +
    "                    ng-class=\"{'btn-danger':wizard.hasError === 'datasetUploadchoice'}\"\r" +
    "\n" +
    "                    ng-if=\"odRegistrationController.generateDOI\">Provide Link to existing Dataset\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "            \r" +
    "\n" +
    "            <!--  Enabled Link Button (tooltips do not work with ng-disabled!) -->    \r" +
    "\n" +
    "            <button class=\"btn btn-primary\" \r" +
    "\n" +
    "                    type=\"button\"\r" +
    "\n" +
    "                    tooltip=\"{{!odRegistrationController.generateDOI ? null : 'Please uncheck \\'GGet Digital Object Identifier\\' to enable this functionality'}}\"\r" +
    "\n" +
    "                    ng-class=\"{'btn-danger':wizard.hasError === 'datasetUploadchoice'}\"\r" +
    "\n" +
    "                    ng-click=\"dataset.$uploaded = false; odRegistrationController.generateDOI = false;\"\r" +
    "\n" +
    "                    ng-if=\"!odRegistrationController.generateDOI\">Provide Link to existing Dataset\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "            \r" +
    "\n" +
    "            <!-- HacketyHack! -->\r" +
    "\n" +
    "            <span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;or&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>\r" +
    "\n" +
    "            \r" +
    "\n" +
    "            <!-- Fake disabled Upload button -->\r" +
    "\n" +
    "            <button class=\"btn btn-primary disabled\" \r" +
    "\n" +
    "                    type=\"button\"\r" +
    "\n" +
    "                    ng-class=\"{'btn-danger':(wizard.hasError === 'datasetUploadchoice' || wizard.hasError === 'datasetUploadchoiceName')}\"\r" +
    "\n" +
    "                    tooltip=\"{{!dataset.name || dataset.name.length < 3 ? 'Please enter the name of the dataset to enable the Data Upload Tool' : 'Open the Data Upload Tool'}}\"\r" +
    "\n" +
    "                    ng-if=\"!dataset.name || dataset.name.length < 3\">Upload new Dataset\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "            <!-- Enabled Upload button -->\r" +
    "\n" +
    "            <a class=\"btn btn-primary\" \r" +
    "\n" +
    "               type=\"button\"\r" +
    "\n" +
    "               ng-class=\"{'btn-danger':(wizard.hasError === 'datasetUploadchoice' || wizard.hasError === 'datasetUploadchoiceName')}\"\r" +
    "\n" +
    "               ng-href=\"{{config.uploadtool.baseUrl}}?datasetname={{dataset.name}}&generateDOI={{odRegistrationController.generateDOI}}\"\r" +
    "\n" +
    "               tooltip=\"{{!dataset.name || dataset.name.length < 3 ? 'Please enter the name of the dataset to enable the Data Upload Tool' : 'Open the Data Upload Tool'}}\"\r" +
    "\n" +
    "               ng-if=\"dataset.name && dataset.name.length >= 3\">Upload new Dataset\r" +
    "\n" +
    "            </a> \r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <!-- Link -->\r" +
    "\n" +
    "    <div class=\"row form-group\"\r" +
    "\n" +
    "         ng-class=\"{'has-error':wizard.hasError === 'datasetContentlocation'}\"\r" +
    "\n" +
    "         ng-show = \"dataset.$uploaded !== undefined\"\r" +
    "\n" +
    "         tooltip=\"{{(dataset.$uploaded === true && dataset.representation[0].contentlocation) ? 'The link of an uploaded dataset cannot be changed afterwards.' : null}}\">\r" +
    "\n" +
    "        <label for=\"datasetContentlocation\" class=\"col-md-1 form-control-label\">Link to Data</label>\r" +
    "\n" +
    "        <!-- Function -->\r" +
    "\n" +
    "        <div class=\"col-md-2\">\r" +
    "\n" +
    "            <select class=\"form-control\" \r" +
    "\n" +
    "                    ng-style=\"(!dataset.representation[0].function \r" +
    "\n" +
    "                                && !odRegistrationForm.datasetFunction.$touched) && {'color':'#999999'}\" \r" +
    "\n" +
    "                    id=\"datasetFunction\" \r" +
    "\n" +
    "                    name=\"datasetFunction\" \r" +
    "\n" +
    "                    placeholder=\"Type of Link\"\r" +
    "\n" +
    "                    ng-options=\"tag as tag.name for tag in tags['function'] | function:'name' track by tag.name\"\r" +
    "\n" +
    "                    ng-model=\"dataset.representation[0].function\"\r" +
    "\n" +
    "                    ng-change=\"showInfoMessage(dataset.representation[0].function.description);\"\r" +
    "\n" +
    "                    ng-disabled=\"dataset.$uploaded === true && dataset.representation[0].function\"\r" +
    "\n" +
    "                    tooltip=\"{{(dataset.$uploaded === true && dataset.representation[0].function) ? 'The type of the link of an uploaded dataset cannot be changed afterwards.' : null}}\"\r" +
    "\n" +
    "                    required>\r" +
    "\n" +
    "                <option style=\"color:#999999\" ng-show=\"!dataset.representation[0].function\" value=\"\">Type of Link</option>\r" +
    "\n" +
    "            </select>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <!-- Content Location -->\r" +
    "\n" +
    "        <div class=\"col-md-6\">\r" +
    "\n" +
    "            <input type=\"url\" \r" +
    "\n" +
    "                   class=\"form-control\" \r" +
    "\n" +
    "                   name=\"datasetContentlocation\" \r" +
    "\n" +
    "                   id=\"datasetContentlocation\" \r" +
    "\n" +
    "                   placeholder=\"URL of the dataset\"\r" +
    "\n" +
    "                   ng-model=\"dataset.representation[0].contentlocation\"\r" +
    "\n" +
    "                   ng-focus=\"(wizard.hasError === 'datasetContentlocation') ? showInfoMessage('This dataset is already registered in the SWITCH-ON Spatial Information Platform', 'info', 'fa-warning') : showInfoMessage('Please provide a download link to the dataset or a link to additional information about the dataset.');\"\r" +
    "\n" +
    "                   ng-change=\"odRegistrationController.checkLink(dataset.representation[0].contentlocation)\"\r" +
    "\n" +
    "                   ng-model-options='{ debounce: 1000 }'\r" +
    "\n" +
    "                   ng-disabled=\"dataset.$uploaded === true && dataset.representation[0].contentlocation\"\r" +
    "\n" +
    "                   tooltip=\"{{(dataset.$uploaded === true && dataset.representation[0].contentlocation) ? 'The link of an uploaded dataset cannot be changed afterwards.' : null}}\"\r" +
    "\n" +
    "                   required>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <!-- Content Type -->\r" +
    "\n" +
    "        <div class=\"col-md-3\">\r" +
    "\n" +
    "            <select class=\"form-control\" \r" +
    "\n" +
    "                    ng-style=\"(!dataset.representation[0].contenttype \r" +
    "\n" +
    "                                && !odRegistrationForm.datasetContenttype.$touched) && {'color':'#999999'}\" \r" +
    "\n" +
    "                    id=\"datasetContenttype\" \r" +
    "\n" +
    "                    name=\"datasetContenttype\" \r" +
    "\n" +
    "                    placeholder=\"Choose file format\"\r" +
    "\n" +
    "                    ng-options=\"tag as tag.description for tag in tags['content type'] | contenttype:'description' track by tag.name\"\r" +
    "\n" +
    "                    ng-model=\"dataset.representation[0].contenttype\"\r" +
    "\n" +
    "                    ng-change=\"showInfoMessage('The <a href=\\'https://en.wikipedia.org/wiki/Media_type\\' target=\\'_blank\\'>media type</a> of the ' + dataset.representation[0].contenttype.description +  ' dataset file is <i>'+dataset.representation[0].contenttype.name + '</i>.');\"\r" +
    "\n" +
    "                    required>\r" +
    "\n" +
    "                <option style=\"color:#999999\" ng-show=\"!dataset.representation[0].contenttype\" value=\"\">Choose file format</option>\r" +
    "\n" +
    "            </select>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <!-- Description -->\r" +
    "\n" +
    "    <div class=\"form-group row\"\r" +
    "\n" +
    "         ng-class=\"{'has-error':wizard.hasError === 'datasetDescription'}\">\r" +
    "\n" +
    "        <label for=\"datasetDescription\" class=\"col-md-1 form-control-label\">Description</label>\r" +
    "\n" +
    "        <div class=\"col-md-8\">\r" +
    "\n" +
    "            <textarea class=\"form-control\" \r" +
    "\n" +
    "                      id=\"datasetDescription\" \r" +
    "\n" +
    "                      name=\"datasetDescription\" \r" +
    "\n" +
    "                      placeholder=\"Please describe the dataset. Use between 100 and 500 words.\"\r" +
    "\n" +
    "                      rows=\"8\"\r" +
    "\n" +
    "                      ng-model=\"dataset.description\" \r" +
    "\n" +
    "                      ng-focus=\"showInfoMessage('Please provide a brief narrative summary of the content of the dataset. Use between 100 and 500 words.')\"\r" +
    "\n" +
    "                      required></textarea>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <!-- Keywords -->\r" +
    "\n" +
    "    <div class=\"form-group row\">\r" +
    "\n" +
    "        <label  class=\"col-md-1 form-control-label\">Keywords</label>\r" +
    "\n" +
    "        <div class=\"col-md-8\">\r" +
    "\n" +
    "            <div class=\"form-control switchon-keywords-form\"\r" +
    "\n" +
    "                 ng-click=\"showInfoMessage('Please select one or more keywords from the <strong>extended</strong> CUAHSI Hydrologic Ontology for Discovery that best characterize the dataset. <br>Please click <a href=\\'http://his.cuahsi.org/ontologyfiles.html\\' target=\\'_blank\\'>here</a> for more information about the CUAHSI ontology. Get in touch with the <a href=\\'mailto:switchon.wm@gmail.com\\'>SWITCH-ON Consortium</a> if you want to make a proposal for new keywords.'); odRegistrationController.selectKeywords();\">\r" +
    "\n" +
    "                <span ng-repeat=\"tag in dataset.tags\">\r" +
    "\n" +
    "                    <span class=\"label label-primary\">{{tag.name}}</span>\r" +
    "\n" +
    "                </span>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "    <!-- disabled as requested in https://github.com/switchonproject/switchon-tools/issues/1#issuecomment-180390096-->\r" +
    "\n" +
    "    <!--<div class=\"form-group row\"\r" +
    "\n" +
    "         ng-class=\"{'has-error':wizard.hasError === 'datasetTags'}\">\r" +
    "\n" +
    "        <label for=\"datasetTags\" class=\"col-md-1 form-control-label\">Keywords</label>\r" +
    "\n" +
    "        <div class=\"col-md-8\">\r" +
    "\n" +
    "            <textarea class=\"form-control\" id=\"keyword-box\" rows=\"7\"></textarea>\r" +
    "\n" +
    "            <ui-select  id=\"datasetTags\"\r" +
    "\n" +
    "                        name=\"datasetTags\"\r" +
    "\n" +
    "                        class=\"form-control\"\r" +
    "\n" +
    "                        multiple limit=\"20\"\r" +
    "\n" +
    "                        ng-model=\"dataset.tags\" \r" +
    "\n" +
    "                        theme=\"bootstrap\" \r" +
    "\n" +
    "                        ng-disabled=\"disabled\" \r" +
    "\n" +
    "                        sortable=\"true\" \r" +
    "\n" +
    "                        on-select=\"showInfoMessage('Please select one or more keywords from the <strong>extended</strong> CUAHSI Hydrologic Ontology for Discovery (X-CUAHSI) that best characterize the dataset. <br>Please click <a href=\\'http://his.cuahsi.org/ontologyfiles.html\\' target=\\'_blank\\'>here</a> for more information about the CUAHSI ontology. Get in touch with the <a href=\\'mailto:switchon.wm@gmail.com\\'>SWITCH-ON Consortium</a> if you want to make a proposal for new keywords and thus an extension of the X-CUSHAI ontology!')\">\r" +
    "\n" +
    "              \r" +
    "\n" +
    "                <ui-select-match \r" +
    "\n" +
    "                    placeholder=\"Please click here to open a list of selectable CUAHSI keywords.\">\r" +
    "\n" +
    "                    {{$item.name}}\r" +
    "\n" +
    "                </ui-select-match>\r" +
    "\n" +
    "\r" +
    "\n" +
    "                <ui-select-choices ng-show=\"false\" repeat=\"tag in tags['keywords - X-CUAHSI'] | filter: {name: $select.search}\"\r" +
    "\n" +
    "                                   group-by=\"odRegistrationController.groupBy\">\r" +
    "\n" +
    "                    <div ng-bind-html=\"tag.name | highlight: $select.search\"></div>\r" +
    "\n" +
    "                </ui-select-choices>\r" +
    "\n" +
    "            </ui-select>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>-->\r" +
    "\n" +
    "</form>\r" +
    "\n" +
    "\r" +
    "\n"
  );


  $templateCache.put('templates/summary.html',
    "<div ng-controller=\"de.cismet.sip-html5-resource-registration.controllers.summaryController as summaryController\">\r" +
    "\n" +
    "    <div class=\"row\">\r" +
    "\n" +
    "        <div class=\"col-md-6\">\r" +
    "\n" +
    "            <!-- Name -->\r" +
    "\n" +
    "            <div class=\"row\">\r" +
    "\n" +
    "                <label class=\"col-md-3\">Name</label>\r" +
    "\n" +
    "                <div class=\"col-md-9\">{{dataset.name}}</div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <!-- Link -->\r" +
    "\n" +
    "            <div class=\"row\">\r" +
    "\n" +
    "                <label class=\"col-md-3\">Link to data</label>\r" +
    "\n" +
    "                <div class=\"col-md-9\">\r" +
    "\n" +
    "                    <a href=\"{{dataset.representation[0].contentlocation}}\" target=\"_blank\" title=\"{{dataset.name}}\">{{dataset.representation[0].contentlocation}}</a>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            \r" +
    "\n" +
    "            <!-- Function -->\r" +
    "\n" +
    "            <div class=\"row\">\r" +
    "\n" +
    "                <label class=\"col-md-3\">Type of Link</label>\r" +
    "\n" +
    "                <div class=\"col-md-9\">\r" +
    "\n" +
    "                    <span class=\"label label-success\" \r" +
    "\n" +
    "                          style=\"text-transform: capitalize;\" \r" +
    "\n" +
    "                          title=\"{{dataset.representation[0].function.description}}\">\r" +
    "\n" +
    "                        {{dataset.representation[0].function.name}}\r" +
    "\n" +
    "                    </span>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <!-- Content-Type -->\r" +
    "\n" +
    "            <div class=\"row\">\r" +
    "\n" +
    "                <label class=\"col-md-3\">Format</label>\r" +
    "\n" +
    "                <div class=\"col-md-9\">\r" +
    "\n" +
    "                    <span class=\"label label-success\" \r" +
    "\n" +
    "                          title=\"{{dataset.representation[0].contenttype.description}}\">\r" +
    "\n" +
    "                        {{dataset.representation[0].contenttype.name}}\r" +
    "\n" +
    "                    </span>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <!-- Desciption -->\r" +
    "\n" +
    "            <div class=\"row\">\r" +
    "\n" +
    "                <label class=\"col-md-3\">Description</label>\r" +
    "\n" +
    "                <div class=\"col-md-9\">\r" +
    "\n" +
    "                    <p>{{dataset.description}}</p>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <!-- Keywords -->\r" +
    "\n" +
    "            <div class=\"row\">\r" +
    "\n" +
    "                <label class=\"col-md-3\">Keywords</label>\r" +
    "\n" +
    "                <div class=\"col-md-9\">\r" +
    "\n" +
    "                    <span ng-repeat=\"tag in dataset.tags\">\r" +
    "\n" +
    "                        <span class=\"label label-primary\">{{tag.name}}</span>\r" +
    "\n" +
    "                    </span>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <!-- Access Conditions -->\r" +
    "\n" +
    "            <div class=\"row\">\r" +
    "\n" +
    "                <label class=\"col-md-3\">License</label>\r" +
    "\n" +
    "                <div class=\"col-md-9\">\r" +
    "\n" +
    "                    <span class=\"label label-warning\" \r" +
    "\n" +
    "                          title=\"{{dataset.accessconditions.description | htmlToPlaintext}}\">{{dataset.accessconditions.name}}</span>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <!-- License Statement -->\r" +
    "\n" +
    "            <div class=\"row\" ng-if=\"dataset.licensestatement\">\r" +
    "\n" +
    "                <label class=\"col-md-3\">License</label>\r" +
    "\n" +
    "                <div class=\"col-md-9\">\r" +
    "\n" +
    "                    <p>{{dataset.licensestatement}}</p>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <!-- Contact Person -->\r" +
    "\n" +
    "            <div class=\"row\" ng-if=\"dataset.contact && dataset.contact.name\">\r" +
    "\n" +
    "                <label class=\"col-md-3\">Contact Person</label>\r" +
    "\n" +
    "                <div class=\"col-md-9\">\r" +
    "\n" +
    "                    <span ng-if=\"dataset.contact.name\">{{dataset.contact.name}} </span>\r" +
    "\n" +
    "                    <span ng-if=\"dataset.contact.email\">\r" +
    "\n" +
    "                        &lt;\r" +
    "\n" +
    "                        <a ng-if=\"dataset.contact.email.indexOf(' ') === -1\" href=\"mailto:{{dataset.contact.email}}\">{{dataset.contact.email}}</a>\r" +
    "\n" +
    "                        <span ng-if=\"dataset.contact.email.indexOf(' ') !== -1\">{{dataset.contact.email}}</span>\r" +
    "\n" +
    "                        &gt; \r" +
    "\n" +
    "                    </span>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            \r" +
    "\n" +
    "            <!-- Organisation (Institute) -->\r" +
    "\n" +
    "            <div class=\"row\" ng-if=\"dataset.contact && dataset.contact.organisation\">\r" +
    "\n" +
    "                <label class=\"col-md-3\">Institute</label>\r" +
    "\n" +
    "                <div class=\"col-md-9\">\r" +
    "\n" +
    "                    <span ng-if=\"dataset.contact.organisation && !dataset.contact.url\">{{dataset.contact.organisation}}</span>\r" +
    "\n" +
    "                    <span ng-if=\"dataset.contact.organisation && dataset.contact.url\"> \r" +
    "\n" +
    "                        <a href=\"{{dataset.contact.url}}\" target=\"_blank\" rel=\"nofollow\">{{dataset.contact.organisation}}</a>\r" +
    "\n" +
    "                    </span>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            \r" +
    "\n" +
    "            <!-- Citation / manual DOI -->\r" +
    "\n" +
    "            <div class=\"row\" \r" +
    "\n" +
    "                 ng-if=\"summaryController.generateDOI === false && dataset.contact && dataset.contact.description\">\r" +
    "\n" +
    "                <label class=\"col-md-3\">Citation / DOI</label>\r" +
    "\n" +
    "                <div class=\"col-md-9\">\r" +
    "\n" +
    "                    {{dataset.contact.description}}\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            \r" +
    "\n" +
    "            <!-- Citation / DOI -->\r" +
    "\n" +
    "            <div class=\"row\" \r" +
    "\n" +
    "                 ng-if=\"summaryController.generateDOI === true\">\r" +
    "\n" +
    "                <label class=\"col-md-3\">Prereserved DOI</label>\r" +
    "\n" +
    "                <div class=\"col-md-9\">\r" +
    "\n" +
    "                    <span class=\"label label-danger\" \r" +
    "\n" +
    "                      title=\"Preresevred DOI\">{{dataset.$deposition.metadata.prereserve_doi.doi}}\r" +
    "\n" +
    "                    </span>\r" +
    "\n" +
    "                    <span>&nbsp;{{dataset.$deposition.metadata.upload_type}}</span>\r" +
    "\n" +
    "                    <span ng-if=\"dataset.$deposition.metadata.grants === true\"> / SWITCH-ON FP7 Result</span>        \r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "\r" +
    "\n" +
    "            <!-- Lineage -->\r" +
    "\n" +
    "            <div class=\"row\" ng-if=\"dataset.metadata[1].description && dataset.metadata[1].type.name === 'lineage meta-data'\">\r" +
    "\n" +
    "                <label class=\"col-md-3\">Data Lineage</label>\r" +
    "\n" +
    "                <div class=\"col-md-9\">\r" +
    "\n" +
    "                    {{dataset.metadata[1].description}}\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div>\r" +
    "\n" +
    "            \r" +
    "\n" +
    "            <!-- Lineage -->\r" +
    "\n" +
    "            <div class=\"row\" ng-if=\"summaryController.config.developmentMode === true\">\r" +
    "\n" +
    "                <label class=\"col-md-3\">DEBUG</label>\r" +
    "\n" +
    "                <div class=\"col-md-9\">\r" +
    "\n" +
    "                <button class=\"btn btn-danger\" \r" +
    "\n" +
    "                        type=\"button\"  \r" +
    "\n" +
    "                        ng-if=\"summaryController.config.developmentMode === true || storageController.progress.error\"\r" +
    "\n" +
    "                        ng-click=\"summaryController.saveJSON()\" \r" +
    "\n" +
    "                        ng-href=\"{{ url}}\">\r" +
    "\n" +
    "                    Download Meta-Data \r" +
    "\n" +
    "                </button>\r" +
    "\n" +
    "                </div>\r" +
    "\n" +
    "            </div> \r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"col-md-6\">\r" +
    "\n" +
    "            <leaflet id=\"summarymap\" \r" +
    "\n" +
    "                 defaults=\"mapData.defaults\" \r" +
    "\n" +
    "                 layers=\"mapData.layers\"\r" +
    "\n" +
    "                 center=\"mapData.center\"\r" +
    "\n" +
    "                 height=\"460px\" width=\"540px\">   \r" +
    "\n" +
    "             </leaflet>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "\r" +
    "\n"
  );


  $templateCache.put('templates/wizard-step-tpl.html',
    "<section ng-show=\"selected\" ng-class=\"{current: selected, done: completed}\" class=\"step\">\r" +
    "\n" +
    "    <div class=\"panel panel-primary\">\r" +
    "\n" +
    "        <div class=\"panel-heading\">\r" +
    "\n" +
    "            <h1 class=\"panel-title\">{{wzTitle}}</h1>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"panel-body\">\r" +
    "\n" +
    "            <div ng-transclude></div>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "        <div class=\"panel-footer clearfix\">\r" +
    "\n" +
    "            <a class=\"btn btn-primary pull-left\"\r" +
    "\n" +
    "               href=\"mailto:switchon.odr@gmail.com?subject=Open-Data Registration Tool\">\r" +
    "\n" +
    "                <span class=\"fa fa-fw fa-envelope\"></span>\r" +
    "\n" +
    "                <span>Feedback</span>\r" +
    "\n" +
    "            </a>\r" +
    "\n" +
    "            <button type=\"button\" \r" +
    "\n" +
    "                    class=\"btn btn-primary pull-right\" \r" +
    "\n" +
    "                    wz-next \r" +
    "\n" +
    "                    ng-disabled=\"!wzData.canProceed\">\r" +
    "\n" +
    "                {{wzData.proceedButtonText}}\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "            <span class=\"pull-right\">&nbsp;</span>\r" +
    "\n" +
    "            <button type=\"button\" \r" +
    "\n" +
    "                    class=\"btn btn-default pull-right\" \r" +
    "\n" +
    "                    wz-previous \r" +
    "\n" +
    "                    ng-disabled=\"!wzData.canGoBack\">\r" +
    "\n" +
    "                Previous\r" +
    "\n" +
    "            </button>\r" +
    "\n" +
    "        </div>\r" +
    "\n" +
    "    </div>\r" +
    "\n" +
    "</section>"
  );


  $templateCache.put('templates/wizard-tpl.html',
    "<div>\r" +
    "\n" +
    "    <div class=\"steps\" ng-transclude></div>\r" +
    "\n" +
    "    <ul class=\"steps-indicator steps-{{getEnabledSteps().length}}\" ng-if=\"!hideIndicators\">\r" +
    "\n" +
    "      <li ng-class=\"{default: !step.completed && !step.selected, \r" +
    "\n" +
    "                  current: step.selected && !step.completed, \r" +
    "\n" +
    "                  done: step.completed && !step.selected, \r" +
    "\n" +
    "                  editing: step.selected && step.completed}\" \r" +
    "\n" +
    "                  ng-repeat=\"step in getEnabledSteps()\">\r" +
    "\n" +
    "        <a ng-click=\"goTo(step)\">{{step.title || step.wzTitle}}</a>\r" +
    "\n" +
    "      </li>\r" +
    "\n" +
    "    </ul>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );

}]);

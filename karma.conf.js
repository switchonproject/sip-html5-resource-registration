    // Karma configuration
// http://karma-runner.github.io/0.10/config/configuration-file.html

module.exports = function(config) {
  config.set({
    // base path, that will be used to resolve files and exclude
    basePath: '',

    // testing framework to use (jasmine/mocha/qunit/...)
    frameworks: ['jasmine'],
    
   plugins:[
             'karma-jasmine',
             'karma-requirejs',
             'karma-coverage',
             'karma-junit-reporter',
             'karma-phantomjs-launcher',
             'karma-chrome-launcher',
             'karma-ng-html2js-preprocessor'
             ],

    // list of files / patterns to load in the browser
    files: [
        'target/dist/bower_components/es5-shim/es5-shim.js',
        'target/dist/bower_components/json3/lib/json3.min.js',
        'target/dist/bower_components/jquery/dist/jquery.min.js',
        'target/dist/bower_components/angular/angular.js',
        'target/dist/bower_components/angular-animate/angular-animate.min.js',
        'target/dist/bower_components/angular-resource/angular-resource.js',
        'target/dist/bower_components/angular-sanitize/angular-sanitize.min.js',
        'target/dist/bower_components/angular-ui-router/release/angular-ui-router.js',
        'target/dist/bower_components/angular-bootstrap/ui-bootstrap.min.js',
        'target/dist/bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'target/dist/bower_components/leaflet/dist/leaflet.js',
        'target/dist/bower_components/angular-leaflet-directive/dist/angular-leaflet-directive.js',
        'target/dist/bower_components/leaflet-draw/dist/leaflet.draw-src.js',
        'target/dist/bower_components/Wicket/wicket.js',
        'target/dist/bower_components/Wicket/wicket-leaflet.js',
        'target/dist/bower_components/angular-wizard/dist/angular-wizard.min.js',
        'target/dist/bower_components/ui-select/dist/select.min.js',
        'target/dist/bower_components/angular-uuid-service/angular-uuid-service.min.js',
        'target/dist/scripts/app.js',
        'target/dist/scripts/controllers/_module.js',
        'target/dist/scripts/controllers/masterController.js',
        'target/dist/scripts/controllers/odRegistrationController.js',
        'target/dist/scripts/controllers/keywordsController.js',
        'target/dist/scripts/controllers/geoLocationController.js',
        'target/dist/scripts/controllers/licenseController.js',
        'target/dist/scripts/controllers/summaryController.js',
        'target/dist/scripts/controllers/storageController.js',
        'target/dist/scripts/directives/_module.js',
        'target/dist/scripts/services/_module.js',
        'target/dist/scripts/services/dataset.js',
        'target/dist/scripts/services/geoTools.js',
        'target/dist/scripts/services/tagGroupService.js',
        'target/dist/scripts/services/countriesService.js',
        'target/dist/scripts/services/searchService.js',
        'target/dist/scripts/services/storageService.js',
        'target/dist/scripts/factories/_module.js',
        'target/dist/scripts/factories/appConfigFactory.js',
        'target/dist/scripts/filters/_module.js',
        'target/dist/scripts/filters/contenttypeFilter.js',
        'target/dist/scripts/filters/limitFilter.js',
        'target/dist/scripts/filters/plainTextFilter.js',
        'target/dist/bower_components/angular-mocks/angular-mocks.js',
        'app/templates/confirmation.html',
        'app/templates/geographicLocation.html',
        'app/templates/keywordSelection.html',
        'app/templates/licenseAndConditions.html',
        'app/templates/openDataRegistration.html',
        'app/templates/summary.html',
        'app/templates/wizard-step-tpl.html',
        'app/templates/wizard-tpl.html',
        'app/views/myView.html',
        'test/spec/controllers/myController.js',
        {pattern: 'test/res/**/*.json', watched: true, included: true, served: true}
    ],

    // list of files / patterns to exclude
    exclude: [],

    // web server port
    port: 8088,

    // level of logging
    // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: false,


    // Start these browsers, currently available:
    // - Chrome
    // - ChromeCanary
    // - Firefox
    // - Opera
    // - Safari (only Mac)
    // - PhantomJS
    // - IE (only Windows)
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, it capture browsers, run tests and exit
    singleRun: true,
    
    preprocessors: {
        '**/*.json': ['gb-json2js'],
        '**/templates/**/*.html': ['ng-html2js'],
        '**/views/**/*.html': ['ng-html2js']
    },
    
    ngHtml2JsPreprocessor: {
        moduleName: 'templates'
    },
    
    reporters: ['progress', 'junit'],
    junitReporter: {
        outputFile: 'test-results.xml'
    }
  });
};

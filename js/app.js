'use strict';
var fs = require('fs');
var ws = fs.createWriteStream('data/sao.json');


angular.module('app.router',['ui.router','pouchdb','ui.bootstrap']).config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/general');

    $stateProvider.
    state('general',{
        url:'/general',
        templateUrl:'template/records.html',
        controller: "generalController"
    }).
    state('list',{
        url:'/list',
        templateUrl:'template/reports.html',
        controller:'reportController'
    })

    ;
})
;

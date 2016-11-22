'use strict';
var fs = require('fs');
// var db = new PouchDB('sao');
var ws = fs.createWriteStream('data/sao.json');
// db.load('data/sao.json').then(function () {
//     //return db.put({ _id: '_local/preloaded' });
// });

angular.module('app.router',['ui.router','pouchdb']).config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/general');

    $stateProvider.
    state('general',{
        url:'/general',
        templateUrl:'template/partial-general.html',
        controller: "generalController"
    }).
    state('list',{
    url:'/list',
    templateUrl:'template/records.html',
    controller:'generalController'
    });
})
;

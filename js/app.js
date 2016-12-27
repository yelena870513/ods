'use strict';
//fs y ws son los manager para guardar en fichero la base de datos una vez terminado de gestionar todo.
var fs = require('fs');
var ws = fs.createWriteStream('data/sao.json');


angular.module('app.sao',['ui.router','pouchdb','ui.bootstrap','chart.js']).config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/general');
//Las principales rutas de la aplicacion
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
        . state('charts',{
            url:'/charts',
            templateUrl:'template/charts.html',
            controller:'chartController'
        })

    ;
})
;

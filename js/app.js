'use strict';
//fs y ws son los manager para guardar en fichero la base de datos una vez terminado de gestionar todo.
var fs = require('fs');
var ws = fs.createWriteStream('data/sao.json');



angular.module('app.sao',['ui.router','pouchdb','ui.bootstrap','chart.js','ngCookies']).config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/general');
//Las principales rutas de la aplicacion
    $stateProvider.
    state('general',{
        url:'/general',
        templateUrl:'template/records.html',
        controller: "generalController"
    }).
    ////Reportes
    state('list',{
        url:'/list',
        templateUrl:'template/reports.html',
        controller:'reportController'
    }) .
    state('list.general',{
        url:'/general',
        templateUrl:'template/data-table/general-table.html',
        controller:'reportController'
    }).
    state('list.espuma',{
        url:'/espuma',
        templateUrl:'template/data-table/espuma-table.html',
        controller:'reportController'
    }).
    state('list.aire',{
        url:'/aire',
        templateUrl:'template/data-table/aire-table.html',
        controller:'reportController'
    }).
    state('list.refri',{
        url:'/refri',
        templateUrl:'template/data-table/refri-table.html',
        controller:'reportController'
    }).
        state('list.aerosoles',{
            url:'/aerosoles',
            templateUrl:'template/data-table/aerosoles-table.html',
            controller:'reportController'
        })
        .
        state('list.importaciones',{
            url:'/importaciones',
            templateUrl:'template/data-table/importaciones-table.html',
            controller:'reportController'
        }).
    state('list.empresa',{
        url:'/empresa',
        templateUrl:'template/data-table/empresa-table.html',
        controller:'reportController'
    })


        .



    ///Graficas
    state('charts',{
            url:'/charts',
            templateUrl:'template/charts.html',
            controller:'chartController'
        }).

    ////Login
        state('login',
        {
        url:'/login',
        templateUrl:'template/login.html',
        controller:'loginController'
    }).
        //Seguridad
        state('users',
        {
        url:'/users',
        templateUrl:'template/users.html',
        controller:'userController'
    }).
    state('salir',
        {
            url:'/logout',
            controller:function ($cookies,$location)
            {
                $cookies.remove('user');
                $location.path('/home');

            }
        })

    ;
})
;

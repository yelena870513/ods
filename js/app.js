'use strict';
//fs y ws son los manager para guardar en fichero la base de datos una vez terminado de gestionar todo.
var electron = require('electron');
var domtoimage = require('dom-to-image');
// console.log(electron.getPath('documents'));
var fs = require('fs');
var os = require('os');
var ws = {};
fs.exists(os.tmpdir()+'/.sao/data',function (exists) {
    if (!exists) {
        fs.mkdir(os.tmpdir()+'/.sao');
        fs.mkdir(os.tmpdir()+'/.sao/data');
    }
    ws = fs.createWriteStream(os.tmpdir()+'/.sao/data/sao.json');
});


var replicationStream = require('pouchdb-replication-stream');
var MemoryStream = require('memorystream');
PouchDB.plugin(replicationStream.plugin);
PouchDB.adapter('writableStream', replicationStream.adapters.writableStream);

angular.module('app.sao',['ui.router','pouchdb','ui.bootstrap','chart.js','ngFileUpload','ngStorage','angular-electron','ui.select','ngSanitize','angularUtils.directives.dirPagination']).config(function ($stateProvider, $urlRouterProvider) {
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
        state('list.solventes',{
            url:'/solventes',
            templateUrl:'template/data-table/solventes-table.html',
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
        }).
        state('list.saora',{
            url:'/saora',
            templateUrl:'template/data-table/saora-table.html',
            controller:'reportController'
        }).



        ///Graficas
        state('charts',{
            url:'/charts',
            templateUrl:'template/charts.html',
            controller:'chartController'
        }).


        ///Nomencladores
    state('nomenclatures',{
        url:'/nomenclatures',
        templateUrl:'template/nomenclatures.html',
        controller:'nomenclatureController'
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
            controller:function ($location,$localStorage)
            {
                delete $localStorage.user;
                $location.path('/login');

            }
        }).
        state('cerrar',{
            url:"/close",
            controller:function($uibModal,$location){
                //mainWindow.close();
                var instance = $uibModal.open({
                    animation: true,
                    templateUrl: "template/modal/exit-modal.html",
                    controller: function ($scope,$uibModalInstance) {
                        $scope.Exit=function ()
                        {
                            $uibModalInstance.close('close');
                        }
                        ;

                        $scope.Close=function ()
                        {
                            $uibModalInstance.dismiss('cancel');
                        };
                    },
                    size: undefined,
                    resolve: {

                    }
                });

                instance.result.then(function(data)
                {
                    window.close();
                }, function(reason)
                {
                    $location.path('/general');
                });

            }
        })

    ;

}).run(function (Manager,SHA256,SAO) {

    //Creando al usuario sino existe
    Manager.record('usuario').then(function (data) {
        var users = data.rows.map(function (el) {
            return el.doc;
        });

        var result =  _.find(users,{"username":"sao"});
        if(result==undefined)
        {

            Manager.create({
                "username":"sao",
                "password":SHA256("sao").toString(),
                "tipo":"usuario"
            });
        }
    });
    //Creando por defecto las provincias municipios y ministerios
    Manager.record('provincia').then(function(provincias){
        if (provincias.rows.length==0) {

            var provinces = _(SAO.Provincias).map(function (pr) {
                pr["tipo"]="provincia";
                return pr;
            });

            var municipios = [];
            Manager.update(provinces).then(function(){

                provinces.forEach(function(e){
                   if(e!=undefined)
                   {
                       if(e.municipios !=undefined)
                       {
                           e.municipios.forEach(function(m,index)
                           {
                               municipios.push(
                                   {
                                       "nombre":m,
                                       "id":index+1,
                                       "provincia": e.id,
                                       "tipo":"municipio"
                                   });
                           });
                       }
                   }
                });

                Manager.update(municipios);


            });
        }
    });

    Manager.record('ministerio').then(function(ministerios){
        if (ministerios.rows.length==0)
        {
            var ministeries = _(SAO.Ministerio).map(function(min){
                min["tipo"]="ministerio";
                return min;
            });
            Manager.update(ministeries);
        }
    });
    Manager.record('aire').then(function(ministerios){
        if (ministerios.rows.length==0)
        {
            var ministeries = _(SAO.AplicacionAire).map(function(min){
                min["tipo"]="aire";
                return min;
            });
            Manager.update(ministeries);
        }
    }); 
    Manager.record('Sustancia').then(function(ministerios){
        if (ministerios.rows.length==0)
        {
            var ministeries = _(SAO.Sustancia).map(function(min){
                min["tipo"]="Sustancia";
                return min;
            });
            Manager.update(ministeries);
        }
    }); 
    Manager.record('Sustancia1').then(function(ministerios){
        if (ministerios.rows.length==0)
        {
            var ministeries = _(SAO.Sustancia1).map(function(min){
                min["tipo"]="Sustancia1";
                return min;
            });
            Manager.update(ministeries);
        }
    }); 
    Manager.record('refrigConsumidos').then(function(ministerios){
        if (ministerios.rows.length==0)
        {
            var ministeries = _(SAO.SustanciasRefrigerante).map(function(min){
                min["tipo"]="refrigConsumidos";
                return min;
            });
            Manager.update(ministeries);
        }
    });
    Manager.record('refrigeracion').then(function(ministerios){
        if (ministerios.rows.length==0)
        {
            var ministeries = _(SAO.AplicacionRefri).map(function(min){
                min["tipo"]="refrigeracion";
                return min;
            });
            Manager.update(ministeries);
        }
    });

    ['empresa','osde'].forEach(function(nm){
        Manager.record(nm).then(function(nmr){
            var nmc = [{id:1,nombre:nm.toUpperCase()+1,tipo:nm},{id:2,nombre:nm.toUpperCase()+2,tipo:nm}];
            if (nmr.rows.length==0)
            {
                Manager.update(nmc);
            }
        });
    });
}).controller('mainController',function ($scope,$location) {

    //Manejador global de la interfaz de usuario
    var hashes = ['general','charts','users','list','nomenclatures'];
    $scope.navigation = {};
    $scope.isActive=function (path) {
        var hash = $location.path();

        var current = hashes.filter(function (la)
        {
            return hash.indexOf(la)!=-1;
        })[0];

        return current==path;
    }

})
;

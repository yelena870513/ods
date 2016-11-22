'use strict';
var fs = require('fs');
// var db = new PouchDB('sao');
var ws = fs.createWriteStream('data/sao.json');
// db.load('data/sao.json').then(function () {
//     //return db.put({ _id: '_local/preloaded' });
// });

angular.module('app.router',['ui.router','pouchdb']).config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/general');
    $stateProvider.state('general',{
        url:'/general',
        templateUrl:'template/partial-general.html',
        controller: "generalController"
    }).
        state('home.list',{url:'/list',templateUrl:'template/partial-home-list.html',controller:function ($scope) {
        $scope.dogs = ['Sultan','Kenichi','Appa'];
    }}).
        state('home.paragraph',{url:'/paragraph',template:'I could worship my Lord forever.'}).
        state('about',{
            url:'/about',
            views:{
                '':{
                    templateUrl:'template/partial-about.html'
                },
                'columnOne@about':{
                    template:' Look I am a column!'
                },
                'columnTwo@about':{
                    templateUrl:'template/table-data.html',
                    controller:'scotchController'
                }
            }
    });
})
;

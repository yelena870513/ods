'use strict';
var fs = require('fs');
// var db = new PouchDB('sao');
var ws = fs.createWriteStream('data/sao.json');
// db.load('data/sao.json').then(function () {
//     //return db.put({ _id: '_local/preloaded' });
// });

angular.module('app.router',['ui.router','pouchdb']).config(function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/home');
    $stateProvider.state('home',{
        url:'/home',
        templateUrl:'template/partial-home.html'
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
}).controller('scotchController',function ($scope,Manager) {
    $scope.ws = [
        {
            name:"Macallan 12",
            cost:"$50"
        },
        {
            name:"Chivas Regal Salute",
            cost:"$1000"
        },
        {
            name:"Glenfiddich 1937",
            cost:"$200000"
        }
    ];

    // db.post({name:"Macalla5n 12",
    //     cost:"$50"}).then(function (response) {
    //     alert(JSON.stringify(response));
    // }).catch(function (reason) {
    //     alert(JSON.stringify(reason));
    // });
    //
    // db.allDocs({
    //     include_docs: true,
    //     attachments: true
    // }).then(function (result) {
    //     // handle result
    //    //save to file
    //            db.dump(ws).then(function (res) {
    //         console.log(res);
    //     });
    //
    //
    //
    // }).catch(function (err) {
    //     console.log(err);
    // });






    // db.dump(ws).then(function (res) {
    //     console.log(res);
    // });




}).
    factory('Manager',function (pouchDB) {
    var manager = {};
    var db = pouchDB('sao');
    manager.create = function (element) {
      return db.post(element);
    };

    manager.update = function (element)
    {
        if( Object.prototype.toString.call( element ) === '[object Array]' )
        {
            return db.bulkDocs(element);
        }
      return db.put(element._id,element);
    };

    manager.delete = function (element)
    {
        if( Object.prototype.toString.call( element ) === '[object Array]' )
        {
            return db.bulkDocs(element);
        }
        return db.remove(element._id, element._rev);
    };

    manager.from = function (database,options) {
       return db.replicate.from(database,options).$promise;

    };

    manager.to = function (database,options) {
      return db.replicate.to(database,options).$promise;
    };

    manager.get = function (query,options) {
        if (query==undefined)
        {
            return db.allDocs(options!=undefined?options:{});
        }
        // else if( Object.prototype.toString.call( query ) === '[object Array]' )
        // {
        //
        // }
        else
        {
            return db.get(query,options!=undefined?options:{});
        }

    };
    return manager;
})
;

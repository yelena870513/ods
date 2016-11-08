'use strict';
var fs = require('fs');
var db = new PouchDB('sao');
var ws = fs.createWriteStream('sao.json');
db.load('data/sao.json').then(function () {
    //return db.put({ _id: '_local/preloaded' });
});
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
}).controller('scotchController',function ($scope) {
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

    db.post({name:"Macalla5n 12",
        cost:"$50"}).then(function (response) {
        alert(JSON.stringify(response));
    }).catch(function (reason) {
        alert(JSON.stringify(reason));
    });

    db.allDocs({
        include_docs: true,
        attachments: true
    }).then(function (result) {
        // handle result
       //save to file
        var rdata = JSON.stringify(result,null,'');
        // ws.pipe(rdata);
        console.log(result);

        fs.writeFile("sao.json",rdata,function (err) {
            if (err) {
                console.log(err);
            }
        });

        db.dump(ws).then(function (res) {
            console.log(res);
        });
            // console.log(rdata);
        // ws.end();


    }).catch(function (err) {
        console.log(err);
    });






    // db.dump(ws).then(function (res) {
    //     console.log(res);
    // });




})
;

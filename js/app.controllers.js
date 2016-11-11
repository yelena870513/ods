angular.module('app.router').controller('scotchController',function ($scope,Manager) {
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

    $scope.documents = [];
    $scope.toChain = '';

    ////LOCAL MEMBERS
    function init() {
        Manager.local().then(function (res) {
            $scope.documents = res.rows;
            $scope.toChain =JSON.stringify(res);
            console.debug($scope.toChain);
            // ForeTest();
        });
    }

    ///Mocking Line
    function ForeTest() {
        for (var i = 0;i<10;i++) {
            AddElement({
                "name":"MacCallan"+randomIntFromInterval(0,200),
                "surname":"John"+randomIntFromInterval(12,25)
            });
        }
        Manager.flush();
    }
    function randomIntFromInterval(min,max)
    {
        return Math.floor(Math.random()*(max-min+1)+min);
    }

    function AddElement(element) {
        Manager.create(element).then(function (result) {
            //todo on success
            console.info(JSON.stringify(result));
        }).catch(function (reason) {
            //todo on fail
            console.warn(JSON.stringify(reason));
        })
    }

    function UpdateElement(element) {
        Manager.update(element).then(function (result) {
            //todo on success
            console.info(JSON.stringify(result));
        }).catch(function (reason) {
            //todo on fail
            console.warn(JSON.stringify(reason));
        })
    }

    function DeleteElement(element) {
        Manager.delete(element).then(function (result) {
            //todo on success
            console.info(JSON.stringify(result));
        }).catch(function (reason) {
            //todo on fail
            console.warn(JSON.stringify(reason));
        })
    }

    ///SCOPE MEMBERS
    $scope.Add = function (element) {
        AddElement(element);
    };

    $scope.Edit = function (element) {
        UpdateElement(element);
    };

    $scope.Delete = function (element) {
        DeleteElement(element);
    };



    ////Initialisations
    init();


})
.controller("homeController",function ($scope, Manager,Provincias,OSDE,Ministerio,Sectores,Sustancias) {
$scope.Provincias = Provincias;
$scope.OSDE = OSDE;
$scope.Ministerio = Ministerio;
$scope.Sectores = Sectores.map(function (el) {
    el.value = false;
    return el;
});
$scope.Sustancias = Sustancias;
$scope.general = {
    "provincia":Provincias[0],
    "ministerio":Ministerio[0],
    "osde":OSDE[0],
    "empresa":"",
    "sustancia":Sustancias[0],
    "sectores":[],
    "tipo":"general"
};
$scope.registros = [];
    $scope.documents = [];

    ////LOCAL MEMBERS
    function init() {
        Manager.local().then(function (res) {
            $scope.documents = res.rows;

            // ForeTest();
        });
    }

    function AddElement(element) {
        Manager.create(element).then(function (result) {
            //todo on success
            $scope.registros.push(element);
            console.info(JSON.stringify(result));
        }).catch(function (reason) {
            //todo on fail
            console.warn(JSON.stringify(reason));
        })
    }

    ///SCOPE MEMBERS
    $scope.Add = function (element) {
        //todo validar datos
        element.sectores = element.sectores.concat($scope.Sectores.filter(function (el) {
            return el.value==true;
        }));

        AddElement(element);
    };

    $scope.Save = function () {
        Manager.flush();
    };

    init();


})





;
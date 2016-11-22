angular.module('app.router').controller("generalController",function ($scope, Manager,Provincias,OSDE,Ministerio,Sectores,Sustancias,AlternativaHFC,AlternativaHFCMezclas,AlternativaHFO,AlternativaOtras,SectoresAnexo,RA,Util) {

//DB en memoria
$scope.documents = [];
$scope.table = {
    "columns":[],
    "records":[],
    "name":""
}   ; 


 //Definiciones de columnas por tipo de registro
    $scope.columns = {
        "general":["provincia","ministerio","osde","empresa"],
        "general1":["sustancia","sectores"],
        "general2":["AlternativaHFC","AlternativaHFCMezclas","AlternativaHFO","AlternativaOtras"]
    };

    $scope.records = Object.keys($scope.columns);
//Informacion general
$scope.Provincias = Provincias;
$scope.OSDE = OSDE;
$scope.Ministerio = Ministerio;

$scope.general = {
    "provincia":Provincias[0],
    "ministerio":Ministerio[0],
    "osde":OSDE[0],
    "empresa":"",
    "tipo":"general"
        };



// Uso general alternativas a las SAO en la actualidad

$scope.Sectores = Sectores.map(function (el) {
    el.value = false;
    return el;
});
$scope.Sustancias = Sustancias;

$scope.general1 = {
            "sustancia":Sustancias[0],
            "sectores":[],
            "tipo":"general1"
        };



//    Resumen de su uso en todos los sectores para cada año entre 2011-2015

$scope.AlternativaHFC = AlternativaHFC;
$scope.AlternativaHFCMezclas = AlternativaHFCMezclas;
$scope.AlternativaHFO = AlternativaHFO;
$scope.AlternativaOtras = AlternativaOtras;
$scope.RA = RA;
$scope.SectoresAnexo = SectoresAnexo.map(function (el) {
       el.value = false;
       return el;
});
$scope.general2 = {
            "otroHFC":"",
            "otroHFCMezclas":"",
            "otroHFO":"",
            "otroAlternativasOtras":"",
            "alternativaHFC":AlternativaHFC[0],
            "alternativaHFCMezclas":AlternativaHFCMezclas[0],
            "alternativaHFO":AlternativaHFO[0],
            "alternativaOtras":AlternativaOtras[0],
            "ra":RA[0],
            "sectoresAnexo":[],
            "tipo":"general2"
        };


    ////LOCAL MEMBERS
    function init() {
        Manager.local().then(function (res) {
            $scope.documents = res.rows;

            // ForeTest();
        });
    }

    function FetchRecords(name){
        Manager.registros(name).then(function (data) {
            console.log(data);
        }).catch(function(reason){
            console.log(reason);
        });
    }

    function AddElement(element) {
        Manager.create(element).then(function (result) {
            //todo on success
            $scope.documents.push(element);
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
        //todo validar datos
        element = Util.collect($scope.general,element);
        
        switch (element.tipo){
            case 'general1':
                element.sectores = element.sectores.concat($scope.Sectores.filter(function (el) {
                    return el.value==true;
                }));
                break;
            case 'general2':
                element.sectoresAnexo = element.sectoresAnexo.concat($scope.SectoresAnexo.filter(function (el) {
                    return el.value==true;
                }));
                break;
            default:

                break;
        }

        AddElement(element);
    };

    $scope.Edit = function (element) {
        //todo realizar las comprobaciones segun el tipo de registro.
        UpdateElement(element);
    };

    $scope.Delete = function (element) {
        DeleteElement(element);
    };


    $scope.Save = function () {
        Manager.flush();
    };

    $scope.ShowRecord= function () {
        console.log($scope.table.name);
        FetchRecords($scope.table.name);
    };

    init();


})





;
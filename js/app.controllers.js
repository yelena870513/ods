angular.module('app.sao')
    .controller("generalController", function($scope, Manager, SAO, Util, $uibModal,Menu,$sce,SubMenu,$localStorage, Columns,$timeout,$location,SType) {

        $scope.treeTemplate = $sce.trustAsHtml("template/directive/tree.html");
        $scope.alerts=
        {
            show:false,
            message:''
        };

        $scope.error=
        {
            show:false,
            message:'Error.'
        };
        var active = '';
        //DB en memoria
        $scope.documents = [];
        $scope.table = {
            "columns": [],
            "records": [],
            "name": ""
        };
        //Menu
        $scope.menu = Menu;
        $scope.submenu = SubMenu;

        //selectable|| probar el tree con esta forma
        $scope.items = [
            'The first choice!',
            'And another choice for you.',
            'but wait! A third!'
        ];


        //Definiciones de columnas por tipo de registro
        //Definiciones de columnas por tipo de registro
        $scope.columns =Columns;


        $scope.records = Object.keys($scope.columns);
        //Informacion general
        $scope.Provincias = SAO.Provincias;
        //$scope.OSDE = SAO.OSDE;
        $scope.Ministerio = SAO.Ministerio;

        //Tipo de objetos
        $scope.general = {
            "provincia": {},
            "ministerio": {},
            "osde": {},
            "empresa": {},

            "tipo": "general"
        };

        Manager.record('provincia').then(function(data){
            $scope.general.provincia = data.rows.map(function(m){return m.doc;})[0];

        });
        Manager.record('ministerio').then(function(data){
            $scope.general.ministerio = data.rows.map(function(m){return m.doc;})[0];
        });
        Manager.record('empresa').then(function(data){
            $scope.general.empresa = data.rows.map(function(m){return m.doc;})[0];
        });
        Manager.record('osde').then(function(data){
            $scope.general.osde = data.rows.map(function(m){return m.doc;})[0];
        });

        // Uso general alternativas a las SAO en la actualidad

        $scope.Sector = SAO.Sector.map(function(el) {
            el.value = false;
            return el;
        });
        $scope.Sustancias = SAO.Sustancias;

        $scope.general1 = {
            "sustancia": SAO.Sustancias[0],
            "sector": [],
            "tipo": "general1"
        };
        //    Resumen de su uso en todos los sectores para cada a�o entre 2011-2015

        $scope.AlternativaHFC = SAO.AlternativaHFC;
        $scope.AlternativaHFCMezclas = SAO.AlternativaHFCMezclas;
        $scope.AlternativaHFO = SAO.AlternativaHFO;
        $scope.AlternativaOtras = SAO.AlternativaOtras;
        $scope.RA = SAO.RA;
        $scope.SectoresAnexo = SAO.SectoresAnexo.map(function(el) {
            el.value = false;
            return el;
        });
        $scope.general2 = {

            "Alternativa":SAO.Tabla22[0].aplicacion,
            "Tipo":SAO.Tabla22[0].alternativas[0],
            "Sector":SAO.Tabla22[0].uso2[0],
            "ra": SAO.RA[0],
            "otrosAlternativa":"",
            "tipo":"general2"
        };
        $scope.general3 = {
            "Sector":SAO.Tabla2[0].aplicacion,
            "Subsector":SAO.Tabla2[0].alternativas[1],
            "Alternativa":SAO.Tabla2[0].uso2[1],
            "tipo":"general3"
        };


        //ESPUMA Tabla 3,4,5

        $scope.espuma1 = {
            "Sustancia": SAO.SustanciasTabla3[0],
            "Uso":[],//{ano:"---",tons:""},
            "tipo": "espuma1"
        };
        $scope.espuma2 = {
            "Subsector": SAO.SubsectorTabla4[0],
            "Uso":[],//{ano:"---",tons:""},
            "tipo": "espuma2"
        };
        $scope.espuma3 = {
            "Subsector":SAO.Tabla5[0].aplicacion,
            "Alternativa":SAO.Tabla5[0].alternativas[0],
            "otrosAlternativa":"",
            "Uso":[],//{ano:"---",tons:""},
            "tipo":"espuma3"
        };

        // AIRE ACONDICIONADO tabla7,9

        $scope.aire1 = {
            "Subsector": SAO.SubsectorTabla7[0],
            "Uso":[],//{ano:"---",tons:""},
            "tipo": "aire1"
        };
        $scope.aire2 = {
            "Aplicaciones":SAO.Tabla9[0].aplicacion,
            "Carga":SAO.Tabla9[0].carga,
            "Alternativas":SAO.Tabla9[0].alternativas[0],
            "otrosAlternativa":"",
            "Uso":[],//{ano:"---",tons:""},
            "tipo":"aire2"
        };
        $scope.aire3 = {
            "Aplicaciones":SAO.Tabla11A[0].aplicacion,
            "Capacidad":SAO.Tabla11A[0].carga,
            "Sustancias":SAO.Tabla11A[0].alternativas[0],
            "Estado":SAO.Estado[0],
            // "clasificacion":SAO.Clasificacion[0],
            "otrosAlternativa":"",
            "unidades":"",
            "explotacion":"",
            "Uso":[],//{ano:"---",tons:""},
            "clasificacion":SAO.Clasificacion[1],
            "tipo":"aire3"
            //"clasificacion":""
        };

        //AEROSOLES

        $scope.aerosoles = {
            "Aplicaciones":SAO.Tabla12[0].aplicacion,
            "Alternativas":SAO.Tabla12[0].alternativas[0],
            "otrosAlternativa":"",
            "Uso":[],//{ano:"---",tons:""},
            "tipo":"aerosoles"
        };

        //IMPORTACIONES
        $scope.importaciones1 = {
            "Sustancia": SAO.SustanciasTabla6[0].nombre,
            "Uso":[],//{ano:"---",tons:""},
            "tipo": "importaciones1"
        };

        $scope.importaciones2 = {

            "Alternativa":SAO.Tabla23[0].aplicacion,
            "Tipo":SAO.Tabla23[0].alternativas[0],
            "otrosAlternativa":"",
            "Importaciones":[],
            "tipo":"importaciones2"
        };

        //REFRIGERACION

        $scope.consumo = {
            "Aplicaciones":SAO.Aplicaciones8[0].aplicacion,
            "Carga":SAO.Aplicaciones8[0].carga,
            "Alternativas":SAO.Aplicaciones8[0].alternativas[0],
            "otrosAlternativa":"",
            "Uso":[],//{ano:"---",tons:""},
            "tipo":"consumo"
        };
        $scope.refri = {
            "Aplicaciones":SAO.Tabla11B[0].aplicacion,
            "Capacidad":SAO.Tabla11B[0].carga,
            "Alternativas":SAO.Tabla11B[0].alternativas[0],
            "clasificacion":SAO.ClasificacionRefri[0],
            "Estado":SAO.EstadoRefri[0],
            "otrosAlternativa":"",
            "unidades":"",
            "explotacion":"",
            "year":2010,
            "Uso":[],//{ano:"---",tons:""},
            "tipo":"refri"

        };

        //EMPRESA

        $scope.empresa1 = {
            "Aplicaciones":SAO.Tabla10A[0].aplicacion,
            "Carga":SAO.Tabla10A[0].carga,
            "Alternativas":SAO.Tabla10A[0].alternativas[0],
            "otrosAlternativa":"",
            "Uso":[],//{ano:"---",tons:""},
            "tipo":"empresa1"
        };
        $scope.empresa2 = {
            "Aplicaciones":SAO.Tabla10B[0].aplicacion,
            "Alternativas":SAO.Tabla10B[0].alternativas[0],
            "otrosAlternativa":"",
            "Uso":[],//{ano:"---",tons:""},
            "tipo":"empresa2"
        };
        $scope.empresa3 = {
            "Aplicaciones":SAO.Tabla13[0].aplicacion,
            "Alternativas":SAO.Tabla13[0].alternativas[0],
            "otrosAlternativa":"",
            "Uso":[],//{ano:"---",tons:""},
            "tipo":"empresa3"
        };
        $scope.empresa4 = {
            "Organizacion":SAO.OrgProduccion[0],
            "SustaciaAire":SAO.SustanciasAire[1],
            "SustanciaRefrigerante":SAO.SustanciasRefrigerante[1],
            "TipoRefrigeracion":SAO.TipoRefri[0],
            "TipoAire":SAO.TipoAire[0],
            "CantRefriAire":[],
            "CantRefriRefri":[],
            "Total":[],
            "nombreTaller":"",
            "municipio":"",
            "sustanciasR":"",
            "sustanciasRL":"",
            "year":0,
             "explotacion":"",
            // "tecnicos":"",
            "experiencias":"",
            "Recuperacion":[],
            "Recuperado":[],
            "tipo":"empresa4"
        };

        ////LOCAL MEMBERS
        function init() {
            var user = $localStorage.user;
            if(user==undefined)
            {

                $timeout(function () {
                    $location.path('/login');
                },300);
            }
            else{
                $scope.user  = user;
            }
            Manager.local().then(function(res) {
                if (res!=undefined) {
                    $scope.documents = res.rows.map(function(el) {
                        return el.doc;
                    });
                }

                // ForeTest();
            });
        }

        function FetchRecords(name) {
            Manager.record(name).then(function(data) {
                console.log(data);
                $scope.table.records = data.rows.map(function(el) {
                    return el.doc;
                });
            }).
            catch (function(reason) {
                console.log(reason);
            });
        }

        function AddElement(element) {
            Manager.create(element).then(function(result) {
                //todo on success
                $scope.documents.push(element);
                console.info(JSON.stringify(result));
            }).
            catch (function(reason) {
                //todo on fail
                console.warn(JSON.stringify(reason));
            })
        }
        ///SCOPE MEMBERS
        $scope.Add = function(element) {
            //todo validar datos
            element = Util.collect($scope.general, element);

            switch (element.tipo) {
                case 'general1':
                    element.sector = element.sector.concat($scope.Sector.filter(function(el) {
                        return el.value == true;
                    }));
                    break;
                // case 'general2':
                //     element.sectoresAnexo = element.sectoresAnexo.concat($scope.SectoresAnexo.filter(function(el) {
                //         return el.value == true;
                //     }));
                //     break;
                default:

                    break;
            }

            AddElement(element);
        };

        $scope.OpenModal = function(record, size,action) {
            var instance = $uibModal.open({
                animation: true,
                templateUrl: "template/modal/" + $scope.table.name + "-modal.html",
                controller: 'modalController',
                size: size,
                resolve: {
                    record: function() {
                        if (record == undefined) {

                            record = angular.copy($scope[$scope.table.name]);
                            record.tipo = $scope.table.name;
                        }
                        return record;
                    },
                    general: function() {
                        return $scope.general;
                    },
                    documents: function() {
                        return $scope.documents;
                    },
                    action:function(){
                        return action;
                    }
                }
            });

            instance.result.then(function(data) {
                $scope.Refresh();
            }, function(reason) {
                console.warn(JSON.stringify(reason));
            });
        };

        $scope.LoadModal = function (size) {
            var instance = $uibModal.open({
                animation: true,
                templateUrl: "template/modal/upload-modal.html",
                controller: 'uploadController',
                size: size,
                resolve: {

                }
            });

            instance.result.then(function(data) {
                $scope.Refresh();
            }, function(reason) {
                console.warn(JSON.stringify(reason));
            });
        };

        $scope.ExportarBase= function ()
        {
             Manager.dataString().then(function (data) {
                 var blob = new Blob([data], {type: "application/json;charset=utf-8"});
                 saveAs(blob, "sao-exported.json");
             });

        };

        $scope.Delete = function(record, size) {
            var instance = $uibModal.open({
                animation: true,
                templateUrl: "template/modal/delete-modal.html",
                controller: 'modalController',
                size: size,
                resolve: {
                    record: function() {
                        return record;
                    },
                    general: function() {
                        return $scope.general;
                    },

                    documents: function() {
                        return $scope.documents;
                    },
                    action: function () {
                        return 'delete';
                    }
                }
            });

            instance.result.then(function(data) {
                $scope.Refresh();
            }, function(reason) {
                console.warn(JSON.stringify(reason));
            });
        };


        $scope.Set = function(size) {
            var instance = $uibModal.open({
                animation: true,
                templateUrl: "template/modal/setting-modal.html",
                controller: 'modalController',
                size: size,
                resolve: {
                    record: function() {
                        return {};
                    },
                    general: function() {
                        return $scope.general;
                    },

                    documents: function() {
                        return $scope.documents;
                    },

                    action:function () {
                        return 'general';
                    }
                }
            });

            instance.result.then(function(data) {
                $scope.Refresh();
            }, function(reason) {
                console.warn(JSON.stringify(reason));
            });
        };


        $scope.Save = function() {
            Manager.flush().then(function (e) {
                $scope.alerts.show = true;
                $scope.alerts.message = 'Datos salvados correctamente.';
                $timeout(function () {
                    $scope.alerts.show = false;
                },3000);
            },function (reason) {
                $scope.error.show = true;
                $scope.error.message = 'Error salvando los datos.';
                $timeout(function () {
                    $scope.error.show = false;
                    $scope.error.message = 'Error!.';
                },3000);
            });
        };

        $scope.SelectModal = function (tipo) {
            $scope.table.name = tipo;
            for (var i in SType)
            {
                var tags = SType[i];
                if (tags.indexOf(tipo)!=-1)
                {
                    active = i;
                    break;
                }
            }
            $scope.ShowRecord();
        };

        $scope.isActive=function(path){
            return path==active;
        };

        $scope.ShowRecord = function() {
            try {
                FetchRecords($scope.table.name);

                $scope.table.records = $scope.documents.filter(function(el) {
                    return el.tipo == $scope.table.name;
                });

                    var data=$scope.columns.filter(function (el) {
                        return el.tipo==$scope.table.name;
                    })[0];

                   if(data!=undefined)
                   {
                       $scope.table.columns = data.fields;
                       $scope.table.title = data.nombre;
                   }

            } catch (err) {
                //todo poner un modal aqui
                console.warn(err);
            }

        };

        $scope.Refresh = function() {
            FetchRecords($scope.table.name);
        };

        $scope.LogOut = function () {
             delete $localStorage.user;
        };

        $scope.Export = function () {
          html2canvas(document.getElementById('table-data'),{
              onrendered:function (canvas) {
                  var data = canvas.toDataURL();
                  var docDefinition = {
                      content:[
                          {
                              image:data,
                              width:500
                          }
                      ]
                  };
                  pdfMake.createPdf(docDefinition).download("exportable.pdf");
              }
          });
        };

        $scope.Cerrar = function () {
            mainWindow.close();
        };

        init();


    })
    .controller("reportController", function($scope, SAO, Manager, $uibModal,SType,Columns,$location,$timeout,$q,$localStorage,currentWebContents) {
        //Este controlador es para los reportes.

        $scope.tables = [];
        $scope.isPrinting = false;
        $scope.records = [];
        $scope.columns = Columns;
        $scope.labels = Object.keys(SType);
        var Clasif = SAO.Clasificacion.map(function (cl) {
            return cl.nombre;
        });

        var ClasifR = SAO.ClasificacionRefri.map(function (cl) {
            return cl.nombre;
        });



        $scope.ShowTable = function (table)
        {
           FetchTable(table);
        };

        $scope.Export = function ()
        {
            var hash = $location.path();

            var current = $scope.labels.filter(function (la)
            {
                return hash.indexOf(la)!=-1;
            })[0];

            $scope.isPrinting = true;
            currentWebContents.printToPDF({
                marginsType: 0,
                printBackground: false,
                printSelectionOnly: false,
                landscape: false
            }, function(error,data)
            {
                if (error) throw error;
                fs.writeFile(os.homedir()+'/.sao/data/'+ current+'.pdf', data, function(error)
                {
                    if (error) throw error;
                    console.log('Write PDF successfully.');
                    $scope.isPrinting = false;
                    $timeout(function(){

                        var buffer = fs.readFileSync(os.homedir()+'/.sao/data/'+ current+'.pdf');
                        var blob = new Blob([buffer]);
                        saveAs(blob,current+'.pdf');
                    },300);


                })
            });
        };

        function FetchTable(table)
        {
            var tableNames= SType[table];
            tableNames.forEach(function (name)
            {
                Manager.record(name).then(function (data)
                {
                    var dataColums=$scope.columns.filter(function (el) {
                        return el.tipo==name;
                    })[0];

                     if(dataColums!=undefined)
                     {

                         $timeout(
                             function () {
                                 var rows = data.rows.map(function(el) {
                                     return el.doc;
                                 });

                                 rows =  ReformatData(rows,name);
                                // rows =  ReformatData(rows,name);

                                 var table = Format({
                                     "columns":dataColums.fields,
                                     "records":rows,
                                     "title":dataColums.nombre,
                                     "name":name
                                 });

                                $scope.tables.push(table);
                         },200)
                        ;

                     }


                });
            });

        }

        function ReformatData(data,table){
            var rows = [];
            switch (table)
            {

                case 'espuma1':
                case 'importaciones1':
                    rows = ReduceItems(data,"Sustancia");
                    break;
                case 'espuma2':
                case 'espuma3':

                    rows = ReduceItems(data,"Subsector");
                    break;
                case 'aire2':
                case 'aire3':
                case 'refri':
                case 'consumo':
                case 'aerosoles':
                case 'empresa1':
                case 'empresa2':
                case 'empresa3':
                    rows = ReduceItems(data,"Aplicaciones");
                    break;
                default:
                    rows = data;
            }

            return rows;
        }

        function ReduceItems(source, property) {
            var rows = [];
            for(var d=0;d<source.length;d++)
            {

                var c = source[d][property].nombre;

                var results  =  _.find(rows,function (id) {
                    return  id[property].nombre==c;
                });


                if(results==undefined)
                {
                    var where =_.filter(source,function (id) {
                        return  id[property].nombre==c;
                    });
                    var row = {
                        "Uso":[]
                    };

                    row[property]={
                        "nombre":c
                    };


                    _.each(where,function (o)
                    {
                        if (row.Uso.length==0)
                        {
                            row.Uso = o.Uso;
                        }
                        else
                        {
                            _.each(o.Uso,function (u,index)
                            {
                                row.Uso[index].tons+=u.tons;
                            });
                        }
                    });

                    //Inclusive properties
                    var props = Object.keys(source[d]);
                    props = _.without(props,property);
                    _.each(props,function (p) {
                        row[p]=source[d][p];
                    });

                    rows.push(row);

                }
            }

            return rows;
        }

        function SimpleTable(table)
        {
            return Manager.record(table).then(function (data) {
                $scope.records = data.rows.map(function(el) {
                    return el.doc;
                }).concat($scope.records);
                return $scope.records;
            });
        }

        function Format(table) {

            var tableData = table;
            //format Uso
           try{
                    if(tableData.records.length>0)
                    {
                        if(tableData.columns.indexOf("Uso")!=-1)
                        {
                            var keys = _.unique(tableData.records[0].Uso.filter(function (u) {
                                return u.anno;
                            }).map(function (j) {
                                return j.anno;
                            }));

                            var rows = tableData.records.map(function (m) {
                                keys.forEach(function (k)
                                {
                                    m[k] = m.Uso.filter(function (a) {
                                        return a.anno==k;
                                    })[0].tons;
                                });
                                delete m.Uso;
                                return m;
                            });

                            tableData.columns = tableData.columns.filter(function (u) {
                                return u!="Uso";
                            }).concat(keys);

                            tableData.rows = rows;
                        }
                    }
           }
           catch (err){
               console.warn(err);
           }
            return tableData;


        }

        function FormatSaora()
        {
            var dataColumns = ["Subsector","Uso"];

            SimpleTable('refri').then(function () {
                var dataTable = [];
                ClasifR.forEach(function (c)
                {
                    var row = {
                      "Subsector":c,
                       "Uso":[]
                    };
                    var matches = $scope.records.filter(function (fc) {
                        return fc.clasificacion.nombre==c&&fc.tipo=='refri';
                    });

                    if(matches.length>0)
                    {
                        for (var i =0;i<matches.length;i++)
                        {
                            if(matches[i]!=undefined)
                            {
                                for (var k = 0;k< matches[i].Uso.length;k++)
                                {
                                    if(row.Uso[k]==undefined)
                                    {
                                        row.Uso[k] = matches[i].Uso[k]
                                    }
                                    else
                                    {
                                        if(row.Uso[k].anno==matches[i].Uso[k].anno)
                                        {
                                            row.Uso[k].tons+=matches[i].Uso[k].tons;
                                        }
                                    }
                                }
                            }

                        }

                        dataTable.push(row);
                    }
                });

                $timeout(
                    function () {

                        var table = Format({
                            "columns":dataColumns,
                            "records":dataTable,
                            "title":"Distribuci\u00F3n de SAO y alternativas de SAO en el sector de la Refrigeraci\u00F3n",
                            "name":'refri'
                        });
                        $scope.tables.push(table);
                    },200);

            });
            SimpleTable('aire3').then(function () {

                var dataTable = [];
                Clasif.forEach(function (c) {
                    var row = {
                        "Subsector":c,
                        "Uso":[]
                    };
                    var matches = $scope.records.filter(function (fc) {
                        return fc.clasificacion.nombre==c&&fc.tipo=='aire3';
                    });

                    if(matches.length>0)
                    {
                        for (var i =0;i<matches.length;i++)
                        {
                            if(matches[i]!=undefined)
                            {
                                for (var k = 0;k< matches[i].Uso.length;k++)
                                {
                                    if(row.Uso[k]==undefined)
                                    {
                                        row.Uso[k] = matches[i].Uso[k]
                                    }
                                    else
                                    {
                                        if(row.Uso[k].anno==matches[i].Uso[k].anno)
                                        {
                                            row.Uso[k].tons+=matches[i].Uso[k].tons;
                                        }
                                    }
                                }
                            }

                        }

                        dataTable.push(row);
                    }

                });

                $timeout(
                    function () {

                        var table = Format({
                            "columns":dataColumns,
                            "records":dataTable,
                            "title":"Distribuci\u00F3n de SAO y alternativas de SAO en el sector  Aire Acondicionado",
                            "name":'aire3'
                        });
                        $scope.tables.push(table);
                    },200);

            });





        }

        function init()
        {
            var user = $localStorage.user;
            if(user==undefined)
            {

                $timeout(function () {
                    $location.path('/login');
                },300);
            }
            else{
                $scope.user  = user;
            }
            var hash = $location.path();
            if(hash.indexOf('saora')!=-1)
            {
                FormatSaora();
            }

            else{
                var current = $scope.labels.filter(function (la)
                {
                    return hash.indexOf(la)!=-1;
                })[0];

                if(current!=undefined)
                {
                    FetchTable(current);
                }
            }


        }

        init();
    })
    .controller("chartController", function ($scope, SAO, Manager, $uibModal,$location,$timeout,$localStorage,SType,currentWebContents,ChartJs) {
        //Controlador para los charts
        var charting = '';
        var active = '';
        $scope.user = undefined;
        $scope.isPrinting = false;
        $scope.records= [];
       var years = [2010,2011,2012,2013,2014,2015,2016];
        $scope.selectedYear = 2010;
        $scope.bar = {
            "labels":[],
            "series":[],
            "data": [],
            "show":false
        };
       $scope.pies = [];
        // $scope.pie = {
        //     "labels":['2010', '2015', '2020', '2025','2030'],
        //     "data": [],
        //     "options":{},
        //     "show":false
        //
        // };



        // $scope.pie = {
        //     "labels":["SAO 1", "SAO 2", "SAO 3"],
        //     "data": [  300, 500, 100 ],
        //     "options":{},
        //     "show":false
        //
        // }




        $scope.SelectChart= function (chart) {
            $scope.pies=[];
            charting = chart;
            for (var i in SType)
            {
                var tags = SType[i];
                if (tags.indexOf(chart)!=-1)
                {
                    active = i;
                    break;
                }
            }
            FetchRecords(chart).then(function(){
                years.forEach(function(y){
                    var graph = ShowPieCharts(y);
                    if (graph!=undefined)
                    {
                        $scope.pies.push(graph);
                    }

                });
            });
        };

        $scope.isActive=function(path){
            return path==active;
        };


        $scope.ShowRecord = function() {
            try {
                FetchRecords($scope.table.name);


                $scope.records = $scope.documents.filter(function(el) {
                    return el.tipo == $scope.table.name;
                });


                var data=$scope.columns.filter(function (el) {
                    return el.tipo==$scope.table.name;
                })[0];

                $scope.table.columns = data.fields;
                $scope.table.title = data.nombre;





            } catch (err) {
                //todo poner un modal aqui
                console.warn(err);
            }

        };

        $scope.Refresh = function() {
            FetchRecords($scope.table.name);
        };

        $scope.ShowSelectedPie = function () {
            ShowPieCharts($scope.selectedYear);
        };

        $scope.ToPdf= function(){
            // Use default printing options
            //var data = document.getElementById('chart');
            $scope.isPrinting = true;
            currentWebContents.printToPDF({
                marginsType: 0,
                printBackground: false,
                printSelectionOnly: false,
                landscape: false
            }, function(error,data)
            {
                if (error) throw error;
                fs.writeFile(os.homedir()+'/.sao/data/'+ charting+'.pdf', data, function(error)
                {
                    if (error) throw error;
                    console.log('Write PDF successfully.');
                    $scope.isPrinting = false;
                    $timeout(function(){

                        var buffer = fs.readFileSync(os.homedir()+'/.sao/data/'+ charting+'.pdf');
                        var blob = new Blob([buffer]);
                        saveAs(blob,charting+'.pdf');
                    },3000);


                })
        })
        };

        $scope.ToPrint= function(){
            currentWebContents.print();
        };

        function FetchRecords(name) {
          return  Manager.record(name).then(function(data) {
                console.log(data);
                $scope.records = data.rows.map(function(el) {
                    return el.doc;
                });

                CargarDatos();
            }).
            catch (function(reason) {
                console.log(reason);
            });
        }
        function CargarDatos() {
          var names = [];
          var table = {};
          var tableData = [];
            switch (charting)
            {
                case 'espuma1':

                     names = [];
                     table  = {
                        names:[],
                        data:[]
                    };
                        table.names = SAO.SustanciasTabla3.map(function (el) {
                        return el.nombre.trim();
                    });

                    table.names.forEach(function (el) {
                        var rec = $scope.records.filter(function (r) {
                            return r.Sustancia.nombre.trim()==el;
                        })[0];

                       if (rec!=undefined)
                       {

                           var uso  = rec.Uso.map(function (m) {
                               return m.tons;
                           });

                           table.data.push(uso);
                           names.push(el)
                       }

                       table.names = names;

                    });

                    $scope.years = [2010,2015];

                    $scope.bar =
                    {
                        "labels":['2010', '2015'],
                        "series":table.names,
                        "data": table.data,
                        "show":true,
                        options: {
                            legend: {
                                display: true,
                                position: 'top'
                            },
                            title: {
                                display: true,
                                text: 'Espuma 1'
                            }

                        }

                    };

                     tableData = [0,0];
                    table.data.forEach(function (el) {
                        tableData[0]+=el[0];
                        tableData[1]+=el[1];
                        // tableData[2]+=el[2];
                        // tableData[3]+=el[3];
                        // tableData[4]+=el[4];
                    });
                    break;
                case 'espuma2':

                     names = [];
                     table  = {
                        names:[],
                        data:[]
                    };
                    table.names = SAO.SubsectorTabla4.map(function (el) {
                        return el.nombre;
                    });

                    table.names.forEach(function (el) {
                        var rec = $scope.records.filter(function (r) {
                            return r.Subsector.nombre==el;
                        })[0];

                        if (rec!=undefined)
                        {

                            var uso  = rec.Uso.map(function (m) {
                                return m.tons;
                            });

                            table.data.push(uso);
                            names.push(el)
                        }

                        table.names = names;

                    });
                    $scope.years = [2010,2015];

                    $scope.bar = {
                        "labels":['2010', '2015'],
                        "series":table.names,
                        "data": table.data,
                        "show":true,
                        options: {
                            title:{
                                display:true,
                                text:"Espuma 2"
                            },
                            tooltips: {
                                mode: 'index',
                                intersect: false
                            },
                            legend: {
                                display: true,
                                position: 'top'
                            },
                            responsive: true,
                            scales: {
                                xAxes: [{
                                    stacked: true
                                }],
                                yAxes: [{
                                    stacked: true
                                }]
                            }

                        }

                    };


                    ;
                    break;
                case 'espuma3':

                     names = [];
                     table  = {
                        names:[],
                        data:[]
                    };
                    table.names = SAO.Tabla5.map(function (el) {
                        return el.aplicacion.nombre;
                    });

                    table.names.forEach(function (el) {
                        var rec = $scope.records.filter(function (r) {
                            return r.Subsector.nombre==el;
                        })[0];

                        if (rec!=undefined)
                        {

                            var uso  = rec.Uso.map(function (m) {
                                return m.tons;
                            });

                            table.data.push(uso);
                            names.push(el)
                        }

                        table.names = names;

                    });
                    $scope.years = [2011,2012,2013,2014,2015,2016];

                    $scope.bar = {
                        "labels":['2011', '2012','2013','2014','2015','2016'],
                        "series":table.names,
                        "data": table.data,
                        "show":true,
                        options: {
                            title:{
                                display:true,
                                text:"Espuma 3"
                            },
                            legend: {
                                display: true,
                                position: 'top'
                            },
                            tooltips: {
                                mode: 'index',
                                intersect: false
                            },
                            responsive: true,
                            scales: {
                                xAxes: [{
                                    stacked: true
                                }],
                                yAxes: [{
                                    stacked: true
                                }]
                            }

                        }

                    };


                    break;
                case 'importaciones1':

                     names = [];
                     table  = {
                        names:[],
                        data:[]
                    };
                    table.names = SAO.SustanciasTabla6.map(function (el) {
                        return el.nombre;
                    });

                    table.names.forEach(function (el) {
                        var rec = $scope.records.filter(function (r) {
                            return r.Sustancia.nombre==el;
                        })[0];

                        if (rec!=undefined)
                        {

                            var uso  = rec.Uso.map(function (m) {
                                return m.tons;
                            });

                            table.data.push(uso);
                            names.push(el)
                        }

                        table.names = names;

                    });
                    $scope.years = [2010,2015];

                    $scope.bar = {
                        "labels":['2010', '2015'],
                        "series":table.names,
                        "data": table.data,
                        "show":true,
                        options: {
                            title:{
                                display:true,
                                text:"Importaciones 1"
                            },
                            legend: {
                                display: true,
                                position: 'top'
                            },
                            tooltips: {
                                mode: 'index',
                                intersect: false
                            },
                            responsive: true,
                            scales: {
                                xAxes: [{
                                    stacked: true
                                }],
                                yAxes: [{
                                    stacked: true
                                }]
                            }

                        }

                    };


                    break;
                case 'consumo':



                    names = [];
                     table  = {
                        names:[],
                        data:[]
                    };
                    table.names = $scope.records.map(function (el)
                    {
                        return el.Aplicaciones.nombre+"/" +el.Alternativas.nombre;
                    });

                    table.names.forEach(function (el) {
                        var rec = $scope.records.filter(function (r) {
                            return r.Aplicaciones.nombre+"/" +r.Alternativas.nombre==el;
                        })[0];

                        if (rec!=undefined)
                        {

                            var uso  = rec.Uso.map(function (m) {
                                return m.tons;
                            });

                            table.data.push(uso);
                            names.push(el);
                            table.names = names;
                        }



                    });
                    $scope.years = [2011,2012,2013,2014,2015,2016];

                    $scope.bar = {
                        "labels":['2011', '2012', '2013', '2014','2015','2016'],
                        "series":table.names,
                        "data": table.data,
                        "show":true,
                        options: {
                            legend: {
                                display: true,
                                position: 'top'
                            }

                        }
                    };


                    break;

                case 'aire2':

                     names = [];
                     table  = {
                        names:[],
                        data:[]
                    };
                    table.names = $scope.records.map(function (el)
                    {
                        return el.Aplicaciones.nombre+"/" +el.Alternativas.nombre;
                    });

                    table.names.forEach(function (el) {
                        var rec = $scope.records.filter(function (r) {
                            return r.Aplicaciones.nombre+"/" +r.Alternativas.nombre==el;
                        })[0];

                        if (rec!=undefined)
                        {

                            var uso  = rec.Uso.map(function (m) {
                                return m.tons;
                            });

                            table.data.push(uso);
                            names.push(el);
                            table.names = names;
                        }



                    });

                    $scope.years = [2011,2012,2013,2014,2015,2016];

                    $scope.bar = {
                        "labels":['2011', '2012', '2013', '2014','2015', '2016'],
                        "series":table.names,
                        "data": table.data,
                        "show":true,
                        options: {
                            legend: {
                                display: true,
                                position: 'top'
                            }

                        }
                    };


                    break;
                case 'empresa1':

                     names = [];
                     table  = {
                        names:[],
                        data:[]
                    };
                    table.names = $scope.records.map(function (el)
                    {
                        return el.Aplicaciones.nombre+"/" +el.Alternativas.nombre;
                    });

                    table.names.forEach(function (el) {
                        var rec = $scope.records.filter(function (r) {
                            return r.Aplicaciones.nombre+"/" +r.Alternativas.nombre==el;
                        })[0];

                        if (rec!=undefined)
                        {

                            var uso  = rec.Uso.map(function (m) {
                                return m.tons;
                            });

                            table.data.push(uso);
                            names.push(el);
                            table.names = names;
                        }



                    });

                    $scope.years = [2010,2015];

                    $scope.bar = {
                        "labels":['2011', '2012', '2013', '2014','2015','2016'],
                        "series":table.names,
                        "data": table.data,
                        "show":true,
                        options: {
                            legend: {
                                display: true,
                                position: 'top'
                            }

                        }
                    };


                    break;
                case 'empresa2':

                     names = [];
                     table  = {
                        names:[],
                        data:[]
                    };
                    table.names = $scope.records.map(function (el)
                    {
                        return el.Aplicaciones.nombre+"/" +el.Alternativas.nombre;
                    });

                    table.names.forEach(function (el) {
                        var rec = $scope.records.filter(function (r) {
                            return r.Aplicaciones.nombre+"/" +r.Alternativas.nombre==el;
                        })[0];

                        if (rec!=undefined)
                        {

                            var uso  = rec.Uso.map(function (m) {
                                return m.tons;
                            });

                            table.data.push(uso);
                            names.push(el);
                            table.names = names;
                        }



                    });

                    $scope.years = [2011,2012,2016,2014,2015,2016];

                    $scope.bar = {
                        "labels":['2011', '2012', '2013', '2014','2015','2016'],
                        "series":table.names,
                        "data": table.data,
                        "show":true,
                        options: {
                            legend: {
                                display: true,
                                position: 'top'
                            }

                        }
                    };

                    break;
                case 'importaciones2':
                     names = [];
                     table  = {
                        names:[],
                        data:[]
                    };
                    table.names = $scope.records.map(function (el)
                    {
                        return el.Alternativas.nombre;
                    });

                    table.names.forEach(function (el) {
                        var rec = $scope.records.filter(function (r) {
                            return r.Alternativas.nombre==el;
                        })[0];

                        if (rec!=undefined)
                        {

                            var uso  = rec.Uso.map(function (m) {
                                return m.tons;
                            });

                            table.data.push(uso);
                            names.push(el);
                            table.names = names;
                        }



                    });

                    $scope.years = [2011,2012,2013,2014,2015,2016];

                    $scope.bar = {
                        "labels":['2011', '2012', '2013', '2014','2015','2016'],
                        "series":table.names,
                        "data": table.data,
                        "show":true,
                        options: {
                            legend: {
                                display: true,
                                position: 'top'
                            }

                        }
                    };


                    break;
                case 'aire3':
                case 'refri':
                    names = [];
                    table  = {
                        names:[],
                        data:[]
                    };
                    table.names = $scope.records.map(function (el)
                    {
                        return el.Aplicaciones.nombre;
                    });

                    table.names.forEach(function (el) {
                        var rec = $scope.records.filter(function (r) {
                            return r.Aplicaciones.nombre==el;
                        })[0];

                        if (rec!=undefined)
                        {

                            // var uso  = rec.Uso.map(function (m) {
                            //     return m.tons;
                            // });

                            table.data.push(rec.explotacion);
                            names.push(el);
                            table.names = names;
                        }



                    });

                    $scope.years = [2011,2012,2013,2014,2015,2016];

                    $scope.bar = {
                        "labels":['2011', '2012', '2013', '2014','2015','2016'],
                        "series":table.names,
                        "data": table.data,
                        "show":true,
                        options: {
                            legend: {
                                display: true,
                                position: 'top'
                            }

                        }
                    };
                    break;


                default:
                    $scope.bar = {
                        "labels":['2011', '2012', '2013', '2014','2015','2016'],
                        "series":table.names,
                        "data": table.data,
                        "show":false,
                        options: {
                            legend: {
                                display: true,
                                position: 'top'
                            }

                        }};
                    break;
            }
        }
        function ShowPieCharts(year) {

          var chart = {};
           var pieLabels = $scope.records.map(function (l) {
               if (l.Sustancia!=undefined) {
                   return l.Sustancia.nombre;
               }

               if (l.Subsector!=undefined) {
                   return l.Subsector.nombre;
               }

               if (l.Alternativa!=undefined) {
                   return l.Alternativa.nombre;
               }
               if (l.Alternativas!=undefined) {
                   return l.Alternativas.nombre;
               }

               if (l.alternativa!=undefined) {
                   return l.alternativa.nombre;
               }

               if (l.sustancia!=undefined) {
                   return l.sustancia.nombre;
               }


               return undefined;

           });

            pieLabels.filter(function (lbl) {
                return lbl!=undefined;
            });

            var pieTableData = $scope.records.map(function (lb)
            {
                  var a = lb.Uso.filter(function (fu) {
                      return fu.anno ==year;
                  })[0];
                if (a!=undefined) {
                    return a.tons;
                }
                return 0;
            }).map(function (val) {
                if (val==undefined) {
                    return 0;
                }
                return val;
            });

            pieTableData = _(pieTableData).reject(function(t){return t==0;});

            if (pieTableData.length>0)
            {
                chart =
                {
                    "labels":pieLabels,
                    "data": pieTableData,
                    tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>%",
                    "options":{
                        legendCallback: function(chart) {
                            var text = [];
                            text.push('<ul class="' + chart.id + '-legend list-le">');

                            var data = chart.data;
                            var datasets = data.datasets;
                            var labels = data.labels;

                            if (datasets.length) {
                                for (var i = 0; i < datasets[0].data.length; ++i) {
                                    text.push('<li>');
                                    if (labels[i]) {
                                        text.push('<span style="background-color:' + datasets[0].backgroundColor[i] + ';border-radius: 1px;">&nbsp;&nbsp;</span>');
                                        text.push(labels[i]+"-");
                                        text.push('<strong>'+datasets[0].data[i]+'</strong>');

                                    }
                                    text.push('</li>');
                                }
                            }

                            text.push('</ul>');
                            return text.join('');
                        },
                        legend: {
                            display: false,
                            position: 'top'
                        },
                        title: {
                            display: true,
                            text:'A\u00F1o '+year
                        }
                    },
                    "show":true

                };
            }
            else{
                chart = undefined;
            }



            return chart;
        }

        function clearChart(elementId)
        {
            if (document.getElementById(elementId))
            {
                var charts = ChartJs.Chart.instances; // Get all chart instances
                for (var key in charts){ // loop looking for the chart you want to remove
                    if (!charts.hasOwnProperty(key)){
                        continue;
                    }
                    var chartAux = ChartJs.Chart.instances[key];
                    if (chartAux.chart.ctx.canvas.id === elementId){
                        // Remove chart-legend before destroying the chart
                        var parent = chartAux.chart.ctx.canvas.parentElement;
                        var legend = chartAux.chart.ctx.canvas.nextElementSibling;
                        parent.removeChild(legend);
                        // Compare id with elementId passed by and if it is the one
                        // you want to remove just call the destroy function
                        ChartJs.Chart.instances[key].destroy();
                    }
                }
            }
        }

        function clearAllChart() {
            var charts = ChartJs.Chart.instances; // Get all chart instances
            for (var key in charts){ // loop looking for the chart you want to remove
                if (!charts.hasOwnProperty(key)){
                    continue;
                }
                var chartAux = ChartJs.Chart.instances[key];
                var parent = chartAux.chart.ctx.canvas.parentElement;
                var legend = chartAux.chart.ctx.canvas.nextElementSibling;
                parent.removeChild(legend);
                ChartJs.Chart.instances[key].destroy();

            }
        }

        function init() {
            // var user = $cookies.get('user');
            var user = $localStorage.user;
            if(user==undefined)
            {

                $timeout(function () {
                    $location.path('/login');
                },300);
            }
            else{
                $scope.user  = user;
            }

            $scope.pies = [];
            clearAllChart();


        }

        init();




    })
    .controller("modalController", function($scope, SAO, Manager, $uibModalInstance, record, general, Util, documents,action,$timeout,ModelValidator) {

        //Este controlador es el encargado de adicionar y editar los elementos.|| Este controlador es para los modals
        $scope.action = action;
        $scope.record = angular.copy(record);


        $scope.error = {
            show:false,
            message:'Ha ocurrido un error',
            tipo: " "
        };
        $scope.SAO = SAO;
        $scope.general = general;
        $scope.documents = documents;
        $scope.municipios = [];
        $scope.provincias = [];
        $scope.ministerios = [];
        $scope.empresas =[];
        $scope.osdes = [];
        Manager.record('municipio').then(function(data){$scope.municipios = data.rows.map(function(m){return m.doc;})});
        Manager.record('provincia').then(function(data){$scope.provincias = data.rows.map(function(m){return m.doc;})});
        Manager.record('ministerio').then(function(data){$scope.ministerios = data.rows.map(function(m){return m.doc;})});
        Manager.record('empresa').then(function(data){$scope.empresas = data.rows.map(function(m){return m.doc;})});
        Manager.record('osde').then(function(data){$scope.osdes = data.rows.map(function(m){return m.doc;})});

        // $scope.alternativa = 'AlternativaHFC';

        //Configuracion para el modal de general2
        $scope.alternativa = "AlternativaHFC";
        var selected = $scope.alternativa;
        //Configuracion para el modal tabla 8 consumo
        $scope.consumoR = SAO.Aplicaciones8[0];
        $scope.Tabla2R = SAO.Tabla2[0];
        $scope.Tabla22R = SAO.Tabla22[0];
        $scope.Tabla23R = SAO.Tabla23[0];
        $scope.Tabla5R = SAO.Tabla5[0];
        $scope.Tabla9R = SAO.Tabla9[0];
        $scope.Tabla12R = SAO.Tabla12[0];
        $scope.Tabla13R = SAO.Tabla13[0];
        $scope.Tabla11AR = SAO.Tabla11A[0];
        $scope.Tabla10AR = SAO.Tabla10A[0];
        $scope.Tabla11BR = SAO.Tabla11B[0];
        $scope.Tabla10BR = SAO.Tabla10B[0];
        $scope.SubsectorTabla7R = SAO.SubsectorTabla7[0];
        $scope.SustanciasTabla6 = SAO.SustanciasTabla6[0];
        var selectedConsumo = $scope.consumoR;
        var selectedTabla2 = $scope.Tabla2R;
        var selectedTabla22 = $scope.Tabla22R;
        var selectedTabla23 = $scope.Tabla23R;
        var selectedTabla5 = $scope.Tabla5R;
        var selectedTabla9 = $scope.Tabla9R;
        var selectedTabla12 = $scope.Tabla12R;
        var selectedTabla13 = $scope.Tabla13R;
        var selectedTabla11A = $scope.Tabla11AR;
        var selectedTabla10A = $scope.Tabla10AR;
        var selectedTabla11B = $scope.Tabla11BR;
        var selectedTabla10B = $scope.Tabla10BR;
        var selectedTabla6 = $scope.SustanciasTabla6;
        var SubsectorTabla7 = $scope.SubsectorTabla7;


        ///CRUD operations

        function UpdateElement(element) {
            return Manager.update(element).then(function(result) {
                //todo on success
                console.info(JSON.stringify(result));
            }).
            catch (function(reason) {
                //todo on fail
                console.warn(JSON.stringify(reason));
            });
        }


        function AddElement(element) {
            Manager.create(element).then(function(result) {
                //todo on success
                $scope.documents.push(element);
                console.info(JSON.stringify(result));
            }).
            catch (function(reason) {
                //todo on fail
                console.warn(JSON.stringify(reason));
            })
        }

        function Add(element) {
            var error = [];
            var msg = {
                experiencias:'Introduzca los a\u00F1os de experiencia.',
                alternativa:'Nombre de alternativa incorrecto. \n Debe contener m\u00E1s de tres car\u00E1cteres y/o no se acepta car\u00E1teres extra\u00F1os. ',
                unidades:'Introduzca el No. unidades.'
            };
            switch (element.tipo) {
                case 'general1':
                    element.sector = element.sector.concat($scope.SAO.Sector.filter(function(el) {
                        return el.value == true;
                    }));
                    if (element.sector.length==0){throw 'Seleccione al menos un sector';}
                    break;
                case 'espuma1':
                case 'espuma2':
                case 'importaciones1':

                    if(element.Uso!=undefined)
                    {
                        if(element.Uso.length<5)
                        {
                            $scope.error.tipo='anno';
                            throw 'Faltan a\u00F1os por agregar el consumo en toneladas m\u00E9tricas. ';
                        }
                    }

                    break;
                case 'espuma3':
                    error = ModelValidator.RecordError(element);
                    if (error.length>0)
                    {
                        error.forEach(function(e){
                            $scope.error.tipo = e;
                            throw msg[e];

                        });
                    }
                    if(element.otrosAlternativa!=''){
                        element.Alternativa={nombre:element.otrosAlternativa}
                    }
                    if(element.Uso!=undefined)
                    {
                        if(element.Uso.length<6)
                        {
                            $scope.error.tipo='anno';
                            throw 'Faltan a\u00F1os por agregar el consumo en toneladas m\u00E9tricas. ';
                        }
                    }
                    break;
                case 'aire2':
                case 'consumo':
                case 'aerosoles':
                case 'empresa3':
                case 'empresa1':
                case 'empresa2':
                    error = ModelValidator.RecordError(element);
                    if (error.length>0)
                    {
                        error.forEach(function(e){
                            $scope.error.tipo = e;
                            throw msg[e];

                        });
                    }
                    if(element.otrosAlternativa!=''){
                        element.Alternativas={nombre:element.otrosAlternativa}
                    }
                    if(element.Uso!=undefined)
                    {
                        if(element.Uso.length<6)
                        {
                            $scope.error.tipo='anno';
                            throw 'Faltan a\u00F1os por agregar el consumo en toneladas m\u00E9tricas. ';
                        }
                    }
                    break;
                case 'general2':
                    error = ModelValidator.RecordError(element);
                    if (error.length>0)
                    {
                        error.forEach(function(e){
                            $scope.error.tipo = e;
                            throw msg[e];

                        });
                    }
                    if(element.otrosAlternativa!=''){
                        element.Tipo={nombre:element.otrosAlternativa}
                    }
                    break;
                case 'empresa4':
                    error = ModelValidator.RecordError(element);
                    if (error.length>0)
                    {
                        error.forEach(function(e){
                            $scope.error.tipo = e;
                            throw 'Introduzca el valor de  ' +  e;
                        });
                    }
                    if(element.sustanciasR==undefined){
                        $scope.error.tipo='sustanciasR';
                        throw 'Introduzca la sustancia R-141b';
                    }
                    if(element.sustanciasRL==undefined){
                        $scope.error.tipo='sustanciasRL';
                        throw 'Introduzca la sustancia RL-95';
                    }
                    element.explotacion = element.experiencias * element.unidades;
                    break;
                case 'general':
                     error = ModelValidator.RecordError(element);
                    if (error.length>0)
                    {
                        error.forEach(function(e){
                            $scope.error.tipo = e;
                            throw 'Introduzca el valor de  ' +  e + '.';
                        });
                    }
                    if(element.empresa==''){
                        throw 'Introduzca el nombre de la empresa.';
                    }

                 break;
                case 'importaciones2':
                    error = ModelValidator.RecordError(element);
                    if (error.length>0)
                    {
                        error.forEach(function(e){
                            $scope.error.tipo = e;
                            throw msg[e];

                        });
                    }
                    if(element.otrosAlternativa!=''){
                        element.Tipo={nombre:element.otrosAlternativa}
                    }
                    if(element.Importaciones!=undefined)
                    {
                        if(element.Importaciones.length<6)
                        {
                            $scope.error.tipo='anno';
                            throw 'Faltan a\u00F1os por agregar el consumo en toneladas m\u00E9tricas. ';
                        }
                    }

                    break;


                case 'aire3':
                    error = ModelValidator.RecordError(element);
                    if (error.length>0)
                    {
                        error.forEach(function(e){
                            $scope.error.tipo = e;
                            throw msg[e];

                        });
                    }
                    if(element.otrosAlternativa!=''){
                        element.Sustancias={nombre:element.otrosAlternativa}
                    }

                    element.explotacion = element.experiencias * element.unidades;
                    break;
                case 'refri':
                    error = ModelValidator.RecordError(element);
                    if (error.length>0)
                    {
                        error.forEach(function(e){
                            $scope.error.tipo = e;
                            throw msg[e];
                        });
                    }
                    if(element.otrosAlternativa!=''){
                        element.Alternativas={nombre:element.otrosAlternativa}
                    }

                    element.explotacion = element.experiencias * element.unidades;
                    break;
                default:

                    break;
            }

            //todo validar datos
            element = Util.collect($scope.general, element);

            if(element.CantRefriRefri!=undefined)
            {
                if(element.CantRefriRefri.length<3)
                {
                    $scope.error.tipo='CantRefriRefri';
                    throw 'Quedan cantidad de refrigerante consumido para refrigeraci\u00F3n sin valor. ';
                }
            }
            if(element.CantRefriAire!=undefined)
            {
                if(element.CantRefriAire.length<3)
                {
                    $scope.error.tipo='CantRefriAire';
                    throw 'Quedan cantidad de refrigerante consumido para aire acondicionado sin valor. ';
                }
            }
            if(element.Recuperacion!=undefined)
            {
                if(element.Recuperacion.length<5)
                {
                    $scope.error.tipo='Recuperacion';
                    throw 'Quedan cantidad de equipos de recuperaci\u00F3n sin valor. ';
                }
            }
            if(element.Recuperado!=undefined)
            {
                if(element.Recuperado.length<4)
                {
                    $scope.error.tipo='Recuperado';
                    throw 'Quedan cantidad recuperada sin valor . ';
                }
            }
            if(element.Total!=undefined)
            {
                if(element.Total.length<4)
                {
                    $scope.error.tipo='Total';
                    throw 'Quedan personal productivo sin valor';
                }
            }
            if(element.unidades=='')
            {

                    $scope.error.tipo='unidades';
                    throw 'Introduzca el No. de unidades';
            }
            // if(element.explotacion=='')
            // {
            //
            //     throw 'Introduzca los a\u00F1os de explotaci\u00F3n';
            //
            // }



            AddElement(element);
        }

        function ValidateSettings()
        {

            if ($scope.general.osde=='')
            {
                $scope.error.tipo='osde';
                throw 'Introduzca el nombre de la OSDE';
            }
            if ($scope.general.empresa=='')
            {
                $scope.error.tipo='empresa';
                throw 'Introduzca el nombre de la empresa';
            }
        }

        function Close() {
            $uibModalInstance.dismiss('cancel');
        }

        function Finish() {
            $uibModalInstance.close('close');
        }


        function DeleteElement(element) {
            return Manager.delete(element).then(function(result) {
                //todo on success
                console.info(JSON.stringify(result));
            }).
            catch (function(reason) {
                //todo on fail
                console.warn(JSON.stringify(reason));
            })
        }

        $scope.Close = function() {
            //TODO: reverse update in actions list
            // console.log($scope.record);
            Close();
        };
        $scope.CloseGeneral = function() {
            //TODO: reverse update in actions list
            // console.log($scope.record);

            if(element.osde==''){
                throw 'Introduzca el nombre de la OSDE';
            }
            if(element.empresa==''){
                throw 'Introduzca el nombre de la empresa';
            }


            Finish();
        };


        $scope.Save = function() {
            //TODO: reverse update in actions list
           try{
               if ($scope.record._id == undefined) {
                   Add($scope.record);
               } else {
                   Add($scope.record);
               }

               Finish();

           }
           catch (err)
           {
               if(Object.prototype.toString.call( err ) === '[object Object]'){
                   $scope.error.message = err.message;
               }
               else if(err.message!=undefined){
                   $scope.error.message = err.message;
               }
               else {
                   $scope.error.message = err;
               }
               $scope.error.show = true;
               $scope.error.show = true;

           }

        };

        $scope.Delete = function(element) {
            DeleteElement(element).
            finally(function(data) {
                Finish();
            });

        }
        ;


        $scope.Check = function () {
            try{
                ValidateSettings();
                Finish();
            }
            catch (err){
                $scope.error.message = err;
                $scope.error.show = true;

            }
        };

        function init() {

            if (action != 'edit')
            {
                switch ($scope.record.tipo)
                {
                    case 'general3':
                        $scope.record.Sector = selectedTabla2.aplicacion;
                        $scope.record.Subsector = selectedTabla2.alternativas[0];
                        $scope.record.Alternativa = selectedTabla2.uso2[0];
                        break;
                    case 'general1':
                        // $scope.record.sectores = SAO.Sectores[1];
                        $scope.record.sustancia = SAO.Sustancias[0];

                        break;

                    case 'general2':

                        $scope.record.Alternativa = selectedTabla22.aplicacion;
                        $scope.record.Tipo = selectedTabla22.alternativas[0];
                        $scope.record.Sector = selectedTabla22.uso2[0];
                        $scope.record.ra = SAO.RA[0];


                        break;
                    case 'espuma1':

                        $scope.record.Sustancia = SAO.SustanciasTabla3[0];
                        $scope.year = 2010;

                        break;
                    case 'espuma2':

                        $scope.record.Subsector = SAO.SubsectorTabla4[0];
                        $scope.year = 2010;

                        break;
                    case 'espuma3':

                        $scope.record.Alternativa = SAO.Tabla5[0].alternativas[0];
                        $scope.year = 2011;

                        break;

                    case 'aire2':
                        $scope.record.Alternativas = SAO.Tabla9[0].alternativas[0];
                        $scope.year = 2011;

                        break;
                    case 'aire3':
                        $scope.record.Sustancias = SAO.Tabla11A[0].alternativas[0];
                        $scope.record.clasificacion = SAO.Clasificacion[0];
                        $scope.record.Estado = SAO.Estado[0];
                        $scope.record.year = 2010;
                        $scope.year = 2010;


                        break;
                    case 'consumo':
                        $scope.record.Alternativas = SAO.Aplicaciones8[0].alternativas[0];
                        $scope.year = 2011;

                        break;
                    case 'refri':
                        $scope.record.Alternativas = SAO.Tabla11B[0].alternativas[0];
                        $scope.record.clasificacion = SAO.ClasificacionRefri[0];
                        $scope.record.EstadoRefri = SAO.EstadoRefri[0];
                        $scope.record.year = 2010;
                        $scope.year = 2010;

                        break;
                    case 'aerosoles':
                        $scope.record.Alternativas = SAO.Tabla12[0].alternativas[0];
                        $scope.year = 2011;

                        break;
                    case 'importaciones1':
                        $scope.record.Sustancia = SAO.SustanciasTabla6[0];
                        $scope.year = 2010;

                        break;
                    case 'importaciones2':
                        $scope.record.Tipo = SAO.Tabla23[0].alternativas[0];
                        $scope.year = 2011;

                        break;
                    case 'empresa1':
                        $scope.record.Alternativas = SAO.Tabla10A[0].alternativas[0];
                        $scope.year = 2011;

                        break;
                    case 'empresa2':
                        $scope.record.Alternativas = SAO.Tabla10B[0].alternativas[0];
                        $scope.year = 2011;

                        break;
                    case 'empresa3':
                        $scope.record.Alternativas = SAO.Tabla13[0].alternativas[0];
                        $scope.year = 2011;

                        break;
                    case 'empresa4':
                        $scope.record.sustancia = SAO.OrgProduccion[0];
                        //$scope.record.municipio = SAO.Provincias.municipios[0];
                        $scope.record.TipoAire = SAO.TipoAire[0];
                        $scope.record.TipoRefrigeracion = SAO.TipoRefri[0];
                        $scope.record.SustanciaRefrigerante = SAO.SustanciasRefrigerante[1];
                        $scope.record.SustanciaAire = SAO.SustanciasAire[1];
                        $scope.re2 = 'AR500';
                        $scope.re3 = 'R134a';
                        $scope.re4 = 'Ingenieros';
                        $scope.re = 'HCFC';
                        $scope.re1 = 'HCFC';


                        break;


                    default:

                        break;
                }
            }
            else{
                switch ($scope.record.tipo)
                {

                    case 'general3':
                        var Temp=undefined;
                        Temp = _.find(SAO.Tabla2,function(o){return o.aplicacion.nombre==$scope.record.Sector.nombre;});

                        var general3 = _.find(Temp.alternativas,function(a){return a.nombre == $scope.record.Subsector.nombre; });
                        if (general3==undefined)
                        {
                            Temp.alternativas =$scope.Tabla2R.alternativas.concat($scope.record.Subsector);
                        }
                        selectedTabla2 = Temp;
                        $timeout(function () {
                            $scope.$apply($scope.Tabla2R=Temp);
                        },10);
                        break;
                    case 'general2':
                        $scope.Tabla22R = _.find(SAO.Tabla22,function(o){return o.aplicacion.nombre==$scope.record.Alternativa.nombre;});
                        var general2 = _.find($scope.Tabla22R.alternativas,function(a){return a.nombre == $scope.record.Tipo.nombre; });
                        if (general2==undefined)
                        {
                            $scope.Tabla22R.alternativas =$scope.Tabla22R.alternativas.concat($scope.record.Tipo);
                        }
                        selectedTabla22 = $scope.Tabla22R;

                        break;
                    case 'espuma1':
                    case 'espuma2':
                        $scope.year = 2010;
                        break;
                    case 'aire3':
                        $scope.Tabla11AR = _.find(SAO.Tabla11A,function(o){return o.aplicacion.nombre==$scope.record.Aplicaciones.nombre;});
                        var aire3 = _.find($scope.Tabla11AR.alternativas,function(a){return a.nombre == $scope.record.Sustancias.nombre; });
                        if (aire3==undefined)
                        {
                           $scope.Tabla11AR.alternativas =$scope.Tabla11AR.alternativas.concat($scope.record.Sustancias);
                        }
                        selectedTabla11A = $scope.Tabla11AR;
                        $scope.year = 2010;
                        break;
                    case 'refri':
                    case 'importaciones1':
                        $scope.year = 2010;
                        break;

                    case 'espuma3':
                        $scope.Tabla5R = _.find(SAO.Tabla5,function(o){return o.aplicacion.nombre==$scope.record.Subsector.nombre;});
                        var espuma3 = _.find($scope.Tabla5R.alternativas,function(a){return a.nombre == $scope.record.Alternativa.nombre; });
                        if (espuma3==undefined)
                        {
                            $scope.Tabla5R.alternativas =$scope.Tabla5R.alternativas.concat($scope.record.Alternativa);
                        }
                        selectedTabla5 = $scope.Tabla5R;
                        $scope.year = 2011;
                        break;
                    case 'aire2':
                        $scope.Tabla9R = _.find(SAO.Tabla9,function(o){return o.aplicacion.nombre==$scope.record.Aplicaciones.nombre;});
                        var aire2 = _.find($scope.Tabla9R.alternativas,function(a){return a.nombre == $scope.record.Alternativas.nombre; });
                        if (aire2==undefined)
                        {
                            $scope.Tabla9R.alternativas =$scope.Tabla9R.alternativas.concat($scope.record.Alternativas);
                        }
                        selectedTabla9 = $scope.Tabla9R;
                        $scope.year = 2011;
                        break;
                    case 'consumo':
                        $scope.consumoR = _.find(SAO.Aplicaciones8,function(o){return o.aplicacion.nombre==$scope.record.Aplicaciones.nombre;});
                        var consumo = _.find($scope.consumoR.alternativas,function(a){return a.nombre == $scope.record.Alternativas.nombre; });
                        if (consumo==undefined)
                        {
                            $scope.consumoR.alternativas =$scope.consumoR.alternativas.concat($scope.record.Alternativas);
                        }
                        selectedConsumo = $scope.consumoR;
                        $scope.year = 2011;
                        break;

                    case 'aerosoles':
                        $scope.Tabla12R = _.find(SAO.Tabla12,function(o){return o.aplicacion.nombre==$scope.record.Aplicaciones.nombre;});
                        var aerosoles = _.find($scope.Tabla23R.alternativas,function(a){return a.nombre == $scope.record.Alternativas.nombre; });
                        if (aerosoles==undefined)
                        {
                            $scope.Tabla23R.alternativas =$scope.Tabla23R.alternativas.concat($scope.record.Alternativas);
                        }
                        selectedTabla12 = $scope.Tabla12R;
                        $scope.year = 2011;
                        break;
                    case 'importaciones2':
                        $scope.Tabla23R = _.find(SAO.Tabla23,function(o){return o.aplicacion.nombre==$scope.record.Alternativa.nombre;});
                        var importaciones2 = _.find($scope.Tabla23R.alternativas,function(a){return a.nombre == $scope.record.Tipo.nombre; });
                        if (importaciones2==undefined)
                        {
                            $scope.Tabla23R.alternativas =$scope.Tabla23R.alternativas.concat($scope.record.Alternativa);
                        }
                        selectedTabla23 = $scope.Tabla23R;
                        $scope.year = 2011;
                        break;

                    case 'empresa3':
                        $scope.Tabla13R = _.find(SAO.Tabla13,function(o){return o.aplicacion.nombre==$scope.record.Aplicaciones.nombre;});
                        var empresa3 = _.find($scope.Tabla13R.alternativas,function(a){return a.nombre == $scope.record.Alternativas.nombre; });
                        if (empresa3==undefined)
                        {
                            $scope.Tabla13R.alternativas =$scope.Tabla13R.alternativas.concat($scope.record.Alternativas);
                        }
                        selectedTabla13 = $scope.Tabla13R;
                        $scope.year = 2011;
                        break;
                    case 'empresa1':
                        $scope.Tabla10AR = _.find(SAO.Tabla10A,function(o){return o.aplicacion.nombre==$scope.record.Aplicaciones.nombre;});
                        var empresa1 = _.find($scope.Tabla10AR.alternativas,function(a){return a.nombre == $scope.record.Alternativas.nombre; });
                        if (empresa1==undefined)
                        {
                            $scope.Tabla10AR.alternativas =$scope.Tabla10AR.alternativas.concat($scope.record.Alternativas);
                        }
                        selectedTabla10A = $scope.Tabla10AR;
                        $scope.year = 2011;
                        break;
                    case 'empresa2':
                        $scope.Tabla10BR = _.find(SAO.Tabla10B,function(o){return o.aplicacion.nombre==$scope.record.Aplicaciones.nombre;});
                        var empresa2 = _.find($scope.Tabla10BR.alternativas,function(a){return a.nombre == $scope.record.Alternativas.nombre; });
                        if (empresa2==undefined)
                        {
                            $scope.Tabla10BR.alternativas =$scope.Tabla10BR.alternativas.concat($scope.record.Alternativas);
                        }
                        selectedTabla10B = $scope.Tabla10BR;
                        $scope.year = 2011;
                        break;
                    default:
                        break;
                }

            }
        }


        ;

        //Esto es del modal de general2

        $scope.ShowAlt=function () {
            selected = $scope.alternativa.trim();
        };

        $scope.ToCompare = function (alternativa) {

            return alternativa == selected;
        };


        //Modal de consumo

        $scope.OnSelect=function ($item,$model,prop,update) {
            var type = prop==undefined?'year':prop;
            $scope[type] = 0;
            $scope[update] = $model;
            $scope.amount=0;
        };

        $scope.ConsumoYear = function(year,amount){

                if(amount==undefined){
                   amount=0;
                }

                // record.Uso.push({"anno":year,"tons":amount,"nombre": +year+":"+amount});
                record.Uso = _.reject(record.Uso,function (el) { return el.anno==year;
                }).concat([{"anno":year,"tons":amount,"nombre": +year+":"+amount}]);
                record.Uso =  _.uniq(record.Uso,false,function (el) {
                    return el.anno;
                });

                record.Uso = _.sortBy( record.Uso,function (us) {
                    return us.anno;
                });
                $scope.record.Uso = angular.copy(record.Uso)

        };
        $scope.ConsumoImportaciones = function(year1,amount){

            if(amount==undefined){
                amount=0;
            }

            // record.Uso.push({"anno":year,"tons":amount,"nombre": +year+":"+amount});
            record.Importaciones = _.reject(record.Importaciones,function (el) { return el.anno==year1;
            }).concat([{"anno":year1,"tons":amount,"nombre": +year1+":"+amount}]);
            record.Importaciones =  _.uniq(record.Importaciones,false,function (el) {
                return el.anno;
            });

            record.Importaciones = _.sortBy( record.Importaciones,function (us) {
                return us.anno;
            });
            $scope.record.Importaciones = angular.copy(record.Importaciones)

        };
        $scope.ConsumoRecuperacion = function(re2,amount){
            if(amount==undefined){
                amount=0;
            }

            // record.Recuperacion.push({"re2":re2,"cant2":amount,"nombre": +re2+":"+amount});
            record.Recuperacion = _.reject(record.Recuperacion,function (el) { return el.anno==re2;
            }).concat([{"re2":re2,"cant2":amount,"nombre": +re2+":"+amount}]);
            record.Recuperacion =  _.uniq(record.Recuperacion,false,function (el) {
                return el.re2;
            });

            record.Recuperacion = _.sortBy( record.Recuperacion,function (us) {
                return us.re2;
            });

            $scope.record.Recuperacion= angular.copy(record.Recuperacion);

        };
        $scope.ConsumoRecuperado = function(re3,amount){

            if(amount==undefined){
                amount=0;
            }

            record.Recuperado = _.reject(record.Recuperado,function (el) {return el.re3==re3;}).concat([{"re3":re3,"cant3":amount,"nombre": re3+":"+amount}]);
            // record.Recuperado.push({"re3":re3,"cant3":amount,"nombre": re3+":"+amount});
            record.Recuperado =  _.uniq(record.Recuperado,false,function (el) {
                return el.re3;
            });

            record.Recuperado = _.sortBy( record.Recuperado,function (us) {
                return us.re3;
            });

            $scope.record.Recuperado= angular.copy(record.Recuperado);

        };
        $scope.ConsumoTotal = function(re4,amount){

            if(amount==undefined){
                amount=0;
            }
            record.Total = _.reject(record.Total,function (el) {return el.re4==re4;}).concat([{"re4":re4,"cant4":amount,"nombre": +re4+":"+amount}]);

            record.Total.push({"re4":re4,"cant4":amount,"nombre": +re4+":"+amount});
            record.Total =  _.uniq(record.Total,false,function (el) {
                return el.re4;
            });

            record.Total = _.sortBy( record.Total,function (us) {
                return us.re4;
            });
            $scope.record.Total= angular.copy(record.Total);

        };
        $scope.ConsumoCantRefriRefri = function(re,amount){

            if(amount==undefined){
                amount=0;
            }

            // record.CantRefriRefri.push({"re":re,"cant":amount,"nombre": +re+":"+amount});
            record.CantRefriRefri = _.reject(record.CantRefriRefri,function (el) { return el.anno==re;
            }).concat([{"re":re,"cant":amount,"nombre": +re+":"+amount}]);
            record.CantRefriRefri =  _.uniq(record.CantRefriRefri,false,function (el) {
                return el.re;
            });

            record.CantRefriRefri = _.sortBy( record.CantRefriRefri,function (us) {
                return us.re;
            });
            $scope.record.CantRefriRefri = angular.copy(record.CantRefriRefri)

        };
        $scope.ConsumoCantRefriAire = function(re1,amount){

            if(amount==undefined){
                amount=0;
            }

            // record.CantRefriAire.push({"re1":re1,"cant1":amount,"nombre": +re1+":"+amount});
            record.CantRefriAire = _.reject(record.CantRefriAire,function (el) { return el.anno==re1;
            }).concat([{"re1":re1,"cant1":amount,"nombre": +re1+":"+amount}]);
            record.CantRefriAire =  _.uniq(record.CantRefriAire,false,function (el) {
                return el.re1;
            });

            record.CantRefriAire = _.sortBy( record.CantRefriAire,function (us) {
                return us.re1;
            });
            $scope.record.CantRefriAire = angular.copy(record.CantRefriAire)

        };
        $scope.Explotacion = function(unidades,carga){
            $scope.explot = (element.explotacion.max*element.unidades)/1000;
        };

        $scope.ShowConsumo = function($item,$model){
           $scope.consumoR = _.find(SAO.Aplicaciones8,function(o){return o.aplicacion.nombre==$model.aplicacion.nombre;});
           selectedConsumo = $scope.consumoR;
           $scope.record.carga = selectedConsumo.carga;
           $scope.record.Aplicaciones = selectedConsumo.aplicacion;
           $scope.record.Alternativas = selectedConsumo.alternativas[0];
        };
        //Modal tabla2

        $scope.ShowTabla2 = function($item,$model){

            $scope.Tabla2R = _.find(SAO.Tabla2,function(o){return o.aplicacion.nombre==$model.aplicacion.nombre;});
            selectedTabla2 = $scope.Tabla2R;
            $scope.record.Sector = selectedTabla2.aplicacion;
            $scope.record.Subsector = selectedTabla2.alternativas[0];
            $scope.record.Alternativa = selectedTabla2.uso2[0];
            // $scope.record.uso2 = selectedTabla2.uso2;
        };
        $scope.ShowTabla22 = function($item,$model){
            $scope.Tabla22R = _.find(SAO.Tabla22,function(o){return o.aplicacion.nombre==$model.aplicacion.nombre;});
            selectedTabla22 = $scope.Tabla22R;
            $scope.record.Alternativa = selectedTabla22.aplicacion;
            $scope.record.Tipo = selectedTabla22.alternativas[0];
            $scope.record.Sector = selectedTabla22.uso2[0];
            $scope.record.ra = SAO.RA[0];
            // $scope.record.uso2 = selectedTabla2.uso2;
        };
            $scope.ShowTabla23 = function($item,$model){
            $scope.Tabla23R = _.find(SAO.Tabla23,function(o){return o.aplicacion.nombre==$model.aplicacion.nombre;});
            selectedTabla23 = $scope.Tabla23R;
            $scope.record.Alternativa = selectedTabla2.aplicacion;
            $scope.record.Tipo = selectedTabla23.alternativas[0];

        };

        // Modal Tabla5

        $scope.ShowTabla5 = function($item,$model){
            $scope.Tabla5R = _.find(SAO.Tabla5,function(o){return o.aplicacion.nombre==$model.aplicacion.nombre;});
            selectedTabla5 = $scope.Tabla5R;
            $scope.record.Subsector = selectedTabla5.aplicacion;
            $scope.record.Alternativa = selectedTabla5.alternativas[0];
        };

        //Modal Tabla 9

        $scope.ShowTabla9 = function($item,$model){
            $scope.Tabla9R = _.find(SAO.Tabla9,function(o){return o.aplicacion.nombre==$model.aplicacion.nombre;});
            selectedTabla9 = $scope.Tabla9R;
            $scope.record.Carga = selectedTabla9.carga;
            $scope.record.Aplicaciones = selectedTabla9.aplicacion;
            $scope.record.Alternativas = selectedTabla9.alternativas[0];

        };

        //Modal Tabla12

        $scope.ShowTabla12 = function($item,$model){
            $scope.Tabla12R = _.find(SAO.Tabla12,function(o){return o.aplicacion.nombre==$model.aplicacion.nombre;});
            selectedTabla12 = $scope.Tabla12R;
            $scope.record.Aplicaciones = selectedTabla12.aplicacion;
            $scope.record.Alternativas = selectedTabla12.alternativas[0];
        };

        // tabla3 anexo2

        $scope.ShowTabla3Anexo2 = function($item,$model){
            $scope.Tabla3Anexo2R = _.find(SAO.Tabla3Anexo2,function(o){return o.aplicacion.nombre==$model.aplicacion.nombre;});
            selectedTabla3Anexo2 = $scope.Tabla3Anexo2R;
            $scope.record.aplicacion = selectedTabla3Anexo2.aplicacion;
        };

        // Tabla11A

        $scope.ShowTabla11A = function($item,$model){
            $scope.Tabla11AR = _.find(SAO.Tabla11A,function(o){return o.aplicacion.nombre==$model.aplicacion.nombre;});
            selectedTabla11A = $scope.Tabla11AR;
            $scope.record.Capacidad = selectedTabla11A.carga;
            $scope.record.Aplicaciones = selectedTabla11A.aplicacion;
            $scope.record.Alternativas = selectedTabla11A.alternativas[0];
            $scope.record.clasificacion = SAO.Clasificacion[1];
        };
        $scope.ShowTabla11B = function($item,$model){
            $scope.Tabla11BR = _.find(SAO.Tabla11B,function(o){return o.aplicacion.nombre==$model.aplicacion.nombre;});
            selectedTabla11B = $scope.Tabla11BR;
            $scope.record.Capacidad = selectedTabla11B.carga;
            $scope.record.Aplicaciones = selectedTabla11B.aplicacion;
            $scope.record.Alternativas = selectedTabla11B.alternativas[0];
        };

        $scope.ShowTabla10A = function($item,$model){
            $scope.Tabla10AR = _.find(SAO.Tabla10A,function(o){return o.aplicacion.nombre==$model.aplicacion.nombre;});
            selectedTabla10A = $scope.Tabla10AR;
            $scope.record.Carga = selectedTabla10A.carga;
            $scope.record.Aplicaciones = selectedTabla10A.aplicacion;
            $scope.record.Alternativas = selectedTabla10A.alternativas[0];
        };
        $scope.ShowTabla10B = function($item,$model){
            $scope.Tabla10BR = _.find(SAO.Tabla10B,function(o){return o.aplicacion.nombre==$model.aplicacion.nombre;});
            selectedTabla10B = $scope.Tabla10BR;
            $scope.record.Aplicaciones = selectedTabla10B.aplicacion;
            $scope.record.Alternativas = selectedTabla10B.alternativas[0];
        };
        $scope.ShowTabla13 = function($item,$model){
            $scope.Tabla13R = _.find(SAO.Tabla13,function(o){return o.aplicacion.nombre==$model.aplicacion.nombre;});
            selectedTabla13 = $scope.Tabla13R;
            $scope.record.Aplicaciones = selectedTabla13.aplicacion;
            $scope.record.Alternativas = selectedTabla13.alternativas[0];
        }

        init();

    })
    .controller("uploadController",function ($scope, SAO, Manager, $uibModalInstance,$timeout,pouchDB,$localStorage) {

       $scope.isLoading = false;
       $scope.error = {
           show : false,
           message:'Database Sync Failed'
       };
       $scope.operation = {
           show:false,
           message:'Database Sync Done!'
       };

        $scope.Close = function() {
            //TODO: reverse update in actions list
            // console.log($scope.record);
            Close();
        };

        $scope.Finish = function() {
            //TODO: reverse update in actions list
            // console.log($scope.record);
            Finish();
        };


        $scope.LoadData = function (data) {
            if(data!=undefined){
                Receive(data);
            }

        };


        function Close() {
            $uibModalInstance.dismiss('cancel');
        }

        function Finish() {
            $uibModalInstance.close('close');
        }

        function Receive(data)
        {
            $scope.isLoading = true;
            var file = data.pop();
            Manager.from(file.path).then(function () {
                $scope.operation.show = true;
            }).catch(function () {
                $scope.error.show = true;
            }).finally(function () {
                $scope.isLoading = false;
            });
        }
        function init()
        {
            var user = $localStorage.user;
            if(user==undefined)
            {

                $timeout(function () {
                    $location.path('/login');
                },300);
            }
            else{
                $scope.user = user;
            }

        }

        init();


    })
    .controller('loginController',function ($scope, Manager,$location, $localStorage,SHA256){
        $scope.user = {
            "username":"",
            "password":"",
            "email":"",
            "tipo":"usuario"
        };
        $scope.users = [];
        $scope.signinError = {};

        $scope.SignIn = function (user)
        {

            Manager.record('usuario').
                then(function (data)
                {
                    $scope.users = data.rows.map(function(el) {
                        return el.doc;
                    });
                    user.password = SHA256(user.password).toString();
                    var result =  _.find($scope.users,{username:user.username,password:user.password});
                    if(result!=undefined)
                    {

                        $localStorage.user = result;
                        $location.path('/home');
                    }
                    else
                    {

                        $scope.signinError.show = true;
                        $scope.signinError.message = "Credenciales incorrectas";
                    }
                }).
                catch(function (reason)
                {
                    $scope.signinError.content = reason;
                    $scope.signinError.show = true;
                    $scope.signinError.message = "Ha ocurrido un error";
                })


            ;
        }

    })
    .controller('userController',function ($scope, Manager, $uibModal,$location,$timeout,$localStorage,ModelValidator) {
        $scope.users = [];
        $scope.user = undefined;
        $scope.signinError ={
            show:false,
            message:'Ha ocurrido un error'

        };
        $scope.User = function (user,size) {
            var instance = $uibModal.open({
                animation: true,
                templateUrl: "template/modal/user-modal.html",
                controller: function ($scope,Manager,user,$uibModalInstance,SHA256) {
                    $scope.user = user;
                    $scope.error ={
                        show:false,
                        message:'Ha ocurrido un error.',
                        user:{
                            password:
                            {
                                show:false,
                                message:"Una clave no segura."
                            },
                            username:
                            {
                                show:false,
                                message:"Una nombre de usuario correcto cuenta con blah blah."
                            }
                        }


                    };
                    $scope.Save= function (user)
                    {
                        user.tipo = "usuario";
                        if (ModelValidator.isValidUser(user))
                        {
                            user.password = SHA256(user.password).toString();
                            Manager.create(user).then(function(result) {
                                //todo on success
                                console.info(JSON.stringify(result));
                                Finish();
                            }).
                                catch (function(reason) {
                                //todo on fail
                                console.warn(JSON.stringify(reason));
                                Close();
                            })
                        }
                        else
                        {
                            var fields = ModelValidator.UserError(user);
                            if (fields.indexOf('password')!=-1)
                            {
                                $scope.error.user.password.show=true;
                            }
                            if (fields.indexOf('username')!=-1)
                            {
                                $scope.error.user.username.show=true;
                            }
                            $scope.error.show = true;
                            $scope.error.message = "Verifique la seguridad de las credenciales.";
                        }




                    };

                    $scope.Close = function () {
                        Close();
                    };

                    function Close() {
                        $uibModalInstance.dismiss('cancel');
                    }

                    function Finish() {
                        $uibModalInstance.close('close');
                    }
                },
                size: size,
                resolve: {
                    user:function () {
                        return user;
                    }
                }
            });

            instance.result.then(function(data) {
                Refresh();
            }, function(reason) {
                console.warn(JSON.stringify(reason));
            });
        };

        $scope.Delete = function (el) {
            DeleteElement(el).finally(function () {
                Refresh();
                // Finish();
            });
        };

        function Refresh()
        {
            Manager.record('usuario').then(function (data) {
                $scope.users = data.rows.map(function(el) {
                    return el.doc;
                });
            });
        }

        function DeleteElement(element) {
            return Manager.delete(element).then(function(result) {
                //todo on success
                console.info(JSON.stringify(result));
            }).
                catch (function(reason) {
                //todo on fail
                console.warn(JSON.stringify(reason));
            })
        }
        function init()
        {
            $scope.user = $localStorage.user;

            $timeout(function () {
                if($scope.user==undefined)
                {
                    $location.path('/login');
                }
                else {
                    Refresh();
                }
            },500);

        }

        init();
    })
    .controller('nomenclatureController',function ($scope, Manager, $uibModal, $timeout, $localStorage,ModelValidator,$location) {

    /**
     * UI Configuration
     * alert = { show: true|false, message:'string', type:'' }
     */
    $scope.alert =
    {
        show:false,
        message:'',
        type:'success'
    };

    $scope.nomenclatures = [];
    $scope.ntype = '';
    $scope.ntypes = ['ministerio','provincia','municipio','empresa','osde'];

    $scope.Nomenclature = function (nomenclature,size) {
        var instance = $uibModal.open({
            animation: true,
            templateUrl: "template/modal/nomenclature-modal.html",
            controller: function ($scope,Manager,nomenclature,ntype,$uibModalInstance) {
                $scope.alert =
                {
                    show:false,
                    message:'',
                    type:'success'
                };

                $scope.nomenclature = angular.copy(nomenclature);
                $scope.ntype = ntype;

                $scope.Save= function (nomenclature)
                {
                    if (ModelValidator.isValidNomenclature(nomenclature))
                    {
                        nomenclature.tipo = $scope.ntype;
                        Manager.create(nomenclature).
                        then(function (e)
                        {
                            $scope.alert.show = true;
                            $scope.alert.message = 'Nomenclador agregado correctamente';
                            $scope.alert.type = 'success';
                            $timeout(function () {
                                $scope.alert.show = false;
                                Finish(nomenclature.tipo);
                            },3000);
                        }).
                        catch(function (reason) {
                            $scope.alert.show = true;
                            $scope.alert.message = reason;
                            $scope.alert.type = 'danger';
                            $timeout(function () {
                                $scope.alert.show = false;
                            },3000);
                        })
                        ;
                    }
                    else
                    {
                        $scope.alert.show = true;
                        $scope.alert.message = 'Nomenclador muy corto';
                        $scope.alert.type = 'danger';
                        $timeout(function () {
                            $scope.alert.show = false;
                        },3000);
                    }
                };

                $scope.Close = function () {
                    Close();
                };

                function Close() {
                    $uibModalInstance.dismiss('cancel');
                }

                function Finish(data) {
                    $uibModalInstance.close(data==undefined?'close':data);
                }

            },
            size: size,
            resolve: {
                nomenclature:function () {
                    return nomenclature;
                },
                ntype:function () {
                    return $scope.ntype;
                }
            }
        });

        instance.result.then(function(data) {
            List(data);
        }, function(reason) {
            $scope.alert.show = true;
            $scope.alert.message = reason;
            $scope.alert.type = 'danger';
            $timeout(function () {
                $scope.alert.show = false;
            },3000);
        });
    };

    $scope.Delete = function(nomenclature, size) {
        var instance = $uibModal.open({
            animation: true,
            templateUrl: "template/modal/delete-modal.html",
            controller: function ($scope,nomenclature,$uibModalInstance) {
                $scope.record = nomenclature;
                $scope.Close = function () {
                    Close();
                };

                $scope.Delete = function (nomenclature) {
                    Finish(nomenclature.tipo);
                };

                function Close() {
                    $uibModalInstance.dismiss('cancel');
                }

                function Finish(data) {
                    $uibModalInstance.close(data==undefined?'close':data);
                }
            },
            size: size,
            resolve: {
                nomenclature: function () {
                    return nomenclature;
                }
            }
        });

        instance.result.then(function(data) {
            Delete(nomenclature).finally(function () {
                List(data);
            }) ;
        });
    };

    $scope.List = function (type) {
        $scope.ntype = type;
        List(type);
    };

    $scope.isActive = function (nstype) {
        return nstype == $scope.nstype;
    };

    function Delete(nomenclador)
    {
        return Manager.delete(nomenclador).
        then(function (e)
        {
            $scope.alert.show = true;
            $scope.alert.message = 'Nomenclador elimindo correctamente';
            $scope.alert.type = 'success';
            $timeout(function () {
                $scope.alert.show = false;
            },3000);
        }).
        catch(function (reason) {
            $scope.alert.show = true;
            $scope.alert.message = reason;
            $scope.alert.type = 'danger';
            $timeout(function () {
                $scope.alert.show = false;
            },3000);
        })
    }


    function List(type)
    {
        return Manager.record(type).then(function (data) {
            $scope.nomenclatures = data.rows.map(function (el) {
                return el.doc;
            });
        });
    }

    function init()
    {
        $scope.user = $localStorage.user;

        $timeout(function () {
            if($scope.user==undefined)
            {
                $location.path('/login');
            }
            else
            {
                $scope.ntype = $scope.ntypes[0];
                List($scope.ntypes[0]);
            }
        },500);
    }

        init();
    });



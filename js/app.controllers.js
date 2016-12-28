angular.module('app.sao')
    .controller("generalController", function($scope, Manager, SAO, Util, $uibModal,Menu,$sce,SubMenu,$cookies, Columns) {

        $scope.treeTemplate = $sce.trustAsHtml("template/directive/tree.html");
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
        $scope.OSDE = SAO.OSDE;
        $scope.Ministerio = SAO.Ministerio;

        //Tipo de objetos
        $scope.general = {
            "provincia": SAO.Provincias[1],
            "ministerio": SAO.Ministerio[1],
            "osde": SAO.OSDE[1],
            "empresa": "Empresa 1",
            "tipo": "general"
        };
        // Uso general alternativas a las SAO en la actualidad

        $scope.Sectores = SAO.Sectores.map(function(el) {
            el.value = false;
            return el;
        });
        $scope.Sustancias = SAO.Sustancias;

        $scope.general1 = {
            "sustancia": SAO.Sustancias[0],
            "sectores": [],
            "tipo": "general1"
        };
        //    Resumen de su uso en todos los sectores para cada año entre 2011-2015

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
            "otroHFC": "",
            "otroHFCMezclas": "",
            "otroHFO": "",
            "otroAlternativasOtras": "",
            "alternativaHFC": SAO.AlternativaHFC[0],
            "alternativaHFCMezclas": SAO.AlternativaHFCMezclas[0],
            "alternativaHFO": SAO.AlternativaHFO[0],
            "alternativaOtras": SAO.AlternativaOtras[0],
            "ra": SAO.RA[0],
            "sectoresAnexo": [],
            "tipo": "general2"
        };
        $scope.general3 = {
            "Sector":SAO.Tabla2[0].aplicacion,
            "Subsector":SAO.Tabla2[0].alternativas[1],
            "Alternativa":SAO.Tabla2[0].uso2[1],
            "tipo":"general3"
        };


        //ESPUMA Tabla 3,4,5

        $scope.espuma1 = {
            "Sustancia": SAO.SustanciasTabla3[0].nombre,
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
            "Alternativas":SAO.Tabla11A[0].alternativas[0],
            "otrosAlternativa":"",
            "unidades":"",
            "Uso":[],//{ano:"---",tons:""},
            "tipo":"aire3"
        };

        //AEROSOLES

        $scope.aerosoles = {
            "Aplicación":SAO.Tabla12[0].aplicacion,
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
            "Alternativa":SAO.Tabla3Anexo2[0].aplicacion,
            "Alternativas":SAO.Tabla3Anexo2[0].alternativas[0],
            "otrosAlternativa":"",
            "Uso":[],//{ano:"---",tons:""},
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
            "otrosAlternativa":"",
            "unidades":"",
            "explotacion":"",
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

        ////LOCAL MEMBERS
        function init() {
            Manager.local().then(function(res) {
                $scope.documents = res.rows.map(function(el) {
                    return el.doc;
                });

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
                    element.sectores = element.sectores.concat($scope.Sectores.filter(function(el) {
                        return el.value == true;
                    }));
                    break;
                case 'general2':
                    element.sectoresAnexo = element.sectoresAnexo.concat($scope.SectoresAnexo.filter(function(el) {
                        return el.value == true;
                    }));
                    break;
                default:

                    break;
            }

            AddElement(element);
        };


        $scope.OpenModal = function(record, size) {
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
                    }
                }
            });

            instance.result.then(function(data) {
                $scope.Refresh();
            }, function(reason) {
                console.warn(JSON.stringify(reason));
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
            Manager.flush();
        };

        $scope.SelectModal = function (tipo) {
            $scope.table.name = tipo;
            $scope.ShowRecord();
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

        $scope.LogOut = function () {
             $cookies.remove('user');
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

        init();


    })
    .controller("reportController", function($scope, SAO, Manager, $uibModal,SType,Columns,$location,$timeout) {
        //Este controlador es para los reportes.

        $scope.tables = [];
        $scope.columns = Columns;
        $scope.labels = Object.keys(SType);



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
                    pdfMake.createPdf(docDefinition).download(current+".pdf");
                }
            });
        };

        function FetchTable(table)
        {
            var tableNames= SType[table];
            tableNames.forEach(function (name)
            {
                Manager.record(name).then(function (data) {
                    var dataColums=$scope.columns.filter(function (el) {
                        return el.tipo==name;
                    })[0];

             if(dataColums!=undefined)
             {
                 $timeout(
                     function () {

                         var table = Format({
                             "columns":dataColums.fields,
                             "records":data.rows.map(function(el) {
                                 return el.doc;
                             }),
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

        function Format(table) {

            var tableData = table;
            //format Uso
           try{
                    if(tableData.records.length>0)
                    {
                        if(tableData.columns.indexOf("Uso")!=-1)
                        {
                            var keys = tableData.records[0].Uso.filter(function (u) {
                                return u.anno;
                            }).map(function (j) {
                                return j.anno;
                            });

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

        function init()
        {
            var hash = $location.path();

            var current = $scope.labels.filter(function (la)
            {
                return hash.indexOf(la)!=-1;
            })[0];

            if(current!=undefined)
            {
                FetchTable(current);
            }
        }

        init();
    })
    .controller("chartController", function ($scope, SAO, Manager, $uibModal,$cookies,$location,$timeout) {
        //Controlador para los charts

        var charting = '';
        $scope.user = undefined;
        $scope.records= [];
        $scope.bar = {
            "labels":[],
            "series":[],
            "data": [],
            "show":false
        };

        $scope.pie = {
            "labels":['2010', '2015', '2020', '2025','2030'],
            "data": [],
            "options":{},
            "show":false

        };

        $scope.SelectChart= function (chart) {
            charting = chart;
            FetchRecords(chart);
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
            switch (charting)
            {
                case 'espuma1':

                    var names = [];
                    var table  = {
                        names:[],
                        data:[]
                    };
                        table.names = SAO.SustanciasTabla3.map(function (el) {
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

                    $scope.bar =
                    {
                        "labels":['2010', '2015', '2020', '2025','2030'],
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

                    var tableData = [0,0,0,0,0];
                    table.data.forEach(function (el) {
                        tableData[0]+=el[0];
                        tableData[1]+=el[1];
                        tableData[2]+=el[2];
                        tableData[3]+=el[3];
                        tableData[4]+=el[4];
                    });


                    $scope.pie = {
                        "labels":['2010', '2015', '2020', '2025','2030'],
                        "data": tableData,
                        "options":{
                            legend: {
                                display: true,
                                position: 'top'
                            },
                            title: {
                                display: true,
                                text: 'Espuma 1'
                            }
                        },
                        "show":true

                    }

                    ;
                    break;


                case 'aire2':

                    var names = [];
                    var table  = {
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

                    $scope.bar = {
                        "labels":['2010', '2015', '2020', '2025','2030'],
                        "series":table.names,
                        "data": table.data,
                        "show":true,
                        options: {

                        }
                    };

                    var tableData = [0,0,0,0,0];
                    table.data.forEach(function (el) {
                        tableData[0]+=el[0];
                        tableData[1]+=el[1];
                        tableData[2]+=el[2];
                        tableData[3]+=el[3];
                        tableData[4]+=el[4];
                    });


                    $scope.pie = {
                        "labels":['2011', '2012', '2013', '2014','2015'],
                        "data": tableData,
                        "options":{},
                        "show":true

                    }

                    ;
                    break;
                default:
                    break;
            }
        }

        function init() {
            var user = $cookies.get('user');
            if(user==undefined)
            {

                $timeout(function () {
                    $location.path('/login');
                },300);
            }
            else{
                $scope.user  = user;
            }
        }

        init();




    })
    .controller("modalController", function($scope, SAO, Manager, $uibModalInstance, record, general, Util, documents) {

        //Este controlador es el encargado de adicionar y editar los elementos.|| Este controlador es para los modals
        $scope.record = record;
        $scope.SAO = SAO;
        $scope.general = general;
        $scope.documents = documents;
        // $scope.alternativa = 'AlternativaHFC';

        //Configuracion para el modal de general2
        $scope.alternativa = "AlternativaHFC";
        var selected = $scope.alternativa;
        //Configuracion para el modal tabla 8 consumo
        $scope.consumoR = SAO.Aplicaciones8[0];
        $scope.Tabla2R = SAO.Tabla2[0];
        $scope.Tabla5R = SAO.Tabla5[0];
        $scope.Tabla9R = SAO.Tabla9[0];
        $scope.SustanciasTabla6 = SAO.SustanciasTabla6[0];
        var selectedConsumo = $scope.consumoR;
        var selectedTabla2 = $scope.Tabla2R;
        var selectedTabla5 = $scope.Tabla5R;
        var selectedTabla9 = $scope.Tabla9R;
        var selectedTabla6 = $scope.SustanciasTabla6;
        $scope.year  = 2011;
        $scope.amount  = 0;

        init();



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
            //todo validar datos
            element = Util.collect($scope.general, element);

            switch (element.tipo) {
                case 'general1':
                    element.sectores = element.sectores.concat($scope.SAO.Sectores.filter(function(el) {
                        return el.value == true;
                    }));
                    break;
                case 'general2':
                    element.sectoresAnexo = element.sectoresAnexo.concat($scope.SAO.SectoresAnexo.filter(function(el) {
                        return el.value == true;
                    }));
                    break;
                default:

                    break;
            }

            AddElement(element);
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

        $scope.Save = function() {
            //TODO: reverse update in actions list
            if ($scope.record._id == undefined) {
                Add($scope.record);
            } else {
                UpdateElement($scope.record);
            }

            Finish();
        };

        $scope.Delete = function(element) {
            DeleteElement(element).
            finally(function(data) {
                Finish();
            });

        }
        ;

        function init() {
            switch ($scope.record.tipo) {
                case 'general3':
                     $scope.record.Sector = selectedTabla2.aplicacion;
                     $scope.record.Subsector = selectedTabla2.alternativas[0];
                     $scope.record.Alternativa = selectedTabla2.uso2[0];
                    break;
                case 'general1':
                    // $scope.record.sectores = SAO.Sectores[1];
                    $scope.record.sustancia = SAO.Sustancias[1];

                    break;
                case 'espuma1':
                    // $scope.record.sectores = SAO.Sectores[1];
                    $scope.record.Sustancia = SAO.SustanciasTabla3[0];
                    $scope.year = 2010;

                    break;
                case 'espuma2':
                    // $scope.record.sectores = SAO.Sectores[1];
                    // $scope.record.Sustancia = SAO.SubsectorTabla4[0];
                    $scope.record.Subsector = SAO.SubsectorTabla4[0];
                    $scope.year = 2010;

                    break;
                case 'espuma3':
                    // $scope.record.sectores = SAO.Sectores[1];
                    // $scope.record.Sustancia = SAO.SubsectorTabla4[0];
                    $scope.record.Alternativa = SAO.Tabla5[0].alternativas[0];
                    $scope.year = 2011;

                    break;
                case 'importaciones1':
                    $scope.record.Sustancia = SAO.SustanciasTabla6[0];
                    $scope.year = 2010;

                    break;
                case 'aire2':
                    $scope.record.Alternativas = selectedTabla9.alternativas[0];
                    $scope.year = 2011;

                    break;


                default:

                    break;
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
        $scope.ConsumoYear = function(year,amount){

                record.Uso.push({"anno":year,"tons":amount,"nombre":"año: "+year+"- tons: "+amount});
                record.Uso =  _.uniq(record.Uso,false,function (el) {
                    return el.nombre;
                });

                record.Uso = _.sortBy( record.Uso,function (us) {
                    return us.anno;
                });

        };

        $scope.ShowConsumo = function(){
           selectedConsumo = $scope.consumoR;
           $scope.record.carga = selectedConsumo.carga;
           $scope.record.aplicacion = selectedConsumo.aplicacion;
        };
        //Modal tabla2

        $scope.ShowTabla2 = function(){
            selectedTabla2 = $scope.Tabla2R;
            $scope.record.Sector = selectedTabla2.aplicacion;
            $scope.record.Subsector = selectedTabla2.alternativas[0];
            $scope.record.Alternativa = selectedTabla2.uso2[0];
            // $scope.record.uso2 = selectedTabla2.uso2;
        };

        // Modal Tabla5

        $scope.ShowTabla5 = function(){
            selectedTabla5 = $scope.Tabla5R;
            $scope.record.Subsector = selectedTabla5.aplicacion;
            $scope.record.Alternativa = selectedTabla5.alternativas[0];
        };

        //Modal Tabla 9

        $scope.ShowTabla9 = function(){
            selectedTabla9 = $scope.Tabla9R;
            $scope.record.Carga = selectedTabla9.carga;
            $scope.record.Aplicaciones = selectedTabla9.aplicacion;
            $scope.record.Alternativas = selectedTabla9.alternativas[0];
        };

        //Modal Tabla12

        $scope.ShowTabla12 = function(){
            selectedTabla12 = $scope.Tabla12R;
            $scope.record.aplicacion = selectedTabla12.aplicacion;
        };

        // tabla3 anexo2

        $scope.ShowTabla3Anexo2 = function(){
            selectedTabla3Anexo2 = $scope.Tabla3Anexo2R;
            $scope.record.aplicacion = selectedTabla3Anexo2.aplicacion;
        };

        // Tabla11A

        $scope.ShowTabla11A = function(){
            selectedTabla11A = $scope.Tabla11AR;
            $scope.record.Capacidad = selectedTabla11A.carga;
            $scope.record.aplicacion = selectedTabla11A.aplicacion;
        };
        $scope.ShowTabla11B = function(){
            selectedTabla11B = $scope.Tabla11BR;
            $scope.record.Capacidad = selectedTabla11B.carga;
            $scope.record.aplicacion = selectedTabla11B.aplicacion;
        };

        $scope.ShowTabla10A = function(){
            selectedTabla10A = $scope.Tabla10AR;
            $scope.record.Carga = selectedTabla10A.carga;
            $scope.record.aplicacion = selectedTabla10A.aplicacion;
        };
        $scope.ShowTabla10B = function(){
            selectedTabla10B = $scope.Tabla10BR;
            $scope.record.aplicacion = selectedTabla10B.aplicacion;
        };
        $scope.ShowTabla13 = function(){
            selectedTabla13 = $scope.Tabla13R;
            $scope.record.aplicacion = selectedTabla13.aplicacion;
        }

    })
    .controller('loginController',function ($scope, Manager,$cookies,$location){
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
            if(user.username=='sao'){
                $cookies.put('user',user);
                $location.path('/home');
            }
            else{
                Manager.record('usuario').
                then(function (data)
                {
                    $scope.users = data.rows.map(function(el) {
                        return el.doc;
                    });
                    var result =  _.findWhere($scope.users,user);
                    if(result!=undefined)
                    {
                        $cookies.put('user',result);
                        $location.path('/home');
                    }
                    else
                    {
                        $scope.signinError.content = reason;
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
            }

            ;
        }

    })
    .controller('userController',function ($scope, Manager, $uibModal,$location,$cookies,$timeout) {
        $scope.users = [];
        $scope.user = undefined;
        $scope.User = function (user,size) {
            var instance = $uibModal.open({
                animation: true,
                templateUrl: "template/modal/user-modal.html",
                controller: function ($scope,Manager,user,$uibModalInstance) {
                    $scope.user = user;
                    $scope.Save= function (user) {
                        user.tipo = "usuario";
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
            DeleteElement(el);
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
           $scope.user = $cookies.get('user');

            $timeout(function () {
                if($scope.user==undefined)
                {
                    $location.path('/login');
                }
            },500);

        }

        init();
    })

;
angular.module('app.sao')
    .controller("generalController", function($scope, Manager, SAO, Util, $uibModal,Menu,$sce,SubMenu) {

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
        $scope.columns =
            [
                // "general":["provincia","ministerio","osde","empresa"],

                {"fields":["Sustancia", "sectores"],"nombre":"Uso general alternativas a las SAO en la actualidad","tipo":"general1"},
                {"fields":["alternativaHFC", "alternativaHFCMezclas", "alternativaHFO", "alternativaOtras", "ra"],"nombre":"i love my princes, i love her forever, God bless my princess", "tipo":"general2"},
                {"fields":["Sustancia", "Uso"],"nombre":"Demanda de Sao y Agentes soplantes en el sector de espuma","tipo":"espuma1"},
                {"fields":["Subsector", "Uso"],"nombre":"Distribución de ODS y Alternativas en Sub sector de Espumas","tipo":"espuma2"},
                {"fields":["Sustancia", "Uso"],"nombre":"Demanda de SAO y Refrigerantes Alternativos de SAO","tipo":"importaciones1"},
                {"fields":["Subsector/aplicación","Alternativa", "Uso" ],"nombre":"Recolección de datos sobre el uso de alternativas de SAO en el sector de espumas de poliuretano y polietileno extruido", "tipo":"espuma3"},
                {"fields":["Alternativa","Alternativas", "Uso" ],"nombre":"Cantidad de importaciones de alternativas de ODS", "tipo":"importaciones2"},
                {"fields":["Aplicación","Alternativas", "Uso" ],"nombre":"Recolección de datos sobre el uso de alternativas de SAO en el sector de aerosoles ", "tipo":"aerosoles"},
                {"fields":["Aplicaciones","Alternativas", "Uso" ],"nombre":"Recolección de datos en el uso de alternativas de SAO en Refrigeracion Movil ", "tipo":"empresa2"},
                {"fields":["Aplicaciones","Alternativas", "Uso" ],"nombre":"La recolección de datos sobre el uso de alternativas de SAO en el sector de solventes", "tipo":"empresa3"},
                {"fields":["Subsector", "Uso"],"nombre":"Distribución de SAO y alternativas de SAO en el sector de la Refrigeración y el Aire Acondicionado","tipo":"aire1"},
                {"fields":["Aplicaciones", "Carga", "Alternativas", "Uso" ],"nombre":"Recolección de datos sobre el uso de alternativas de SAO en la fabricación de aires acondicionados", "tipo":"aire2"},
                {"fields":["Aplicaciones", "Carga", "Alternativas", "Uso" ],"nombre":"Consumo  de SAO (Refrigerantes) Y Sus Alternativas en el subsector de manufactura", "tipo":"consumo"},
                {"fields":["Aplicaciones", "Carga", "Alternativas", "Uso" ],"nombre":"Recolección de datos en el uso de alternativas de SAO en Aire Acondicionado Automotriz", "tipo":"empresa1"},
                {"fields":["Aplicaciones", "Capacidad", "Alternativas", "Uso" ],"nombre":"La recolección de datos sobre el uso de alternativas de SAO en el servicio de equipos de refrigeración", "tipo":"refri"},
                {"fields":["Aplicaciones", "Capacidad", "Alternativas", "Uso" ],"nombre":"La recolección de datos sobre el uso de alternativas de SAO en el servicio de equipos de aire acondicionado", "tipo":"aire3"}
            ];

        $scope.records = Object.keys($scope.columns);
        //Informacion general
        $scope.Provincias = SAO.Provincias;
        $scope.OSDE = SAO.OSDE;
        $scope.Ministerio = SAO.Ministerio;

        //Tipo de objetos
        $scope.general = {
            "provincia": SAO.Provincias[0],
            "ministerio": SAO.Ministerio[0],
            "osde": SAO.OSDE[0],
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
            "Sustancia": SAO.Sustancias[0].nombre[0],
            "sectores": [],
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
            "Subsector/aplicación":SAO.Tabla5[0].aplicacion,
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

                if ($scope.table.records.length > 0) {
                    var data=$scope.columns.filter(function (el) {
                        return el.tipo==$scope.table.name;
                    })[0];

                    $scope.table.columns = data.fields;
                    $scope.table.title = data.nombre;

                } else {
                    $scope.table.columns = [];
                }




            } catch (err) {
                //todo poner un modal aqui
                console.warn(err);
            }

        };

        $scope.Refresh = function() {
            FetchRecords($scope.table.name);
        };

        init();


    })
    .controller("reportController", function($scope, SAO, Manager, $uibModal) {
        //Este controlador es para los reportes.
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
        var selectedConsumo = $scope.consumoR;
        $scope.year  = 2010;
        $scope.amount  = 0;


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

        //Esto es del modal de general2

        $scope.ShowAlt=function () {
            selected = $scope.alternativa.trim();
        };

        $scope.ToCompare = function (alternativa) {

            return alternativa == selected;
        };


        //Modal de consumo
        $scope.ConsumoYear = function(year,amount){
            if (record.Uso.length<4) {
                record.Uso.push({"anno":year,"tons":amount,"nombre":"año: "+year+"- tons: "+amount});
            }
            else{
                console.warn('top years completed');
            }
        };

        $scope.ShowConsumo = function(){
           selectedConsumo = $scope.consumoR;
           $scope.record.Carga = selectedConsumo.carga;
           $scope.record.aplicacion = selectedConsumo.aplicacion;
        }

        // Modal Tabla5

        $scope.ShowTabla5 = function(){
            selectedTabla5 = $scope.Tabla5R;
            $scope.record.aplicacion = selectedTabla5.aplicacion;
        }

        //Modal Tabla 9

        $scope.ShowTabla9 = function(){
            selectedTabla9 = $scope.Tabla9R;
            $scope.record.Carga = selectedTabla9.carga;
            $scope.record.aplicacion = selectedTabla9.aplicacion;
        }

        //Modal Tabla12

        $scope.ShowTabla12 = function(){
            selectedTabla12 = $scope.Tabla12R;
            $scope.record.aplicacion = selectedTabla12.aplicacion;
        }

        // tabla3 anexo2

        $scope.ShowTabla3Anexo2 = function(){
            selectedTabla3Anexo2 = $scope.Tabla3Anexo2R;
            $scope.record.aplicacion = selectedTabla3Anexo2.aplicacion;
        }

        // Tabla11A

        $scope.ShowTabla11A = function(){
            selectedTabla11A = $scope.Tabla11AR;
            $scope.record.Capacidad = selectedTabla11A.carga;
            $scope.record.aplicacion = selectedTabla11A.aplicacion;
        }
        $scope.ShowTabla11B = function(){
            selectedTabla11B = $scope.Tabla11BR;
            $scope.record.Capacidad = selectedTabla11B.carga;
            $scope.record.aplicacion = selectedTabla11B.aplicacion;
        }

        $scope.ShowTabla10A = function(){
            selectedTabla10A = $scope.Tabla10AR;
            $scope.record.Carga = selectedTabla10A.carga;
            $scope.record.aplicacion = selectedTabla10A.aplicacion;
        }
        $scope.ShowTabla10B = function(){
            selectedTabla10B = $scope.Tabla10BR;
            $scope.record.aplicacion = selectedTabla10B.aplicacion;
        }
        $scope.ShowTabla13 = function(){
            selectedTabla13 = $scope.Tabla13R;
            $scope.record.aplicacion = selectedTabla13.aplicacion;
        }
    })

;
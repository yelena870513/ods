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

                {"fields":["sustancia", "sectores"],"nombre":"lorem ipsum sir marim ururu ururu","tipo":"general1"}
                ,
                {"fields":["alternativaHFC", "alternativaHFCMezclas", "alternativaHFO", "alternativaOtras", "ra"],"nombre":"i love my princes, i love her forever, God bless my princess", "tipo":"general2"},
                {"fields":["aplicacion", "carga", "alternativa", "uso" ],"nombre":"Consumo  de SAO (Refrigerantes) Y Sus Alternativas en el subsector de manufactura.", "tipo":"consumo"}
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


        $scope.consumo = {
            "aplicacion":SAO.Aplicaciones8[0].aplicacion,
            "carga":SAO.Aplicaciones8[0].carga,
            "alternativa":SAO.Aplicaciones8[0].alternativas[0],
            "otrosAlternativa":"",
            "uso":[],//{ano:"---",tons:""},
            "tipo":"consumo"
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
        $scope.year  = 2011;
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
            if (record.uso.length<4) {
                record.uso.push({"anno":year,"tons":amount,"nombre":"año: "+year+"- tons: "+amount});
            }
            else{
                console.warn('top years completed');
            }
        };

        $scope.ShowConsumo = function(){
           selectedConsumo = $scope.consumoR;
           $scope.record.carga = selectedConsumo.carga;
           $scope.record.aplicacion = selectedConsumo.aplicacion;
        }

    })

;
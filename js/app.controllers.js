angular.module('app.sao')
    .controller("generalController", function($scope, Manager, SAO, Util, $uibModal,Menu,$sce,SubMenu,$localStorage, Columns,$timeout,$location,SType) {

        $scope.treeTemplate = $sce.trustAsHtml("template/directive/tree.html");
        $scope.alerts=
        {
            show:false,
            message:''
        };

        $scope.alert =
        {
            show:false,
            message:'',
            type:'success'
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
            "municipio": {},
            "osde":"",

            "ueb":"",
            "oace":"",

            "direccion":"",
            "telefono": 0,
            "correo":"",
            "representante":"",
            "director":"",
            "tipo": "general"
        };

        $scope.datos = {
            "provincia": {},
            "ministerio": {},
            "municipio": {},
            "osde":"",
            "ueb":"",
            "oace":"",
            "direccion":"",
            "telefono": 0,
            "correo":"",
            "representante":"",
            "director":"",
            "tipo": "datos"
        };

        Manager.record('provincia').then(function(data)
        {
            $scope.general.provincia = data.rows.map(function(m){return m.doc;})[0];
            $scope.datos.provincia = _(data.rows.map(function(m){return m.doc;})).sortBy(function (st) {
                return st.nombre;
            })[0];
            Manager.record('municipio').then(function(muns){
                $scope.datos.municipio = _(muns.rows.map(function(m){return m.doc;})).find(function (mu) {
                    return mu.provincia==$scope.datos.provincia.id;
                })
            });

        });
        Manager.record('ministerio').then(function(data){
            $scope.general.ministerio = data.rows.map(function(m){return m.doc;})[0];
            $scope.datos.ministerio = data.rows.map(function(m){return m.doc;})[0];
        });

        Manager.record('general').then(function(data){
            if (data.rows.length>0) {
                $scope.general = data.rows.map(function(m){return m.doc;})[0];

            }
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
            "equipoAire":{},
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
            // "Sustancia": SAO.SustanciasTabla6[0].nombre,
            "Sustancia": [],
            "Sustancia1": [],
            "Uso":[],//{ano:"---",tons:""},
            "Pronostico":[],//{ano:"---",tons:""},
            "tipo": "importaciones1"
        };

        $scope.importaciones2 = {

            // "Alternativa":SAO.Tabla23[0].aplicacion,
            // "Tipo":SAO.Tabla23[0].alternativas[0],
            // "otrosAlternativa":"",
            // "Uso":[],
            "aplicacionAire": [],
             "aplicacionRefri": [],
             "personal": [SAO.Personal[0]],
             "Estado": SAO.Estado[0],
             "capacidad":"",
             "curso":0,
             "cantidadbp":"",
             "inventario":"",
             "servicio":"No",
             "empresa":"",
             "experiencia":"",
            "tipo":"importaciones2"
        };

        //REFRIGERACION

        $scope.consumo = {
            "Aplicaciones":SAO.Aplicaciones8[0].aplicacion,
            "Carga":SAO.Aplicaciones8[0].carga,
            "Alternativas":SAO.Aplicaciones8[0].alternativas[0],
            "otrosAlternativa":"",
            "equipoRefrigeracion":{},
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
            "limpieza":"",
            "Uso":[],//{ano:"---",tons:""},
            "tipo":"empresa3"
        };
        $scope.empresa4 = {
            "Organizacion":SAO.OrgProduccion[0],
            "SustaciaAire":SAO.SustanciasAire[0],
            "SustanciaRefrigerante":SAO.SustanciasRefrigerante[0],
            "TipoRefrigeracion":SAO.TipoRefri[0],
            "TipoAire":SAO.TipoAire[0],
            //"CantRefriAire":[],
            //"CantRefriRefri":[],
            "Total":[],
            "nombreTaller":"",
            "municipio":"",
            "sustanciasR":0,
            "sustanciasRL":"",
            "year":0,
             "explotacion":"",
            // "tecnicos":"",
            "experiencias":"",
            "Recuperacion":[],
            "Recuperado":[],
             "aplicacionAire": [],
              "aplicacionRefri": [],
                "Limpieza": [],
                "refrigConsumidos": [],
            "tipo":"empresa4"
        };
        $scope.equipo = {
           
             
             
            "tipo":"equipo"
        };
        // Manager.record('municipio').then(function(data){
        //     municipios = data.rows.map(function(m){return m.doc;});
        //     $scope.empresa4.municipio=municipios[0];
        // });


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
           return Manager.record(name).then(function(data) {
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

        function checkAll()
        {
            $scope.table.records = $scope.table.records.map(function (nm) {
                nm.selected = true;
                return nm;
            });
        };

        function uncheckAll()
        {
            $scope.table.records = $scope.table.records.map(function (nm) {
                nm.selected = false;
                return nm;
            });
        };

        $scope.Mark = function(){
            if ($scope.selected)
            {
                checkAll();
            }
            else{
                uncheckAll();
            }
        };

        $scope.DeleteSelected = function(){
            var find = _($scope.table.records).find(function(nm){
                return nm.selected==true;
            });
            if (find==undefined)
            {
                $scope.alert.show = true;
                $scope.alert.message = "Seleccione al menos un elemento";
                $scope.alert.type = 'danger';
            }
            else
            {
                var tipo = find.tipo;
                var reject = _($scope.table.records).filter(function(nm){return nm.selected==true;});
                Manager.delete(reject.map(function(re){re._deleted=true;return re;})).then(function (e)
                {
                    $scope.alert.show = true;
                    $scope.alert.message = 'Registros eliminados correctamente';
                    $scope.alert.type = 'success';
                    $timeout(function () {
                        $scope.alert.show = false;
                        $scope.selected = false;
                        FetchRecords($scope.table.name);

                    },500);
                }).
                catch(function (reason) {
                    $scope.alert.show = true;
                    $scope.alert.message = reason.message;
                    $scope.alert.type = 'danger';
                    $timeout(function () {
                        $scope.alert.show = false;
                    },3000);
                });

            }
        };
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

        $scope.ClearBase= function ()
        {
            Manager.clear().then(function () {
                alert('Base de datos limpiada');
                window.location.reload();
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


        $scope.Save = function()
        {
            Manager.saveAll().then(function (data) {
                $scope.alerts.show = true;
                $scope.alerts.message = 'Datos salvados correctamente.';
                $timeout(function () {
                    $scope.alerts.show = false;
                },3000);

            }).catch(function (reason) {
                $scope.error.show = true;
                $scope.error.message = 'Error salvando los datos.';
                $scope.error.message = reason.message;
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
            //$scope.ShowRecord();
            FetchRecords(tipo).then(function(){
                var data=$scope.columns.filter(function (el) {
                    return el.tipo==tipo;
                })[0];

                if(data!=undefined)
                {
                    $scope.table.columns = data.fields;
                    $scope.table.title = data.nombre;
                }

            });
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
        var years = [2010,2011,2012,2013,2014,2015,2016];
        var pro = [2020,2025,2030];
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

            if (current==undefined) {
                current="sao";
            }

            $scope.isPrinting = true;
            currentWebContents.printToPDF({
                marginsType: 0,
                printBackground: false,
                printSelectionOnly: false,
                pageSize:'A3',
                landscape: true
            }, function(error,data)
            {
                if (error) throw error;
                fs.writeFile(os.tmpdir()+'/.sao/data/'+ current+'.pdf', data, function(error)
                {
                    if (error) throw error;
                    console.log('Write PDF successfully.');
                    $scope.isPrinting = false;
                    $timeout(function(){

                        var buffer = fs.readFileSync(os.tmpdir()+'/.sao/data/'+ current+'.pdf');
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
                    rows = ReduceItems(data,"Sustancia",table);
                    break;
                case 'espuma2':
                case 'espuma3':

                    rows = ReduceItems(data,"Subsector",table);
                    break;
                case 'aire2':
                //case 'aire3':
                //case 'refri':
                case 'consumo':
                case 'aerosoles':
                case 'empresa1':
                case 'empresa2':
                case 'empresa3':
                    rows = ReduceItems(data,"Aplicaciones",table);
                    break;
                // case 'empresa4':
                //     rows = data.filter(function (em) {
                //         return em.sustanciasR >0;
                //     });
                //     break;
                default:
                    rows = data;
                    break;
            }

            return rows;
        }

        function ReduceItems(source, property,table) {
            var rows = [];
            var t = _($scope.columns).find(function (cv) {
                return cv.tipo==table;
            });
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
                        "Uso":[],
                        "Pronostico":[]
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

                    _.each(where,function (o)
                    {
                        if (row.Pronostico!=undefined)
                        {
                            if (row.Pronostico.length==0)
                            {
                                row.Pronostico = o.Pronostico;
                            }
                            else
                            {
                                _.each(o.Pronostico,function (u,index)
                                {
                                    row.Pronostico[index].tons+=u.tons;
                                });
                            }
                        }
                    });

                    //Inclusive properties
                    var props = Object.keys(source[d]);
                    if (t!=undefined) {
                        props = t.fields;
                    }
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

                            keys = years;

                            var rows = tableData.records.map(function (m) {
                                keys.forEach(function (k)
                                {
                                    m[k] = m.Uso.filter(function (a) {
                                        return a.anno==k;
                                    });

                                    if (m[k]!=undefined && m[k].length>0)
                                    {
                                        m[k]=m[k][0].tons;
                                    }
                                    else
                                    {
                                        m[k]=0;
                                    }
                                });
                                delete m.Uso;
                                return m;
                            });

                            tableData.columns = tableData.columns.filter(function (u) {
                                return u!="Uso";
                            }).concat(keys);

                            tableData.rows = rows;
                        }

                        if(tableData.columns.indexOf("Pronostico")!=-1)
                        {
                            var keys = _.unique(tableData.records[0].Pronostico.filter(function (u) {
                                return u.anno;
                            }).map(function (j) {
                                return j.anno;
                            }));

                            keys = pro;

                            var rows = tableData.records.map(function (m) {
                                keys.forEach(function (k)
                                {
                                    m[k] = m.Pronostico.filter(function (a) {
                                        return a.anno==k;
                                    });

                                    if (m[k]!=undefined && m[k].length>0)
                                    {
                                        m[k]=m[k][0].tons;
                                    }
                                    else
                                    {
                                        m[k]=0;
                                    }
                                });
                                delete m.Pronostico;
                                return m;
                            });

                            tableData.columns = tableData.columns.filter(function (u) {
                                return u!="Pronostico";
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

                            matches[i].Uso = [];

                            years.forEach(function(yt,idz){
                                matches[i].Uso.push({
                                    anno:yt,
                                    tons:0
                                });
                                if (matches[i].year==yt)
                                {
                                    matches[i].Uso[idz].tons=matches[i].explotacion;
                                }
                            });



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

                            matches[i].Uso = [];
                            var mkeys = Object.keys(matches[i]);
                            var inty = mkeys.filter(function(n) {
                                return years.indexOf(n) !== -1;
                            })[0];
                            years.forEach(function(yt,idz){
                                matches[i].Uso.push({
                                    anno:yt,
                                    tons:0
                                });
                                if (yt==inty)
                                {
                                    matches[i].Uso[idz].tons=matches[yt];
                                }
                            });
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
        var titles = {
            "importaciones2":"Equipos de Clima y Refrigeraci\u00F3n.",
            "empresa4":"Empresa de Servicios de Clima y Refrigeraci\u00F3n.",
            "empresa3":"Consumo de  Solventes.",
            "importaciones1":"Demanda de SAO y refrigerantes alternativos de SAO.",
            "aire2":"Fabricante de Aires Acondicionados.",
            "consumo":"Fabricante de Refrigeraci\u00F3n.",
            "aerosoles":"Fabricante de Aerosoles."

        };

        $scope.chartTitle = "";
        $scope.isPrinting = false;
        $scope.records= [];
        $scope.refrigConsumidos = [];
        $scope.Sustancia = [];
        $scope.equipoAire = [];
        $scope.equipoRefrigeracion = [];
        Manager.record('refrigConsumidos').then(function(data){
            $scope.refrigConsumidos = data.rows.map(function(m){return m.doc;});
            $scope.refrigConsumidos = _($scope.refrigConsumidos).sortBy(function (el) {
                return el.nombre;
            });
        });

        Manager.record('Sustancia').then(function(data){
            $scope.Sustancia = data.rows.map(function(m){return m.doc;});
            $scope.Sustancia = _($scope.Sustancia).sortBy(function (el) {
                return el.nombre;
            });
        });


        Manager.record('equipoAire').then(function(data){
            $scope.equipoAire = data.rows.map(function(m){return m.doc;});
            $scope.equipoAire = _($scope.equipoAire).sortBy(function (el) {
                return el.nombre;
            });
        });
        Manager.record('equipoRefrigeracion').then(function(data){
            $scope.equipoRefrigeracion = data.rows.map(function(m){return m.doc;});
            $scope.equipoRefrigeracion = _($scope.equipoRefrigeracion).sortBy(function (el) {
                return el.nombre;
            });
        });
        var years = [2010,2011,2012,2013,2014,2015,2016,2020,2030];
        $scope.selectedYear = 2010;
        $scope.bar = {
            "labels":[],
            "series":[],
            "data": [],
            "show":false
        };
       $scope.pies = [];

        $scope.SelectChart= function (chart) {
            $scope.pies=[];
            charting = chart;
            $scope.chartTitle = titles[charting];
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

                //todo lo demas
                if (charting=='importaciones2')
                {
                    EquipmentCharts();

                }
                else if(charting=='empresa4')
                {

                    $scope.bar.show = false;
                    EnterpriseChartsFrozen();
                    EnterpriseChartsRetrieve();

                }
                else
                    {
                    //se cargan las graficas
                    CargarDatos();
                    //Se cargan las graficas x año
                    $scope.years.forEach(function(y){
                        var graph = ShowPieCharts(y);
                        if (graph!=undefined)
                        {
                            $scope.pies.push(graph);
                        }

                        if (charting=="importaciones1") {
                            var gimp = Use(y);
                            if (gimp!=undefined) {
                                $scope.pies.push(gimp);
                            }
                        }

                    });
                }



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
                pageSize:'A3',
                landscape: true
            }, function(error,data)
            {
                if (error) throw error;
                fs.writeFile(os.tmpdir()+'/.sao/data/'+ charting+'.pdf', data, function(error)
                {
                    if (error) throw error;
                    console.log('Write PDF successfully.');
                    $scope.isPrinting = false;
                    $timeout(function(){

                        var buffer = fs.readFileSync(os.tmpdir()+'/.sao/data/'+ charting+'.pdf');
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
                                text: 'Demanda de SAO y agente espumante en el sector de espuma.'
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


                    $scope.bar = {
                        "labels":['2010', '2015'],
                        "series":table.names,
                        "data": table.data,
                        "show":true,
                        options: {
                            title:{
                                display:true,
                                text:"Distribución de ODS y alternativas en subsector de espuma."
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


                    $scope.bar = {
                        "labels":['2011', '2012','2013','2014','2015','2016'],
                        "series":table.names,
                        "data": table.data,
                        "show":true,
                        options: {
                            title:{
                                display:true,
                                text:"Recolección de datos sobre el uso de alternativas de SAO en el sector de espumas de poliuretano y polietileno extruido."
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
                    table.names = $scope.Sustancia.map(function (el) {
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
                    // $scope.years = [2011,2012,2013,2014,2015,2016];
                    $scope.years = [2011,2012,2013,2014,2015,2016,2020,2025,2030];

                    $scope.bar = {
                        "labels":['2011', '2012','2013','2014','2015','2016'],
                        "series":table.names,
                        "data": table.data,
                        "show":true,
                        options: {
                            title:{
                                display:true,
                                //text:"Importaciones"
                                text:"Demanda de SAO y refrigerantes alternativos de SAO."
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
                    table.names = $scope.equipoRefrigeracion.map(function (el) {
                        return el.nombre;
                    });

                    table.names.forEach(function (el) {
                        var rec = $scope.records.filter(function (r) {
                            return r.equipoRefrigeracion.nombre==el;
                        });
                        if (rec.length>0)
                        {
                            var row  = {
                                Uso:[],
                                label:el
                            };

                            for(var n=0;n<rec.length;n++)
                            {
                                if(rec[n]!=undefined)
                                {
                                    for (var k = 0;k< rec[n].Uso.length;k++)
                                    {
                                        if(row.Uso[k]==undefined)
                                        {
                                            row.Uso[k] = rec[n].Uso[k]
                                        }
                                        else
                                        {
                                            if(row.Uso[k].anno==rec[n].Uso[k].anno)
                                            {
                                                row.Uso[k].tons+=rec[n].Uso[k].tons;
                                            }
                                        }
                                    }
                                }
                            }

                            table.data.push(row.Uso.map(function (re) {
                                return re.tons;
                            }));
                            names.push(el);
                            table.names = names;
                        }


                    });
                    $scope.years = [2011,2012,2013,2014,2015,2016];
                    //$scope.years = [];

                    $scope.bar = {
                        "labels":['2011', '2012', '2013', '2014','2015','2016'],
                        "series":table.names,
                        "data": table.data,
                        "show":true,
                        options: {
                            legend: {
                                display: true,
                                position: 'top'
                            },
                            title:{
                                display:true,
                                //text:"Importaciones"
                                text:"Consumo de SAO y sus alternativas en la fabricación de Refigerante."
                            }

                        }
                    };


                    break;
                case 'aerosoles':
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

                            var uso  = rec.Uso.map(function (m) {
                                return m.tons;
                            });

                            table.data.push(uso);
                            names.push(el);
                            table.names = names;
                        }



                    });
                    $scope.years = [2011,2012,2013,2014,2015,2016];
                    //$scope.years = [];

                    $scope.bar = {
                        "labels":['2011', '2012', '2013', '2014','2015','2016'],
                        "series":table.names,
                        "data": table.data,
                        "show":true,
                        options: {
                            title:{
                                display:true,
                                //text:"Importaciones"
                                text:"Consumo de SAO y sus alternativas en la fabricación de aerosoles."
                            },
                            legend: {
                                display: true,
                                position: 'top'
                            }

                        }
                    };


                    break;
                case 'empresa3':
                    names = [];
                    table  = {
                        names:[],
                        data:[]
                    };
                    table.names = SAO.Tabla13.map(function (el)
                    {
                        return el.aplicacion.nombre;
                    });

                    table.names.forEach(function (el) {
                        var rec = $scope.records.filter(function (r) {
                            return r.Aplicaciones.nombre==el;
                        });
                        if (rec.length>0)
                        {
                            var row  = {
                                Uso:[],
                                label:el
                            };

                            for(var n=0;n<rec.length;n++)
                            {
                                if(rec[n]!=undefined)
                                {
                                    for (var k = 0;k< rec[n].Uso.length;k++)
                                    {
                                        if(row.Uso[k]==undefined)
                                        {
                                            row.Uso[k] = rec[n].Uso[k]
                                        }
                                        else
                                        {
                                            if(row.Uso[k].anno==rec[n].Uso[k].anno)
                                            {
                                                row.Uso[k].tons+=rec[n].Uso[k].tons;
                                            }
                                        }
                                    }
                                }
                            }

                            table.data.push(row.Uso.map(function (re) {
                                return re.tons;
                            }));
                            names.push(el);
                            table.names = names;
                        }


                    });
                    //$scope.years = [2011,2012,2013,2014,2015,2016];
                    $scope.years = [2016];

                    $scope.bar = {
                        "labels":['2016'],
                        "series":table.names,
                        "data": table.data,
                        "show":true,
                        options: {
                            title:{
                                display:true,
                                //text:"Importaciones"
                                text:"Recolección de datos sobre el uso de alternativas de SAO en el sector de solventes."
                            },
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
                        return el.Aplicaciones.nombre;
                    });

                    table.names.forEach(function (el) {
                        var rec = $scope.records.filter(function (r) {
                            return r.Aplicaciones.nombre;
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
                            title:{
                                display:true,
                                //text:"Importaciones"
                                text:"Recolección de datos en el uso de alternativas de SAO en Refrigeración Móvil."
                            },
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
                        return el.Aplicaciones.nombre;
                    });

                    table.names.forEach(function (el) {
                        var rec = $scope.records.filter(function (r) {
                            return r.Aplicaciones.nombre;
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
                            title:{
                                display:true,
                                //text:"Importaciones"
                                text:"Recolección de datos en el uso de alternativas de SAO en Aire Acondicionado Automotriz."
                            },
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
                    //table.names = $scope.records.map(function (el)
                    //{
                    //    return el.equipoAire.nombre;
                    //});

                    table.names = $scope.equipoAire.map(function (el) {
                        return el.nombre;
                    });

                    table.names.forEach(function (el) {
                        var rec = $scope.records.filter(function (r) {
                            return r.equipoAire.nombre;
                        });
                        if (rec.length>0)
                        {
                            var row  = {
                                Uso:[],
                                label:el
                            };

                            for(var n=0;n<rec.length;n++)
                            {
                                if(rec[n]!=undefined)
                                {
                                    for (var k = 0;k< rec[n].Uso.length;k++)
                                    {
                                        if(row.Uso[k]==undefined)
                                        {
                                            row.Uso[k] = rec[n].Uso[k]
                                        }
                                        else
                                        {
                                            if(row.Uso[k].anno==rec[n].Uso[k].anno)
                                            {
                                                row.Uso[k].tons+=rec[n].Uso[k].tons;
                                            }
                                        }
                                    }
                                }
                            }

                            table.data.push(row.Uso.map(function (re) {
                                return re.tons;
                            }));
                            names.push(el);
                            table.names = names;
                        }


                    });


                    //$scope.years = [];
                    $scope.years = [2011,2012,2013,2014,2015,2016];
                    $scope.bar = {
                        "labels":['2011', '2012', '2013', '2014','2015', '2016'],
                        "series":table.names,
                        "data": table.data,
                        "show":true,
                        options: {
                            title:{
                                display:true,
                                //text:"Importaciones"
                                text:"Consumo de SAO y sus alternativas en la fabricación de Aire Acondicionado."
                            },
                            legend: {
                                display: true,
                                position: 'top'
                            }

                        }
                    };


                    break;


                case 'aire3':
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

                            var tr = [0,0,0,0,0,0];
                            var index = years.indexOf(rec.year);
                            tr[index]=rec.explotacion;
                            table.data.push(tr);
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
                            title:{
                                display:true,
                                //text:"Importaciones"
                                text:"Recolección de datos sobre el uso de alternativas de SAO en el servicio de equipos de aire acondicionado."
                            },
                            legend: {
                                display: true,
                                position: 'top'
                            }

                        }
                    };
                    break;
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

                            var tr = [0,0,0,0,0,0];
                            var index = years.indexOf(rec.year);
                            tr[index]=rec.explotacion;
                            table.data.push(tr);
                            names.push(el);
                            table.names = names;
                        }



                    });
                    $scope.bar = {
                        "labels":['2011', '2012', '2013', '2014','2015','2016'],
                        "series":table.names,
                        "data": table.data,
                        "show":true,
                        options: {
                            title:{
                                display:true,
                                //text:"Importaciones"
                                text:"Recolección de datos sobre el uso de alternativas de SAO en el servicio de equipos de refrigeración."
                            },
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
                        "series":[],
                        "data": [],
                        "show":false,
                        options: {
                            legend: {
                                display: false,
                                position: 'top'
                            }

                        }};
                    break;
            }

            $scope.bar.show = false;
        }
        function ShowPieCharts(year,collection) {

          var chart = {};
           var pieLabels = $scope.records.map(function (l) {
               switch (l.tipo)
               {
                   case'aire3':
                   case'aire2':
                       return l.equipoAire.nombre;
                   case'consumo':
                       return l.equipoRefrigeracion.nombre;
                   case'refri':
                   case'empresa1':
                   case'empresa2':
                   case'empresa3':
                   case'aerosoles':
                       return l.Aplicaciones.nombre;

                   case'general2':
                   // case'importaciones2':
                       return l.Alternativa.nombre;
                   case'importaciones1':
                       return l.Sustancia1.nombre;
                   case'general1':
                   return l.sustancia.nombre;
                   case'general3':
                       return l.Sector.nombre;
                   case'espuma1':
                   /*case'importaciones1':
                       return l.Sustancia.nombre;*/
                   case'espuma2':
                   case'espuma3':
                   case'aire1':
                       return l.Subsector.nombre;

                   default:
                       break;
               }

           });

            pieLabels.filter(function (lbl) {
                return lbl!=undefined;
            });

            pieLabels = _(pieLabels).uniq();

            var pieTableData = [];

            if (charting=='aire3'|| charting=='refri')
            {
                pieTableData = $scope.records.map(function (lb)
                {
                    if (lb.year==year) {
                        return lb.explotacion;
                    }
                    return 0;
                });

                var temp=[];

                temp = _(pieTableData).reject(function(t){return t==0;});
                if (temp.length==0) {
                    pieTableData = temp;
                }


            }
            else if (charting=="importaciones1")
            {
                // pieTableData = $scope.records.map(function (lb) {
                //     var a = lb.Pronostico.filter(function (fu) {
                //         return fu.anno == year;
                //     })[0];
                //     if (a != undefined) {
                //         return a.tons;
                //     }
                //     return 0;
                // }).map(function (val) {
                //     if (val == undefined) {
                //         return 0;
                //     }
                //     return val;
                // });

                // pieTableData = $scope.records;
                // var pieTableData = $scope.records.filter(function (fc) {
                //     return fc.clasificacion.nombre==c&&fc.tipo=='refri';
                // });

                pieLabels.forEach(function (pl)
                {
                    var match = $scope.records.filter(function (ny) {
                        return ny.Sustancia1.nombre==pl;
                    });
                    var cat = 0;

                    for(var n=0;n<match.length;n++)
                    {
                        if(match[n]!=undefined)
                        {
                            for (var k = 0;k< match[n].Pronostico.length;k++)
                            {
                                if(cat==0 &&match[n].Pronostico[k].anno==year )
                                {
                                    cat = match[n].Pronostico[k].tons;
                                }
                                else
                                {
                                    if(match[n].Pronostico[k].anno==year)
                                    {
                                        cat+=match[n].Pronostico[k].tons;
                                    }
                                }
                            }
                        }
                    }

                    pieTableData.push(cat);


                });
                for(var i=0;i<pieTableData.length;i++)
                {
                    if(pieTableData[i]==0)
                    {
                        pieLabels[i]=undefined;
                    }
                }

                pieLabels = pieLabels.filter(function (pl) {
                    return pl!=undefined;
                });

                pieTableData = pieTableData.filter(function (pt) {
                    return pt>0;
                });
            }

            else {

                pieTableData = $scope.records.map(function (lb) {
                    var a = lb.Uso.filter(function (fu) {
                        return fu.anno == year;
                    })[0];
                    if (a != undefined) {
                        return a.tons;
                    }
                    return 0;
                }).map(function (val) {
                    if (val == undefined) {
                        return 0;
                    }
                    return val;
                });

                pieTableData = _(pieTableData).reject(function (t) {
                    return t == 0;
                });
            }

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

        function EquipmentCharts() {
            var chart = {};

            var pieLabels = _($scope.records.map(function (l) {
                return l.aplicacionAire.nombre;
            })).uniq();

            var pieTableData = [];

            pieLabels.forEach(function (label) {
               var count = _($scope.records).countBy(function (e) {
                   return e.aplicacionAire.nombre==label;
               });
                pieTableData.push(count.true);
            });

            if (pieTableData.length>0)
            {
                chart = BuildCharts(pieLabels,pieTableData,"Equipos de Clima y Refrigeraci\u00F3n.");
                $scope.pies.push(chart);
            }
        }

        function EnterpriseChartsFrozen()
        {
            var chart = {};
            var pieLabels = $scope.refrigConsumidos.map(function (rc)
            {
                return rc.nombre;
            });
            var pieTableData = [];
            var consumidos = [];

            $scope.records.map(function (r) {
                return r.refrigConsumidos;
            }).forEach(function (e) {
                consumidos = consumidos.concat(e);
            });



            pieLabels.forEach(function (label) {
                var count = _(consumidos).reduce(function (a,e) {
                    if (e.re6.nombre==label) {
                        return a+e.cant6;
                    }
                    return a + 0;
                },0);

                pieTableData.push(count);
            });

            for(var i=0;i<pieTableData.length;i++)
            {
                if(pieTableData[i]==0)
                {
                    pieLabels[i]=undefined;
                }
            }

            pieLabels = pieLabels.filter(function (pl) {
                return pl!=undefined;
            });

            pieTableData = pieTableData.filter(function (pt) {
                return pt>0;
            });

            if (pieTableData.length>0)
            {
                chart = BuildCharts(pieLabels,pieTableData,"Refrigerantes consumidos en el 2016.");
                $scope.pies.push(chart);
            }
        }

        function EnterpriseChartsRetrieve()
        {
            var chart = {};
            var pieLabels = ['R134a','R22','R404A','R410A','Otros'];

            var pieTableData = [];
            var consumidos = [];

            $scope.records.map(function (r) {
                return r.Recuperado;
            }).forEach(function (e) {
                consumidos = consumidos.concat(e);
            });

            pieLabels.forEach(function (label)
            {
                var count = _(consumidos).reduce(function (a,e) {
                    if (e.re3==label) {
                        return a+e.cant3;
                    }
                    return a + 0;
                },0);

                pieTableData.push(count);
            });

            for(var i=0;i<pieTableData.length;i++)
            {
                if(pieTableData[i]==0)
                {
                    pieLabels[i]=undefined;
                }
            }

            pieLabels = pieLabels.filter(function (pl) {
                return pl!=undefined;
            });

            pieTableData = pieTableData.filter(function (pt) {
                return pt>0;
            });


            if (pieTableData.length>0)
            {
                chart = BuildCharts(pieLabels,pieTableData,"Cantidad recuperada.");
                $scope.pies.push(chart);
            }

        }

        function Use(year)
        {

            var chart = {};
            var pieLabels = _($scope.records.map(function (im) {
                return im.Sustancia.nombre;
            })).uniq();

            var pieTableData = [];

            pieLabels.forEach(function (pl)
            {
                var match = $scope.records.filter(function (ny) {
                    return ny.Sustancia.nombre==pl;
                });
                var cat = 0;

                for(var n=0;n<match.length;n++)
                {
                    if(match[n]!=undefined)
                    {
                        for (var k = 0;k< match[n].Uso.length;k++)
                        {
                            if(cat==0 &&match[n].Uso[k].anno==year )
                            {
                                cat = match[n].Uso[k].tons;
                            }
                            else
                            {
                                if(match[n].Uso[k].anno==year)
                                {
                                    cat+=match[n].Uso[k].tons;
                                }
                            }
                        }
                    }
                }

                pieTableData.push(cat);


            });

            for(var i=0;i<pieTableData.length;i++)
            {
                if(pieTableData[i]==0)
                {
                    pieLabels[i]=undefined;
                }
            }

            pieLabels = pieLabels.filter(function (pl) {
                return pl!=undefined;
            });

            pieTableData = pieTableData.filter(function (pt) {
                return pt>0;
            });

            chart = BuildCharts(pieLabels,pieTableData,"Consumo ."+'A\u00F1o '+year);

            return chart;

        }


        function BuildCharts(labels, data, title) {
          return  {
                "labels":labels,
                "data": data,
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
                        text:title
                    }
                },
                "show":true

            };
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
        var municipios = [];
        $scope.SAO = SAO;
        $scope.general = general;
        $scope.documents = documents;
        $scope.municipiosCache = [];
        $scope.provincias = [];
        $scope.ministerios = [];
        $scope.empresas =[];
        $scope.osdes = [];
        $scope.aires = [];
        $scope.oace = [];
        $scope.ueb = [];
        $scope.refrigeracion = [];
        $scope.refrigConsumidos = [];
        $scope.Sustancia = [];
        $scope.Sustancia1 = [];
        $scope.equipoAire = [];
        $scope.equipoRefrigeracion = [];
        Manager.record('municipio').then(function(data){
            $scope.municipiosCache = data.rows.map(function(m){return m.doc;});
            if (record.tipo=='datos') {
                if (record.provincia==undefined) {
                    record.municipio=$scope.municipiosCache[0]
                }
                else
                    {
                    record.municipio=  _($scope.municipiosCache).where({"provincia":record.provincia.id})
                }
            }
        });
        Manager.record('provincia').then(function(data){
            $scope.provincias = data.rows.map(function(m){return m.doc;});
            $scope.provincias = _($scope.provincias).sortBy(function (el) {
                return el.nombre;
            });

            if (action==undefined && record.tipo=='datos') {
                record.provincia = $scope.provincias[0];

            }
        });
        Manager.record('ministerio').then(function(data){
            $scope.ministerios = data.rows.map(function(m){return m.doc;});
            $scope.ministerios = _($scope.ministerios).sortBy(function (el) {
                return el.nombre;
            });
        });
        // Manager.record('empresa').then(function(data){
        //     $scope.empresas = data.rows.map(function(m){return m.doc;});
        //     $scope.empresas = _($scope.empresas).sortBy(function (el) {
        //         return el.nombre;
        //     });
        // });
        // Manager.record('osde').then(function(data){
        //     $scope.osdes = data.rows.map(function(m){return m.doc;});
        //     $scope.osdes = _($scope.osdes).sortBy(function (el) {
        //         return el.nombre;
        //     });
        // });

        Manager.record('aire').then(function(data){
            $scope.aires = data.rows.map(function(m){return m.doc;});
            $scope.aires = _($scope.aires).sortBy(function (el) {
                return el.nombre;
            });

        });

        Manager.record('refrigeracion').then(function(data){
            $scope.refrigeracion = data.rows.map(function(m){return m.doc;});
            $scope.refrigeracion = _($scope.refrigeracion).sortBy(function (el) {
                return el.nombre;
            });
            $scope.record.refrigeracion = $scope.refrigeracion[0];
        });
        Manager.record('refrigConsumidos').then(function(data){
            $scope.refrigConsumidos = data.rows.map(function(m){return m.doc;});
            $scope.refrigConsumidos = _($scope.refrigConsumidos).sortBy(function (el) {
                return el.nombre;
            });
            $scope.record.refrigConsumidos = $scope.refrigConsumidos[0];
        });
         Manager.record('Sustancia').then(function(data){
            $scope.Sustancia = data.rows.map(function(m){return m.doc;});
            $scope.Sustancia = _($scope.Sustancia).sortBy(function (el) {
                return el.nombre;
            });
            $scope.record.Sustancia = $scope.Sustancia[0];
        });
        Manager.record('Sustancia1').then(function(data){
            $scope.Sustancia1 = data.rows.map(function(m){return m.doc;});
            $scope.Sustancia1 = _($scope.Sustancia1).sortBy(function (el) {
                return el.nombre;
            });
            $scope.record.Sustancia1 = $scope.Sustancia1[0];
        });
        Manager.record('equipoAire').then(function(data){
            $scope.equipoAire = data.rows.map(function(m){return m.doc;});
            $scope.equipoAire = _($scope.equipoAire).sortBy(function (el) {
                return el.nombre;
            });

            if ($scope.record!="general")
            {

                $scope.record.equipoAire = $scope.equipoAire[0];
            }

        });
        Manager.record('equipoRefrigeracion').then(function(data){
            $scope.equipoRefrigeracion = data.rows.map(function(m){return m.doc;});
            $scope.equipoRefrigeracion = _($scope.equipoRefrigeracion).sortBy(function (el) {
                return el.nombre;
            });
            if ($scope.record!="general")
            {

                $scope.record.equipoRefrigeracion = $scope.equipoRefrigeracion[0];
            }
        });



        //$scope.SelectMunicipio=function ($item,$model) {
        //
        //    $scope.municipios = _($scope.municipios).where({"provincia":$item.id});
        //};

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
          return  Manager.create(element).then(function(result) {
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
                experiencias:'Introduzca la carga.',
                alternativa:'Nombre de alternativa incorrecto. Contiene menos de tres caracteres y/o caracteres extra\u00F1os. ',
                empresa:'Nombre de empresa incorrecto. Contiene menos de tres caracteres y/o caracteres extra\u00F1os. ',
                empresa1:'Nombre de empresa incorrecto. Contiene menos de tres caracteres y/o caracteres extra\u00F1os. ',
                unidades:'Introduzca el No. unidades.',
                limpieza:'Introduzca las sustancias de limpieza.',
                capacidad:'Introduzca la capacidad.',
                inventario:'Introduzca el No. inventario.',
                correo:'Introduzca una direcc\u00F3n de correo adecuada.',
                curso:'Introduzca la cantidad de personal que ha pasado el Curso Buenas Prácticas.',
                experiencia:'Introduzca los años de experiencia.',
                oace:'Nombre de OACE incorrecto. Contiene menos de tres caracteres y/o caracteres extra\u00F1os. ',
                oace1:'Nombre de OACE incorrecto. Contiene menos de tres caracteres y/o caracteres extra\u00F1os. ',
                ueb1:'Nombre de UEB incorrecto. Contiene menos de tres caracteres y/o caracteres extra\u00F1os. ',
                ueb:'Nombre de UEB incorrecto. Contiene menos de tres caracteres y/o caracteres extra\u00F1os. ',
                osde1:'Nombre de OSDE incorrecto. Contiene menos de tres caracteres y/o caracteres extra\u00F1os. ',
                osde:'Nombre de OSDE incorrecto. Contiene menos de tres caracteres y/o caracteres extra\u00F1os. ',
                direccion:'Direcci\u00F3n incorrecta. Contiene menos de tres caracteres. ',
                representante:'Nombre de representante incorrecto. Contiene menos de tres caracteres.',
                director:'Nombre incorrecto. Contiene menos de tres caracteres.',
                consumo:'Faltan a\u00F1os por agregar el consumo en toneladas m\u00E9tricas.',
                pronostico:'En pron\u00F3sticos faltan a\u00F1os por agregar el consumo en toneladas m\u00E9tricas.'

            };
            switch (element.tipo) {


                case 'importaciones1':
                case 'datos':
                error = ModelValidator.RecordError(element);
                    if (error.length>0)
                    {
                        error.forEach(function(e)
                        {
                            $scope.error.tipo = e;
                            throw msg[e];

                        });
                    }

                    break;
                case 'empresa3':
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
                        if(element.Uso.length<1)
                        {
                            $scope.error.tipo='anno';
                            throw 'Agregar el consumo en toneladas m\u00E9tricas. ';
                        }
                    }
                    break;
                case 'aire2':
                case 'consumo':
                case 'aerosoles':
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
                case 'empresa4':
                    // if(element.sustanciasR==undefined){
                    //     $scope.error.tipo='sustanciasR';
                    //     throw 'Introduzca la cantidad que hayan pasado el Curso Buenas Prácticas.';
                    // }

                    error = ModelValidator.RecordError(element);
                    if (error.length>0)
                    {
                        error.forEach(function(e){
                            $scope.error.tipo = e;
                            throw 'Introduzca el ' +  e;
                        });
                    }

                    element.explotacion = element.experiencias * element.unidades;
                    element.aplicacionAire = element.aplicacionAire.concat($scope.aires.filter(function(el) {
                        return el.value == true;
                    }));
                    if (element.aplicacionAire.length==0){throw 'Seleccione al menos una aplicacion de Aire Acondicionado';}
                    element.aplicacionRefri = element.aplicacionRefri.concat($scope.refrigeracion.filter(function(el) {
                        return el.value == true;
                    }));
                    if (element.aplicacionRefri.length==0){throw 'Seleccione al menos una aplicacion de Refrigeración';}
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
                    if(element.capacidad==undefined){
                        $scope.error.tipo='capacidad';
                        throw 'Introduzca la capacidad.';
                    } 
                    if(element.inventario==undefined){
                        $scope.error.tipo='inventario';
                        throw 'Introduzca el No. inventario.';
                    }
                    if(element.experiencia==undefined){
                        $scope.error.tipo='experiencia';
                        throw 'Introduzca los años de experiencia.';
                    }
                    // if(element.curso==undefined){
                    //     $scope.error.tipo='curso';
                    //     throw 'Introduzca la cantidad de personal que ha pasado el Curso Buenas Prácticas.';
                    // }

                    if (element.servicio=='Sí') {
                        element.servicio=element.empresa;
                    }


                    break;

            }

            //todo validar datos
            //if(element.tipo!="general"){
            //    element = Util.collect($scope.general, element);
            //}
            // element = Util.collect($scope.general, element);

            if(element.refrigConsumidos!=undefined)
            {

                if (element.refrigConsumidos.length<$scope.refrigConsumidos.length)
                {
                    var not = $scope.refrigConsumidos.filter(function (reg) {
                        var name1 = _.find(element.refrigConsumidos,function (elr) {
                            return  elr.re6.nombre==reg.nombre;
                        });

                        return name1==undefined;
                    }).map(function (rg) {
                        return {
                            re6:rg,
                            cant6:0,
                            nombre:""

                        };
                    });
                    element.refrigConsumidos = element.refrigConsumidos.concat(not);


                }



            }

           if(element.Limpieza!=undefined)
            {


                if (element.Limpieza.length<['R-141b (g)','RL-95 (litros)'].length)
                {

                    element.Limpieza = element.Limpieza.concat(['R-141b (g)','RL-95 (litros)'].filter(function (reg) {
                        var name1 = _.find(element.Limpieza,function (elr) {
                            return  elr.re5==reg;
                        });

                        return name1==undefined;
                    }).map(function (rg) {
                        return {
                            re5:rg,
                            cant5:0,
                            nombre:""

                        };
                    }));


                }
            }

            //todo ver quien es este en el modal

            if(element.CantRefriRefri!=undefined)
            {
                if(element.CantRefriRefri.length<3)
                {
                    $scope.error.tipo='CantRefriRefri';
                    throw 'Quedan refrigerante consumido para refrigeraci\u00F3n sin valor. ';
                }
            }
            if(element.CantRefriAire!=undefined)
            {
                if(element.CantRefriAire.length<3)
                {
                    $scope.error.tipo='CantRefriAire';
                    throw 'Quedan refrigerante consumido para aire acondicionado sin valor. ';
                }
            }
            if(element.Recuperacion!=undefined)
            {


                if (element.Recuperacion.length<['R-141b (g)','RL-95 (litros)'].length)
                {

                    element.Recuperacion = element.Recuperacion.concat(['AR500','CR500','Criolla','Otras'].filter(function (reg) {
                        var name1 = _.find(element.Recuperacion,function (elr) {
                            return  elr.re2==reg;
                        });

                        return name1==undefined;
                    }).map(function (rg) {
                        return {
                            re2:rg,
                            cant2:0,
                            nombre:""

                        };
                    }));


                }
            }
            if(element.Recuperado!=undefined)
            {

                if (element.Recuperado.length<['R-141b (g)','RL-95 (litros)'].length)
                {

                    element.Recuperado = element.Recuperado.concat(['R134a','R22','R404A','R410A','Otros'].filter(function (reg) {
                        var name1 = _.find(element.Recuperado,function (elr) {
                            return  elr.re3==reg;
                        });

                        return name1==undefined;
                    }).map(function (rg) {
                        return {
                            re3:rg,
                            cant3:0,
                            nombre:""

                        };
                    }));


                }
            }
            if(element.Total!=undefined)
            {

                if (element.Total.length<['R-141b (g)','RL-95 (litros)'].length)
                {

                    element.Total = element.Total.concat(['Ingenieros','T\u00E9cnicos','Mec\u00E1nicos'].filter(function (reg) {
                        var name1 = _.find(element.Total,function (elr) {
                            return  elr.re4==reg;
                        });

                        return name1==undefined;
                    }).map(function (rg) {
                        return {
                            re4:rg,
                            cant4:0,
                            nombre:""

                        };
                    }));


                }
            }
            if(element.unidades=='')
            {

                    $scope.error.tipo='unidades';
                    throw 'Introduzca el No. de unidades.';
            }

            if (element.tipo=='datos')
            {
               return Manager.record('datos').then(function (data) {
                    if (data.rows.length==0) {
                        return AddElement(element);
                    }
                    else{
                        return Manager.update(element).then(function(fn){Finish();});
                    }

                });
            }
            else

            {
               return AddElement(element);
            }

        }



        function Close() {
            $uibModalInstance.dismiss('cancel');
        }

        function Finish(type) {
            $uibModalInstance.close(type!=undefined?type:'close');
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



            Finish();
        };


        $scope.Save = function() {
            //TODO: reverse update in actions list
           try{
               Add($scope.record).then(function(){
                   Finish($scope.record.tipo);
               }
               );


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
                Manager.record('general').then(function (data) {
                    if (data.rows.length==0) {
                        Manager.create($scope.general);
                    }
                    else{
                        Manager.update($scope.general);
                    }

                });

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
                    // case 'datos':
                    //     // $scope.record.provincia
                    //     break;
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
                        $scope.record.equipoAire = $scope.equipoAire[0];
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
                        $scope.record.Sustancia = $scope.Sustancia[0];
                        $scope.record.Sustancia1 = $scope.Sustancia1[0];
                        $scope.year = 2011;
                        $scope.year_future = 2020;
                        

                        break;
                    case 'importaciones2':
                        // $scope.record.Tipo = SAO.Tabla23[0].alternativas[0];
                        $scope.record.aplicacionAire = SAO.AplicacionAire[0];
                        $scope.record.aplicacionRefri = SAO.AplicacionRefri[0];
                        $scope.record.Estado = SAO.Estado[0];
                        $scope.record.personal = [SAO.Personal[0]];
                         $scope.record.habilitado=false;
                        // $scope.record.personal = SAO.Personal[0];
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
                        $scope.year = 2016;

                        break;
                    case 'empresa4':
                        $scope.record.sustancia = SAO.OrgProduccion[0];
                        $scope.record.refrigConsumidos = [];

                        //$scope.record.municipio = SAO.Provincias.municipios[0];
                        $scope.record.TipoAire = SAO.TipoAire[0];
                        $scope.record.TipoRefrigeracion = SAO.TipoRefri[0];
                        $scope.record.SustanciaRefrigerante = SAO.SustanciasRefrigerante[0];
                        $scope.record.SustanciaAire = SAO.SustanciasAire[0];
                        $scope.record.aplicacionAire = [SAO.AplicacionAire[0]];
                        $scope.record.aplicacionRefri = [SAO.AplicacionRefri[0]];
                        $scope.re2 = 'AR500';
                        $scope.re3 = 'R134a';
                        $scope.re4 = 'Ingenieros';
                        $scope.re5 = 'R-141b (g)';
                        $scope.re6 =  SAO.SustanciasRefrigerante[0];
                        $scope.re = 'HCFC';
                        $scope.re1 = 'HCFC';
                        // $scope.record.habilitado=false;
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
                        $scope.year = 2011;
                        $scope.year_future = 2020;
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
                    // case 'importaciones2':
                    //     $scope.Tabla23R = _.find(SAO.Tabla23,function(o){return o.aplicacion.nombre==$scope.record.Alternativa.nombre;});
                    //     var importaciones2 = _.find($scope.Tabla23R.alternativas,function(a){return a.nombre == $scope.record.Tipo.nombre; });
                    //     if (importaciones2==undefined)
                    //     {
                    //         $scope.Tabla23R.alternativas =$scope.Tabla23R.alternativas.concat($scope.record.Alternativa);
                    //     }
                    //     selectedTabla23 = $scope.Tabla23R;
                    //     $scope.year = 2011;
                    //     break;

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
                    case 'general':
                        $scope.record = angular.copy(record);
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
        $scope.SelectMunicipio=function ($item,$model) {

            $scope.municipios = _($scope.municipiosCache).where({"provincia":$item.id});
            $scope.municipios = _($scope.municipios).sortBy(function (el) {
                return el.nombre;
            });
            $scope.general.municipio =  $scope.municipios[0];
            if ($scope.record.tipo=='empresa4')
            {
                $scope.record.municipio =  $scope.municipios[0]
            }
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

        $scope.Pronostico = function(year2,amount){

            if(amount==undefined){
                amount=0;
            }

            // record.Uso.push({"anno":year,"tons":amount,"nombre": +year+":"+amount});
            record.Pronostico = _.reject(record.Pronostico,function (el) { return el.anno==year2;
            }).concat([{"anno":year2,"tons":amount,"nombre": +year2+":"+amount}]);
            record.Pronostico =  _.uniq(record.Pronostico,false,function (el) {
                return el.anno;
            });

            record.Pronostico = _.sortBy( record.Pronostico,function (us) {
                return us.anno;
            });
            $scope.record.Pronostico = angular.copy(record.Pronostico)

        };
        $scope.ConsumoImportaciones = function(year1,amount){

            if(amount==undefined){
                amount=0;
            }

            // record.Uso.push({"anno":year,"tons":amount,"nombre": +year+":"+amount});
            record.Importaciones = _.reject(record.Importaciones,function (el) { return el.anno==year1;
            }).concat([{"anno":year1,"tons":amount,"nombre": year1+":"+amount}]);
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
            record.Recuperacion = _.reject(record.Recuperacion,function (el) { return el.re2==re2;
            }).concat([{"re2":re2,"cant2":amount,"nombre":amount>0? re2+":"+amount:""}]);
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

            record.Recuperado = _.reject(record.Recuperado,function (el) {return el.re3==re3;}).concat([{"re3":re3,"cant3":amount,"nombre": amount>0?re3+":"+amount:""}]);
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
            record.Total = _.reject(record.Total,function (el) {return el.re4==re4;}).concat([{"re4":re4,"cant4":amount,"nombre":amount>0? re4+":"+amount:""}]);

            // record.Total.push({"re4":re4,"cant4":amount,"nombre":amount>0?re4+":"+amount:""});
            record.Total =  _.uniq(record.Total,false,function (el) {
                return el.re4;
            });

            record.Total = _.sortBy( record.Total,function (us) {
                return us.re4;
            });
            $scope.record.Total= angular.copy(record.Total);

        };
        $scope.ConsumoLimpieza = function(re5,amount){

            if(amount==undefined){
                amount=0;
            }

            // record.CantRefriRefri.push({"re":re,"cant":amount,"nombre": +re+":"+amount});
            record.Limpieza = _.reject(record.Limpieza,function (el) { return el.re5==re5;
            }).concat([{"re5":re5,"cant5":amount,"nombre":amount>0? re5+":"+amount:""}]);
            record.Limpieza =  _.uniq(record.Limpieza,false,function (el) {
                return el.re5;
            });

            record.Limpieza = _.sortBy( record.Limpieza,function (us) {
                return us.re5;
            });
            $scope.record.Limpieza = angular.copy(record.Limpieza)

        };
        $scope.ConsumorefrigConsumidos = function(re6,amount){

            if(amount==undefined){
       amount=0;
   }

   // record.CantRefriRefri.push({"re":re,"cant":amount,"nombre": +re+":"+amount});
   record.refrigConsumidos = _.reject(record.refrigConsumidos,function (el) { return el.re6.nombre==re6.nombre;
   }).concat([{"re6":re6,"cant6":amount,"nombre":amount>0? re6.nombre+":"+amount:""}]);
   record.refrigConsumidos = _.uniq(record.refrigConsumidos,false,function (el) {
       return el.re6.nombre;
   });

   record.refrigConsumidos = _.sortBy( record.refrigConsumidos,function (us) {
       return us.re6.nombre;
   });
   $scope.record.refrigConsumidos = angular.copy(record.refrigConsumidos)

        };
        $scope.ConsumoCantRefriRefri = function(re,amount){

            if(amount==undefined){
                amount=0;
            }

            // record.CantRefriRefri.push({"re":re,"cant":amount,"nombre": +re+":"+amount});
            record.CantRefriRefri = _.reject(record.CantRefriRefri,function (el) { return el.re==re;
            }).concat([{"re":re,"cant":amount,"nombre":amount>0? re+":"+amount:""}]);
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
            record.CantRefriAire = _.reject(record.CantRefriAire,function (el) { return el.re1==re1;
            }).concat([{"re1":re1,"cant1":amount,"nombre":amount>0? re1+":"+amount:""}]);
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
           message:'Error al cargar la base de datos.'
       };
       $scope.operation = {
           show:false,
           message:'Base de datos cargada correctamente.'
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
                // $scope.operation.show = true;
                Manager.unify().then(function () {
                  $timeout(function () {
                      $scope.operation.show = true;
                  },5000);
                });
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
        $scope.User = function (user,size,action) {
            var instance = $uibModal.open({
                animation: true,
                templateUrl: "template/modal/user-modal.html",
                controller: function ($scope,Manager,user,$uibModalInstance,SHA256,action) {
                    $scope.user = user;
                    $scope.action = action;
                    var msg =
                    {
                        password:"Clave no segura. Debe contener al menos 8 caracteres, may\u00FAsculas, n\u00FAmeros y caracteres especiales.",
                        username:"Usuario incorrecto. Contiene menos de tres caracteres y/o caracteres extra\u00F1os."
                    };
                    $scope.error ={
                        show:false,
                        message:'Ha ocurrido un error.'
                    };
                    $scope.Save= function (user)
                    {
                        if (user==undefined) {
                            user = {
                                username:'',
                                password:''
                            };
                        }
                          user.tipo = "usuario";
                        if (ModelValidator.isValidUser(user,action))
                        {

                           if((action=='edit' && user.password!=user.repassword && user.repassword!=''))
                           {
                               user.password = SHA256(user.repassword).toString();
                           }

                            if (action==undefined)
                            {
                                user.password = SHA256(user.password).toString();

                            }

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
                            var fields = ModelValidator.UserError(user,action)[0];
                            $scope.error.message = msg[fields];
                            $scope.error.show = true;

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
                    },
                    action:function () {
                        return action;
                    }
                }
            });

            instance.result.then(function(data) {
                Refresh();
            }, function(reason) {
                console.warn(JSON.stringify(reason));
            }).finally(function () {
                Refresh();
            });
        };

        // $scope.Delete = function (el) {
        //     DeleteElement(el).finally(function () {
        //         Refresh();
        //         // Finish();
        //     });
        // };
        $scope.Delete = function(user, size) {
            var instance = $uibModal.open({
                animation: true,
                templateUrl: "template/modal/delete-modal.html",
                controller: function ($scope,user,$uibModalInstance) {
                    $scope.Close = function () {
                        Close();
                    };

                    $scope.Delete = function () {
                        Finish();
                    };

                    function Close() {
                        $uibModalInstance.dismiss('cancel');
                    }

                    function Finish() {
                        $uibModalInstance.close(user);
                    }
                },
                size: size,
                resolve: {
                    user: function () {
                        return user;
                    }
                }
            });

            instance.result.then(function(user) {
                DeleteElement(user).finally(function () {
                    Refresh();
                }) ;
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
        $scope.nomenclaturesCache  = [];
        $scope.selected=false;
        $scope.ntype = '';
        $scope.ntypes = ['ministerio','provincia','municipio', 'aire','refrigeracion', 'refrigConsumidos','Sustancia','Sustancia1','equipoAire','equipoRefrigeracion'];

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

                            Manager.record(nomenclature.tipo).then(function (data) {
                                var allData = data.rows.map(function (el) {
                                    return el.doc;
                                }) ;

                                var unique = _(allData).find(function (nm) {
                                    return nm.nombre==nomenclature.nombre;
                                })  ;
                                if(unique==undefined)
                                {
                                    Manager.create(nomenclature).
                                        then(function (e)
                                        {
                                            $scope.alert.show = true;
                                            $scope.alert.message = 'Nomenclador agregado correctamente';
                                            $scope.alert.type = 'success';
                                            $timeout(function () {
                                                $scope.alert.show = false;
                                                Finish(nomenclature.tipo);
                                            },1000);
                                        }).
                                        catch(function (reason) {
                                            $scope.alert.show = true;
                                            $scope.alert.message = reason;
                                            $scope.alert.type = 'danger';
                                        })
                                    ;

                                }
                                else{
                                    $scope.alert.show = true;
                                    $scope.alert.message = 'Nomenclador incorrecto. Ya existe uno con ese nombre.' ;
                                    $scope.alert.type = 'danger';

                                }


                            });

                        }
                        else
                        {
                            $scope.alert.show = true;
                            $scope.alert.message = 'Nomenclador incorrecto. Contiene menos de tres caracteres y/o caracteres extra\u00F1os.' ;
                            $scope.alert.type = 'danger';

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

        $scope.Mark = function(){
            if ($scope.selected)
            {
                checkAll();
            }
            else{
                uncheckAll();
            }
        };

        $scope.DeleteSelected = function(){
            var find = _($scope.nomenclatures).find(function(nm){
                return nm.selected==true;
            });
            if (find==undefined)
            {
                $scope.alert.show = true;
                $scope.alert.message = "Seleccione al menos un elemento";
                $scope.alert.type = 'danger';
            }
            else
            {
                var tipo = find.tipo;
                var reject = _($scope.nomenclatures).filter(function(nm){return nm.selected==true;});
                Manager.delete(reject.map(function(re){re._deleted=true;return re;})).then(function (e)
                {
                    $scope.alert.show = true;
                    $scope.alert.message = 'Nomencladores eliminados correctamente';
                    $scope.alert.type = 'success';
                    $timeout(function () {
                        $scope.alert.show = false;
                        List(tipo);
                    },500);
                }).
                    catch(function (reason) {
                        $scope.alert.show = true;
                        $scope.alert.message = reason.message;
                        $scope.alert.type = 'danger';
                        $timeout(function () {
                            $scope.alert.show = false;
                        },3000);
                    });

            }
        };

        function checkAll()
        {
            $scope.nomenclatures = $scope.nomenclatures.map(function (nm) {
                nm.selected = true;
                return nm;
            });
        };

        function uncheckAll()
        {
            $scope.nomenclatures = $scope.nomenclatures.map(function (nm) {
                nm.selected = false;
                return nm;
            });
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
                    },500);
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
                $scope.nomenclatures = _.sortBy(data.rows.map(function (el) {
                    return el.doc;
                }),function(el){return el.nombre.toLocaleLowerCase();});

                $scope.nomenclaturesCache = angular.copy($scope.nomenclatures);
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




angular.module('app.sao')
.factory('Manager', function(pouchDB,$q) {

    var manager = {};
    var db = pouchDB('sao', {
        "adapter": "websql"
    });


    ////***private
    function createDesignDoc(name, mapFunction) {
        var ddoc = {
            _id: '_design/' + name,
            views: {}
        };
        ddoc.views[name] = {
            map: mapFunction.toString()
        };
        return ddoc;
    };

    //vistas[consultas]// es realizada a traves de definicion de documentos de vistas o filtros, los filtros se definen en la base de datos previamente
    var views = [
        createDesignDoc("tipo", function(doc) {
            emit(doc.tipo);
        })

    ];

    //se introducen las vistas en la base de datos, para luego ejecutarlas
    views.forEach(function(el) {
        db.put(el).
        catch (function(reason) {
            console.warn(JSON.stringify(reason));
        });
    });



    ///***public
    manager.create = function(element) {
        return db.post(element);
    };

    manager.update = function(element) {
        if (Object.prototype.toString.call(element) === '[object Array]') {
            return db.bulkDocs(element);
        }
        return db.put(element);
    };

    manager.delete = function(element) {
        if (Object.prototype.toString.call(element) === '[object Array]') {
            return db.bulkDocs(element);
        }
        return db.remove(element._id, element._rev);
    };

    manager.from = function(path, options) {
        var remote = pouchDB('sao-data',{ "adapter": "websql"});
        var d = $q.defer();
        remote.load(path).then(function () {
            db.replicate.from(remote).on('complete',function (data) {

                d.resolve(data);
            }).on('error',function (error) {
                d.reject('error'+JSON.stringify(error));
            });
        }).catch(function (error) {
            d.reject('error'+JSON.stringify(error));
        });

        return d.promise;

    };

   manager.syncronize = function (path) {
       var remote = pouchDB('sao-data',{ "adapter": "websql"});
       var d = $q.defer();
       remote.load(path).then(function () {
           db.sync(remote).on('complete',function (data) {
               d.resolve(data);
           }).on('error',function (error) {
               d.reject('error'+JSON.stringify(error));
           });
       }).catch(function (error) {
           d.reject('error'+JSON.stringify(error));
       });

       return d.promise;

   };



    manager.to = function(path, options) {
        var remote = pouchDB('sao-data',{ "adapter": "websql"});
        var d = $q.defer();
        remote.load(path).then(function () {

            db.replicate.to(remote).on('complete',function (data) {
                d.resolve(data);
            }).on('error',function (error) {
                d.reject('error'+JSON.stringify(error));
            });
        }).catch(function (error) {
            d.reject('error'+JSON.stringify(error));
        });

        return d.promise;
    };

    manager.get = function(query, options) {
        if (query == undefined) {
            return db.allDocs(options != undefined ? options : {});
        } else {
            return db.get(query, options != undefined ? options : {});
        }

    };

    manager.record = function(name) {
        return db.query("tipo", {
            key: name,
            include_docs: true
        });
    };

    /**
     * Save to file
     */
    manager.flush = function() {
        var d = $q.defer();
        db.allDocs({
            include_docs: true
        }).then(function(result) {
            //save to file
            db.dump(ws).then(function(res) {
                console.log(res);

                d.resolve(res);
            },function (err) {
                d.reject(err);
            });
        }).
        catch (
            function(err)
        {
            console.log(err);
            d.reject(err);
        }
        ).finally(function () {
            ws.close();
        });

        return d.promise;

    };

    manager.loadDatafile = function (path) {

        var d= $q.defer();
        fs. readFile(path, function (err, data)
        {
                if (err){
                    d.reject(err);
                    throw err;
                }
                var stst = data.toString('utf8');
                var fecha = new Date();
                var filename= 'data/sao_'+fecha.getDay()+'_'+fecha.getTime()+'.json';
                fs.writeFile(filename,stst,'utf8',function (data) {
                    d.resolve(filename);
                });
        }) ;

        return d.promise;

    };

    manager.dataString = function(){
        var d = $q.defer();
        var dumpedString = '';
        var stream = new MemoryStream();
        stream.on('data', function(chunk) {
            dumpedString += chunk.toString();
        });

        db.dump(stream).then(function () {
            d.resolve(dumpedString);
        }).catch(function (err) {
            d.reject(err);
        });

        return d.promise;

    };

    /**
     * Load file
     */
    manager.local = function() {
        return db.get('_local/preloaded').then(function(doc) {}).
        catch (function(err) {
            if (err.name !== 'not_found') {
                throw err;
            }
            // we got a 404, so the local document doesn't exist. so let's preload!
            return db.load('data/sao.json').then(function() {
                // create the local document to note that we've preloaded
                return db.put({
                    _id: '_local/preloaded'
                });
            });
        }).then(function() {
            return db.allDocs({
                include_docs: true
            });
        }).
        catch (console.log.bind(console));
    };

    /**
     * Close de database
     * @returns
     */
    manager.close = function() {
        return db.close();
    };

    return manager;
})

.factory("SAO", function() {
    return {
        "Provincias": [{
            "id": "1",
            "nombre": 'Pinar del Río',
            "municipios":["Consolación del Sur", "Guane", "La Palma", "Los Palacios", "Mantua", "Minas de Matahambre", "Pinar del Río", "San Juan y Martínez", "San Luis", "Sandino", "Viñales"]
        }, {
            "id": "2",
            "nombre": 'Artemisa',
            "municipios":[
                "Alquízar", "Artemisa", "Bauta", "Caimito", "Guanajay", "Güira de Melena", "Mariel", "San Antonio de los Baños", "Bahía Honda", "San Cristóbal", "Candelaria"]
        }, {
            "id": "3",
            "nombre": 'Mayabeque',
            "municipios":["Batabanó", "Bejucal", "Güines", "Jaruco", "Madruga", "Melena del Sur", "Nueva Paz", "Quivicán", "San José de las Lajas", "San Nicolás de Bari", "Santa Cruz del Norte"]
        }, {
            "id": "4",
            "nombre": 'La Habana',
            "municipios":[
                "Arroyo Naranjo", "Boyeros", "Centro Habana", "Cerro", "Cotorro", "Diez de Octubre", "Guanabacoa", "Habana del Este", "Habana Vieja", "La Lisa", "Marianao", "Playa", "Plaza", "Regla", "San Miguel del Padrón"]
        }, {
            "id": "5",
            "nombre": 'Matanzas',
            "municipios":["Calimete", "Cárdenas", "Ciénaga de Zapata", "Colón", "Jagüey Grande", "Jovellanos", "Limonar", "Los Arabos", "Martí", "Matanzas", "Pedro Betancourt", "Perico", "Unión de Reyes"]
        }, {
            "id": "6",
            "nombre": 'Cienfuegos',
            "municipios":["Abreus", "Aguada de Pasajeros", "Cienfuegos", "Cruces", "Cumanayagua", "Palmira", "Rodas", "Santa Isabel de las Lajas"]

        }, {
            "id": "7",
            "nombre": 'Villa Clara',

            "municipios":["Caibarién", "Camajuaní", "Cifuentes", "Corralillo", "Encrucijada", "Manicaragua", "Placetas", "Quemado de Güines", "Ranchuelo", "Remedios", "Sagua la Grande", "Santa Clara", "Santo Domingo"]
        }, {
            "id": "8",
            "nombre": 'Sancti Spíritus',
            "municipios":[
                "Cabaigúan", "Fomento", "Jatibonico", "La Sierpe", "Sancti Spíritus", "Taguasco", "Trinidad", "Yaguajay"]
        }, {
            "id": "9",
            "nombre": 'Ciego de Ávila',
            "municipio":["Ciro Redondo", "Baraguá", "Bolivia", "Chambas", "Ciego de Ávila", "Florencia", "Majagua", "Morón", "Primero de Enero", "Venezuela"]
        }, {
            "id": "10",
            "nombre": 'Camagüey',
            "municipios":[ "Camagüey", "Carlos Manuel de Céspedes", "Esmeralda", "Florida", "Guaimaro", "Jimagüayú", "Minas", "Najasa", "Nuevitas", "Santa Cruz del Sur", "Sibanicú", "Sierra de Cubitas", "Vertientes"]
        }, {
            "id": "11",
            "nombre": 'Las Tunas',
            "municipios":[
                "Amancio Rodríguez", "Colombia", "Jesús Menéndez", "Jobabo", "Las Tunas", "Majibacoa", "Manatí", "Puerto Padre"]
        }, {
            "id": "12",
            "nombre": 'Holguín',
            "municipios":[
                "Antilla", "Báguanos", "Banes", "Cacocum", "Calixto García", "Cueto", "Frank País", "Gibara", "Holguín", "Mayarí", "Moa", "Rafael Freyre", "Sagua de Tánamo", "Urbano Noris"]
        }, {
            "id": "13",
            "nombre": 'Santiago de Cuba',
            "municipios":[
                "Contramaestre", "Guamá", "Julio Antonio Mella", "Palma Soriano", "San Luis", "Santiago de Cuba", "Segundo Frente", "Songo la Maya", "Tercer Frente"]
        }, {
            "id": "14",
            "nombre": 'Guantánamo',
            "municipios":[
                "Baracoa", "Caimanera", "El Salvador", "Guantánamo", "Imías", "Maisí", "Manuel Tames", "Niceto Pérez", "San Antonio del Sur", "Yateras"]
        }, {
            "id": "15",
            "nombre": 'Isla de la Juventud',
            "municipios":[]
        },
            {
                "id":"16",
                "nombre":"Granma",
                "municipios":["Bartolomé Masó", "Bayamo", "Buey Arriba", "Campechuela", "Cauto Cristo", "Guisa", "Jiguaní", "Manzanillo", "Media Luna", "Niquero", "Pilón", "Río Cauto", "Yara"]
            }
            ],


        "OSDE": [{
            "id": "1",
            "nombre": 'OSDE1'
        }, {
            "id": "2",
            "nombre": 'OSDE2'
        }],
        "Sustancias": [{
            "id": "1",
            "nombre": 'Refrigerantes-Hidrocarburos'
        }, {
            "id": "2",
            "nombre": 'Agente de expansión-Hidrocarburos '
        }, {
            "id": "3",
            "nombre": 'Metilformato'
        }, {
            "id": "4",
            "nombre": 'Metilal'
        }, {
            "id": "5",
            "nombre": 'CO2'
        }, {
            "id": "6",
            "nombre": 'HFC-23 '
        }, {
            "id": "7",
            "nombre": 'HFC-32 '
        }, {
            "id": "8",
            "nombre": 'HFC-125 '
        }, {
            "id": "9",
            "nombre": 'HFC-134a '
        }, {
            "id": "10",
            "nombre": 'HFC-143a '
        }, {
            "id": "11",
            "nombre": 'HFC-152a '
        }, {
            "id": "12",
            "nombre": 'HFC-227ea '
        }, {
            "id": "13",
            "nombre": 'HFC-245fa '
        }, {
            "id": "14",
            "nombre": 'HFC-365mfc '
        }, {
            "id": "15",
            "nombre": 'R-407C '
        }, {
            "id": "16",
            "nombre": 'R-407F '
        }, {
            "id": "17",
            "nombre": 'R-410A '
        }, {
            "id": "18",
            "nombre": 'R-404A '
        }],
        "Sectores": [{
            "id": "1",
            "nombre": 'RAC '
        }, {
            "id": "2",
            "nombre": 'Espumas'
        }, {
            "id": "3",
            "nombre": 'Aerosoles '
        }, {
            "id": "4",
            "nombre": 'Solventes'
        }, {
            "id": "5",
            "nombre": 'Extintores '
        }],
        "AlternativaHFC": [
            { "id": "1",
            "nombre": 'HFC-134a'
        }, {
            "id": "2",
            "nombre": 'HFC-32'
        }, {
            "id": "3",
            "nombre": 'HFC-152a'
        }, {
            "id": "4",
            "nombre": 'HFC-245fa'
        }, {
            "id": "5",
            "nombre": 'HFC-227ea/HFC-365mfc'
        }],
        "AlternativaHFCMezclas": [
           {
            "id": "1",
            "nombre": 'R-404A'
        }, {
            "id": "2",
            "nombre": 'R-407C'
        }, {
            "id": "3",
            "nombre": 'R-410A'
        }, {
            "id": "4",
            "nombre": 'R-507A'
        }],
        "AlternativaHFO": [{
            "id": "1",
            "nombre": 'HFO-1234yf'
        }, {
            "id": "2",
            "nombre": 'HFO-1234ze'
        }, {
            "id": "3",
            "nombre": 'HFO-1233zd'
        }, {
            "id": "4",
            "nombre": 'HFO-1336mzzm'
        }],
        "AlternativaOtras": [{
            "id": "1",
            "nombre": 'Metil formato'
        }, {
            "id": "2",
            "nombre": 'Metilal'
        }, {
            "id": "3",
            "nombre": 'Etanol'
        }, {
            "id": "4",
            "nombre": 'DME'
        }, {
            "id": "5",
            "nombre": 'HC-290'
        }, {
            "id": "6",
            "nombre": 'HC-600a'
        }, {
            "id": "7",
            "nombre": 'Pentano(C,N,I)'
        }, {
            "id": "8",
            "nombre": 'Pentano(C,N,I)'
        }, {
            "id": "9",
            "nombre": 'R-744 '
        }, {
            "id": "10",
            "nombre": 'R-717'
        }],
        "Ministerio": [
            {
                "id": "20",
                "nombre": 'Central de Trabajadores de Cuba (CTC)'
            },
            {
            "id": "1",
            "nombre": 'Consejo de Administración Provincial (CAP)'
            },
            {
                "id": "5",
                "nombre": 'Consejo de Estado (CE)'
            },
            {
                "id": "18",
                "nombre": 'CIMEX'
            },
            {
                "id": "17",
                "nombre": 'Instituto de la Aeronáutica Civil de Cuba (IACC)'
            },
            {
                "id": "6",
                "nombre": 'Ministerio del Azúcar (MINAZ)'
            },
            {
                "id": "15",
                "nombre": 'Ministerio de Ciencia, Tecnología y Medio Ambiente (CITMA)'
            },
            {
                "id": "13",
                "nombre": 'Ministerio de Comercio Interior (MINCIN)'
            },
            {
                "id": "8",
                "nombre": 'Ministerio de la Construcción (MICONS)'
            },
            {
                "id": "7",
                "nombre": 'Ministerio de Comunicaciones de la República de Cuba (MINCOM)'
            },
            {
                "id": "14",
                "nombre": 'Ministerio de Cultura (MINCULT)'
            },
            {
                "id": "9",
                "nombre": 'Ministerio de Educación Superior (MES)'
            },
            {
                "id": "11",
                "nombre": 'Ministerio de la Industria Alimenticia (MINAL)'
            },
            {
                "id": "3",
                "nombre": 'Ministerio de la Industria Básica (MINBAS)'
            },
            {
                "id": "16",
                "nombre": 'Ministerio de la Industria Ligera (MINIL)'
            },
            {
                "id": "12",
                "nombre": 'Ministerio de la Industria Sidero Mécanica y Electrónica (SIME)'
            },
            {
            "id": "2",
            "nombre": 'Ministerio del Turismo (MINTUR)'
            },
            {
                "id": "10",
                "nombre": 'Ministerio de Transporte (MITRANS)'
            },

            {
            "id": "4",
            "nombre": 'Ministerio de Salud Pública (MINSAP)'
            },
            {
            "id": "19",
            "nombre": 'Unión de Jóvenes Comunistas (UJC)'
            },

        {
            "id": "21",
            "nombre": 'Otros'
        }],
        "RA": [
            {
            "id": "1",
            "nombre": 'Fabricación '
        }, {
            "id": "2",
            "nombre": 'Servicio'
        }],
        "Sector": [{
            "id": "1",
            "nombre": 'RAC '
        }, {
            "id": "2",
            "nombre": 'Espumas'
        }, {
            "id": "3",
            "nombre": 'Aerosoles '
        }, {
            "id": "4",
            "nombre": 'Solventes'
        }, {
            "id": "5",
            "nombre": 'Extintores '
        }],
        "SectoresAnexo": [{
            "id": "1",
            "nombre": 'Espuma: poliuretano '
        }, {
            "id": "2",
            "nombre": 'Espuma: polietileno extruido'
        }, {
            "id": "3",
            "nombre": 'Aerosol '
        }, {
            "id": "4",
            "nombre": 'Solventes'
        }, {
            "id": "5",
            "nombre": 'Extintores '
        }],
        "SustanciasRefrigerante": [{ "id": "1",
            "nombre": 'Refrigerantes-Hidrocarburos'
        }, {
            "id": "2",
            "nombre": 'Agente de expansión-Hidrocarburos '
        }, {
            "id": "3",
            "nombre": 'Metilformato'
        }, {
            "id": "4",
            "nombre": 'Metilal'
        }, {
            "id": "5",
            "nombre": 'CO2'
        }, {
            "id": "6",
            "nombre": 'HFC-23 '
        }, {
            "id": "7",
            "nombre": 'HFC-32 '
        }, {
            "id": "8",
            "nombre": 'HFC-125 '
        }, {
            "id": "9",
            "nombre": 'HFC-134a '
        }, {
            "id": "10",
            "nombre": 'HFC-143a '
        }, {
            "id": "11",
            "nombre": 'HFC-152a '
        }, {
            "id": "12",
            "nombre": 'HFC-227ea '
        }, {
            "id": "13",
            "nombre": 'HFC-245fa '
        }, {
            "id": "14",
            "nombre": 'HFC-365mfc '
        }, {
            "id": "15",
            "nombre": 'R-407C '
        }, {
            "id": "16",
            "nombre": 'R-407F '
        }, {
            "id": "17",
            "nombre": 'R-410A '
        }, {
            "id": "18",
            "nombre": 'R-404A '
        }],
        "SustanciasAire": [{
            "id": "1",
            "nombre": 'Refrigerantes-Hidrocarburos'
        }, {
            "id": "2",
            "nombre": 'Agente de expansión-Hidrocarburos '
        }, {
            "id": "3",
            "nombre": 'Metilformato'
        }, {
            "id": "4",
            "nombre": 'Metilal'
        }, {
            "id": "5",
            "nombre": 'CO2'
        }, {
            "id": "6",
            "nombre": 'HFC-23 '
        }, {
            "id": "7",
            "nombre": 'HFC-32 '
        }, {
            "id": "8",
            "nombre": 'HFC-125 '
        }, {
            "id": "9",
            "nombre": 'HFC-134a '
        }, {
            "id": "10",
            "nombre": 'HFC-143a '
        }, {
            "id": "11",
            "nombre": 'HFC-152a '
        }, {
            "id": "12",
            "nombre": 'HFC-227ea '
        }, {
            "id": "13",
            "nombre": 'HFC-245fa '
        }, {
            "id": "14",
            "nombre": 'HFC-365mfc '
        }, {
            "id": "15",
            "nombre": 'R-407C '
        }, {
            "id": "16",
            "nombre": 'R-407F '
        }, {
            "id": "17",
            "nombre": 'R-410A '
        }, {
            "id": "18",
            "nombre": 'R-404A '
        }],
        "Tabla22":[
            {"id":1,"aplicacion":{"id":1,"nombre":"HFC"},"alternativas":[{"id":1,"nombre":"HFC-134a "},{"id":2,"nombre":"HFC-227ea/HFC-365mfc "},{"id":3,"nombre":"HFC-32  "},{"id":4,"nombre":"HFC-152a "},{"id":5,"nombre":"HFC-245fa "}],"uso2":[{"id":1,"nombre":"Espuma: poliuretano"},{"id":2,"nombre":"Espuma: polietileno extruido"},{"id":3,"nombre":"Aerosol"},{"id":4,"nombre":"Extintores"},{"id":5,"nombre":"Solventes"}]},
            {"id":2,"aplicacion":{"id":1,"nombre":"HFC Mezclas"}, "alternativas":[{"id":1,"nombre":"R-404A "},{"id":2,"nombre":"R-407C "},{"id":3,"nombre":"R-410A "},{"id":4,"nombre":"R-507A "}],"uso2":[{"id":1,"nombre":"Espuma: poliuretano"},{"id":2,"nombre":"Espuma: polietileno extruido"},{"id":3,"nombre":"Aerosol"}, ,{"id":4,"nombre":"Extintores"},,{"id":5,"nombre":"Solventes"}]},
            {"id":3,"aplicacion":{"id":1,"nombre":"HFO"}, "alternativas":[{"id":1,"nombre":"HFO-1234yf "},{"id":2,"nombre":"HFO-1234ze "},{"id":3,"nombre":"HFO-1233zd "},{"id":4,"nombre":"HFO-1336mzzm "}],"uso2":[{"id":1,"nombre":"Espuma: poliuretano"},{"id":2,"nombre":"Espuma: polietileno extruido"},{"id":3,"nombre":"Aerosol"}, ,{"id":4,"nombre":"Extintores"},,{"id":5,"nombre":"Solventes"}]},
            {"id":4,"aplicacion":{"id":1,"nombre":"Otras alternativas"}, "alternativas":[{"id":1,"nombre":"Metil formato "},{"id":2,"nombre":"Metilal"},{"id":3,"nombre":"Etanol"},{"id":4,"nombre":"DME"},{"id":5,"nombre":"HC-290 "},{"id":6,"nombre":"HC-600a "},{"id":7,"nombre":"Pentano(C,N,I) "},{"id":8,"nombre":"R-744 "}],"uso2":[{"id":1,"nombre":"Espuma: poliuretano"},{"id":2,"nombre":"Espuma: polietileno extruido"},{"id":3,"nombre":"Aerosol"}, ,{"id":4,"nombre":"Extintores"},,{"id":5,"nombre":"Solventes"}]},
            ],
        "Tabla23":[
            {"id":1,"aplicacion":{"id":1,"nombre":"HFC"},"alternativas":[{"id":1,"nombre":"HFC-134a "},{"id":2,"nombre":"HFC-227ea/HFC-365mfc "},{"id":3,"nombre":"HFC-32  "},{"id":4,"nombre":"HFC-152a "},{"id":5,"nombre":"HFC-245fa "}]},
            {"id":2,"aplicacion":{"id":1,"nombre":"HFC Mezclas"}, "alternativas":[{"id":1,"nombre":"R-404A "},{"id":2,"nombre":"R-407C "},{"id":3,"nombre":"R-410A "},{"id":4,"nombre":"R-507A "}]},
            {"id":3,"aplicacion":{"id":1,"nombre":"HFO"}, "alternativas":[{"id":1,"nombre":"HFO-1234yf "},{"id":2,"nombre":"HFO-1234ze "},{"id":3,"nombre":"HFO-1233zd "},{"id":4,"nombre":"HFO-1336mzzm "}]},
            {"id":4,"aplicacion":{"id":1,"nombre":"Otras alternativas"}, "alternativas":[{"id":1,"nombre":"Metil formato "},{"id":2,"nombre":"Metilal"},{"id":3,"nombre":"Etanol"},{"id":4,"nombre":"DME"},{"id":5,"nombre":"HC-290 "},{"id":6,"nombre":"HC-600a "},{"id":7,"nombre":"Pentano(C,N,I) "},{"id":8,"nombre":"R-744 "}]},
        ],
        "OrgProduccion":[{"id":"1","nombre":'Brigada de trabajo fija'},{"id":"2","nombre":'Brigada de trabajo móvil'}, {"id":"3","nombre":'Individuo fijo '},{"id":"4","nombre":'Individuo móvil'}],
        "TipoRefri":[{"id":"1","nombre":'Doméstica'},{"id":"2","nombre":'Comercial'},{"id":"3","nombre":'Industrial'},{"id":"4","nombre":'Móvil (Contenedores refrigerados)'}],
        "TipoAire":[{"id":"1","nombre":'Doméstica (Ventana)'},{"id":"2","nombre":'Comercial (Split, consolas, etc)'},{"id":"3","nombre":'Acondicionado industrial (Enfriadoras de agua u otras sustancias)'},{"id":"4","nombre":'Móvil (Autos, guaguas, camiones, etc)'}],
        // "CantRefriAire":[{"id":"1","nombre":'HCFC'},{"id":"2","nombre":'HFC'},{"id":"3","nombre":'Natural'}],
        // "CantRefriRefri":[{"id":"1","nombre":'HCFC'},{"id":"2","nombre":'HFC'},{"id":"3","nombre":'Natural'}],
        "Aplicaciones8":[
            {"id":1,"aplicacion":{"id":1,"nombre":"Refrigeradores domesticos y freezers"}, "carga":{"nombre":"0.1-0.3"},"alternativas":[{"id":1,"nombre":"HFC-134a "},{"id":2,"nombre":"HC-600a"}]},
            {"id":2,"aplicacion":{"id":1,"nombre":"Sistemas de refrigeración comercial (Independiente, unidades condensadoras, y sistemas de pequeño y medio tamaño)"}, "carga":{"nombre":"0.1-200"},"alternativas":[{"id":1,"nombre":"R-404A"},{"id":2,"nombre":"HFC-134a"},{"id":3,"nombre":"HC-290"},{"id":4,"nombre":"R-407A"},{"id":5,"nombre":"R-744"}]},
            {"id":3,"aplicacion":{"id":1,"nombre":"Sistemas de distribución grande"}, "carga":{"nombre":"250-5,000"},"alternativas":[{"id":1,"nombre":"R-717"},{"id":2,"nombre":"R-507A"},{"id":3,"nombre":"R-404A"},{"id":4,"nombre":"R-744"},{"id":5,"nombre":"HCs"}]},
            {"id":4,"aplicacion":{"id":1,"nombre":"Sistemas Industriales (Chillers)"}, "carga":{"nombre":"100-2,000"},"alternativas":[{"id":1,"nombre":"HFC-134a"},{"id":2,"nombre":"R-407C"},{"id":3,"nombre":"R-410A"},{"id":4,"nombre":"R-717"},{"id":5,"nombre":"HCs"}]},
            {"id":5,"aplicacion":{"id":1,"nombre":"Transportes refrigerados (contenedores y barcos)"}, "carga":{"nombre":"1-1,000"},"alternativas":[{"id":1,"nombre":"R-404A"},{"id":2,"nombre":"HFC-134a"},{"id":3,"nombre":"R-744"},{"id":4,"nombre":"R-717"},{"id":5,"nombre":"HCs"}]}
        ],
        "Tabla2":[
            {"id":1,"aplicacion":{"id":1,"nombre":"Aerosol"},"alternativas":[{"id":1,"nombre":"Propelente"}],"uso2":[{"id":1,"nombre":"Uso Hcfc"},{"id":2,"nombre":"Uso Hfc"},{"id":3,"nombre":"Uso alternativas"}]},
            {"id":2,"aplicacion":{"id":1,"nombre":"Espuma: poliuretano "}, "alternativas":[{"id":1,"nombre":"Aislamiento de Refrigeración Doméstica"},{"id":2,"nombre":"Propelente"},{"id":3,"nombre":"Contenedores Refrigerados"},{"id":4,"nombre":"Tableros"},{"id":5,"nombre":"Panel Continuo "},{"id":6,"nombre":"Panel Discontinuo"},{"id":7,"nombre":"Espuma en Espray "},{"id":8,"nombre":"Tubería en Tubería "},{"id":9,"nombre":"Bloques"},{"id":10,"nombre":"Bloques de poliuretano "}],"uso2":[{"id":1,"nombre":"Uso Hcfc"},{"id":2,"nombre":"Uso Hfc"},{"id":3,"nombre":"Uso alternativas"}]},
            {"id":3,"aplicacion":{"id":1,"nombre":"Espuma: polietileno extruido"}, "alternativas":[{"id":1,"nombre":"-"}],"uso2":[{"id":1,"nombre":"Uso Hcfc"},{"id":2,"nombre":"Uso Hfc"},{"id":3,"nombre":"Uso alternativas"}]},
            {"id":4,"aplicacion":{"id":1,"nombre":"Extintores"}, "alternativas":[{"id":1,"nombre":"Ninguno"}],"uso2":[{"id":1,"nombre":"Uso Hcfc"},{"id":2,"nombre":"Uso Hfc"},{"id":3,"nombre":"Uso alternativas"}]},
            {"id":5,"aplicacion":{"id":1,"nombre":"Refrigeración"}, "alternativas":[{"id":1,"nombre":"Refrigeradores domésticos y Freezers/ Otras aplicaciones"},{"id":2,"nombre":"Refrigeración Comercial"},{"id":3,"nombre":"Equipos Autónomos"},{"id":4,"nombre":"Unidades Condensadoras"},{"id":5,"nombre":"Sistemas Centralizados"},{"id":6,"nombre":"Transporte"}],"uso2":[{"id":1,"nombre":"Uso Hcfc"},{"id":2,"nombre":"Uso Hfc"},{"id":3,"nombre":"Uso alternativas"}]},
            {"id":6,"aplicacion":{"id":1,"nombre":"Refrigeración: Aire Acondicionado automotriz"}, "alternativas":[{"id":1,"nombre":"Automóviles, Transporte Público"}],"uso2":[{"id":1,"nombre":"Uso Hcfc"},{"id":2,"nombre":"Uso Hfc"},{"id":3,"nombre":"Uso alternativas"}]},
            {"id":7,"aplicacion":{"id":1,"nombre":"Refrigeración: chillers "}, "alternativas":[{"id":1,"nombre":"Desplazamiento Positivo"},{"id":2,"nombre":"Centrífugo"}],"uso2":[{"id":1,"nombre":"Uso Hcfc"},{"id":2,"nombre":"Uso Hfc"},{"id":3,"nombre":"Uso alternativas"}]},
            {"id":8,"aplicacion":{"id":1,"nombre":"Acondicionadores de Aire"}, "alternativas":[{"id":1,"nombre":"Pequeño Autónomo"},{"id":2,"nombre":"Mini-split "},{"id":3,"nombre":"Multi-split "},{"id":4,"nombre":"Split comercial con conductos"}],"uso2":[{"id":1,"nombre":"Uso Hcfc"},{"id":2,"nombre":"Uso Hfc"},{"id":3,"nombre":"Uso alternativas"}]},
            {"id":9,"aplicacion":{"id":1,"nombre":"Solventes"}, "alternativas":[{"id":1,"nombre":"- "}],"uso2":[{"id":1,"nombre":"Uso Hcfc"},{"id":2,"nombre":"Uso Hfc"},{"id":3,"nombre":"Uso alternativas"}]},
        ],
        // "SustanciasTabla3":[{"id":"1","nombre":'Refrigerantes-Hidrocarburos'},{"id":"2","nombre":'Agente de expansión-Hidrocarburos '}, {"id":"3","nombre":'Metilformato'},{"id":"4","nombre":'Metilal'},{"id":"5","nombre":'CO2'},{"id":"6","nombre":'HFC-23 '},{"id":"7","nombre":'HFC-32 '},{"id":"8","nombre":'HFC-125 '},{"id":"9","nombre":'HFC-134a '},{"id":"10","nombre":'HFC-143a '},{"id":"11","nombre":'HFC-152a '},{"id":"12","nombre":'HFC-227ea '},{"id":"13","nombre":'HFC-245fa '},{"id":"14","nombre":'HFC-365mfc '},{"id":"15","nombre":'R-407C '},{"id":"16","nombre":'R-407F '},{"id":"17","nombre":'R-410A '},{"id":"18","nombre":'R-404A '}],
        "SustanciasTabla3":[{"id":"1","nombre":'HCFC-141b '},{"id":"2","nombre":'HCFC-142b '}, {"id":"3","nombre":'HCFC-22 '},{"id":"4","nombre":'HCFC-245a '},{"id":"5","nombre":'HFC-365mfc/HFC-227ea '},{"id":"6","nombre":'HFC-134a/HFC-152a '},{"id":"7","nombre":'HFO/HCFO '},{"id":"8","nombre":'Hidrocarburos'},{"id":"9","nombre":'Otros'}],
        "SubsectorTabla4":[{"id":"1","nombre":'Aislamiento de Refrigeración Doméstica'}, {"id":"2","nombre":'Aislamiento en otra aplicación'}, {"id":"3","nombre":'Contenedores Refrigerados'},{"id":"4","nombre":'Tableros'},{"id":"5","nombre":'Panel Continuo'},{"id":"6","nombre":'Panel Discontinuo'},{"id":"7","nombre":'Espuma en espray'},{"id":"8","nombre":'Tubería en tubería'},{"id":"9","nombre":'Bloques '},{"id":"10","nombre":'Bloques de Poliuretano'},{"id":"11","nombre":'Espuma: polietileno extruido '}],
        "Tabla5":[
            {"id":1,"aplicacion":{"id":1,"nombre":"Espuma rígida de poliuretano "},"alternativas":[{"id":1,"nombre":"HFC-245fa "},{"id":2,"nombre":"HFC-365mfc/HFC-227ea "},{"id":3,"nombre":"Pentano (C,I,N) "},{"id":4,"nombre":"Metil formato "},{"id":5,"nombre":"HFO-1233zd "},{"id":6,"nombre":"HFO-1336mzz "},{"id":7,"nombre":"CO2 "}]},
            {"id":2,"aplicacion":{"id":1,"nombre":"Espuma en espray "},"alternativas":[{"id":1,"nombre":"HFC-245fa "},{"id":2,"nombre":"HFC-365mfc/HFC-227ea "},{"id":3,"nombre":"HFO-1233zd"},{"id":4,"nombre":"HFO-1336mzz "},{"id":5,"nombre":"CO2 "},{"id":6,"nombre":"Supercrítico CO2"}]},
            {"id":3,"aplicacion":{"id":1,"nombre":"Piel Integral y espuma flexible moldeada "},"alternativas":[{"id":1,"nombre":"HFC-134a "},{"id":2,"nombre":"HFC-245fa"},{"id":3,"nombre":"Metil formato "},{"id":4,"nombre":"Metilal"},{"id":5,"nombre":"CO2 "}]},
            {"id":4,"aplicacion":{"id":1,"nombre":"Espumas de poliestireno extruido"},"alternativas":[{"id":1,"nombre":"HFC-134a "},{"id":2,"nombre":"HFC-152a "},{"id":3,"nombre":"HFO-1234ze "},{"id":4,"nombre":"CO2"},{"id":5,"nombre":"CO2/etanol "}]},
           ],
        "SubsectorTabla7":[{"id":"1","nombre":'Aire Acondicionado Automotriz'}, {"id":"2","nombre":'Domestica'}, {"id":"3","nombre":'Commercial '},{"id":"4","nombre":'Industrial'},{"id":"5","nombre":'Transporte'},{"id":"6","nombre":'Aire Acondicionado estacionario'}],
        "Tabla9":[
            {"id":1,"aplicacion":{"id":1,"nombre":"Aire acondicionado de Habitaciones (incluidos pequeños aire acondicionado split)"}, "carga":{"nombre":"0.2-3"},"alternativas":[{"id":1,"nombre":"R-410A "},{"id":2,"nombre":"R-407C "},{"id":3,"nombre":"HFC-32 "},{"id":4,"nombre":"HC-290"}]},
            {"id":2,"aplicacion":{"id":1,"nombre":"Otros Aires Acondicionados (incluyendo splits, multi-splits y sistemas de flujo de refrigerante variable, conductos y paquetes de azotea) "}, "carga":{"nombre":"3-100 "},"alternativas":[{"id":1,"nombre":"R-410A "},{"id":2,"nombre":"R-407C "},{"id":3,"nombre":"R-32 "},{"id":4,"nombre":"HC-290 "},{"id":5,"nombre":"CO2"}]},
            {"id":3,"aplicacion":{"id":1,"nombre":"Chillers (pequeños, medianos y grandes enfriados por agua)"}, "carga":{"nombre":"500-13,000"},"alternativas":[{"id":1,"nombre":"R-407C "},{"id":2,"nombre":"R-410A "},{"id":3,"nombre":"HC-290 "},{"id":4,"nombre":"HC-1270 "},{"id":5,"nombre":"HFC-134a  "},{"id":6,"nombre":"HFC-32 "},{"id":7,"nombre":"R-717 "}]},
            // {"id":4,"aplicacion":{"id":1,"nombre":"Bombas de Calor (calefacción de locales por bombas de calor (aire-agua) y bomba de calor domestica de agua caliente enfriada por aire"}, "carga":{"nombre":"3-6"},"alternativas":[{"id":1,"nombre":"R-410A "},{"id":2,"nombre":"R-744 "},{"id":3,"nombre":"HFC-134a "}]},
            // {"id":5,"aplicacion":{"id":1,"nombre":"Gran sistema de calefacción urbana"}, "carga":{"nombre":"250-7,000 "},"alternativas":[{"id":1,"nombre":"HFC-134a "},{"id":2,"nombre":"R-717 "}]}
        ],
        // "Tabla12":[
        //     {"id":1,"aplicacion":{"id":1,"nombre":"Espuma rigida de pouliretano "},"alternativas":[{"id":1,"nombre":"HFC-245fa "},{"id":2,"nombre":"HFC-365mfc/HFC-227ea "},{"id":3,"nombre":"Pentano (C,I,N) "},{"id":4,"nombre":"Metil formato "},{"id":5,"nombre":"HFO-1233zd "},{"id":6,"nombre":"HFO-1336mzz "},{"id":7,"nombre":"CO2 "}]},
        //     {"id":2,"aplicacion":{"id":1,"nombre":"Espuma en espray "},"alternativas":[{"id":1,"nombre":"HFC-245fa "},{"id":2,"nombre":"HFC-365mfc/HFC-227ea "},{"id":3,"nombre":"HFO-1233zd"},{"id":4,"nombre":"HFO-1336mzz "},{"id":5,"nombre":"CO2 "},{"id":6,"nombre":"Supercrítico CO2"}]},
        //     {"id":3,"aplicacion":{"id":1,"nombre":"Piel Integral y espuma flexible moldeada "},"alternativas":[{"id":1,"nombre":"HFC-134a "},{"id":2,"nombre":"HFC-245fa"},{"id":3,"nombre":"Metil formato "},{"id":4,"nombre":"Metilal"},{"id":5,"nombre":"CO2 "}]},
        //     {"id":4,"aplicacion":{"id":1,"nombre":"Espumas de poliestireno extruido"},"alternativas":[{"id":1,"nombre":"HFC-134a "},{"id":2,"nombre":"HFC-152a "},{"id":3,"nombre":"HFO-1234ze "},{"id":4,"nombre":"CO2"},{"id":5,"nombre":"CO2/etanol "}]},
        // ],
        "Tabla12":[
            {"id":1,"aplicacion":{"id":1,"nombre":"Técnico/aerosol para consumidor"},"alternativas":[{"id":1,"nombre":"HFC-134a"},{"id":2,"nombre":"HFC-152a"},{"id":3,"nombre":"HFC-227ea "},{"id":4,"nombre":"Hidrocarburos"},{"id":5,"nombre":"DME "},{"id":6,"nombre":"HFO-1234ze"},{"id":7,"nombre":"CO2/N2/Air "},{"id":8,"nombre":"N2O "},{"id":9,"nombre":"No en un tipo de tecnolgia"}]},
            {"id":2,"aplicacion":{"id":1,"nombre":"MDI"},"alternativas":[{"id":1,"nombre":"HFC-134a "},{"id":2,"nombre":"HFC-227ea "}]},
        ],
        "SustanciasTabla6":[{"id":"1","nombre":'HFC-134a'}, {"id":"2","nombre":'R-404A/R-507 '}, {"id":"3","nombre":'R-407C  '},{"id":"4","nombre":'R-410A '},{"id":"5","nombre":'Otros de Bajo-GWP '}],
        "Tabla3Anexo2":[
            {"id":1,"aplicacion":{"id":1,"nombre":"HFC"}, "refriAire":[{"id":1,"nombre":"Fabricación"}, {"id":2,"nombre":"Servicio"}],"alternativas":[{"id":1,"nombre":"HFC-134a"},{"id":2,"nombre":"HFC-32"},{"id":3,"nombre":"HFC-152a "},{"id":4,"nombre":"HFC-245fa"},{"id":5,"nombre":"HFC-227ea/HFC-365mfc"}],"sectores":[{"id":1,"nombre":"Espuma: poliuretano"},{"id":2,"nombre":"Espuma: polietileno extruido"},{"id":3,"nombre":"Aerosol"},{"id":4,"nombre":"Extintores"},{"id":5,"nombre":"Solventes"},{"id":6,"nombre":"Otros"}]},
            {"id":2,"aplicacion":{"id":1,"nombre":"HFC Mezclas"}, "refriAire":[{"id":1,"nombre":"Fabricación"}, {"id":2,"nombre":"Servicio"}],"alternativas":[{"id":1,"nombre":"R-404A "},{"id":2,"nombre":"R-407C "},{"id":3,"nombre":"R-410A "},{"id":4,"nombre":"R-507A "}],"sectores":[{"id":1,"nombre":"Espuma: poliuretano"},{"id":2,"nombre":"Espuma: polietileno extruido"},{"id":3,"nombre":"Aerosol"},{"id":4,"nombre":"Extintores"},{"id":5,"nombre":"Solventes"},{"id":6,"nombre":"Otros"}]},
            {"id":3,"aplicacion":{"id":1,"nombre":"HFO"}, "refriAire":[{"id":1,"nombre":"Fabricación"}, {"id":2,"nombre":"Servicio"}],"alternativas":[{"id":1,"nombre":"HFO-1234yf "},{"id":2,"nombre":"HFO-1234ze "},{"id":3,"nombre":"HFO-1233zd  "},{"id":4,"nombre":"HFO-1336mzzm "}],"sectores":[{"id":1,"nombre":"Espuma: poliuretano"},{"id":2,"nombre":"Espuma: polietileno extruido"},{"id":3,"nombre":"Aerosol"},{"id":4,"nombre":"Extintores"},{"id":5,"nombre":"Solventes"},{"id":6,"nombre":"Otros"}]},
            {"id":4,"aplicacion":{"id":1,"nombre":"Otras alternativas"}, "refriAire":[{"id":1,"nombre":"Fabricación"}, {"id":2,"nombre":"Servicio"}],"alternativas":[{"id":1,"nombre":"Metil formato"},{"id":2,"nombre":"Metilal"},{"id":3,"nombre":"Etanol"},{"id":4,"nombre":"DME"},{"id":5,"nombre":"HC-290 "},{"id":6,"nombre":"HC-600a "},{"id":7,"nombre":"R-744 "},{"id":8,"nombre":"R-717"},{"id":6,"nombre":"HC-600a "},{"id":6,"nombre":"HC-600a "}],"sectores":[{"id":1,"nombre":"Espuma: poliuretano"},{"id":2,"nombre":"Espuma: polietileno extruido"},{"id":3,"nombre":"Aerosol"},{"id":4,"nombre":"Extintores"},{"id":5,"nombre":"Solventes"},{"id":6,"nombre":"Otros"}]},
        ],
        "Tabla11A":[
            {"id":1,"aplicacion":{"id":1,"nombre":"Pequeño autónomo (AAV)"}, "carga":{"nombre":"2-7/1.32-4.63","min":0, "max":7},"alternativas":[{"id":1,"nombre":"R-410A"},{"id":2,"nombre":"R-407C"},{"id":3,"nombre":"HFC-32"},{"id":4,"nombre":"HC-290"}]},
            {"id":2,"aplicacion":{"id":1,"nombre":"Pequeño autónomo (Portátil)"}, "carga":{"nombre":"2-7/1.32-4.63","min":0, "max":0},"alternativas":[{"id":1,"nombre":"R-410A"},{"id":2,"nombre":"R-407C"},{"id":3,"nombre":"HFC-32"},{"id":4,"nombre":"HC-290"}]},
            {"id":3,"aplicacion":{"id":1,"nombre":"Pequeño autónomo (Deshumidificadores)"}, "carga":{"nombre":"2-7/1.32-4.63","min":0, "max":0},"alternativas":[{"id":1,"nombre":"R-410A"},{"id":2,"nombre":"R-407C"},{"id":3,"nombre":"HFC-32"},{"id":4,"nombre":"HC-290"}]},
            {"id":4,"aplicacion":{"id":1,"nombre":"Mini Split (Cassete)"}, "carga":{"nombre":"2-12/1.32-7.94","min":0, "max":0},"alternativas":[{"id":1,"nombre":"R-410A"},{"id":2,"nombre":"R-407C "},{"id":3,"nombre":"R-32 "},{"id":4,"nombre":"R-290"}]},
            {"id":5,"aplicacion":{"id":1,"nombre":"Mini Split (Ocultos)"}, "carga":{"nombre":"2-12/1.32-7.94","min":0, "max":0},"alternativas":[{"id":1,"nombre":"R-410A"},{"id":2,"nombre":"R-407C "},{"id":3,"nombre":"R-32 "},{"id":4,"nombre":"R-290"}]},
            {"id":6,"aplicacion":{"id":1,"nombre":"Mini Split (Otros)"}, "carga":{"nombre":"2-12/1.32-7.94","min":0, "max":0},"alternativas":[{"id":1,"nombre":"R-410A"},{"id":2,"nombre":"R-407C "},{"id":3,"nombre":"R-32 "},{"id":4,"nombre":"R-290"}]},
            {"id":7,"aplicacion":{"id":1,"nombre":"Split"}, "carga":{"nombre":"10-150/6.62-99.33","min":0, "max":0},"alternativas":[{"id":1,"nombre":"R-407C "},{"id":2,"nombre":"R-410A"},{"id":3,"nombre":"R-32 "}]},
            {"id":8,"aplicacion":{"id":1,"nombre":"Multi-split "}, "carga":{"nombre":"10-150/6.62-99.33","min":0, "max":0},"alternativas":[{"id":1,"nombre":"R-407C"},{"id":2,"nombre":"R-410A"},{"id":3,"nombre":"R-32 "}]},
            {"id":9,"aplicacion":{"id":1,"nombre":"Sistemas de flujo de refrigerante variable"}, "carga":{"nombre":"10-150/6.62-99.33","min":0, "max":0},"alternativas":[{"id":1,"nombre":"R-407C"},{"id":2,"nombre":"R-410A"},{"id":3,"nombre":"R-32 "}]},
            {"id":10,"aplicacion":{"id":1,"nombre":"Consolas"}, "carga":{"nombre":"12-200/7.94-132.45","min":0, "max":0},"alternativas":[{"id":1,"nombre":"R-407C "},{"id":2,"nombre":"R-410A "},{"id":3,"nombre":"CO2 "}]},
            {"id":11,"aplicacion":{"id":1,"nombre":"Rooftop"}, "carga":{"nombre":"12-200/7.94-132.45","min":0, "max":0},"alternativas":[{"id":1,"nombre":"R-407C "},{"id":2,"nombre":"R-410A "},{"id":3,"nombre":"CO2 "}]},
            {"id":12,"aplicacion":{"id":1,"nombre":"Chillers pequeños "}, "carga":{"nombre":"50-750/33.11-496.68","min":0, "max":0},"alternativas":[{"id":1,"nombre":"R-407C "},{"id":2,"nombre":"R-410A "},{"id":3,"nombre":"HC-290 "},{"id":4,"nombre":"HC-1270 "}]},
            {"id":13,"aplicacion":{"id":1,"nombre":"Chillers medianos enfriados por agua "}, "carga":{"nombre":"50-750/33.11-496.68","min":0, "max":0},"alternativas":[{"id":1,"nombre":"R-407C "},{"id":2,"nombre":"R-410A "},{"id":3,"nombre":"HC-290 "},{"id":4,"nombre":"HC-1270 "}]},
            {"id":14,"aplicacion":{"id":1,"nombre":"Chillers grandes enfriados por agua "}, "carga":{"nombre":"750-10,000/496.68-6622.51 ","min":0, "max":0},"alternativas":[{"id":1,"nombre":"R-407C "},{"id":2,"nombre":"R-410A "},{"id":3,"nombre":"HFC-134a  "},{"id":4,"nombre":"HFC-32  "},{"id":5,"nombre":"R-717 "}]},
            {"id":15,"aplicacion":{"id":1,"nombre":"Aire Acondicionado en autos y pequeños vans"}, "carga":{"nombre":"3-5/1.98-3.31","min":0, "max":0},"alternativas":[{"id":1,"nombre":"HFO-1234yf"},{"id":2,"nombre":"HFC-134a "}]},
            {"id":16,"aplicacion":{"id":1,"nombre":"Aire Acondicionado en CAMIONES REFERENCIA A CABINAS"}, "carga":{"nombre":"3-5/1.98-3.31","min":0, "max":0},"alternativas":[{"id":1,"nombre":"HFO-1234yf"},{"id":2,"nombre":"HFC-134a "}]},
            {"id":17,"aplicacion":{"id":1,"nombre":"Aire Acondicionado en TRACTORES REFERENCIA A CABINAS"}, "carga":{"nombre":"3-5/1.98-3.31","min":0, "max":0},"alternativas":[{"id":1,"nombre":"HFO-1234yf"},{"id":2,"nombre":"HFC-134a "}]},
            {"id":18,"aplicacion":{"id":1,"nombre":"Aire Acondicionado en Grandes vehículos (OMNIBUS)"}, "carga":{"nombre":"10-30/6.62-19.86","min":0, "max":0},"alternativas":[{"id":1,"nombre":"R-407C "},{"id":2,"nombre":"R-410A "},{"id":3,"nombre":"HFC-134a"}]},
            {"id":19,"aplicacion":{"id":1,"nombre":"Aire Acondicionado en Grandes vehículos (MINIOMNIBUS)"}, "carga":{"nombre":"10-30/6.62-19.86","min":0, "max":0},"alternativas":[{"id":1,"nombre":"R-407C "},{"id":2,"nombre":"R-410A "},{"id":3,"nombre":"HFC-134a"}]},
            {"id":20,"aplicacion":{"id":1,"nombre":"Aire Acondicionado en Grandes vehículos (TRENES)"}, "carga":{"nombre":"10-30/6.62-19.86","min":0, "max":0},"alternativas":[{"id":1,"nombre":"R-407C "},{"id":2,"nombre":"R-410A "},{"id":3,"nombre":"HFC-134a"}]},
            // {"id":21,"aplicacion":{"id":1,"nombre":"Refrigeradores domésticos"}, "carga":{"nombre":"0.1-0.5/0.06-0.33","min":0, "max":0},"alternativas":[{"id":1,"nombre":"HFC-134a"},{"id":2,"nombre":"R-600a "}]},
            // {"id":22,"aplicacion":{"id":1,"nombre":"Refrigeradores freezer"}, "carga":{"nombre":"0.1-0.5/0.06-0.33","min":0, "max":0},"alternativas":[{"id":1,"nombre":"HFC-134a"},{"id":2,"nombre":"R-600a "}]},
            // {"id":23,"aplicacion":{"id":1,"nombre":"Los equipos autónomos de refrigeración comercial"}, "carga":{"nombre":"0.1-1,000/0.06-662.25","min":0, "max":0},"alternativas":[{"id":1,"nombre":"HFC-134a"},{"id":2,"nombre":"R-404A "},{"id":3,"nombre":"HC-290 "}]},
            ],
        "Tabla11B":[
            {"id":1,"aplicacion":{"id":1,"nombre":"Refrigeradores domésticos"}, "carga":{"nombre":"0.1-0.5/0.06-0.33","min":0, "max":0},"alternativas":[{"id":1,"nombre":"HFC-134a"},{"id":2,"nombre":"R-600a "}]},
            {"id":2,"aplicacion":{"id":1,"nombre":"Refrigeradores freezer"}, "carga":{"nombre":"0.1-0.5/0.06-0.33","min":0, "max":0},"alternativas":[{"id":1,"nombre":"HFC-134a"},{"id":2,"nombre":"R-600a "}]},
            {"id":3,"aplicacion":{"id":1,"nombre":"Los equipos autónomos de refrigeración comercial"}, "carga":{"nombre":"0.1-1,000/0.06-662.25","min":0, "max":0},"alternativas":[{"id":1,"nombre":"HFC-134a"},{"id":2,"nombre":"R-404A "},{"id":3,"nombre":"HC-290 "}]},
            {"id":4,"aplicacion":{"id":1,"nombre":"Los grandes sistemas de refrigeración industrial"}, "carga":{"nombre":"100-5,000/66.22-3311.25 (poner 50)","min":0, "max":0},"alternativas":[{"id":1,"nombre":"R-717 "},{"id":2,"nombre":"R-404A "},{"id":3,"nombre":"R-507A "},{"id":4,"nombre":"HCs "}]},
            {"id":5,"aplicacion":{"id":1,"nombre":"Sistemas de Chiller Industrial "}, "carga":{"nombre":"200-5,000/132.45-3311.25 ","min":0, "max":0},"alternativas":[{"id":1,"nombre":"R-407C "},{"id":2,"nombre":"R-410A "},{"id":3,"nombre":"HFC-134a"},{"id":4,"nombre":"R-717"},{"id":5,"nombre":"HCs"}]},
            {"id":6,"aplicacion":{"id":1,"nombre":"Vehículos de carretera refrigerados en el sector del transporte refrigerado"}, "carga":{"nombre":"3-10/1.98-6.62","min":0, "max":0},"alternativas":[{"id":1,"nombre":"HFC-134a"},{"id":2,"nombre":"R-404A "}]},
            {"id":7,"aplicacion":{"id":1,"nombre":"Los contenedores refrigerados en  el transporte (estaticos)"}, "carga":{"nombre":"5-15/3.31-9.93","min":0, "max":0,},"alternativas":[{"id":1,"nombre":"HFC-134a"},{"id":2,"nombre":"R-404A "},{"id":3,"nombre":"R-744"}]},
            {"id":8,"aplicacion":{"id":1,"nombre":"Sistemas de refrigeración por barcos"}, "carga":{"nombre":"40-2000/26.49-1324.50 ","min":0, "max":0},"alternativas":[{"id":1,"nombre":"HFC-134a"},{"id":2,"nombre":"R-404A "},{"id":3,"nombre":"R-717 "}]},
            ],
        "Tabla10A":[
            {"id":1,"aplicacion":{"id":1,"nombre":"Carros y pequeños vans"}, "carga":{"nombre":"0.4-0.8 "},"alternativas":[{"id":1,"nombre":"HFC-134a"},{"id":2,"nombre":"HFO-1234yf "}]},
            {"id":2,"aplicacion":{"id":1,"nombre":" Vehículos grandes"}, "carga":{"nombre":"2.0-10.0 "},"alternativas":[{"id":1,"nombre":"HFC-134a"},{"id":2,"nombre":"R-410A"},{"id":3,"nombre":"R-407C "}]},
        ],
        "Tabla10B":[
            {"id":1,"aplicacion":{"id":1,"nombre":"Camiones y Rastras Refrigeradas"},"alternativas":[{"id":1,"nombre":"HFC-404A"},{"id":2,"nombre":"HFO-1234ze"}]},
            {"id":2,"aplicacion":{"id":1,"nombre":"Contenedores Refrigerados"},"alternativas":[{"id":1,"nombre":"HFC-404A"},{"id":2,"nombre":"HFO-1234ze"}]},
            ],
        "Tabla13":[
            {"id":1,"aplicacion":{"id":1,"nombre":"Limpieza de Metales"},"alternativas":[{"id":1,"nombre":"HFC"},{"id":2,"nombre":"HFE"},{"id":3,"nombre":"No en un tipo de tecnolgía"}]},
            {"id":2,"aplicacion":{"id":1,"nombre":"Limpieza para la electrónica"},"alternativas":[{"id":1,"nombre":"HFC"},{"id":2,"nombre":"HFE"},{"id":3,"nombre":"No en un tipo de tecnolgía"}]},
            {"id":3,"aplicacion":{"id":1,"nombre":"Limpieza de precisión"},"alternativas":[{"id":1,"nombre":"HFC"},{"id":2,"nombre":"HFE"},{"id":3,"nombre":"No en un tipo de tecnolgía"}]},
           ],
        "Taller":[
            {"id":1,"aplicacion":{"id":1,"nombre":"Limpieza de Metales"},"alternativas":[{"id":1,"nombre":"HFC"},{"id":2,"nombre":"HFE"},{"id":3,"nombre":"No en un tipo de tecnolgía"}]},
            {"id":2,"aplicacion":{"id":1,"nombre":"Limpieza para la electrónica"},"alternativas":[{"id":1,"nombre":"HFC"},{"id":2,"nombre":"HFE"},{"id":3,"nombre":"No en un tipo de tecnolgía"}]},
            {"id":3,"aplicacion":{"id":1,"nombre":"Limpieza de precisión"},"alternativas":[{"id":1,"nombre":"HFC"},{"id":2,"nombre":"HFE"},{"id":3,"nombre":"No en un tipo de tecnolgía"}]},
        ],
        "Clasificacion":[{"nombre":"Aire Acondicionado Automotriz"},{"nombre":"Doméstica"},{"nombre":"Comercial"},{"nombre":"Industrial"},{"nombre":"Transporte"},{"nombre":"Aire Acondicionado estacionario"}],
        "ClasificacionRefri":[{"nombre":"Doméstica"},{"nombre":"Comercial"},{"nombre":"Industrial"},{"nombre":"Transporte"}],
        "Estado":[{"nombre":"Bueno"},{"nombre":"Malo"},{"nombre":"No reparable"}],
        "EstadoRefri":[{"nombre":"Bueno"},{"nombre":"Malo"},{"nombre":"No reparable"}]
    }
})
    .factory('SType',function () {
        return {
            "general":["general1","general2","general3"],
            "espuma":["espuma1","espuma2","espuma3"],
            "aire":["aire1","aire2","aire3"],
            "refri":["refri","consumo"],
            "aerosoles":["aerosoles"],
            "solventes":["empresa3"],
            "importaciones":["importaciones1","importaciones1","importaciones1"],
            "empresa":["empresa1","empresa2"]
        };
    })
//.factory('SType',function () {
//        return {
//            "general":["general1","general2","general3"],
//            "espuma":["espuma1","espuma2","espuma3"],
//            "aire":["aire1","aire2","aire3"],
//            "refri":["refri1","consumo"],
//            "aerosoles":["aerosoles"],
//            "importaciones":["importaciones1","importaciones1","importaciones1"],
//            "empresa":["empresa1","empresa2","empresa3"]
//        };
//    })
.factory('Columns',function () {
    return        [
        // "general":["provincia","ministerio","osde","empresa"],

        {"fields":["sustancia", "sector"],"nombre":"Uso general de alternativas a las SAO en la actualidad","tipo":"general1"},
        {"fields":["Alternativa", "Tipo", "Sector", "ra"],"nombre":"Resumen de su uso en todos los sectores para cada año entre 2011-2015", "tipo":"general2"},
        {"fields":["Alternativa", "Tipo", "Importaciones"],"nombre":"Cantidad de importaciones de alternativas de ODS", "tipo":"importaciones2"},
        {"fields":["Sustancia", "Uso"],"nombre":"Demanda de SAO y agentes espumante en el sector de espuma","tipo":"espuma1"},
        {"fields":["Subsector", "Uso"],"nombre":"Distribución de ODS y alternativas en subsector de espuma","tipo":"espuma2"},
        {"fields":["Sustancia", "Uso"],"nombre":"Demanda de SAO y refrigerantes alternativos de SAO","tipo":"importaciones1"},
        {"fields":["Subsector","Alternativa", "Uso" ],"nombre":"Recolección de datos sobre el uso de alternativas de SAO en el sector de espumas de poliuretano y polietileno extruido", "tipo":"espuma3"},
        // {"fields":["Alternativa","Alternativas", "Uso" ],"nombre":"Cantidad de importaciones de alternativas de ODS", "tipo":"importaciones2"},
        {"fields":["Aplicaciones","Alternativas", "Uso" ],"nombre":"Recolección de datos sobre el uso de alternativas de SAO en el sector de aerosoles ", "tipo":"aerosoles"},
        {"fields":["Aplicaciones","Alternativas", "Uso" ],"nombre":"Recolección de datos en el uso de alternativas de SAO en Refrigeracion Móvil ", "tipo":"empresa2"},
        {"fields":["Aplicaciones","Alternativas", "Uso" ],"nombre":"La recolección de datos sobre el uso de alternativas de SAO en el sector de solventes", "tipo":"empresa3"},
        {"fields":["Subsector", "Uso"],"nombre":"Distribución de SAO y alternativas de SAO en el sector de la Refrigeración y el Aire Acondicionado","tipo":"aire1"},
        {"fields":["Aplicaciones", "Carga", "Alternativas", "Uso" ],"nombre":"Recolección de datos sobre el uso de alternativas de SAO en la fabricación de aires acondicionados", "tipo":"aire2"},
        {"fields":["Aplicaciones", "Carga", "Alternativas", "Uso" ],"nombre":"Consumo  de SAO (Refrigerantes) y sus alternativas en el subsector de manufactura", "tipo":"consumo"},
        {"fields":["Aplicaciones", "Carga", "Alternativas", "Uso" ],"nombre":"Recolección de datos en el uso de alternativas de SAO en Aire Acondicionado Automotriz", "tipo":"empresa1"},
        {"fields":["Aplicaciones", "Sustancias", "unidades","Capacidad", "Uso" ],"nombre":"Recolección de datos sobre el uso de alternativas de SAO en el servicio de equipos de refrigeración", "tipo":"refri"},
        {"fields":["Aplicaciones", "Sustancias", "unidades", "Capacidad", "Uso" ],"nombre":"Recolección de datos sobre el uso de alternativas de SAO en el servicio de equipos de aire acondicionado", "tipo":"aire3"},
        {"fields":["Sector", "Subsector", "Alternativa"],"nombre":"Sectores y subsectores donde se usan alternativas de ODS actualmente", "tipo":"general3"},
        {"fields":["Organizacion", "SustanciaRefrigerante", "TipoRefrigeracion", 'SustanciaAire','TipoAire','nombreTaller'],"nombre":"Taller de servicios", "tipo":"empresa4"}

    ];
})
.factory('Util', function() {
    return {

        /**
         * Fusiona 2 objetos
         * @returns {{}}
         */
        "collect": function() {
            var ret = {};
            var len = arguments.length;
            for (var i = 0; i < len; i++) {
                for (p in arguments[i]) {
                    if (arguments[i].hasOwnProperty(p)) {
                        ret[p] = arguments[i][p];
                    }
                }
            }
            return ret;
        }
    };
})
.factory("modalsTemplate", function() {
    return {
        "general1": "general1",
        "general2": "general2"
    }
})
.factory("Menu", function() {
    return {
        "nombre": "SAO",
        "items": [{
            "nombre": "general",
            "items": [{
                "nombre": "general1",
                "items": []
            }, {
                "nombre": "general2",
                "items": []
            }]
        }, {
            "nombre": "espuma",
            "items": [{
                "nombre": "espuma1",
                "items": []
            }, {
                "nombre": "espuma2",
                "items": []
            }]
        }]
    }

    ;
})
.factory("SubMenu", function() {
        return {
            "display": "SAO",
            "children": [{
                "display": "general",
                "children": [{
                    "display": "general1",
                    "children": []
                }, {
                    "display": "general2",
                    "children": []
                }]
            }, {
                "display": "espuma",
                "children": [{
                    "display": "espuma1",
                    "children": []
                }, {
                    "display": "espuma2",
                    "children": []
                }]
            }]
        }

            ;
    })
.factory('RecursionHelper', ['$compile',
    function($compile) {
        return {
            /**
             * Manually compiles the element, fixing the recursion loop.
             * @param element
             * @param [link] A post-link function, or an object with function(s) registered via pre and post properties.
             * @returns An object containing the linking functions.
             */
            compile: function(element, link) {
                // Normalize the link parameter
                if (angular.isFunction(link)) {
                    link = {
                        post: link
                    };
                }

                // Break the recursion loop by removing the contents
                var contents = element.contents().remove();
                var compiledContents;
                return {
                    pre: (link && link.pre) ? link.pre : null,
                    /**
                     * Compiles and re-adds the contents
                     */
                    post: function(scope, element) {
                        // Compile the contents
                        if (!compiledContents) {
                            compiledContents = $compile(contents);
                        }
                        // Re-add the compiled contents to the element
                        compiledContents(scope, function(clone) {
                            element.append(clone);
                        });

                        // Call the post-linking function, if any
                        if (link && link.post) {
                            link.post.apply(null, arguments);
                        }
                    }
                };
            }
        };
    }
])
    .factory('ModelValidator',function()
    {
        var validator = {};
        var pass = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,72}$/;
        var username = /^[a-z][a-z0-9\.]{3,15}$/i;
        var str = /^[a-z][a-z0-9\.]{3,15}$/i;
        //var nomenclature = /^[A-Z][a-z\s][(A-Z)]{3,20}$/i;
        var nomenclature = /^[\w() -]{3,100}$/;

        validator.isValidUser = function(user){


            return pass.test(user.password) && username.test(user.username);
        };

        validator.UserError = function (user) {
            var errors = [];
            if (!pass.test(user.password))
            {
                errors.push('password');
            }

            if (!username.test(user.username))
            {
                errors.push('username');
            }
            return errors;
        };


        validator.isValidNomenclature = function (str) {
            return nomenclature.test(str.nombre);
        };

        validator.RecordError = function (record) {
        var errors = [];
        switch (record.tipo){
            case 'empresa4':
                if(!str.test(record.nombreTaller)){

                    errors.push('taller');
                }
                if(Object.prototype.toString.call( record.municipio ) === '[object Object]'){
                    if(!str.test(record.municipio.nombre)){
                        errors.push('municipio');
                    }
                }
                else
                    {

                    if(!str.test(record.municipio)){
                        errors.push('municipio');
                    }
                }

                break;
            case 'general':

                if(!str.test(record.osde)){
                    errors.push('osde');
                }
                if(!str.test(record.empresa)){
                    errors.push('empresa');
                }
                break;

            default:
                break;

        }

        return errors;
    };

        return validator;
    })
    .
    factory("SHA256",function () {
        return  CryptoJS.SHA256;
    })

;
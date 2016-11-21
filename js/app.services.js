angular.module('app.router').

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
        else
        {
            return db.get(query,options!=undefined?options:{});
        }

    };

    /**
     * Save to file
     */
    manager.flush  = function () {
        db.allDocs({
            include_docs: true
        }).then(function (result) {
            //save to file
            db.dump(ws).then(function (res) {
                console.log(res);
            });



        }).catch(function (err) {
            console.log(err);
        });

    };

    /**
     * Load file
     */
    manager.local = function () {
        return   db.get('_local/preloaded').then(function (doc) {
        }).catch(function (err) {
            if (err.name !== 'not_found') {
                throw err;
            }
            // we got a 404, so the local document doesn't exist. so let's preload!
            return db.load('data/sao.json').then(function () {
                // create the local document to note that we've preloaded
                return db.put({_id: '_local/preloaded'});
            });
        }).then(function () {
            return db.allDocs({include_docs: true});
        }).catch(console.log.bind(console));
    };

    /**
     * Close de database
     * @returns
     */
    manager.close = function () {
        return db.close();
    };

    return manager;
}).filter('prettyJSON', function () {
    return function(json) { return angular.toJson(json, true); }
})
    .factory("Provincias",function () {
        return [{"id":"1","nombre":'Pinar del Río'}, {"id":"2","nombre":'Artemisa'}, {"id":"3","nombre":'Mayabeque'}, {"id":"4","nombre":'La Habana'}, {"id":"5","nombre":'Matanzas'}, {"id":"6","nombre":'Cienfuegos'}, {"id":"7","nombre":'Villa Clara'}, {"id":"8","nombre":'Sancti Spíritus'}, {"id":"9","nombre":'Ciego de Ávila'}, {"id":"10","nombre":'Camagüey'}, {"id":"11","nombre":'Las Tunas'}, {"id":"12","nombre":'Holguín'}, {"id":"13","nombre":'Santiago de Cuba'}, {"id":"14","nombre":'Guantánamo'}, {"id":"15","nombre":'Isla de la Juventud'}];
    })
    .factory("Ministerio",function () {
        return [{"id":"1","nombre":'Consejo de Administración Provincuial (CAP)'}, {"id":"2","nombre":'Ministerio del Turismo (MINTUR)'}, {"id":"3","nombre":'Ministerio de la Industria Básica (MINBAS)'}, {"id":"4","nombre":'Ministerio de Salud Pública (MINSAP)'}, {"id":"5","nombre":'Consejo de Estado (CE)'}, {"id":"6","nombre":'Ministerio de la Azúcar (MINAZ)'}, {"id":"7","nombre":'Ministerio de la Informática y las Comunicaciones (MIC)'}, {"id":"8","nombre":'Ministerio de la Construcción (MICONS)'}, {"id":"9","nombre":'Ministerio de Educación Superior (MES)'}, {"id":"10","nombre":'Ministerio del Transporte (MITRANS)'}, {"id":"11","nombre":'Ministerio de la Industria Alimenticia (MINAL)'}, {"id":"12","nombre":'Ministerio de la Ind. Sidero Mécanica y Electrónica (SIME)'}, {"id":"13","nombre":'Ministerio del Comercio Interior (MINCIN)'}, {"id":"14","nombre":'Ministerio de Cultura (MINCULT)'}, {"id":"15","nombre":'Ministerio de Ciencia, Tecnología y Medio Ambiente (CITMA)'}, {"id":"16","nombre":'Ministerio de la Industria Ligera (MINIL)'}, {"id":"17","nombre":'Instituto de la Aeronautica Civil de Cuba (IACC)'}, {"id":"18","nombre":'CIMEX'}, {"id":"19","nombre":'Unión de Jóvenes Comunistas (UJC)'}, {"id":"20","nombre":'Central de Trabajadores de Cuba (CTC)'}, {"id":"21","nombre":'Otros'} ];
    })
    .factory("OSDE",function () {
        return [{"id":"1","nombre":'OSDE1'}, {"id":"2","nombre":'OSDE2'}];
    })
    .factory("Sustancias",function () {
        return [{"id":"1","nombre":'Refrigerantes-Hidrocarburos'},{"id":"2","nombre":'Agente de expansión-Hidrocarburos '}, {"id":"3","nombre":'Metilformato'},{"id":"4","nombre":'Metilal'},{"id":"5","nombre":'CO2'},{"id":"6","nombre":'HFC-23 '},{"id":"7","nombre":'HFC-32 '},{"id":"8","nombre":'HFC-125 '},{"id":"9","nombre":'HFC-134a '},{"id":"10","nombre":'HFC-143a '},{"id":"11","nombre":'HFC-152a '},{"id":"12","nombre":'HFC-227ea '},{"id":"13","nombre":'HFC-245fa '},{"id":"14","nombre":'HFC-365mfc '},{"id":"15","nombre":'R-407C '},{"id":"16","nombre":'R-407F '},{"id":"17","nombre":'R-410A '},{"id":"18","nombre":'R-404A '}];
    })
    .factory("Sectores",function () {
        return [{"id":"1","nombre":'RAC '}, {"id":"2","nombre":'Espumas'}, {"id":"3","nombre":'Aerosoles '}, {"id":"4","nombre":'Solventes'},{"id":"5","nombre":'Extintores '}];
    })
    .factory("AlternativaHFC",function () {
        return [{"id":"1","nombre":'HFC-134a'}, {"id":"2","nombre":'HFC-32'}, {"id":"3","nombre":'HFC-152a'}, {"id":"4","nombre":'HFC-245fa'},{"id":"5","nombre":'HFC-227ea/HFC-365mfc'}];
    })
    .factory("AlternativaHFCMezclas",function () {
        return [{"id":"1","nombre":'R-404A'}, {"id":"2","nombre":'R-407C'}, {"id":"3","nombre":'R-410A'}, {"id":"4","nombre":'R-507A'}];
    })
    .factory("AlternativaHFO",function () {
        return [{"id":"1","nombre":'HFO-1234yf'}, {"id":"2","nombre":'HFO-1234ze'}, {"id":"3","nombre":'HFO-1233zd'}, {"id":"4","nombre":'HFO-1336mzzm'}];
    })
    .factory("AlternativaOtras",function () {
        return [{"id":"1","nombre":'Metil formato'}, {"id":"2","nombre":'Metilal'}, {"id":"3","nombre":'Etanol'},{"id":"4","nombre":'DME'},{"id":"5","nombre":'HC-290'},{"id":"6","nombre":'HC-600a'},{"id":"7","nombre":'Pentano(C,N,I)'},{"id":"8","nombre":'Pentano(C,N,I)'},{"id":"9","nombre":'R-744 '},{"id":"10","nombre":'R-717'}];
    })
    .factory("RA",function () {
        return [{"id":"1","nombre":'Fabricación '}, {"id":"2","nombre":'Servicio'}];
    })
    .factory("SectoresAnexo",function () {
        return [{"id":"1","nombre":'Espuma: poliuretano '}, {"id":"2","nombre":'Espuma: polietileno extruido'}, {"id":"3","nombre":'Aerosol '}, {"id":"4","nombre":'Solventes'},{"id":"5","nombre":'Extintores '}];
    })
    


    
.factory('Util',function () {
    return{
      "collect":function () 
                  {
                      var ret = {};
                      var len = arguments.length;
                      for (var i=0; i<len; i++) {
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
;

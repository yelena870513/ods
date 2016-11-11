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
        return [{"id":"1","nombre":'La Habana'}, {"id":"2","nombre":'Matanzas'}];
    })
    .factory("Ministerio",function () {
        return [{"id":"1","nombre":'CITMA'}, {"id":"2","nombre":'MES'}];
    })
    .factory("OSDE",function () {
        return [{"id":"1","nombre":'OSDE1'}, {"id":"2","nombre":'OSDE2'}];
    })
    .factory("Sustancias",function () {
        return [{"id":"1","nombre":'Agente de expansión-Hidrocarburos '}, {"id":"2","nombre":'Metilformato'}];
    })
    .factory("Sectores",function () {
        return [{"id":"1","nombre":'Estintores '}, {"id":"2","nombre":'Solventes'}];
    })
;

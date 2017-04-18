//Filtros en la vista, formateando la presentacion.
angular.module('app.sao').filter('mainString',function () {
    //Este filtro se utiliza para concatenar los valores de cada registro, segun sus atributos, en caso de que existan multiples.
    return function (data) {
       if(data!=undefined)
       {
           if( Object.prototype.toString.call( data ) === '[object Array]' )
           {
               return data.map(function (doc) {
                   return doc.nombre.trim();
               }).filter(function (ne) {
                   return ne!="";
               }).join(',');
           }
           else if(Object.prototype.toString.call( data ) === '[object Object]' )
           {
               return data.nombre;
           }
           else
           {
               return data;
           }
       }
       return '';

    }
})
    //Este filtro se encarga de transformar la clave alias por el titulo de la columna en cuestion
    .filter('showName',function(){
        return function(data){
            if (data!=undefined) {

                switch (data){
                    case "year":return "A\u00F1o";
                    case "Organizacion":return "Organizaci\u00F3n";
                    case "Uso":return "Consumo (Toneladas m\u00E9tricas)";
                    case "Alternativas":return "Alternativa";
                    case "Aplicaciones":return "Aplicaci\u00F3n";
                    case "Capacidad":return "Capacidad frigor\u00EDfica";
                    case "unidades":return "No. unidades";
                    case "experiencias":return "Carga (Kg)";
                    case "Estado":return "Estado t\u00E9nico";
                    case "explotacion":return "Consumo (Toneladas m\u00E9tricas)";
                    case "SustaciaAire":return "Aire";
                    case "TipoRefrigeracion":return "Tipo de refrigeraci\u00F3n";
                    case "SustanciaRefrigerante":return "Refrigerante";
                    // case "TipoRefrigeracion":return "Tipo refrigeraci\u00F3n";
                    case "TipoAire":return "Tipo Aire";
                    case "CantRefriAire":return "Refrigerante aire ";
                    case "CantRefriRefri":return "Refrigerante refrigeraci\u00F3n";
                    case "sustanciasR":return "Cantidad CCBP";
                    case "sustanciasRL":return "RL-95 (litros)";
                    case "Recuperacion":return "Cant. Equipos recuperaci\u00F3n";
                    case "Recuperado":return "Cant. recuperado";
                    case "Total":return "Personal productivo";
                    case "aplicacionAire":return "Aire Acondicionado";
                    case "aplicacionRefri":return "Refrigeraci\u00F3n";
                    case "Limpieza":return "Sustancia de limpieza interna";
                    case "refrigConsumidos":return "Refigerantes consumidos";
                    case "inventario":return "No. inventario ";
                    case "curso":return "Cant. CCBP ";
                    case "Sustancia":return "Sustancia importadores ";
                    case "Sustancia1":return "Pronóstico sustancia";
                    default: return data;
                }


            }
        }
    })
    .filter('prettyJSON', function() {
        return function(json) {
            return angular.toJson(json, true);
        }
    })
    .filter('SearchCriteria',function () {
        return function (data, criteria,cacheData)
        {
            if (criteria!=undefined && criteria!='')
            {
                if (cacheData!=undefined)
                {
                    return cacheData.filter(function (el) {
                        var validate=[];
                        for (var i in el)
                        {
                            if (i!="tipo")
                            {
                                if(Object.prototype.toString.call( el[i] ) === '[object Object]')
                                {
                                    if (indexOfIn(criteria,el[i].nombre))
                                    {
                                        validate.push(i);
                                    }
                                }
                                else {
                                    if (indexOfIn(criteria,el[i])) {
                                        validate.push(i);
                                    }
                                }
                            }

                        }

                        return validate.length>0;
                    });
                }
                return data.filter(function (el) {
                    var validate=[];
                    for (var i in el)
                    {
                        if (i!="tipo")
                        {
                            if(Object.prototype.toString.call( el[i] ) === '[object Object]')
                            {
                                if (indexOfIn(criteria,el[i].nombre))
                                {
                                    validate.push(i);
                                }
                            }
                            else {
                                if (indexOfIn(criteria,el[i])) {
                                    validate.push(i);
                                }
                            }
                        }

                    }

                    return validate.length>0;
                });
            }
            else{

                return data;
            }
        }

    })
    .filter('NameCriteria',function () {

        return function (data, criteria,cacheData)
        {
            if (criteria!=undefined && criteria!='')
            {
                if (cacheData!=undefined)
                {
                    return cacheData.filter(function (el) {
                        var validate=[];
                        if (indexOfIn(criteria,el.nombre))
                        {
                            validate.push(el);
                        }

                        return validate.length>0;
                    });
                }
                return data.filter(function (el) {
                    var validate=[];
                    if (indexOfIn(criteria,el.nombre))
                    {
                        validate.push(el);
                    }


                    return validate.length>0;
                });
            }
            else{

                return data;
            }
        }

    })

    .filter('capitalize', function() {
    return function(input) {
        return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    }
})
    .filter('fancy', function () {
        return function (input){
            return (input.toLowerCase()=='osde') ? input.toUpperCase() : input;
        }
    })
;


/**
 * Case no sense
 * @param needle
 * @param haystack
 * @returns {boolean}
 */
function indexOfIn(needle,haystack){
    if (needle!=undefined&&haystack!=undefined) {
        needle = needle.toString().toLowerCase();
        haystack = haystack.toString().toLowerCase();
        return haystack.indexOf(needle)!=-1;
    }
    return false;
}
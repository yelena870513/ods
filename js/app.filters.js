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
                    case "SustanciaRefrigerante":return "Refrigerante";
                    case "TipoRefrigeracion":return "Tipo refrigeraci\u00F3n";
                    case "TipoAire":return "Tipo Aire";
                    case "CantRefriAire":return "Refrigerante aire ";
                    case "CantRefriRefri":return "Refrigerante refrigeraci\u00F3n";
                    case "sustanciasR":return "R-141b (g)";
                    case "sustanciasRL":return "RL-95 (litros)";
                    case "Recuperacion":return "Equipos recuperaci\u00F3n";
                    case "Recuperado":return "Cantidad recuperado";
                    case "Total":return "Personal productivo";
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
;
//Filtros en la vista, formateando la presentacion.
angular.module('app.sao').filter('mainString',function () {
    //Este filtro se utiliza para concatenar los valores de cada registro, segun sus atributos, en caso de que existan multiples.
    return function (data) {
       if(data!=undefined)
       {
           if( Object.prototype.toString.call( data ) === '[object Array]' )
           {
               return data.map(function (doc) {
                   return doc.nombre;
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
        return function(data,columns){
            if (data!=undefined) {
                return columns[data].nombre;
            }
        }
    })
;
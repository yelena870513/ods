/**
 * Esta es la directiva que construye el arbol del menu
 */
//directiva para simular el arbol de los menu.
angular.module('app.sao').directive("tree", function(RecursionHelper) {
return {
    restrict: "AE",
    require: '^ngModel',
    scope: {
        ngModel: '=',
        templateUrl:'='

    },
    templateUrl :this.templateUrl,
    template:'<li class="treeview">'+
    '<a><i class="fa fa-dashboard"></i><span>{{ngModel.nombre}}</span>'+
    '<ul class="treeview-menu">' +
        '<li data-ng-show="item in ngModel.items">' +
        '<a></a>'+
    '</li>'+
    '</ul>'+
    '</li>'

    ,

    compile: function(element) {
        /*
        En la funcion compile, se utiliza el recursion helper para poder recrear el comportamiento de un arbol
         */
        return RecursionHelper.compile(element,
            {
                pre:function(scope, element, attrs, controller, transcludeFn){


                },
                post:   function(scope, element, attrs, controller, transcludeFn){



                }
            });
    }

}
})

;
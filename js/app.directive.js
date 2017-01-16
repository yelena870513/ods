/**
 * Esta es la directiva que construye el arbol del menu
 */
//directiva para simular el arbol de los menu.
angular.module('app.sao')
    .directive("tree", function(RecursionHelper) {
return {
    restrict: "AE",
    require: '^ngModel',
    scope: {
        ngModel: '=',
        handler:'@'


    },

    template:
    '<span data-ng-if="ngModel.items.length>0">{{ngModel.nombre}}</span>'+
    '<span data-ng-if="ngModel.items.length==0" data-ng-click="SelectModalT(ngModel.nombre)" style="cursor: hand">{{ngModel.nombre}}</span>'+
        '<ul class="list-group">' +
            '<li class="tree" data-ng-repeat="item in ngModel.items">' +
                '<div tree data-ng-model="item" data-handler="SelectModalT(ngModel.nombre)"></div>'+
            '</li>'+
        '</ul>'



    ,

    compile: function(element) {
        /*
        En la funcion compile, se utiliza el recursion helper para poder recrear el comportamiento de un arbol
         */
        return RecursionHelper.compile(element,
            {
                pre:function(scope, element, attrs, controller, transcludeFn){


                },
                post:   function(scope, element, attrs, controller, transcludeFn,$rootScope){
                        scope.SelectModalT = function(type){

                            scope.handler(type);
                        }
                }
            });
    }

}
})
    .directive('responsiveNav',function () {
        return {
            restrict: "A",
            link:function (scope, element, attrs, controller, transcludeFn) {
                scope.navigation =  responsiveNav('#'+attrs.id,{"insert":"before","label":"<i class='ion-android-menu'></i>"});

            }
        }
    })

;
/**
 * Esta es la directiva que construye el arbol del menu
 */
//directiva para simular el arbol de los menu.
angular.module('app.sao').directive("tree", function(RecursionHelper) {
return {
    restrict: "AE",
    require: '^ngModel',
    scope: {
        ngModel: '='

    },

    template:'<uib-accordion close-others="oneAtATime">'+
    '<uib-accordion-group is-open="status.open">'+
    '<uib-accordion-heading>{{ ngModel.nombre }}'+
    '<i class="pull-right" data-ng-class="{\'fa fa-chevron-down\':status.open, \'fa fa-chevron-right\': !status.open}"></i>'+
    ''+
    '</uib-accordion-heading>'+
    '<div class="form-group">'+
    '</div>'+
    '</uib-accordion-group>'+
    '</uib-accordion>'+
    '<ul class="list-group" data-dnd-list="ngModel.items">'+
    '<li data-ng-repeat="child in ngModel.items" data-dnd-draggable="child" data-dnd-selected="models.selected = child" class="tree"  data-ng-class="{selected: models.selected === child}">'+
    ' <div tree data-ng-model="child"></div>'+
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
                post:   function(scope, element, attrs, controller, transcludeFn){



                }
            });
    }

}
});
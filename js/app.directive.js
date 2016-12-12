
angular.module('app.router').directive("tree", function(RecursionHelper) {
return {
    restrict: "AE",
    scope: {
        family: '='

    },

    template:'<uib-accordion close-others="oneAtATime">'+
    '<uib-accordion-group is-open="status.open">'+
    '<uib-accordion-heading>{{ family.nombre }}'+
    '<i class="pull-right" data-ng-class="{\'fa fa-chevron-down\':status.isCustomHeaderOpen, \'fa fa-chevron-right\': !status.isCustomHeaderOpen}"></i>'+
    ''+
    '</uib-accordion-heading>'+
    '<div class="form-group">'+
    '</div>'+
    '</div>'+
    '</uib-accordion-group>'+
    '</uib-accordion>'+
    '<ul class="list-group" data-dnd-list="family.items">'+
    '<li data-ng-repeat="child in family.items" data-dnd-draggable="child" data-dnd-effect-allowed="move" data-dnd-selected="models.selected = child" data-dnd-moved="moveCallback(family,$index,child)" class="tree"  data-ng-class="{selected: models.selected === child}">'+
    ' <tree family="child"></tree>'+
    '</li>'+
    '</ul>'
    ,

    compile: function(element) {
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
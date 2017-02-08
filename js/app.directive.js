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
    }).
    directive('chartLegend',function(){

    function Legenda (chart,el) {
        var helpers = Chart.helpers;
        var legendHolder = document.createElement('div');
        legendHolder.innerHTML = chart.generateLegend();

        helpers.addEvent(legendHolder.firstChild, 'mouseout', function(){
            chart.draw();
        });
        el.appendChild(legendHolder);
    }
    function legend(parent, data, chart, legendTemplate) {
        legendTemplate = typeof legendTemplate !== 'undefined' ? legendTemplate : "<%=label%>";
        parent.className = 'legend';
        var datas = data.hasOwnProperty('datasets') ? data.datasets : data;
        // remove possible children of the parent
        while(parent.hasChildNodes()) {
            parent.removeChild(parent.lastChild);
        }

        var show = chart ? showTooltip : noop;
        datas.forEach(function(d, i) {

            //span to div: legend appears to all element (color-sample and text-node)
            var title = document.createElement('div');
            title.className = 'title';
            parent.appendChild(title);

            var colorSample = document.createElement('div');
            colorSample.className = 'color-sample';
            colorSample.style.backgroundColor = d.hasOwnProperty('strokeColor') ? d.strokeColor : d.color;
            colorSample.style.borderColor = d.hasOwnProperty('fillColor') ? d.fillColor : d.color;
            title.appendChild(colorSample);
            legendNode=legendTemplate.replace("<%=value%>",d.value);
            legendNode=legendNode.replace("<%=label%>",d.label);
            var text = document.createTextNode(legendNode);
            text.className = 'text-node';
            title.appendChild(text);

            show(chart, title, i);
        });
    }

    //add events to legend that show tool tips on chart
    function showTooltip(chart, elem, indexChartSegment){
        var helpers = Chart.helpers;

        var segments = chart.segments;
        //Only chart with segments
        if(typeof segments != 'undefined'){
            helpers.addEvent(elem, 'mouseover', function(){
                var segment = segments[indexChartSegment];
                segment.save();
                segment.fillColor = segment.highlightColor;
                chart.showTooltip([segment]);
                segment.restore();
            });

            helpers.addEvent(elem, 'mouseout', function(){
                chart.draw();
            });
        }
    }

    function noop() {}
    return {
        restrict: "AEC",
        link:function(scope, element, attrs, controller, transcludeFn){
            scope.$on('chart-create',function(ev,data){
                Legenda(data,document.getElementById(attrs.id));

                //legend(document.getElementById(attrs.model), data.config.data, data, "<%=label%>: <%=value%>g");
            });


        }

    }
})

;
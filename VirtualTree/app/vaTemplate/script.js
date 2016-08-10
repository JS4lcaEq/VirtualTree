(function ($parse, $compile) {


    function fn($parse, $compile) {

 

        function link(scope, element, attr) {

            var self = this;

            var current = {};

            scope.test = "test";

            scope.item = scope.vaData;

            scope.$watch("vaTmplt", function (newVal) {
                setTemplate(newVal);
            });


            function setTemplate(template) {
                var tmpl = '<va-template-box>' + template + '</va-template-box>';
                var newElement = null;
                try {
                    newElement = angular.element(tmpl);
                    if (newElement) {
                        var subScope = scope.$new(false);
                        $compile(newElement)(subScope);
                        if (current.subScope) {
                            current.subScope.$destroy();
                        }
                        current.subScope = subScope;
                        element.find("va-template-box").replaceWith(newElement);
                    }

                } catch (error) {
                    console.log(error);
                }
            }



        }

        return {
            template: function () { return "<va-template-box></va-template-box>" },
            link: link,
            scope: {
                vaTmplt: "<"
                ,vaData: "<"
            }
        }
    }

    angular.module("vaTemplateDirective", []);

    angular.module("vaTemplateDirective").directive("vaTemplate", fn);

})();
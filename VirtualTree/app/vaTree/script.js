(function ($interval, $parse, $compile) {

    function fn($interval, $parse, $compile) {

        var items = [];

        function link(scope, element, attr) {

            var self = this;


            var elements = {

            };

            var current = {

            };





            elements.scrolls.fast.on("scroll", function () {

            });





            scope.$watch("vaLength", function (newVal) {

            });

            scope.$watch("vaSrc", function (newVal) {
                if (nw && nw.length > 0) {
                    
                }
            });

            scope.onClick = function (item) {

            };


            function setHeight() {

            }

            function setIndexes(startIndex) {

            }

            function setDataWindow() {
              
                scope.dataWindow.length = 0;
                for (var i = current.indexes.start; i < current.indexes.end; i++) {
                    scope.dataWindow.push(scope.vaSrc[i]);
                }
            }


        }

        return {
            templateUrl: function () { return "app/vaTree/template.html?t=" + Math.random(); },
            link: link,
            scope: {
                vaTemplate: "="
                , vaSrc:    "="
                , vaLength: "="
                , vaOnClick: "&"
                , vaOnHover: "&"
            }
        }
    }

    angular.module("vaVirtualTreeDirective", []);

    angular.module("vaVirtualTreeDirective").directive("vaVirtualTree", fn);

})();
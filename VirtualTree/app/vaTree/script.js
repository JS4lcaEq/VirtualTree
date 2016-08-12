﻿(function ($interval, $parse, $compile) {

    var s = document.getElementsByTagName('script');
    var scriptUrl = s[s.length - 1].src;
    var scriptPath = scriptUrl.replace(/(.*\/)(.*\.js)/i, "$1");

    function fn($interval, $parse, $compile, TreeDataService) {

        var items = [];

        function link(scope, element, attr) {

            var self = this;

            scope.scriptPath = scriptPath
            scope.itemTemplate = " template = {{item.index}} / {{item.text}}";

            var elements = {

            };

            var current = {

            };

            scope.meta = {};

            scope.$watch("vaLength", function (newVal) {

            });

            function setWindow() {
                scope.data = scope.vaSrc;
            }

            scope.$watch("vaSrc", function (newVal) {

                if (newVal) {
                    console.log("vaSrc: ", newVal);
                    scope.meta = TreeDataService.getMeta(newVal, "sub");
                    console.log("scope.meta: ", scope.meta);
                    setWindow();
                }
            });

            //scope.onClick = function (item) {

            //};


            //function setHeight() {

            //}

            //function setIndexes(startIndex) {

            //}

            //function setDataWindow() {
              
            //    scope.dataWindow.length = 0;
            //    for (var i = current.indexes.start; i < current.indexes.end; i++) {
            //        scope.dataWindow.push(scope.vaSrc[i]);
            //    }
            //}


        }

        return {
            templateUrl: function () { return scriptPath + "template.html?t=" + Math.random(); },
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
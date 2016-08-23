(function ($interval, $parse, $compile) {

    var s = document.getElementsByTagName('script');
    var scriptUrl = s[s.length - 1].src;
    var scriptPath = scriptUrl.replace(/(.*\/)(.*\.js)/i, "$1");
    var t = Math.random();

    function fn($interval, $parse, $compile, TreeDataService) {

        var items = [];

        function link(scope, element, attr) {

            var self = this;

            scope.scriptPath = scriptPath;
            scope.t = t;
            scope.itemTemplate = " template = {{item.index}} / {{item.text}}";
            scope.template = "{{item.index}}";

            var elements = {

            };

            var current = {

            };

            scope.meta = {};

            scope.opened = {};

            scope.onClick = function (obj) {
                console.log("onClick", obj);
                var clickedItem = obj.item;
                clickedItem.opened = !clickedItem.opened;
                if (clickedItem.opened) {
                    for (var i = 0; i < clickedItem.sub.length; i++) {
                        clickedItem.sub[i].visible = true;
                    }
                } else {
                    for (var i = 0; i < clickedItem.sub.length; i++) {
                        clickedItem.sub[i].visible = false;
                    }
                }
                //scope.opened = null;
                //scope.opened = TreeDataService.getOpened(scope.meta);
            };

            scope.$watch("vaLength", function (newVal) {

            });



            scope.$watch("vaSrc", function (newVal) {
                scope.meta.length = 0;
                scope.meta = null;
                if (newVal) {

                    console.log("vaSrc: ", newVal);
                    $interval(function () {
                        scope.meta = TreeDataService.getMeta(newVal, "sub");
                        //scope.opened = TreeDataService.getOpened(scope.meta);
                        //console.log("scope.meta: ", scope.meta);
                        setWindow();
                    },1,1);

                }
            });

            function setWindow() {
                scope.data = scope.vaSrc;
            }

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
                vaTemp: "="
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
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
            scope.template = '<span ng-class="{level1:item.meta.level==1, level2:item.meta.level==2, level3:item.meta.level==3, level4:item.meta.level==4, level5:item.meta.level==5, level6:item.meta.level==6}"><span ng-if="item.meta.sub && !item.meta.opened">+</span><span ng-if="item.meta.sub && item.meta.opened">-</span> {{item.meta.obj.text}}' + scope.vaTemplate + '<span>';
                //'{{index}}/{{item.meta.obj.text}}/{{item.meta.opened}}/{{item.meta.visible}}';
            //

            var elements = {

            };

            var current = {

            };

            scope.meta = {};

            scope.opened = [];

            scope.onClick = function (obj) {
                console.log("onClick", obj);
                var clickedItem = obj.item;
                clickedItem.meta.opened = !clickedItem.meta.opened;
                if (clickedItem.meta.opened) {
                    clickedItem.meta.open();
                } else {
                    clickedItem.meta.close();
                }

                scope.opened = TreeDataService.getOpened(scope.meta);
            };

            scope.$watch("vaTemplate", function (newVal) {
                scope.template = '<span ' +
                    'ng-class="{level1:item.meta.level==1, level2:item.meta.level==2, level3:item.meta.level==3, level4:item.meta.level==4, level5:item.meta.level==5, level6:item.meta.level==6}">' +
                    '<span ng-if="item.meta.sub && !item.meta.opened">+</span>' +
                    '<span ng-if="item.meta.sub && item.meta.opened">-</span> ' +
                    '{{item.meta.obj.text}}' + scope.vaTemplate + '<span>';
            });



            scope.$watch("vaSrc", function (newVal) {
                scope.meta.length = 0;
                scope.meta = null;
                scope.opened.length = 0;
                scope.opened = null;
                if (newVal) {

                    //console.log("vaSrc: ", newVal);
                    $interval(function () {
                        scope.meta = TreeDataService.getMeta(newVal, "sub");
                        scope.meta[0].visible = true;
                        scope.meta[0].open();
                        scope.opened = TreeDataService.getOpened(scope.meta);
                        console.log("scope.meta: ", scope.meta.length, " scope.opened: ", scope.opened.length);
                        //setWindow();
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
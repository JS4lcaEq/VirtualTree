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

            };

            scope.$watch("vaTemplate", function (newVal) {
                scope.template = '<span ' +
                    'ng-class="{level1:item.meta.level==1, level2:item.meta.level==2, level3:item.meta.level==3, level4:item.meta.level==4, level5:item.meta.level==5, level6:item.meta.level==6, folder:item.meta.sub}">' +
                    '<span ng-if="item.meta.sub && !item.meta.opened"><i class="fa fa-folder-o" aria-hidden="true"></i></span>' +
                    '<span ng-if="item.meta.sub && item.meta.opened"><i class="fa fa-folder-open-o" aria-hidden="true"></i></span> ' +
                    '<span ng-if="!item.meta.sub"><i class="fa fa-file" aria-hidden="true"></i></span> ' + scope.vaTemplate + '</span>';
            });



            scope.$watch("vaSrc", function (newVal) {

            });

            function setWindow() {
                scope.data = scope.vaSrc;
            }


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
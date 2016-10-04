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
            //scope.itemTemplate = " template = {{item.index}} / {{item.text}}";
            scope.template = '<span ng-class="{level1:item.meta.level==1, level2:item.meta.level==2, level3:item.meta.level==3, level4:item.meta.level==4, level5:item.meta.level==5, level6:item.meta.level==6}"><span ng-if="item.meta.sub && !item.meta.opened">+</span><span ng-if="item.meta.sub && item.meta.opened">-</span> {{item.meta.obj.text}}' + scope.vaTemplate + '<span>';
                //'{{index}}/{{item.meta.obj.text}}/{{item.meta.opened}}/{{item.meta.visible}}';
            //

            var elements = {

            };

            var current = {

            };

            scope.branches = {};

            scope.opened = [];

            function getOpenedBranches(arr) {
                var ret = [];
                angular.forEach(arr, function (value, key) {
                    if (value.opened) {
                        ret.push(key);
                    }

                });
                return ret;
            }

            scope.onClick = function (item) {
                
                var branchIndex = item.item.dt[scope.vaIdFieldName];
                //console.log("onClick bh=", branchIndex, " item=", item);
                scope.branches[branchIndex].opened = !scope.branches[branchIndex].opened;
                //if (scope.branches[branchIndex].opened) {
                //    if (!scope.vaOpenedBranches) {
                //        scope.vaOpenedBranches = [];
                //    }
                //    scope.vaOpenedBranches.push(branchIndex);
                //}
                scope.vaOpenedBranches = getOpenedBranches(scope.branches);
                scope.opened = TreeDataService.getMetaFromBranches(scope.branches, 0, scope.vaIdFieldName);
            };

            scope.$watch("vaTemplate", function (newVal) {
                scope.template = '<span ' +
                    'ng-class="{level1:item.lv==1, level2:item.lv==2, level3:item.lv==3, level4:item.lv==4, level5:item.lv==5, level6:item.lv==6, folder:item.fldr}">' +
                    '<span ng-if="item.fldr && !item.pn"><i class="fa fa-folder-o" aria-hidden="true"></i></span>' +
                    '<span ng-if="item.fldr && item.pn"><i class="fa fa-folder-open-o" aria-hidden="true"></i></span> ' +
                    '<span ng-if="!item.fldr"><i class="fa fa-file" aria-hidden="true"></i></span> ' + scope.vaTemplate + '</span>';
            });



            scope.$watch("vaSrc.length", function (newVal) {
                //console.log("vaSrc", scope.vaSrc);
                if (scope.vaSrc && angular.isArray(scope.vaSrc) && scope.vaSrc.length > 0) {
                    scope.branches = TreeDataService.getBranchesFromArray(scope.vaSrc, scope.vaIdFieldName, scope.vaIdParentFieldName);
                    scope.branches[0].opened = true;
                    scope.opened = TreeDataService.getMetaFromBranches(scope.branches, 0, scope.vaIdFieldName);
                }
            });

            scope.$watch("vaMask", function (newVal) {
                var findedItems = TreeDataService.findItemsByText(scope.branches,  scope.vaMask, scope.vaTextFieldName);
                console.log("vaMask: ", newVal, " / ", findedItems.length);
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
                , vaLength: "=?"
                , vaOnClick: "&?"
                , vaOnHover: "&?"
                , vaIdFieldName: "<?"
                , vaIdParentFieldName: "<?"
                , vaTextFieldName: "<?"
                , vaOpenedBranches: "=?"
                , vaMask: "<?"
            }
        }
    }

    angular.module("vaVirtualTreeDirective", []);

    angular.module("vaVirtualTreeDirective").directive("vaVirtualTree", fn);

})();
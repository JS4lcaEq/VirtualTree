(function ($interval, $parse, $compile) {

    var s = document.getElementsByTagName('script');
    var scriptUrl = s[s.length - 1].src;
    var scriptPath = scriptUrl.replace(/(.*\/)(.*\.js)/i, "$1");
    var t = Math.random();

    function getOpenedBranches(arr) {
        var ret = [];
        angular.forEach(arr, function (value, key) {
            if (value.opened) {
                ret.push(key);
            }

        });
        return ret;
    }

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
                findedItems: []
            };

            scope.branches = {};

            scope.opened = [];



            scope.onClick = function (obj) {

                var branchIndex = obj.item.dt[scope.vaIdFieldName];
                //console.log("onClick bh=", branchIndex, " obj.event.target=", obj.event.target.tagName);
                if (obj.item && obj.item.fldr && obj.event.target.tagName == "I") {
                    if (scope.branches[branchIndex]) {
                        scope.branches[branchIndex].opened = !scope.branches[branchIndex].opened;
                        scope.vaOpenedBranches = getOpenedBranches(scope.branches);
                        scope.opened = TreeDataService.getMetaFromBranches(scope.branches, 0, scope.vaIdFieldName);
                    }
                }


            };

            scope.$watch("vaTemplate", function (newVal) {
                scope.template =
                    '<span class="level{{item.lv}}" ng-class="{finded: item.fd}">' +
                    '<i ng-class="{\'fa-folder-o\': item.fldr && !item.pn, \'fa-folder-open-o\': item.fldr && item.pn, \'fa-file\': !item.fldr}" class="fa"></i> ' +
                    scope.vaTemplate + '</span>';
            });



            scope.$watch("vaSrc", function (newVal) {
                //console.log("vaSrc", scope.vaSrc);
                if (scope.vaSrc && angular.isArray(scope.vaSrc) && scope.vaSrc.length > 0) {
                    scope.branches = TreeDataService.getBranchesFromArray(scope.vaSrc, scope.vaIdFieldName, scope.vaIdParentFieldName);
                    if (scope.branches[0]) {
                        scope.branches[0].opened = true;
                    }

                    scope.opened = TreeDataService.getMetaFromBranches(scope.branches, 0, scope.vaIdFieldName);
                    scope.vaOpenedBranches = getOpenedBranches(scope.branches);
                }
            }, false);

            scope.$watch("vaMask", function (newVal) {
                clearFindedItems();
                var isClearFindedItems = false;
                //console.log("vaMask=", newVal, " current.findedItems.length = ", current.findedItems);

                current.findedItems.length = 0;
                if (newVal && newVal.length > 0) {
                    current.findedItems = TreeDataService.findItemsByText(scope.branches, scope.vaMask, scope.vaTextFieldName);
                    isClearFindedItems = true;
                }

                TreeDataService.closeAllBranches(scope.branches);
                for (var i = 0; i < current.findedItems.length; i++) {
                    var item = current.findedItems[i];
                    if (item.dt[scope.vaIdParentFieldName]) {
                        TreeDataService.openPathBranchesByBranchId(scope.branches, item.dt[scope.vaIdParentFieldName]);
                    }
                }

                scope.opened = TreeDataService.getMetaFromBranches(scope.branches, 0, scope.vaIdFieldName, isClearFindedItems);
                console.log("vaMask: ", newVal, " / ", current.findedItems.length);
            });

            function clearFindedItems() {
                for (var i = 0; i < current.findedItems.length; i++) {
                    current.findedItems[i].finded = undefined;
                }
            }

            function setWindow() {
                scope.data = scope.vaSrc;
            }


        }

        return {
            templateUrl: function () { return scriptPath + "template.html?t=" + Math.random(); },
            link: link,
            scope: {
                vaTemplate: "=?"
                , vaSrc: "=?"
                , vaLength: "=?"
                , vaOnClick: "&?"
                , vaOnHover: "&?"
                , vaIdFieldName: "<?"
                , vaIdParentFieldName: "<?"
                , vaTextFieldName: "<?"
                , vaOpenedBranches: "=?"
                , vaRootParentId: "<?"
                , vaMask: "<?"
            }
        }
    }

    angular.module("vaVirtualTreeDirective", []);

    angular.module("vaVirtualTreeDirective").directive("vaVirtualTree", fn);

})();
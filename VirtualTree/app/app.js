(function () {

    var dataCount = 0;

    this.data = [];

    function createDataBranch(parent, levelsCount, levelItemsCount, level, addSubNodes) {
        var self = this;

        if (addSubNodes == undefined) {
            addSubNodes = false;
        }

        if (!levelsCount) {
            levelsCount = 2;
        }
        if (!levelItemsCount) {
            levelItemsCount = 2;
        }
        if (!level) {
            level = 0;
        }
        for (var i = 0; i < levelItemsCount; i++) {
            var item = { index: dataCount, parentIndex: null, text: "text_" + dataCount, sub: null };
            if (addSubNodes) {
                if (!parent.sub) {
                    parent.sub = [];
                }
                parent.sub.push(item);
            } else {
                self.data.push(item)
            }

            if (parent) {
                item.parentIndex = parent.index;
            }

            dataCount++;
            //console.log("step");
            if (level < levelsCount - 1) {
                createDataBranch(item, levelsCount, levelItemsCount, level + 1, addSubNodes);
            }

            
        }
    }

    function MainCtrl($scope, $interval) {
        var self = this;
        this.test = "MainCtrl";
        this.template = "[{{item.meta.index}}]={{item.meta.obj.text}}";
        this.levelsCount = 3;
        this.levelItemsCount = 3;
        this.data = {};
        this.dataCount = dataCount;
        this.createData = function (levelsCount, levelItemsCount) {
            var self = this;
            dataCount = 1;
            //self.data = null;
            $interval(function () {
                if (levelsCount > 0 && levelItemsCount > 0) {
                    self.data = { index: 0, text: "root", sub: null };
                    //console.log(self.data , levelsCount , levelItemsCount);
                    createDataBranch(self.data, levelsCount, levelItemsCount, 0);
                    this.dt = self.data;
                }
            }, 1, 1);

            
        };





    }

    angular.module('app', ["vaVirtualTreeDirective", "vaTreeDataService", "vaVirtualRepeaterDirective"]);

    angular.module('app').controller('MainCtrl', MainCtrl);

})();

(function () {

    var dataCount = 0;

    function createDataBranch(parent, levelsCount, levelItemsCount, level) {

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
            var item = { index: dataCount, text: "text_" + dataCount, sub: null };
            if (!parent.sub) {
                parent.sub = [];
            }
            parent.sub.push(item);
            dataCount++;
            //console.log("step");
            if (level < levelsCount) {
                createDataBranch(item, levelsCount, levelItemsCount, level + 1);
            }
        }
    }

    function MainCtrl($scope, $interval) {
        this.test = "MainCtrl";
        this.template = "{{test}}";
        this.levelsCount = 1;
        this.levelItemsCount = 2;
        this.data = {  };
        this.dataCount = dataCount;
        this.createData = function (levelsCount, levelItemsCount) {
            var self = this;
            dataCount = 0;
            //self.data = null;
            $interval(function () {
                if (levelsCount > 0 && levelItemsCount > 0) {
                    self.data = { index: null, text: "root", sub: null };
                    console.log(self.data , levelsCount , levelItemsCount);
                    createDataBranch(self.data, levelsCount, levelItemsCount, 0);
                }
            }, 1, 1);

            
        };

    }

    angular.module('app', ["vaVirtualTreeDirective", "vaTemplateDirective"]);

    angular.module('app').controller('MainCtrl', MainCtrl);

})();

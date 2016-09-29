(function () {

    var cnt = 0;

    var testArrayData = [];

    function generateBranch(parent, levelsCount, itemsCount, isObject, level) {
        if (!level) {
            level = 0;
            cnt = 0;
            testArrayData.length = 0;
        }
        if (!itemsCount) {
            itemsCount = 2;
        }
        if (!levelsCount) {
            levelsCount = 2;
        }

        var branch = [];
        for (var i = 0; i < itemsCount; i++) {
            cnt++;
            var item = { index: cnt, parentIndex: parent.index, text: "text_" + cnt };

            if (isObject) {
                item.parentIndex = undefined;
                branch.push(item);
            } else {
                
                testArrayData.push(item);
            }
            
            
            if (level < levelsCount) {
                generateBranch(item, levelsCount, itemsCount, isObject, level + 1);
            }
        }

        if (isObject) {
            if (!parent.sub) {
                parent.sub = [];
            }

            parent.sub = branch;
        }



    }


    function fn() {

        var testData = { index: 0, text: "root", sub: null };

        this.getTestData = function (levelsCount, itemsCount, isObject) {
            generateBranch(testData, levelsCount, itemsCount, isObject, 0);
            if (isObject) {
                return testData;
            } else {
                return angular.copy(testArrayData);
            }

        }

    }



    angular.module("vaTreeDataService", []);

    angular.module("vaTreeDataService").service("TreeDataService", fn);

})();

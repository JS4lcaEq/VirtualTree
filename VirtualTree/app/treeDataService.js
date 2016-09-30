(function () {

    var counters = {
        testDataIndex: 0,
        testDataRuns: 0,
        testDataGenerates: 0,
        branchesRuns: 0
    };

    var testArrayData = [];

    function generateBranch(parent, levelsCount, itemsCount, isObject, level) {
        if (!level) {
            level = 0;
            counters.testDataIndex = 0;
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
            counters.testDataIndex++;
            var item = { id: counters.testDataIndex, idp: parent.id, text: "text_" + counters.testDataIndex };

            if (isObject) {
                item.idp = undefined;
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

    function generateMetaBranch(branches, branchIndex, idFieldName, meta, level) {
        var branch = branches[branchIndex];
        for (var i = 0; i < branch.length; i++) {
            var data = branch[i].dt;
            var item = { ndx: meta.length, bh: branchIndex, fldr: false, pn: false, lv: level, dt: data };
            branch[i].mt = meta.length;
            meta.push(item);
            var subIndex = data[idFieldName];
            console.log(subIndex);
            var sub = branches[subIndex];
            if (sub) {
                item.fldr = true;
                generateMetaBranch(branches, subIndex, idFieldName, meta, level + 1);
            }
        }
    }

    function fn() {

        var testData = null;
        

        this.getTestData = function (levelsCount, itemsCount, isObject) {
            
            counters.testDataRuns++;

                testData = null;
                testData = { id: 0, text: "root", sub: null };
                testArrayData.length = 0;
                generateBranch(testData, levelsCount, itemsCount, isObject, 0);
                counters.testDataGenerates++;


            //console.log("RUN[", counters.testDataRuns, "/", counters.testDataGenerates, "]: TreeDataService.getTestData length=", counters.testDataIndex, " arguments:", arguments, " oldValues:", oldValues);



            if (isObject) {
                return testData;
            } else {
                return testArrayData;
            }

        }

        this.getBranchesFromArray = function (arr, idFieldName, idpFieldName) {
            var branches = {};
            for (var i = 0; i < arr.length; i++) {
                var id = arr[i][idFieldName];
                var idp = arr[i][idpFieldName];
                if (!branches[idp]) {
                    branches[idp] = [];
                }
                branches[idp].push({ dt: arr[i], mt: null });
            }
            counters.branchesRuns++;
            console.log("RUN[", counters.branchesRuns, "] TreeDataService.getBranchesFromArray arr.length=", arr.length);

            return branches;
        };

        this.getMetaFromBranches = function (branches, rootBranchIndex, idFieldName) {
            var meta = [];
            generateMetaBranch(branches, rootBranchIndex, idFieldName, meta, 0);
            return meta;
        };

    }

    angular.module("vaTreeDataService", []);

    angular.module("vaTreeDataService").service("TreeDataService", fn);

})();

(function () {

    var counters = {
        testDataIndex: 0,
        testDataRuns: 0,
        testDataGenerates: 0,
        branchesRuns: 0
    };

    var testArrayData = [];

    // рекурсивная, строит ветку тестовых данных
    function generateBranch(parent, levelsCount, itemsCount, isObject, level, idFieldName, idParentFieldName) {
        console.log("generateBranch idFieldName=", idFieldName, " idParentFieldName=", idParentFieldName);
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
            var item = {text: "text_" + counters.testDataIndex };
            item[idFieldName] = counters.testDataIndex;
            item[idParentFieldName] = parent[idFieldName];
            if (isObject) {
                item[idParentFieldName] = undefined;
                branch.push(item);
            } else {
                
                testArrayData.push(item);
            }
            
            
            if (level < levelsCount) {
                generateBranch(item, levelsCount, itemsCount, isObject, level + 1, idFieldName, idParentFieldName);
            }
        }

        if (isObject) {
            if (!parent.sub) {
                parent.sub = [];
            }

            parent.sub = branch;
        }
    }

    // рекурсивная, строит ветку дерева (мета данные)
    function generateMetaBranch(branches, branchIndex, idFieldName, meta, level) {
        var branch = branches[branchIndex];
        for (var i = 0; i < branch.items.length; i++) {
            var data = branch.items[i].dt;
            var item = { // элемент ветки дерева (мета данные)
                ndx: meta.length, // числовой индекс мета массива 
                bh: branchIndex,  // строковый индекс ветки дерева (равен значению поля "parentFieldName" исходного массива элементов дерева)
                fldr: false,      // признак папка
                pn: false,        // признак папка открыта
                lv: level,        // уровень дерева
                dt: data          // элемент исходного массива элементов дерева 
            };
            //branch.items[i].mt = meta.length;
            meta.push(item);
            var subIndex = data[idFieldName];
            //console.log(subIndex);
            var sub = branches[subIndex];
            if (sub) {
                item.fldr = true;
                if (sub.opened) {
                    item.pn = true;
                    generateMetaBranch(branches, subIndex, idFieldName, meta, level + 1);
                }
                
            }
        }
    }

    

    function fn() {

        var testData = null;
        

        this.getTestData = function (levelsCount, itemsCount, isObject, idFieldName, idParentFieldName) {
            
            counters.testDataRuns++;

                testData = null;
                testData = { id: 0, text: "root", sub: null };
                testArrayData.length = 0;
                generateBranch(testData, levelsCount, itemsCount, isObject, 0, idFieldName, idParentFieldName);
                counters.testDataGenerates++;


            console.log("RUN[", counters.testDataRuns, "]: TreeDataService.getTestData");



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
                    branches[idp] = {opened:false, items:[]};
                }
                branches[idp].items.push({ dt: arr[i], mt: null });
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

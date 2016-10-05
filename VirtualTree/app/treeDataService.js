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
        // console.log("generateBranch idFieldName=", idFieldName, " idParentFieldName=", idParentFieldName);
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
    function generateMetaBranch(branches, branchIndex, idFieldName, meta, level, hideClosedFolders) {
        var branch = branches[branchIndex];
        if (branch) {
            for (var i = 0; i < branch.items.length; i++) {
                var data = branch.items[i].dt;
                var subIndex = data[idFieldName];
                var sub = branches[subIndex];

                var item = { // элемент ветки дерева (мета данные)
                    ndx: meta.length, // числовой индекс мета массива 
                    bh: branchIndex,  // строковый индекс ветки дерева (равен значению поля "parentFieldName" исходного массива элементов дерева)
                    fldr: false,      // признак папка
                    pn: false,        // признак папка открыта
                    lv: level,        // уровень дерева
                    dt: data,         // элемент исходного массива элементов дерева 
                    fd: branch.items[i].finded // признак что элемент найден текстовым поиском
                };
                branch.items[i].mt = meta.length;

                if (hideClosedFolders) {
                    
                    if (sub) {
                        item.fldr = true;
                        if (sub.opened || branch.items[i].finded) {
                            item.pn = sub.opened;
                            meta.push(item);
                            if (sub.opened) {
                                generateMetaBranch(branches, subIndex, idFieldName, meta, level + 1, hideClosedFolders);
                            } 
                        }
                    } else {
                        if (branch.items[i].finded) {
                            meta.push(item);
                        }
                        
                    }
                } else {
                    meta.push(item);
                    if (sub) {
                        item.fldr = true;
                        if (sub.opened) {
                            item.pn = true;
                            generateMetaBranch(branches, subIndex, idFieldName, meta, level + 1, hideClosedFolders);
                        }
                
                    }
                }

                

                


            }
        }

    }

   

    

    function fn() {

        var testData = null;
        
        var self = this;

        this.getTestData = function (levelsCount, itemsCount, isObject, idFieldName, idParentFieldName) {
            
            counters.testDataRuns++;

                testData = null;
                testData = { id: 0, text: "root", sub: null };
                testArrayData.length = 0;
                generateBranch(testData, levelsCount, itemsCount, isObject, 0, idFieldName, idParentFieldName);
                counters.testDataGenerates++;


            //console.log("RUN[", counters.testDataRuns, "]: TreeDataService.getTestData");



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
                

                branches[idp].items.push({ dt: arr[i], mt: null, bh: idp, bhi: branches[idp].items.length });
            }
            for (var i = 0; i < arr.length; i++) {
                var id = arr[i][idFieldName];
                var idp = arr[i][idpFieldName];
                if (branches[id]) {
                    //console.log("getBranchesFromArray: id=", id);
                    branches[id].parent = idp;
                    branches[id].item = arr[i];
                }
               
            }
            counters.branchesRuns++;
            // console.log("RUN[", counters.branchesRuns, "] TreeDataService.getBranchesFromArray arr.length=", arr.length);

            return branches;
        };

        this.getMetaFromBranches = function (branches, rootBranchIndex, idFieldName, hideClosedFolders) {
            var meta = [];
            generateMetaBranch(branches, rootBranchIndex, idFieldName, meta, 0, hideClosedFolders);
            return meta;
        };

        // возвращает найденные элементы, устанавливает признак найден (finded = true)
        this.findItemsByText = function (branches, text, textFieldName) {
            //console.log("findItemsByText: ", text, textFieldName);
            var findedItems = [];
            var rg = RegExp(text, "i");
            angular.forEach(branches, function (branch, key) {
                //console.log("findItemsByText: [", key, "] = ", branch);
                for (var i = 0; i < branch.items.length; i++) {
                    var srcText = branch.items[i].dt[textFieldName];
                    //console.log("findItemsByText: ", srcText);
                    if (rg.test(srcText)) {
                        branch.items[i].finded = true;
                        findedItems.push(branch.items[i]);
                        //console.log("findItemsByText: item=", branch.items[i]);
                    }
                }
            });
            return findedItems;
        };


        // рекурсивная, устанавливает признак открыто (opened = true) для всех веток от указанной и по пути до корня дерева
        this.openPathBranchesByBranchId = function (branches, branchId) {
            branches[branchId].opened = true;
            if (branches[branchId].parent) {
                self.openPathBranchesByBranchId(branches, branches[branchId].parent);
            }
        };

        this.closeAllBranches = function (branches) {
            angular.forEach(branches, function (branch, key) {
                branch.opened = false;
            });
        };

    }

    angular.module("vaTreeDataService", []);

    angular.module("vaTreeDataService").service("TreeDataService", fn);

})();

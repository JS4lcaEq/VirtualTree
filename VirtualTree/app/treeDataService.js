(function () {



    var metaItemIndex = 0;
    var arr = [];

    function fn() {
        this.getMeta = function (data, subItemsFieldName) {
            metaItemIndex = 0;
            arr.length = 0;
            var meta = newMeta(null, data);
            meta.opened = true;
            //return meta;
            return arr;
        };

        this.getOpened = function (meta) {
            var opened = newOpened(meta);
            return opened;
        };
    }

    function newMeta(parentIndex, obj, level) {
        
        var item = {};
        metaItemIndex++;
        item.index = metaItemIndex;
        if (parentIndex != undefined) {
            item.parentIndex = parentIndex;
        } else {
            item.parentIndex = null;
        }
        if (!level) {
            level = 0;
        }
        arr.push(item);
        item.level = level
        item.obj = obj;
        item.sub = null;
        item.opened = false;
        item.fillSub = function () {
            if (obj.sub) {
                item.sub = [];
                for (var i = 0; i < obj.sub.length; i++) {
                    item.sub.push(newMeta(item.index, obj.sub[i], level + 1));
                    //arr.push(item);
                    //newMeta(item.index, obj.sub[i], level + 1);
                }
            }
        };
        item.fillSub();
        
        return item;
    }

    function newOpened(meta) {
        var item = {};
        item.index = meta.index;
        item.parentIndex = meta.parentIndex;
        item.meta = meta;

        item.fillSub = function () {
            if (meta.sub) {
                item.sub = [];
                for (var i = 0; i < meta.sub.length; i++) {
                    item.sub.push(newOpened(meta.sub[i]));
                }
            }
        };

        if (meta.opened) {
            item.fillSub();
        } else {
            item.sub = null;
        }        
        return item;
    }

    angular.module("vaTreeDataService", []);

    angular.module("vaTreeDataService").service("TreeDataService", fn);

})();

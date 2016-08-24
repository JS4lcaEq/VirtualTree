(function () {



    var metaItemIndex = 0;
    var openedItemIndex = 0;
    var arr = [];
    var arrOpened = [];

    function fn() {
        this.getMeta = function (data, subItemsFieldName) {
            metaItemIndex = 0;
            arr.length = 0;
            var meta = newMeta(null, data);
            meta.opened = true;
            meta.visible = true;
            //return meta;
            return arr;
        };

        this.getOpened = function (meta) {
            openedItemIndex = 0;
            arrOpened.length = 0;
            for (var i = 0; i < meta.length; i++){
                if (meta[i].visible) {
                    arrOpened.push(newOpened(meta[i]));
                }
                
            }
            return arrOpened;
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
                }
            }
        };
        item.fillSub();
        
        return item;
    }

    function newOpened(meta) {
        return { meta: meta };
    }

    angular.module("vaTreeDataService", []);

    angular.module("vaTreeDataService").service("TreeDataService", fn);

})();

(function () {



    var metaItemIndex = 0;

    function fn() {
        this.getMeta = function (data, subItemsFieldName) {
            metaItemIndex = 0;
            var meta = newMeta(null, data);
            meta.opened = true;
            return meta;
        };
    }

    function newMeta(parentIndex, obj) {
        var item = {};
        metaItemIndex++;
        item.index = metaItemIndex;
        if (parentIndex != undefined) {
            item.parentIndex = parentIndex;
        } else {
            item.parentIndex = null;
        }
        item.obj = obj;
        item.sub = null;
        item.opened = false;
        item.fillSub = function () {
            if (obj.sub) {
                item.sub = [];
                for (var i = 0; i < obj.sub.length; i++) {
                    item.sub.push(newMeta(item.index, obj.sub[i]));
                }
            }
        };
        item.fillSub();
        return item;
    }

    angular.module("vaTreeDataService", []);

    angular.module("vaTreeDataService").service("TreeDataService", fn);

})();

(function () {

    var dataCount = 0;

    this.data = [];



    function MainCtrl($scope, $interval, TreeDataService) {
        var self = this;
        this.treeDataService = TreeDataService;
        this.test = "MainCtrl";
        this.template = "[{{item.meta.index}}]={{item.meta.obj.text}}";
        this.levelsCount = 2;
        this.levelItemsCount = 2;
        this.data = {};
        this.dataCount = dataCount;






    }

    angular.module('app', ["vaVirtualTreeDirective", "vaTreeDataService", "vaVirtualRepeaterDirective"]);

    angular.module('app').controller('MainCtrl', MainCtrl);

})();

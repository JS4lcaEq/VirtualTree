(function () {



    function MainCtrl($scope, $interval, TreeDataService) {
        var self = this;


        this.test = "MainCtrl";
        this.template = "[{{item.meta.index}}]={{item.meta.obj.text}}";
        this.levelsCount = 2;
        this.levelItemsCount = 2;
        this.branches = {}
        this.data = [];
        this.meta = [];


        this.reset = function () {
            this.data = TreeDataService.getTestData(this.levelsCount, this.levelItemsCount, false);
            this.branches = TreeDataService.getBranchesFromArray(this.data, "id", "idp");
            this.meta = TreeDataService.getMetaFromBranches(this.branches, 0, "id");
        };




    }

    angular.module('app', ["vaVirtualTreeDirective", "vaTreeDataService", "vaVirtualRepeaterDirective"]);

    angular.module('app').controller('MainCtrl', MainCtrl);

})();

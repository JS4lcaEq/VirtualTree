(function () {



    function MainCtrl($scope, $interval, TreeDataService) {
        var self = this;

        this.tds = TreeDataService;
        this.test = "MainCtrl";
        this.template = "[{{item.ndx}}]={{item.dt.text}}";
        this.levelsCount = 2;
        this.levelItemsCount = 2;
        this.branches = {}
        this.data = [];
        this.meta = [];


        this.reset = function () {
            this.data.length = 0;
            this.data = null;
            this.data = undefined;
            this.data = this.tds.getTestData(this.levelsCount, this.levelItemsCount, false);
            //this.branches = this.tds.getBranchesFromArray(this.data, "id", "idp");
            //this.meta = this.tds.getMetaFromBranches(this.branches, 0, "id");
        };




    }

    angular.module('app', ["vaVirtualTreeDirective", "vaTreeDataService", "vaVirtualRepeaterDirective"]);

    angular.module('app').controller('MainCtrl', MainCtrl);

})();

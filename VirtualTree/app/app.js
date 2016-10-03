(function () {



    function MainCtrl($scope, $interval, TreeDataService) {

        var self = this;

        this.tds = TreeDataService;
        this.test = "MainCtrl";
        this.template = "[{{item.ndx}}]={{item.dt.text}}";
        this.levelsCount = 2;
        this.levelItemsCount = 2;
        this.idFieldName = "id";
        this.idParentFieldName = "idp";
        this.branches = {}
        this.data = [];
        this.meta = [];

        this.reset = function () {
            this.data.length = 0;
            this.data = [];
            self.data = this.tds.getTestData(this.levelsCount, this.levelItemsCount, false, this.idFieldName, this.idParentFieldName);
        };

    }

    angular.module('app', ["vaVirtualTreeDirective", "vaTreeDataService", "vaVirtualRepeaterDirective"]);

    angular.module('app').controller('MainCtrl', MainCtrl);

})();

(function () {



    function MainCtrl($scope, $interval, TreeDataService) {

        var self = this;

        this.tds = TreeDataService;
        this.test = "MainCtrl";
        this.template = "{{item.dt.text}}";
        this.levelsCount = 2;
        this.levelItemsCount = 2;
        this.idFieldName = "id";
        this.idParentFieldName = "idp";
        this.branches = {}
        this.data = [];
        this.meta = [];

        this.reset = function () {
            if (self.data) {
                self.data.length = 0;
                self.data = null;
            }

            //self.data = [];
            $interval(function () {
                self.data = self.tds.getTestData(self.levelsCount, self.levelItemsCount, false, self.idFieldName, self.idParentFieldName);
                //$scope.$apply();
            }, 10, 1);
            
        };

        this.onSearchFieldChange = function (model) {
            var findItems = self.tds.findItemsByText();
        };

    }

    angular.module('app', ["vaVirtualTreeDirective", "vaTreeDataService", "vaVirtualRepeaterDirective"]);

    angular.module('app').controller('MainCtrl', MainCtrl);

})();

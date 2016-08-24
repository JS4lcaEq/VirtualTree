(function () {

    var dataCount = 0;

    function createDataBranch(parent, levelsCount, levelItemsCount, level) {

        if (!levelsCount) {
            levelsCount = 2;
        }
        if (!levelItemsCount) {
            levelItemsCount = 2;
        }
        if (!level) {
            level = 0;
        }
        for (var i = 0; i < levelItemsCount; i++) {
            var item = { index: dataCount, text: "text_" + dataCount, sub: null };
            if (!parent.sub) {
                parent.sub = [];
            }
            parent.sub.push(item);
            dataCount++;
            //console.log("step");
            if (level < levelsCount - 1) {
                createDataBranch(item, levelsCount, levelItemsCount, level + 1);
            }
        }
    }

    function MainCtrl($scope, $interval) {
        this.test = "MainCtrl";
        this.template = "{{test}}";
        this.levelsCount = 3;
        this.levelItemsCount = 3;
        this.data = {};
        this.dataCount = dataCount;
        this.createData = function (levelsCount, levelItemsCount) {
            var self = this;
            dataCount = 0;
            //self.data = null;
            $interval(function () {
                if (levelsCount > 0 && levelItemsCount > 0) {
                    self.data = { index: null, text: "root", sub: null };
                    //console.log(self.data , levelsCount , levelItemsCount);
                    createDataBranch(self.data, levelsCount, levelItemsCount, 0);
                }
            }, 1, 1);

            
        };

        //$scope.mainGridOptions = {
        //    dataSource: {
        //        type: "odata",
        //        transport: {
        //            read: "//demos.telerik.com/kendo-ui/service/Northwind.svc/Employees"
        //        },
        //        pageSize: 5,
        //        serverPaging: true,
        //        serverSorting: true
                
        //    },
        //    sortable: true,
        //    pageable: true,
        //    reorderable: true,
        //    dataBound: function () {
        //        //this.expandRow(this.tbody.find("tr.k-master-row").first());
        //    },
        //    columns: [{
        //        field: "FirstName",
        //        title: "First Name",
        //        width: "120px"
        //    }, {
        //        field: "LastName",
        //        title: "Last Name",
        //        width: "120px"
        //    }, {
        //        field: "Country",
        //        width: "120px"
        //    }, {
        //        field: "City",
        //        width: "120px"
        //    }, {
        //        field: "Title"
        //    }]
        //};


        //$scope.detailGridOptions = function (dataItem) {
        //    return {
        //        dataSource: {
        //            type: "odata",
        //            transport: {
        //                read: "//demos.telerik.com/kendo-ui/service/Northwind.svc/Orders"
        //            },
        //            serverPaging: true,
        //            serverSorting: true,
        //            serverFiltering: true,
        //            pageSize: 5,
        //            filter: { field: "EmployeeID", operator: "eq", value: dataItem.EmployeeID }
        //        },
        //        scrollable: false,
        //        sortable: true,
        //        pageable: true,
        //        columns: [
        //        { field: "OrderID", title: "ID", width: "56px" },
        //        { field: "ShipCountry", title: "Ship Country", width: "110px" },
        //        { field: "ShipAddress", title: "Ship Address" },
        //        { field: "ShipName", title: "Ship Name", width: "190px" }
        //        ]
        //    };
        //};

    }

    angular.module('app', ["vaVirtualTreeDirective", "vaTreeDataService", "vaVirtualRepeaterDirective"]);

    angular.module('app').controller('MainCtrl', MainCtrl);

})();

(function ($interval, $parse, $compile) {

    function fn($interval, $parse, $compile) {

        var items = [];

        function link(scope, element, attr) {
            console.log("simple1");
            var elements = {
                listBox: element.find(".va-list-box")
                , list: element.find(".va-list-box ul")
                , box: element.find(".va-virtual-repeater")
                , spacers: { fast: element.find(".va-scroll-fast .va-spacers") }
                , scrolls: { fast: element.find(".va-scroll-fast") }
            };

            var current = {
                height: { box: 0, item: 0, fastItem: 0, spacers: { slow: 0, fast: 0, fastActive: 0 } }
                , triggers: { scroll: false, scrollFast: false }
                , indexes: { start: 0, end: 0, max: 0 }
                , len: 0
                , scroll: 0
                , subScope: null
                , stat: { scroll: [] }
                , h: 0
                , intervals: { fastScroll: null }
                , touchStart: 0
            };


            scope.dataWindow = [1, 2, 3];


            elements.scrolls.fast.on("scroll", function () {
                scope.$apply(function () {

                    if (current.triggers.scrollFast) {
                        current.triggers.scrollFast = false;
                        return;
                    }


                    var scroll = elements.scrolls.fast.scrollTop();
                    current.indexes.start = Math.round(scroll * current.height.fastItemInverse);


                    current.intervals.fastScroll = $interval(function () {
                        setIndexes(current.indexes.start);

                        setDataWindow();
                        current.intervals.fastScroll = null;
                    }, 1, 1);
                });
            });

            elements.list.on("touchstart", function (event) {
                current.touchStart = event.originalEvent.touches[0].clientY + 0;
                event.preventDefault();
                console.log("touchstart", current.touchStart, event.originalEvent.target);
            });

            elements.list.on("touchmove", function (event) {
                event.preventDefault();
                var wheel = current.touchStart - event.originalEvent.touches[0].clientY;
                if (wheel > 15 || wheel < -15) {
                    current.touchStart = event.originalEvent.touches[0].clientY;
                    scope.$apply(function () {
                        onWheel(wheel / 10);
                    });
                }

                console.log("touchmove", event.originalEvent.touches[0].clientY, wheel);
            });

            elements.list.on("touchend", "div", function (event) {
                console.log("touchend");
            });

            elements.listBox.on("wheel", function (event) {
                var wheel = event.originalEvent.deltaY;
                scope.$apply(function () {
                    onWheel(wheel);
                });
                return false;
            });

            scope.$watch("vaTemplate", function () {
                console.log("$watch vaTemplate");
                setTemplate();
            });

            scope.$watch("vaLength", function (newVal) {
                console.log("$watch vaLength");
                current.len = newVal - 0;
                setHeight();

                setDataWindow();
            });

            scope.$watch("vaSrc", function (nw) {
                console.log("newValue: ", nw);
                if (nw) {
                    //elements.scrolls.fast.scrollTop(0);
                    current.indexes.max = nw.length - 1;
                    current.height.spacers.fast = nw.length * current.height.item;
                    

                } else {
                    current.indexes.max = 0;
                    current.height.spacers.fast = 0;
                }


                
                if (current.height.spacers.fast > current.height.box * 20) {
                    current.height.spacers.fast = current.height.box * 20;
                }
                current.height.spacers.fastActive = current.height.spacers.fast - current.height.box;
                if (current.height.spacers.fastActive < 0) current.height.spacers.fastActive = 0;
                if (current.height.spacers.fastActive > 0 && current.indexes.max > 0) {
                    current.height.fastItem = current.height.spacers.fastActive / current.indexes.max;
                } else {
                    current.height.fastItem = 0;
                }
                if (current.height.spacers.fastActive > 0) {
                    current.height.fastItemInverse = current.indexes.max / current.height.spacers.fastActive;
                } else {
                    current.height.fastItemInverse = 0;
                }
                elements.spacers.fast.height(current.height.spacers.fast);

                setIndexes(0);
                //console.log("$watch vaSrc", nw.length, current.height);
                if (current.height.box > 0) {
                    setDataWindow();
                } else {
                    $interval(function () {
                        setDataWindow();
                    }, 0, 1);
                }

            });

            scope.onHover = function (item, index) {
                //console.log("onHover", this);
                if (scope.vaOnHover) {
                    scope.vaOnHover({ obj: { index: index, item: item } });
                }
            };

            scope.onClick = function (item, index) {
                //console.log("onClick", this);
                if (scope.vaOnClick) {
                    scope.vaOnClick({ obj: { index: index, item: item } });
                }
            };

            function onWheel(diff) {
                if (diff > 0) {
                    current.indexes.start += 1;

                    if (current.indexes.start > current.indexes.max) {
                        current.indexes.start = current.indexes.max;
                    }
                    setIndexes(current.indexes.start);
                    setDataWindow();
                    current.scroll = Math.round(current.indexes.start * current.height.fastItem);
                    current.triggers.scrollFast = true;
                    elements.scrolls.fast.scrollTop(current.scroll);
                } else {
                    if (diff < 0) {
                        current.indexes.start += -1;
                        if (current.indexes.start < 0) {
                            current.indexes.start = 0;
                        }
                        setIndexes(current.indexes.start);
                        setDataWindow();
                        current.scroll = Math.round(current.indexes.start * current.height.fastItem);
                        current.triggers.scrollFast = true;
                        elements.scrolls.fast.scrollTop(current.scroll);
                    }
                }
            }

            function setHeight() {
                scope.dataWindow.length = 0;
                current.height.box = 200;
                current.height.item = 20;
                elements.box.height(current.height.box);
                scope.dataWindow.length = 0;
            }

            function setIndexes(index) {
                if (current.len && current.indexes.max) {

                    if (index != undefined) {
                        current.indexes.start = index;
                    } else {
                        if (!current.indexes.start) {
                            current.indexes.start = 0;
                        }
                    }
                    if (index > current.indexes.max) {
                        index = current.indexes.max;
                    }
                    current.indexes.end = current.indexes.start + current.len;
                    if (current.indexes.end > current.indexes.max) {
                        current.indexes.end = current.indexes.max
                    }

                    scope.vaCurrentIndex = current.indexes.start ;
                }
            }

            function setDataWindow() {
                scope.dataWindow.length = 0;
                for (var i = current.indexes.start; i < current.indexes.end; i++) {
                    scope.dataWindow.push(scope.vaSrc[i]);
                }
            }

            function setTemplate() {
                var tmpl = '<li ng-repeat="(index, item) in dataWindow" ng-mouseover="onHover(item, index)"  ng-click="onClick(item, index)">' + scope.vaTemplate + '&nbsp;</li>';
                var newElement = null;
                try {
                    newElement = angular.element(tmpl);
                    if (newElement) {
                        var subScope = scope.$new(false);
                        $compile(newElement)(subScope);
                        if (current.subScope) {
                            current.subScope.$destroy();
                        }
                        current.subScope = subScope;
                        elements.list.find("li").replaceWith(newElement);
                    }

                } catch (error) {
                    console.log(error);
                }



            }

            //setTemplate();

        }

        //controller.$inject = ['$scope', '$element'];

        //function controller($scope, $element) {
        //    var self = this;

        //    var current = {
        //        indexes: { start: 0, end: 0, max: 0 }
        //        , len: 0
        //    };

        //    var elements = {
        //        items: $element.find(".va-list-box li")
        //        , listBox: $element.find(".va-list-box")
        //        , list: $element.find(".va-list-box ul")
        //        , box: $element.find(".va-virtual-repeater")
        //        , spacers: $element.find(".va-scroll-fast .va-spacers")
        //        , scrolls: $element.find(".va-scroll-fast")
        //    };

        //    self.test = "controller of virtual repeater directive";
        //    self.dataWindow = [];

        //    function setIndexes(index) {
        //        if ($scope.vaSrc && current.len && current.indexes.max) {

        //            if (index != undefined) {
        //                current.indexes.start = index;
        //            } else {
        //                current.indexes.start = 0;
        //            }
        //            if (index > current.indexes.max) {
        //                index = current.indexes.max;
        //            }
        //            current.indexes.end = current.indexes.start + current.len;
        //            if (current.indexes.end > current.indexes.max) {
        //                current.indexes.end = current.indexes.max
        //            }
        //            if ($scope.vaCurrentIndex) {
        //            $scope.vaCurrentIndex = current.indexes.start;

        //            }
        //        }
        //        console.log("controller setIndexes(", index, "): ", current);
        //    }

        //    function setDataWindow() {
        //        if ($scope.vaSrc) {
        //            self.dataWindow.length = 0;
        //            for (var i = current.indexes.start; i <= current.indexes.end; i++) {
        //                self.dataWindow.push($scope.vaSrc[i]);
        //            }
        //        }
        //    }

        //    elements.listBox.on("wheel", function (event) {
        //        console.log("on wheel:", event);
        //    });

        //    $scope.$watch("vaLength", function (newVal) {
        //        console.log("controller: $watch vaLength: ", newVal);
        //        if (newVal) {
        //            current.len = newVal - 0;
        //        } else {
        //            current.len = 0;
        //        }
        //        setIndexes(0);
        //        setDataWindow();
        //    });

        //    $scope.$watch("vaSrc", function (newVal) {
        //        console.log("controller: $watch vaSrc");
        //        if ($scope.vaSrc) {
        //            current.indexes.max = $scope.vaSrc.length - 1;
        //        }
        //        setIndexes();
        //        setDataWindow();
        //    });

        //}

        return {
            templateUrl: function () { return "app/vaDirectiveVirtualRepeater/template.html?t=" + Math.random(); },
            link: link,
            transclude: false,
            //controller: controller,
            //controllerAs: "ctrl",
            scope: {
                vaTemplate: "<"
                , vaSrc: "<"
                , vaLength: "<"
                , vaOnClick: "&"
                , vaOnHover: "&"
                , vaCurrentIndex: "="
            }
        }
    }

    angular.module("vaVirtualRepeaterDirective", []);

    angular.module("vaVirtualRepeaterDirective").directive("vaVirtualRepeater", fn);

})();
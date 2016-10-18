(function ($interval, $parse, $compile) {

    var options = { stepHeight: 10 };

    function getWindow(src, start, end) {
        var window = [];
        for (var i = start; i <= end; i++) {
            window.push(src[i]);
        }
        return window;
    }

    function getEnd(start, len, max) {
        var end = start + len;
        if (end > max) {
            end = max;
        }
        return end;
    }

    function getStart(scroll) {
        return Math.round( scroll / options.stepHeight );
    }

    function fn($interval, $parse, $compile) {

        var items = [];

        function link(scope, element, attr) {

            var elements = {
                box: element.find(".va-virtual-repeater"),
                spacer: element.find(".va-virtual-repeater div"),
                list: element.find(".va-virtual-repeater ul")
            };

            var current = {
                heights: { spacer: 0, box: elements.box.height() },
                scroll: 0,
                indexes: {start:0, end:0, max: 0},
                len: 10,
                intervals: { scroll: null },
                triggers: {buzzy: false}
            };


            scope.window = [];

            scope.styles = { spacer: { height: 0 }, ul: {marginTop: 0} };



            scope.$watch("vaTemplate", function () {
                //console.log("$watch vaTemplate");
                setTemplate();
            });

            scope.$watch("vaLength", function (newVal) {
                current.len = newVal - 0;
            });

            scope.$watch("vaSrc", function (nv) {
                //console.log("$watch vaSrc");
                if (nv) {
                    var len = nv.length;
                    current.heights.spacer = len * options.stepHeight + current.heights.box - options.stepHeight;
                    scope.styles.spacer.height = current.heights.spacer + "px";
                    current.indexes.max = len - 1;
                    setIndexes();
                }
            });

            scope.onHover = function (item, index) {
                if (scope.vaOnHover) {
                    scope.vaOnHover({ obj: { index: index, item: item } });
                }
            };

            scope.onClick = function (item, index, event) {
                if (scope.vaOnClick) {
                    //console.log("event: ", event);
                    scope.vaOnClick({ obj: { index: index, item: item, event: event } });
                }
            };

            elements.box.on("scroll", function (e) {
                var ntrvl = 1;
                if (current.triggers.buzzy) {
                    ntrvl = 30;
                    $interval.cancel(current.intervals.scroll);
                }
                current.scroll = elements.box[0].scrollTop;
                scope.styles.ul.marginTop = current.scroll + "px";
                
                current.intervals.scroll = $interval(function () {
                    current.triggers.buzzy = true;
                    $interval(function () {
                        setIndexes();
                        current.triggers.buzzy = false;
                    }, 1, 1);

                }, ntrvl, 1);
                
                //scope.$apply();
            });

            //elements.list.on("click", function (e) {
            //    console.log("click e=", e);
            //});

            function setIndexes() {
                current.indexes.start = getStart(current.scroll);
                current.indexes.end = getEnd(current.indexes.start, current.len, current.indexes.max);
                scope.window.length = 0;
                scope.window = getWindow(scope.vaSrc, current.indexes.start, current.indexes.end);
            }

            function setDataWindow() {

            }

            function setTemplate() {
                var tmpl = '<li ng-repeat="(index, item) in window" ng-mouseover="onHover(item, index)"  ng-click="onClick(item, index, $event)">' + scope.vaTemplate + '&nbsp;</li>';
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

            function isDataReady() {

            }

        }


        return {
            templateUrl: function () { return "app/vaDirectiveVirtualRepeater/template.html?t=" + Math.random(); },
            link: link,
            transclude: false,
            scope: {
                vaTemplate: "<?"
                , vaSrc: "<?"
                , vaLength: "<?"
                , vaOnClick: "&?"
                , vaOnHover: "&?"
            }
        }
    }

    angular.module("vaVirtualRepeaterDirective", []);

    angular.module("vaVirtualRepeaterDirective").directive("vaVirtualRepeater", fn);

})();
(function ($interval, $parse, $compile) {

    var s = document.getElementsByTagName('script');
    var scriptUrl = s[s.length - 1].src;
    var scriptPath = scriptUrl.replace(/(.*\/)(.*\.js)/i, "$1");
    var t = Math.random();

    function fn($interval, $parse, $compile) {

        var items = [];

        function link(scope, element, attr) {

            console.log("vaDirVirtRep");

            var elements = {
                listBox:    element.find(".va-list")
                , list:     element.find(".va-list ul")
                , box:      element.find(".va-virtual-repeater")
                , spacer:   element.find(".va-scroll div")
                , scroll:   element.find(".va-scroll")
            };

            var current = {
                len: 10
                , indexes: { start: 0, end: 0, max: 0 }
                , heights: { box: 0, spacer: 0 }
                , kScroll: 1
                , kReverseScroll: 1
                , intervals: { scroll: null }
                , maxScroll: 0
                , trigger: false
            };

            current.heights.box = elements.box.height();

            scope.window    = [1, 2, 3];
            scope.hght      = { "height": "100%" };
            scope.scroll    = 0;
            scope.spacerH   = 0;

            elements.scroll.on("scroll", function () {
                //if(current.trigger){
                //    current.trigger = false;
                //}else{
                    if (current.intervals.scroll) {
                        $interval.cancel(current.intervals.scroll);
                    }
                    current.intervals.scroll = $interval(function () {
                        var scroll = elements.scroll.scrollTop() - 0;
                        scope.scroll = scroll;
                        setIndexes(Math.round(scroll * current.kReverseScroll));
                        setWindow();
                    }, 3, 1);
                //}
            });

            elements.box.on("wheel", function (event) {
                var wheel = event.originalEvent.deltaY;
                //console.log("wheel: ", wheel);
                scope.$apply(function () {
                    if (wheel > 0) {
                        setIndexes(current.indexes.start + 1);
                        setScroll();
                        setWindow();
                    }
                    if (wheel < 0) {
                        setIndexes(current.indexes.start - 1);
                        setScroll();
                        setWindow();
                    }
                });
                return false;
            });

            scope.$watch("vaTemplate", function (newValue) {
                console.log("$watch vaTemplate", newValue);
                if (newValue) {
                    setTemplate(newValue);
                } else {
                    setTemplate('{{item}}');
                }
            });

            scope.$watch("vaLength", function (newVal) {
                if (newVal) {
                    current.len = newVal - 0;
                }
                setIndexes();
                if (scope.vaSrc && scope.vaSrc.length > 0) {
                    setWindow();

                    current.trigger = false;
                    $interval(function () {
                        //current.heights.box = elements.box.height();
                        $interval(function () {
                            setHeight();
                            setScroll();
                        }, 0, 1);
                    }, 0, 1);
                } else {
                    scope.window.length = 0;
                }

                
                console.log("$watch vaLength = ", current.len);
            });

            scope.$watch("vaSrc", function (newValue) {
                if (newValue) {
                    //if (current.indexes.max != newValue.length - 1) {
                        current.indexes.max = newValue.length - 1;
                        setIndexes();
                        setWindow();
                        current.trigger = false;

                            
                            $interval(function () {
                                setHeight();
                                setScroll();
                            }, 0, 1);

                    //}
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

            function setTemplate(template) {
                var tmpl = '<li ng-repeat="(index, item) in window" ng-mouseover="onHover(item, index)"  ng-click="onClick(item, index)">' + template + '&nbsp;</li>';
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

            function setIndexes(start) {
                if (!scope.vaSrc || !current.len) {
                    current.indexes.start = 0;
                    current.indexes.end = 0;
                    current.indexes.max = 0;
                    return;
                }
                if (start != undefined && start >= 0) {
                    current.indexes.start = start;
                }
                if (current.indexes.start > current.indexes.max) {
                    current.indexes.start = current.indexes.max;
                    current.indexes.end = current.indexes.max;
                } else {
                    current.indexes.end = current.indexes.start + current.len - 1;
                    if (current.indexes.end > current.indexes.max) {
                        current.indexes.end = current.indexes.max;
                    }
                }
                scope.vaCurrentIndex = current.indexes.start;
            }

            function setWindow() {
                scope.window.length = 0;

                    for (var i = current.indexes.start; i <= current.indexes.end; i++) {
                        scope.window.push(scope.vaSrc[i]);
                    }


            }

            function setHeight() {
                current.kScroll = scope.vaSrc.length / current.len;
                if (current.kScroll > 10) {
                    current.kScroll = 10;
                }
                //scope.hght = { "height": current.kScroll * 100 + "%" };
                elements.spacer.height(current.kScroll * current.heights.box);
                console.log(current.kScroll * current.heights.box, " / ", current.heights.box);
                scope.spacerH = current.heights.spacer = current.kScroll * current.heights.box;
                current.maxScroll = current.heights.spacer - current.heights.box;
                current.kReverseScroll = scope.vaSrc.length / current.maxScroll;
            }

            function setScroll() {
                var scroll = current.indexes.start / current.kReverseScroll;
                //console.log("scroll", scroll);
                current.trigger = true;
                elements.scroll.scrollTop(scroll);
            }

        }





        return {
            templateUrl: function () { return scriptPath + "template.html?t=" + t },
            link: link,
            transclude: false,
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
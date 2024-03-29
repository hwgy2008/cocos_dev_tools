(function (global, factory) {
    if (typeof exports === "object" && exports)
    {
        factory(exports); // CommonJS
    }
    else if (typeof define === "function" && define.amd)
    {
        define(['exports'], factory); // AMD
    }
    else
    {
        global['tl.ui.TreeList'] = factory({}); // <script>
    }
}(this, function (exports) {
    //var Tree = function(root){
    exports = function (root) {
        'use strict';
        var me = this;
        me.element = null;
        me.selected = null;

        (function init() {
            add_css('\
            .clear:after{ content: ".";clear: both;display: block;height: 0;visibility: hidden;font-size: 0;line-height: 0; }\
            .tl-ui-scroll{overflow-y:overlay;} .tl-ui-scroll::-webkit-scrollbar {height:8px;overflow:visible;width:8px;background-color:transparent} .tl-ui-scroll::-webkit-scrollbar-thumb {border-radius:8px;background-color:rgba(0,0,0,0.2);}\
            @-moz-document url-prefix() { .tl-ui-scroll{overflow-y:scroll} }\
            \
            /* tree css */\
            .tl-ui-tree {display:block; overflow: auto; position: relative;}\
            .tl-ui-tree:focus{ outline: 0px !important; }\
            .tl-ui-tree .nd{ -moz-user-select:none; -webkit-user-select:none; cursor: default; color: #339; font-size: 12px; overflow: hidden; font-family: Consolas, Lucida Console, monospace; line-height: 16px; padding: 1px 0px 0px 16px}\
            \
            .tl-ui-tree .nd b{ font-weight:100; display: block}\
            .tl-ui-tree .nd .c1{ color:#969 }\
            .tl-ui-tree .nd .c2{ color:#FF3030 }\
            .tl-ui-tree .nd b:hover:before{ content:" "; pointer-events: none; position:absolute; left:2px; right:2px; height: 16px; background-color:rgba(128,192,255,0.12); border-radius: 4px;}\
            \
            .tl-ui-tree .nd[selected="true"] > b:before{ content:" "; pointer-events: none; position:absolute; left:0px; right:0px; height: 16px; z-index:-1; background-color:rgba(51,128,224,0.8); border-radius: 0px; }\
            .tl-ui-tree .nd[selected="true"] > b{ color:#fff }\
            .tl-ui-tree .nd[selected="true"] > b > *{ color:#fff }\
            \
            .tl-ui-tree:hover .nd[selected="true"] > b:before{ background-color:rgba(51,128,224,.9); }\
            \
            .tl-ui-tree .nd:last-child {}\
            \
            .tl-ui-tree .c{padding-left:6px !@important}\
            .tl-ui-tree .c > .nd{display:none}\
            .tl-ui-tree .c:before,\
            .tl-ui-tree .e:before{ content:" "; pointer-events:none; display:inline-block; position:relative; left:-4px; top:4px; width:0px; height:0px; border-color:transparent; border-style: solid;float:left}\
            \
            .tl-ui-tree .c:before{ border-width: 4px 0 4px 8px;border-left-color: rgba(51,51,51,.5); }\
            .tl-ui-tree .e:before{ border-width: 8px 4px 0px 4px;border-top-color: rgba(51,51,51,.5); }\
            .tl-ui-tree .c[selected="true"]:before { border-left-color: #fff; }\
            .tl-ui-tree .e[selected="true"]:before { border-top-color: #fff; }\
                ');

            var el = document.createElement('DIV');
            el.className = 'tl-ui-tree';
            el.id = parseInt((new Date).getTime());
            el.setAttribute('tabindex', 1);
            (root || document.body).appendChild(el);
            me.element = el;

            el.addEventListener('mouseover', function (e) {
                var nd_dom = e.target;
                (nd_dom.tagName == 'EM') && (nd_dom = nd_dom.parentNode.parentNode);
                (nd_dom.tagName == 'SPAN' || nd_dom.tagName == 'B' || nd_dom.tagName == 'I') && (nd_dom = nd_dom.parentNode); // get node dom, <div><b>name ...

                me.on_hover && me.on_hover(nd_dom);
            });

            el.addEventListener('mouseout', function (e) {
                e.stopPropagation();
                e.preventDefault();

                me.on_out && me.on_out();
            });

            el.addEventListener('mousedown', function (e) {
                e.stopPropagation();
                e.preventDefault();
                var nd_dom = e.target;

                (nd_dom.tagName == 'EM') && (nd_dom = nd_dom.parentNode.parentNode);
                (nd_dom.tagName == 'SPAN' || nd_dom.tagName == 'B' || nd_dom.tagName == 'I') && (nd_dom = nd_dom.parentNode); // get node dom, <div><b>name ...
                select_item(nd_dom);
                el.focus();
                //console.log(nd_dom, nd_dom.__nodes);
            });

            function find_parent_sibling(nd) {
                var f = function (_n) {
                    var n = _n.nextSibling;
                    //if (!n) return;
                    if (_n.className.indexOf('e') > -1)
                    {// && me.selected.__data && me.selected.__data.nodes && me.selected.__data.nodes.length){
                        n = _n.getElementsByClassName('nd')[0];
                    }
                    return n;
                };
                return f(nd);
            }

            el.addEventListener('keydown', function (e) {
                if (!me.selected) return;
                if (e.keyCode == 38)
                { // up
                    var n = me.selected.previousSibling;
                    // 处理某个元素移动向上一个已经展开的情况
                    if (!n || n.tagName == 'B')
                    {
                        n = me.selected.parentNode;
                        if (n.id == me.element.id) return;
                    }
                    // 处理某个子元素移动向上一个已经展开的元素的情况
                    else if (n.className.indexOf('e') > -1)
                    { // has class e
                        var i = 0, tmp_n = n, nd_arr, nd_len;
                        while (i < 1000)
                        { // max 1000 times
                            nd_arr = tmp_n.getElementsByClassName('nd');
                            nd_len = nd_arr.length;
                            tmp_n = nd_arr[nd_len - 1]; // last child
                            if (tmp_n.className.indexOf('e') > -1)
                            { /*continue*/
                            }
                            else
                            {
                                n = tmp_n;
                                break;
                            }
                            i++;
                        }
                    }
                    if (!n) return;
                    select(n);
                }
                else if (e.keyCode == 40)
                { // down
                    var n = me.selected.nextSibling;
                    // 处理某个元素移动向下一个已经展开的情况
                    if (me.selected.className.indexOf('e') > -1)
                    { // has class e
                        n = me.selected.getElementsByClassName('nd')[0];
                    }
                    // 处理已经展开的某个子元素移动向下一个元素的情况
                    else if (!n)
                    {
                        var i = 0, tmp_n = me.selected;
                        while (i < 1000)
                        { // max 1000 times
                            tmp_n = tmp_n.parentNode;
                            if (tmp_n.id == me.element.id) return; // is root
                            if (tmp_n.nextSibling)
                            {
                                n = tmp_n.nextSibling;
                                break;
                            }
                            i++;
                        }
                    }
                    if (!n) return;
                    select(n);
                }
                else if (e.keyCode == 39)
                {
                    toggle(me.selected);
                }
            });

        })();

        function add_css(v) {
            var d = document, b = d.createElement("style"), s = d.styleSheets;
            for (var i in s)
            {
                if (s[i].textContent == v) return;
            }
            b.appendChild(d.createTextNode(v)), d.head.appendChild(b);
        }

        function toggle(nd_dom) {
            var callback = function () {
                if (nd_dom.__is_not_inited && nd_dom.__data && nd_dom.__data.nodes)
                {
                    insert(nd_dom.__data.nodes, nd_dom);
                    nd_dom.__is_not_inited = false;
                }
                if (nd_dom.className == 'nd e')
                {
                    nd_dom.className = 'nd c'
                }
                else if (nd_dom.className == 'nd c')
                {
                    nd_dom.className = 'nd e';
                }
                me.on_after_toggle && me.on_after_toggle(nd_dom);
            };
            // toggle
            me.on_before_toggle ? me.on_before_toggle(nd_dom, callback) : callback();
        }

        function select(nd_dom) {
            // select a node
            me.selected && me.selected.removeAttribute && me.selected.removeAttribute('selected');
            nd_dom.setAttribute('selected', true);
            me.selected = nd_dom;
            me.on_select && me.on_select(nd_dom);
        }

        function select_item(nd_dom) {
            select(nd_dom);
            toggle(nd_dom);
        }

        me.select_item = select_item;

        function explore(path) {
            path = path || [];
            var nd, nd_dom;

            var callback = function () {
                if (nd_dom.__is_not_inited && nd_dom.__data && nd_dom.__data.nodes)
                {
                    insert(nd_dom.__data.nodes, nd_dom);
                    nd_dom.__is_not_inited = false;
                }
                if (nd_dom.className == 'nd c')
                {
                    nd_dom.className = 'nd e'
                }
                find_by_path_and_expand_node();
                me.on_after_toggle && me.on_after_toggle(nd_dom);
            };

            function find_by_path_and_expand_node() {
                if (path.length <= 0)
                {
                    return;
                }
                nd = path.shift();
                nd_dom = document.getElementById(nd.id);

                me.on_before_toggle ? me.on_before_toggle(nd_dom, callback) : callback();
            }

            find_by_path_and_expand_node();
            select(nd_dom); // select a nd_dom
            me.element.parentNode.scrollTop = nd_dom.offsetTop; // scroll to selection

        };
        me.explore = explore;

        function remove(d, parent) {
            var nd, nd_dom;
            if (typeof parent == 'number' || typeof parent == 'string')
            {
                parent = document.getElementById(parent);
            }
            if (parent == null) return;
            nd = d || {};
            nd_dom = document.getElementById(nd.id);
            nd_dom && parent.removeChild(nd_dom);
            me.on_remove && me.on_remove(nd, parent);
        }

        me.remove = remove;

        function insert(d, parent) {
            var nd, nd_dom;
            if (typeof parent == 'number' || typeof parent == 'string')
            {
                parent = document.getElementById(parent);
            }
            if (parent == null) return;

            function ir() {
                nd_dom = document.createElement('DIV');
                nd_dom.id = nd.id || null;
                nd_dom.className = 'nd';
                nd_dom.setAttribute('name', nd.text);
                var realName = "";
                if (nd.attr)
                {
                    realName = nd.attr && nd.attr["name"] && nd.attr["name"]["value"] || "";
                    if (!realName)
                        realName = nd.attr && nd.attr["_name"] && nd.attr["_name"]["value"] || "";
                    if (realName === "default")
                        realName = "";

                    var isBaseScene = nd.attr["baseScene"] && nd.attr["baseScene"]["value"];
                    if (isBaseScene)
                    {
                        var className = nd.attr["baseScene"]["realClassName"];
                        var prefix = className ? "[" + className + "] ": "[Scene] ";
                        realName = prefix + realName;
                    }
                    else
                    {
                        var isDialogComp = nd.attr["dialogComponent"] && nd.attr["dialogComponent"]["value"];
                        if (isDialogComp === "true")
                        {
                            var className = nd.attr["dialogComponent"]["realClassName"];
                            var prefix = className ? "[" + className + "] ": "[DialogComp] ";
                            realName = prefix + realName;
                        }
                        else
                        {
                            var isBaseComp = nd.attr["baseComponent"] && nd.attr["baseComponent"]["value"];
                            if (isBaseComp === "true")
                            {
                                var className = nd.attr["baseComponent"]["realClassName"];
                                var prefix = className ? "[" + className + "] ": "[BaseComp] ";
                                realName = prefix + realName;
                            }
                        }
                    }

                    var isFcaEffect = nd.attr["FcaEffect"] && nd.attr["FcaEffect"]["value"];
                    if (isFcaEffect)
                    {
                        realName = "[FcaEffect] " + realName;
                    }
                    else
                    {
                        var isFcaActor = nd.attr["FcaActor"] && nd.attr["FcaActor"]["value"];
                        if (isFcaActor)
                        {
                            realName = "[FcaActor] " + realName;
                        }
                    }

                    var isSpineEffect = nd.attr["SpineEffect"] && nd.attr["SpineEffect"]["value"];
                    if (isSpineEffect === "true")
                    {
                        realName = "[SpineEffect] " + realName;
                    }
                    else
                    {
                        var isSpineActor = nd.attr["SpineActor"] && nd.attr["SpineActor"]["value"];
                        if (isSpineActor === "true")
                        {
                            realName = "[SpineActor] " + realName;
                        }
                    }
                }

                var csbName = nd.attr["csbName"] && nd.attr["csbName"].value;
                if (realName && csbName)
                {
                    nd_dom.innerHTML = '<b>' + ('<em class="c1">' + realName + '</em>: ') + nd.text + ('<em class="c2">' + ' ' + csbName + '</em>') + '</b>';
                }
                else
                {
                    nd_dom.innerHTML = '<b>' + (realName ? ('<em class="c1">' + realName + '</em>: ') : '') + nd.text || '..' + '</b>';
                }

                // set the source data
                nd && (typeof nd == 'object') && (nd_dom.__data = nd);
                if (nd && nd.nodes && nd.nodes.length)
                {
                    //nd_dom.__nodes = nd.nodes;
                    nd_dom.className += ' c'; // collapsed, expanded
                    nd_dom.__is_not_inited = true;
                }
                parent.appendChild(nd_dom);
            }

            if (d.constructor.name == 'Array')
            {
                for (var i = 0, j = d.length; i < j; i++)
                    nd = d[i], ir();
            }
            else
            {
                nd = d, ir();
            }
            me.on_insert && me.on_insert(d, parent);
        }

        me.insert = insert;

        function clear_children(el) {
            el = el || me.element;
            el.innerHTML = String(el.innerHTML).match(/<b>.*?<\/b>/)[0];  // reserve title and clean nodes
            //el.innerHTML = String(el.innerHTML).match(/<b>\S+<\/b>/)[0];  // reserve title and clean nodes
        }

        me.clear_children = clear_children;

        function clear(el) {
            el = el || me.element;
            el.innerHTML = '';  // clear
            me.selected = null;
        }

        me.clear = clear;

        function update(d, el) {
            el = el || me.element;
            el.innerHTML = '';  // clear
            me.selected = null;
            insert(d, el);
        }

        me.update = update;

        return me;
    };

    return exports;
}));
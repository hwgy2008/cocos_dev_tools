// inject
/*
(function(){
    var tmpl = '\
        <div></div><div></div>\
    ';
    
    var el = document.createElement('div');
    el.innerHTML = tmpl;
    el.className == 'clear';
    document.body.appendChild(el);
    window.part_tool = el.children[0];
    window.part_game = el.children[1];
    
    setTimeout(function(){
    
    window.part_game.appendChild(cc.container);
    cc.view._frame = window.part_game;
    //cc.view._frame = window.part_game;//cc.container.parentNode;
    cc.view._resizeEvent();
    },500);
})();
*/
(function (I18n) {
    I18n = I18n || function (t) {
        return String(t)
    };

    var tmpl = '\
            <style>\
                .tl-ui-tabs{ background-color:#ddd; height:30px; overflow:hidden }\
                .tl-ui-tabs .iconfont{ font-size:16px }\
                .tl-ui-tabs a{ font:normal 14px "Helvetica Neue", Helvetica, Arial, sans-serif; color:#666; text-decoration:none; }\
                .tl-ui-tabs > a{ line-height:30px; height:30px; padding:0px 10px; text-decoration:none; display:block; float:left }\
                .tl-ui-tabs > a.sel{ background-color:#fff; color:#333; font-weight:bold; box-shadow:0px 0px 6px rgba(0,0,0,.5) }\
                .tl-ui-tabs > a:hover{ color:#000; }\
                .tl-ui-tools { font:normal 14px "Helvetica Neue", Helvetica, Arial, sans-serif; line-height:26px; border-bottom:1px solid #eee; }\
                .tl-ui-tools > a{ color:#999; padding:0 8px; text-decoration:none; display:inline-block}\
                .tl-ui-tools > a:hover{ color:#666 }\
                .tl-ui-tools > a[name="btn-insp"]:focus{ background-color: rgba(51,128,224,.6); color:#fff; box-shadow:inset 0px 0px 0px 4px #fff; }\
                .clear:after{ content: ".";clear: both;display: block;height: 0;visibility: hidden;font-size: 0;line-height: 0; }\
                .jiathis_style .jiadiv_01 .link_01:first-child{ display:none !important }\
                .a2a_menu {font-size:13px !important; border-radius: 0px !important; }\
                .a2a_menu a {font-size:13px !important; border-radius: 0px !important; }\
                a.a2a_i, i.a2a_i{ line-height:20px !important; font-size:13px !important; padding: 2px 6px !important; }\
                a.a2a_i .a2a_svg, a.a2a_more .a2a_svg {background-size: 100% !important;height: 20px !important;line-height: 20px !important;width: 20px !important; }\
                @font-face {\
                  font-family: "uxiconfont";\
                  src: url("http://t.tbcdn.cn/g/thx/brix/fonts/uxiconfont.eot");\
                  src: url("http://t.tbcdn.cn/g/thx/brix/fonts/uxiconfont.eot?#iefix") format("embedded-opentype"), /* IE6-IE8 */\
                   url("http://t.tbcdn.cn/g/thx/brix/fonts/uxiconfont.woff") format("woff"), /* chrome、firefox */\
                   url("http://t.tbcdn.cn/g/thx/brix/fonts/uxiconfont.ttf") format("truetype"), /* chrome、firefox、opera、Safari, Android, iOS 4.2+*/\
                   url("http://t.tbcdn.cn/g/thx/brix/fonts/uxiconfont.svg#svgFontName") format("svg");/* IE9*/\
                  /* iOS 4.1- */\
                }\
                .iconfont {font-family: "uxiconfont" !important;font-style: normal; font-weight:normal; -webkit-font-smoothing: antialiased;-moz-osx-font-smoothing: grayscale;}\
            </style>\
            <div class="tl-ui-tabs clear">\
                <a name="tab-dock" title="' + I18n('Dock to left/top/right/bottom') + '" style="float:right" href="javascript:void(0)"><em class="iconfont">Ġ</em> ' + I18n('Dock') + '</a>\
                <a name="tab-elements" href="javascript:void(0)" class="sel">' + I18n('Elements') + '</a>\
                <a name="tab-profiles" href="javascript:void(0)">' + I18n('Profiles') + '</a>\
            </div>\
            <div class="clear" style="position:relative;height:200px;right:0px;left:0px;z-index:9999;background-color:#fff">\
                <div id="container-elements" style="height:100%;">\
                    <div class="tl-ui-tools">\
                        <a href="javascript:void(0)" name="btn-insp"> ' + I18n('Inspect Element') + '</a>\
                        <a href="javascript:void(0)" name="btn-refresh"> ' + I18n('Refresh') + '</a>\
                    </div>\
                    <div id="left" class="tl-ui-scroll" style="width:60%;height:100%;float:left;">\
                    </div>\
                    <div id="right" class="tl-ui-scroll" style="width:40%;height:100%;float:left;box-shadow:inset 1px 0px 0px silver;">\
                    </div>\
                </div>\
                <div id="container-profiles" class="tl-ui-scroll" style="display:none;height:100%;"></div>\
            </div>\
    ';

    var el = document.createElement('div');
    el.style.backgroundColor = '#fff';
    el.style.zIndex = 9999;
    el.style.boxShadow = '0px 0px 0px 1px #ccc';
    el.style.overflow = 'hidden';
    el.innerHTML = tmpl;
    document.body.appendChild(el);
    document.body.style.overflow = 'auto';
    window.scrollTo(0, document.body.clientHeight);

    var left = document.getElementById('left'),
        right = document.getElementById('right'),
        container_elements = document.getElementById('container-elements'),
        container_profiles = document.getElementById('container-profiles'),
        tabs = el.children[1],
        containers = el.children[2],
        btn_elem = document.getElementById('btn_elem'),
        btn_dock = tabs.children[0];

    // // cn     
    // if (I18n.lang == 'zh-cn'){
    //     window.jiathis_config={
    //         data_track_clickback:true,
    //         url:"http://h5.cocoachina.com/static/cocos-devtools/",
    //         summary:" ",
    //         title:"Html5游戏调试神器全新出炉！调试Cocos2d游戏就这么任性！ #CocosDevtools#",
    //         pic:"http://h5.cocoachina.com/static/cocos-devtools/a.jpg",
    //         shortUrl:false,
    //         hideMore:false
    //     }
    //     var jia_script = document.createElement('SCRIPT');
    //     document.body.appendChild(jia_script);
    //     jia_script.src = 'http://v3.jiathis.com/code/jia.js?uid=1980395';
    // // en
    // }else{
    //     function my_addtoany_onready() {
    //         a2a_config.target = '.share-this';
    //         a2a.init('page');
    //     }

    //     // Setup AddToAny "onReady" callback
    //     window.a2a_config = {};
    //     a2a_config.tracking_callback = {
    //         ready: my_addtoany_onready
    //     };
    //     a2a_config.linkname="A new weapon for debugging cocos2d apps.";
    //     a2a_config.linkurl="http://h5.cocos.com/static/cocos-devtools/index-en.html";        
    //     // Additional a2a_config properties may go here

    //     // Load AddToAny script asynchronously
    //     (function(){
    //         var a = document.createElement('script');
    //         a.type = 'text/javascript';
    //         a.async = true;
    //         a.src = 'http://static.addtoany.com/menu/page.js';
    //         var s = document.getElementsByTagName('script')[0];
    //         s.parentNode.insertBefore(a, s);
    //     })();

    // }

    el.addEventListener('click', function (e) {
        //e.stopPropagation();
        //e.preventDefault();
        var d = e.target,
            n = d.name;

        function clear_tabs() {
            for (var i = 0, j = tabs.children.length; i < j; i++)
            {
                if (tabs.children[i].tagName == 'A')
                    tabs.children[i].className = '';
            }
            for (var i = 0, j = containers.children.length; i < j; i++)
            {
                containers.children[i].style.display = 'none';
            }
        }

        if (n == 'tab-elements')
        {
            clear_tabs();
            d.className = 'sel';
            container_elements.style.display = 'block';

        }
        else if (n == 'tab-profiles')
        {
            clear_tabs();
            d.className = 'sel';
            container_profiles.style.display = 'block';

        }
        else if (n == 'btn-refresh')
        {
            try
            {
                window._cocos_devtools.ie.on_update(null, window._cocos_devtools.ie.get_node_children())
            } catch (e)
            {
            }
        }
        else if (n == 'btn-insp')
        {
            try
            {
                window._cocos_devtools.ie.begin_inspect()
            } catch (e)
            {
            }
        }
    });

    // update tree

    btn_dock.onclick = function () {
        btn_dock.dock = btn_dock.dock || 0;
        btn_dock.dock++;
        if (btn_dock.dock == 4)
        {
            btn_dock.dock = 0;
        }

        if (btn_dock.dock == 0)
        {
            change_dock('bottom');
            localStorage.setItem('change_dock', 'bottom');
        }
        else if (btn_dock.dock == 1)
        {
            change_dock('left');
            localStorage.setItem('change_dock', 'left');
        }
        else if (btn_dock.dock == 2)
        {
            change_dock('top');
            localStorage.setItem('change_dock', 'top');
        }
        else if (btn_dock.dock == 3)
        {
            change_dock('right');
            localStorage.setItem('change_dock', 'right');
        }
    };

    function change_dock(mode) {
        if (mode == 'bottom')
        {
            el.style.position = 'static';
            el.style.width = 'auto';
            el.style.height = 'auto';
            el.style.top = 'auto';
            el.style.right = 'auto';

            left.style.width = '60%';
            left.style.height = 'calc(100% - 28px)';
            left.style.float = 'left';

            right.style.width = '40%';
            right.style.height = 'calc(100% - 28px)';
            right.style.float = 'left';

            el.children[2].style.height = '200px';
            el.parentNode.appendChild(el);
            window.scrollTo(0, document.body.clientHeight);
        }
        else if (mode == 'left')
        {
            el.style.position = 'absolute';
            el.style.width = '25%';
            el.style.height = '100%';
            el.style.top = '0px';
            el.style.right = 'auto';

            left.style.width = '100%';
            left.style.height = 'calc(60% - 30px)';
            left.style.float = 'none';

            right.style.width = '100%';
            right.style.height = '40%';
            right.style.float = 'none';

            el.children[2].style.height = 'calc(100% - 30px)';
            el.parentNode.appendChild(el);
            window.scrollTo(0, 0);
        }
        else if (mode == 'top')
        {
            el.style.position = 'relative';
            el.style.width = 'auto';
            el.style.height = 'auto';
            el.style.top = 'auto';
            el.style.right = 'auto';

            left.style.width = '60%';
            left.style.height = 'calc(100% - 28px)';
            left.style.float = 'left';

            right.style.width = '40%';
            right.style.height = 'calc(100% - 28px)';
            right.style.float = 'left';

            el.children[2].style.height = '200px';
            el.parentNode.insertBefore(el, el.parentNode.children[0]);
            window.scrollTo(0, 0);
        }
        else if (mode == 'right')
        {
            el.style.position = 'absolute';
            el.style.width = '25%';
            el.style.height = '100%';
            el.style.top = '0px';
            el.style.right = '0px';

            left.style.width = '100%';
            left.style.height = 'calc(60% - 30px)';
            left.style.float = 'none';

            right.style.width = '100%';
            right.style.height = '40%';
            right.style.float = 'none';

            el.children[2].style.height = 'calc(100% - 30px)';
            el.parentNode.appendChild(el);
            window.scrollTo(0, 0);
        }
    }

    // remember dock 
    (function () {
        var d = localStorage.getItem('change_dock') || 'bottom';
        change_dock(d);
        btn_dock.dock = {'bottom': 0, 'left': 1, 'top': 2, 'right': 3}[d];
    })();
})(I18n);

(function (_this) {
    var _cd = {};
    _this._cocos_devtools = _cd;

    // 暂时去掉判断，cocos初始化可能晚于插件
    // if (typeof window.cc == 'undefined')
    // {
    //     document.getElementById('left').innerHTML = 'Cocos2d-js engine is not loaded.';
    //     return;
    // }
    // ui
    var tt, at, cf, sp, // ui
        ie, cfps, sph; // inject

    tt = new _this['tl.ui.TreeList'](document.getElementById('left'));
    tt.on_hover = function (nd) {
        nd && nd.__data && ie && ie.draw_rect(nd.__data.id, tt.selected ? tt.selected.id : null);
    };
    tt.on_out = function () {
        ie && ie.draw_rect(null, tt.selected ? tt.selected.id : null);
    };
    tt.on_select = function (nd) {
        nd && nd.__data && at && at.update(nd.__data.attr);
        nd && nd.__data && ie && ie.draw_rect(nd.__data.id, tt.selected ? tt.selected.id : null);
    };
    tt.on_before_toggle = function (nd, next) {
        // clear current node's children
        tt.clear_children(nd);
        // get new data, and set to the node's __data, it's will re-load data as tree when next expanded
        nd.__is_not_inited = true;
        ie.get_node_children(nd.id, function (v) {
            nd.__data.nodes = v;
            next();
        });
    };
    tt.on_after_toggle = function (nd) {
        if (nd.children.length < 2)
        { // index 0 is <b>title</b>
            nd.className = 'nd';
        }
    };
    tt.on_remove = function (nd) {
        // remove an arrow when a node is void.
        var p = document.getElementById(nd.parentId);// find parent
        if (p)
        {
            p.__data.nodes = p.__data.nodes || [];
            if (p.__is_not_inited)
            {
                p.__data.nodes.pop();
            }
            else
            { // find by id
                for (var i = 0, j = p.__data.nodes.length; i < j; i++)
                {
                    if (p.__data.nodes[i] && p.__data.nodes[i].id == nd.id)
                    {
                        p.__data.nodes.slice(i, 1);
                        break;
                    }
                }
            }
            //console.log(p.children, p.__data.nodes)
            if (p.className == 'nd c' && p.__data.nodes.length == 0)
            { // index 0 is <b>title</b>
                p.className = 'nd';
            }
            else if (p.className == 'nd e' && p.children.length < 2)
            {
                p.className = 'nd';
            }
        }
        if (tt && nd && tt.selected && nd.id == tt.selected.id)
        {
            at.clear()
        }
    };
    tt.on_insert = function (nd) {
        // show an arrow when a collapsed node is void.
        var p = document.getElementById(nd.parentId);// find parent
        if (p)
        {
            p.__data.nodes = p.__data.nodes || [];
            if (p.__data.nodes.length == 0) p.__is_not_inited = true;
            if (p.className == 'nd')
            {
                p.className = 'nd c';
            }
            p.__data.nodes.push(nd); // add a place-holder
        }
    };

    at = new _this['tl.ui.AttrTable'](document.getElementById('right'));
    at.on_change = function (nd, attr, value) {
        if (tt.selected)
        {
            var attr_obj = {};// write an object for set attribute
            attr_obj[attr] = value;
            //tt.selected.__data.attr[attr] = value; // set the tree data
            tt.selected.__data.attr[attr].value = value; // set the tree data
            ie.modify_node(tt.selected.__data.id, attr_obj); // set the canvas
        }
    };

    cf = new _this['tl.ui.ChartFPS'](null, null, document.getElementById('container-profiles'));
    cf.element.style.width = '100%';
    cf.element.style.height = '100px';

    sp = new _this['tl.ui.ScaleProfiles'](document.getElementById('container-profiles'));
    sp.on_change = function (msg, value) {
        if (msg == 'speed')
        {
            sph && sph.adjust && sph.adjust(value);
        }
    };

    //--------------------------------------------
    // inject

    var FpsCalc = function () {
        this.frames = 0;
        this.lastUpdate = Date.now();
        this.tick = function () {
            this.frames++;
            var now = Date.now();
            var deltaTime = (now - this.lastUpdate) / 1000;
            if (deltaTime > cc.DIRECTOR_FPS_INTERVAL)
            {
                frameRate = this.frames / deltaTime;
                this.frames = 0;
                this.lastUpdate = now;
                return frameRate.toFixed(1);
            }
        }
    };
    cfps = new FpsCalc();
    cc.eventManager.addCustomListener(cc.Director.EVENT_AFTER_DRAW, function () {
        cf.fps(cfps.tick());
    });

    var SpeedHook = function () {
        return {
            speed: 1,
            bind: function () {
                var _this = this;
                if (cc.director.__calculateDeltaTime) return;
                cc.director.__calculateDeltaTime = cc.director.calculateDeltaTime;
                cc.director.calculateDeltaTime = function () {
                    cc.director._deltaTime = (1 / cc.game.config.frameRate) * _this.speed;
                    cc.director._lastUpdate = Date.now();
                }
            },
            adjust: function (t) {
                this.bind();
                this.speed = t;
            },
            unbind: function () {
                cc.director.calculateDeltaTime = cc.director.__calculateDeltaTime;
            }
        }
    };
    sph = new SpeedHook();

    ie = new InspectElement();

    ie.on_update = function (sc, scene_data) {
        ie.draw_rect(null, null);
        at.clear();
        tt.update(scene_data);
        // console.log('index.web update',scene_data);
    };
    ie.on_addChild = function (node, node_data, is_root) {
        //console.log('addChild',node,node_data,node_data.parentId);
        if (is_root)
        {
            tt.insert(node_data, tt.element); // add to root of tree
        }
        else
        {
            tt.insert(node_data, node_data.parentId); // add to a node of tree
        }
    };
    ie.on_removeChild = function (node, node_data, is_root) {
        //console.log('removeChild',node,node_data,node_data.parentId);
        if (is_root)
        {
            tt.remove(node_data, tt.element); // remove from root of tree
        }
        else
        {
            tt.remove(node_data, node_data.parentId); // remove from a node of tree
        }
    };
    ie.on_inspect_node = function (node_data, node_fullpath) {
        tt.explore(node_fullpath);
    };
    ie.start();

    // load data first time
    ie.on_update(null, ie.get_node_children());


    // get global
    _cd.tt = tt, _cd.at = at, _cd.ie = ie;
    // current selected node
    _cd.__defineGetter__('curr', function () {
        return ie.get_selected()
    });
})(this);


// var _hmt = _hmt || [];
// _hmt.push(['_trackEvent', 'Open', 'CocosDevtools']);
// (function() {
//   var hm = document.createElement("script");
//   hm.src = "//hm.baidu.com/hm.js?cf6e56197d15d6d01685b29c92d56831";
//   var s = document.getElementsByTagName("script")[0]; 
//   s.parentNode.insertBefore(hm, s);
// })();
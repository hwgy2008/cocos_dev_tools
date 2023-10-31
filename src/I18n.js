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
        global['I18n'] = factory({}); // <script>
    }
}(this, function (exports) {
    var lang = 'en-us';
    lang = String(typeof window && window.navigator && window.navigator.userLanguage || window.navigator.language || 'en-us').toLowerCase();

    var res = {};
    res['en-us'] = {};
    res['zh-cn'] = {
        'Dock to left/top/right/bottom': 'Dock to left/top/right/bottom',
        'Dock': 'Dock',
        'Elements': 'Elements',
        'Profiles': 'Profiles',
        'Inspect Element': 'Inspect Element',
        'Refresh': 'Refresh',
        'Set speed:': 'Set speed:',

        '_': '_' // rear
    };

    exports = function (t) {
        if (!res[lang]) return String(t);
        return String(res[lang][t] || t);
    };

    exports.lang = lang;

    return exports;
}));
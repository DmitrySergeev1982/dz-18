// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"js/content.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Content = void 0;

var _list = require("./list");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Content = /*#__PURE__*/function () {
  function Content(content, item) {
    _classCallCheck(this, Content);

    this.item = item;
    this.content = content;

    this._init();
  }

  _createClass(Content, [{
    key: "_init",
    value: function _init() {
      this._render();
    }
  }, {
    key: "_clear",
    value: function _clear() {
      this.content.innerHTML = "";
    }
  }, {
    key: "_createEditButton",
    value: function _createEditButton(id) {
      var btnNode = document.createElement('button');
      btnNode.classList.value = 'btn btn-warning mt-auto';
      btnNode.textContent = 'Edit';
      btnNode.setAttribute('data-id', id);
      btnNode.addEventListener('click', this._clickEditBtn);
      return btnNode;
    }
  }, {
    key: "_clickEditBtn",
    value: function _clickEditBtn(event) {
      var id = event.currentTarget.getAttribute('data-id');
      var form = document.querySelector('#form');
      var titleField = form.querySelector('[name="title"]');
      var contentField = form.querySelector('[name="content"]');
      var idField = form.querySelector('[name="id"]');
      var dateField = form.querySelector('[name="date"]');
      form.setAttribute('data-method', 'PUT');
      fetch('/api/data', {
        method: 'GET'
      }).then(function (response) {
        return response.json();
      }).then(function (dataObj) {
        dataObj.list.forEach(function (item) {
          if (item.id == id) {
            titleField.value = item.title;
            contentField.value = item.content;
            idField.value = item.id;
            dateField.value = item.date;
            $('#formModal').modal('show');
          }
        });
      }).catch(function (error) {
        return console.error(error);
      });
    }
  }, {
    key: "_createDeleteButton",
    value: function _createDeleteButton(id) {
      var btnDeleteNode = document.createElement('button');
      btnDeleteNode.classList.value = 'btn btn-danger ml-2';
      btnDeleteNode.textContent = 'Delete';
      btnDeleteNode.setAttribute('data-id', id);
      btnDeleteNode.addEventListener('click', this._deletePost);
      return btnDeleteNode;
    }
  }, {
    key: "_deletePost",
    value: function _deletePost() {
      var id = event.currentTarget.getAttribute('data-id');
      var isConfirm = confirm('Вы точно хотите удалить пост?');
      if (!isConfirm) return;
      fetch("/api/data/".concat(id), {
        method: 'DELETE'
      }).then(function (response) {
        return response.json();
      }).then(function (dataObj) {
        var content = document.querySelector('#content');
        content.innerHTML = "";
        new _list.List(document.querySelector('#list'), dataObj.list);
      }).catch(function (error) {
        return console.error(error);
      });
    }
  }, {
    key: "_render",
    value: function _render(item) {
      var btnEdit = this._createEditButton(this.item.id);

      var btnDelete = this._createDeleteButton(this.item.id);

      var template = "\n      <h3>".concat(this.item.title, "</h3>\n      <h6 class=\"text-muted\">").concat(this.item.date, "</h6>\n      <p>").concat(this.item.content, "</p>\n    ");

      this._clear();

      this.content.innerHTML = this.content.innerHTML + template;
      var btnWrap = document.createElement('div');
      btnWrap.classList.value = 'mt-auto';
      btnWrap.append(btnEdit, btnDelete);
      this.content.append(btnWrap);
    }
  }]);

  return Content;
}();

exports.Content = Content;
},{"./list":"js/list.js"}],"js/list.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.List = void 0;

var _content = require("./content");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var List = /*#__PURE__*/function () {
  function List(container, data) {
    _classCallCheck(this, List);

    this.container = container;
    this.data = data;
    this.activeItemId = null;
    this.handleClickList = this._clickList.bind(this);

    this._init();
  }

  _createClass(List, [{
    key: "_init",
    value: function _init() {
      this._render(this.data);

      this.container.addEventListener('click', this.handleClickList);
    }
  }, {
    key: "_removeActive",
    value: function _removeActive() {
      if (!this.activeItemId) return;
      var tag = this.container.querySelector("[data-id=\"".concat(this.activeItemId, "\"]"));
      if (!tag == null) tag.classList.remove('active');
      tag.classList.remove('active');
    }
  }, {
    key: "_selectListItem",
    value: function _selectListItem(id) {
      this._removeActive();

      this.activeItemId = id;
      var tag = this.container.querySelector("[data-id=\"".concat(id, "\"]"));
      tag.classList.add('active');
      fetch('/api/data', {
        method: 'GET'
      }).then(function (response) {
        return response.json();
      }).then(function (dataObj) {
        dataObj.list.forEach(function (item) {
          if (item.id == id) {
            new _content.Content(document.querySelector('#content'), item);
          }
        });
      }).catch(function (error) {
        return console.error(error);
      });
    }
  }, {
    key: "_clickList",
    value: function _clickList() {
      var tag = event.target;

      if (tag.classList.value.includes("list-item")) {
        var id = tag.getAttribute('data-id');

        this._selectListItem(id);
      }
    }
  }, {
    key: "_render",
    value: function _render(data) {
      var _this = this;

      this._clear();

      this.data.forEach(function (item) {
        var template = "\n        <div class=\"list-item p-3\" data-id=\"".concat(item.id, "\">\n          <h5>").concat(item.title, "</h5> \n          <small>").concat(item.date, "</small> \n        </div>        \n      ");
        _this.container.innerHTML = _this.container.innerHTML + template;
      });
    }
  }, {
    key: "_clear",
    value: function _clear() {
      this.container.innerHTML = "";
    }
  }]);

  return List;
}();

exports.List = List;
},{"./content":"js/content.js"}],"js/reset-form.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resetForm = resetForm;

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function resetForm(form) {
  form.reset();

  _toConsumableArray(form.querySelectorAll('[type="hidden"]')).forEach(function (input) {
    input.value = '';
  });
}
},{}],"js/form.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Form = void 0;

var _list = require("./list");

var _resetForm = require("./reset-form");

var _content = require("./content");

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it; if (typeof Symbol === "undefined" || o[Symbol.iterator] == null) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = o[Symbol.iterator](); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Form = /*#__PURE__*/function () {
  function Form(form) {
    _classCallCheck(this, Form);

    this.form = form;
    this.idField = document.querySelector('[name="id"]');
    this.dateField = document.querySelector('[name="date"]');
    this.listContainer = document.querySelector('#list');
    this.content = document.querySelector('#content');
    this.btnSend = document.querySelector('[type="submit"]');
    this.handleSubmit = this._submit.bind(this);

    this._init();
  }

  _createClass(Form, [{
    key: "_init",
    value: function _init() {
      this.btnSend.addEventListener('click', this.handleSubmit);
    }
  }, {
    key: "_addZero",
    value: function _addZero(num) {
      var parsedNum = num;
      return parsedNum < 10 ? "0" + parsedNum : parsedNum;
    }
  }, {
    key: "_buildDate",
    value: function _buildDate(date) {
      var day = this._addZero(date.getDate());

      var month = this._addZero(date.getMonth() + 1);

      var year = date.getFullYear();

      var hours = this._addZero(date.getHours());

      var minutes = this._addZero(date.getMinutes());

      return "".concat(day, ".").concat(month, ".").concat(year, " ").concat(hours, ":").concat(minutes);
    }
  }, {
    key: "_setMetaData",
    value: function _setMetaData(id, date) {
      if (this.idField.value && this.dateField.value) return;
      this.idField.value = id;
      this.dateField.value = date;
    }
  }, {
    key: "_submit",
    value: function _submit() {
      event.preventDefault();
      var currentMethod = this.form.getAttribute('data-method');

      if (!this.form.checkValidity()) {
        this.form.classList.add('invalid');
      } else {
        this.form.classList.remove('invalid');
        var currentDate = new Date();

        this._setMetaData(currentDate.getTime(), this._buildDate(currentDate));

        var formData = new FormData(this.form);
        var dataForm = {};

        var _iterator = _createForOfIteratorHelper(formData),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var _step$value = _slicedToArray(_step.value, 2),
                name = _step$value[0],
                value = _step$value[1];

            dataForm[name] = value;
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }

        this._send(dataForm, currentMethod);

        (0, _resetForm.resetForm)(this.form);
        $('#formModal').modal('hide');
      }
    }
  }, {
    key: "_send",
    value: function _send(data, method) {
      var url = 'api/data';
      if (method == 'PUT') url = url + "/".concat(data.id);
      fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(data)
      }).then(function (response) {
        return response.json();
      }).then(function (dataObj) {
        new _list.List(document.querySelector('#list'), dataObj.list);

        if (method == 'PUT') {
          var id = document.querySelector('button[data-id]').getAttribute('data-id');
          dataObj.list.forEach(function (item) {
            if (id == item.id) {
              new _content.Content(document.querySelector('#content'), item);
            }
          });
        }
      }).catch(function (error) {
        return console.error(error);
      });
    }
  }]);

  return Form;
}();

exports.Form = Form;
},{"./list":"js/list.js","./reset-form":"js/reset-form.js","./content":"js/content.js"}],"js/app.js":[function(require,module,exports) {
"use strict";

var _form = require("./form");

var _list = require("./list");

var _resetForm = require("./reset-form");

var formNode = document.querySelector('#form');
new _form.Form(formNode); // ---------------------------------------------------

var createBtnNode = document.querySelector('#createBtn');
createBtnNode.addEventListener('click', function () {
  formNode.setAttribute('data-method', 'POST');
  (0, _resetForm.resetForm)(formNode);
  $('#formModal').modal('show');
});
var listNode = document.querySelector('#list');
fetch('/api/data', {
  method: 'GET'
}).then(function (response) {
  return response.json();
}).then(function (data) {
  new _list.List(listNode, data.list);
}).catch(function (error) {
  console.error(error);
});
},{"./form":"js/form.js","./list":"js/list.js","./reset-form":"js/reset-form.js"}],"../node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "53569" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/app.js"], null)
//# sourceMappingURL=app.c3f9f951.js.map
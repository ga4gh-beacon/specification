"use strict";

exports.__esModule = true;
Object.defineProperty(exports, "Tabs", {
  enumerable: true,
  get: function get() {
    return _Tabs.default;
  }
});
Object.defineProperty(exports, "TabList", {
  enumerable: true,
  get: function get() {
    return _TabList.default;
  }
});
Object.defineProperty(exports, "Tab", {
  enumerable: true,
  get: function get() {
    return _Tab.default;
  }
});
Object.defineProperty(exports, "TabPanel", {
  enumerable: true,
  get: function get() {
    return _TabPanel.default;
  }
});
Object.defineProperty(exports, "resetIdCounter", {
  enumerable: true,
  get: function get() {
    return _uuid.reset;
  }
});

var _Tabs = _interopRequireDefault(require("./components/Tabs"));

var _TabList = _interopRequireDefault(require("./components/TabList"));

var _Tab = _interopRequireDefault(require("./components/Tab"));

var _TabPanel = _interopRequireDefault(require("./components/TabPanel"));

var _uuid = require("./helpers/uuid");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
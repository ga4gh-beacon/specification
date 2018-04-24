"use strict";

exports.__esModule = true;
exports.deepMap = deepMap;
exports.deepForEach = deepForEach;

var _react = require("react");

var _elementTypes = require("../helpers/elementTypes");

function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function isTabChild(child) {
  return (0, _elementTypes.isTab)(child) || (0, _elementTypes.isTabList)(child) || (0, _elementTypes.isTabPanel)(child);
}

function deepMap(children, callback) {
  return _react.Children.map(children, function (child) {
    // null happens when conditionally rendering TabPanel/Tab
    // see https://github.com/reactjs/react-tabs/issues/37
    if (child === null) return null;

    if (isTabChild(child)) {
      return callback(child);
    }

    if (child.props && child.props.children && _typeof(child.props.children) === 'object') {
      // Clone the child that has children and map them too
      return (0, _react.cloneElement)(child, _extends({}, child.props, {
        children: deepMap(child.props.children, callback)
      }));
    }

    return child;
  });
}

function deepForEach(children, callback) {
  return _react.Children.forEach(children, function (child) {
    // null happens when conditionally rendering TabPanel/Tab
    // see https://github.com/reactjs/react-tabs/issues/37
    if (child === null) return;

    if ((0, _elementTypes.isTab)(child) || (0, _elementTypes.isTabPanel)(child)) {
      callback(child);
    } else if (child.props && child.props.children && _typeof(child.props.children) === 'object') {
      if ((0, _elementTypes.isTabList)(child)) callback(child);
      deepForEach(child.props.children, callback);
    }
  });
}
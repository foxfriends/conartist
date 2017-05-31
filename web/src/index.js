'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const ReactDOM = require("react-dom");
const MuiThemeProvider_1 = require("material-ui/styles/MuiThemeProvider");
const injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();
const sales_1 = require("./sales");
require("./app.scss");
ReactDOM.render(React.createElement(MuiThemeProvider_1.default, null,
    React.createElement(sales_1.default, null)), document.querySelector('#app'));

webpackJsonp([2],{

/***/ "./node_modules/css-loader/index.js!./node_modules/postcss-loader/index.js!./node_modules/sass-loader/lib/loader.js!./src/main.scss":
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__("./node_modules/css-loader/lib/css-base.js")(undefined);
// imports
exports.push([module.i, "@import url(https://fonts.googleapis.com/icon?family=Material+Icons);", ""]);
exports.push([module.i, "@import url(https://fonts.googleapis.com/css?family=Roboto:300,400);", ""]);

// module
exports.push([module.i, "html {\n  min-height: 100%; }\n\nhtml, body {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-positive: 1;\n      flex-grow: 1;\n  -ms-flex-direction: column;\n      flex-direction: column;\n  font-family: 'Roboto', sans-serif; }\n", ""]);

// exports


/***/ }),

/***/ "./node_modules/jwt-decode/lib/atob.js":
/***/ (function(module, exports) {

/**
 * The code was extracted from:
 * https://github.com/davidchambers/Base64.js
 */

var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';

function InvalidCharacterError(message) {
  this.message = message;
}

InvalidCharacterError.prototype = new Error();
InvalidCharacterError.prototype.name = 'InvalidCharacterError';

function polyfill (input) {
  var str = String(input).replace(/=+$/, '');
  if (str.length % 4 == 1) {
    throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
  }
  for (
    // initialize result and counters
    var bc = 0, bs, buffer, idx = 0, output = '';
    // get next character
    buffer = str.charAt(idx++);
    // character found in table? initialize bit storage and add its ascii value;
    ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
      // and if not first of each 4 characters,
      // convert the first 8 bits to one ascii character
      bc++ % 4) ? output += String.fromCharCode(255 & bs >> (-2 * bc & 6)) : 0
  ) {
    // try to find character in table (0-63, not found => -1)
    buffer = chars.indexOf(buffer);
  }
  return output;
}


module.exports = typeof window !== 'undefined' && window.atob && window.atob.bind(window) || polyfill;


/***/ }),

/***/ "./node_modules/jwt-decode/lib/base64_url_decode.js":
/***/ (function(module, exports, __webpack_require__) {

var atob = __webpack_require__("./node_modules/jwt-decode/lib/atob.js");

function b64DecodeUnicode(str) {
  return decodeURIComponent(atob(str).replace(/(.)/g, function (m, p) {
    var code = p.charCodeAt(0).toString(16).toUpperCase();
    if (code.length < 2) {
      code = '0' + code;
    }
    return '%' + code;
  }));
}

module.exports = function(str) {
  var output = str.replace(/-/g, "+").replace(/_/g, "/");
  switch (output.length % 4) {
    case 0:
      break;
    case 2:
      output += "==";
      break;
    case 3:
      output += "=";
      break;
    default:
      throw "Illegal base64url string!";
  }

  try{
    return b64DecodeUnicode(output);
  } catch (err) {
    return atob(output);
  }
};


/***/ }),

/***/ "./node_modules/jwt-decode/lib/index.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var base64_url_decode = __webpack_require__("./node_modules/jwt-decode/lib/base64_url_decode.js");

function InvalidTokenError(message) {
  this.message = message;
}

InvalidTokenError.prototype = new Error();
InvalidTokenError.prototype.name = 'InvalidTokenError';

module.exports = function (token,options) {
  if (typeof token !== 'string') {
    throw new InvalidTokenError('Invalid token specified');
  }

  options = options || {};
  var pos = options.header === true ? 0 : 1;
  try {
    return JSON.parse(base64_url_decode(token.split('.')[pos]));
  } catch (e) {
    throw new InvalidTokenError('Invalid token specified: ' + e.message);
  }
};

module.exports.InvalidTokenError = InvalidTokenError;


/***/ }),

/***/ "./node_modules/material-colors/dist/colors.es2015.js":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const red = {"50":"#ffebee","100":"#ffcdd2","200":"#ef9a9a","300":"#e57373","400":"#ef5350","500":"#f44336","600":"#e53935","700":"#d32f2f","800":"#c62828","900":"#b71c1c","a100":"#ff8a80","a200":"#ff5252","a400":"#ff1744","a700":"#d50000"};
/* unused harmony export red */

const pink = {"50":"#fce4ec","100":"#f8bbd0","200":"#f48fb1","300":"#f06292","400":"#ec407a","500":"#e91e63","600":"#d81b60","700":"#c2185b","800":"#ad1457","900":"#880e4f","a100":"#ff80ab","a200":"#ff4081","a400":"#f50057","a700":"#c51162"};
/* unused harmony export pink */

const purple = {"50":"#f3e5f5","100":"#e1bee7","200":"#ce93d8","300":"#ba68c8","400":"#ab47bc","500":"#9c27b0","600":"#8e24aa","700":"#7b1fa2","800":"#6a1b9a","900":"#4a148c","a100":"#ea80fc","a200":"#e040fb","a400":"#d500f9","a700":"#aa00ff"};
/* unused harmony export purple */

const deepPurple = {"50":"#ede7f6","100":"#d1c4e9","200":"#b39ddb","300":"#9575cd","400":"#7e57c2","500":"#673ab7","600":"#5e35b1","700":"#512da8","800":"#4527a0","900":"#311b92","a100":"#b388ff","a200":"#7c4dff","a400":"#651fff","a700":"#6200ea"};
/* unused harmony export deepPurple */

const indigo = {"50":"#e8eaf6","100":"#c5cae9","200":"#9fa8da","300":"#7986cb","400":"#5c6bc0","500":"#3f51b5","600":"#3949ab","700":"#303f9f","800":"#283593","900":"#1a237e","a100":"#8c9eff","a200":"#536dfe","a400":"#3d5afe","a700":"#304ffe"};
/* unused harmony export indigo */

const blue = {"50":"#e3f2fd","100":"#bbdefb","200":"#90caf9","300":"#64b5f6","400":"#42a5f5","500":"#2196f3","600":"#1e88e5","700":"#1976d2","800":"#1565c0","900":"#0d47a1","a100":"#82b1ff","a200":"#448aff","a400":"#2979ff","a700":"#2962ff"};
/* unused harmony export blue */

const lightBlue = {"50":"#e1f5fe","100":"#b3e5fc","200":"#81d4fa","300":"#4fc3f7","400":"#29b6f6","500":"#03a9f4","600":"#039be5","700":"#0288d1","800":"#0277bd","900":"#01579b","a100":"#80d8ff","a200":"#40c4ff","a400":"#00b0ff","a700":"#0091ea"};
/* unused harmony export lightBlue */

const cyan = {"50":"#e0f7fa","100":"#b2ebf2","200":"#80deea","300":"#4dd0e1","400":"#26c6da","500":"#00bcd4","600":"#00acc1","700":"#0097a7","800":"#00838f","900":"#006064","a100":"#84ffff","a200":"#18ffff","a400":"#00e5ff","a700":"#00b8d4"};
/* unused harmony export cyan */

const teal = {"50":"#e0f2f1","100":"#b2dfdb","200":"#80cbc4","300":"#4db6ac","400":"#26a69a","500":"#009688","600":"#00897b","700":"#00796b","800":"#00695c","900":"#004d40","a100":"#a7ffeb","a200":"#64ffda","a400":"#1de9b6","a700":"#00bfa5"};
/* unused harmony export teal */

const green = {"50":"#e8f5e9","100":"#c8e6c9","200":"#a5d6a7","300":"#81c784","400":"#66bb6a","500":"#4caf50","600":"#43a047","700":"#388e3c","800":"#2e7d32","900":"#1b5e20","a100":"#b9f6ca","a200":"#69f0ae","a400":"#00e676","a700":"#00c853"};
/* unused harmony export green */

const lightGreen = {"50":"#f1f8e9","100":"#dcedc8","200":"#c5e1a5","300":"#aed581","400":"#9ccc65","500":"#8bc34a","600":"#7cb342","700":"#689f38","800":"#558b2f","900":"#33691e","a100":"#ccff90","a200":"#b2ff59","a400":"#76ff03","a700":"#64dd17"};
/* unused harmony export lightGreen */

const lime = {"50":"#f9fbe7","100":"#f0f4c3","200":"#e6ee9c","300":"#dce775","400":"#d4e157","500":"#cddc39","600":"#c0ca33","700":"#afb42b","800":"#9e9d24","900":"#827717","a100":"#f4ff81","a200":"#eeff41","a400":"#c6ff00","a700":"#aeea00"};
/* unused harmony export lime */

const yellow = {"50":"#fffde7","100":"#fff9c4","200":"#fff59d","300":"#fff176","400":"#ffee58","500":"#ffeb3b","600":"#fdd835","700":"#fbc02d","800":"#f9a825","900":"#f57f17","a100":"#ffff8d","a200":"#ffff00","a400":"#ffea00","a700":"#ffd600"};
/* unused harmony export yellow */

const amber = {"50":"#fff8e1","100":"#ffecb3","200":"#ffe082","300":"#ffd54f","400":"#ffca28","500":"#ffc107","600":"#ffb300","700":"#ffa000","800":"#ff8f00","900":"#ff6f00","a100":"#ffe57f","a200":"#ffd740","a400":"#ffc400","a700":"#ffab00"};
/* unused harmony export amber */

const orange = {"50":"#fff3e0","100":"#ffe0b2","200":"#ffcc80","300":"#ffb74d","400":"#ffa726","500":"#ff9800","600":"#fb8c00","700":"#f57c00","800":"#ef6c00","900":"#e65100","a100":"#ffd180","a200":"#ffab40","a400":"#ff9100","a700":"#ff6d00"};
/* unused harmony export orange */

const deepOrange = {"50":"#fbe9e7","100":"#ffccbc","200":"#ffab91","300":"#ff8a65","400":"#ff7043","500":"#ff5722","600":"#f4511e","700":"#e64a19","800":"#d84315","900":"#bf360c","a100":"#ff9e80","a200":"#ff6e40","a400":"#ff3d00","a700":"#dd2c00"};
/* unused harmony export deepOrange */

const brown = {"50":"#efebe9","100":"#d7ccc8","200":"#bcaaa4","300":"#a1887f","400":"#8d6e63","500":"#795548","600":"#6d4c41","700":"#5d4037","800":"#4e342e","900":"#3e2723"};
/* unused harmony export brown */

const grey = {"50":"#fafafa","100":"#f5f5f5","200":"#eeeeee","300":"#e0e0e0","400":"#bdbdbd","500":"#9e9e9e","600":"#757575","700":"#616161","800":"#424242","900":"#212121"};
/* unused harmony export grey */

const blueGrey = {"50":"#eceff1","100":"#cfd8dc","200":"#b0bec5","300":"#90a4ae","400":"#78909c","500":"#607d8b","600":"#546e7a","700":"#455a64","800":"#37474f","900":"#263238"};
/* unused harmony export blueGrey */

const darkText = {"primary":"rgba(0, 0, 0, 0.87)","secondary":"rgba(0, 0, 0, 0.54)","disabled":"rgba(0, 0, 0, 0.38)","dividers":"rgba(0, 0, 0, 0.12)"};
/* unused harmony export darkText */

const lightText = {"primary":"rgba(255, 255, 255, 1)","secondary":"rgba(255, 255, 255, 0.7)","disabled":"rgba(255, 255, 255, 0.5)","dividers":"rgba(255, 255, 255, 0.12)"};
/* unused harmony export lightText */

const darkIcons = {"active":"rgba(0, 0, 0, 0.54)","inactive":"rgba(0, 0, 0, 0.38)"};
/* unused harmony export darkIcons */

const lightIcons = {"active":"rgba(255, 255, 255, 1)","inactive":"rgba(255, 255, 255, 0.5)"};
/* unused harmony export lightIcons */

const white = "#ffffff";
/* unused harmony export white */

const black = "#000000";
/* unused harmony export black */


/* harmony default export */ __webpack_exports__["a"] = ({
  red: red,
  pink: pink,
  purple: purple,
  deepPurple: deepPurple,
  indigo: indigo,
  blue: blue,
  lightBlue: lightBlue,
  cyan: cyan,
  teal: teal,
  green: green,
  lightGreen: lightGreen,
  lime: lime,
  yellow: yellow,
  amber: amber,
  orange: orange,
  deepOrange: deepOrange,
  brown: brown,
  grey: grey,
  blueGrey: blueGrey,
  darkText: darkText,
  lightText: lightText,
  darkIcons: darkIcons,
  lightIcons: lightIcons,
  white: white,
  black: black
});


/***/ }),

/***/ "./node_modules/rxjs/add/observable/fromEvent.js":
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var Observable_1 = __webpack_require__("./node_modules/rxjs/Observable.js");
var fromEvent_1 = __webpack_require__("./node_modules/rxjs/observable/fromEvent.js");
Observable_1.Observable.fromEvent = fromEvent_1.fromEvent;
//# sourceMappingURL=fromEvent.js.map

/***/ }),

/***/ "./src/app/api/api.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return APIModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__api_service__ = __webpack_require__("./src/app/api/api.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};


let APIModule = class APIModule {
};
APIModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["M" /* NgModule */])({
        providers: [__WEBPACK_IMPORTED_MODULE_1__api_service__["a" /* APIService */]],
    })
], APIModule);

//# sourceMappingURL=api.module.js.map

/***/ }),

/***/ "./src/app/app.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__("./node_modules/@angular/platform-browser/@angular/platform-browser.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_http__ = __webpack_require__("./node_modules/@angular/http/@angular/http.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__angular_platform_browser_animations__ = __webpack_require__("./node_modules/@angular/platform-browser/@angular/platform-browser/animations.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__material_module__ = __webpack_require__("./src/app/material.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__sign_in_sign_in_module__ = __webpack_require__("./src/app/sign-in/sign-in.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__dashboard_dashboard_module__ = __webpack_require__("./src/app/dashboard/dashboard.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__inventory_inventory_module__ = __webpack_require__("./src/app/inventory/inventory.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__prices_prices_module__ = __webpack_require__("./src/app/prices/prices.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__conventions_conventions_module__ = __webpack_require__("./src/app/conventions/conventions.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__help_help_module__ = __webpack_require__("./src/app/help/help.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__data_data_module__ = __webpack_require__("./src/app/data/data.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__routing_routing_module__ = __webpack_require__("./src/app/routing/routing.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__app_component__ = __webpack_require__("./src/app/app.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__api_api_module__ = __webpack_require__("./src/app/api/api.module.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};















let AppModule = class AppModule {
};
AppModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["M" /* NgModule */])({
        imports: [
            __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["a" /* BrowserModule */],
            __WEBPACK_IMPORTED_MODULE_3__angular_platform_browser_animations__["a" /* BrowserAnimationsModule */],
            __WEBPACK_IMPORTED_MODULE_2__angular_http__["e" /* HttpModule */],
            __WEBPACK_IMPORTED_MODULE_4__material_module__["a" /* MaterialModule */],
            __WEBPACK_IMPORTED_MODULE_11__data_data_module__["a" /* DataModule */],
            __WEBPACK_IMPORTED_MODULE_5__sign_in_sign_in_module__["a" /* SignInModule */],
            __WEBPACK_IMPORTED_MODULE_6__dashboard_dashboard_module__["a" /* DashboardModule */],
            __WEBPACK_IMPORTED_MODULE_7__inventory_inventory_module__["a" /* InventoryModule */],
            __WEBPACK_IMPORTED_MODULE_8__prices_prices_module__["a" /* PricesModule */],
            __WEBPACK_IMPORTED_MODULE_9__conventions_conventions_module__["a" /* ConventionsModule */],
            __WEBPACK_IMPORTED_MODULE_10__help_help_module__["a" /* HelpModule */],
            __WEBPACK_IMPORTED_MODULE_14__api_api_module__["a" /* APIModule */],
            __WEBPACK_IMPORTED_MODULE_12__routing_routing_module__["a" /* RoutingModule */],
        ],
        declarations: [__WEBPACK_IMPORTED_MODULE_13__app_component__["a" /* AppComponent */]],
        bootstrap: [__WEBPACK_IMPORTED_MODULE_13__app_component__["a" /* AppComponent */]],
    })
], AppModule);

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ "./src/app/color-picker/color-picker.component.html":
/***/ (function(module, exports) {

module.exports = "<div [mdMenuTriggerFor]=\"colorPicker\"><ng-content></ng-content></div>\n<md-menu #colorPicker=\"mdMenu\" class=\"color-picker__menu\">\n  <md-grid-list cols=\"5\" gutterSize=\"4\">\n    <md-grid-tile rowspan=\"3\" colspan=\"1\">\n      <button md-icon-button (click)=\"prev($event)\"><md-icon>keyboard_arrow_left</md-icon></button>\n    </md-grid-tile>\n    <md-grid-tile *ngFor=\"let color of colors.slice(0, 3)\">\n      <button md-icon-button (click)=\"select(color)\" [style.backgroundColor]=\"color\" class=\"color-picker__color\">\n        <md-icon *ngIf=\"parse(color) === selected\" class=\"color-picker__check\">check_circle</md-icon>\n      </button>\n    </md-grid-tile>\n    <md-grid-tile rowspan=\"3\" colspan=\"1\">\n      <button md-icon-button (click)=\"next($event)\"><md-icon>keyboard_arrow_right</md-icon></button>\n    </md-grid-tile>\n    <md-grid-tile *ngFor=\"let color of colors.slice(3)\">\n      <button md-icon-button (click)=\"select(color)\" [style.backgroundColor]=\"color\" class=\"color-picker__color\">\n        <md-icon *ngIf=\"parse(color) === selected\" class=\"color-picker__check\">check_circle</md-icon>\n      </button>\n    </md-grid-tile>\n  </md-grid-list>\n</md-menu>\n"

/***/ }),

/***/ "./src/app/color-picker/color-picker.component.scss":
/***/ (function(module, exports) {

module.exports = ".color-picker__menu {\n  width: 216px;\n  max-width: unset;\n  height: 144px; }\n\n.color-picker__nav {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n      align-items: center; }\n\n.color-picker__check {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  -ms-transform: translate(-50%, -50%);\n      transform: translate(-50%, -50%);\n  color: #ffffff; }\n"

/***/ }),

/***/ "./src/app/color-picker/color-picker.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ColorPickerComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_material_colors__ = __webpack_require__("./node_modules/material-colors/dist/colors.es2015.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util__ = __webpack_require__("./src/util/index.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__color_picker_component_html__ = __webpack_require__("./src/app/color-picker/color-picker.component.html");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__color_picker_component_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__color_picker_component_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__color_picker_component_scss__ = __webpack_require__("./src/app/color-picker/color-picker.component.scss");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__color_picker_component_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__color_picker_component_scss__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





let ColorPickerComponent = class ColorPickerComponent {
    constructor() {
        this.selectedChange = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["x" /* EventEmitter */]();
        this._index = 1;
        this._colors = Object(__WEBPACK_IMPORTED_MODULE_2__util__["b" /* Wrappable */])([
            'red', 'pink', 'purple', 'deepPurple', 'indigo', 'blue', 'lightBlue', 'cyan',
            'teal', 'green', 'lightGreen', 'lime', 'yellow', 'amber', 'orange', 'deepOrange',
            'brown', 'grey', 'blueGrey',
        ].map((_) => [__WEBPACK_IMPORTED_MODULE_1_material_colors__["a" /* default */][_]['100'], __WEBPACK_IMPORTED_MODULE_1_material_colors__["a" /* default */][_]['200'], __WEBPACK_IMPORTED_MODULE_1_material_colors__["a" /* default */][_]['300']]));
    }
    get colors() {
        return Array.prototype.concat(...Object(__WEBPACK_IMPORTED_MODULE_2__util__["d" /* rotate */])([
            this._colors[this._index - 1],
            this._colors[this._index],
            this._colors[this._index + 1],
        ]));
    }
    next(event) {
        if (event) {
            event.stopPropagation();
        }
        this._index = (this._index + 1) % this._colors.length;
    }
    prev(event) {
        if (event) {
            event.stopPropagation();
        }
        this._index = (this._index - 1 + this._colors.length) % this._colors.length;
    }
    select(color) {
        this.selected = this.parse(color);
        this.selectedChange.emit(this.selected);
    }
    parse(color) {
        return parseInt(color.slice(1), 16) || 0;
    }
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["T" /* Output */])(),
    __metadata("design:type", Object)
], ColorPickerComponent.prototype, "selectedChange", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", Object)
], ColorPickerComponent.prototype, "selected", void 0);
ColorPickerComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'con-color-picker',
        template: __WEBPACK_IMPORTED_MODULE_3__color_picker_component_html___default.a,
        styles: [__WEBPACK_IMPORTED_MODULE_4__color_picker_component_scss___default.a],
        encapsulation: __WEBPACK_IMPORTED_MODULE_0__angular_core__["_19" /* ViewEncapsulation */].None,
    })
], ColorPickerComponent);

//# sourceMappingURL=color-picker.component.js.map

/***/ }),

/***/ "./src/app/color-picker/color-picker.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ColorPickerModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__("./node_modules/@angular/common/@angular/common.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__color_picker_component__ = __webpack_require__("./src/app/color-picker/color-picker.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__material_module__ = __webpack_require__("./src/app/material.module.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};




let ColorPickerModule = class ColorPickerModule {
};
ColorPickerModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["M" /* NgModule */])({
        imports: [__WEBPACK_IMPORTED_MODULE_1__angular_common__["b" /* CommonModule */], __WEBPACK_IMPORTED_MODULE_3__material_module__["a" /* MaterialModule */]],
        declarations: [__WEBPACK_IMPORTED_MODULE_2__color_picker_component__["a" /* ColorPickerComponent */]],
        exports: [__WEBPACK_IMPORTED_MODULE_2__color_picker_component__["a" /* ColorPickerComponent */]],
    })
], ColorPickerModule);

//# sourceMappingURL=color-picker.module.js.map

/***/ }),

/***/ "./src/app/conventions/con-info.component.html":
/***/ (function(module, exports) {

module.exports = "<md-tab-group dynamicHeight=\"true\" *ngIf=\"convention|async as con; else loading\">\n  <md-tab label=\"Overview\">\n    <header class=\"con-info__header\">\n      <h1 class=\"con-info__title\">{{ con.title }}</h1>\n    </header>\n  </md-tab>\n  <md-tab label=\"Inventory\">\n    <con-con-inventory [con]=\"con\"></con-con-inventory>\n  </md-tab>\n  <md-tab label=\"Pricing\">\n    <con-con-pricing [con]=\"con\"></con-con-pricing>\n  </md-tab>\n  <md-tab label=\"Records\">\n    <con-record-list [con]=\"convention\"></con-record-list>\n  </md-tab>\n  <md-tab label=\"Stats\">\n    <con-stats [con]=\"con\"></con-stats>\n  </md-tab>\n</md-tab-group>\n"

/***/ }),

/***/ "./src/app/conventions/con-info.component.scss":
/***/ (function(module, exports) {

module.exports = ".con-info__header {\n  min-height: 100px;\n  box-shadow: inset 0 -3px 3px -3px rgba(0, 0, 0, 0.5); }\n\n.con-info__title {\n  font-size: 24px;\n  font-weight: bold;\n  padding: 16px; }\n\n.con-info__loading {\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n      align-items: center;\n  -ms-flex-pack: center;\n      justify-content: center;\n  background: rgba(0, 0, 0, 0.3);\n  z-index: 700; }\n"

/***/ }),

/***/ "./src/app/conventions/con-info.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConInfoComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("./node_modules/@angular/router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_switchMap__ = __webpack_require__("./node_modules/rxjs/add/operator/switchMap.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_switchMap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_switchMap__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__con_info_component_html__ = __webpack_require__("./src/app/conventions/con-info.component.html");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__con_info_component_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__con_info_component_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__con_info_component_scss__ = __webpack_require__("./src/app/conventions/con-info.component.scss");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__con_info_component_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__con_info_component_scss__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};





let ConInfoComponent = class ConInfoComponent {
    constructor(route) {
        this.route = route;
    }
    ngOnInit() {
        this.convention = this.route.data.switchMap(_ => _.convention);
    }
};
ConInfoComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'con-con-info',
        template: __WEBPACK_IMPORTED_MODULE_3__con_info_component_html___default.a,
        styles: [__WEBPACK_IMPORTED_MODULE_4__con_info_component_scss___default.a],
    }),
    __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Inject */])(__WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */])),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["a" /* ActivatedRoute */]) === "function" && _a || Object])
], ConInfoComponent);

var _a;
//# sourceMappingURL=con-info.component.js.map

/***/ }),

/***/ "./src/app/conventions/con-inventory.component.html":
/***/ (function(module, exports) {

module.exports = "<md-table [dataSource]=\"dataSource\" mdSort>\n  <ng-container cdkColumnDef=\"selected\">\n    <md-header-cell *cdkHeaderCellDef>\n      <!-- TODO: bulk include/exclude -->\n      <!-- TODO: decide if this will be a feature -->\n      <md-icon>check</md-icon>\n    </md-header-cell>\n    <md-cell *cdkCellDef=\"let product\">\n      <md-checkbox [checked]=\"included(product)\" (change)=\"toggleIncluded(product)\"></md-checkbox>\n    </md-cell>\n  </ng-container>\n\n  <ng-container cdkColumnDef=\"name\">\n    <md-header-cell *cdkHeaderCellDef md-sort-header>Product</md-header-cell>\n    <md-cell *cdkCellDef=\"let product\">{{ product.name }}</md-cell>\n  </ng-container>\n\n  <ng-container cdkColumnDef=\"type\">\n    <md-header-cell *cdkHeaderCellDef md-sort-header>Type</md-header-cell>\n    <md-cell *cdkCellDef=\"let product\">{{ product.type | type:'name' }}</md-cell>\n  </ng-container>\n\n  <ng-container cdkColumnDef=\"quantity\">\n    <md-header-cell *cdkHeaderCellDef md-sort-header>Quantity</md-header-cell>\n    <md-cell *cdkCellDef=\"let product\">{{ product.quantity }}</md-cell>\n  </ng-container>\n\n  <md-header-row *cdkHeaderRowDef=\"displayedColumns\"></md-header-row>\n  <md-row *cdkRowDef=\"let product; columns: displayedColumns\"></md-row>\n</md-table>\n"

/***/ }),

/***/ "./src/app/conventions/con-inventory.component.scss":
/***/ (function(module, exports) {

module.exports = ".con-inventory__row--excluded {\n  opacity: 0.5; }\n\n.con-inventory__column {\n  -ms-flex-preferred-size: 0;\n      flex-basis: 0;\n  -ms-flex-positive: 1;\n      flex-grow: 1; }\n"

/***/ }),

/***/ "./src/app/conventions/con-inventory.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConInventoryComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_material__ = __webpack_require__("./node_modules/@angular/material/@angular/material.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__data_storage_service__ = __webpack_require__("./src/app/data/storage.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__data_type_pipe__ = __webpack_require__("./src/app/data/type.pipe.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__data_data_source__ = __webpack_require__("./src/app/data/data-source.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__con_inventory_component_html__ = __webpack_require__("./src/app/conventions/con-inventory.component.html");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__con_inventory_component_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__con_inventory_component_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__con_inventory_component_scss__ = __webpack_require__("./src/app/conventions/con-inventory.component.scss");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__con_inventory_component_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__con_inventory_component_scss__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};







let ConInventoryComponent = class ConInventoryComponent {
    constructor(storage, type) {
        this.storage = storage;
        this.type = type;
        this.displayedColumns = ['name', 'type', 'quantity'];
        this._products = this.storage.products;
    }
    ngOnInit() {
        this.dataSource = new __WEBPACK_IMPORTED_MODULE_4__data_data_source__["a" /* ConDataSource */](this._products);
        this.dataSource.filter = _ => (!_.discontinued && !this.type.transform(_.type).discontinued) || this.included(_);
        this.sort.mdSortChange.subscribe((sort) => {
            let fn = null;
            if (sort.direction && sort.active) {
                const dir = sort.direction === 'asc' ? -1 : 1;
                switch (sort.active) {
                    case 'selected':
                        fn = (a, b) => (+this.included(a) - +this.included(b)) * dir;
                        break;
                    case 'name':
                        fn = (a, b) => (a.name < b.name ? 1 : -1) * dir;
                        break;
                    case 'type':
                        fn = (a, b) => (this.type.transform(a.type).name < this.type.transform(b.type).name ? 1 : -1) * dir;
                        break;
                    case 'quantity':
                        fn = (a, b) => (a.quantity - b.quantity) * dir;
                        break;
                }
            }
            this.dataSource.sort = fn;
        });
    }
    included({ id }) {
        return !!this.con.data.products.find(_ => _.id === id && !_.discontinued);
    }
    toggleIncluded(product) {
        if (this.included(product)) {
            this.storage.removeConventionProduct(this.con, product);
        }
        else {
            this.storage.addConventionProduct(this.con, product);
        }
    }
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", Object)
], ConInventoryComponent.prototype, "con", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_16" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1__angular_material__["r" /* MdSort */]),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_material__["r" /* MdSort */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_material__["r" /* MdSort */]) === "function" && _a || Object)
], ConInventoryComponent.prototype, "sort", void 0);
ConInventoryComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'con-con-inventory',
        template: __WEBPACK_IMPORTED_MODULE_5__con_inventory_component_html___default.a,
        styles: [__WEBPACK_IMPORTED_MODULE_6__con_inventory_component_scss___default.a],
    }),
    __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Inject */])(__WEBPACK_IMPORTED_MODULE_2__data_storage_service__["a" /* StorageService */])),
    __param(1, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Inject */])(__WEBPACK_IMPORTED_MODULE_3__data_type_pipe__["a" /* TypePipe */])),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__data_storage_service__["a" /* StorageService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__data_storage_service__["a" /* StorageService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__data_type_pipe__["a" /* TypePipe */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__data_type_pipe__["a" /* TypePipe */]) === "function" && _c || Object])
], ConInventoryComponent);

var _a, _b, _c;
//# sourceMappingURL=con-inventory.component.js.map

/***/ }),

/***/ "./src/app/conventions/con-list.component.html":
/***/ (function(module, exports) {

module.exports = "<!-- TODO: find an md-data-table -->\n<md-nav-list>\n  <ng-container *ngIf=\"currentConventions.length\">\n    <h3 md-subheader>Current</h3>\n    <md-list-item *ngFor=\"let convention of currentConventions\" (click)=\"openConvention(convention)\" class=\"convention-list__row\">\n      <span class=\"convention-list__column convention-list__title\">{{ convention.title }}</span>\n      <span class=\"convention-list__column convention-list__code\">{{ convention.code }}</span>\n      <span class=\"convention-list__column convention-list__date\">{{ convention.start | date }} &ndash; {{ convention.end | date }}</span>\n    </md-list-item>\n  </ng-container>\n  <md-divider *ngIf=\"currentConventions.length && upcomingConventions.length\"></md-divider>\n  <ng-container *ngIf=\"upcomingConventions.length\">\n    <h3 md-subheader>Upcoming</h3>\n    <md-list-item *ngFor=\"let convention of upcomingConventions\" (click)=\"openConvention(convention)\" class=\"convention-list__row\">\n      <span class=\"convention-list__column convention-list__title\">{{ convention.title }}</span>\n      <span class=\"convention-list__column convention-list__code\">{{ convention.code }}</span>\n      <span class=\"convention-list__column convention-list__date\">{{ convention.start | date }} &ndash; {{ convention.end | date }}</span>\n    </md-list-item>\n  </ng-container>\n  <md-divider *ngIf=\"upcomingConventions.length && previousConventions.length\"></md-divider>\n  <ng-container *ngIf=\"previousConventions.length\">\n    <h3 md-subheader>Previous</h3>\n    <md-list-item *ngFor=\"let convention of previousConventions\" (click)=\"openConvention(convention)\" class=\"convention-list__row\">\n      <span class=\"convention-list__column convention-list__title\">{{ convention.title }}</span>\n      <span class=\"convention-list__column convention-list__code\">{{ convention.code }}</span>\n      <span class=\"convention-list__column convention-list__date\">{{ convention.start | date }} &ndash; {{ convention.end | date }}</span>\n    </md-list-item>\n  </ng-container>\n</md-nav-list>\n"

/***/ }),

/***/ "./src/app/conventions/con-list.component.scss":
/***/ (function(module, exports) {

module.exports = ".convention-list__row--open {\n  background-color: #FFFFDD; }\n\n.convention-list__column {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-positive: 1;\n      flex-grow: 1;\n  -ms-flex-preferred-size: 0;\n      flex-basis: 0; }\n\n.convention-list__code {\n  color: rgba(0, 0, 0, 0.54);\n  margin: 0 16px; }\n\n.convention-list__date {\n  font-size: 10pt;\n  -ms-flex-pack: end;\n      justify-content: flex-end; }\n"

/***/ }),

/***/ "./src/app/conventions/con-list.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConListComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("./node_modules/@angular/router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_take__ = __webpack_require__("./node_modules/rxjs/add/operator/take.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_take___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_operator_take__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__data_storage_service__ = __webpack_require__("./src/app/data/storage.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__con_list_component_html__ = __webpack_require__("./src/app/conventions/con-list.component.html");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__con_list_component_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__con_list_component_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__con_list_component_scss__ = __webpack_require__("./src/app/conventions/con-list.component.scss");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__con_list_component_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__con_list_component_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__util__ = __webpack_require__("./src/util/index.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};







let ConListComponent = class ConListComponent {
    constructor(storage, router) {
        this.router = router;
        this.conClick = new __WEBPACK_IMPORTED_MODULE_0__angular_core__["x" /* EventEmitter */]();
        this._conventions = storage.conventions;
    }
    get conventions() {
        return this._conventions.getValue().filter((_) => _.type !== 'invalid');
    }
    get currentConventions() {
        return this.conventions.filter(({ start, end }) => start <= Object(__WEBPACK_IMPORTED_MODULE_6__util__["c" /* endOfDay */])(new Date()) && Object(__WEBPACK_IMPORTED_MODULE_6__util__["e" /* startOfDay */])(new Date()) <= end);
    }
    get upcomingConventions() {
        return this.conventions.filter(({ start }) => start > Object(__WEBPACK_IMPORTED_MODULE_6__util__["c" /* endOfDay */])(new Date()));
    }
    get previousConventions() {
        return this.conventions.filter(({ end }) => end < Object(__WEBPACK_IMPORTED_MODULE_6__util__["e" /* startOfDay */])(new Date()));
    }
    openConvention(convention) {
        this.router.navigate(['/conventions', convention.code]);
    }
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["T" /* Output */])(),
    __metadata("design:type", Object)
], ConListComponent.prototype, "conClick", void 0);
ConListComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'con-list',
        template: __WEBPACK_IMPORTED_MODULE_4__con_list_component_html___default.a,
        styles: [__WEBPACK_IMPORTED_MODULE_5__con_list_component_scss___default.a],
    }),
    __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Inject */])(__WEBPACK_IMPORTED_MODULE_3__data_storage_service__["a" /* StorageService */])),
    __param(1, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Inject */])(__WEBPACK_IMPORTED_MODULE_1__angular_router__["h" /* Router */])),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_3__data_storage_service__["a" /* StorageService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__data_storage_service__["a" /* StorageService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["h" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["h" /* Router */]) === "function" && _b || Object])
], ConListComponent);

var _a, _b;
//# sourceMappingURL=con-list.component.js.map

/***/ }),

/***/ "./src/app/conventions/con-pricing.component.html":
/***/ (function(module, exports) {

module.exports = "<md-table [dataSource]=\"dataSource\" mdSort>\n  <ng-container cdkColumnDef=\"type\">\n    <md-header-cell *cdkHeaderCellDef md-sort-header>Type</md-header-cell>\n    <md-cell *cdkCellDef=\"let row\">{{ row.type | type:'name' }}</md-cell>\n  </ng-container>\n\n  <ng-container cdkColumnDef=\"product\">\n    <md-header-cell *cdkHeaderCellDef md-sort-header>Product</md-header-cell>\n    <md-cell *cdkCellDef=\"let row\">{{ row.product | product:'name' }}</md-cell>\n  </ng-container>\n\n  <ng-container cdkColumnDef=\"quantity\">\n    <md-header-cell *cdkHeaderCellDef>Quantity</md-header-cell>\n    <md-cell *cdkCellDef=\"let row\">{{ row.quantity }}</md-cell>\n  </ng-container>\n\n  <ng-container cdkColumnDef=\"price\">\n    <md-header-cell *cdkHeaderCellDef>Price</md-header-cell>\n    <md-cell *cdkCellDef=\"let row\">{{ row.price | currency:'USD':true }}</md-cell>\n  </ng-container>\n\n  <md-header-row *cdkHeaderRowDef=\"displayedColumns\"></md-header-row>\n  <md-row *cdkRowDef=\"let row; columns: displayedColumns\"></md-row>\n</md-table>\n"

/***/ }),

/***/ "./src/app/conventions/con-pricing.component.scss":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/conventions/con-pricing.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConPricingComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_material__ = __webpack_require__("./node_modules/@angular/material/@angular/material.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__data_product_pipe__ = __webpack_require__("./src/app/data/product.pipe.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__data_type_pipe__ = __webpack_require__("./src/app/data/type.pipe.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__data_data_source__ = __webpack_require__("./src/app/data/data-source.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__data_storage_service__ = __webpack_require__("./src/app/data/storage.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__con_pricing_component_html__ = __webpack_require__("./src/app/conventions/con-pricing.component.html");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__con_pricing_component_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__con_pricing_component_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__con_pricing_component_scss__ = __webpack_require__("./src/app/conventions/con-pricing.component.scss");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__con_pricing_component_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__con_pricing_component_scss__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};








let ConPricingComponent = class ConPricingComponent {
    constructor(storage, product, type) {
        this.storage = storage;
        this.product = product;
        this.type = type;
        this.displayedColumns = ['type', 'product', 'quantity', 'price'];
        this._prices = this.storage.prices;
        this.dataSource = new __WEBPACK_IMPORTED_MODULE_4__data_data_source__["a" /* ConDataSource */](this._prices.map(_ => [].concat(..._.map(({ product, type, prices }) => prices.map(_ => ({ product, type, quantity: _[0], price: _[1] }))))));
    }
    ngOnInit() {
        this.dataSource.filter = row => {
            const productDiscontinued = row.product ? this.product.transform(row.product).discontinued : false;
            const typeDiscontinued = this.type.transform(row.type).discontinued;
            const conPrice = this.con.data.prices.find(_ => _.type === row.type && _.product === row.product);
            return !!conPrice || !(productDiscontinued || typeDiscontinued);
        };
        this.sort.mdSortChange.subscribe((sort) => {
            let fn = null;
            if (sort.direction && sort.active) {
                const dir = sort.direction === 'asc' ? -1 : 1;
                switch (sort.active) {
                    case 'type':
                        fn = (a, b) => (this.type.transform(a.type).name < this.type.transform(b.type).name ? 1 : -1) * dir;
                        break;
                    case 'product':
                        fn = (a, b) => (((a.product ? this.product.transform(a.product).name : 0) <
                            (b.product ? this.product.transform(b.product).name : 0)) ? 1 : -1) * dir;
                        break;
                    case 'price':
                        fn = (a, b) => (a.price - b.price) * dir;
                        break;
                    case 'quantity':
                        fn = (a, b) => (a.quantity - b.quantity) * dir;
                        break;
                }
            }
            this.dataSource.sort = fn;
        });
    }
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", Object)
], ConPricingComponent.prototype, "con", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_16" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1__angular_material__["r" /* MdSort */]),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_material__["r" /* MdSort */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_material__["r" /* MdSort */]) === "function" && _a || Object)
], ConPricingComponent.prototype, "sort", void 0);
ConPricingComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'con-con-pricing',
        template: __WEBPACK_IMPORTED_MODULE_6__con_pricing_component_html___default.a,
        styles: [__WEBPACK_IMPORTED_MODULE_7__con_pricing_component_scss___default.a],
    }),
    __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Inject */])(__WEBPACK_IMPORTED_MODULE_5__data_storage_service__["a" /* StorageService */])),
    __param(1, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Inject */])(__WEBPACK_IMPORTED_MODULE_2__data_product_pipe__["a" /* ProductPipe */])),
    __param(2, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Inject */])(__WEBPACK_IMPORTED_MODULE_3__data_type_pipe__["a" /* TypePipe */])),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_5__data_storage_service__["a" /* StorageService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__data_storage_service__["a" /* StorageService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_2__data_product_pipe__["a" /* ProductPipe */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__data_product_pipe__["a" /* ProductPipe */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_3__data_type_pipe__["a" /* TypePipe */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__data_type_pipe__["a" /* TypePipe */]) === "function" && _d || Object])
], ConPricingComponent);

var _a, _b, _c, _d;
//# sourceMappingURL=con-pricing.component.js.map

/***/ }),

/***/ "./src/app/conventions/conventions.component.html":
/***/ (function(module, exports) {

module.exports = "<ng-container *ngIf=\"conventions.length; else placeholder\">\n  <router-outlet></router-outlet>\n</ng-container>\n<ng-template #placeholder>\n  <div class=\"conventions__placeholder\">\n    <p>\n      You haven't signed up for any conventions yet!\n    </p>\n    <button md-fab class=\"conventions__placeholder-button\" (click)=\"openAddConventions()\">\n      <md-icon>add</md-icon>\n    </button>\n    <p>\n      Add one!\n    </p>\n  </div>\n</ng-template>\n"

/***/ }),

/***/ "./src/app/conventions/conventions.component.scss":
/***/ (function(module, exports) {

module.exports = ".conventions__placeholder {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n      flex-direction: column;\n  -ms-flex-align: center;\n      align-items: center;\n  -ms-flex-pack: center;\n      justify-content: center;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  padding: 16px;\n  color: rgba(0, 0, 0, 0.54); }\n\n.conventions__placeholder-button {\n  margin: 16px; }\n"

/***/ }),

/***/ "./src/app/conventions/conventions.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConventionsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_filter__ = __webpack_require__("./node_modules/rxjs/add/operator/filter.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_filter___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_add_operator_filter__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__conventions_component_html__ = __webpack_require__("./src/app/conventions/conventions.component.html");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__conventions_component_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__conventions_component_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__conventions_component_scss__ = __webpack_require__("./src/app/conventions/conventions.component.scss");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__conventions_component_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__conventions_component_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__data_storage_service__ = __webpack_require__("./src/app/data/storage.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__modals_choose_convention_service__ = __webpack_require__("./src/app/modals/choose-convention.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__modals_error_service__ = __webpack_require__("./src/app/modals/error.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};







let ConventionsComponent = class ConventionsComponent {
    constructor(storage, chooseConvention, error) {
        this.storage = storage;
        this.chooseConvention = chooseConvention;
        this.error = error;
        this._conventions = this.storage.conventions;
    }
    get conventions() {
        return this._conventions.getValue();
    }
    openAddConventions() {
        this.chooseConvention
            .open()
            .filter((_) => !!_)
            .subscribe((con) => {
            try {
                this.storage.addConvention(con);
            }
            catch (error) {
                console.error(error);
                this.error.open(error);
                return;
            }
            this.storage.commit(true);
        });
    }
};
ConventionsComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'con-conventions',
        template: __WEBPACK_IMPORTED_MODULE_2__conventions_component_html___default.a,
        styles: [__WEBPACK_IMPORTED_MODULE_3__conventions_component_scss___default.a],
    }),
    __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Inject */])(__WEBPACK_IMPORTED_MODULE_4__data_storage_service__["a" /* StorageService */])),
    __param(1, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Inject */])(__WEBPACK_IMPORTED_MODULE_5__modals_choose_convention_service__["a" /* ChooseConventionService */])),
    __param(2, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Inject */])(__WEBPACK_IMPORTED_MODULE_6__modals_error_service__["a" /* ErrorService */])),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_4__data_storage_service__["a" /* StorageService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__data_storage_service__["a" /* StorageService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_5__modals_choose_convention_service__["a" /* ChooseConventionService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__modals_choose_convention_service__["a" /* ChooseConventionService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_6__modals_error_service__["a" /* ErrorService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_6__modals_error_service__["a" /* ErrorService */]) === "function" && _c || Object])
], ConventionsComponent);

var _a, _b, _c;
//# sourceMappingURL=conventions.component.js.map

/***/ }),

/***/ "./src/app/conventions/conventions.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConventionsModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__("./node_modules/@angular/common/@angular/common.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__data_data_module__ = __webpack_require__("./src/app/data/data.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__modals_modals_module__ = __webpack_require__("./src/app/modals/modals.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__routing_routing_module__ = __webpack_require__("./src/app/routing/routing.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__conventions_component__ = __webpack_require__("./src/app/conventions/conventions.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__con_list_component__ = __webpack_require__("./src/app/conventions/con-list.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__con_info_component__ = __webpack_require__("./src/app/conventions/con-info.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__record_list_component__ = __webpack_require__("./src/app/conventions/record-list.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__con_inventory_component__ = __webpack_require__("./src/app/conventions/con-inventory.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__con_pricing_component__ = __webpack_require__("./src/app/conventions/con-pricing.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__stats_component__ = __webpack_require__("./src/app/conventions/stats.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__material_module__ = __webpack_require__("./src/app/material.module.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};













let ConventionsModule = class ConventionsModule {
};
ConventionsModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["M" /* NgModule */])({
        imports: [__WEBPACK_IMPORTED_MODULE_1__angular_common__["b" /* CommonModule */], __WEBPACK_IMPORTED_MODULE_12__material_module__["a" /* MaterialModule */], __WEBPACK_IMPORTED_MODULE_2__data_data_module__["a" /* DataModule */], __WEBPACK_IMPORTED_MODULE_3__modals_modals_module__["a" /* ModalsModule */], __WEBPACK_IMPORTED_MODULE_4__routing_routing_module__["a" /* RoutingModule */]],
        declarations: [__WEBPACK_IMPORTED_MODULE_5__conventions_component__["a" /* ConventionsComponent */], __WEBPACK_IMPORTED_MODULE_6__con_list_component__["a" /* ConListComponent */], __WEBPACK_IMPORTED_MODULE_8__record_list_component__["a" /* RecordListComponent */], __WEBPACK_IMPORTED_MODULE_7__con_info_component__["a" /* ConInfoComponent */], __WEBPACK_IMPORTED_MODULE_11__stats_component__["a" /* StatsComponent */], __WEBPACK_IMPORTED_MODULE_9__con_inventory_component__["a" /* ConInventoryComponent */], __WEBPACK_IMPORTED_MODULE_10__con_pricing_component__["a" /* ConPricingComponent */]],
        exports: [__WEBPACK_IMPORTED_MODULE_5__conventions_component__["a" /* ConventionsComponent */], __WEBPACK_IMPORTED_MODULE_7__con_info_component__["a" /* ConInfoComponent */], __WEBPACK_IMPORTED_MODULE_6__con_list_component__["a" /* ConListComponent */]],
    })
], ConventionsModule);

//# sourceMappingURL=conventions.module.js.map

/***/ }),

/***/ "./src/app/conventions/record-list.component.html":
/***/ (function(module, exports) {

module.exports = "<ng-container *ngIf=\"(con|async).data.records.length; else placeholder\">\n  <md-table [dataSource]=\"dataSource\">\n    <ng-container cdkColumnDef=\"type\">\n      <md-header-cell *cdkHeaderCellDef class=\"records__column--icon\">Type</md-header-cell>\n      <md-cell *cdkCellDef=\"let record\" class=\"records__column--icon\">\n        <div class=\"records__type-icon\" [style.backgroundColor]=\"type(record).color|color\">\n          {{ type(record).name[0] }}\n        </div>\n      </md-cell>\n    </ng-container>\n\n    <ng-container cdkColumnDef=\"products\">\n      <md-header-cell *cdkHeaderCellDef>Products</md-header-cell>\n      <md-cell *cdkCellDef=\"let record\">{{ products(record) }}</md-cell>\n    </ng-container>\n\n    <ng-container cdkColumnDef=\"price\">\n      <md-header-cell *cdkHeaderCellDef>Quantity</md-header-cell>\n      <md-cell *cdkCellDef=\"let record\">{{ record.price | currency:'USD':true }}</md-cell>\n    </ng-container>\n\n    <ng-container cdkColumnDef=\"time\">\n      <md-header-cell *cdkHeaderCellDef>Time</md-header-cell>\n      <md-cell *cdkCellDef=\"let record\">{{ record.time | date:'shortTime' }}</md-cell>\n    </ng-container>\n\n    <md-header-row *cdkHeaderRowDef=\"displayedColumns\"></md-header-row>\n    <md-row *cdkRowDef=\"let record; columns: displayedColumns\"></md-row>\n  </md-table>\n</ng-container>\n<ng-template #placeholder>\n  <div class=\"records__placeholder\">\n    <p>You haven't sold anything yet.</p>\n  </div>\n</ng-template>\n"

/***/ }),

/***/ "./src/app/conventions/record-list.component.scss":
/***/ (function(module, exports) {

module.exports = ".records__column--icon {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-positive: 0;\n      flex-grow: 0;\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n  -ms-flex-preferred-size: 80px;\n      flex-basis: 80px;\n  -ms-flex-pack: center;\n      justify-content: center; }\n\n.records__type-icon {\n  display: -ms-flexbox;\n  display: flex;\n  width: 40px;\n  height: 40px;\n  -ms-flex-align: center;\n      align-items: center;\n  -ms-flex-pack: center;\n      justify-content: center;\n  font-size: 16pt;\n  font-weight: bold;\n  color: white;\n  border-radius: 100%; }\n\n.records__placeholder {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n      flex-direction: column;\n  -ms-flex-align: center;\n      align-items: center;\n  -ms-flex-pack: center;\n      justify-content: center;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  padding: 16px;\n  color: rgba(0, 0, 0, 0.54); }\n"

/***/ }),

/***/ "./src/app/conventions/record-list.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RecordListComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__ = __webpack_require__("./node_modules/rxjs/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__data_product_pipe__ = __webpack_require__("./src/app/data/product.pipe.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__data_type_pipe__ = __webpack_require__("./src/app/data/type.pipe.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__data_data_source__ = __webpack_require__("./src/app/data/data-source.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__record_list_component_html__ = __webpack_require__("./src/app/conventions/record-list.component.html");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__record_list_component_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__record_list_component_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__record_list_component_scss__ = __webpack_require__("./src/app/conventions/record-list.component.scss");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__record_list_component_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__record_list_component_scss__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};







const unique = (v, i, arr) => arr.indexOf(v) === i;
let RecordListComponent = class RecordListComponent {
    constructor(productPipe, typePipe) {
        this.productPipe = productPipe;
        this.typePipe = typePipe;
        this.displayedColumns = ['type', 'products', 'price', 'time'];
    }
    ngOnInit() {
        this.dataSource = new __WEBPACK_IMPORTED_MODULE_4__data_data_source__["a" /* ConDataSource */](this.con.map(_ => _.data.records));
    }
    type(record) {
        const products = record.products.filter(unique).map(_ => this.productPipe.transform(_));
        const typeIds = products.map(_ => _.type).filter(unique);
        if (typeIds.length === 1) {
            return this.typePipe.transform(typeIds[0]);
        }
        else {
            return { color: 0xFFFFFF, name: '?', discontinued: false, id: -1 };
        }
    }
    products(record) {
        const products = record.products.reduce((_, product) => (Object.assign({}, _, { [product]: (_[product] || 0) + 1 })), {});
        return Object.entries(products)
            .map(([product, count]) => this.productPipe.transform(+product, 'name') + (count === 1 ? '' : ` (${count})`))
            .join(', ');
    }
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"]) === "function" && _a || Object)
], RecordListComponent.prototype, "con", void 0);
RecordListComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'con-record-list',
        template: __WEBPACK_IMPORTED_MODULE_5__record_list_component_html___default.a,
        styles: [__WEBPACK_IMPORTED_MODULE_6__record_list_component_scss___default.a],
    }),
    __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Inject */])(__WEBPACK_IMPORTED_MODULE_2__data_product_pipe__["a" /* ProductPipe */])),
    __param(1, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Inject */])(__WEBPACK_IMPORTED_MODULE_3__data_type_pipe__["a" /* TypePipe */])),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_2__data_product_pipe__["a" /* ProductPipe */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__data_product_pipe__["a" /* ProductPipe */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__data_type_pipe__["a" /* TypePipe */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__data_type_pipe__["a" /* TypePipe */]) === "function" && _c || Object])
], RecordListComponent);

var _a, _b, _c;
//# sourceMappingURL=record-list.component.js.map

/***/ }),

/***/ "./src/app/conventions/stats.component.html":
/***/ (function(module, exports) {

module.exports = "<ng-container *ngIf=\"con.data.records.length; else placeholder\">\n  <ng-template #placeholder>\n    <div class=\"stats__placeholder\">\n      <p>This feature is coming soon!</p>\n    </div>\n  </ng-template>\n</ng-container>\n<ng-template #placeholder>\n  <div class=\"stats__placeholder\">\n    <p>You haven't sold anything yet.</p>\n  </div>\n</ng-template>\n"

/***/ }),

/***/ "./src/app/conventions/stats.component.scss":
/***/ (function(module, exports) {

module.exports = ".stats__placeholder {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n      flex-direction: column;\n  -ms-flex-align: center;\n      align-items: center;\n  -ms-flex-pack: center;\n      justify-content: center;\n  box-sizing: border-box;\n  width: 100%;\n  height: 100%;\n  padding: 16px;\n  color: rgba(0, 0, 0, 0.54); }\n"

/***/ }),

/***/ "./src/app/conventions/stats.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return StatsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__stats_component_html__ = __webpack_require__("./src/app/conventions/stats.component.html");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__stats_component_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__stats_component_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__stats_component_scss__ = __webpack_require__("./src/app/conventions/stats.component.scss");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__stats_component_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__stats_component_scss__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



let StatsComponent = class StatsComponent {
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", Object)
], StatsComponent.prototype, "con", void 0);
StatsComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'con-stats',
        template: __WEBPACK_IMPORTED_MODULE_1__stats_component_html___default.a,
        styles: [__WEBPACK_IMPORTED_MODULE_2__stats_component_scss___default.a],
    })
], StatsComponent);

//# sourceMappingURL=stats.component.js.map

/***/ }),

/***/ "./src/app/dashboard/dash-conventions.component.html":
/***/ (function(module, exports) {

module.exports = "<md-card class=\"convention\">\n  <md-card-header>\n    <md-card-title class=\"convention__title\">Conventions</md-card-title>\n    <button md-button class=\"convention__button\" (click)=\"openBuyKeys()\" mdTooltip=\"Buy more keys!\"><span class=\"convention__button-label\"><md-icon>vpn_key</md-icon> {{ keys|async }}</span></button>\n  </md-card-header>\n  <md-card-content>\n    <con-list *ngIf=\"conventions.length; else placeholder\"></con-list>\n    <ng-template #placeholder>\n      <div class=\"convention__placeholder\">\n        <span class=\"convention__placeholder-text\">You haven't signed up for any conventions</span>\n        <span class=\"convention__placeholder-text\">Add one now!</span>\n        <md-icon class=\"convention__placeholder-icon\">arrow_downward</md-icon>\n      </div>\n    </ng-template>\n  </md-card-content>\n  <md-card-actions>\n    <button md-button class=\"convention__button--fullwidth convention__button\" (click)=\"openAddConventions()\" mdTooltip=\"Get more conventions\" mdTooltipPosition=\"above\"><md-icon>add</md-icon></button>\n  </md-card-actions>\n</md-card>\n"

/***/ }),

/***/ "./src/app/dashboard/dash-conventions.component.scss":
/***/ (function(module, exports) {

module.exports = ".convention__title {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n      align-items: center;\n  margin: 0; }\n\n.convention__button {\n  margin-left: auto; }\n  .convention__button--fullwidth {\n    width: 100%; }\n\n.convention__button-label {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n      align-items: center;\n  -ms-flex-pack: distribute;\n      justify-content: space-around; }\n\n.convention__code {\n  color: rgba(0, 0, 0, 0.54);\n  margin: 0 16px; }\n\n.convention__date {\n  font-size: 10pt;\n  margin-left: auto; }\n\n.convention__placeholder {\n  width: 100%;\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-direction: column;\n      flex-direction: column;\n  -ms-flex-align: center;\n      align-items: center;\n  font-weight: 300;\n  color: rgba(0, 0, 0, 0.54); }\n\n.convention__placeholder-text {\n  margin: 4px 0; }\n\n.convention__placeholder-icon {\n  margin: 16px 0 0 0; }\n"

/***/ }),

/***/ "./src/app/dashboard/dash-conventions.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DashConventionsComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("./node_modules/@angular/router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dash_conventions_component_html__ = __webpack_require__("./src/app/dashboard/dash-conventions.component.html");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dash_conventions_component_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__dash_conventions_component_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__dash_conventions_component_scss__ = __webpack_require__("./src/app/dashboard/dash-conventions.component.scss");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__dash_conventions_component_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__dash_conventions_component_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__data_storage_service__ = __webpack_require__("./src/app/data/storage.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__modals_choose_convention_service__ = __webpack_require__("./src/app/modals/choose-convention.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__modals_error_service__ = __webpack_require__("./src/app/modals/error.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};







let DashConventionsComponent = class DashConventionsComponent {
    constructor(storage, chooseConvention, error, router) {
        this.storage = storage;
        this.chooseConvention = chooseConvention;
        this.error = error;
        this.router = router;
        this._conventions = this.storage.conventions;
        this.keys = this.storage.keys;
    }
    get conventions() {
        return this._conventions.getValue().filter((_) => _.type !== 'invalid');
    }
    viewCon(code) {
        this.router.navigate(['/conventions', code]);
    }
    openBuyKeys() {
        console.log('buying a key!');
    }
    openAddConventions() {
        this.chooseConvention.open()
            .filter((_) => !!_)
            .subscribe((con) => {
            try {
                this.storage.addConvention(con);
            }
            catch (error) {
                console.error(error);
                this.error.open(error);
                return;
            }
            this.storage.commit(true);
        });
    }
};
DashConventionsComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'con-dash-conventions',
        template: __WEBPACK_IMPORTED_MODULE_2__dash_conventions_component_html___default.a,
        styles: [__WEBPACK_IMPORTED_MODULE_3__dash_conventions_component_scss___default.a],
    }),
    __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Inject */])(__WEBPACK_IMPORTED_MODULE_4__data_storage_service__["a" /* StorageService */])),
    __param(1, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Inject */])(__WEBPACK_IMPORTED_MODULE_5__modals_choose_convention_service__["a" /* ChooseConventionService */])),
    __param(2, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Inject */])(__WEBPACK_IMPORTED_MODULE_6__modals_error_service__["a" /* ErrorService */])),
    __param(3, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Inject */])(__WEBPACK_IMPORTED_MODULE_1__angular_router__["h" /* Router */])),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_4__data_storage_service__["a" /* StorageService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__data_storage_service__["a" /* StorageService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_5__modals_choose_convention_service__["a" /* ChooseConventionService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__modals_choose_convention_service__["a" /* ChooseConventionService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_6__modals_error_service__["a" /* ErrorService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_6__modals_error_service__["a" /* ErrorService */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["h" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["h" /* Router */]) === "function" && _d || Object])
], DashConventionsComponent);

var _a, _b, _c, _d;
//# sourceMappingURL=dash-conventions.component.js.map

/***/ }),

/***/ "./src/app/dashboard/dash-inventory.component.html":
/***/ (function(module, exports) {

module.exports = "<md-card class=\"inventory\">\n  <md-card-header>\n    <md-card-title>Inventory</md-card-title>\n  </md-card-header>\n</md-card>\n"

/***/ }),

/***/ "./src/app/dashboard/dash-inventory.component.scss":
/***/ (function(module, exports) {

module.exports = ""

/***/ }),

/***/ "./src/app/dashboard/dash-inventory.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DashInventoryComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dash_inventory_component_html__ = __webpack_require__("./src/app/dashboard/dash-inventory.component.html");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dash_inventory_component_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__dash_inventory_component_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dash_inventory_component_scss__ = __webpack_require__("./src/app/dashboard/dash-inventory.component.scss");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dash_inventory_component_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__dash_inventory_component_scss__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



let DashInventoryComponent = class DashInventoryComponent {
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", Object)
], DashInventoryComponent.prototype, "products", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", Object)
], DashInventoryComponent.prototype, "types", void 0);
DashInventoryComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'con-dash-inventory',
        template: __WEBPACK_IMPORTED_MODULE_1__dash_inventory_component_html___default.a,
        styles: [__WEBPACK_IMPORTED_MODULE_2__dash_inventory_component_scss___default.a],
    })
], DashInventoryComponent);

//# sourceMappingURL=dash-inventory.component.js.map

/***/ }),

/***/ "./src/app/dashboard/dashboard.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"dashboard__card-grid\">\n  <con-dash-conventions class=\"dashboard__card\"></con-dash-conventions>\n  <con-dash-inventory class=\"dashboard__card\"></con-dash-inventory>\n</div>\n"

/***/ }),

/***/ "./src/app/dashboard/dashboard.component.scss":
/***/ (function(module, exports) {

module.exports = ":host {\n  -ms-flex-positive: 1;\n      flex-grow: 1; }\n\n.dashboard {\n  -ms-flex-positive: 1;\n      flex-grow: 1; }\n  .dashboard__card-grid {\n    display: -ms-flexbox;\n    display: flex;\n    -ms-flex-direction: row;\n        flex-direction: row;\n    -ms-flex-wrap: wrap;\n        flex-wrap: wrap;\n    width: 100%; }\n  .dashboard__card {\n    -ms-flex-positive: 1;\n        flex-grow: 1;\n    margin: 16px; }\n"

/***/ }),

/***/ "./src/app/dashboard/dashboard.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DashboardComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dashboard_component_html__ = __webpack_require__("./src/app/dashboard/dashboard.component.html");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__dashboard_component_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__dashboard_component_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dashboard_component_scss__ = __webpack_require__("./src/app/dashboard/dashboard.component.scss");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dashboard_component_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__dashboard_component_scss__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



let DashboardComponent = class DashboardComponent {
};
DashboardComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'con-dashboard',
        template: __WEBPACK_IMPORTED_MODULE_1__dashboard_component_html___default.a,
        styles: [__WEBPACK_IMPORTED_MODULE_2__dashboard_component_scss___default.a],
    })
], DashboardComponent);

//# sourceMappingURL=dashboard.component.js.map

/***/ }),

/***/ "./src/app/dashboard/dashboard.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DashboardModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__("./node_modules/@angular/common/@angular/common.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__dashboard_component__ = __webpack_require__("./src/app/dashboard/dashboard.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__dash_conventions_component__ = __webpack_require__("./src/app/dashboard/dash-conventions.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__dash_inventory_component__ = __webpack_require__("./src/app/dashboard/dash-inventory.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__material_module__ = __webpack_require__("./src/app/material.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__modals_modals_module__ = __webpack_require__("./src/app/modals/modals.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__conventions_conventions_module__ = __webpack_require__("./src/app/conventions/conventions.module.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};








let DashboardModule = class DashboardModule {
};
DashboardModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["M" /* NgModule */])({
        imports: [
            __WEBPACK_IMPORTED_MODULE_5__material_module__["a" /* MaterialModule */],
            __WEBPACK_IMPORTED_MODULE_1__angular_common__["b" /* CommonModule */],
            __WEBPACK_IMPORTED_MODULE_6__modals_modals_module__["a" /* ModalsModule */],
            __WEBPACK_IMPORTED_MODULE_7__conventions_conventions_module__["a" /* ConventionsModule */],
        ],
        declarations: [
            __WEBPACK_IMPORTED_MODULE_2__dashboard_component__["a" /* DashboardComponent */],
            __WEBPACK_IMPORTED_MODULE_3__dash_conventions_component__["a" /* DashConventionsComponent */],
            __WEBPACK_IMPORTED_MODULE_4__dash_inventory_component__["a" /* DashInventoryComponent */],
        ],
        exports: [__WEBPACK_IMPORTED_MODULE_2__dashboard_component__["a" /* DashboardComponent */]],
    })
], DashboardModule);

//# sourceMappingURL=dashboard.module.js.map

/***/ }),

/***/ "./src/app/data/data.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return DataModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__storage_service__ = __webpack_require__("./src/app/data/storage.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__save_service__ = __webpack_require__("./src/app/data/save.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__color_pipe__ = __webpack_require__("./src/app/data/color.pipe.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__type_pipe__ = __webpack_require__("./src/app/data/type.pipe.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__product_pipe__ = __webpack_require__("./src/app/data/product.pipe.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__api_api_module__ = __webpack_require__("./src/app/api/api.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__broadcast_broadcast_module__ = __webpack_require__("./src/app/broadcast/broadcast.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__modals_modals_module__ = __webpack_require__("./src/app/modals/modals.module.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};









let DataModule = class DataModule {
};
DataModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["M" /* NgModule */])({
        imports: [__WEBPACK_IMPORTED_MODULE_8__modals_modals_module__["a" /* ModalsModule */], __WEBPACK_IMPORTED_MODULE_6__api_api_module__["a" /* APIModule */], __WEBPACK_IMPORTED_MODULE_7__broadcast_broadcast_module__["a" /* BroadcastModule */]],
        declarations: [__WEBPACK_IMPORTED_MODULE_4__type_pipe__["a" /* TypePipe */], __WEBPACK_IMPORTED_MODULE_5__product_pipe__["a" /* ProductPipe */], __WEBPACK_IMPORTED_MODULE_3__color_pipe__["a" /* ColorPipe */]],
        providers: [__WEBPACK_IMPORTED_MODULE_1__storage_service__["a" /* StorageService */], __WEBPACK_IMPORTED_MODULE_2__save_service__["a" /* SaveService */], __WEBPACK_IMPORTED_MODULE_4__type_pipe__["a" /* TypePipe */], __WEBPACK_IMPORTED_MODULE_5__product_pipe__["a" /* ProductPipe */]],
        exports: [__WEBPACK_IMPORTED_MODULE_4__type_pipe__["a" /* TypePipe */], __WEBPACK_IMPORTED_MODULE_5__product_pipe__["a" /* ProductPipe */], __WEBPACK_IMPORTED_MODULE_3__color_pipe__["a" /* ColorPipe */]],
    })
], DataModule);

//# sourceMappingURL=data.module.js.map

/***/ }),

/***/ "./src/app/editable/editable.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return EditableModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_forms__ = __webpack_require__("./node_modules/@angular/forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__material_module__ = __webpack_require__("./src/app/material.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__editable_directive__ = __webpack_require__("./src/app/editable/editable.directive.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__editable_component__ = __webpack_require__("./src/app/editable/editable.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};





let EditableModule = class EditableModule {
};
EditableModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["M" /* NgModule */])({
        imports: [__WEBPACK_IMPORTED_MODULE_2__material_module__["a" /* MaterialModule */], __WEBPACK_IMPORTED_MODULE_1__angular_forms__["d" /* FormsModule */]],
        declarations: [__WEBPACK_IMPORTED_MODULE_3__editable_directive__["a" /* EditableDirective */], __WEBPACK_IMPORTED_MODULE_4__editable_component__["a" /* EditableComponent */]],
        exports: [__WEBPACK_IMPORTED_MODULE_3__editable_directive__["a" /* EditableDirective */], __WEBPACK_IMPORTED_MODULE_4__editable_component__["a" /* EditableComponent */]],
    })
], EditableModule);

//# sourceMappingURL=editable.module.js.map

/***/ }),

/***/ "./src/app/help/absolute-viewbox.directive.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AbsoluteViewboxDirective; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};

let AbsoluteViewboxDirective = class AbsoluteViewboxDirective {
    constructor(element) {
        this.element = element;
    }
    get viewbox() {
        const { top, left, width, height } = this.element.nativeElement.getBoundingClientRect();
        return `${left} ${top} ${width} ${height}`;
    }
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["z" /* HostBinding */])('attr.viewBox'),
    __metadata("design:type", String),
    __metadata("design:paramtypes", [])
], AbsoluteViewboxDirective.prototype, "viewbox", null);
AbsoluteViewboxDirective = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* Directive */])({ selector: '[conAbsoluteViewbox]' }),
    __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Inject */])(__WEBPACK_IMPORTED_MODULE_0__angular_core__["v" /* ElementRef */])),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["v" /* ElementRef */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["v" /* ElementRef */]) === "function" && _a || Object])
], AbsoluteViewboxDirective);

var _a;
//# sourceMappingURL=absolute-viewbox.directive.js.map

/***/ }),

/***/ "./src/app/help/help-arrow.directive.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HelpArrowDirective; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__help_constants__ = __webpack_require__("./src/app/help/help.constants.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__help_constants___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__help_constants__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


let HelpArrowDirective = class HelpArrowDirective {
    constructor() {
        this.startSide = 'center';
        this.endSide = 'center';
    }
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", String)
], HelpArrowDirective.prototype, "start", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", String)
], HelpArrowDirective.prototype, "end", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__help_constants__["Side"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__help_constants__["Side"]) === "function" && _a || Object)
], HelpArrowDirective.prototype, "startSide", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__help_constants__["Side"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__help_constants__["Side"]) === "function" && _b || Object)
], HelpArrowDirective.prototype, "endSide", void 0);
HelpArrowDirective = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* Directive */])({
        selector: 'con-help-arrow',
    })
], HelpArrowDirective);

var _a, _b;
//# sourceMappingURL=help-arrow.directive.js.map

/***/ }),

/***/ "./src/app/help/help-outline.directive.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HelpOutlineDirective; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__help_constants__ = __webpack_require__("./src/app/help/help.constants.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__help_constants___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__help_constants__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


let HelpOutlineDirective = class HelpOutlineDirective {
    constructor() {
        this.shape = 'round-rectangle';
    }
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", Object)
], HelpOutlineDirective.prototype, "selector", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__help_constants__["Shape"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__help_constants__["Shape"]) === "function" && _a || Object)
], HelpOutlineDirective.prototype, "shape", void 0);
HelpOutlineDirective = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* Directive */])({
        selector: 'con-help-outline',
    })
], HelpOutlineDirective);

var _a;
//# sourceMappingURL=help-outline.directive.js.map

/***/ }),

/***/ "./src/app/help/help-text.directive.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HelpTextDirective; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__help_constants__ = __webpack_require__("./src/app/help/help.constants.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__help_constants___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1__help_constants__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


let HelpTextDirective = class HelpTextDirective {
    constructor() {
        this.position = 'right';
    }
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", String)
], HelpTextDirective.prototype, "text", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", String)
], HelpTextDirective.prototype, "anchor", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__help_constants__["Side"] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__help_constants__["Side"]) === "function" && _a || Object)
], HelpTextDirective.prototype, "position", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", Number)
], HelpTextDirective.prototype, "x", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", Number)
], HelpTextDirective.prototype, "y", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])('class'),
    __metadata("design:type", String)
], HelpTextDirective.prototype, "className", void 0);
HelpTextDirective = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* Directive */])({
        selector: 'con-help-text',
    })
], HelpTextDirective);

var _a;
//# sourceMappingURL=help-text.directive.js.map

/***/ }),

/***/ "./src/app/help/help.component.html":
/***/ (function(module, exports) {

module.exports = "<ng-container *ngIf=\"visible\">\n  <svg (click)=\"visible = false\" conAbsoluteViewbox>\n    <defs>\n      <marker id=\"arrowhead\" viewBox=\"0 0 10 10\" refX=\"10\" refY=\"5\" markerWidth=\"10\" markerHeight=\"10\" orient=\"auto\">\n        <path d=\"M 0 0 L 10 5 L 0 10\" />\n      </marker>\n    </defs>\n    <svg:g *ngFor=\"let outline of outlines\">\n      <ng-container [ngSwitch]=\"outline.type\">\n        <svg:rect\n          *ngSwitchCase=\"'rectangle'\"\n          [attr.x]=\"outline.x\"\n          [attr.y]=\"outline.y\"\n          [attr.width]=\"outline.width\"\n          [attr.height]=\"outline.height\" />\n        <svg:rect\n          *ngSwitchCase=\"'round-rectangle'\"\n          [attr.x]=\"outline.x\"\n          [attr.y]=\"outline.y\"\n          [attr.width]=\"outline.width\"\n          [attr.height]=\"outline.height\"\n          rx=\"15\"\n          ry=\"15\" />\n        <svg:ellipse\n          *ngSwitchCase=\"'ellipse'\"\n          [attr.cx]=\"outline.x\"\n          [attr.cy]=\"outline.y\"\n          [attr.rx]=\"outline.rx\"\n          [attr.ry]=\"outline.ry\" />\n      </ng-container>\n    </svg:g>\n    <svg:g *ngFor=\"let text of texts\">\n      <svg:text [attr.x]=\"text.x\" [attr.y]=\"text.y\" [ngClass]=\"text.className\">\n        {{ text.text }}\n      </svg:text>\n    </svg:g>\n    <svg:g *ngFor=\"let arrow of arrows\">\n      <svg:path [attr.d]=\"arrow.d\" marker-end=\"url(#arrowhead)\" class=\"arrow\" />\n    </svg:g>\n  </svg>\n</ng-container>\n"

/***/ }),

/***/ "./src/app/help/help.component.scss":
/***/ (function(module, exports) {

module.exports = ":host {\n  position: fixed;\n  top: 0;\n  bottom: 0;\n  right: 0;\n  left: 0;\n  z-index: 1000;\n  pointer-events: none; }\n\nsvg {\n  width: 100%;\n  height: 100%;\n  pointer-events: auto;\n  background-color: rgba(0, 0, 0, 0.4); }\n  svg rect, svg ellipse, svg path {\n    stroke: white;\n    stroke-width: 1px;\n    fill: none; }\n  svg text {\n    stroke: none;\n    fill: white; }\n\n.help__text--left, .help__text--center, .help__text--right {\n  alignment-baseline: middle; }\n\n.help__text--top-left, .help__text--top, .help__text--top-right {\n  alignment-baseline: bottom; }\n\n.help__text--bottom-left, .help__text--bottom, .help__text--bottom-right {\n  alignment-baseline: top; }\n\n.help__text--top, .help__text--center, .help__text--bottom {\n  text-anchor: middle; }\n\n.help__text--top-right, .help__text--right, .help__text--bottom-right {\n  text-anchor: start;\n  -ms-transform: translateX(5px);\n      transform: translateX(5px); }\n\n.help__text--top-left, .help__text--left, .help__text--bottom-left {\n  text-anchor: end;\n  -ms-transform: translateX(-5px);\n      transform: translateX(-5px); }\n"

/***/ }),

/***/ "./src/app/help/help.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HelpComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__help_arrow_directive__ = __webpack_require__("./src/app/help/help-arrow.directive.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__help_text_directive__ = __webpack_require__("./src/app/help/help-text.directive.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__help_outline_directive__ = __webpack_require__("./src/app/help/help-outline.directive.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__help_service__ = __webpack_require__("./src/app/help/help.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__help_component_html__ = __webpack_require__("./src/app/help/help.component.html");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__help_component_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__help_component_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__help_component_scss__ = __webpack_require__("./src/app/help/help.component.scss");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__help_component_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__help_component_scss__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};







function getCoordinate(element, side) {
    const rect = element.getBoundingClientRect();
    switch (side) {
        case 'left':
            return { x: rect.left, y: rect.top + rect.height / 2 };
        case 'right':
            return { x: rect.right, y: rect.top + rect.height / 2 };
        case 'top':
            return { x: rect.left + rect.width / 2, y: rect.top };
        case 'bottom':
            return { x: rect.left + rect.width / 2, y: rect.bottom };
        case 'top-left':
            return { x: rect.left, y: rect.top };
        case 'top-right':
            return { x: rect.right, y: rect.top };
        case 'bottom-left':
            return { x: rect.left, y: rect.bottom };
        case 'bottom-right':
            return { x: rect.right, y: rect.bottom };
        case 'center':
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    }
}
let HelpComponent = class HelpComponent {
    constructor(help, changeDetector) {
        this.help = help;
        this.changeDetector = changeDetector;
    }
    onResize() {
        this.changeDetector.detectChanges();
    }
    get visible() { return this.help.visible; }
    set visible(visible) {
        if (visible) {
            this.help.show();
        }
        else {
            this.help.hide();
        }
    }
    get texts() {
        return this._texts.map(text => {
            let [x, y] = [0, 0];
            if (text.anchor) {
                const element = this.helpFor.querySelector(text.anchor);
                if (!element) {
                    return null;
                }
                const coord = getCoordinate(element, text.position);
                x = coord.x;
                y = coord.y;
            }
            else if (text.x !== undefined && text.y !== undefined) {
                x = text.x;
                y = text.y;
            }
            else {
                return null;
            }
            return { text: text.text, x, y, className: `${text.className || ''} help__text--${text.position}` };
        }).filter((_) => !!_);
    }
    get outlines() {
        return this._outlines.map(outline => {
            const children = this.helpFor.querySelectorAll(typeof outline.selector === 'string' ? outline.selector : outline.selector.join(','));
            if (!children.length) {
                return;
            }
            const bounds = [].map.call(children, (_) => _.getBoundingClientRect())
                .reduce((_, { top, right, bottom, left }) => {
                return {
                    top: Math.min(top, _.top),
                    right: Math.max(right, _.right),
                    bottom: Math.max(bottom, _.bottom),
                    left: Math.min(left, _.left),
                };
            }, { top: Infinity, right: -Infinity, bottom: -Infinity, left: Infinity });
            switch (outline.shape) {
                case 'ellipse':
                    return {
                        type: outline.shape,
                        x: (bounds.left + bounds.right) / 2,
                        y: (bounds.top + bounds.bottom) / 2,
                        rx: (bounds.left - bounds.right) / 2,
                        ry: (bounds.bottom - bounds.top) / 2,
                    };
                case 'rectangle':
                case 'round-rectangle':
                    return {
                        type: outline.shape,
                        x: Math.floor(bounds.left),
                        y: Math.floor(bounds.top),
                        width: Math.ceil(bounds.right - bounds.left),
                        height: Math.ceil(bounds.bottom - bounds.top),
                    };
            }
        }).filter((_) => !!_);
    }
    get arrows() {
        return this._arrows.map(arrow => {
            const [start, end] = [
                this.helpFor.querySelector(arrow.start),
                this.helpFor.querySelector(arrow.end),
            ];
            if (!start || !end) {
                return null;
            }
            const { x: x1, y: y1 } = getCoordinate(start, arrow.startSide);
            const { x: x2, y: y2 } = getCoordinate(end, arrow.endSide);
            const [dx, dy] = [x1 - x2, y1 - y2];
            const [mx, my] = [
                (x1 + x2) / 2 - dx / 5,
                (y1 + y2) / 2 - dy / 5,
            ];
            return { d: `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}` };
        }).filter((_) => !!_);
    }
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["t" /* ContentChildren */])(__WEBPACK_IMPORTED_MODULE_1__help_arrow_directive__["a" /* HelpArrowDirective */]),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["Z" /* QueryList */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["Z" /* QueryList */]) === "function" && _a || Object)
], HelpComponent.prototype, "_arrows", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["t" /* ContentChildren */])(__WEBPACK_IMPORTED_MODULE_2__help_text_directive__["a" /* HelpTextDirective */]),
    __metadata("design:type", typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["Z" /* QueryList */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["Z" /* QueryList */]) === "function" && _b || Object)
], HelpComponent.prototype, "_texts", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["t" /* ContentChildren */])(__WEBPACK_IMPORTED_MODULE_3__help_outline_directive__["a" /* HelpOutlineDirective */]),
    __metadata("design:type", typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["Z" /* QueryList */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["Z" /* QueryList */]) === "function" && _c || Object)
], HelpComponent.prototype, "_outlines", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["F" /* Input */])(),
    __metadata("design:type", Object)
], HelpComponent.prototype, "helpFor", void 0);
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* HostListener */])('window:resize'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], HelpComponent.prototype, "onResize", null);
HelpComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'con-help',
        template: __WEBPACK_IMPORTED_MODULE_5__help_component_html___default.a,
        styles: [__WEBPACK_IMPORTED_MODULE_6__help_component_scss___default.a],
    }),
    __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Inject */])(__WEBPACK_IMPORTED_MODULE_4__help_service__["a" /* HelpService */])),
    __param(1, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Inject */])(__WEBPACK_IMPORTED_MODULE_0__angular_core__["l" /* ChangeDetectorRef */])),
    __metadata("design:paramtypes", [typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_4__help_service__["a" /* HelpService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__help_service__["a" /* HelpService */]) === "function" && _d || Object, typeof (_e = typeof __WEBPACK_IMPORTED_MODULE_0__angular_core__["l" /* ChangeDetectorRef */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_0__angular_core__["l" /* ChangeDetectorRef */]) === "function" && _e || Object])
], HelpComponent);

var _a, _b, _c, _d, _e;
//# sourceMappingURL=help.component.js.map

/***/ }),

/***/ "./src/app/help/help.constants.ts":
/***/ (function(module, exports) {

//# sourceMappingURL=help.constants.js.map

/***/ }),

/***/ "./src/app/help/help.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HelpModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__("./node_modules/@angular/common/@angular/common.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__absolute_viewbox_directive__ = __webpack_require__("./src/app/help/absolute-viewbox.directive.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__help_component__ = __webpack_require__("./src/app/help/help.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__help_arrow_directive__ = __webpack_require__("./src/app/help/help-arrow.directive.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__help_text_directive__ = __webpack_require__("./src/app/help/help-text.directive.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__help_outline_directive__ = __webpack_require__("./src/app/help/help-outline.directive.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__help_service__ = __webpack_require__("./src/app/help/help.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};








let HelpModule = class HelpModule {
};
HelpModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["M" /* NgModule */])({
        imports: [__WEBPACK_IMPORTED_MODULE_1__angular_common__["b" /* CommonModule */]],
        declarations: [__WEBPACK_IMPORTED_MODULE_3__help_component__["a" /* HelpComponent */], __WEBPACK_IMPORTED_MODULE_2__absolute_viewbox_directive__["a" /* AbsoluteViewboxDirective */], __WEBPACK_IMPORTED_MODULE_4__help_arrow_directive__["a" /* HelpArrowDirective */], __WEBPACK_IMPORTED_MODULE_5__help_text_directive__["a" /* HelpTextDirective */], __WEBPACK_IMPORTED_MODULE_6__help_outline_directive__["a" /* HelpOutlineDirective */]],
        providers: [__WEBPACK_IMPORTED_MODULE_7__help_service__["a" /* HelpService */]],
        exports: [__WEBPACK_IMPORTED_MODULE_3__help_component__["a" /* HelpComponent */], __WEBPACK_IMPORTED_MODULE_4__help_arrow_directive__["a" /* HelpArrowDirective */], __WEBPACK_IMPORTED_MODULE_5__help_text_directive__["a" /* HelpTextDirective */], __WEBPACK_IMPORTED_MODULE_6__help_outline_directive__["a" /* HelpOutlineDirective */]],
    })
], HelpModule);

//# sourceMappingURL=help.module.js.map

/***/ }),

/***/ "./src/app/inventory/inventory.component.html":
/***/ (function(module, exports) {

module.exports = "<div class=\"inventory\" #inventory>\n  <ng-container *ngIf=\"(types|async).length; else placeholder\">\n    <md-tab-group [selectedIndex]=\"tabIndex\" (selectedIndexChange)=\"tabChange($event)\" dynamicHeight=\"true\">\n      <md-tab *ngFor=\"let type of types|async; trackBy:trackID\">\n        <ng-template md-tab-label>\n          <div class=\"inventory__tab-label\" [ngClass]=\"{'inventory__tab-label--discontinued': type.discontinued}\">{{ type.name }}</div>\n        </ng-template>\n        <header class=\"inventory__header\" [style.backgroundColor]=\"type.color|color\">\n          <h1 class=\"inventory__title\" conEditable [content]=\"type.name\" (contentChange)=\"setTypeName($event, type.id)\" [validator]=\"typeNameIsUnique\"></h1>\n          <con-color-picker class=\"inventory__spacer--right\" (selectedChange)=\"setTypeColor(type.id, $event)\" [selected]=\"type.color\">\n            <button md-icon-button mdTooltip=\"Change color\" mdTooltipPosition=\"left\">\n              <md-icon>format_color_fill</md-icon>\n            </button>\n          </con-color-picker>\n          <button md-icon-button (click)=\"setTypeDiscontinued(!type.discontinued, type.id)\" [mdTooltip]=\"type.discontinued ? 'Restore' : type.id > 0 ? 'Discontinue' : 'Delete'\" mdTooltipPosition=\"left\">\n            <md-icon *ngIf=\"!type.discontinued\">remove_circle_outline</md-icon>\n            <md-icon *ngIf=\"type.discontinued\">add_circle_outline</md-icon>\n          </button>\n          <div class=\"inventory__spacer--fullwidth\">\n            <md-slide-toggle [(ngModel)]=\"showDiscontinuedTypes\" class=\"inventory__spacer--right inventory__spacer--bottom\" labelPosition=\"before\">\n              Show discontinued\n            </md-slide-toggle>\n          </div>\n        </header>\n        <div class=\"inventory__card-grid\">\n          <md-card class=\"inventory__card products\">\n            <md-card-header>\n              <md-card-title>Inventory</md-card-title>\n              <md-slide-toggle class=\"inventory__spacer--right\" [(ngModel)]=\"showDiscontinuedProducts\" labelPosition=\"before\">Show discontinued</md-slide-toggle>\n            </md-card-header>\n            <md-card-content class=\"inventory__card-content\">\n              <con-product-list [type]=\"type\" [showDiscontinued]=\"showDiscontinuedProducts\"></con-product-list>\n            </md-card-content>\n            <md-card-actions>\n              <button md-raised-button mdTooltip=\"Download\" (click)=\"exportInventoryData(type)\">\n                <md-icon>file_download</md-icon>\n              </button>\n              <button md-raised-button mdTooltip=\"Upload\" (click)=\"importInventoryData(type)\">\n                <md-icon>file_upload</md-icon>\n              </button>\n              <button md-raised-button (click)=\"createProduct(type)\" mdTooltip=\"New Product\">\n                <md-icon>add</md-icon>\n              </button>\n            </md-card-actions>\n          </md-card>\n          <md-card class=\"inventory__card inventory__card--small\">\n            <md-card-header>\n              <md-card-title>Prices</md-card-title>\n            </md-card-header>\n            <md-card-content class=\"inventory__card-content\">\n              <con-prices-list [type]=\"type\" [showDiscontinued]=\"showDiscontinuedProducts\"></con-prices-list>\n            </md-card-content>\n            <md-card-actions>\n              <button md-raised-button mdTooltip=\"Download\">\n                <md-icon>file_download</md-icon>\n              </button>\n              <button md-raised-button mdTooltip=\"Upload\">\n                <md-icon>file_upload</md-icon>\n              </button>\n              <button md-raised-button mdTooltip=\"Add\" (click)=\"addPriceRow(type.id)\">\n                <md-icon>add</md-icon>\n              </button>\n            </md-card-actions>\n          </md-card>\n        </div>\n      </md-tab>\n      <md-tab>\n        <ng-template md-tab-label>\n          <div class=\"inventory__tab-label\">\n            <md-icon>add</md-icon>\n          </div>\n        </ng-template>\n      </md-tab>\n    </md-tab-group>\n  </ng-container>\n  <ng-template #placeholder>\n    <div class=\"inventory__placeholder\">\n      <span class=\"inventory__spacer--top\"></span>\n      <p>\n        You haven't created any products yet!\n      </p>\n      <button md-fab class=\"inventory__placeholder-button\" (click)=\"createType(1)\">\n        <md-icon>add</md-icon>\n      </button>\n      <p>Get started!</p>\n      <md-slide-toggle [(ngModel)]=\"showDiscontinuedTypes\" class=\"inventory__spacer--right inventory__spacer--bottom\" labelPosition=\"before\">\n        Show discontinued\n      </md-slide-toggle>\n    </div>\n  </ng-template>\n</div>\n<con-help [helpFor]=\"inventory\">\n  <con-help-outline selector=\"con-product-list\"></con-help-outline>\n  <con-help-outline selector=\"button[mdTooltip='New Product']\"></con-help-outline>\n  <con-help-arrow start=\"button[mdTooltip='New Product']\" startSide=\"top\" end=\"con-product-list\" endSide=\"bottom\"></con-help-arrow>\n  <con-help-text text=\"Click this button to add another row to the table\" anchor=\"button[mdTooltip='New Product']\" position=\"right\"></con-help-text>\n</con-help>\n"

/***/ }),

/***/ "./src/app/inventory/inventory.component.scss":
/***/ (function(module, exports) {

module.exports = ".inventory {\n  height: 100%; }\n  .inventory__tab-label {\n    display: -ms-flexbox;\n    display: flex;\n    -ms-flex-align: center;\n        align-items: center;\n    -ms-flex-pack: center;\n        justify-content: center;\n    height: 100%; }\n    .inventory__tab-label--discontinued {\n      opacity: 0.5; }\n  .inventory__header {\n    display: -ms-flexbox;\n    display: flex;\n    min-height: 100px;\n    box-shadow: inset 0 -3px 3px -3px rgba(0, 0, 0, 0.5);\n    padding: 16px;\n    -ms-flex-wrap: wrap;\n        flex-wrap: wrap; }\n  .inventory__title {\n    display: inline-block;\n    font-size: 24px;\n    font-weight: bold;\n    -ms-flex-item-align: start;\n        align-self: flex-start; }\n  .inventory__spacer--fullwidth {\n    display: -ms-flexbox;\n    display: flex;\n    -ms-flex-preferred-size: 100%;\n        flex-basis: 100%; }\n  .inventory__spacer--right {\n    margin-left: auto; }\n  .inventory__spacer--top {\n    margin-bottom: auto; }\n  .inventory__spacer--bottom {\n    margin-top: auto; }\n  .inventory__card-grid {\n    display: -ms-flexbox;\n    display: flex;\n    -ms-flex-direction: row;\n        flex-direction: row;\n    -ms-flex-wrap: wrap;\n        flex-wrap: wrap;\n    width: 100%; }\n  .inventory__card {\n    -ms-flex-positive: 1;\n        flex-grow: 1;\n    margin: 16px;\n    display: -ms-flexbox;\n    display: flex;\n    -ms-flex-direction: column;\n        flex-direction: column; }\n    .inventory__card--small {\n      -ms-flex-positive: 0.4;\n          flex-grow: 0.4; }\n  .inventory__card-content {\n    -ms-flex-positive: 1;\n        flex-grow: 1; }\n  .inventory__placeholder {\n    display: -ms-flexbox;\n    display: flex;\n    -ms-flex-direction: column;\n        flex-direction: column;\n    -ms-flex-align: center;\n        align-items: center;\n    -ms-flex-pack: center;\n        justify-content: center;\n    box-sizing: border-box;\n    width: 100%;\n    height: 100%;\n    padding: 16px;\n    color: rgba(0, 0, 0, 0.54); }\n  .inventory__placeholder-button {\n    margin: 16px; }\n"

/***/ }),

/***/ "./src/app/inventory/inventory.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return InventoryComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__ = __webpack_require__("./node_modules/rxjs/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_fromEvent__ = __webpack_require__("./node_modules/rxjs/add/observable/fromEvent.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_fromEvent___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_add_observable_fromEvent__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__ = __webpack_require__("./node_modules/rxjs/add/operator/toPromise.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_operator_toPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__data_storage_service__ = __webpack_require__("./src/app/data/storage.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__inventory_component_html__ = __webpack_require__("./src/app/inventory/inventory.component.html");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__inventory_component_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__inventory_component_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__inventory_component_scss__ = __webpack_require__("./src/app/inventory/inventory.component.scss");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__inventory_component_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__inventory_component_scss__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};







let InventoryComponent = class InventoryComponent {
    constructor(storage) {
        this.storage = storage;
        this.tabIndex = 0;
        this.showDiscontinuedProducts = false;
        this._showDiscontinuedTypes = false;
        this.typeNameIsUnique = (name) => !this._types.getValue().filter(_ => _.name === name).length;
        this._products = storage.products;
        this._types = storage.types;
        this._prices = storage.prices;
        this._types.subscribe(() => this.restrictTabIndex());
    }
    get showDiscontinuedTypes() { return this._showDiscontinuedTypes; }
    set showDiscontinuedTypes(show) {
        const tab = this.__types.length ? this.__types[this.tabIndex].name : null;
        this._showDiscontinuedTypes = show;
        if (tab) {
            const found = this.__types.findIndex(_ => _.name === tab);
            if (found !== -1) {
                this.tabIndex = found;
                return;
            }
        }
        this.restrictTabIndex();
    }
    restrictTabIndex() {
        if (this.tabIndex === this.__types.length && this.tabIndex !== 0) {
            --this.tabIndex;
        }
    }
    get types() {
        return this._types.map(_ => _.filter(_ => this.showDiscontinuedTypes || !_.discontinued));
    }
    get __types() {
        return this._types.getValue().filter(_ => this.showDiscontinuedTypes || !_.discontinued);
    }
    trackID(type) {
        return type.id;
    }
    products(type) {
        return this._products.getValue().filter(_ => _.type === type);
    }
    tabChange(index) {
        const max = this.__types.length;
        if (index === max) {
            this.createType(index + 1);
        }
        this.tabIndex = index;
    }
    createType(index) {
        this.storage.createType(index);
    }
    addPriceRow(type, product = null) {
        this.storage.addPriceRow(type, product);
    }
    setTypeName(name, type) {
        this.storage.setTypeName(type, name);
    }
    setTypeDiscontinued(discontinued, type) {
        this.storage.setTypeDiscontinued(type, discontinued);
    }
    setTypeColor(type, color) {
        this.storage.setTypeColor(type, color);
    }
    createProduct(type) {
        this.storage.createProduct(type);
    }
    exportInventoryData(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const header = 'ID,Name,Quantity,Discontinued\n';
            const data = this.products(type.id).map(_ => `${_.id},${_.name},${_.quantity},${_.discontinued}\n`);
            saveAs(new Blob([header, ...data], { type: 'text/csv;charset=utf-8' }), `conartist-inventory-${type.name}.csv`, true);
        });
    }
    importInventoryData(type) {
        return __awaiter(this, void 0, void 0, function* () {
            const input = document.createElement('INPUT');
            input.setAttribute('type', 'file');
            input.click();
            yield __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].fromEvent(input, 'change').take(1).toPromise();
            if (input.files && input.files[0]) {
                const file = input.files[0];
                const fr = new FileReader();
                fr.readAsText(file);
                yield __WEBPACK_IMPORTED_MODULE_1_rxjs_Observable__["Observable"].fromEvent(fr, 'loadend').take(1).toPromise();
                const products = this.products(type.id);
                const values = fr.result
                    .split('\n')
                    .filter(_ => !!_)
                    .map(_ => _.split(',').map(_ => _.trim()));
                values.forEach(row => {
                    if (row.length < 4) {
                        row.unshift('New');
                    }
                    if (row.length < 4) {
                        row[3] = 'false';
                    }
                    const [id, name, quantity, discontinued] = row;
                    if (isNaN(parseInt(quantity, 10))) {
                        return;
                    }
                    const dc = ['y', 'true', 't'].includes(discontinued.toLowerCase());
                    const qty = parseInt(quantity, 10);
                    const product = (!isNaN(+id)
                        ? products.find(_ => _.id === +id)
                        : products.find(_ => _.name === name))
                        || this.storage.createProduct(type);
                    this.storage.setProductName(product.id, name);
                    this.storage.setProductQuantity(product.id, qty);
                    this.storage.setProductDiscontinued(product.id, dc);
                });
            }
        });
    }
};
InventoryComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'con-inventory',
        template: __WEBPACK_IMPORTED_MODULE_5__inventory_component_html___default.a,
        styles: [__WEBPACK_IMPORTED_MODULE_6__inventory_component_scss___default.a],
    }),
    __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Inject */])(__WEBPACK_IMPORTED_MODULE_4__data_storage_service__["a" /* StorageService */])),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_4__data_storage_service__["a" /* StorageService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__data_storage_service__["a" /* StorageService */]) === "function" && _a || Object])
], InventoryComponent);

var _a;
//# sourceMappingURL=inventory.component.js.map

/***/ }),

/***/ "./src/app/inventory/inventory.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return InventoryModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__("./node_modules/@angular/common/@angular/common.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__("./node_modules/@angular/forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__material_module__ = __webpack_require__("./src/app/material.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__data_data_module__ = __webpack_require__("./src/app/data/data.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__editable_editable_module__ = __webpack_require__("./src/app/editable/editable.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__color_picker_color_picker_module__ = __webpack_require__("./src/app/color-picker/color-picker.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__help_help_module__ = __webpack_require__("./src/app/help/help.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__inventory_component__ = __webpack_require__("./src/app/inventory/inventory.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__product_list_component__ = __webpack_require__("./src/app/inventory/product-list.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__prices_list_component__ = __webpack_require__("./src/app/inventory/prices-list.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};











let InventoryModule = class InventoryModule {
};
InventoryModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["M" /* NgModule */])({
        imports: [__WEBPACK_IMPORTED_MODULE_1__angular_common__["b" /* CommonModule */], __WEBPACK_IMPORTED_MODULE_2__angular_forms__["d" /* FormsModule */], __WEBPACK_IMPORTED_MODULE_3__material_module__["a" /* MaterialModule */], __WEBPACK_IMPORTED_MODULE_5__editable_editable_module__["a" /* EditableModule */], __WEBPACK_IMPORTED_MODULE_4__data_data_module__["a" /* DataModule */], __WEBPACK_IMPORTED_MODULE_6__color_picker_color_picker_module__["a" /* ColorPickerModule */], __WEBPACK_IMPORTED_MODULE_7__help_help_module__["a" /* HelpModule */]],
        declarations: [__WEBPACK_IMPORTED_MODULE_8__inventory_component__["a" /* InventoryComponent */], __WEBPACK_IMPORTED_MODULE_9__product_list_component__["a" /* ProductListComponent */], __WEBPACK_IMPORTED_MODULE_10__prices_list_component__["a" /* PricesListComponent */]],
        exports: [__WEBPACK_IMPORTED_MODULE_8__inventory_component__["a" /* InventoryComponent */]],
    })
], InventoryModule);

//# sourceMappingURL=inventory.module.js.map

/***/ }),

/***/ "./src/app/modals/choose-convention.component.html":
/***/ (function(module, exports) {

module.exports = "<h2 md-dialog-title>Choose a Convention</h2>\n<md-dialog-content>\n  <!-- TODO: make this a data table -->\n  <div *ngIf=\"conCount; else placeholder\">\n    <md-table [dataSource]=\"dataSource\">\n      <ng-container cdkColumnDef=\"name\">\n        <md-header-cell *cdkHeaderCellDef>Name</md-header-cell>\n        <md-cell *cdkCellDef=\"let con\">\n          {{ con.title }}\n        </md-cell>\n      </ng-container>\n\n      <ng-container cdkColumnDef=\"code\">\n        <md-header-cell *cdkHeaderCellDef>Code</md-header-cell>\n        <md-cell *cdkCellDef=\"let con\">\n          {{ con.code }}\n        </md-cell>\n      </ng-container>\n\n      <ng-container cdkColumnDef=\"start\">\n        <md-header-cell *cdkHeaderCellDef>Start</md-header-cell>\n        <md-cell *cdkCellDef=\"let con\">\n          {{ con.start | date }}\n        </md-cell>\n      </ng-container>\n\n      <ng-container cdkColumnDef=\"end\">\n        <md-header-cell *cdkHeaderCellDef>End</md-header-cell>\n        <md-cell *cdkCellDef=\"let con\">\n          {{ con.end | date }}\n        </md-cell>\n      </ng-container>\n\n      <ng-container cdkColumnDef=\"choose\">\n        <md-header-cell *cdkHeaderCellDef class=\"choose-convention__column--action\">Choose</md-header-cell>\n        <md-cell *cdkCellDef=\"let con\" class=\"choose-convention__column--action\">\n          <button md-icon-button [md-dialog-close]=\"con\">\n            <md-icon>check</md-icon>\n          </button>\n        </md-cell>\n      </ng-container>\n\n      <md-header-row *cdkHeaderRowDef=\"displayedColumns\"></md-header-row>\n      <md-row *cdkRowDef=\"let con; columns: displayedColumns\"></md-row>\n    </md-table>\n    <md-paginator\n      [pageIndex]=\"page\"\n      [length]=\"conCount\"\n      [pageSize]=\"pageSize\"\n      (page)=\"page = $event.pageIndex\">\n    </md-paginator>\n  </div>\n  <ng-template #placeholder>\n    <div class=\"choose-convention__placeholder\">\n      No conventions are currently available.\n    </div>\n  </ng-template>\n</md-dialog-content>\n<md-dialog-actions>\n  <button md-button md-dialog-close>Close</button>\n</md-dialog-actions>\n"

/***/ }),

/***/ "./src/app/modals/choose-convention.component.scss":
/***/ (function(module, exports) {

module.exports = ".choose-convention__column--action {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-positive: 0;\n      flex-grow: 0;\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n  -ms-flex-preferred-size: 80px;\n      flex-basis: 80px;\n  -ms-flex-pack: center;\n      justify-content: center; }\n\n.choose-convention__placeholder {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-align: center;\n      align-items: center;\n  -ms-flex-pack: center;\n      justify-content: center;\n  padding: 16px;\n  color: rgba(0, 0, 0, 0.54); }\n"

/***/ }),

/***/ "./src/app/modals/choose-convention.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ChooseConventionComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_BehaviorSubject__ = __webpack_require__("./node_modules/rxjs/BehaviorSubject.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs_BehaviorSubject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs_BehaviorSubject__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__choose_convention_component_html__ = __webpack_require__("./src/app/modals/choose-convention.component.html");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__choose_convention_component_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__choose_convention_component_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__choose_convention_component_scss__ = __webpack_require__("./src/app/modals/choose-convention.component.scss");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__choose_convention_component_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__choose_convention_component_scss__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__api_api_service__ = __webpack_require__("./src/app/api/api.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__data_data_source__ = __webpack_require__("./src/app/data/data-source.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};






let ChooseConventionComponent = class ChooseConventionComponent {
    constructor(api) {
        this.api = api;
        this.pageSize = 5;
        this._conventions = new __WEBPACK_IMPORTED_MODULE_1_rxjs_BehaviorSubject__["BehaviorSubject"]([]);
        this.displayedColumns = ['name', 'code', 'start', 'end', 'choose'];
        this.conCount = 0;
        this.dataSource = new __WEBPACK_IMPORTED_MODULE_5__data_data_source__["a" /* ConDataSource */](this._conventions, null, null, { size: this.pageSize, index: 0 });
        this.api.getConventions().subscribe(_ => {
            this.conCount = _.length;
            this._conventions.next(_);
        });
    }
    get page() {
        return this.dataSource.page ? this.dataSource.page.index : 0;
    }
    set page(index) {
        this.dataSource.page = { size: this.pageSize, index };
    }
};
ChooseConventionComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'con-choose-convention',
        template: __WEBPACK_IMPORTED_MODULE_2__choose_convention_component_html___default.a,
        styles: [__WEBPACK_IMPORTED_MODULE_3__choose_convention_component_scss___default.a],
    }),
    __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Inject */])(__WEBPACK_IMPORTED_MODULE_4__api_api_service__["a" /* APIService */])),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_4__api_api_service__["a" /* APIService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_4__api_api_service__["a" /* APIService */]) === "function" && _a || Object])
], ChooseConventionComponent);

var _a;
//# sourceMappingURL=choose-convention.component.js.map

/***/ }),

/***/ "./src/app/modals/choose-convention.service.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ChooseConventionService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_material__ = __webpack_require__("./node_modules/@angular/material/@angular/material.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__choose_convention_component__ = __webpack_require__("./src/app/modals/choose-convention.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};



let ChooseConventionService = class ChooseConventionService {
    constructor(dialog) {
        this.dialog = dialog;
    }
    open() {
        return this.dialog.open(__WEBPACK_IMPORTED_MODULE_2__choose_convention_component__["a" /* ChooseConventionComponent */], { width: '800px' }).afterClosed();
    }
};
ChooseConventionService = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["C" /* Injectable */])(),
    __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Inject */])(__WEBPACK_IMPORTED_MODULE_1__angular_material__["e" /* MdDialog */])),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_material__["e" /* MdDialog */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_material__["e" /* MdDialog */]) === "function" && _a || Object])
], ChooseConventionService);

var _a;
//# sourceMappingURL=choose-convention.service.js.map

/***/ }),

/***/ "./src/app/modals/modals.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ModalsModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__("./node_modules/@angular/common/@angular/common.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__choose_convention_component__ = __webpack_require__("./src/app/modals/choose-convention.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__choose_convention_service__ = __webpack_require__("./src/app/modals/choose-convention.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__error_component__ = __webpack_require__("./src/app/modals/error.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__error_service__ = __webpack_require__("./src/app/modals/error.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__material_module__ = __webpack_require__("./src/app/material.module.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};







let ModalsModule = class ModalsModule {
};
ModalsModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["M" /* NgModule */])({
        imports: [__WEBPACK_IMPORTED_MODULE_1__angular_common__["b" /* CommonModule */], __WEBPACK_IMPORTED_MODULE_6__material_module__["a" /* MaterialModule */]],
        declarations: [__WEBPACK_IMPORTED_MODULE_2__choose_convention_component__["a" /* ChooseConventionComponent */], __WEBPACK_IMPORTED_MODULE_4__error_component__["a" /* ErrorComponent */]],
        entryComponents: [__WEBPACK_IMPORTED_MODULE_2__choose_convention_component__["a" /* ChooseConventionComponent */], __WEBPACK_IMPORTED_MODULE_4__error_component__["a" /* ErrorComponent */]],
        providers: [__WEBPACK_IMPORTED_MODULE_3__choose_convention_service__["a" /* ChooseConventionService */], __WEBPACK_IMPORTED_MODULE_5__error_service__["a" /* ErrorService */]],
    })
], ModalsModule);

//# sourceMappingURL=modals.module.js.map

/***/ }),

/***/ "./src/app/prices/prices.component.html":
/***/ (function(module, exports) {

module.exports = "<md-table [dataSource]=\"dataSource\" mdSort>\n  <ng-container cdkColumnDef=\"type\">\n    <md-header-cell *cdkHeaderCellDef md-sort-header>Type</md-header-cell>\n    <md-cell *cdkCellDef=\"let row\">{{ row.type | type:'name' }}</md-cell>\n  </ng-container>\n\n  <ng-container cdkColumnDef=\"product\">\n    <md-header-cell *cdkHeaderCellDef md-sort-header>Product</md-header-cell>\n    <md-cell *cdkCellDef=\"let row\">{{ row.product | product:'name' }}</md-cell>\n  </ng-container>\n\n  <ng-container cdkColumnDef=\"quantity\">\n    <md-header-cell *cdkHeaderCellDef>Quantity</md-header-cell>\n    <md-cell *cdkCellDef=\"let row\">\n      <con-editable [content]=\"row.quantity\" (contentChange)=\"setQuantity($event, row.type, row.product, row.index)\" [validator]=\"quantityIsNatural\"></con-editable>\n    </md-cell>\n  </ng-container>\n\n  <ng-container cdkColumnDef=\"price\">\n    <md-header-cell *cdkHeaderCellDef>Price</md-header-cell>\n    <md-cell *cdkCellDef=\"let row\">\n      <con-editable [content]=\"row.price | currency:'USD':true\" (contentChange)=\"setPrice($event, row.type, row.product, row.index)\" [validator]=\"priceIsPositive\"></con-editable>\n    </md-cell>\n  </ng-container>\n\n  <ng-container cdkColumnDef=\"delete\">\n    <md-header-cell *cdkHeaderCellDef class=\"prices__column--action\">Delete</md-header-cell>\n    <md-cell *cdkCellDef=\"let row\" class=\"prices__column--action\">\n      <button md-icon-button (click)=\"removeRow(row.type, row.product, row.index)\">\n        <md-icon>remove_circle_outline</md-icon>\n      </button>\n    </md-cell>\n  </ng-container>\n\n  <md-header-row *cdkHeaderRowDef=\"displayedColumns\"></md-header-row>\n  <md-row *cdkRowDef=\"let row; columns: displayedColumns\"></md-row>\n</md-table>\n<div class=\"prices__actions\">\n  <button md-raised-button mdTooltip=\"Download\" (click)=\"exportPricesData()\">\n    <md-icon>file_download</md-icon>\n  </button>\n  <button md-raised-button mdTooltip=\"Upload\" (click)=\"importPricesData()\">\n    <md-icon>file_upload</md-icon>\n  </button>\n  <button md-raised-button (click)=\"addRow()\" mdTooltip=\"Add Row\">\n    <md-icon>add</md-icon>\n  </button>\n</div>\n"

/***/ }),

/***/ "./src/app/prices/prices.component.scss":
/***/ (function(module, exports) {

module.exports = ".prices__column--action {\n  display: -ms-flexbox;\n  display: flex;\n  -ms-flex-positive: 0;\n      flex-grow: 0;\n  -ms-flex-negative: 0;\n      flex-shrink: 0;\n  -ms-flex-preferred-size: 80px;\n      flex-basis: 80px;\n  -ms-flex-pack: center;\n      justify-content: center; }\n\n.prices__actions {\n  box-sizing: border-box;\n  padding: 6px;\n  background-color: white;\n  border-bottom: 1px solid rgba(0, 0, 0, 0.12); }\n"

/***/ }),

/***/ "./src/app/prices/prices.component.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PricesComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_material__ = __webpack_require__("./node_modules/@angular/material/@angular/material.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__ = __webpack_require__("./node_modules/rxjs/Observable.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_fromEvent__ = __webpack_require__("./node_modules/rxjs/add/observable/fromEvent.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_fromEvent___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_add_observable_fromEvent__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_toPromise__ = __webpack_require__("./node_modules/rxjs/add/operator/toPromise.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_toPromise___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_add_operator_toPromise__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__data_product_pipe__ = __webpack_require__("./src/app/data/product.pipe.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__data_type_pipe__ = __webpack_require__("./src/app/data/type.pipe.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__data_data_source__ = __webpack_require__("./src/app/data/data-source.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__data_storage_service__ = __webpack_require__("./src/app/data/storage.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__prices_component_html__ = __webpack_require__("./src/app/prices/prices.component.html");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__prices_component_html___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9__prices_component_html__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__prices_component_scss__ = __webpack_require__("./src/app/prices/prices.component.scss");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__prices_component_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10__prices_component_scss__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};











let PricesComponent = class PricesComponent {
    constructor(storage, product, type) {
        this.storage = storage;
        this.product = product;
        this.type = type;
        this.displayedColumns = ['type', 'product', 'quantity', 'price', 'delete'];
        this._prices = this.storage.prices;
        this.dataSource = new __WEBPACK_IMPORTED_MODULE_7__data_data_source__["a" /* ConDataSource */](this._prices.map(_ => [].concat(..._.map(({ product, type, prices }) => prices.map(([quantity, price], index) => ({ index, product, type, quantity, price }))))));
        this.quantityIsNatural = (quantity) => !isNaN(parseInt(quantity, 10)) && parseInt(quantity, 10) > 0 && parseInt(quantity, 10) === parseFloat(quantity);
        this.priceIsPositive = (price) => !isNaN(parseFloat(price.replace(/^\$/, ''))) && parseFloat(price.replace(/^\$/, '')) >= 0;
    }
    ngOnInit() {
        setTimeout(() => {
            this.dataSource.filter = row => {
                const productDiscontinued = row.product ? this.product.transform(row.product).discontinued : false;
                const typeDiscontinued = this.type.transform(row.type).discontinued;
                return !(productDiscontinued || typeDiscontinued);
            };
        });
        this.sort.mdSortChange.subscribe((sort) => {
            let fn = null;
            if (sort.direction && sort.active) {
                const dir = sort.direction === 'asc' ? -1 : 1;
                switch (sort.active) {
                    case 'type':
                        fn = (a, b) => (this.type.transform(a.type).name < this.type.transform(b.type).name ? 1 : -1) * dir;
                        break;
                    case 'product':
                        fn = (a, b) => (((a.product ? this.product.transform(a.product).name : 0) <
                            (b.product ? this.product.transform(b.product).name : 0)) ? 1 : -1) * dir;
                        break;
                    case 'price':
                        fn = (a, b) => (a.price - b.price) * dir;
                        break;
                    case 'quantity':
                        fn = (a, b) => (a.quantity - b.quantity) * dir;
                        break;
                }
            }
            this.dataSource.sort = fn;
        });
    }
    exportPricesData() {
        const header = 'Type,Product,Quantity,Price\n';
        const data = [].concat(...this._prices.getValue()
            .map(({ product, type, prices }) => prices.map(([quantity, price], index) => ({ index, product, type, quantity, price }))))
            .map(_ => `${this.type.transform(_.type).name},${_.product ? this.product.transform(_.product).name : 'None'},${_.quantity},${_.price}\n`);
        saveAs(new Blob([header, ...data], { type: 'text/csv;charset=utf-8' }), 'conartist-prices.csv', true);
    }
    importPricesData() {
        return __awaiter(this, void 0, void 0, function* () {
            const input = document.createElement('INPUT');
            input.setAttribute('type', 'file');
            input.click();
            yield __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].fromEvent(input, 'change').take(1).toPromise();
            if (input.files && input.files[0]) {
                const file = input.files[0];
                const fr = new FileReader();
                fr.readAsText(file);
                yield __WEBPACK_IMPORTED_MODULE_2_rxjs_Observable__["Observable"].fromEvent(fr, 'loadend').take(1).toPromise();
                const values = fr.result
                    .split('\n')
                    .filter(_ => !!_)
                    .map(_ => _.split(',').map(_ => _.trim()));
                const set = values
                    .reduce(([...set], [type, product, quantity, price]) => {
                    if (isNaN(parseInt(quantity, 10))) {
                        return set;
                    }
                    if (isNaN(parseFloat(price.replace(/^\$/, '')))) {
                        return set;
                    }
                    const qty = +quantity;
                    const prc = parseFloat(price.replace(/^\$/, ''));
                    const prd = (product === 'None' ? null : this.product.reverse(product).id);
                    const typ = this.type.reverse(type).id;
                    const i = set.findIndex(_ => _.type === typ && _.product === prd);
                    if (i === -1) {
                        set.push({ type: typ, product: prd, prices: [[qty, prc]] });
                    }
                    else {
                        set[i] = Object.assign({}, set[i], { prices: [...set[i].prices, [qty, prc]] });
                    }
                    return set;
                }, []);
                set.forEach(price => this.storage.setPriceList(price.type, price.product, price.prices));
            }
        });
    }
    addRow() {
    }
    setQuantity(quantity, type, product, index) {
        this.storage.setPriceQuantity(type, product, index, parseInt(quantity, 10));
    }
    setPrice(price, type, product, index) {
        this.storage.setPricePrice(type, product, index, parseFloat(price.replace(/^\$/, '')));
    }
    removeRow(type, product, index) {
        this.storage.removePriceRow(type, product, index);
    }
};
__decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_16" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1__angular_material__["r" /* MdSort */]),
    __metadata("design:type", typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_material__["r" /* MdSort */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_material__["r" /* MdSort */]) === "function" && _a || Object)
], PricesComponent.prototype, "sort", void 0);
PricesComponent = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["o" /* Component */])({
        selector: 'con-pricing',
        template: __WEBPACK_IMPORTED_MODULE_9__prices_component_html___default.a,
        styles: [__WEBPACK_IMPORTED_MODULE_10__prices_component_scss___default.a],
    }),
    __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Inject */])(__WEBPACK_IMPORTED_MODULE_8__data_storage_service__["a" /* StorageService */])),
    __param(1, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Inject */])(__WEBPACK_IMPORTED_MODULE_5__data_product_pipe__["a" /* ProductPipe */])),
    __param(2, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Inject */])(__WEBPACK_IMPORTED_MODULE_6__data_type_pipe__["a" /* TypePipe */])),
    __metadata("design:paramtypes", [typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_8__data_storage_service__["a" /* StorageService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_8__data_storage_service__["a" /* StorageService */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_5__data_product_pipe__["a" /* ProductPipe */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__data_product_pipe__["a" /* ProductPipe */]) === "function" && _c || Object, typeof (_d = typeof __WEBPACK_IMPORTED_MODULE_6__data_type_pipe__["a" /* TypePipe */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_6__data_type_pipe__["a" /* TypePipe */]) === "function" && _d || Object])
], PricesComponent);

var _a, _b, _c, _d;
//# sourceMappingURL=prices.component.js.map

/***/ }),

/***/ "./src/app/prices/prices.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return PricesModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__("./node_modules/@angular/common/@angular/common.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__("./node_modules/@angular/forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__material_module__ = __webpack_require__("./src/app/material.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__data_data_module__ = __webpack_require__("./src/app/data/data.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__editable_editable_module__ = __webpack_require__("./src/app/editable/editable.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__color_picker_color_picker_module__ = __webpack_require__("./src/app/color-picker/color-picker.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__help_help_module__ = __webpack_require__("./src/app/help/help.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__prices_component__ = __webpack_require__("./src/app/prices/prices.component.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};









let PricesModule = class PricesModule {
};
PricesModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["M" /* NgModule */])({
        imports: [__WEBPACK_IMPORTED_MODULE_1__angular_common__["b" /* CommonModule */], __WEBPACK_IMPORTED_MODULE_2__angular_forms__["d" /* FormsModule */], __WEBPACK_IMPORTED_MODULE_3__material_module__["a" /* MaterialModule */], __WEBPACK_IMPORTED_MODULE_5__editable_editable_module__["a" /* EditableModule */], __WEBPACK_IMPORTED_MODULE_4__data_data_module__["a" /* DataModule */], __WEBPACK_IMPORTED_MODULE_6__color_picker_color_picker_module__["a" /* ColorPickerModule */], __WEBPACK_IMPORTED_MODULE_7__help_help_module__["a" /* HelpModule */]],
        declarations: [__WEBPACK_IMPORTED_MODULE_8__prices_component__["a" /* PricesComponent */]],
        exports: [__WEBPACK_IMPORTED_MODULE_8__prices_component__["a" /* PricesComponent */]],
    })
], PricesModule);

//# sourceMappingURL=prices.module.js.map

/***/ }),

/***/ "./src/app/routing/auth-guard.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthGuard; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("./node_modules/@angular/router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jwt_decode__ = __webpack_require__("./node_modules/jwt-decode/lib/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jwt_decode___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_jwt_decode__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__broadcast_broadcast_service__ = __webpack_require__("./src/app/broadcast/broadcast.service.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__broadcast_event__ = __webpack_require__("./src/app/broadcast/event.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__api_api_service__ = __webpack_require__("./src/app/api/api.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};






let AuthGuard = class AuthGuard {
    constructor(api, router, broadcast) {
        this.api = api;
        this.router = router;
        this.broadcast = broadcast;
        this.authorized = false;
    }
    canActivate() {
        return __awaiter(this, void 0, void 0, function* () {
            const token = localStorage.getItem('authtoken');
            try {
                if (!token) {
                    throw new Error('No auth token');
                }
                const { exp } = __WEBPACK_IMPORTED_MODULE_2_jwt_decode__(token);
                if (new Date(exp * 1000) < new Date()) {
                    return false;
                }
                if (!this.authorized) {
                    const newToken = yield this.api.reauthorize().toPromise();
                    localStorage.setItem('authtoken', newToken);
                    this.broadcast.emit(new __WEBPACK_IMPORTED_MODULE_4__broadcast_event__["a" /* SignInEvent */]);
                }
                return this.authorized = true;
            }
            catch (_) {
                localStorage.removeItem('authtoken');
                this.router.navigate(['sign-in']);
                return this.authorized = false;
            }
        });
    }
};
AuthGuard = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["C" /* Injectable */])(),
    __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Inject */])(__WEBPACK_IMPORTED_MODULE_5__api_api_service__["a" /* APIService */])),
    __param(1, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Inject */])(__WEBPACK_IMPORTED_MODULE_1__angular_router__["h" /* Router */])),
    __param(2, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Inject */])(__WEBPACK_IMPORTED_MODULE_3__broadcast_broadcast_service__["a" /* BroadcastService */])),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_5__api_api_service__["a" /* APIService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_5__api_api_service__["a" /* APIService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["h" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["h" /* Router */]) === "function" && _b || Object, typeof (_c = typeof __WEBPACK_IMPORTED_MODULE_3__broadcast_broadcast_service__["a" /* BroadcastService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_3__broadcast_broadcast_service__["a" /* BroadcastService */]) === "function" && _c || Object])
], AuthGuard);

var _a, _b, _c;
//# sourceMappingURL=auth-guard.js.map

/***/ }),

/***/ "./src/app/routing/convention-resolver.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ConventionResolver; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("./node_modules/@angular/router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__data_storage_service__ = __webpack_require__("./src/app/data/storage.service.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};



let ConventionResolver = class ConventionResolver {
    constructor(storage, router) {
        this.storage = storage;
        this.router = router;
    }
    resolve(route) {
        const code = route.paramMap.get('code');
        return this.storage.fillConvention(code).then(con => {
            if (con) {
                return con;
            }
            else {
                this.router.navigate(['/conventions']);
                return null;
            }
        });
    }
};
ConventionResolver = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["C" /* Injectable */])(),
    __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Inject */])(__WEBPACK_IMPORTED_MODULE_2__data_storage_service__["a" /* StorageService */])),
    __param(1, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Inject */])(__WEBPACK_IMPORTED_MODULE_1__angular_router__["h" /* Router */])),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_2__data_storage_service__["a" /* StorageService */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_2__data_storage_service__["a" /* StorageService */]) === "function" && _a || Object, typeof (_b = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["h" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["h" /* Router */]) === "function" && _b || Object])
], ConventionResolver);

var _a, _b;
//# sourceMappingURL=convention-resolver.js.map

/***/ }),

/***/ "./src/app/routing/routing.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return RoutingModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("./node_modules/@angular/router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__broadcast_broadcast_module__ = __webpack_require__("./src/app/broadcast/broadcast.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__sign_in_sign_in_component__ = __webpack_require__("./src/app/sign-in/sign-in.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__dashboard_dashboard_component__ = __webpack_require__("./src/app/dashboard/dashboard.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__inventory_inventory_component__ = __webpack_require__("./src/app/inventory/inventory.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__prices_prices_component__ = __webpack_require__("./src/app/prices/prices.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__conventions_conventions_component__ = __webpack_require__("./src/app/conventions/conventions.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__conventions_con_info_component__ = __webpack_require__("./src/app/conventions/con-info.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__conventions_con_list_component__ = __webpack_require__("./src/app/conventions/con-list.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__convention_resolver__ = __webpack_require__("./src/app/routing/convention-resolver.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__auth_guard__ = __webpack_require__("./src/app/routing/auth-guard.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__unauth_guard__ = __webpack_require__("./src/app/routing/unauth-guard.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};













let RoutingModule = RoutingModule_1 = class RoutingModule {
};
RoutingModule.routes = [
    { path: 'dashboard', component: __WEBPACK_IMPORTED_MODULE_4__dashboard_dashboard_component__["a" /* DashboardComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_11__auth_guard__["a" /* AuthGuard */]] },
    { path: 'inventory', component: __WEBPACK_IMPORTED_MODULE_5__inventory_inventory_component__["a" /* InventoryComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_11__auth_guard__["a" /* AuthGuard */]] },
    { path: 'prices', component: __WEBPACK_IMPORTED_MODULE_6__prices_prices_component__["a" /* PricesComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_11__auth_guard__["a" /* AuthGuard */]] },
    { path: 'conventions', component: __WEBPACK_IMPORTED_MODULE_7__conventions_conventions_component__["a" /* ConventionsComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_11__auth_guard__["a" /* AuthGuard */]], children: [
            { path: ':code', component: __WEBPACK_IMPORTED_MODULE_8__conventions_con_info_component__["a" /* ConInfoComponent */], resolve: { convention: __WEBPACK_IMPORTED_MODULE_10__convention_resolver__["a" /* ConventionResolver */] } },
            { path: '', component: __WEBPACK_IMPORTED_MODULE_9__conventions_con_list_component__["a" /* ConListComponent */] },
        ] },
    { path: 'sign-in', component: __WEBPACK_IMPORTED_MODULE_3__sign_in_sign_in_component__["a" /* SignInComponent */], canActivate: [__WEBPACK_IMPORTED_MODULE_12__unauth_guard__["a" /* UnauthGuard */]] },
    { path: '', redirectTo: '/sign-in', pathMatch: 'full', canActivate: [__WEBPACK_IMPORTED_MODULE_12__unauth_guard__["a" /* UnauthGuard */]] },
    { path: '**', redirectTo: '/sign-in', canActivate: [__WEBPACK_IMPORTED_MODULE_12__unauth_guard__["a" /* UnauthGuard */]] },
];
RoutingModule = RoutingModule_1 = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["M" /* NgModule */])({
        imports: [__WEBPACK_IMPORTED_MODULE_2__broadcast_broadcast_module__["a" /* BroadcastModule */], __WEBPACK_IMPORTED_MODULE_1__angular_router__["i" /* RouterModule */].forRoot(RoutingModule_1.routes)],
        exports: [__WEBPACK_IMPORTED_MODULE_1__angular_router__["i" /* RouterModule */]],
        providers: [__WEBPACK_IMPORTED_MODULE_11__auth_guard__["a" /* AuthGuard */], __WEBPACK_IMPORTED_MODULE_12__unauth_guard__["a" /* UnauthGuard */], __WEBPACK_IMPORTED_MODULE_10__convention_resolver__["a" /* ConventionResolver */]]
    })
], RoutingModule);

var RoutingModule_1;
//# sourceMappingURL=routing.module.js.map

/***/ }),

/***/ "./src/app/routing/unauth-guard.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UnauthGuard; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_router__ = __webpack_require__("./node_modules/@angular/router/@angular/router.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jwt_decode__ = __webpack_require__("./node_modules/jwt-decode/lib/index.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_jwt_decode___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_jwt_decode__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};



let UnauthGuard = class UnauthGuard {
    constructor(router) {
        this.router = router;
    }
    canActivate() {
        return __awaiter(this, void 0, void 0, function* () {
            const token = localStorage.getItem('authtoken');
            if (!token) {
                return true;
            }
            try {
                const { exp } = __WEBPACK_IMPORTED_MODULE_2_jwt_decode__(token);
                if (new Date(exp * 1000) < new Date()) {
                    return false;
                }
                this.router.navigate(['dashboard']);
                return false;
            }
            catch (_) {
                localStorage.removeItem('authtoken');
                return true;
            }
        });
    }
};
UnauthGuard = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["C" /* Injectable */])(),
    __param(0, Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["B" /* Inject */])(__WEBPACK_IMPORTED_MODULE_1__angular_router__["h" /* Router */])),
    __metadata("design:paramtypes", [typeof (_a = typeof __WEBPACK_IMPORTED_MODULE_1__angular_router__["h" /* Router */] !== "undefined" && __WEBPACK_IMPORTED_MODULE_1__angular_router__["h" /* Router */]) === "function" && _a || Object])
], UnauthGuard);

var _a;
//# sourceMappingURL=unauth-guard.js.map

/***/ }),

/***/ "./src/app/sign-in/sign-in.module.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return SignInModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_common__ = __webpack_require__("./node_modules/@angular/common/@angular/common.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_forms__ = __webpack_require__("./node_modules/@angular/forms/@angular/forms.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__broadcast_broadcast_module__ = __webpack_require__("./src/app/broadcast/broadcast.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__sign_in_component__ = __webpack_require__("./src/app/sign-in/sign-in.component.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__material_module__ = __webpack_require__("./src/app/material.module.ts");
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};






let SignInModule = class SignInModule {
};
SignInModule = __decorate([
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["M" /* NgModule */])({
        imports: [__WEBPACK_IMPORTED_MODULE_5__material_module__["a" /* MaterialModule */], __WEBPACK_IMPORTED_MODULE_1__angular_common__["b" /* CommonModule */], __WEBPACK_IMPORTED_MODULE_2__angular_forms__["i" /* ReactiveFormsModule */], __WEBPACK_IMPORTED_MODULE_3__broadcast_broadcast_module__["a" /* BroadcastModule */]],
        declarations: [__WEBPACK_IMPORTED_MODULE_4__sign_in_component__["a" /* SignInComponent */]],
        exports: [__WEBPACK_IMPORTED_MODULE_4__sign_in_component__["a" /* SignInComponent */]],
    })
], SignInModule);

//# sourceMappingURL=sign-in.module.js.map

/***/ }),

/***/ "./src/environments/environment.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const environment = {
    production: false
};
/* harmony export (immutable) */ __webpack_exports__["a"] = environment;

//# sourceMappingURL=environment.js.map

/***/ }),

/***/ "./src/main.scss":
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__("./node_modules/css-loader/index.js!./node_modules/postcss-loader/index.js!./node_modules/sass-loader/lib/loader.js!./src/main.scss");
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__("./node_modules/style-loader/addStyles.js")(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/sass-loader/lib/loader.js!./main.scss", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/postcss-loader/index.js!../node_modules/sass-loader/lib/loader.js!./main.scss");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ "./src/main.ts":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__("./node_modules/@angular/core/@angular/core.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__ = __webpack_require__("./node_modules/@angular/platform-browser-dynamic/@angular/platform-browser-dynamic.es5.js");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__app_app_module__ = __webpack_require__("./src/app/app.module.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__environments_environment__ = __webpack_require__("./src/environments/environment.ts");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__main_scss__ = __webpack_require__("./src/main.scss");
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__main_scss___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__main_scss__);





if (__WEBPACK_IMPORTED_MODULE_3__environments_environment__["a" /* environment */].production) {
    Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_23" /* enableProdMode */])();
}
Object(__WEBPACK_IMPORTED_MODULE_1__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_2__app_app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ })

},["./src/main.ts"]);
//# sourceMappingURL=app.js.map
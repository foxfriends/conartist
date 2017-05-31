'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const material_ui_1 = require("material-ui");
const settings_1 = require("material-ui/svg-icons/action/settings");
const close_1 = require("material-ui/svg-icons/navigation/close");
const bar_chart_1 = require("../../../chart/bar-chart");
const colors_1 = require("material-ui/styles/colors");
const JSZip = require("jszip");
const file_saver_1 = require("file-saver");
const types_1 = require("../../../types");
const sidenav_1 = require("../../../sidenav");
function colors(low, mid, quantity) {
    if (quantity <= low) {
        return colors_1.red400;
    }
    else if (quantity <= mid) {
        return colors_1.amber400;
    }
    else {
        return colors_1.green400;
    }
}
class InventoryChart extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            type: null,
            settings: false,
            low: 5,
            mid: 10,
        };
    }
    componentWillReceiveProps(props) {
        if (this.state.type === null) {
            this.setState({ type: Object.keys(props.products)[0] });
        }
    }
    get bars() {
        return this.state.type ? this.barsForType(this.state.type) : {};
    }
    barsForType(type) {
        return this.props.products[type].reduce((_, [name, qty]) => (Object.assign({}, _, { [name]: qty })), {});
    }
    typeChange(_, __, type) {
        this.setState({ type });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const zip = new JSZip();
            Object.keys(this.props.products).map((type) => {
                const products = this.props.products[type];
                return [`${type}.csv`, products.map(_ => _.join(',')).join('\n')];
            }).forEach(([name, content]) => zip.file(name, content));
            file_saver_1.saveAs(yield zip.generateAsync({ type: 'blob' }), 'inventory.zip');
        });
    }
    lowChange(_, low) {
        this.setState({ low: +low });
    }
    midChange(_, mid) {
        this.setState({ mid: +mid });
    }
    render() {
        return (React.createElement("div", { style: { position: 'relative' } },
            React.createElement(material_ui_1.IconButton, { style: { position: 'absolute', top: 0, right: 10 }, onTouchTap: () => this.setState({ settings: true }) },
                React.createElement(settings_1.default, null)),
            React.createElement(bar_chart_1.default, { yLabel: 'Quantity', bars: this.bars, colors: colors.bind(null, this.state.low, this.state.mid) }),
            React.createElement(sidenav_1.default, { open: this.state.settings, openSecondary: true, width: 400, onBackdropClick: () => this.setState({ settings: false }) },
                React.createElement(material_ui_1.AppBar, { title: 'Inventory Settings', iconElementLeft: React.createElement(material_ui_1.IconButton, null,
                        React.createElement(close_1.default, null)), onLeftIconButtonTouchTap: () => this.setState({ settings: false }) }),
                React.createElement("div", { style: { padding: 16 } },
                    React.createElement(material_ui_1.SelectField, { floatingLabelText: 'Product Type', value: this.state.type, onChange: (event, index, value) => this.typeChange(event, index, value) }, Object.keys(this.props.products).map((type, i) => React.createElement(material_ui_1.MenuItem, { key: i, value: type, primaryText: types_1.ProductTypes[type] }))),
                    React.createElement("div", null,
                        React.createElement(material_ui_1.TextField, { floatingLabelText: 'Low threshold', value: this.state.low, onChange: (event, text) => this.lowChange(event, text), type: 'number' })),
                    React.createElement("div", null,
                        React.createElement(material_ui_1.TextField, { floatingLabelText: 'High threshold', value: this.state.mid, onChange: (event, text) => this.midChange(event, text), type: 'number' }))),
                React.createElement("div", { style: { padding: 16 } },
                    React.createElement(material_ui_1.RaisedButton, { label: 'Export All', primary: true, onTouchTap: () => this.save() })))));
    }
}
exports.default = InventoryChart;

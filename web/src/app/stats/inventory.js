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
const colors_1 = require("material-ui/styles/colors");
const settings_1 = require("material-ui/svg-icons/action/settings");
const close_1 = require("material-ui/svg-icons/navigation/close");
const JSZip = require("jszip");
const file_saver_1 = require("file-saver");
const stacked_bar_chart_1 = require("../../chart/stacked-bar-chart");
const types_1 = require("../../types");
class Inventory extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            type: null,
            settings: false,
        };
    }
    get bars() {
        return this.state.type ? this.barsForType(this.state.type) : {};
    }
    get legend() {
        return {
            remaining: { name: 'Remaining', color: colors_1.green300 },
            sold: { name: 'Sold', color: colors_1.red300 },
        };
    }
    componentWillReceiveProps(props) {
        if (this.state.type === null) {
            this.setState({ type: Object.keys(props.products)[0] });
        }
    }
    barsForType(type) {
        const bars = {};
        (this.props.products[type] || []).forEach(([name, quantity]) => {
            bars[name] = { remaining: quantity, sold: 0 };
        });
        this.props.records
            .filter(({ type: _ }) => _ === type)
            .forEach(({ products }) => products.forEach(product => (++bars[product].sold, bars[product].remaining && --bars[product].remaining)));
        return bars;
    }
    typeChange(_, __, type) {
        this.setState({ type });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const zip = new JSZip();
            Object.keys(this.props.products).map((type) => {
                const bars = this.barsForType(type);
                const products = Object.keys(bars).map(name => [name, this.props.products[type].find(([_]) => name === _)[1], bars[name].remaining, bars[name].sold]);
                return [`${type}.csv`, 'Name,Initial,Final,Sold\n' + products.map(_ => _.join(',')).join('\n')];
            }).forEach(([name, content]) => zip.file(name, content));
            file_saver_1.saveAs(yield zip.generateAsync({ type: 'blob' }), 'inventory.zip');
        });
    }
    render() {
        return (React.createElement("div", { style: { position: 'relative' } },
            React.createElement(material_ui_1.Subheader, { style: { fontSize: '16px', fontFamily: 'Roboto,sans-serif' } }, "Inventory"),
            React.createElement(material_ui_1.IconButton, { style: { position: 'absolute', top: 0, right: 10 }, onTouchTap: () => this.setState({ settings: true }) },
                React.createElement(settings_1.default, null)),
            React.createElement(stacked_bar_chart_1.default, { yLabel: 'Quantity', bars: this.bars, legend: this.legend }),
            React.createElement(material_ui_1.Drawer, { open: this.state.settings, openSecondary: true, width: '100%', style: { display: 'flex' } },
                React.createElement(material_ui_1.AppBar, { title: 'Inventory Settings', iconElementLeft: React.createElement(material_ui_1.IconButton, null,
                        React.createElement(close_1.default, null)), onLeftIconButtonTouchTap: () => this.setState({ settings: false }) }),
                React.createElement("div", { style: { padding: 16 } },
                    React.createElement(material_ui_1.SelectField, { floatingLabelText: 'Product Type', value: this.state.type, onChange: (event, index, value) => this.typeChange(event, index, value) }, Object.keys(this.props.products).map((type, i) => React.createElement(material_ui_1.MenuItem, { key: i, value: type, primaryText: types_1.ProductTypes[type] })))),
                React.createElement("div", { style: { padding: 16 } },
                    React.createElement(material_ui_1.RaisedButton, { label: 'Export All', primary: true, onTouchTap: () => this.save() })))));
    }
}
exports.default = Inventory;

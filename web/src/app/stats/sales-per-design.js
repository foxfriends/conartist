'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const material_ui_1 = require("material-ui");
const settings_1 = require("material-ui/svg-icons/action/settings");
const close_1 = require("material-ui/svg-icons/navigation/close");
const stacked_bar_chart_1 = require("../../chart/stacked-bar-chart");
const file_saver_1 = require("file-saver");
const types_1 = require("../../types");
class SalesPerDesign extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            type: 'All',
            settings: false,
        };
    }
    get bars() {
        return this.props.records
            .filter(record => this.state.type === 'All' || this.state.type === record.type)
            .reduce((p, n) => this.reduceBars(p, n), {});
    }
    get legend() {
        return Object.keys(this.props.products)
            .reduce((obj, key) => (Object.assign({}, obj, { [key]: { color: types_1.Colors[key], name: types_1.ProductTypes[key] } })), {});
    }
    reduceBars(bars, record) {
        const updated = Object.assign({}, bars);
        for (const product of record.products) {
            updated[product] = updated[product] || types_1.empty(0);
            ++updated[product][record.type];
        }
        return updated;
    }
    typeChange(_, __, type) {
        this.setState({ type });
    }
    save() {
        const data = this.props.records
            .reduce((p, n) => this.reduceBars(p, n), {});
        const blob = new Blob([
            `Design,Total,${Object.keys(this.props.products).map((_) => types_1.ProductTypes[_]).join(',')}\n` +
                Object.keys(data).map(key => `${key},${Object.keys(data[key]).reduce((_, p) => _ + data[key][p], 0)},${Object.keys(this.props.products).map((_) => data[key][_]).join(',')}`).join('\n'),
        ]);
        file_saver_1.saveAs(blob, 'sales-per-design.csv', true);
    }
    render() {
        return (React.createElement("div", { style: { position: 'relative' } },
            React.createElement(material_ui_1.Subheader, { style: { fontSize: '16px', fontFamily: 'Roboto,sans-serif' } }, "Sales Per Design"),
            React.createElement(material_ui_1.IconButton, { style: { position: 'absolute', top: 0, right: 10 }, onTouchTap: () => this.setState({ settings: true }) },
                React.createElement(settings_1.default, null)),
            React.createElement(stacked_bar_chart_1.default, { yLabel: 'Sales', bars: this.bars, legend: this.legend }),
            React.createElement(material_ui_1.Drawer, { open: this.state.settings, openSecondary: true, width: '100%', style: { display: 'flex' } },
                React.createElement(material_ui_1.AppBar, { title: 'Sales Per Design Settings', iconElementLeft: React.createElement(material_ui_1.IconButton, null,
                        React.createElement(close_1.default, null)), onLeftIconButtonTouchTap: () => this.setState({ settings: false }) }),
                React.createElement("div", { style: { padding: 16 } },
                    React.createElement(material_ui_1.SelectField, { floatingLabelText: 'Product Type', value: this.state.type, onChange: (event, index, value) => this.typeChange(event, index, value) }, ['All', ...Object.keys(this.props.products)].map((type, i) => React.createElement(material_ui_1.MenuItem, { key: i, value: type, primaryText: type === 'All' ? 'All' : types_1.ProductTypes[type] })))),
                React.createElement("div", { style: { padding: 16 } },
                    React.createElement(material_ui_1.RaisedButton, { label: 'Export All', primary: true, onTouchTap: () => this.save() })))));
    }
}
exports.default = SalesPerDesign;

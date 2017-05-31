'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const material_ui_1 = require("material-ui");
const settings_1 = require("material-ui/svg-icons/action/settings");
const close_1 = require("material-ui/svg-icons/navigation/close");
const bar_chart_1 = require("../../chart/bar-chart");
const file_saver_1 = require("file-saver");
const types_1 = require("../../types");
class SalesPerType extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            metric: 'Customers',
            settings: false,
        };
    }
    get bars() {
        return this.props.records.reduce((p, n) => this.reduceBars(p, n), types_1.empty(0, Object.keys(this.props.products)));
    }
    reduceBars(bars, record) {
        const updated = Object.assign({}, bars);
        switch (this.state.metric) {
            case 'Customers':
                ++updated[record.type];
                break;
            case 'Items Sold':
                updated[record.type] += record.quantity;
                break;
            case 'Money':
                updated[record.type] += record.price;
        }
        return updated;
    }
    metricChange(_, __, metric) {
        this.setState({ metric });
    }
    save() {
        const data = this.props.records
            .reduce((prev, record) => {
            const updated = Object.assign({}, prev);
            ++updated[record.type].customers;
            updated[record.type].items += record.quantity;
            updated[record.type].money += record.price;
            return updated;
        }, types_1.empty({ customers: 0, items: 0, money: 0 }));
        const blob = new Blob([
            `Type,Customers,Items,Money\n` +
                Object.keys(data).map((key) => `${key},${data[key].customers},${data[key].items},${data[key].money}`).join('\n'),
        ]);
        file_saver_1.saveAs(blob, 'sales-per-type.csv', true);
    }
    render() {
        return (React.createElement("div", { style: { position: 'relative' } },
            React.createElement(material_ui_1.Subheader, { style: { fontSize: '16px', fontFamily: 'Roboto,sans-serif' } }, "Sales Per Type"),
            React.createElement(material_ui_1.IconButton, { style: { position: 'absolute', top: 0, right: 10 }, onTouchTap: () => this.setState({ settings: true }) },
                React.createElement(settings_1.default, null)),
            React.createElement(bar_chart_1.default, { yLabel: this.state.metric, bars: this.bars, colors: types_1.Colors }),
            React.createElement(material_ui_1.Drawer, { open: this.state.settings, openSecondary: true, width: '100%', style: { display: 'flex' } },
                React.createElement(material_ui_1.AppBar, { title: 'Sales Per Type Settings', iconElementLeft: React.createElement(material_ui_1.IconButton, null,
                        React.createElement(close_1.default, null)), onLeftIconButtonTouchTap: () => this.setState({ settings: false }) }),
                React.createElement("div", { style: { padding: 16 } },
                    React.createElement(material_ui_1.SelectField, { floatingLabelText: 'Metric', value: this.state.metric, onChange: (event, index, value) => this.metricChange(event, index, value) },
                        React.createElement(material_ui_1.MenuItem, { value: 'Customers', primaryText: 'Customers' }),
                        React.createElement(material_ui_1.MenuItem, { value: 'Items Sold', primaryText: 'Items Sold' }),
                        React.createElement(material_ui_1.MenuItem, { value: 'Money', primaryText: 'Money' }))),
                React.createElement("div", { style: { padding: 16 } },
                    React.createElement(material_ui_1.RaisedButton, { label: 'Export All', primary: true, onTouchTap: () => this.save() })))));
    }
}
exports.default = SalesPerType;

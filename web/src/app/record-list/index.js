'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const material_ui_1 = require("material-ui");
const Moment = require("moment");
const file_saver_1 = require("file-saver");
const numeral = require("numeral");
const types_1 = require("../../types");
class RecordList extends React.Component {
    save() {
        const total = { quantity: 0, price: 0 };
        const blob = new Blob([
            'Type,Quantity,Products,Price,Time\n' +
                this.props.records.map(({ type, quantity, products, price, time }) => `${type},${total.quantity += quantity, quantity},${products.join(';')},${total.price += price, price},${time}`).join('\n') + `\nTotal,${total.quantity},--,${total.price},--`,
        ]);
        file_saver_1.saveAs(blob, 'records.csv', true);
    }
    render() {
        return (React.createElement("div", null,
            React.createElement("div", { style: { margin: '4px' } },
                React.createElement(material_ui_1.RaisedButton, { label: 'Export All', primary: true, onTouchTap: () => this.save(), fullWidth: true })),
            React.createElement(material_ui_1.List, null, this.props.records.sort(({ time: a }, { time: b }) => b - a).map((record, i) => {
                const products = record.products
                    .reduce((o, p) => (o[p] = o[p] ? o[p] + 1 : 1, o), {});
                const productStr = Object.keys(products).map((key) => products[key] === 1 ? key : `${key} (${products[key]})`).join(', ');
                return (React.createElement(material_ui_1.ListItem, { key: i, primaryText: productStr, secondaryText: React.createElement("p", null,
                        Moment(record.time).format('MMM D, h:mm a'),
                        " \u2014 ",
                        numeral(record.price).format('$0,0.00')), leftAvatar: React.createElement(material_ui_1.Avatar, { backgroundColor: types_1.Colors[record.type] }, types_1.ProductTypes[record.type][0]) }));
            }))));
    }
}
exports.default = RecordList;

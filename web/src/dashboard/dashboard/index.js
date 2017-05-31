'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const material_ui_1 = require("material-ui");
const types_1 = require("../../types");
const request_1 = require("../../request");
const inventory_chart_1 = require("./inventory-chart");
const con_list_1 = require("./con-list");
require("./dashboard.scss");
class Dashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = { products: {}, cons: { keys: 0, cons: [] } };
        this.load();
    }
    load() {
        request_1.get('/dashboard/products').then(products => this.setState({ products: JSON.parse(products) }));
        request_1.get('/dashboard/cons').then(cons => this.setState({ cons: JSON.parse(cons) }));
    }
    manageInventory() {
    }
    showBuy() {
    }
    get products() {
        const order = Object.keys(types_1.ProductTypes);
        const products = {};
        const old = this.state.products;
        Object.keys(old).sort((a, b) => order.indexOf(a) - order.indexOf(b)).forEach((key) => {
            if (old[key].length > 0) {
                products[key] = old[key].map(([a, b]) => [a, b]);
            }
        });
        return products;
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(material_ui_1.AppBar, null),
            React.createElement("div", { className: 'dashboard' },
                React.createElement(material_ui_1.Card, { className: 'dashboard__card' },
                    React.createElement(material_ui_1.CardHeader, { title: 'Inventory' }),
                    React.createElement(material_ui_1.CardMedia, null,
                        React.createElement("div", { className: 'dashboard__chart' },
                            React.createElement(inventory_chart_1.default, { products: this.products }))),
                    React.createElement(material_ui_1.CardActions, null,
                        React.createElement(material_ui_1.RaisedButton, { label: 'Manage inventory', primary: true, onTouchTap: () => this.manageInventory() }))),
                React.createElement(material_ui_1.Card, { className: 'dashboard__card' },
                    React.createElement(material_ui_1.CardHeader, { title: 'Conventions' }),
                    React.createElement(material_ui_1.CardMedia, null,
                        React.createElement(con_list_1.default, { cons: this.state.cons })),
                    React.createElement(material_ui_1.CardActions, null,
                        React.createElement(material_ui_1.RaisedButton, { label: 'Get more conventions', primary: true, onTouchTap: () => this.showBuy() }))))));
    }
}
exports.default = Dashboard;

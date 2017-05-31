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
const close_1 = require("material-ui/svg-icons/navigation/close");
const colors_1 = require("material-ui/styles/colors");
const redux_1 = require("redux");
const numeral = require("numeral");
const product_list_1 = require("../product-list");
const record_list_1 = require("../record-list");
const stats_1 = require("../stats");
const request_1 = require("../../request");
const reducer_1 = require("./reducer");
const types_1 = require("../../types");
class Sales extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            productType: null,
            products: [],
            tabIndex: 0,
            saved: false,
        };
        this.store = redux_1.createStore(reducer_1.reducer);
        this.store.dispatch({ type: reducer_1.ActionTypes.Init, products: {}, prices: {}, records: [] });
        this.getProducts().then(data => this.store.dispatch(Object.assign({ type: reducer_1.ActionTypes.Init }, data)));
        this.store.subscribe(() => this.forceUpdate());
    }
    getProducts() {
        return __awaiter(this, void 0, void 0, function* () {
            return JSON.parse(yield request_1.get(`/app/products/${this.props.concode}`));
        });
    }
    toProducts(productType) {
        this.setState({
            productType,
            products: productType ? this.products[productType] : [],
        });
    }
    get products() {
        const order = Object.keys(types_1.ProductTypes);
        const products = {};
        const old = this.store.getState().products;
        Object.keys(old).sort((a, b) => order.indexOf(a) - order.indexOf(b)).forEach((key) => {
            if (old[key].length > 0) {
                products[key] = old[key].map(([a, b]) => [a, b]);
            }
        });
        this.store.getState().records.forEach(({ type, products: pr }) => pr.forEach(product => products[type].find(([_]) => _ === product)[1]--));
        return products;
    }
    get prices() {
        return this.store.getState().prices;
    }
    savePurchase(products, price) {
        return __awaiter(this, void 0, void 0, function* () {
            const record = {
                type: this.state.productType,
                quantity: products.length,
                products,
                price,
                time: Date.now(),
            };
            this.store.dispatch({ type: reducer_1.ActionTypes.Purchase, record });
            yield request_1.put(`/app/purchase/${this.props.concode}`, record);
            this.setState({ saved: true });
        });
    }
    handleChange(tabIndex) {
        this.setState({ tabIndex });
    }
    closeSnackbar() {
        this.setState({ saved: false });
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(material_ui_1.AppBar, { title: this.props.title, iconElementLeft: React.createElement(material_ui_1.IconButton, null,
                    React.createElement(close_1.default, null)), onLeftIconButtonTouchTap: this.props.close }),
            React.createElement(material_ui_1.Tabs, { value: this.state.tabIndex, onChange: (value) => this.handleChange(value) },
                React.createElement(material_ui_1.Tab, { label: 'Sell', value: 0 },
                    React.createElement("div", { style: {
                            maxHeight: 'calc(100vh - 112px)',
                            overflowY: 'auto',
                            overflowX: 'hidden',
                        } },
                        React.createElement(material_ui_1.List, null, Object.keys(this.products).map((type) => React.createElement(material_ui_1.ListItem, { key: type, primaryText: React.createElement("div", { style: { display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center' } },
                                types_1.ProductTypes[type],
                                React.createElement("span", { style: { margin: '0 4px', color: colors_1.grey500, display: 'flex', flexDirection: 'column' } }, (this.store.getState().prices[type] || [])
                                    .sort(([a], [b]) => a - b)
                                    .map(([q, p]) => React.createElement("span", { key: q },
                                    q,
                                    ": ",
                                    numeral(p).format('$0,0.00'))))), onClick: () => this.toProducts(type), leftAvatar: React.createElement(material_ui_1.Avatar, { backgroundColor: types_1.Colors[type], style: { top: 'calc(50% - 20px)' } }, (types_1.ProductTypes[type] || '?')[0]) }))))),
                React.createElement(material_ui_1.Tab, { label: 'History', value: 1 },
                    React.createElement("div", { style: {
                            maxHeight: 'calc(100vh - 112px)',
                            overflowY: 'auto',
                            overflowX: 'hidden',
                        } },
                        React.createElement(record_list_1.default, { records: this.store.getState().records }))),
                React.createElement(material_ui_1.Tab, { label: 'Stats', value: 2 },
                    React.createElement("div", { style: {
                            maxHeight: 'calc(100vh - 112px)',
                            overflowY: 'auto',
                            overflowX: 'hidden',
                        } },
                        React.createElement(stats_1.default, { products: this.products, records: this.store.getState().records, store: this.store.getState() })))),
            React.createElement(product_list_1.default, { type: this.state.productType, items: this.state.products, prices: this.prices, close: () => this.toProducts(null), save: (purchase, price) => this.savePurchase(purchase, price) }),
            React.createElement(material_ui_1.Snackbar, { open: this.state.saved, message: 'Saved!', autoHideDuration: 3000, onRequestClose: () => this.closeSnackbar() })));
    }
}
exports.default = Sales;

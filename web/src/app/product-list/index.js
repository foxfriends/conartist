'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const material_ui_1 = require("material-ui");
const save_1 = require("material-ui/svg-icons/content/save");
const close_1 = require("material-ui/svg-icons/navigation/close");
const arrow_back_1 = require("material-ui/svg-icons/navigation/arrow-back");
const colors_1 = require("material-ui/styles/colors");
const search_1 = require("material-ui/svg-icons/action/search");
const types_1 = require("../../types");
class ProductList extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { selected: [], price: '', priceError: '', searchField: null, searchValue: null };
    }
    get items() {
        return this.props.items.filter(([item]) => {
            if (!this.state.searchValue) {
                return true;
            }
            return material_ui_1.AutoComplete.fuzzyFilter(this.state.searchValue, item);
        });
    }
    addProduct(product) {
        this.setState({ selected: [...this.state.selected, product] }, () => {
            const price = this.calculatePrice();
            this.setState({ price, priceError: price === '' ? 'Please enter a price' : '' });
        });
    }
    removeProduct(product) {
        const selected = [...this.state.selected];
        selected.splice(product, 1);
        this.setState({ selected }, () => {
            const price = this.calculatePrice();
            this.setState({ price, priceError: price === '' && selected.length ? 'Please enter a price' : '' });
        });
    }
    calculatePrice() {
        const selected = [...this.state.selected];
        const counts = { [this.props.type]: 0 };
        selected.reverse().forEach(name => {
            const fullname = `${this.props.type}.${name}`;
            if (this.props.prices[fullname] !== undefined) {
                counts[fullname] = counts[fullname] ? counts[fullname] + 1 : 1;
            }
            else {
                counts[this.props.type]++;
            }
        });
        const price = Object.keys(counts).reduce((_, key) => _ + (this.props.prices[key] || [])
            .sort(([a], [b]) => b - a)
            .reduce((t, [qty, pr]) => {
            while (counts[key] >= qty) {
                counts[key] -= qty;
                t += pr;
            }
            return t;
        }, 0), 0);
        return price ? price.toString(10) : '';
    }
    close() {
        if (this.state.searchField) {
            this.toggleSearch();
        }
        else {
            this.doClose();
        }
    }
    save() {
        if (this.state.priceError === '' && this.state.selected.length > 0) {
            this.props.save(this.state.selected, +this.state.price);
            this.doClose();
        }
    }
    doClose() {
        this.props.close();
        this.setState({ selected: [], price: '', priceError: '', searchValue: null, searchField: null });
    }
    handleChange(_, price) {
        if (/^\$?\d+(\.\d\d?)?$/.test(price)) {
            this.setState({ price, priceError: '' });
        }
        else {
            this.setState({ price, priceError: 'Price is not a number' });
        }
    }
    updateFilter(searchValue) {
        this.setState({ searchValue });
    }
    toggleSearch() {
        if (this.state.searchField) {
            this.setState({ searchField: null, searchValue: null });
        }
        else {
            this.setState({
                searchField: React.createElement(material_ui_1.TextField, { onChange: ((_, text) => this.updateFilter(text)), fullWidth: true, inputStyle: { color: 'white' }, autoFocus: true, hintText: 'Filter' }),
                searchValue: '',
            });
        }
    }
    render() {
        return (React.createElement("div", null,
            React.createElement(material_ui_1.Drawer, { open: !!this.props.type, openSecondary: true, disableSwipeToOpen: true, width: '100%' },
                React.createElement(material_ui_1.AppBar, { title: this.state.searchField || types_1.ProductTypes[this.props.type], iconElementLeft: React.createElement(material_ui_1.IconButton, null, this.state.searchField ? React.createElement(arrow_back_1.default, null) : React.createElement(close_1.default, null)), onLeftIconButtonTouchTap: () => this.close(), iconElementRight: this.state.searchField ? undefined : React.createElement(material_ui_1.IconButton, null,
                        React.createElement(search_1.default, null)), onRightIconButtonTouchTap: () => this.toggleSearch(), onTitleTouchTap: () => this.state.searchField || this.toggleSearch() }),
                React.createElement("div", { style: { margin: '0 16px' } },
                    React.createElement(material_ui_1.TextField, { value: this.state.price, floatingLabelText: 'Price', onChange: (_, value) => this.handleChange(_, value), errorText: this.state.priceError, disabled: !this.state.selected.length, fullWidth: true, type: 'number', step: 0.01 })),
                React.createElement("div", { style: { minHeight: 40, maxWidth: '100%', overflowX: 'auto' } },
                    React.createElement("div", { style: { display: 'flex' } }, this.state.selected.map((name, i) => React.createElement(material_ui_1.Chip, { key: i, onRequestDelete: () => this.removeProduct(i), onTouchTap: () => this.removeProduct(i), style: { margin: '4px' } }, name)))),
                React.createElement("div", { style: {
                        maxHeight: 'calc(100vh - 176px)',
                        overflowY: 'auto',
                    } },
                    React.createElement(material_ui_1.List, null, this.items.map((item) => {
                        const qty = Math.max(0, item[1] - this.state.selected.reduce((_, name) => _ + (name === item[0] ? 1 : 0), 0));
                        return (React.createElement(material_ui_1.ListItem, { key: item[0], primaryText: item[0], onTouchTap: () => this.addProduct(item[0]), rightIcon: React.createElement("div", { style: { display: 'flex', alignItems: 'center', color: colors_1.grey500 } }, qty) }));
                    })))),
            React.createElement(material_ui_1.Badge, { badgeContent: this.state.selected.length, secondary: true, badgeStyle: {
                    fontFamily: 'Roboto,sans-serif',
                    top: 20,
                    right: 20,
                    zIndex: 1401,
                    display: this.state.selected.length ? 'flex' : 'none',
                }, style: {
                    position: 'fixed',
                    bottom: 5,
                    right: 0,
                    transform: `scale(${this.props.type ? 1 : 0})`,
                    zIndex: 1400,
                } },
                React.createElement(material_ui_1.FloatingActionButton, { onTouchTap: () => this.save(), disabled: !!this.state.priceError || this.state.selected.length === 0, tabIndex: -1 },
                    React.createElement(save_1.default, null)))));
    }
}
exports.default = ProductList;

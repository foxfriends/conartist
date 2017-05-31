'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
require("./sidenav.scss");
class Sidenav extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { open: false };
    }
    componentWillReceiveProps(props) {
        this.setState({ open: props.open });
    }
    render() {
        return (React.createElement("div", { className: 'md-sidenav' },
            React.createElement("div", { className: `md-sidenav__backdrop md-sidenav__backdrop--${this.state.open ? 'visible' : 'hidden'}`, onClick: this.props.onBackdropClick, onTouchStart: this.props.onBackdropClick }),
            React.createElement("div", { className: `md-sidenav__content md-sidenav__content--${this.state.open ? 'open' : 'closed'} md-sidenav__content--${this.props.openSecondary ? 'right' : 'left'}` }, this.props.children)));
    }
}
exports.default = Sidenav;

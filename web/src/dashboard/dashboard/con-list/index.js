'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const material_ui_1 = require("material-ui");
const Moment = require("moment");
require("./con-list.scss");
class ConList extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { con: null };
    }
    showInfo(con = null) {
        this.setState({ con });
    }
    render() {
        const cons = this.props.cons.cons.sort(({ start: a }, { start: b }) => b - a);
        return (React.createElement("div", null,
            React.createElement(material_ui_1.List, null, cons.map(con => React.createElement(material_ui_1.ListItem, { key: con.code, primaryText: con.title, secondaryText: `${Moment(con.start).format('MMM d, YYYY')} - ${Moment(con.end).format('MMM d, YYYY')}`, onTouchTap: () => this.showInfo(con) }))),
            React.createElement("div", { className: `backdrop backdrop--${this.state.con ? 'visible' : 'hidden'}`, onClick: () => this.showInfo() },
                React.createElement(material_ui_1.Paper, { className: `overlay overlay--${this.state.con ? 'visible' : 'hidden'}` }, !this.state.con ? null :
                    React.createElement(material_ui_1.Card, null,
                        React.createElement(material_ui_1.CardHeader, { title: this.state.con.title, subtitle: `${Moment(this.state.con.start).format('MMM d, YYYY')} - ${Moment(this.state.con.end).format('MMM d, YYYY')}` }),
                        React.createElement(material_ui_1.CardMedia, null),
                        React.createElement(material_ui_1.CardActions, null,
                            React.createElement(material_ui_1.FlatButton, { onTouchTap: () => this.showInfo() }, "Close")))))));
    }
}
exports.default = ConList;

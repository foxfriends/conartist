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
const sales_1 = require("../sales");
const request_1 = require("../../request");
require("../../form.scss");
class ConCode extends React.Component {
    constructor() {
        super(...arguments);
        this.state = { code: '', title: '', error: '' };
    }
    componentWillMount() {
        const code = localStorage.getItem('app-con-code');
        if (code && localStorage.getItem('app-con-valid')) {
            const title = localStorage.getItem('app-con-name');
            this.setState({ code, title });
            window.document.title = title;
        }
        else {
            localStorage.removeItem('app-con-code');
            localStorage.removeItem('app-con-name');
        }
    }
    updateCode(code) {
        this.setState({ code, error: '' });
    }
    checkCode() {
        return __awaiter(this, void 0, void 0, function* () {
            const { title } = JSON.parse(yield request_1.get(`/con-info/${this.state.code}`));
            if (title) {
                this.setState({ title }, () => {
                    localStorage.setItem('app-con-code', this.state.code);
                    localStorage.setItem('app-con-name', this.state.title);
                    localStorage.setItem('app-con-valid', 'ok');
                    window.document.title = title;
                });
            }
            else {
                this.setState({ error: 'You are not signed up for that convention' });
            }
        });
    }
    close() {
        this.setState({
            code: '',
            title: '',
        });
        localStorage.removeItem('app-con-code');
        localStorage.removeItem('app-con-name');
        localStorage.removeItem('app-con-valid');
        window.document.title = 'ConArtist';
    }
    render() {
        if (this.state.title) {
            return React.createElement(sales_1.default, { title: this.state.title, close: () => this.close(), concode: this.state.code });
        }
        else {
            return (React.createElement("div", { className: 'form' },
                React.createElement("h1", { className: 'form__title' }, "Enter Con Code"),
                React.createElement("div", null,
                    React.createElement(material_ui_1.TextField, { name: 'concode', floatingLabelText: 'Code', errorText: this.state.error, onChange: (_, text) => this.updateCode(text), fullWidth: true }),
                    React.createElement("div", { style: { margin: 4 } },
                        React.createElement(material_ui_1.RaisedButton, { fullWidth: true, primary: true, label: 'Enter', onTouchTap: () => this.checkCode(), style: { margin: '4px 0' } })))));
        }
    }
}
exports.default = ConCode;

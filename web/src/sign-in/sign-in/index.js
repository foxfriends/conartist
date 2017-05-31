'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const material_ui_1 = require("material-ui");
const react_utils_1 = require("../../react-utils");
require("../../form.scss");
class SignIn extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            username: '',
            password: '',
            confirmPassword: '',
            email: '',
            confirmEmail: '',
            passwordMismatch: false,
            emailMismatch: false,
            signUp: false,
        };
    }
    updateUsername(username) {
        this.setState({ username });
    }
    updatePassword(password) {
        this.setState({
            password,
            passwordMismatch: password !== '' && password !== (this.state.confirmPassword || password),
        });
    }
    updateEmail(email) {
        this.setState({
            email,
            passwordMismatch: email !== '' && email !== (this.state.confirmEmail || email),
        });
    }
    checkPassword(password) {
        this.setState({
            confirmPassword: password,
            passwordMismatch: password !== '' && password !== (this.state.password || password),
        });
    }
    checkEmail(email) {
        this.setState({
            confirmEmail: email,
            passwordMismatch: email !== '' && email !== (this.state.email || email),
        });
    }
    logIn() {
        if (this.state.signUp) {
        }
        else {
        }
        window.location.href = '/dashboard';
    }
    toggleSignUp() {
        this.setState({ signUp: !this.state.signUp });
    }
    render() {
        return (React.createElement("div", { className: 'form' },
            React.createElement("h1", { className: 'form__title' }, "ConArtist"),
            React.createElement("div", null,
                React.createElement(material_ui_1.TextField, { name: 'username', floatingLabelText: 'Username', onChange: (_, text) => this.updateUsername(text), fullWidth: true }),
                React.createElement(material_ui_1.TextField, { name: 'password', floatingLabelText: 'Password', onChange: (_, text) => this.updatePassword(text), type: 'password', fullWidth: true }),
                React.createElement(react_utils_1.If, { cond: this.state.signUp },
                    React.createElement(material_ui_1.TextField, { name: 'confirm-password', floatingLabelText: 'Confirm Password', errorText: this.state.passwordMismatch ? 'Passwords do not match' : '', onChange: (_, text) => this.checkPassword(text), type: 'password', fullWidth: true }),
                    React.createElement(material_ui_1.TextField, { name: 'email', floatingLabelText: 'Email', onChange: (_, text) => this.updateEmail(text), type: 'email', fullWidth: true }),
                    React.createElement(material_ui_1.TextField, { name: 'confirm-email', floatingLabelText: 'Confirm Email', errorText: this.state.emailMismatch ? 'Emails do not match' : '', onChange: (_, text) => this.checkEmail(text), type: 'email', fullWidth: true })),
                React.createElement("div", { style: { margin: 4 } },
                    React.createElement(material_ui_1.RaisedButton, { fullWidth: true, primary: true, label: this.state.signUp ? 'Create Account' : 'Sign In', onTouchTap: () => this.logIn(), style: { margin: '4px 0' } }),
                    React.createElement(material_ui_1.FlatButton, { fullWidth: true, primary: true, label: this.state.signUp ? 'Cancel' : 'Sign Up', onTouchTap: () => this.toggleSignUp(), style: { margin: '4px 0' } })))));
    }
}
exports.default = SignIn;

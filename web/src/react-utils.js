'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
class If extends React.Component {
    render() {
        if (!this.props.cond) {
            return null;
        }
        else if (this.props.inline) {
            return React.createElement("span", null, this.props.children);
        }
        else {
            return React.createElement("div", null, this.props.children);
        }
    }
}
exports.If = If;
const RESIZE_EVENT = 'resize_event';
{
    let batch = false;
    window.addEventListener('resize', () => {
        if (batch) {
            return;
        }
        batch = true;
        window.requestAnimationFrame(() => {
            window.dispatchEvent(new CustomEvent(RESIZE_EVENT));
            batch = false;
        });
    });
}
function Resizable(Component) {
    return class extends Component {
        onResize() {
            this.forceUpdate();
        }
        componentDidMount() {
            window.addEventListener(RESIZE_EVENT, () => this.onResize());
        }
        componentWillUnmount() {
            window.removeEventListener(RESIZE_EVENT, () => this.onResize());
        }
    };
}
exports.Resizable = Resizable;

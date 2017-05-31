'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const material_ui_1 = require("material-ui");
const settings_1 = require("material-ui/svg-icons/action/settings");
const close_1 = require("material-ui/svg-icons/navigation/close");
const line_chart_1 = require("../../chart/line-chart");
const Moment = require("moment");
class SalesOverTime extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            start: new Date(0),
            end: new Date(0),
            bucketSize: 1000 * 60 * 20,
            settings: false,
            metric: 'Customers',
            timeError: '',
            bucketError: '',
        };
    }
    get minTime() {
        return this.props.records.length
            ? this.roundToBucket(this.props.records.sort((a, b) => a.time - b.time)[0].time)
            : 0;
    }
    get maxTime() {
        return this.props.records.length
            ? this.roundToBucket(this.props.records.sort((a, b) => b.time - a.time)[0].time)
            : 0;
    }
    roundToBucket(time) {
        return Math.floor(time / this.state.bucketSize) * this.state.bucketSize;
    }
    get buckets() {
        const buckets = this.props.records
            .reduce((p, n) => this.reduceBuckets(p, n), [])
            .sort((a, b) => a.time - b.time);
        for (let i = 0; i < buckets.length; ++i) {
            const expected = this.roundToBucket(this.state.start.getTime()) + i * this.state.bucketSize;
            if (buckets[i].time !== expected) {
                buckets.splice(i, 0, { quantity: 0, time: expected });
            }
        }
        while (this.roundToBucket(this.state.start.getTime()) + buckets.length * this.state.bucketSize <= this.state.end.getTime()) {
            buckets.push({ quantity: 0, time: this.roundToBucket(this.state.start.getTime()) + buckets.length * this.state.bucketSize });
        }
        return buckets;
    }
    reduceBuckets(buckets, record) {
        const updated = [...buckets];
        const time = this.roundToBucket(record.time);
        if (new Date(time) < this.state.start || new Date(time) > this.state.end) {
            return updated;
        }
        for (const bucket of updated) {
            if (time === bucket.time) {
                switch (this.state.metric) {
                    case 'Customers':
                        ++bucket.quantity;
                        break;
                    case 'Items Sold':
                        bucket.quantity += record.quantity;
                        break;
                    case 'Money':
                        bucket.quantity += record.price;
                }
                return updated;
            }
        }
        updated.push({ quantity: record.quantity, time });
        return updated;
    }
    componentWillReceiveProps(_) {
        if (this.state.start.getTime() === 0) {
            setTimeout(() => this.setState({
                start: new Date(this.minTime),
                end: new Date(this.maxTime),
            }));
        }
    }
    startChange(which, date) {
        const { start } = this.state;
        if (which === 'date') {
            start.setDate(date.getDate());
            start.setMonth(date.getMonth());
            start.setFullYear(date.getFullYear());
        }
        else {
            start.setMinutes(date.getMinutes());
            start.setHours(date.getHours());
        }
        if (start < this.state.end) {
            this.setState({ start, timeError: '' });
        }
        else {
            this.setState({ start, timeError: 'Time range does not make sense' });
        }
    }
    endChange(which, date) {
        const { end } = this.state;
        if (which === 'date') {
            end.setDate(date.getDate());
            end.setMonth(date.getMonth());
            end.setFullYear(date.getFullYear());
        }
        else {
            end.setMinutes(date.getMinutes());
            end.setHours(date.getHours());
        }
        this.setState({ end });
        if (this.state.start < end) {
            this.setState({ end, timeError: '' });
        }
        else {
            this.setState({ end, timeError: 'Time range does not make sense' });
        }
    }
    bucketChange(_, bucket) {
        if (/^\d+(\.\d+)?$/.test(bucket) && +bucket !== 0) {
            this.setState({ bucketSize: +bucket * 60 * 1000, bucketError: '' });
        }
        else {
            this.setState({ bucketError: 'Not a usable group amount' });
        }
    }
    metricChange(_, __, metric) {
        this.setState({ metric });
    }
    render() {
        return (React.createElement("div", { style: { position: 'relative' } },
            React.createElement(material_ui_1.Subheader, { style: { fontSize: '16px', fontFamily: 'Roboto,sans-serif' } }, "Sales Over Time"),
            React.createElement(material_ui_1.IconButton, { style: { position: 'absolute', top: 0, right: 10 }, onTouchTap: () => this.setState({ settings: true }) },
                React.createElement(settings_1.default, null)),
            React.createElement(line_chart_1.default, { yLabel: this.state.metric, buckets: this.buckets }),
            React.createElement(material_ui_1.Drawer, { open: this.state.settings, openSecondary: true, width: '100%', style: { display: 'flex' } },
                React.createElement(material_ui_1.AppBar, { title: 'Sales Over Time Settings', iconElementLeft: React.createElement(material_ui_1.IconButton, null,
                        React.createElement(close_1.default, null)), onLeftIconButtonTouchTap: () => this.setState({ settings: false }) }),
                React.createElement("div", { style: { padding: '16px' } },
                    React.createElement(material_ui_1.DatePicker, { floatingLabelText: 'Start', formatDate: date => Moment(date).format('MMMM D, YYYY'), value: this.state.start, onChange: (_, date) => this.startChange('date', date), errorText: this.state.timeError }),
                    React.createElement(material_ui_1.TimePicker, { floatingLabelText: 'Start Time', pedantic: true, value: this.state.start, onChange: (_, date) => this.startChange('time', date), errorText: this.state.timeError }),
                    React.createElement(material_ui_1.DatePicker, { floatingLabelText: 'End', formatDate: date => Moment(date).format('MMMM D, YYYY'), value: this.state.end, onChange: (_, date) => this.endChange('date', date), errorText: this.state.timeError }),
                    React.createElement(material_ui_1.TimePicker, { floatingLabelText: 'End Time', pedantic: true, value: this.state.end, onChange: (_, date) => this.endChange('time', date), errorText: this.state.timeError }),
                    React.createElement("div", null,
                        React.createElement(material_ui_1.TextField, { floatingLabelText: 'Grouping (minutes)', defaultValue: this.state.bucketSize / 1000 / 60, onChange: (event, text) => this.bucketChange(event, text), errorText: this.state.bucketError })),
                    React.createElement(material_ui_1.SelectField, { floatingLabelText: 'Metric', value: this.state.metric, onChange: (event, index, value) => this.metricChange(event, index, value) },
                        React.createElement(material_ui_1.MenuItem, { value: 'Customers', primaryText: 'Customers' }),
                        React.createElement(material_ui_1.MenuItem, { value: 'Items Sold', primaryText: 'Items Sold' }),
                        React.createElement(material_ui_1.MenuItem, { value: 'Money', primaryText: 'Money' }))))));
    }
}
exports.default = SalesOverTime;

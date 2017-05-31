'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const colors_1 = require("material-ui/styles/colors");
exports.ProductTypes = {
    Print11x17: '11x17 Print',
    Print5x7: '5x7 Print',
    Sticker: 'Sticker',
    HoloSticker: 'Holo sticker',
    Button: 'Button',
    Charm: 'Charm',
    Other: 'Other',
};
exports.Colors = {
    Print11x17: colors_1.blue400,
    Print5x7: colors_1.blue200,
    Button: colors_1.green300,
    Charm: colors_1.red300,
    Sticker: colors_1.orange400,
    HoloSticker: colors_1.orange200,
    Other: colors_1.grey400,
};
function empty(val, keyset = Object.keys(exports.ProductTypes)) {
    function cp(v) {
        if (v instanceof Array) {
            return [...v];
        }
        else if (typeof v === 'object') {
            return Object.assign({}, v);
        }
        else {
            return v;
        }
    }
    return keyset.reduce((_, key) => (Object.assign({}, _, { [key]: cp(val) })), {});
}
exports.empty = empty;

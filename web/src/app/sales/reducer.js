'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
var ActionTypes;
(function (ActionTypes) {
    ActionTypes[ActionTypes["Init"] = 0] = "Init";
    ActionTypes[ActionTypes["Purchase"] = 1] = "Purchase";
})(ActionTypes = exports.ActionTypes || (exports.ActionTypes = {}));
exports.reducer = function reducer(state, action) {
    switch (action.type) {
        case ActionTypes.Init:
            return {
                products: action.products,
                prices: action.prices,
                records: action.records,
            };
        case ActionTypes.Purchase:
            const updated = Object.assign({}, state);
            updated.records.push(action.record);
            return updated;
    }
    return Object.assign({}, state);
};
exports.default = exports.reducer;

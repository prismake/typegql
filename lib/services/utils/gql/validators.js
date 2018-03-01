Object.defineProperty(exports, "__esModule", { value: true });
function isObjectType(input) {
    return typeof input.getFields === 'function'; // TODO: More precise
}
exports.isObjectType = isObjectType;

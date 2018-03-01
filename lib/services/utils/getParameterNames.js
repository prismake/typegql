Object.defineProperty(exports, "__esModule", { value: true });
var COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/gm;
var DEFAULT_PARAMS = /=[^,]+/gm;
var FAT_ARROWS = /=>.*$/gm;
function getParameterNames(fn) {
    var code = fn
        .toString()
        .replace(COMMENTS, '')
        .replace(FAT_ARROWS, '')
        .replace(DEFAULT_PARAMS, '');
    var result = code.slice(code.indexOf('(') + 1, code.indexOf(')')).match(/([^\s,]+)/g);
    return result === null ? [] : result;
}
exports.getParameterNames = getParameterNames;

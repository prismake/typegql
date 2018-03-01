Object.defineProperty(exports, "__esModule", { value: true });
function wait(time) {
    return new Promise(function (resolve) { return setTimeout(resolve, time); });
}
exports.wait = wait;

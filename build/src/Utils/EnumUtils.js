"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enumUtils = void 0;
class EnumUtils {
    ToString(kind, value) {
        return kind[value];
    }
    ToNumber(value) {
        return value;
    }
}
exports.enumUtils = new EnumUtils();

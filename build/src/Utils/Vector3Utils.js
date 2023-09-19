"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vector3 = void 0;
class Vector3 {
    static New(x, y, z) {
        var vec = new Vector3();
        vec.x = x;
        vec.y = y;
        vec.z = z;
        return vec;
    }
    static Minus(v1, v2) {
        return Vector3.New(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
    }
    static Distance(v1, v2) {
        var v = Vector3.Minus(v1, v2);
        return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    }
}
exports.Vector3 = Vector3;

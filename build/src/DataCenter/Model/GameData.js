"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameData = void 0;
const BulletData_1 = require("../Data/BulletData");
const DamageEffectData_1 = require("../Data/DamageEffectData");
const MonsterData_1 = require("../Data/MonsterData");
const TestData_1 = require("../Data/TestData");
exports.GameData = {
    "BulletData": {
        Name: "BulletData",
        Version: 1,
        Datas: BulletData_1.BulletData
    },
    "DamageEffectData": {
        Name: "DamageEffectData",
        Version: 1,
        Datas: DamageEffectData_1.DamageEffectData
    },
    "MonsterData": {
        Name: "MonsterData",
        Version: 1,
        Datas: MonsterData_1.MonsterData
    },
    "TestData": {
        Name: "TestData",
        Version: 1,
        Datas: TestData_1.TestData
    },
};

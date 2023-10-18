"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerState = exports.CharacterBaseStats = exports.GrowthRate = void 0;
exports.GrowthRate = [
    {
        //warrior
        HP: 15,
        MP: 3,
        STR: 3,
        VIT: 4,
        DEX: 1,
        MND: 1,
        SPI: 1,
        SPD: 1,
    },
    {
        // Mage
        HP: 10,
        MP: 3,
        STR: 2,
        VIT: 3,
        DEX: 2,
        MND: 2,
        SPI: 2,
        SPD: 2,
    },
    {
        //Thief
        HP: 10,
        MP: 5,
        STR: 1,
        VIT: 2,
        DEX: 1,
        MND: 3,
        SPI: 3,
        SPD: 1,
    }
];
exports.CharacterBaseStats = {
    HP: 100,
    CurHP: 130,
    CurMP: 100,
    MP: 80,
    BLUE_SLOT: 1,
    GREEN_SLOT: 1,
    RED_SLOT: 1,
    PUR_SLOT: 1,
    BASE_HP: 100,
    BASE_MP: 80,
    BASE_STR: 10,
    BASE_VIT: 10,
    BASE_DEX: 10,
    BASE_MND: 10,
    BASE_SPI: 10,
    BASE_SPD: 10,
    BASE_HIT: 1,
    BASE_EVA: 0.1,
    BASE_CRI: 0.05,
    BASE_CRD: 2,
    BASE_VIS: 150,
};
exports.playerState = {
    NotReady: 0,
    Ready: 1,
};

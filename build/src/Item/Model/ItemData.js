"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemData = exports.ItemType = exports.QualityItemCode = void 0;
var QualityItemCode;
(function (QualityItemCode) {
    QualityItemCode[QualityItemCode["White"] = 1] = "White";
    QualityItemCode[QualityItemCode["Green"] = 2] = "Green";
    QualityItemCode[QualityItemCode["Blue"] = 3] = "Blue";
    QualityItemCode[QualityItemCode["Purple"] = 4] = "Purple";
    QualityItemCode[QualityItemCode["Yellow"] = 5] = "Yellow";
    QualityItemCode[QualityItemCode["Red"] = 6] = "Red";
    QualityItemCode[QualityItemCode["Orange"] = 7] = "Orange";
})(QualityItemCode = exports.QualityItemCode || (exports.QualityItemCode = {}));
var ItemType;
(function (ItemType) {
    ItemType[ItemType["Unknown"] = 0] = "Unknown";
    //Item
    ItemType[ItemType["SummonHero"] = 1001] = "SummonHero";
    ItemType[ItemType["CraftHeroEquip_BP"] = 2001] = "CraftHeroEquip_BP";
    ItemType[ItemType["CraftHeroEquip_SP"] = 2002] = "CraftHeroEquip_SP";
})(ItemType = exports.ItemType || (exports.ItemType = {}));
class ItemData {
}
exports.ItemData = ItemData;

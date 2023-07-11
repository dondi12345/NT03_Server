"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HeroFashion = exports.HeroFashionVar = void 0;
exports.HeroFashionVar = {
    FemaleEyes: ["EY100", "EY101", "EY102", "EY103", "EY104", "EY105", "EY106",],
    MaleEyes: ["EY200", "EY201", "EY202", "EY203", "EY204", "EY205", "EY206",],
    Eyebrow: ["EB000", "EB001", "EB002", "EB003", "EB004", "EB005", "EB006"],
    FemaleHair: ["HA100", "HA101", "HA102", "HA103", "HA104", "HA105", "HA106",],
    MaleHair: ["HA200", "HA201", "HA202", "HA203", "HA204", "HA205", "HA206",],
    Mouths: ["MO000", "MO001", "MO002", "MO003", "MO004", "MO005", "MO006",],
    FirstNames: ["Sofia", "Emma", "Anna", "Alexander", "Max", "Lucas", "Liam", "Julia"],
    LastNames: ["Lindberg", "Huguenin", "Kovalchuk", "Giannini", "Wahlberg", "Sorensen", "Deschamps", "Berglund"],
    Color: ["7D7878", "3A4050", "A73032", "CC83BE", "C1E2FB", "82AE62", "E5E38B", "986438"],
};
class HeroFashion {
    constructor() {
        this.Color = "FFFFFF";
    }
    static NewHero(index) {
        var heroFashion = new HeroFashion();
        heroFashion.Index = index;
        return heroFashion;
    }
    static NewHero1(index, color) {
        var heroFashion = new HeroFashion();
        heroFashion.Index = index;
        heroFashion.Color = color;
        return heroFashion;
    }
}
exports.HeroFashion = HeroFashion;

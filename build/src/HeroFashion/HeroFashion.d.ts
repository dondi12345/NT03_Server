export declare const HeroFashionVar: {
    FemaleEyes: string[];
    MaleEyes: string[];
    Eyebrow: string[];
    FemaleHair: string[];
    MaleHair: string[];
    Mouths: string[];
    FirstNames: string[];
    LastNames: string[];
    Color: string[];
};
export interface IHeroFashion {
    Index: String;
    Color: String;
}
export declare class HeroFashion implements IHeroFashion {
    Index: String;
    Color: String;
    constructor();
    static NewHeroFashion(index: String, color?: String): HeroFashion;
}

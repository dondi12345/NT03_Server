import { GenderCode } from "../HeroServer/Model/GenderCode";
import { HeroFashionCode } from "./HeroFashionCode";

export const HeroFashionVar = {
    FemaleEyes : ["EY100","EY101","EY102","EY103","EY104","EY105","EY106",],
    MaleEyes : ["EY200","EY201","EY202","EY203","EY204","EY205","EY206",],
    Eyebrow : ["EB000","EB001","EB002","EB003","EB004","EB005","EB006"],
    FemaleHair : ["HA100","HA101","HA102","HA103","HA104","HA105","HA106",],
    MaleHair : ["HA200","HA201","HA202","HA203","HA204","HA205","HA206",],
    Mouths : ["MO100","MO101","MO102","MO103","MO104","MO105","MO106",],
    FirstNames : ["Sofia","Emma","Anna","Alexander","Max","Lucas","Liam","Julia"],
    LastNames : ["Lindberg","Huguenin","Kovalchuk","Giannini","Wahlberg","Sorensen","Deschamps","Berglund"],
    Color : ["7D7878","3A4050","A73032","CC83BE","C1E2FB","82AE62","E5E38B","986438"],
}

export interface IHeroFashion{
    Index : String,
    Color : String,
}

export class HeroFashion implements IHeroFashion {
    Index : String;
    Color : String = "FFFFFF";
    constructor(){
        
    }

    static NewHero(index : String) {
        var heroFashion = new HeroFashion();
        heroFashion.Index = index;
        return heroFashion;
    }
    static NewHero1(index : String, color : String) {
        var heroFashion = new HeroFashion();
        heroFashion.Index = index;
        heroFashion.Color = color;
        return heroFashion;
    }
}
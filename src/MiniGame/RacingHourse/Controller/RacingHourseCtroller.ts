import mongoose, { ObjectId } from "mongoose";
import { variable } from "../../../other/Env";
import { EffectCode } from "../Model/EffectCode";
import { RacingHourseData } from "../Model/RacingHourseData";
import { CreateResultRacingHourse, FindResultRacingHourse, ResultRacingHourse, UpdateResultRacingHourse } from "../Model/ResultRacingHourse";

let idCurrentRacingHourse = new mongoose.Schema.Types.ObjectId("64464d6a5b090c6657e54f70");

export async function CreateRacingHourse(){
    await CreateResultRacingHourse().then((res)=>{
        idCurrentRacingHourse = res._id;
    }).catch((err)=>{
        throw err;
    })
}

export function RacingHourse(){
    FindResultRacingHourse(idCurrentRacingHourse).then((resultRacingHourse : ResultRacingHourse)=>{
        resultRacingHourse.racingHourseDatas = [];
        resultRacingHourse.dateRacing = new Date();
        for (let i = 0; i < variable.maxLandRacingHourse; i++)
        {
            var racingHourseData = InitRacingHourseData();
            racingHourseData.rank = 1;
            for (let index = 0; index < resultRacingHourse.racingHourseDatas.length; index++) {
                const element = resultRacingHourse.racingHourseDatas[index];
                if(racingHourseData.totalTime < element.totalTime){
                    element.rank ++;
                }else{
                    racingHourseData.rank++;
                }
            }
            resultRacingHourse.racingHourseDatas.push(racingHourseData);
        }
        UpdateResultRacingHourse(resultRacingHourse);
    })
    
    // return resultRacingHourse;
}

export function InitRacingHourseData() : RacingHourseData{
    var racingHourseData = new RacingHourseData();
    racingHourseData.effectCodes.push(EffectCode.nonEffect);
    racingHourseData.effectCodes.push(EffectCode.nonEffect);
    racingHourseData.totalTime = 3;
    let timeOver : number = 1;
    let countAffect = 0;
    let totalRate = TotalRate();
    for (let i = 2; i < variable.maxStepRacingHourse - 2; i++)
    {
        racingHourseData.totalTime += timeOver;
        let rate = Math.random()*totalRate;
        var effect = GetEffectByRate(rate);
        countAffect -= 1;
        if(countAffect < 0) timeOver = 1;
        racingHourseData.effectCodes[i] = effect.effectCode;
        if(effect.effectCode == EffectCode.nonEffect) continue;;
        timeOver = effect.timeOver;
        countAffect = effect.countEffect;
    }
    racingHourseData.totalTime += timeOver;
    countAffect -= 1;
    if(countAffect <= 0) timeOver = 1;
    racingHourseData.effectCodes.push(EffectCode.nonEffect);
    racingHourseData.totalTime += timeOver;
    countAffect -= 1;
    if(countAffect <= 0) timeOver = 1;
    racingHourseData.effectCodes.push(EffectCode.nonEffect);
    return racingHourseData;
}

export function TotalRate() : number{
    let total = 0;
    effectModelCollections.forEach(item => {
        total += item.appearRate;
    });
    return total;
}

export function GetEffectByRate(rate : number) : Effect{
    var data = effectModelCollections[0]
    for (let index = 0; index < effectModelCollections.length; index++) {
        const element = effectModelCollections[index];
        if(rate < element.appearRate) {
            data = element;
            break;
        }
        rate -= element.appearRate;
    }
    return data;
}

export class Effect{
    appearRate : number;
    effectCode : EffectCode;
    timeOver : number;
    countEffect : number;
}

export let effectModelCollections : Effect[] = [
    {
        appearRate: 50,
        effectCode : EffectCode.nonEffect,
        timeOver : 0,
        countEffect : 0,
    },
    {
        appearRate: 20,
        effectCode : EffectCode.boom,
        timeOver : 3,
        countEffect : 0,
    },
    {
        appearRate: 30,
        effectCode : EffectCode.slow,
        timeOver : 1.5,
        countEffect : 1,
    },
    {
        appearRate: 30,
        effectCode : EffectCode.speed,
        timeOver : 0.5,
        countEffect : 3,
    },
]
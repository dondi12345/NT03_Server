import mongoose, { Schema, Types } from "mongoose";

export interface IHero{
    _id : Types.ObjectId,
    IdUserPlayer : Types.ObjectId,
}

export class Hero implements IHero{
    _id: Types.ObjectId;
    IdUserPlayer: Types.ObjectId;
}

const HeroSchema = new Schema<IHero>(
    {
        IdUserPlayer: { type: mongoose.Schema.Types.ObjectId, ref: 'UserPlayer' },
    }
);
  
export const HeroModel = mongoose.model<IHero>('Hero', HeroSchema);
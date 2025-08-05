import { Schema, model } from 'mongoose';

// 게임 정보
export interface GameConfig {
    //게임 이름
    gameName: string;
    //게임 설명
    gameDescription: string;
    //게임 버전
    gameVersion: string;
    //게임 룰
    gameRules: {
        maxPlayers: number;
        minPlayers: number;
        chaosApperance:number[];
    }
    //게임 데이터
    gameAssets: {
        characters: ICharacter[];
        enemies: IEnemyType[];
        regions: IRegion[];
        turnCards: Card[];

    }
}

export interface IGameData{
    turnNumber:number;
    currnetTurnOrder:string;
    players:IPlayer[];
}

export interface IPlayer{
    playerId:string;
    playerName:string;
    playerCharacter:ICharacter;
    playerHand:Card[];
}

export interface ICharacter {
    characterId:string;
    name:string;
    description:string;
    abilities:string;
}

export interface IEnemyType {
    enemyId: string;
    name: TEnemy;
    description: string;
}

export interface IRegion {
    regionId: string;
    regionName: string;
    regionDescription: string;
    regionImageUrl: string;
    x: number;
    y: number;
    radius: number;
    color: string;
    connectedRegions: string[];
}

export interface Card {
    cardId:string;
    CardName:string;
    cardType:TCardType;
    description:string;
    cardImageUrl:string;
    AppearEnemyType:TEnemy;
    region:IRegion;
    descriptionDetail:string;
}

export type TCardType = 'Character'|'Enemy'|'Region'|'Chaos';
export type TEnemy ='Rebels'|'invaders'|'Outlaws';

// 게임 정보 ( 게임 기본 정보 + 게임 데이터 ) 스키마
const gameConfigSchema = new Schema<GameConfig>({
    gameDescription: {
        type: String,
        required: true,
    },
    gameVersion: {
        type: String,
        required: true,
    },
    gameAssets: {
        type: Object,
        required: true,
    }
});

export const GameConfig = model('GameConfig', gameConfigSchema);
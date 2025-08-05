import { Schema, model } from 'mongoose';

// 게임 세션 상태 타입
export type TGameStatus = 'waiting' | 'playing' | 'finished' | 'cancelled';

// 게임 세션 인터페이스
export interface IGameSession {
    sessionId: string;
    gameName: string;
    maxPlayers: number;
    currentPlayers: number;
    isPrivate: boolean;
    password?: string;
    status: TGameStatus;
    createdAt: Date;
    updatedAt: Date;
    players: IPlayer[];
    gameData?: any; // 게임 진행 데이터
}

// 플레이어 인터페이스
export interface IPlayer {
    playerId: string;
    playerName: string;
    character?: any;
    joinedAt: Date;
    isHost: boolean;
}

// 게임 세션 스키마
const gameSessionSchema = new Schema<IGameSession>({
    sessionId: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    gameName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },
    maxPlayers: {
        type: Number,
        required: true,
        min: 2,
        max: 8
    },
    currentPlayers: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    isPrivate: {
        type: Boolean,
        required: true,
        default: false
    },
    password: {
        type: String,
        required: function() {
            return this.isPrivate;
        },
        minlength: 4,
        maxlength: 20
    },
    status: {
        type: String,
        required: true,
        enum: ['waiting', 'playing', 'finished', 'cancelled'],
        default: 'waiting'
    },
    players: [{
        playerId: {
            type: String,
            required: true
        },
        playerName: {
            type: String,
            required: true,
            trim: true,
            maxlength: 20
        },
        character: {
            type: Schema.Types.Mixed
        },
        joinedAt: {
            type: Date,
            default: Date.now
        },
        isHost: {
            type: Boolean,
            default: false
        }
    }],
    gameData: {
        type: Schema.Types.Mixed
    }
}, {
    timestamps: true
});

// 세션 ID 생성 인덱스
gameSessionSchema.index({ sessionId: 1 });
gameSessionSchema.index({ status: 1 });
gameSessionSchema.index({ createdAt: -1 });

// 가상 필드: 게임이 가득 찼는지 확인
gameSessionSchema.virtual('isFull').get(function() {
    return this.currentPlayers >= this.maxPlayers;
});

// 가상 필드: 게임에 참여할 수 있는지 확인
gameSessionSchema.virtual('canJoin').get(function() {
    return this.status === 'waiting' && this.currentPlayers < this.maxPlayers;
});

// JSON 변환 시 가상 필드 포함
gameSessionSchema.set('toJSON', { virtuals: true });
gameSessionSchema.set('toObject', { virtuals: true });

export const GameSession = model<IGameSession>('GameSession', gameSessionSchema); 
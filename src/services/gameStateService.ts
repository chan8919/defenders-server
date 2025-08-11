import { GameSession } from '../models/gameSession.model';
import { GameDataUpdateService } from './gameDataUpdateService';

interface GameState {
    sessionId: string;
    players: PlayerState[];
    currentTurn: string;
    gamePhase: 'waiting' | 'playing' | 'finished';
    turnNumber: number;
    gameData: any;
}

interface PlayerState {
    id: string;
    name: string;
    currentRegion: string;
    actionPoints: number;
    maxActionPoints: number;
    isCurrentTurn: boolean;
    informationCards: {
        rebel: number;
        invader: number;
        outlaw: number;
    };
    regionCards: RegionCard[];
}

interface RegionCard {
    id: string;
    regionId: string;
    regionName: string;
    color: string;
}

interface MapData {
    sessionId: string;
    regions: any[];
    enemies: any[];
    watchtowers: any[];
}

export class GameStateService {
    private static gameStates: Map<string, GameState> = new Map();

    // 게임 상태 초기화
    static async initializeGameState(sessionId: string): Promise<GameState> {
        try {
            const session = await GameSession.findOne({ sessionId });
            if (!session) {
                throw new Error('게임 세션을 찾을 수 없습니다.');
            }

            // 게임 데이터 가져오기
            const gameData = await GameDataUpdateService.getGameData();
            const regions = await GameDataUpdateService.getRegions();

            // 플레이어 상태 초기화
            const players: PlayerState[] = session.players.map((player, index) => ({
                id: player.playerId,
                name: player.playerName,
                currentRegion: '1', // 시작 지역
                actionPoints: 3,
                maxActionPoints: 3,
                isCurrentTurn: index === 0, // 첫 번째 플레이어가 첫 턴
                informationCards: {
                    rebel: 0,
                    invader: 0,
                    outlaw: 0
                },
                regionCards: []
            }));

            const gameState: GameState = {
                sessionId,
                players,
                currentTurn: players[0]?.id || '',
                gamePhase: 'playing',
                turnNumber: 1,
                gameData: gameData
            };

            this.gameStates.set(sessionId, gameState);
            return gameState;

        } catch (error) {
            console.error('게임 상태 초기화 오류:', error);
            throw error;
        }
    }

    // 게임 상태 가져오기
    static getGameState(sessionId: string): GameState | undefined {
        return this.gameStates.get(sessionId);
    }

    // 게임 상태 업데이트
    static updateGameState(sessionId: string, updates: Partial<GameState>): GameState | undefined {
        const currentState = this.gameStates.get(sessionId);
        if (!currentState) return undefined;

        const updatedState = { ...currentState, ...updates };
        this.gameStates.set(sessionId, updatedState);
        return updatedState;
    }

    // 플레이어 상태 가져오기
    static getPlayerState(sessionId: string, playerId: string): PlayerState | undefined {
        const gameState = this.gameStates.get(sessionId);
        return gameState?.players.find(player => player.id === playerId);
    }

    // 플레이어 상태 업데이트
    static updatePlayerState(sessionId: string, playerId: string, updates: Partial<PlayerState>): PlayerState | undefined {
        const gameState = this.gameStates.get(sessionId);
        if (!gameState) return undefined;

        const playerIndex = gameState.players.findIndex(player => player.id === playerId);
        if (playerIndex === -1) return undefined;

        gameState.players[playerIndex] = { ...gameState.players[playerIndex], ...updates };
        this.gameStates.set(sessionId, gameState);
        return gameState.players[playerIndex];
    }

    // 맵 데이터 생성
    static async generateMapData(sessionId: string): Promise<MapData> {
        try {
            const regions = await GameDataUpdateService.getRegions();
            const enemies = await GameDataUpdateService.getEnemies();

            // 적군 배치 (임시 로직)
            const enemyPlacements = regions.map(region => ({
                regionId: region.regionId,
                enemies: [
                    { type: 'rebel', count: Math.floor(Math.random() * 3) + 1 },
                    { type: 'invader', count: Math.floor(Math.random() * 2) }
                ]
            }));

            // 망루 정보 (임시)
            const watchtowers = regions.slice(0, 3).map(region => ({
                regionId: region.regionId,
                isActive: Math.random() > 0.5
            }));

            return {
                sessionId,
                regions,
                enemies: enemyPlacements,
                watchtowers
            };

        } catch (error) {
            console.error('맵 데이터 생성 오류:', error);
            throw error;
        }
    }

    // 턴 변경
    static changeTurn(sessionId: string): GameState | undefined {
        const gameState = this.gameStates.get(sessionId);
        if (!gameState) return undefined;

        const currentPlayerIndex = gameState.players.findIndex(player => player.id === gameState.currentTurn);
        const nextPlayerIndex = (currentPlayerIndex + 1) % gameState.players.length;
        const nextPlayer = gameState.players[nextPlayerIndex];

        // 현재 플레이어의 턴 상태 해제
        gameState.players[currentPlayerIndex].isCurrentTurn = false;
        gameState.players[currentPlayerIndex].actionPoints = 0;

        // 다음 플레이어의 턴 상태 설정
        gameState.players[nextPlayerIndex].isCurrentTurn = true;
        gameState.players[nextPlayerIndex].actionPoints = gameState.players[nextPlayerIndex].maxActionPoints;

        gameState.currentTurn = nextPlayer.id;
        gameState.turnNumber++;

        this.gameStates.set(sessionId, gameState);
        return gameState;
    }

    // 게임 상태 정리
    static cleanupGameState(sessionId: string): void {
        this.gameStates.delete(sessionId);
    }
} 
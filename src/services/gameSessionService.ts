import { GameSession, IGameSession, IPlayer } from '../models/gameSession.model';
import crypto from 'crypto';

export class GameSessionService {
    // 세션 ID 생성
    static generateSessionId(): string {
        return crypto.randomBytes(4).toString('hex').toUpperCase();
    }

    // 게임 세션 생성
    static async createGameSession(data: {
        gameName: string;
        maxPlayers: number;
        isPrivate: boolean;
        password?: string;
        hostPlayer: {
            playerId: string;
            playerName: string;
        };
    }): Promise<IGameSession> {
        try {
            // 세션 ID 중복 확인
            let sessionId = '';
            let isUnique = false;
            
            while (!isUnique) {
                sessionId = this.generateSessionId();
                const existingSession = await GameSession.findOne({ sessionId });
                if (!existingSession) {
                    isUnique = true;
                }
            }

            // 호스트 플레이어 생성
            const hostPlayer: IPlayer = {
                playerId: data.hostPlayer.playerId,
                playerName: data.hostPlayer.playerName,
                joinedAt: new Date(),
                isHost: true
            };

            // 게임 세션 생성
            const gameSession = new GameSession({
                sessionId,
                gameName: data.gameName,
                maxPlayers: data.maxPlayers,
                currentPlayers: 1,
                isPrivate: data.isPrivate,
                password: data.isPrivate ? data.password : undefined,
                status: 'waiting',
                players: [hostPlayer]
            });

            const savedSession = await gameSession.save();
            console.log(`✅ 게임 세션 생성 완료: ${sessionId!}`);
            
            return savedSession;
        } catch (error) {
            console.error('❌ 게임 세션 생성 오류:', error);
            throw error;
        }
    }

    // 게임 세션 조회
    static async getGameSession(sessionId: string): Promise<IGameSession | null> {
        try {
            const session = await GameSession.findOne({ sessionId });
            return session;
        } catch (error) {
            console.error('게임 세션 조회 오류:', error);
            throw error;
        }
    }

    // 활성 게임 세션 목록 조회
    static async getActiveSessions(): Promise<IGameSession[]> {
        try {
            const sessions = await GameSession.find({
                status: { $in: ['waiting', 'playing'] }
            }).sort({ createdAt: -1 });
            
            return sessions;
        } catch (error) {
            console.error('활성 세션 조회 오류:', error);
            throw error;
        }
    }

    // 플레이어 추가
    static async addPlayer(sessionId: string, playerData: {
        playerId: string;
        playerName: string;
        password?: string;
    }): Promise<IGameSession> {
        try {
            const session = await GameSession.findOne({ sessionId });
            
            if (!session) {
                throw new Error('게임 세션을 찾을 수 없습니다.');
            }

            if (session.status !== 'waiting') {
                throw new Error('게임이 이미 시작되었습니다.');
            }

            if (session.currentPlayers >= session.maxPlayers) {
                throw new Error('게임이 가득 찼습니다.');
            }

            // 비공개 게임인 경우 비밀번호 확인
            if (session.isPrivate && session.password !== playerData.password) {
                throw new Error('비밀번호가 올바르지 않습니다.');
            }

            // 플레이어가 이미 참여 중인지 확인
            const existingPlayer = session.players.find(p => p.playerId === playerData.playerId);
            if (existingPlayer) {
                throw new Error('이미 참여 중인 플레이어입니다.');
            }

            // 새 플레이어 추가
            const newPlayer: IPlayer = {
                playerId: playerData.playerId,
                playerName: playerData.playerName,
                joinedAt: new Date(),
                isHost: false
            };

            session.players.push(newPlayer);
            session.currentPlayers = session.players.length;
            
            const updatedSession = await session.save();
            console.log(`✅ 플레이어 추가 완료: ${playerData.playerName} -> ${sessionId}`);
            
            return updatedSession;
        } catch (error) {
            console.error('플레이어 추가 오류:', error);
            throw error;
        }
    }

    // 플레이어 제거
    static async removePlayer(sessionId: string, playerId: string): Promise<IGameSession> {
        try {
            const session = await GameSession.findOne({ sessionId });
            
            if (!session) {
                throw new Error('게임 세션을 찾을 수 없습니다.');
            }

            const playerIndex = session.players.findIndex(p => p.playerId === playerId);
            if (playerIndex === -1) {
                throw new Error('플레이어를 찾을 수 없습니다.');
            }

            const removedPlayer = session.players[playerIndex];
            session.players.splice(playerIndex, 1);
            session.currentPlayers = session.players.length;

            // 호스트가 나간 경우 새로운 호스트 지정
            if (removedPlayer.isHost && session.players.length > 0) {
                session.players[0].isHost = true;
            }

            // 플레이어가 없으면 세션 삭제
            if (session.players.length === 0) {
                await GameSession.deleteOne({ sessionId });
                console.log(`🗑️ 빈 게임 세션 삭제: ${sessionId}`);
                return session;
            }

            const updatedSession = await session.save();
            console.log(`✅ 플레이어 제거 완료: ${removedPlayer.playerName} -> ${sessionId}`);
            
            return updatedSession;
        } catch (error) {
            console.error('플레이어 제거 오류:', error);
            throw error;
        }
    }

    // 게임 시작
    static async startGame(sessionId: string, hostPlayerId: string): Promise<IGameSession> {
        try {
            const session = await GameSession.findOne({ sessionId });
            
            if (!session) {
                throw new Error('게임 세션을 찾을 수 없습니다.');
            }

            const hostPlayer = session.players.find(p => p.playerId === hostPlayerId && p.isHost);
            if (!hostPlayer) {
                throw new Error('호스트만 게임을 시작할 수 있습니다.');
            }

            if (session.status !== 'waiting') {
                throw new Error('게임이 이미 시작되었습니다.');
            }

            if (session.currentPlayers < 2) {
                throw new Error('최소 2명의 플레이어가 필요합니다.');
            }

            session.status = 'playing';
            const updatedSession = await session.save();
            
            console.log(`🎮 게임 시작: ${sessionId}`);
            return updatedSession;
        } catch (error) {
            console.error('게임 시작 오류:', error);
            throw error;
        }
    }

    // 게임 종료
    static async endGame(sessionId: string, status: 'finished' | 'cancelled' = 'finished'): Promise<IGameSession> {
        try {
            const session = await GameSession.findOne({ sessionId });
            
            if (!session) {
                throw new Error('게임 세션을 찾을 수 없습니다.');
            }

            session.status = status;
            const updatedSession = await session.save();
            
            console.log(`🏁 게임 종료: ${sessionId} (${status})`);
            return updatedSession;
        } catch (error) {
            console.error('게임 종료 오류:', error);
            throw error;
        }
    }

    // 오래된 세션 정리 (24시간 이상 된 대기 중인 세션)
    static async cleanupOldSessions(): Promise<void> {
        try {
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            
            const result = await GameSession.deleteMany({
                status: 'waiting',
                createdAt: { $lt: oneDayAgo }
            });
            
            if (result.deletedCount > 0) {
                console.log(`🧹 오래된 세션 정리 완료: ${result.deletedCount}개`);
            }
        } catch (error) {
            console.error('세션 정리 오류:', error);
        }
    }
} 
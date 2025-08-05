import { Request, Response } from 'express';
import { GameDataUpdateService } from '../services/gameDataUpdateService';
import { GameSessionService } from '../services/gameSessionService';
import crypto from 'crypto';

export class GameController {
    // 게임 데이터 가져오기
    static async getGameData(req: Request, res: Response) {
        try {
            const gameData = await GameDataUpdateService.getGameData();
            res.json({
                success: true,
                data: gameData
            });
        } catch (error) {
            console.error('게임 데이터 조회 오류:', error);
            res.status(500).json({
                success: false,
                message: '게임 데이터를 가져오는데 실패했습니다.'
            });
        }
    }

    // 캐릭터 데이터 가져오기
    static async getCharacters(req: Request, res: Response) {
        try {
            const characters = await GameDataUpdateService.getCharacters();
            res.json({
                success: true,
                data: characters
            });
        } catch (error) {
            console.error('캐릭터 데이터 조회 오류:', error);
            res.status(500).json({
                success: false,
                message: '캐릭터 데이터를 가져오는데 실패했습니다.'
            });
        }
    }

    // 적 데이터 가져오기
    static async getEnemies(req: Request, res: Response) {
        try {
            const enemies = await GameDataUpdateService.getEnemies();
            res.json({
                success: true,
                data: enemies
            });
        } catch (error) {
            console.error('적 데이터 조회 오류:', error);
            res.status(500).json({
                success: false,
                message: '적 데이터를 가져오는데 실패했습니다.'
            });
        }
    }

    // 지역 데이터 가져오기
    static async getRegions(req: Request, res: Response) {
        try {
            const regions = await GameDataUpdateService.getRegions();
            res.json({
                success: true,
                data: regions
            });
        } catch (error) {
            console.error('지역 데이터 조회 오류:', error);
            res.status(500).json({
                success: false,
                message: '지역 데이터를 가져오는데 실패했습니다.'
            });
        }
    }

    // 카드 데이터 가져오기
    static async getCards(req: Request, res: Response) {
        try {
            const cards = await GameDataUpdateService.getCards();
            res.json({
                success: true,
                data: cards
            });
        } catch (error) {
            console.error('카드 데이터 조회 오류:', error);
            res.status(500).json({
                success: false,
                message: '카드 데이터를 가져오는데 실패했습니다.'
            });
        }
    }

    // 게임 규칙 가져오기
    static async getGameRules(req: Request, res: Response) {
        try {
            const rules = await GameDataUpdateService.getGameRules();
            res.json({
                success: true,
                data: rules
            });
        } catch (error) {
            console.error('게임 규칙 조회 오류:', error);
            res.status(500).json({
                success: false,
                message: '게임 규칙을 가져오는데 실패했습니다.'
            });
        }
    }

    // 게임 세션 생성
    static async createGameSession(req: Request, res: Response) {
        try {
            const { gameName, maxPlayers, isPrivate, password, hostPlayer } = req.body;

            // 입력 검증
            if (!gameName || gameName.trim().length < 1 || gameName.length > 50) {
                return res.status(400).json({
                    success: false,
                    message: '게임 이름은 1-50자 사이여야 합니다.'
                });
            }

            if (!maxPlayers || maxPlayers < 2 || maxPlayers > 8) {
                return res.status(400).json({
                    success: false,
                    message: '최대 플레이어 수는 2-8명 사이여야 합니다.'
                });
            }

            if (isPrivate && (!password || password.length < 4 || password.length > 20)) {
                return res.status(400).json({
                    success: false,
                    message: '비공개 게임의 비밀번호는 4-20자 사이여야 합니다.'
                });
            }

            if (!hostPlayer || !hostPlayer.playerName || hostPlayer.playerName.trim().length < 2) {
                return res.status(400).json({
                    success: false,
                    message: '호스트 플레이어 이름은 2자 이상이어야 합니다.'
                });
            }

            // 호스트 플레이어 ID 생성
            const playerId = crypto.randomBytes(8).toString('hex');

            // 게임 세션 생성
            const session = await GameSessionService.createGameSession({
                gameName: gameName.trim(),
                maxPlayers,
                isPrivate: Boolean(isPrivate),
                password: isPrivate ? password : undefined,
                hostPlayer: {
                    playerId,
                    playerName: hostPlayer.playerName.trim()
                }
            });

            res.status(201).json({
                success: true,
                message: '게임 세션이 성공적으로 생성되었습니다.',
                data: {
                    sessionId: session.sessionId,
                    gameName: session.gameName,
                    maxPlayers: session.maxPlayers,
                    currentPlayers: session.currentPlayers,
                    isPrivate: session.isPrivate,
                    status: session.status,
                    hostPlayer: {
                        playerId: session.players[0].playerId,
                        playerName: session.players[0].playerName
                    },
                    createdAt: session.createdAt
                }
            });
        } catch (error) {
            console.error('게임 세션 생성 오류:', error);
            res.status(500).json({
                success: false,
                message: '게임 세션 생성에 실패했습니다.'
            });
        }
    }

    // 게임 세션 조회
    static async getGameSession(req: Request, res: Response) {
        try {
            const { gameCode } = req.params;
            
            if (!gameCode || gameCode.length !== 8) {
                return res.status(400).json({
                    success: false,
                    message: '유효하지 않은 게임 코드입니다.'
                });
            }

            const session = await GameSessionService.getGameSession(gameCode);
            
            if (!session) {
                return res.status(404).json({
                    success: false,
                    message: '게임 세션을 찾을 수 없습니다.'
                });
            }

            res.json({
                success: true,
                data: {
                    sessionId: session.sessionId,
                    gameName: session.gameName,
                    maxPlayers: session.maxPlayers,
                    currentPlayers: session.currentPlayers,
                    isPrivate: session.isPrivate,
                    status: session.status,
                    players: session.players.map(player => ({
                        playerId: player.playerId,
                        playerName: player.playerName,
                        isHost: player.isHost,
                        joinedAt: player.joinedAt
                    })),
                    createdAt: session.createdAt,
                    updatedAt: session.updatedAt
                }
            });
        } catch (error) {
            console.error('게임 세션 조회 오류:', error);
            res.status(500).json({
                success: false,
                message: '게임 세션 조회에 실패했습니다.'
            });
        }
    }

    // 플레이어 추가
    static async addPlayer(req: Request, res: Response) {
        try {
            const { gameCode } = req.params;
            const { playerName, password } = req.body;

            if (!gameCode || gameCode.length !== 8) {
                return res.status(400).json({
                    success: false,
                    message: '유효하지 않은 게임 코드입니다.'
                });
            }

            if (!playerName || playerName.trim().length < 2 || playerName.length > 20) {
                return res.status(400).json({
                    success: false,
                    message: '플레이어 이름은 2-20자 사이여야 합니다.'
                });
            }

            // 플레이어 ID 생성
            const playerId = crypto.randomBytes(8).toString('hex');

            const session = await GameSessionService.addPlayer(gameCode, {
                playerId,
                playerName: playerName.trim(),
                password
            });

            res.json({
                success: true,
                message: '플레이어가 성공적으로 추가되었습니다.',
                data: {
                    sessionId: session.sessionId,
                    playerId,
                    playerName: playerName.trim(),
                    currentPlayers: session.currentPlayers,
                    maxPlayers: session.maxPlayers
                }
            });
        } catch (error) {
            console.error('플레이어 추가 오류:', error);
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : '플레이어 추가에 실패했습니다.'
            });
        }
    }

    // 게임 시작
    static async startGame(req: Request, res: Response) {
        try {
            const { gameCode } = req.params;
            const { hostPlayerId } = req.body;

            if (!gameCode || gameCode.length !== 8) {
                return res.status(400).json({
                    success: false,
                    message: '유효하지 않은 게임 코드입니다.'
                });
            }

            if (!hostPlayerId) {
                return res.status(400).json({
                    success: false,
                    message: '호스트 플레이어 ID가 필요합니다.'
                });
            }

            const session = await GameSessionService.startGame(gameCode, hostPlayerId);

            res.json({
                success: true,
                message: '게임이 성공적으로 시작되었습니다.',
                data: {
                    sessionId: session.sessionId,
                    status: session.status,
                    players: session.players.map(player => ({
                        playerId: player.playerId,
                        playerName: player.playerName,
                        isHost: player.isHost
                    }))
                }
            });
        } catch (error) {
            console.error('게임 시작 오류:', error);
            res.status(400).json({
                success: false,
                message: error instanceof Error ? error.message : '게임 시작에 실패했습니다.'
            });
        }
    }

    // 플레이어 이동 (임시 구현)
    static async movePlayer(req: Request, res: Response) {
        try {
            res.json({
                success: true,
                message: '플레이어 이동 기능은 아직 구현되지 않았습니다.'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: '플레이어 이동에 실패했습니다.'
            });
        }
    }

    // 전투 수행 (임시 구현)
    static async performCombat(req: Request, res: Response) {
        try {
            res.json({
                success: true,
                message: '전투 수행 기능은 아직 구현되지 않았습니다.'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: '전투 수행에 실패했습니다.'
            });
        }
    }

    // 망루 건설 (임시 구현)
    static async buildWatchtower(req: Request, res: Response) {
        try {
            res.json({
                success: true,
                message: '망루 건설 기능은 아직 구현되지 않았습니다.'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: '망루 건설에 실패했습니다.'
            });
        }
    }

    // 카드 뽑기 (임시 구현)
    static async drawCards(req: Request, res: Response) {
        try {
            res.json({
                success: true,
                message: '카드 뽑기 기능은 아직 구현되지 않았습니다.'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: '카드 뽑기에 실패했습니다.'
            });
        }
    }

    // 턴 종료 (임시 구현)
    static async endTurn(req: Request, res: Response) {
        try {
            res.json({
                success: true,
                message: '턴 종료 기능은 아직 구현되지 않았습니다.'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: '턴 종료에 실패했습니다.'
            });
        }
    }

    // 활성 세션 조회
    static async getActiveSessions(req: Request, res: Response) {
        try {
            const sessions = await GameSessionService.getActiveSessions();

            res.json({
                success: true,
                data: sessions.map(session => ({
                    sessionId: session.sessionId,
                    gameName: session.gameName,
                    maxPlayers: session.maxPlayers,
                    currentPlayers: session.currentPlayers,
                    isPrivate: session.isPrivate,
                    status: session.status,
                    hostPlayer: session.players.find(p => p.isHost) ? {
                        playerName: session.players.find(p => p.isHost)!.playerName
                    } : null,
                    createdAt: session.createdAt
                }))
            });
        } catch (error) {
            console.error('활성 세션 조회 오류:', error);
            res.status(500).json({
                success: false,
                message: '활성 세션 조회에 실패했습니다.'
            });
        }
    }
} 
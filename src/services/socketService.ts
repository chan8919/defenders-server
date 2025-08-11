import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
import { GameSessionService } from './gameSessionService';
import { GameSession } from '../models/gameSession.model';
import { GameStateService } from './gameStateService';

interface ConnectedPlayer {
    socketId: string;
    playerId: string;
    playerName: string;
    sessionId: string;
    isHost: boolean;
}

export class SocketService {
    private io: SocketIOServer;
    private connectedPlayers: Map<string, ConnectedPlayer> = new Map(); // socketId -> player info
    private sessionPlayers: Map<string, Set<string>> = new Map(); // sessionId -> Set of socketIds

    constructor(server: HTTPServer) {
        this.io = new SocketIOServer(server, {
            cors: {
                origin: '*',
                methods: ['GET', 'POST']
            }
        });

        this.setupSocketHandlers();
    }

    private setupSocketHandlers(): void {
        this.io.on('connection', (socket) => {
            console.log(`🔌 클라이언트 연결: ${socket.id}`);

            // 게임 세션 참가
            socket.on('join-game-session', async (data: {
                sessionId: string;
                playerId: string;
                playerName: string;
                isHost?: boolean;
            }) => {
                try {
                    console.log(`🎮 게임 세션 참가 요청: ${data.sessionId} - ${data.playerName}`);
                    
                    // 세션 존재 확인
                    const session = await GameSessionService.getGameSession(data.sessionId);
                    if (!session) {
                        socket.emit('error', { message: '게임 세션이 존재하지 않습니다.' });
                        return;
                    }

                    // 세션이 대기 중인지 확인
                    if (session.status !== 'waiting') {
                        socket.emit('error', { message: '이미 시작된 게임입니다.' });
                        return;
                    }

                    // 플레이어가 세션에 참가되어 있는지 확인
                    const playerInSession = session.players.find(p => p.playerId === data.playerId);
                    if (!playerInSession) {
                        socket.emit('error', { message: '세션에 참가되지 않은 플레이어입니다.' });
                        return;
                    }

                    // 소켓을 게임 세션 룸에 참가
                    socket.join(data.sessionId);
                    
                    // 연결된 플레이어 정보 저장
                    const connectedPlayer: ConnectedPlayer = {
                        socketId: socket.id,
                        playerId: data.playerId,
                        playerName: data.playerName,
                        sessionId: data.sessionId,
                        isHost: data.isHost || false
                    };
                    
                    this.connectedPlayers.set(socket.id, connectedPlayer);
                    
                    // 세션별 플레이어 목록 관리
                    if (!this.sessionPlayers.has(data.sessionId)) {
                        this.sessionPlayers.set(data.sessionId, new Set());
                    }
                    this.sessionPlayers.get(data.sessionId)!.add(socket.id);

                    console.log(`✅ 플레이어 ${data.playerName}이(가) 세션 ${data.sessionId}에 참가했습니다.`);
                    
                    // 세션의 모든 플레이어에게 참가 알림
                    this.io.to(data.sessionId).emit('player-joined', {
                        playerId: data.playerId,
                        playerName: data.playerName,
                        isHost: data.isHost || false,
                        sessionId: data.sessionId
                    });

                    // 현재 세션 정보 전송
                    socket.emit('session-info', {
                        sessionId: data.sessionId,
                        gameName: session.gameName,
                        maxPlayers: session.maxPlayers,
                        currentPlayers: session.currentPlayers,
                        players: session.players,
                        status: session.status
                    });

                } catch (error) {
                    console.error('❌ 게임 세션 참가 오류:', error);
                    socket.emit('error', { message: '게임 세션 참가에 실패했습니다.' });
                }
            });

            // 게임 시작 요청 (호스트만 가능)
            socket.on('start-game', async (data: { sessionId: string; playerId: string }) => {
                try {
                    const connectedPlayer = this.connectedPlayers.get(socket.id);
                    if (!connectedPlayer || connectedPlayer.sessionId !== data.sessionId) {
                        socket.emit('error', { message: '유효하지 않은 요청입니다.' });
                        return;
                    }

                    if (!connectedPlayer.isHost) {
                        socket.emit('error', { message: '호스트만 게임을 시작할 수 있습니다.' });
                        return;
                    }

                    console.log(`🚀 게임 시작 요청: ${data.sessionId}`);
                    
                    // 게임 시작 처리
                    const updatedSession = await GameSessionService.startGame(data.sessionId, data.playerId);
                    
                    // 모든 플레이어에게 게임 시작 알림
                    this.io.to(data.sessionId).emit('game-started', {
                        sessionId: data.sessionId,
                        gameData: updatedSession.gameData
                    });

                    console.log(`✅ 게임 ${data.sessionId}이(가) 시작되었습니다.`);

                } catch (error) {
                    console.error('❌ 게임 시작 오류:', error);
                    socket.emit('error', { message: '게임 시작에 실패했습니다.' });
                }
            });

            // 게임 액션 처리 (이동, 전투, 건설 등)
            socket.on('game-action', async (data: {
                sessionId: string;
                actionType: string;
                actionData: any;
            }) => {
                try {
                    const connectedPlayer = this.connectedPlayers.get(socket.id);
                    if (!connectedPlayer || connectedPlayer.sessionId !== data.sessionId) {
                        socket.emit('error', { message: '유효하지 않은 요청입니다.' });
                        return;
                    }

                    console.log(`🎯 게임 액션: ${data.actionType} - ${data.sessionId}`);
                    
                    // 특정 액션 타입에 따른 처리
                    switch (data.actionType) {
                        case 'request-game-state':
                            await this.handleGameStateRequest(socket, data.sessionId, connectedPlayer);
                            break;
                        case 'request-map-data':
                            await this.handleMapDataRequest(socket, data.sessionId, connectedPlayer);
                            break;
                        case 'request-player-info':
                            await this.handlePlayerInfoRequest(socket, data.sessionId, connectedPlayer);
                            break;
                        default:
                            // 기타 게임 액션 처리 로직 (추후 구현)
                            // 예: 이동, 전투, 건설 등
                            
                            // 모든 플레이어에게 액션 결과 전송
                            this.io.to(data.sessionId).emit('game-action-result', {
                                actionType: data.actionType,
                                actionData: data.actionData,
                                playerId: connectedPlayer.playerId,
                                playerName: connectedPlayer.playerName
                            });
                    }

                } catch (error) {
                    console.error('❌ 게임 액션 오류:', error);
                    socket.emit('error', { message: '게임 액션 처리에 실패했습니다.' });
                }
            });

            // 연결 해제 처리
            socket.on('disconnect', () => {
                console.log(`🔌 클라이언트 연결 해제: ${socket.id}`);
                this.handlePlayerDisconnect(socket.id);
            });
        });
    }

    private handlePlayerDisconnect(socketId: string): void {
        const connectedPlayer = this.connectedPlayers.get(socketId);
        if (!connectedPlayer) {
            return;
        }

        const { sessionId, playerName } = connectedPlayer;
        
        // 세션에서 플레이어 제거
        if (this.sessionPlayers.has(sessionId)) {
            this.sessionPlayers.get(sessionId)!.delete(socketId);
            
            // 세션에 플레이어가 없으면 세션 맵에서 제거
            if (this.sessionPlayers.get(sessionId)!.size === 0) {
                this.sessionPlayers.delete(sessionId);
            }
        }

        // 연결된 플레이어 목록에서 제거
        this.connectedPlayers.delete(socketId);

        // 소켓 룸에서 나가기 (이미 disconnect 이벤트에서 자동으로 처리됨)

        console.log(`👋 플레이어 ${playerName}이(가) 세션 ${sessionId}에서 나갔습니다.`);

        // 세션의 다른 플레이어들에게 플레이어 퇴장 알림
        this.io.to(sessionId).emit('player-left', {
            playerId: connectedPlayer.playerId,
            playerName: connectedPlayer.playerName,
            sessionId: sessionId
        });
    }

    // 특정 세션의 모든 플레이어에게 메시지 전송
    public sendToSession(sessionId: string, event: string, data: any): void {
        this.io.to(sessionId).emit(event, data);
    }

    // 특정 플레이어에게 메시지 전송
    public sendToPlayer(socketId: string, event: string, data: any): void {
        const socket = this.io.sockets.sockets.get(socketId);
        if (socket) {
            socket.emit(event, data);
        }
    }

    // 연결된 플레이어 정보 조회
    public getConnectedPlayer(socketId: string): ConnectedPlayer | undefined {
        return this.connectedPlayers.get(socketId);
    }

    // 세션의 연결된 플레이어 목록 조회
    public getSessionPlayers(sessionId: string): ConnectedPlayer[] {
        const socketIds = this.sessionPlayers.get(sessionId);
        if (!socketIds) return [];
        
        return Array.from(socketIds)
            .map(socketId => this.connectedPlayers.get(socketId))
            .filter(player => player !== undefined) as ConnectedPlayer[];
    }

    // 게임 상태 요청 처리
    private async handleGameStateRequest(socket: any, sessionId: string, connectedPlayer: ConnectedPlayer): Promise<void> {
        try {
            let gameState = GameStateService.getGameState(sessionId);
            
            // 게임 상태가 없으면 초기화
            if (!gameState) {
                gameState = await GameStateService.initializeGameState(sessionId);
            }

            // API 문서에 맞는 응답 형식
            socket.emit('game_state_updated', {
                sessionId: sessionId,
                players: gameState.players.map(player => ({
                    id: player.id,
                    name: player.name,
                    currentRegion: player.currentRegion,
                    actionPoints: player.actionPoints,
                    maxActionPoints: player.maxActionPoints,
                    isCurrentTurn: player.isCurrentTurn,
                    informationCards: player.informationCards,
                    regionCards: player.regionCards
                })),
                currentTurn: gameState.currentTurn,
                gamePhase: gameState.gamePhase,
                turnNumber: gameState.turnNumber
            });

            console.log(`✅ 게임 상태 응답 전송: ${sessionId}`);

        } catch (error) {
            console.error('❌ 게임 상태 요청 처리 오류:', error);
            socket.emit('error', { message: '게임 상태를 가져오는데 실패했습니다.' });
        }
    }

    // 맵 데이터 요청 처리
    private async handleMapDataRequest(socket: any, sessionId: string, connectedPlayer: ConnectedPlayer): Promise<void> {
        try {
            const mapData = await GameStateService.generateMapData(sessionId);

            // API 문서에 맞는 응답 형식
            socket.emit('map_data', {
                sessionId: sessionId,
                regions: mapData.regions,
                enemies: mapData.enemies,
                watchtowers: mapData.watchtowers
            });

            console.log(`✅ 맵 데이터 응답 전송: ${sessionId}`);

        } catch (error) {
            console.error('❌ 맵 데이터 요청 처리 오류:', error);
            socket.emit('error', { message: '맵 데이터를 가져오는데 실패했습니다.' });
        }
    }

    // 플레이어 정보 요청 처리
    private async handlePlayerInfoRequest(socket: any, sessionId: string, connectedPlayer: ConnectedPlayer): Promise<void> {
        try {
            const playerState = GameStateService.getPlayerState(sessionId, connectedPlayer.playerId);
            
            if (!playerState) {
                // 플레이어 상태가 없으면 게임 상태 초기화 후 다시 시도
                await GameStateService.initializeGameState(sessionId);
                const updatedPlayerState = GameStateService.getPlayerState(sessionId, connectedPlayer.playerId);
                
                if (!updatedPlayerState) {
                    socket.emit('error', { message: '플레이어 정보를 찾을 수 없습니다.' });
                    return;
                }
            }

            const finalPlayerState = playerState || GameStateService.getPlayerState(sessionId, connectedPlayer.playerId)!;

            // API 문서에 맞는 응답 형식
            socket.emit('player_info', {
                sessionId: sessionId,
                playerId: connectedPlayer.playerId,
                playerName: connectedPlayer.playerName,
                currentRegion: finalPlayerState.currentRegion,
                actionPoints: finalPlayerState.actionPoints,
                maxActionPoints: finalPlayerState.maxActionPoints,
                isCurrentTurn: finalPlayerState.isCurrentTurn,
                informationCards: finalPlayerState.informationCards,
                regionCards: finalPlayerState.regionCards
            });

            console.log(`✅ 플레이어 정보 응답 전송: ${sessionId} - ${connectedPlayer.playerName}`);

        } catch (error) {
            console.error('❌ 플레이어 정보 요청 처리 오류:', error);
            socket.emit('error', { message: '플레이어 정보를 가져오는데 실패했습니다.' });
        }
    }
} 
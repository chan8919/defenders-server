import { Router } from 'express';
import { GameController } from '../controllers/gameController';

const router = Router();

// 게임 데이터 API
router.get('/game-data', GameController.getGameData);
router.get('/characters', GameController.getCharacters);
router.get('/enemies', GameController.getEnemies);
router.get('/regions', GameController.getRegions);
router.get('/cards', GameController.getCards);
router.get('/rules', GameController.getGameRules);

// 게임 세션 관리 (임시)
router.post('/sessions', GameController.createGameSession);
router.get('/sessions/:gameCode', GameController.getGameSession);
router.post('/sessions/:gameCode/players', GameController.addPlayer);
router.post('/sessions/:gameCode/start', GameController.startGame);

// 게임 플레이 (임시)
router.post('/sessions/:gameCode/move', GameController.movePlayer);
router.post('/sessions/:gameCode/combat', GameController.performCombat);
router.post('/sessions/:gameCode/watchtower', GameController.buildWatchtower);
router.post('/sessions/:gameCode/draw', GameController.drawCards);
router.post('/sessions/:gameCode/end-turn', GameController.endTurn);

// 활성 세션 조회
router.get('/sessions', GameController.getActiveSessions);

export default router; 
import { GameConfig } from '../models/gameConfig.model';
import { gameConfig, GAME_DATA_VERSION } from '../gameConfigData';

export class GameDataUpdateService {
    // 데이터베이스에서 현재 게임 설정 가져오기
    static async getCurrentGameConfig() {
        try {
            const config = await GameConfig.findOne().sort({ createdAt: -1 });
            return config;
        } catch (error) {
            console.error('게임 설정 조회 오류:', error);
            return null;
        }
    }

    // 버전 비교
    static compareVersions(version1: string, version2: string): number {
        const v1 = version1.split('.').map(Number);
        const v2 = version2.split('.').map(Number);
        
        for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
            const num1 = v1[i] || 0;
            const num2 = v2[i] || 0;
            
            if (num1 > num2) return 1;
            if (num1 < num2) return -1;
        }
        
        return 0;
    }

    // 게임 데이터 업데이트
    static async updateGameData() {
        try {
            console.log('🔄 게임 데이터 업데이트 확인 중...');
            
            // 현재 데이터베이스의 게임 설정 가져오기
            const currentConfig = await this.getCurrentGameConfig();
            
            if (!currentConfig) {
                console.log('📝 데이터베이스에 게임 설정이 없습니다. 초기 데이터를 생성합니다.');
                await this.createInitialGameData();
                return;
            }
            
            // 버전 비교
            const versionComparison = this.compareVersions(GAME_DATA_VERSION, currentConfig.gameVersion);
            
            if (versionComparison > 0) {
                console.log(`🆕 새로운 게임 데이터 버전 발견: ${GAME_DATA_VERSION} (현재: ${currentConfig.gameVersion})`);
                console.log('📝 게임 데이터를 업데이트합니다...');
                
                await this.createInitialGameData();
                console.log('✅ 게임 데이터 업데이트 완료');
            } else {
                console.log(`✅ 게임 데이터가 최신 버전입니다: ${currentConfig.gameVersion}`);
            }
            
        } catch (error) {
            console.error('❌ 게임 데이터 업데이트 오류:', error);
        }
    }

    // 초기 게임 데이터 생성
    static async createInitialGameData() {
        try {
            const newGameConfig = new GameConfig({
                gameName: gameConfig.gameName,
                gameDescription: gameConfig.gameDescription,
                gameVersion: gameConfig.gameVersion,
                gameRules: gameConfig.gameRules,
                gameAssets: gameConfig.gameAssets
            });
            
            await newGameConfig.save();
            console.log('✅ 초기 게임 데이터가 성공적으로 생성되었습니다.');
            
        } catch (error) {
            console.error('❌ 초기 게임 데이터 생성 오류:', error);
            throw error;
        }
    }

    // 게임 데이터 가져오기 (실제 게임에서 사용)
    static async getGameData() {
        try {
            const config = await GameConfig.findOne().sort({ createdAt: -1 });
            if (!config) {
                throw new Error('게임 데이터를 찾을 수 없습니다.');
            }
            return config;
        } catch (error) {
            console.error('게임 데이터 조회 오류:', error);
            throw error;
        }
    }

    // 특정 게임 데이터 가져오기
    static async getCharacters() {
        const gameData = await this.getGameData();
        return gameData.gameAssets.characters;
    }

    static async getEnemies() {
        const gameData = await this.getGameData();
        return gameData.gameAssets.enemies;
    }

    static async getRegions() {
        const gameData = await this.getGameData();
        return gameData.gameAssets.regions;
    }

    static async getCards() {
        const gameData = await this.getGameData();
        return gameData.gameAssets.turnCards;
    }

    static async getGameRules() {
        const gameData = await this.getGameData();
        return gameData.gameRules;
    }
} 
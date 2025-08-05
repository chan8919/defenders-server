import { Request, Response, NextFunction } from 'express';

export class ValidationMiddleware {
    // 게임 코드 검증
    static validateGameCode(req: Request, res: Response, next: NextFunction) {
        const { gameCode } = req.params;
        
        if (!gameCode || gameCode.length < 4) {
            return res.status(400).json({
                success: false,
                message: '유효하지 않은 게임 코드입니다.'
            });
        }
        
        next();
    }

    // 플레이어 정보 검증
    static validatePlayerInfo(req: Request, res: Response, next: NextFunction) {
        const { playerName, character } = req.body;
        
        if (!playerName || playerName.length < 2) {
            return res.status(400).json({
                success: false,
                message: '플레이어 이름은 2자 이상이어야 합니다.'
            });
        }
        
        if (!character) {
            return res.status(400).json({
                success: false,
                message: '캐릭터를 선택해야 합니다.'
            });
        }
        
        next();
    }

    // 이동 액션 검증
    static validateMoveAction(req: Request, res: Response, next: NextFunction) {
        const { targetRegionId } = req.body;
        
        if (!targetRegionId) {
            return res.status(400).json({
                success: false,
                message: '목표 지역을 지정해야 합니다.'
            });
        }
        
        next();
    }

    // 전투 액션 검증
    static validateCombatAction(req: Request, res: Response, next: NextFunction) {
        const { enemyType } = req.body;
        
        if (!enemyType) {
            return res.status(400).json({
                success: false,
                message: '적 타입을 지정해야 합니다.'
            });
        }
        
        next();
    }

    // 망루 건설 액션 검증
    static validateWatchtowerAction(req: Request, res: Response, next: NextFunction) {
        const { cardId } = req.body;
        
        if (!cardId) {
            return res.status(400).json({
                success: false,
                message: '카드 ID를 지정해야 합니다.'
            });
        }
        
        next();
    }

    // 카드 뽑기 액션 검증
    static validateDrawAction(req: Request, res: Response, next: NextFunction) {
        const { count } = req.body;
        
        if (count && (count < 1 || count > 5)) {
            return res.status(400).json({
                success: false,
                message: '카드 뽑기 개수는 1-5개 사이여야 합니다.'
            });
        }
        
        next();
    }
} 
import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { connectDB } from './config/db';
import gameRoutes from './routes/gameRoutes';
import { ErrorMiddleware } from './middleware/errorMiddleware';
import { SocketService } from './services/socketService';
import { GameDataUpdateService } from './services/gameDataUpdateService';

const app = express();
const server = createServer(app);
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || 'localhost';

// 미들웨어
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS 설정
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// 라우트
app.use('/api/game', gameRoutes);

app.get('/', (_req, res) => {
  res.send('Welcome to the Pandemic Board Game Server!');
});

// 에러 핸들링 미들웨어
app.use(ErrorMiddleware.notFound);
app.use(ErrorMiddleware.errorHandler);

// Socket.io 서비스 초기화
const socketService = new SocketService(server);

// 서버 시작
const startServer = async () => {
  try {
    await connectDB();
    
    // 게임 데이터 업데이트 확인
    await GameDataUpdateService.updateGameData();
    
    server.listen(PORT, () => {
      console.log('='.repeat(60));
      console.log('🎮 Pandemic Board Game Server');
      console.log('='.repeat(60));
      console.log(`📡 HTTP Server: http://${HOST}:${PORT}`);
      console.log(`🔌 Socket.io Server: http://${HOST}:${PORT}`);
      console.log(`🌐 Game API: http://${HOST}:${PORT}/api/game`);
      console.log(`📊 Game Data: http://${HOST}:${PORT}/api/game/game-data`);
      console.log(`📋 Active Sessions: http://${HOST}:${PORT}/api/game/sessions`);
      console.log('='.repeat(60));
      console.log('✅ Server is running successfully!');
      console.log('🔗 Ready for client connections');
      console.log('='.repeat(60));
    });
  } catch (error) {
    console.error('❌ 서버 시작 실패:', error);
    process.exit(1);
  }
};

startServer();
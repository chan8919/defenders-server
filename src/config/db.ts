import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/pandemic-board-game';
        await mongoose.connect(mongoUri);
        console.log('✅ Connected to MongoDB');
        console.log(`📊 Database: ${mongoUri}`);
    } catch (error) {
        console.error('❌ Error connecting to MongoDB:', error);
        console.log('💡 MongoDB가 실행 중인지 확인하세요.');
        console.log('💡 또는 MONGO_URI 환경 변수를 설정하세요.');
        console.log('🔄 MongoDB 없이 개발 모드로 실행합니다...');
        
        // 개발 모드에서는 MongoDB 없이도 실행
        if (process.env.NODE_ENV === 'development') {
            console.log('✅ Development mode - MongoDB connection skipped');
            return;
        }
        
        process.exit(1);
    }
};
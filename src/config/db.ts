import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const mongoUri = 'mongodb://localhost:27017/DefendersDB';
        console.log(`🔗 Attempting to connect to MongoDB: ${mongoUri}`);
        
        await mongoose.connect(mongoUri, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
        });
        
        console.log('✅ Connected to MongoDB successfully!');
        console.log(`📊 Database: ${mongoUri}`);
        
        // 연결 테스트
        if (mongoose.connection.db) {
            const adminDb = mongoose.connection.db.admin();
            const result = await adminDb.ping();
            console.log('🏓 MongoDB ping test:', result);
        }
        
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
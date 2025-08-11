# Socket.io API 문서

## 개요
게임 세션 기반의 실시간 통신을 위한 Socket.io API입니다. 플레이어가 게임 세션에 참가하면 해당 세션의 소켓 룸에 연결되고, 게임에서 나갈 때 연결이 해제됩니다.

## 연결 정보
- **서버 주소**: `http://localhost:3000`
- **프로토콜**: Socket.io

## 클라이언트 연결 예시
```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');
```

## 이벤트 목록

### 클라이언트 → 서버 이벤트

#### 1. 게임 세션 참가
```javascript
socket.emit('join-game-session', {
    sessionId: '884AB3DB',        // 게임 세션 ID
    playerId: 'player123',         // 플레이어 ID
    playerName: '플레이어1',        // 플레이어 이름
    isHost: true                   // 호스트 여부 (선택사항)
});
```

#### 2. 게임 시작 요청 (호스트만 가능)
```javascript
socket.emit('start-game', {
    sessionId: '884AB3DB',        // 게임 세션 ID
    playerId: 'player123'          // 호스트 플레이어 ID
});
```

#### 3. 게임 액션
```javascript
socket.emit('game-action', {
    sessionId: '884AB3DB',        // 게임 세션 ID
    actionType: 'move',            // 액션 타입 (move, combat, build 등)
    actionData: {                  // 액션 데이터
        regionId: '1',
        // 기타 액션별 데이터
    }
});
```

#### 4. 게임 상태 요청
```javascript
socket.emit('request-game-state', {
    sessionId: '884AB3DB',        // 게임 세션 ID
    playerId: 'player123'          // 플레이어 ID
});
```

#### 5. 맵 데이터 요청
```javascript
socket.emit('request-map-data', {
    sessionId: '884AB3DB',        // 게임 세션 ID
    playerId: 'player123'          // 플레이어 ID
});
```

#### 6. 플레이어 정보 요청
```javascript
socket.emit('request-player-info', {
    sessionId: '884AB3DB',        // 게임 세션 ID
    playerId: 'player123'          // 플레이어 ID
});
```

### 서버 → 클라이언트 이벤트

#### 1. 에러 메시지
```javascript
socket.on('error', (data) => {
    console.log('에러:', data.message);
    // data.message: 에러 메시지
});
```

#### 2. 세션 정보
```javascript
socket.on('session-info', (data) => {
    console.log('세션 정보:', data);
    // data: {
    //     sessionId: '884AB3DB',
    //     gameName: '테스트 게임',
    //     maxPlayers: 4,
    //     currentPlayers: 2,
    //     players: [...],
    //     status: 'waiting'
    // }
});
```

#### 3. 플레이어 참가 알림
```javascript
socket.on('player-joined', (data) => {
    console.log('플레이어 참가:', data);
    // data: {
    //     playerId: 'player123',
    //     playerName: '플레이어1',
    //     isHost: true,
    //     sessionId: '884AB3DB'
    // }
});
```

#### 4. 플레이어 퇴장 알림
```javascript
socket.on('player-left', (data) => {
    console.log('플레이어 퇴장:', data);
    // data: {
    //     playerId: 'player123',
    //     playerName: '플레이어1',
    //     sessionId: '884AB3DB'
    // }
});
```

#### 5. 게임 시작 알림
```javascript
socket.on('game-started', (data) => {
    console.log('게임 시작:', data);
    // data: {
    //     sessionId: '884AB3DB',
    //     gameData: { ... }  // 게임 초기 데이터
    // }
});
```

#### 6. 게임 액션 결과
```javascript
socket.on('game-action-result', (data) => {
    console.log('게임 액션 결과:', data);
    // data: {
    //     actionType: 'move',
    //     actionData: { ... },
    //     playerId: 'player123',
    //     playerName: '플레이어1'
    // }
});
```

#### 7. 게임 상태 업데이트
```javascript
socket.on('game_state_updated', (data) => {
    console.log('게임 상태 업데이트:', data);
    // data: {
    //     sessionId: '884AB3DB',
    //     players: [...],           // 플레이어 목록
    //     currentTurn: 'player123', // 현재 턴 플레이어
    //     gamePhase: 'playing',     // 게임 단계
    //     turnNumber: 3             // 현재 턴 번호
    // }
});
```

#### 8. 맵 데이터 응답
```javascript
socket.on('map_data', (data) => {
    console.log('맵 데이터:', data);
    // data: {
    //     sessionId: '884AB3DB',
    //     regions: [...],           // 지역 정보
    //     enemies: [...],           // 적군 배치 정보
    //     watchtowers: [...]        // 망루 정보
    // }
});
```

#### 9. 플레이어 정보 응답
```javascript
socket.on('player_info', (data) => {
    console.log('플레이어 정보:', data);
    // data: {
    //     sessionId: '884AB3DB',
    //     playerId: 'player123',
    //     playerName: '플레이어1',
    //     currentRegion: '1',
    //     actionPoints: 5,
    //     maxActionPoints: 5,
    //     isCurrentTurn: true,
    //     informationCards: {
    //         rebel: 2,
    //         invader: 1,
    //         outlaw: 0
    //     },
    //     regionCards: [...]
    // }
});
```

#### 10. 턴 변경 알림
```javascript
socket.on('turn-changed', (data) => {
    console.log('턴 변경:', data);
    // data: {
    //     sessionId: '884AB3DB',
    //     previousPlayer: 'player123',
    //     currentPlayer: 'player456',
    //     turnNumber: 4
    // }
});
```

#### 11. 플레이어 이동 알림
```javascript
socket.on('player-moved', (data) => {
    console.log('플레이어 이동:', data);
    // data: {
    //     sessionId: '884AB3DB',
    //     playerId: 'player123',
    //     playerName: '플레이어1',
    //     fromRegion: '1',
    //     toRegion: '2',
    //     actionPointsSpent: 1
    // }
});
```

#### 12. 액션 포인트 변경 알림
```javascript
socket.on('action-points-changed', (data) => {
    console.log('액션 포인트 변경:', data);
    // data: {
    //     sessionId: '884AB3DB',
    //     playerId: 'player123',
    //     actionPoints: 4,
    //     maxActionPoints: 5,
    //     reason: 'move' // 변경 이유
    // }
});
```

#### 13. 망루 건설 알림
```javascript
socket.on('watchtower-built', (data) => {
    console.log('망루 건설:', data);
    // data: {
    //     sessionId: '884AB3DB',
    //     playerId: 'player123',
    //     playerName: '플레이어1',
    //     regionId: '1',
    //     regionName: '브라이우드'
    // }
});
```

#### 14. 전투 결과 알림
```javascript
socket.on('combat-result', (data) => {
    console.log('전투 결과:', data);
    // data: {
    //     sessionId: '884AB3DB',
    //     playerId: 'player123',
    //     playerName: '플레이어1',
    //     regionId: '1',
    //     enemyType: 'rebel',
    //     enemyCount: 1,
    //     result: 'success' // success 또는 failure
    // }
});
```

#### 15. 카드 뽑기 알림
```javascript
socket.on('cards-drawn', (data) => {
    console.log('카드 뽑기:', data);
    // data: {
    //     sessionId: '884AB3DB',
    //     playerId: 'player123',
    //     playerName: '플레이어1',
    //     drawnCards: [
    //         { id: 'card_2', regionId: '2', regionName: '스톤헤이븐' },
    //         { id: 'card_4', regionId: '4', regionName: '그레인할로우' }
    //     ],
    //     newActionPoints: 5
    // }
});
```

## 게임 플레이 플로우

### 1. 게임 세션 생성 (HTTP API)
```javascript
// 1. HTTP API로 게임 세션 생성
const response = await fetch('http://localhost:3000/api/game/sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        gameName: '테스트 게임',
        maxPlayers: 4,
        isPrivate: false,
        hostPlayer: { playerName: '호스트' }
    })
});

const sessionData = await response.json();
const sessionId = sessionData.data.sessionId;
const playerId = sessionData.data.hostPlayer.playerId;
```

### 2. 소켓 연결 및 게임 세션 참가
```javascript
// 2. Socket.io 연결
const socket = io('http://localhost:3000');

// 3. 게임 세션에 참가
socket.emit('join-game-session', {
    sessionId: sessionId,
    playerId: playerId,
    playerName: '호스트',
    isHost: true
});

// 4. 세션 정보 수신
socket.on('session-info', (data) => {
    console.log('세션 정보 수신:', data);
});
```

### 3. 다른 플레이어 참가
```javascript
// 다른 플레이어가 참가할 때
socket.on('player-joined', (data) => {
    console.log('새 플레이어 참가:', data.playerName);
    // UI 업데이트: 플레이어 목록 갱신
});
```

### 4. 게임 시작
```javascript
// 호스트가 게임 시작
socket.emit('start-game', {
    sessionId: sessionId,
    playerId: playerId
});

// 모든 플레이어가 게임 시작 알림 수신
socket.on('game-started', (data) => {
    console.log('게임 시작!');
    // 게임 화면으로 전환
    // 게임 데이터로 초기화
});
```

### 5. 게임 플레이
```javascript
// 플레이어 액션 전송
socket.emit('game-action', {
    sessionId: sessionId,
    actionType: 'move',
    actionData: {
        regionId: '1',
        playerId: playerId
    }
});

// 액션 결과 수신
socket.on('game-action-result', (data) => {
    console.log('액션 결과:', data);
    // 게임 상태 업데이트
});
```

## 연결 해제
```javascript
// 페이지를 떠나거나 게임을 종료할 때
socket.disconnect();
```

## 주의사항

1. **세션 참가 전 확인사항**:
   - 게임 세션이 존재하는지 확인
   - 세션이 대기 중 상태인지 확인
   - 플레이어가 세션에 참가되어 있는지 확인

2. **권한 확인**:
   - 게임 시작은 호스트만 가능
   - 게임 액션은 세션에 참가한 플레이어만 가능

3. **연결 관리**:
   - 페이지를 떠날 때 자동으로 연결 해제
   - 네트워크 오류 시 자동 재연결 시도

4. **동시 게임 세션**:
   - 여러 게임 세션이 동시에 실행 가능
   - 각 세션은 독립적인 소켓 룸으로 관리
   - 플레이어는 한 번에 하나의 세션에만 참가 가능 
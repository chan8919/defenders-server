# Pandemic Board Game API 문서

## 게임 세션 관리 API

### 1. 게임 세션 생성
**POST** `/api/game/sessions`

게임 세션을 생성합니다.

#### 요청 본문
```json
{
  "gameName": "우리들의 전쟁",
  "maxPlayers": 4,
  "isPrivate": true,
  "password": "1234",
  "hostPlayer": {
    "playerName": "플레이어1"
  }
}
```

#### 필드 설명
- `gameName` (string, 필수): 게임 이름 (1-50자)
- `maxPlayers` (number, 필수): 최대 플레이어 수 (2-8명)
- `isPrivate` (boolean, 필수): 비공개 게임 여부
- `password` (string, 선택): 비공개 게임일 때 비밀번호 (4-20자)
- `hostPlayer.playerName` (string, 필수): 호스트 플레이어 이름 (2자 이상)

#### 응답 예시
```json
{
  "success": true,
  "message": "게임 세션이 성공적으로 생성되었습니다.",
  "data": {
    "sessionId": "A1B2C3D4",
    "gameName": "우리들의 전쟁",
    "maxPlayers": 4,
    "currentPlayers": 1,
    "isPrivate": true,
    "status": "waiting",
    "hostPlayer": {
      "playerId": "abc123def456",
      "playerName": "플레이어1"
    },
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 2. 게임 세션 조회
**GET** `/api/game/sessions/:gameCode`

특정 게임 세션의 정보를 조회합니다.

#### 경로 매개변수
- `gameCode` (string): 8자리 게임 코드

#### 응답 예시
```json
{
  "success": true,
  "data": {
    "sessionId": "A1B2C3D4",
    "gameName": "우리들의 전쟁",
    "maxPlayers": 4,
    "currentPlayers": 2,
    "isPrivate": true,
    "status": "waiting",
    "players": [
      {
        "playerId": "abc123def456",
        "playerName": "플레이어1",
        "isHost": true,
        "joinedAt": "2024-01-15T10:30:00.000Z"
      },
      {
        "playerId": "def456ghi789",
        "playerName": "플레이어2",
        "isHost": false,
        "joinedAt": "2024-01-15T10:35:00.000Z"
      }
    ],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:35:00.000Z"
  }
}
```

### 3. 플레이어 추가
**POST** `/api/game/sessions/:gameCode/players`

게임 세션에 플레이어를 추가합니다.

#### 경로 매개변수
- `gameCode` (string): 8자리 게임 코드

#### 요청 본문
```json
{
  "playerName": "플레이어2",
  "password": "1234"
}
```

#### 필드 설명
- `playerName` (string, 필수): 플레이어 이름 (2-20자)
- `password` (string, 선택): 비공개 게임일 때 비밀번호

#### 응답 예시
```json
{
  "success": true,
  "message": "플레이어가 성공적으로 추가되었습니다.",
  "data": {
    "sessionId": "A1B2C3D4",
    "playerId": "def456ghi789",
    "playerName": "플레이어2",
    "currentPlayers": 2,
    "maxPlayers": 4
  }
}
```

### 4. 게임 시작
**POST** `/api/game/sessions/:gameCode/start`

게임을 시작합니다.

#### 경로 매개변수
- `gameCode` (string): 8자리 게임 코드

#### 요청 본문
```json
{
  "hostPlayerId": "abc123def456"
}
```

#### 필드 설명
- `hostPlayerId` (string, 필수): 호스트 플레이어 ID

#### 응답 예시
```json
{
  "success": true,
  "message": "게임이 성공적으로 시작되었습니다.",
  "data": {
    "sessionId": "A1B2C3D4",
    "status": "playing",
    "players": [
      {
        "playerId": "abc123def456",
        "playerName": "플레이어1",
        "isHost": true
      },
      {
        "playerId": "def456ghi789",
        "playerName": "플레이어2",
        "isHost": false
      }
    ]
  }
}
```

### 5. 활성 세션 목록 조회
**GET** `/api/game/sessions`

현재 활성 상태인 게임 세션 목록을 조회합니다.

#### 응답 예시
```json
{
  "success": true,
  "data": [
    {
      "sessionId": "A1B2C3D4",
      "gameName": "우리들의 전쟁",
      "maxPlayers": 4,
      "currentPlayers": 2,
      "isPrivate": true,
      "status": "waiting",
      "hostPlayer": {
        "playerName": "플레이어1"
      },
      "createdAt": "2024-01-15T10:30:00.000Z"
    },
    {
      "sessionId": "E5F6G7H8",
      "gameName": "전략 게임",
      "maxPlayers": 6,
      "currentPlayers": 3,
      "isPrivate": false,
      "status": "waiting",
      "hostPlayer": {
        "playerName": "게임마스터"
      },
      "createdAt": "2024-01-15T09:15:00.000Z"
    }
  ]
}
```

## 게임 데이터 API

### 6. 전체 게임 데이터 조회
**GET** `/api/game/game-data`

게임에 필요한 모든 데이터를 조회합니다.

### 7. 캐릭터 데이터 조회
**GET** `/api/game/characters`

게임 캐릭터 정보를 조회합니다.

### 8. 적 데이터 조회
**GET** `/api/game/enemies`

게임 적 정보를 조회합니다.

### 9. 지역 데이터 조회
**GET** `/api/game/regions`

게임 지역 정보를 조회합니다.

### 10. 카드 데이터 조회
**GET** `/api/game/cards`

게임 카드 정보를 조회합니다.

### 11. 게임 규칙 조회
**GET** `/api/game/rules`

게임 규칙 정보를 조회합니다.

## 에러 응답

모든 API는 에러 발생 시 다음과 같은 형식으로 응답합니다:

```json
{
  "success": false,
  "message": "에러 메시지"
}
```

## 상태 코드

- `200`: 성공
- `201`: 생성 성공
- `400`: 잘못된 요청
- `404`: 리소스를 찾을 수 없음
- `500`: 서버 내부 오류 
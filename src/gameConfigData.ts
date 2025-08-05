import { IRegion, IEnemyType, ICharacter, TCardType, TEnemy } from './models/gameConfig.model';

// 게임 데이터 버전
export const GAME_DATA_VERSION = '1.0.0';

// 캐릭터 데이터
export const characters: ICharacter[] = [
    {
        characterId: 'char_1',
        name: '기마병',
        description: '한번의 행동으로 두 칸 이동 가능한 기마병',
        abilities: '이동 행동을 할 때 두 칸까지 이동할 수 있습니다.'
    },
    {
        characterId: 'char_2',
        name: '정예병',
        description: '한번에 마을의 적을 전부 제거할 수 있는 정예병',
        abilities: '전투 행동을 할 때 해당 지역의 모든 적을 제거할 수 있습니다.'
    },
    {
        characterId: 'char_3',
        name: '첩보병',
        description: '근처에 적이 새로 생성되지 못하게 하는 첩보병',
        abilities: '해당 지역과 연결된 지역에 적이 출현하지 않도록 합니다.'
    },
    {
        characterId: 'char_4',
        name: '지휘관',
        description: '팀원을 본인의 자리로 부를 수 있는 지휘관',
        abilities: '다른 플레이어를 자신의 위치로 이동시킬 수 있습니다.'
    }
];

// 지역 데이터
export const regions: IRegion[] = [
    {
        regionId: '1',
        regionName: '브라이우드',
        regionDescription: '고용한 숲속 마을입니다.',
        regionImageUrl: '',
        x: 80, y: 60, radius: 8, color: '#4ade80',
        connectedRegions: ['2', '6']
    },
    {
        regionId: '2',
        regionName: '스톤헤이븐',
        regionDescription: '바위 절벽 근처 항구 마을입니다.',
        regionImageUrl: '',
        x: 180, y: 80, radius: 8, color: '#4ade80',
        connectedRegions: ['1', '3']
    },
    {
        regionId: '3',
        regionName: '에덴브룩',
        regionDescription: '낙원 같은 계곡과 시냇물이 흐르는 마을입니다.',
        regionImageUrl: '',
        x: 280, y: 50, radius: 8, color: '#4ade80',
        connectedRegions: ['2', '4', '8']
    },
    {
        regionId: '4',
        regionName: '그레인할로우',
        regionDescription: '곡식이 자라는 넓은 평야 마을입니다.',
        regionImageUrl: '',
        x: 380, y: 70, radius: 8, color: '#4ade80',
        connectedRegions: ['3', '5']
    },
    {
        regionId: '5',
        regionName: '델름리스',
        regionDescription: '습지대와 연못이 많은 마을입니다.',
        regionImageUrl: '',
        x: 480, y: 90, radius: 8, color: '#4ade80',
        connectedRegions: ['4', '10']
    },
    {
        regionId: '6',
        regionName: '하이로크',
        regionDescription: '산악 고지대 요새 마을입니다.',
        regionImageUrl: '',
        x: 120, y: 140, radius: 8, color: '#4ade80',
        connectedRegions: ['1', '7']
    },
    {
        regionId: '7',
        regionName: '카르모라',
        regionDescription: '광산이 번창한 고산 지대 마을입니다.',
        regionImageUrl: '',
        x: 220, y: 160, radius: 8, color: '#4ade80',
        connectedRegions: ['6', '8', '12']
    },
    {
        regionId: '8',
        regionName: '드라켄리치',
        regionDescription: '용의 전설이 내려오는 고산 마을입니다.',
        regionImageUrl: '',
        x: 320, y: 130, radius: 8, color: '#4ade80',
        connectedRegions: ['3', '7', '9', '13']
    },
    {
        regionId: '9',
        regionName: '윈드그라스',
        regionDescription: '바람이 센 고원지대의 목초지 마을입니다.',
        regionImageUrl: '',
        x: 420, y: 150, radius: 8, color: '#4ade80',
        connectedRegions: ['8', '10']
    },
    {
        regionId: '10',
        regionName: '레드스파인',
        regionDescription: '붉은 산맥 기슭의 전초 마을입니다.',
        regionImageUrl: '',
        x: 520, y: 170, radius: 8, color: '#4ade80',
        connectedRegions: ['5', '9', '15']
    },
    {
        regionId: '11',
        regionName: '페인헐름',
        regionDescription: '과거 전쟁터였던 마을입니다.',
        regionImageUrl: '',
        x: 90, y: 220, radius: 8, color: '#4ade80',
        connectedRegions: ['12', '16']
    },
    {
        regionId: '12',
        regionName: '크레이번',
        regionDescription: '대장간과 무기 제작으로 유명한 마을입니다.',
        regionImageUrl: '',
        x: 190, y: 240, radius: 8, color: '#4ade80',
        connectedRegions: ['7', '11', '13', '17']
    },
    {
        regionId: '13',
        regionName: '에버로스',
        regionDescription: '오래된 유적과 수도원이 있는 마을입니다.',
        regionImageUrl: '',
        x: 290, y: 210, radius: 8, color: '#4ade80',
        connectedRegions: ['8', '12', '14']
    },
    {
        regionId: '14',
        regionName: '벨로윈',
        regionDescription: '오래된 가문이 지배하는 마을입니다.',
        regionImageUrl: '',
        x: 390, y: 230, radius: 8, color: '#4ade80',
        connectedRegions: ['13', '15', '19']
    },
    {
        regionId: '15',
        regionName: '그리모어',
        regionDescription: '마법사나 연금술사가 많았던 마을입니다.',
        regionImageUrl: '',
        x: 490, y: 250, radius: 8, color: '#4ade80',
        connectedRegions: ['10', '14', '20']
    },
    {
        regionId: '16',
        regionName: '블랙할로우',
        regionDescription: '안개가 자욱한 음침한 마을입니다.',
        regionImageUrl: '',
        x: 110, y: 300, radius: 8, color: '#4ade80',
        connectedRegions: ['11', '17']
    },
    {
        regionId: '17',
        regionName: '섀도우펠',
        regionDescription: '실종 사건이 잦은 으스스한 마을입니다.',
        regionImageUrl: '',
        x: 210, y: 320, radius: 8, color: '#4ade80',
        connectedRegions: ['12', '16', '18']
    },
    {
        regionId: '18',
        regionName: '모어그렌',
        regionDescription: '오래된 저주가 있다는 전설의 마을입니다.',
        regionImageUrl: '',
        x: 310, y: 290, radius: 8, color: '#4ade80',
        connectedRegions: ['17', '19']
    },
    {
        regionId: '19',
        regionName: '다스크랜치',
        regionDescription: '해질녘이 유난히 오래 머무는 마을입니다.',
        regionImageUrl: '',
        x: 410, y: 310, radius: 8, color: '#4ade80',
        connectedRegions: ['14', '18']
    },
    {
        regionId: '20',
        regionName: '레일로렌',
        regionDescription: '옛 요정 숲의 경계에 있는 마을입니다.',
        regionImageUrl: '',
        x: 510, y: 330, radius: 8, color: '#4ade80',
        connectedRegions: ['15']
    }
];

export const enemies: IEnemyType[] = [
    {
        enemyId:'1',
        name:'Rebels',
        description:'나라를 무너뜨리려는 반란군입니다.',
    },
    {
        enemyId:'2',
        name:'invaders',
        description:'외국에서 나라를 침략하려는 침략자들입니다.',
    },
    {
        enemyId:'3',
        name:'Outlaws',
        description:'무법자들은 세상이 혼란스러워지기를 원합니다.',
    }
];


// 카드 데이터 생성 함수
export const createCards = () => {
    const cards = [];
    
    // 캐릭터 카드
    characters.forEach(char => {
        cards.push({
            cardId: char.characterId,
            CardName: char.name,
            cardType: 'Character' as TCardType,
            description: char.description,
            cardImageUrl: '',
            AppearEnemyType: 'Rebels' as TEnemy,
            region: regions[0], // 기본 지역
            descriptionDetail: char.abilities
        });
    });
    
    // 지역 카드
    regions.forEach(region => {
        enemies.forEach(enemy => {
            cards.push({
                cardId: `region_${region.regionId}_${enemy.enemyId}`,
                CardName: `${region.regionName} - ${enemy.name}`,
                cardType: 'Region' as TCardType,
                description: `${region.regionName}에서 ${enemy.name} 출현`,
                cardImageUrl: '',
                AppearEnemyType: enemy.name,
                region: region,
                descriptionDetail: `${region.regionDescription} 이 지역에서 ${enemy.description}`
            });
        });
    });
    
    // 이벤트 카드
    const eventCards = [
        {
            cardId: 'event_1',
            CardName: '수비군 편성',
            cardType: 'Chaos' as TCardType,
            description: '적이 나타난 지역 중 한 곳에 더 이상 적이 나타나지 않도록 한다',
            cardImageUrl: '',
            AppearEnemyType: 'Rebels' as TEnemy,
            region: regions[0],
            descriptionDetail: '선택한 지역에 더 이상 적이 출현하지 않도록 합니다.'
        },
        {
            cardId: 'event_2',
            CardName: '긴급 예산 편성',
            cardType: 'Chaos' as TCardType,
            description: '아무 위치에나 망루를 하나 건설한다',
            cardImageUrl: '',
            AppearEnemyType: 'invaders' as TEnemy,
            region: regions[0],
            descriptionDetail: '선택한 지역에 망루를 즉시 건설합니다.'
        },
        {
            cardId: 'event_3',
            CardName: '첩보',
            cardType: 'Chaos' as TCardType,
            description: '다음에 적이 나타날 위치 네 곳을 순서대로 확인할 수 있다',
            cardImageUrl: '',
            AppearEnemyType: 'Outlaws' as TEnemy,
            region: regions[0],
            descriptionDetail: '다음에 적이 출현할 지역 4곳을 순서대로 확인할 수 있습니다.'
        }
    ];
    
    cards.push(...eventCards);
    
    return cards;
};

// 전체 게임 데이터
export const gameConfig = {
    gameName: 'Pandemic Board Game',
    gameDescription: '중세 테마의 협력형 보드게임',
    gameVersion: GAME_DATA_VERSION,
    gameRules: {
        maxPlayers: 4,
        minPlayers: 2,
        chaosApperance: [3, 6, 9, 12, 15, 18]
    },
    gameAssets: {
        characters: characters,
        enemies: enemies,
        regions: regions,
        turnCards: createCards()
    }
};

/*
 자연/지형 기반
브라이우드(Bryewood) – 고요한 숲속 마을

스톤헤이븐(Stonehaven) – 바위 절벽 근처 항구 마을

에덴브룩(Edenbrook) – 낙원 같은 계곡과 시냇물이 흐르는 마을

그레인할로우(Grainhollow) – 곡식이 자라는 넓은 평야 마을

델름리스(Delmrice) – 습지대와 연못이 많은 마을

⛰️ 고지대/산악 느낌
하이로크(Highrock) – 산악 고지대 요새 마을

카르모라(Carmora) – 광산이 번창한 고산 지대 마을

드라켄리치(Drakenlitch) – 용의 전설이 내려오는 고산 마을

윈드그라스(Windgrass) – 바람이 센 고원지대의 목초지 마을

레드스파인(Redspine) – 붉은 산맥 기슭의 전초 마을

🏰 문화/역사 기반
페인헐름(Painhelm) – 과거 전쟁터였던 마을

크레이번(Crayburn) – 대장간과 무기 제작으로 유명한 마을

에버로스(Everross) – 오래된 유적과 수도원이 있는 마을

벨로윈(Bellowyn) – 오래된 가문이 지배하는 마을

그리모어(Grimoire) – 마법사나 연금술사가 많았던 마을

🌧️ 신비/어두운 분위기
블랙할로우(Blackhollow) – 안개가 자욱한 음침한 마을

섀도우펠(Shadowfell) – 실종 사건이 잦은 으스스한 마을

모어그렌(Morgren) – 오래된 저주가 있다는 전설의 마을

다스크랜치(Duskranch) – 해질녘이 유난히 오래 머무는 마을

레일로렌(Railoren) – 옛 요정 숲의 경계에 있는 마을


*/
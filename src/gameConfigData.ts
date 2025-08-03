import { IRegion, IEnemyType } from './models/gameConfig.model.js';

export const regions: IRegion[] = [
    {
        regionId:'1',
        regionName:'브라이우드',
        regionDescription:'고용한 숲속 마을입니다.',
        regionImageUrl:'',
    },
    {
        regionId:'2',
        regionName:'스톤헤이븐',
        regionDescription:'바위 절벽 근처 항구 마을입니다.',
        regionImageUrl:'',
    },
    {
        regionId:'3',
        regionName:'에덴브룩',
        regionDescription:'낙원 같은 계곡과 시냇물이 흐르는 마을입니다.',
        regionImageUrl:'',
    },
    {
        regionId:'4',
        regionName:'그레인할로우',
        regionDescription:'곡식이 자라는 넓은 평야 마을입니다.',
        regionImageUrl:'',
    },
    {
        regionId:'5',
        regionName:'델름리스',
        regionDescription:'습지대와 연못이 많은 마을입니다.',
        regionImageUrl:'',
    },
    {
        regionId:'6',
        regionName:'하이로크',
        regionDescription:'산악 고지대 요새 마을입니다.',
        regionImageUrl:'',
    },
    {
        regionId:'7',
        regionName:'카르모라',
        regionDescription:'광산이 번창한 고산 지대 마을입니다.',
        regionImageUrl:'',
    },
    {
        regionId:'8',
        regionName:'드라켄리치',
        regionDescription:'용의 전설이 내려오는 고산 마을입니다.',
        regionImageUrl:'',
    },
            {
        regionId:'9',
        regionName:'윈드그라스',
        regionDescription:'바람이 센 고원지대의 목초지 마을입니다.',
        regionImageUrl:'',
    },
    {
        regionId:'10',
        regionName:'레드스파인',
        regionDescription:'붉은 산맥 기슭의 전초 마을입니다.',
        regionImageUrl:'',
    },
    {
        regionId:'11',
        regionName:'페인헐름',
        regionDescription:'과거 전쟁터였던 마을입니다.',
        regionImageUrl:'',
    },
    {
        regionId:'12',
        regionName:'크레이번',
        regionDescription:'대장간과 무기 제작으로 유명한 마을입니다.',
        regionImageUrl:'',
    },
    {
        regionId:'13',
        regionName:'에버로스',
        regionDescription:'오래된 유적과 수도원이 있는 마을입니다.',
        regionImageUrl:'',
    },
    {
        regionId:'14',
        regionName:'벨로윈',
        regionDescription:'오래된 가문이 지배하는 마을입니다.',
        regionImageUrl:'',
    },
    {
        regionId:'15',
        regionName:'그리모어',
        regionDescription:'마법사나 연금술사가 많았던 마을입니다.',
        regionImageUrl:'',
    },
    {
        regionId:'16',
        regionName:'블랙할로우',
        regionDescription:'안개가 자욱한 음침한 마을입니다.',
        regionImageUrl:'',
    },
    {
        regionId:'17',
        regionName:'섀도우펠',
        regionDescription:'실종 사건이 잦은 으스스한 마을입니다.',
        regionImageUrl:'',
    },
    {
        regionId:'18',
        regionName:'모어그렌',
        regionDescription:'오래된 저주가 있다는 전설의 마을입니다.',
        regionImageUrl:'',
    },
    {
        regionId:'19',
        regionName:'다스크랜치',
        regionDescription:'해질녘이 유난히 오래 머무는 마을입니다.',
        regionImageUrl:'',
    },
        {
        regionId:'20',
        regionName:'레일로렌',
        regionDescription:'옛 요정 숲의 경계에 있는 마을입니다.',
        regionImageUrl:'',
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
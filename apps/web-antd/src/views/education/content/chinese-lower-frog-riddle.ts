import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
export const lowerFrogRiddleSource = {
  sourceUrl: 'https://keben.app/book/0026',
  provider: '第三方原书公开预览',
  checkedAt: '2026-10-01',
  isbn: null,
  editionDate: null,
  printingDate: null,
};
const recognitionRows: Record<string, [string, string, string][]> = {
  'u1-3': [
    ['河', '认字：在河水中找到河字。', '换一个认字语境：在小河中找到河字。'],
    ['晴', '认字：在晴天中找到晴字。', '换一个认字语境：在晴朗中找到晴字。'],
    ['眼', '认字：在眼睛中找到眼字。', '换一个认字语境：在眼光中找到眼字。'],
    [
      '睛',
      '认字：在眼睛中找到睛字。',
      '换一个认字语境：在本题选择睛字中找到睛字。',
    ],
    ['保', '认字：在保护中找到保字。', '换一个认字语境：在保安中找到保字。'],
    ['护', '认字：在保护中找到护字。', '换一个认字语境：在爱护中找到护字。'],
    ['苗', '认字：在禾苗中找到苗字。', '换一个认字语境：在树苗中找到苗字。'],
    ['吃', '认字：在吃饭中找到吃字。', '换一个认字语境：在吃东西中找到吃字。'],
    ['事', '认字：在事情中找到事字。', '换一个认字语境：在好事中找到事字。'],
    ['情', '认字：在心情中找到情字。', '换一个认字语境：在事情中找到情字。'],
    ['请', '认字：在请问中找到请字。', '换一个认字语境：在邀请中找到请字。'],
    ['让', '认字：在让开中找到让字。', '换一个认字语境：在让路中找到让字。'],
  ],
  'u1-4': [
    ['猜', '认字：在猜谜中找到猜字。', '换一个认字语境：在猜想中找到猜字。'],
    ['边', '认字：在左边中找到边字。', '换一个认字语境：在右边中找到边字。'],
    ['凉', '认字：在凉风中找到凉字。', '换一个认字语境：在凉快中找到凉字。'],
    ['喜', '认字：在喜欢中找到喜字。', '换一个认字语境：在喜爱中找到喜字。'],
    ['欢', '认字：在喜欢中找到欢字。', '换一个认字语境：在欢乐中找到欢字。'],
    ['时', '认字：在时间中找到时字。', '换一个认字语境：在及时中找到时字。'],
    ['怕', '认字：在害怕中找到怕字。', '换一个认字语境：在怕冷中找到怕字。'],
    ['攻', '认字：在进攻中找到攻字。', '换一个认字语境：在攻打中找到攻字。'],
    ['令', '认字：在命令中找到令字。', '换一个认字语境：在口令中找到令字。'],
    ['感', '认字：在感动中找到感字。', '换一个认字语境：在感受中找到感字。'],
    ['动', '认字：在感动中找到动字。', '换一个认字语境：在运动中找到动字。'],
    ['万', '认字：在万里中找到万字。', '换一个认字语境：在万一中找到万字。'],
    ['无', '认字：在无云中找到无字。', '换一个认字语境：在无声中找到无字。'],
  ],
};
type Pair = {
  key: string;
  prompts: [string, string];
  values: [string, string];
  labels: string[];
  explanation: string;
  material: string;
};
type Entry = {
  itemId: string;
  title: string;
  pages: number[];
  recognize: string;
  write: string;
  pairs: Pair[];
  steps: Lesson['steps'];
  actual: [string, string][];
  reflections: string[];
};
const entries: Entry[] = [
  {
    itemId: 'u1-3',
    title: '小青蛙',
    pages: [6, 7],
    recognize: '河晴眼睛保护苗吃事情请让',
    write: '青清晴苗请生',
    pairs: [
      {
        key: 'word-0',
        prompts: [
          '第7页填词：眼睛应使用哪个同族字？',
          '换方向：睛与青组成同族字，这里的偏旁名称是哪项？',
        ],
        values: ['睛', '目字旁'],
        labels: ['睛', '目字旁', '青', '不是这些字'],
        explanation:
          '按指定词义区分晴情睛清请；眼睛用睛，其偏旁是目字旁，不因字形相近就互换。',
        material: '先与家长共读对应原书页面，再看本题指定条件。',
      },
      {
        key: 'word-1',
        prompts: [
          '第7页填词：请问应使用哪个同族字？',
          '换方向：请与青组成同族字，这里的偏旁名称是哪项？',
        ],
        values: ['请', '言字旁'],
        labels: ['请', '言字旁', '青', '不是这些字'],
        explanation:
          '按指定词义区分晴情睛清请；请问用请，其偏旁是言字旁，不因字形相近就互换。',
        material: '先与家长共读对应原书页面，再看本题指定条件。',
      },
      {
        key: 'word-2',
        prompts: [
          '第7页填词：清水应使用哪个同族字？',
          '换方向：清与青组成同族字，这里的偏旁名称是哪项？',
        ],
        values: ['清', '三点水'],
        labels: ['清', '三点水', '青', '不是这些字'],
        explanation:
          '按指定词义区分晴情睛清请；清水用清，其偏旁是三点水，不因字形相近就互换。',
        material: '先与家长共读对应原书页面，再看本题指定条件。',
      },
      {
        key: 'word-3',
        prompts: [
          '第7页填词：晴天应使用哪个同族字？',
          '换方向：晴与青组成同族字，这里的偏旁名称是哪项？',
        ],
        values: ['晴', '日字旁'],
        labels: ['晴', '日字旁', '青', '不是这些字'],
        explanation:
          '按指定词义区分晴情睛清请；晴天用晴，其偏旁是日字旁，不因字形相近就互换。',
        material: '先与家长共读对应原书页面，再看本题指定条件。',
      },
      {
        key: 'word-4',
        prompts: [
          '第7页填词：心情应使用哪个同族字？',
          '换方向：情与青组成同族字，这里的偏旁名称是哪项？',
        ],
        values: ['情', '竖心旁'],
        labels: ['情', '竖心旁', '青', '不是这些字'],
        explanation:
          '按指定词义区分晴情睛清请；心情用情，其偏旁是竖心旁，不因字形相近就互换。',
        material: '先与家长共读对应原书页面，再看本题指定条件。',
      },
      {
        key: 'role',
        prompts: [
          '第6页诗中青蛙帮助保护哪项？',
          '换一个信息：课文说青蛙吃的是哪项？',
        ],
        values: ['禾苗', '害虫'],
        labels: ['禾苗', '害虫', '石头'],
        explanation:
          '按原诗信息区分被保护对象与所吃对象，不推广为所有青蛙吃所有虫或能治疗所有植物病害。',
        material: '先与家长共读对应原书页面，再看本题指定条件。',
      },
      {
        key: 'radical',
        prompts: [
          '第7页眼字上方红标的新偏旁名称？',
          '第7页情字上方红标的新偏旁名称？',
        ],
        values: ['目字旁', '竖心旁'],
        labels: ['目字旁', '竖心旁', '提手旁'],
        explanation:
          '原页红标为目、忄；请旁边的书写提示不能当本页新增偏旁清单。',
        material: '先与家长共读对应原书页面，再看本题指定条件。',
      },
      {
        key: 'writing',
        prompts: [
          '只比较青和情，哪字列入本课六会写？',
          '只比较生和眼，哪字列入本课六会写？',
        ],
        values: ['青', '生'],
        labels: ['青', '生', '情', '眼'],
        explanation: '本课六会写青清晴苗请生；会认、同族比较与会写要求分开。',
        material: '先与家长共读对应原书页面，再看本题指定条件。',
      },
    ],
    steps: [
      {
        title: '先共读原书',
        text: '第6—7页选自四川人民出版社《字族文识字读本（第一册）》，有改动；没有个人作者署名。现代全文、原画与声音在原书或合法示范看听，本站提供原创学习组织。',
        activity: '与家长实际共读第6—7页。',
      },
      {
        title: '认字与语境',
        text: '河晴眼睛保护苗吃事情请让十二字按原页会认范围。认字题只看指定字词；读音听标准示范，不用网页选择代替声音判断。',
        activity: '打乱顺序实际指读十二字。',
        visual: {
          kind: 'characters',
          grid: 'tian',
          characters: [
            '河',
            '晴',
            '眼',
            '睛',
            '保',
            '护',
            '苗',
            '吃',
            '事',
            '情',
            '请',
            '让',
          ],
        },
      },
      {
        title: '找课文信息',
        text: '先读原书，再找青蛙所吃的对象与帮助保护的对象。课文的爱护表达可以联系不伤害小动物，不要求靠近水边、捉蛙或喂虫。',
        activity: '说明课文中青蛙做了什么。',
      },
      {
        title: '比较青字族',
        text: '晴情睛清请都含青，但偏旁和词语用途不同。睛用于眼睛、请用于请问、清用于清水、晴用于晴天、情用于心情。不是见到青就任意换用，形旁线索也不是所有字义的完整规则。',
        activity: '用原创词卡按词义选字，再说依据。',
        visual: {
          kind: 'characters',
          grid: 'tian',
          characters: ['青', '晴', '情', '睛', '清', '请'],
        },
      },
      {
        title: '新偏旁与书写提示',
        text: '第7页红标目字旁在眼上、竖心旁在情上。与字中其余部分分开观察；请的言字旁旁注是书写提示，不自动扩充本页新增偏旁。',
        activity: '实际指两个新偏旁，请家长示范名称。',
      },
      {
        title: '六字纸面书写',
        text: '青清晴苗请生是第7页六会写。观察原书范字位置再实际写，青与清、晴、请左右结构分别比较；普通网页字体不是笔顺或描红示范。',
        activity: '实际在纸上写六字，家长看过程。',
        visual: {
          kind: 'characters',
          grid: 'tian',
          characters: ['青', '清', '晴', '苗', '请', '生'],
        },
      },
      {
        title: '朗读与填词',
        text: '原页要求朗读及读字、说发现、填词，没有必做背诵要求。网页填词与实际读字/朗读分开；允许家长帮读。',
        activity: '实际朗读原书，并完成五组纸面词卡。',
      },
      {
        title: '说发现与计划',
        text: '说一个字形或词义发现，记录下一次还想练什么。开放表达没有唯一答案，未来计划不当已经完成。',
        activity: '保留实际发现和下一次计划。',
      },
    ],
    actual: [
      ['read', '实际与家长朗读第6页课文，不要求背诵。'],
      ['recognize', '实际指读河晴眼睛保护苗吃事情请让十二字。'],
      ['info', '实际说明诗中青蛙帮助保护禾苗、吃害虫的信息，不进行捉蛙喂虫。'],
      ['words', '实际用原创卡填写眼睛、请问、清水、晴天、心情并读一读。'],
      ['compare', '实际比较青晴情睛清请，口述自己的字形发现。'],
      ['radical', '实际指第7页目字旁和竖心旁，请家长听名称或示范。'],
      ['write', '按第7页规范示范实际纸面写青清晴苗请生六字。'],
    ],
    reflections: [
      '记录一个字形或词义发现。',
      '记录下一次想练什么，明确这是计划。',
    ],
  },
  {
    itemId: 'u1-4',
    title: '猜字谜',
    pages: [8, 9],
    recognize: '猜边凉喜欢时怕攻令感动万无',
    write: '字红动万无明',
    pairs: [
      {
        key: 'riddle-one',
        prompts: [
          '第8页第一则字谜，左右部件合在一起的谜底？',
          '换一个条件：秋字左边对应哪部分？',
        ],
        values: ['秋', '禾'],
        labels: ['秋', '禾', '火'],
        explanation:
          '按全部提示核对禾与火组成秋，不只凭颜色猜字；凉风联系秋字，不当所有地区季节必然。',
        material: '先与家长共读对应原书页面，再看本题指定条件。',
      },
      {
        key: 'part',
        prompts: ['第8页字谜右边怕水的部件？', '第8页喜欢及时雨的左边部件？'],
        values: ['火', '禾'],
        labels: ['火', '禾', '秋'],
        explanation:
          '原谜线索分别指禾与火，谜语拟人不当植物有人的喜好，也不要求实验灭火。',
        material: '先与家长共读对应原书页面，再看本题指定条件。',
      },
      {
        key: 'add-0',
        prompts: [
          '第9页第二则，青加言字旁对应哪个字？',
          '换方向：第9页请字相对青增加什么？',
        ],
        values: ['请', '言字旁'],
        labels: ['请', '言字旁', '青', '木字旁'],
        explanation:
          '用四个新字的共同部分和不同偏旁验证谜底青，部件组合不是算术加法。',
        material: '先与家长共读对应原书页面，再看本题指定条件。',
      },
      {
        key: 'add-1',
        prompts: [
          '第9页第二则，青加竖心旁对应哪个字？',
          '换方向：第9页情字相对青增加什么？',
        ],
        values: ['情', '竖心旁'],
        labels: ['情', '竖心旁', '青', '木字旁'],
        explanation:
          '用四个新字的共同部分和不同偏旁验证谜底青，部件组合不是算术加法。',
        material: '先与家长共读对应原书页面，再看本题指定条件。',
      },
      {
        key: 'add-2',
        prompts: [
          '第9页第二则，青加日字旁对应哪个字？',
          '换方向：第9页晴字相对青增加什么？',
        ],
        values: ['晴', '日字旁'],
        labels: ['晴', '日字旁', '青', '木字旁'],
        explanation:
          '用四个新字的共同部分和不同偏旁验证谜底青，部件组合不是算术加法。',
        material: '先与家长共读对应原书页面，再看本题指定条件。',
      },
      {
        key: 'add-3',
        prompts: [
          '第9页第二则，青加三点水对应哪个字？',
          '换方向：第9页清字相对青增加什么？',
        ],
        values: ['清', '三点水'],
        labels: ['清', '三点水', '青', '木字旁'],
        explanation:
          '用四个新字的共同部分和不同偏旁验证谜底青，部件组合不是算术加法。',
        material: '先与家长共读对应原书页面，再看本题指定条件。',
      },
      {
        key: 'radical-0',
        prompts: [
          '第9页边上红标新偏旁的名称？',
          '换方向：只比较本页四个新偏旁，哪个字对应走之？',
        ],
        values: ['走之', '边'],
        labels: ['走之', '边', '女字旁', '无此字'],
        explanation:
          '按原页红标辶、又、忄、力分别观察，不用全字或其他旧版清单替代。',
        material: '先与家长共读对应原书页面，再看本题指定条件。',
      },
      {
        key: 'radical-1',
        prompts: [
          '第9页欢上红标新偏旁的名称？',
          '换方向：只比较本页四个新偏旁，哪个字对应又字旁？',
        ],
        values: ['又字旁', '欢'],
        labels: ['又字旁', '欢', '女字旁', '无此字'],
        explanation:
          '按原页红标辶、又、忄、力分别观察，不用全字或其他旧版清单替代。',
        material: '先与家长共读对应原书页面，再看本题指定条件。',
      },
      {
        key: 'radical-2',
        prompts: [
          '第9页怕上红标新偏旁的名称？',
          '换方向：只比较本页四个新偏旁，哪个字对应竖心旁？',
        ],
        values: ['竖心旁', '怕'],
        labels: ['竖心旁', '怕', '女字旁', '无此字'],
        explanation:
          '按原页红标辶、又、忄、力分别观察，不用全字或其他旧版清单替代。',
        material: '先与家长共读对应原书页面，再看本题指定条件。',
      },
      {
        key: 'radical-3',
        prompts: [
          '第9页动上红标新偏旁的名称？',
          '换方向：只比较本页四个新偏旁，哪个字对应力字旁？',
        ],
        values: ['力字旁', '动'],
        labels: ['力字旁', '动', '女字旁', '无此字'],
        explanation:
          '按原页红标辶、又、忄、力分别观察，不用全字或其他旧版清单替代。',
        material: '先与家长共读对应原书页面，再看本题指定条件。',
      },
      {
        key: 'riddle-two',
        prompts: [
          '第9页第二则四种加偏旁提示，共同的谜底是哪字？',
          '换一个验证：青加日字旁对应哪个字？',
        ],
        values: ['青', '晴'],
        labels: ['青', '晴', '情'],
        explanation: '全部提示共同核验青；不能把其中一个加旁后的字当共同谜底。',
        material: '先与家长共读对应原书页面，再看本题指定条件。',
      },
      {
        key: 'writing',
        prompts: [
          '只比较字和猜，哪字是本课会写？',
          '只比较明和怕，哪字是本课会写？',
        ],
        values: ['字', '明'],
        labels: ['字', '明', '猜', '怕'],
        explanation: '会写字红动万无明，猜字得到的青秋不自动加入新增会写清单。',
        material: '先与家长共读对应原书页面，再看本题指定条件。',
      },
    ],
    steps: [
      {
        title: '先读两则字谜',
        text: '第8页脚注由人民教育出版社小学语文室编写，机构编写不当个人作者；现代谜语全文和原画保留外部共读。先读完整两则，再整理提示。',
        activity: '与家长实际共读第8—9页。',
      },
      {
        title: '认字看语境',
        text: '猜边凉喜欢时怕攻令感动万无十三字是新增会认。认字与猜谜得到的其他字分开，不因出现就扩清单。',
        activity: '实际指读十三字。',
        visual: {
          kind: 'characters',
          grid: 'tian',
          characters: [
            '猜',
            '边',
            '凉',
            '喜',
            '欢',
            '时',
            '怕',
            '攻',
            '令',
            '感',
            '动',
            '万',
            '无',
          ],
        },
      },
      {
        title: '第一则逐条验证',
        text: '第一则要求左右组成，左部禾联系雨与植物，右部火联系红与怕水，合成秋，再核对凉风提示。本站解释为解谜组织，不把拟人当真实喜好，不实际玩火或浇火。',
        activity: '纸面摆禾与火，说每条线索怎样验证。',
        visual: {
          kind: 'characters',
          grid: 'tian',
          characters: ['禾', '火', '秋'],
        },
      },
      {
        title: '第二则找共同部分',
        text: '第二则青加言字旁、竖心旁、日字旁、三点水分别联系请情晴清。先比较四个字的共同部分青，再用不同偏旁核对；谜底青与四个组合字分开。',
        activity: '用原创纸卡比较共同部分，按提示添加偏旁。',
        visual: {
          kind: 'characters',
          grid: 'tian',
          characters: ['青', '请', '情', '晴', '清'],
        },
      },
      {
        title: '四个新偏旁',
        text: '第9页红标辶、又、忄、力，分别在边、欢、怕、动上，名称走之、又字旁、竖心旁、力字旁。不是女字旁，新增偏旁与第二谜里出现的其他偏旁分开。',
        activity: '实际指四个新偏旁并说名称。',
        visual: {
          kind: 'characters',
          grid: 'tian',
          characters: ['边', '欢', '怕', '动'],
        },
      },
      {
        title: '六会写与纸面观察',
        text: '字红动万无明为原页六会写，先看原书范字与示范，再实际纸面尝试。秋青等解谜观察字不自动增加会写清单，网页字体不代替笔顺。',
        activity: '实际写六字，家长观察过程。',
        visual: {
          kind: 'characters',
          grid: 'tian',
          characters: ['字', '红', '动', '万', '无', '明'],
        },
      },
      {
        title: '轮流猜字谜',
        text: '原课后要求猜一猜，不增加必做背诵。与家长轮流提供线索、猜测、说明依据；一加一猜一个字未限定组合位置，合理答案可以不同，开放活动不固定唯一字。',
        activity: '实际轮流说与猜，说明自己组合的方法。',
      },
      {
        title: '朗读与表达',
        text: '先实际朗读两则，再说一种猜字方法：找结构、部件、词义线索并逐条验证。合理方法可以不同，网页选择不能自动证明实际朗读或表达。',
        activity: '朗读原书并交流一个解谜方法。',
      },
      {
        title: '记录发现',
        text: '记录一个线索或字形发现及下一次计划。表达由家长代写也可，未来计划不当已经完成。',
        activity: '保留自己的发现与下一次计划。',
      },
    ],
    actual: [
      ['read', '实际朗读第8—9页两则字谜，不要求背诵。'],
      ['recognize', '实际指读猜边凉喜欢时怕攻令感动万无十三字。'],
      ['first', '实际摆禾与火或指原书，说第一谜线索怎样对应秋。'],
      ['second', '实际用原创卡比较请情晴清共同部分青，并添加不同偏旁。'],
      ['radical', '实际指第9页走之、又字旁、竖心旁、力字旁四个红标。'],
      ['write', '按第9页规范示范实际纸面写字红动万无明六字。'],
      ['game', '实际与家长轮流说线索和猜字，一加一开放组合不强判唯一谜底。'],
      ['method', '实际说明一个猜字方法，合理方法可不同。'],
    ],
    reflections: [
      '记录一个线索或字形发现。',
      '记录下一次猜谜或写字计划，不当完成。',
    ],
  },
];
export const lowerFrogRiddlePageAudits = entries.map((e) => ({
  itemId: e.itemId,
  pages: e.pages,
  recognize: e.recognize,
  write: e.write,
  author: null,
  reciteRequired: false,
  sourceCredit:
    e.itemId === 'u1-3'
      ? '四川人民出版社《字族文识字读本（第一册）》，有改动'
      : '人民教育出版社小学语文室编写',
  newRadicals:
    e.itemId === 'u1-3'
      ? ['目字旁', '竖心旁']
      : ['走之', '又字旁', '竖心旁', '力字旁'],
}));
function makeLesson(e: Entry): Lesson {
  const id = `cl-${e.itemId}`;
  const choice = (
    key: string,
    prompt: string,
    labels: string[],
    value: string,
    explanation: string,
    review: boolean,
    material?: string,
  ): Question => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
    material,
    choices: labels.map((label) => ({ id: label, label })),
    rule: { kind: 'choice', value },
    hint: '先看指定字词与原书信息，需要时请家长帮读。',
    explanation,
  });
  const objective = (review: boolean): Question[] => [
    ...required(recognitionRows[e.itemId]).map((r, i) =>
      choice(
        `char-${i}`,
        r[review ? 2 : 1],
        required(recognitionRows[e.itemId]).map((x) => x[0]),
        r[0],
        '按指定词语认字，会认与会写清单分开，实际声音需另行确认。',
        review,
      ),
    ),
    ...e.pairs.map((p) =>
      choice(
        p.key,
        p.prompts[review ? 1 : 0],
        p.labels,
        p.values[review ? 1 : 0],
        p.explanation,
        review,
        p.material,
      ),
    ),
  ];
  return {
    id,
    title: e.title,
    textbookTitle: e.title,
    page: required(e.pages[0]),
    status: 'available',
    version: 1,
    goal: `按原书认${e.recognize}、写${e.write}，完成本课词语、观察、朗读与表达。`,
    prerequisite: `准备第${e.pages.join('—')}页原书与田字格纸，可由家长陪读。`,
    parentTip:
      '本课正式教学与旧识字补充独立，认写范围按实际正文核对；来源按原书脚注，机构编写与改选来源不当个人作者，ISBN版印次未知。现代全文原画声音在外部原书或合法示范中查看，实际任务人工确认、反思null、计划不当完成，教师最终审校与全年规划仍需验收。',
    steps: e.steps,
    questions: [
      ...objective(false),
      ...e.actual.map(([key, prompt]): Question => ({
        id: `${id}-manual-${key}`,
        knowledge: `${id}-manual-${key}`,
        prompt,
        rule: { kind: 'manual' },
        hint: '实际尝试后确认，缺书、示范或纸笔可以暂时跳过。',
        explanation:
          '实际读背写说与客观答案分开，不自动评发音字迹，正确性null；计划不当已完成。',
      })),
      ...e.reflections.map((prompt, i): Question => ({
        id: `${id}-reflect-${i}`,
        knowledge: `${id}-reflect-${i}`,
        prompt,
        rule: { kind: 'reflection' },
        hint: '自己的话，家长可代写。',
        explanation:
          '保留原话、正确性null，开放表达不唯一判分，未来计划不当完成。',
      })),
    ],
    reviewQuestions: objective(true),
    review: {
      date: '2026-10-01',
      reviewer: '下册原书课文与活动范围校验',
      notes: `实际查看第三方原书公开预览（${lowerFrogRiddleSource.sourceUrl}）第${e.pages.join('—')}页，认${e.recognize}与写${e.write}分别核对，来源按原书脚注，ISBN版印次仍未知。本站讲解、字词问答与活动组织原创，现代全文原画声音外部共读；朗读与实际活动分别人工确认、反思null、计划不当完成，旧补充身份与历史不改写，不以两课声明下册或全年完成。`,
    },
  };
}
export const lowerFrogRiddleLessons: Record<string, Lesson> =
  Object.fromEntries(entries.map((e) => [e.itemId, makeLesson(e)]));

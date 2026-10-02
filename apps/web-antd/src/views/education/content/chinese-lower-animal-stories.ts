import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';

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
  goal: string;
  title: string;
  pages: number[];
  recognize: string;
  write: string;
  author: null | string;
  sourceCredit: string;
  newRadicals: string[];
  additionalReadings: string;
  pairs: Pair[];
  reciteRequired: boolean;
  steps: Lesson['steps'];
  actual: [string, string][];
  reflections: string[];
};
const recognitionRows: Record<string, [string, string, string][]> = {
  'u7-3': [
    ['虎', '老虎中的第2个字是哪项？', '换词语：虎口中的第1个字是哪项？'],
    ['熊', '狗熊中的第2个字是哪项？', '换词语：熊猫中的第1个字是哪项？'],
    ['通', '通知中的第1个字是哪项？', '换词语：交通中的第2个字是哪项？'],
    ['注', '注意中的第1个字是哪项？', '换词语：关注中的第2个字是哪项？'],
    ['意', '注意中的第2个字是哪项？', '换词语：心意中的第2个字是哪项？'],
    ['遍', '一遍中的第2个字是哪项？', '换词语：遍地中的第1个字是哪项？'],
    ['百', '一百中的第2个字是哪项？', '换词语：百姓中的第1个字是哪项？'],
    ['为', '为什么中的第1个字是哪项？', '换词语：因为中的第2个字是哪项？'],
    ['因', '因为中的第1个字是哪项？', '换词语：原因中的第2个字是哪项？'],
    ['舌', '舌头中的第1个字是哪项？', '换词语：舌尖中的第1个字是哪项？'],
    ['理', '道理中的第2个字是哪项？', '换词语：理解中的第1个字是哪项？'],
    ['忘', '忘记中的第1个字是哪项？', '换词语：难忘中的第2个字是哪项？'],
    ['第', '第二中的第1个字是哪项？', '换词语：第一中的第1个字是哪项？'],
  ],
  'u7-4': [
    ['猴', '小猴中的第2个字是哪项？', '换词语：猴子中的第1个字是哪项？'],
    ['块', '一块中的第2个字是哪项？', '换词语：石块中的第2个字是哪项？'],
    ['兴', '高兴中的第2个字是哪项？', '换词语：兴奋中的第1个字是哪项？'],
    ['掰', '掰开中的第1个字是哪项？', '换词语：掰成两半中的第1个字是哪项？'],
    ['扛', '扛着中的第1个字是哪项？', '换词语：扛起中的第1个字是哪项？'],
    ['往', '往前中的第1个字是哪项？', '换词语：来往中的第2个字是哪项？'],
    ['棵', '一棵中的第2个字是哪项？', '换词语：两棵中的第2个字是哪项？'],
    ['满', '满树中的第1个字是哪项？', '换词语：装满中的第2个字是哪项？'],
    ['扔', '扔了中的第1个字是哪项？', '换词语：扔掉中的第1个字是哪项？'],
    ['摘', '摘桃中的第1个字是哪项？', '换词语：摘下中的第1个字是哪项？'],
    ['捧', '捧着中的第1个字是哪项？', '换词语：捧起中的第1个字是哪项？'],
    ['追', '追兔中的第1个字是哪项？', '换词语：追上中的第1个字是哪项？'],
  ],
};
const entries: Entry[] = [
  {
    itemId: 'u7-3',
    title: '动物王国开大会',
    pages: [84, 85, 86, 87, 88, 89],
    recognize: '虎熊通注意遍百为因舌理忘第',
    write: '国百时林都听点',
    author: '郝鸿',
    sourceCredit: '郝鸿，选作课文时有改动',
    newRadicals: [],
    additionalReadings: '呀yā',
    reciteRequired: false,
    goal: '认识十三字与熟字呀yā、写七字，分角色朗读，辨清四次通知和时间地点，练习把信息说清楚。',
    pairs: [
      {
        key: 'notifier',
        prompts: ['老虎让谁去通知大家？', '换角色：第一次提醒缺少日期的是谁？'],
        values: ['狗熊', '狐狸'],
        labels: ['狗熊', '狐狸', '任意答案都相同'],
        explanation: '按84页人物任务与提醒分别找。',
        material:
          '先共读本课原书，原文与插图外部阅读；本站信息卡和问题为原创组织。',
      },
      {
        key: 'count',
        prompts: ['狗熊一共通知大家几次？', '换数量：每次通知一连喊几遍？'],
        values: ['四次通知', '十遍喊话'],
        labels: ['四次通知', '十遍喊话', '任意答案都相同'],
        explanation:
          '四次通知各喊十遍，次数与重复遍数不同，不把四十遍当四十次通知。',
        material:
          '先共读本课原书，原文与插图外部阅读；本站信息卡和问题为原创组织。',
      },
      {
        key: 'missing-0',
        prompts: ['狐狸提醒缺少什么信息？', '换角色：大灰狼提醒缺少什么信息？'],
        values: ['哪一天', '几点钟'],
        labels: ['哪一天', '几点钟', '任意答案都相同'],
        explanation: '三个角色分别提醒日期、具体时间和地点。',
        material:
          '先共读本课原书，原文与插图外部阅读；本站信息卡和问题为原创组织。',
      },
      {
        key: 'missing-1',
        prompts: [
          '大灰狼提醒缺少什么信息？',
          '换角色：梅花鹿提醒缺少什么信息？',
        ],
        values: ['几点钟', '在哪里'],
        labels: ['几点钟', '在哪里', '任意答案都相同'],
        explanation: '三个角色分别提醒日期、具体时间和地点。',
        material:
          '先共读本课原书，原文与插图外部阅读；本站信息卡和问题为原创组织。',
      },
      {
        key: 'missing-2',
        prompts: ['梅花鹿提醒缺少什么信息？', '换角色：狐狸提醒缺少什么信息？'],
        values: ['在哪里', '哪一天'],
        labels: ['在哪里', '哪一天', '任意答案都相同'],
        explanation: '三个角色分别提醒日期、具体时间和地点。',
        material:
          '先共读本课原书，原文与插图外部阅读；本站信息卡和问题为原创组织。',
      },
      {
        key: 'final-day',
        prompts: [
          '最后通知说大会在哪一天？',
          '换信息：大会开始是上午还是下午？',
        ],
        values: ['明天', '上午'],
        labels: ['明天', '上午', '任意答案都相同'],
        explanation: '明天是故事里的相对日期，不当真实日历安排。',
        material:
          '先共读本课原书，原文与插图外部阅读；本站信息卡和问题为原创组织。',
      },
      {
        key: 'final-time',
        prompts: ['最后通知说几点开始？', '换信息：最后通知说在哪里开？'],
        values: ['八点', '森林广场'],
        labels: ['八点', '森林广场', '任意答案都相同'],
        explanation: '最后通知明确明天上午八点、森林广场。',
        material:
          '先共读本课原书，原文与插图外部阅读；本站信息卡和问题为原创组织。',
      },
      {
        key: 'ending',
        prompts: [
          '最后一次为什么大家能听明白？',
          '换到第一次：只重复喊话还缺什么？',
        ],
        values: ['时间地点说明清楚', '具体日期时间地点'],
        labels: ['时间地点说明清楚', '具体日期时间地点', '任意答案都相同'],
        explanation: '清楚的信息比只重复更重要；措辞不同可以实际说明。',
        material:
          '先共读本课原书，原文与插图外部阅读；本站信息卡和问题为原创组织。',
      },
      {
        key: 'reading',
        prompts: [
          '第89页呀的熟字另读是哪项？',
          '换语境：本站原创好呀中呀的轻声写法是哪项？',
        ],
        values: ['yā', 'ya'],
        labels: ['yā', 'ya', '任意答案都相同'],
        explanation: '呀yā为本页蓝标熟字读音，另行跟读，不增加十三新认。',
        material:
          '先共读本课原书，原文与插图外部阅读；本站信息卡和问题为原创组织。',
      },
      {
        key: 'writing',
        prompts: [
          '国与虎中，本课会写的是哪项？',
          '换字：都与熊中，本课会写的是哪项？',
        ],
        values: ['国', '都'],
        labels: ['国', '都', '任意答案都相同'],
        explanation: '七会写国百时林都听点单列，认字不代替写字。',
        material:
          '先共读本课原书，原文与插图外部阅读；本站信息卡和问题为原创组织。',
      },
    ],
    steps: [
      {
        title: '十三新认，七会写',
        text: '本课十三新认虎熊通注意遍百为因舌理忘第；七写国百时林都听点。89页呀yā是熟字读音，不增加新字；没有新偏旁红标。',
        activity: '实际指读十三字与呀。',
        visual: {
          kind: 'characters',
          grid: 'tian',
          characters: [
            '虎',
            '熊',
            '通',
            '注',
            '意',
            '遍',
            '百',
            '为',
            '因',
            '舌',
            '理',
            '忘',
            '第',
          ],
        },
      },
      {
        title: '84—85页：第一次缺日期',
        text: '实际共读郝鸿改选原书84—85页。老虎让狗熊通知，第一遍内容只有要开大会；狐狸问哪一天。狗熊向老虎问后补成明天，又通知。现代全文原画声音在原书或合法资源共读。',
        activity: '实际共读84—85页。',
      },
      {
        title: '85—86页：第二次缺具体时间',
        text: '继续共读85—86页。第二次已经说明明天，大灰狼仍问上午下午、几点钟；狗熊又问老虎，得到明天上午八点。通知次数与每次喊十遍分开数。',
        activity: '实际共读第二次提醒，找缺的信息。',
      },
      {
        title: '87—89页：地点与结尾',
        text: '实际共读87—89页。第三次有明天上午八点，梅花鹿问哪里，老虎补森林广场；第四次信息清楚，第二天动物准时参加。狗熊四次通知，每次喊十遍；故事的明天不当真实活动日期。',
        activity: '实际共读第三、第四次及结尾。',
      },
      {
        title: '分角色朗读',
        text: '按89页要求分角色朗读：旁白、老虎、狗熊、狐狸、大灰狼、梅花鹿，可一人换角色。尝试问号和感叹号语气，家长听实际声音；不强制录音，不增加必背。',
        activity: '实际分角色朗读全文。',
      },
      {
        title: '说明四次为什么不同',
        text: '回看四次通知：最初没有具体日期时间地点；再加明天；再加上午八点；最后加森林广场。先数次数，再说最后为什么大家听明白，表达可不同，不要求照背。',
        activity: '实际说四次与最后清楚的原因。',
      },
      {
        title: '七字纸面写',
        text: '对照89页逐笔和田字格，实际写国百时林都听点；普通网页字体供认字，不替代规范笔顺。',
        activity: '实际纸面写七字。',
        visual: {
          kind: 'characters',
          grid: 'tian',
          characters: ['国', '百', '时', '林', '都', '听', '点'],
        },
      },
      {
        title: '原创通知练习',
        text: '本站原创虚构卡：纸卡伙伴明天上午九点在阅读角交换书签。试向伙伴说日期、时间、地点和做什么，请对方复述；这是练说，不发送真实通知，不存住址或联系方式。未来想练的内容另记计划。',
        activity: '实际用虚构卡练说并倾听回应。',
      },
    ],
    actual: [
      ['recognize', '实际指读十三新认字。'],
      ['reading', '实际跟读呀yā，观察熟字另一个读音。'],
      ['read-first', '实际共读84—85页。'],
      ['read-middle', '实际共读第二次时间提醒。'],
      ['read-last', '实际共读87—89页地点与结尾。'],
      ['roles', '实际分角色朗读全文。'],
      ['retell', '实际说狗熊共通知几次、最后为什么能听明白。'],
      ['write', '实际纸面写七字。'],
      ['notice', '按本站原创虚构卡实际练说通知，不发送真实消息。'],
      ['exchange', '实际倾听伙伴复述并交流。'],
    ],
    reflections: [
      '记录本次读通知或写字的一个发现。',
      '下一次想怎么练说？这是未来计划。',
    ],
  },
  {
    itemId: 'u7-4',
    title: '小猴子下山',
    pages: [90, 91, 92],
    recognize: '猴块兴掰扛往棵满扔摘捧追',
    write: '高着瓜进兴往兔',
    author: '发堤',
    sourceCredit: '发堤，选作课文时有改动',
    newRadicals: [],
    additionalReadings: '结jiē',
    reciteRequired: false,
    goal: '认识十二字与熟字结jiē、写七字，朗读并说看见和做过什么，读做六动作，选词造句，交流习惯。',
    pairs: [
      {
        key: 'route',
        prompts: ['小猴先走到哪处？', '换先后：桃树后又到哪处？'],
        values: ['玉米地', '瓜地'],
        labels: ['玉米地', '瓜地', '任意答案都相同'],
        explanation: '按玉米地、桃树、瓜地、追兔的路线找，不改变故事次序。',
        material:
          '先共读本课原书，原文与插图外部阅读；本站信息卡和问题为原创组织。',
      },
      {
        key: 'shape',
        prompts: ['文中玉米有什么特点？', '换物品：桃子有什么特点？'],
        values: ['又大又多', '又大又红'],
        labels: ['又大又多', '又大又红', '任意答案都相同'],
        explanation: '分别读书中描述，词语重复不等于现实作物都一样。',
        material:
          '先共读本课原书，原文与插图外部阅读；本站信息卡和问题为原创组织。',
      },
      {
        key: 'shape-2',
        prompts: ['文中西瓜有什么特点？', '换角色：小兔子怎样动？'],
        values: ['又大又圆', '蹦蹦跳跳'],
        labels: ['又大又圆', '蹦蹦跳跳', '任意答案都相同'],
        explanation: '两组叠词描述不同对象。',
        material:
          '先共读本课原书，原文与插图外部阅读；本站信息卡和问题为原创组织。',
      },
      {
        key: 'quantity',
        prompts: ['原文小猴掰了多少玉米？', '换物品：原文小猴捧着多少桃子？'],
        values: ['一个玉米', '几个桃子'],
        labels: ['一个玉米', '几个桃子', '任意答案都相同'],
        explanation: '一个与几个区分，几个没有指定数，不补成两个或三个。',
        material:
          '先共读本课原书，原文与插图外部阅读；本站信息卡和问题为原创组织。',
      },
      {
        key: 'ending',
        prompts: ['小兔子跑进哪里后不见了？', '换到最终结果：小猴怎样回家？'],
        values: ['树林', '空着手'],
        labels: ['树林', '空着手', '任意答案都相同'],
        explanation: '结尾兔子不见，先前物品被扔掉，最后空手，原因要联系经过。',
        material:
          '先共读本课原书，原文与插图外部阅读；本站信息卡和问题为原创组织。',
      },
      {
        key: 'reading',
        prompts: [
          '玉米结得又大又多的结读哪项？',
          '换语境：本站原创结伴的结读哪项？',
        ],
        values: ['jiē', 'jié'],
        labels: ['jiē', 'jié', '任意答案都相同'],
        explanation: '结jiē是本页蓝标熟字读音，非新增；结伴为原创比较。',
        material:
          '先共读本课原书，原文与插图外部阅读；本站信息卡和问题为原创组织。',
      },
      {
        key: 'writing',
        prompts: [
          '着与抱中，本课会写的是哪项？',
          '换字：兔与追中，本课会写的是哪项？',
        ],
        values: ['着', '兔'],
        labels: ['着', '兔', '任意答案都相同'],
        explanation: '七会写高着瓜进兴往兔；抱是动作词练习，不加新认新写。',
        material:
          '先共读本课原书，原文与插图外部阅读；本站信息卡和问题为原创组织。',
      },
      {
        key: 'action-0',
        prompts: [
          '原书动作“掰玉米”对应哪个词？',
          '换动作：“扛着玉米”对应哪个词？',
        ],
        values: ['掰', '扛'],
        labels: ['掰', '扛', '扔', '摘', '捧', '抱'],
        explanation: '六动作读做并选词造句；选对文字不当真实动作已完成。',
        material:
          '先共读本课原书，原文与插图外部阅读；本站信息卡和问题为原创组织。',
      },
      {
        key: 'action-1',
        prompts: [
          '原书动作“扛着玉米”对应哪个词？',
          '换动作：“扔掉玉米”对应哪个词？',
        ],
        values: ['扛', '扔'],
        labels: ['掰', '扛', '扔', '摘', '捧', '抱'],
        explanation: '六动作读做并选词造句；选对文字不当真实动作已完成。',
        material:
          '先共读本课原书，原文与插图外部阅读；本站信息卡和问题为原创组织。',
      },
      {
        key: 'action-2',
        prompts: [
          '原书动作“扔掉桃子”对应哪个词？',
          '换动作：“摘西瓜”对应哪个词？',
        ],
        values: ['扔', '摘'],
        labels: ['掰', '扛', '扔', '摘', '捧', '抱'],
        explanation: '六动作读做并选词造句；选对文字不当真实动作已完成。',
        material:
          '先共读本课原书，原文与插图外部阅读；本站信息卡和问题为原创组织。',
      },
      {
        key: 'action-3',
        prompts: [
          '原书动作“摘桃子”对应哪个词？',
          '换动作：“捧着桃子”对应哪个词？',
        ],
        values: ['摘', '捧'],
        labels: ['掰', '扛', '扔', '摘', '捧', '抱'],
        explanation: '六动作读做并选词造句；选对文字不当真实动作已完成。',
        material:
          '先共读本课原书，原文与插图外部阅读；本站信息卡和问题为原创组织。',
      },
      {
        key: 'action-4',
        prompts: [
          '原书动作“捧着桃子”对应哪个词？',
          '换动作：“抱着西瓜”对应哪个词？',
        ],
        values: ['捧', '抱'],
        labels: ['掰', '扛', '扔', '摘', '捧', '抱'],
        explanation: '六动作读做并选词造句；选对文字不当真实动作已完成。',
        material:
          '先共读本课原书，原文与插图外部阅读；本站信息卡和问题为原创组织。',
      },
      {
        key: 'action-5',
        prompts: [
          '原书动作“抱着西瓜”对应哪个词？',
          '换动作：“掰玉米”对应哪个词？',
        ],
        values: ['抱', '掰'],
        labels: ['掰', '扛', '扔', '摘', '捧', '抱'],
        explanation: '六动作读做并选词造句；选对文字不当真实动作已完成。',
        material:
          '先共读本课原书，原文与插图外部阅读；本站信息卡和问题为原创组织。',
      },
    ],
    steps: [
      {
        title: '十二新认与熟字结',
        text: '92页新认猴块兴掰扛往棵满扔摘捧追，结jiē是熟字另一个读音。会写高着瓜进兴往兔。抱只在动作词练习，不扩大十二新认；没有新偏旁红标。',
        activity: '实际指读十二字与熟字结。',
        visual: {
          kind: 'characters',
          grid: 'tian',
          characters: [
            '猴',
            '块',
            '兴',
            '掰',
            '扛',
            '往',
            '棵',
            '满',
            '扔',
            '摘',
            '捧',
            '追',
          ],
        },
      },
      {
        title: '90页：玉米与桃',
        text: '准备发堤改选原书，实际共读90页。先到玉米地，玉米又大又多；后到桃树，桃子又大又红。找每次看见什么、做什么；现代全文原画声音外部共读。',
        activity: '实际共读90页。',
      },
      {
        title: '91页：瓜、兔与空手',
        text: '实际共读91页。桃后到瓜地，瓜又大又圆；回去时见兔，扔瓜追兔。兔跑入树林不见，最后空手。原文桃子只说几个，不猜固定数量；故事活动不要求实际采摘、抛食物或追动物。',
        activity: '实际共读91页，说结尾。',
      },
      {
        title: '朗读并结合图说',
        text: '按92页先朗读全文，再回看原书插图：玉米—桃—瓜—兔。分别说看见什么、做什么，最后为什么空手；可以用自己的话。朗读与解释单独确认，本课没有必背。',
        activity: '实际朗读并说明经过与原因。',
      },
      {
        title: '六个动作，读读做做',
        text: '掰、扛、扔、摘、捧、抱。借原图比较手和身体的姿势，再用空手或轻纸卡做温和示意；不需要重物或真实作物。动作选择只是认词，实际做另确认。',
        activity: '实际读六词并做安全示意。',
      },
      {
        title: '选几词各说一句',
        text: '按92页从六动作词中选几个，各说一句话。允许不同的合理表达；本站原创示例捧着纸盒、抱着轻玩偶可作参考，不当原文或唯一答案。家长倾听句子意思，不用单选代替开放造句。',
        activity: '实际选几个词，各说一句。',
      },
      {
        title: '七字纸面写',
        text: '对照92页逐笔和田字格，实际写高着瓜进兴往兔；观察着、兴、兔等字位置，普通字体只供认字，不替代规范示范。',
        activity: '实际纸面写七字。',
        visual: {
          kind: 'characters',
          grid: 'tian',
          characters: ['高', '着', '瓜', '进', '兴', '往', '兔'],
        },
      },
      {
        title: '好习惯交流',
        text: '92页拓展活动联系本单元几篇课文交流好习惯。可以讨论虚构角色整理文具、珍惜时间、说清信息、做事有始有终，也说一个自己知道的习惯；表达开放，不把角色失误或一次表现当真实孩子性格结论。下一次想做的事另记计划。',
        activity: '实际交流并倾听习惯想法。',
      },
    ],
    actual: [
      ['recognize', '实际指读十二新认字。'],
      ['reading', '实际读结jiē并对比结伴jié。'],
      ['read-first', '实际共读90页。'],
      ['read-second', '实际共读91页。'],
      ['read', '实际朗读全文。'],
      ['retell', '结合原图实际说看见什么、做什么及空手原因。'],
      ['actions', '实际读六动作词并用空手或轻纸卡做温和示意。'],
      ['sentences', '实际选择几个动作词各说一句，允许不同表达。'],
      ['write', '实际纸面写七字。'],
      ['habits', '实际交流本单元或自己知道的习惯。'],
      ['listen', '实际倾听伙伴表达并回应。'],
    ],
    reflections: [
      '记录本次认字、动作词或阅读的一个发现。',
      '说说一个你理解的习惯，表达可以不同。',
      '下一次想做什么？这是计划，不当已经实践。',
    ],
  },
];
export const lowerAnimalStoriesSource = {
  sourceUrl: 'https://keben.app/book/0026',
  provider: '第三方原书公开预览',
  checkedAt: '2026-10-01',
  isbn: null,
  editionDate: null,
  printingDate: null,
};
export const lowerAnimalStoriesPageAudits = entries.map((e) => ({
  itemId: e.itemId,
  pages: e.pages,
  recognize: e.recognize,
  write: e.write,
  author: e.author,
  sourceCredit: e.sourceCredit,
  newRadicals: e.newRadicals,
  additionalReadings: e.additionalReadings,
  reciteRequired: e.reciteRequired,
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
    goal: e.goal,
    prerequisite: `准备第${e.pages.join('—')}页原书与田字格纸，可由家长陪读。`,
    parentTip: `${e.sourceCredit}。请先准备原书、纸笔，陪孩子听示范、读一读、说一说。课文可分段练，实际读写完成后再确认；没有材料可暂时跳过，下一次想做的事另记为计划。`,
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
      notes: `实际查看第三方原书公开预览（${lowerAnimalStoriesSource.sourceUrl}）第${e.pages.join('—')}页，认${e.recognize}与写${e.write}分别核对，来源按原书脚注，ISBN版印次仍未知。本站讲解、字词问答与活动组织原创，现代全文原画声音外部共读；朗读与实际活动分别人工确认、反思null、计划不当完成，旧补充身份与历史不改写，不以本单元课文开放声明下册或全年完成。`,
    },
  };
}
export const lowerAnimalStoriesLessons: Record<string, Lesson> =
  Object.fromEntries(entries.map((e) => [e.itemId, makeLesson(e)]));

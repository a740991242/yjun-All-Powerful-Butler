import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';

type Pair = {
  key: string;
  prompts: [string, string];
  values: [string, string];
  labels: string[];
  reviewLabels?: string[];
  explanation: string;
  material: string;
};
type Entry = {
  itemId: string;
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
  'u4-1': [
    ['静', '安静中的第2个字是哪项？', '换词语：静心中的第1个字是哪项？'],
    ['思', '思念中的第1个字是哪项？', '换词语：心思中的第2个字是哪项？'],
    ['床', '床前中的第1个字是哪项？', '换词语：起床中的第2个字是哪项？'],
    ['疑', '疑问中的第1个字是哪项？', '换词语：怀疑中的第2个字是哪项？'],
    ['举', '举头中的第1个字是哪项？', '换词语：举手中的第1个字是哪项？'],
    ['望', '望月中的第1个字是哪项？', '换词语：希望中的第2个字是哪项？'],
    ['低', '低头中的第1个字是哪项？', '换词语：高低中的第2个字是哪项？'],
    ['故', '故乡中的第1个字是哪项？', '换词语：故事中的第1个字是哪项？'],
  ],
  'u4-2': [
    ['胆', '胆子中的第1个字是哪项？', '换词语：大胆中的第2个字是哪项？'],
    ['敢', '勇敢中的第2个字是哪项？', '换词语：敢于中的第1个字是哪项？'],
    ['勇', '勇气中的第1个字是哪项？', '换词语：勇士中的第1个字是哪项？'],
    ['讲', '讲故事中的第1个字是哪项？', '换词语：讲课中的第1个字是哪项？'],
    ['窗', '窗外中的第1个字是哪项？', '换词语：门窗中的第2个字是哪项？'],
    ['乱', '乱跳中的第1个字是哪项？', '换词语：杂乱中的第2个字是哪项？'],
    ['拉', '拉手中的第1个字是哪项？', '换词语：拉开中的第1个字是哪项？'],
    ['样', '一样中的第2个字是哪项？', '换词语：样子中的第1个字是哪项？'],
    ['笑', '微笑中的第2个字是哪项？', '换词语：笑声中的第1个字是哪项？'],
    ['再', '再见中的第1个字是哪项？', '换词语：再三中的第1个字是哪项？'],
    ['睡', '睡觉中的第1个字是哪项？', '换词语：入睡中的第2个字是哪项？'],
    ['觉', '睡觉中的第2个字是哪项？', '换词语：午觉中的第2个字是哪项？'],
  ],
  'u4-3': [
    ['端', '端午中的第1个字是哪项？', '换词语：端正中的第1个字是哪项？'],
    ['粽', '粽子中的第1个字是哪项？', '换词语：红枣粽中的第3个字是哪项？'],
    ['节', '节日中的第1个字是哪项？', '换词语：春节中的第2个字是哪项？'],
    ['总', '总会中的第1个字是哪项？', '换词语：总共中的第1个字是哪项？'],
    ['煮', '煮熟中的第1个字是哪项？', '换词语：煮饭中的第1个字是哪项？'],
    ['盼', '盼着中的第1个字是哪项？', '换词语：盼望中的第1个字是哪项？'],
    ['米', '糯米中的第2个字是哪项？', '换词语：米饭中的第1个字是哪项？'],
    ['枣', '红枣中的第2个字是哪项？', '换词语：枣树中的第1个字是哪项？'],
    ['甜', '香甜中的第2个字是哪项？', '换词语：甜味中的第1个字是哪项？'],
    ['分', '分给中的第1个字是哪项？', '换词语：分开中的第1个字是哪项？'],
    ['鲜', '鲜肉中的第1个字是哪项？', '换词语：新鲜中的第2个字是哪项？'],
    ['肉', '鲜肉中的第2个字是哪项？', '换词语：肉类中的第1个字是哪项？'],
  ],
};
const entries: Entry[] = [
  {
    itemId: 'u4-1',
    title: '静夜思',
    pages: [39],
    recognize: '静思床疑举望低故',
    write: '思前故床地乡',
    author: '李白',
    sourceCredit: '[唐]李白',
    newRadicals: [],
    additionalReadings: '',
    pairs: [
      {
        key: 'poet',
        prompts: ['静夜思是谁的诗？', '原页标示的朝代是哪项？'],
        values: ['李白', '唐'],
        labels: ['李白', '唐', '贾岛'],
        explanation: '按第39页署名区分诗人和朝代。',
        material: '床前明月光，疑是地上霜。\n举头望明月，低头思故乡。',
      },
      {
        key: 'light',
        prompts: ['床前看到的光来自什么？', '诗人把月光疑作什么？'],
        values: ['明月', '地上霜'],
        labels: ['明月', '地上霜', '确定实际下霜'],
        explanation: '疑是是误以为的描写，不把比照当确实天气。',
        material: '床前明月光，疑是地上霜。\n举头望明月，低头思故乡。',
      },
      {
        key: 'action',
        prompts: ['看明月时做哪个动作？', '思故乡时做哪个动作？'],
        values: ['举头', '低头'],
        labels: ['举头', '低头', '已经回到故乡'],
        explanation: '两动作与诗中对象配合，思念不等于已经返回。',
        material: '床前明月光，疑是地上霜。\n举头望明月，低头思故乡。',
      },
      {
        key: 'meaning',
        prompts: ['思字在本诗主要表示什么？', '故乡在诗中指哪项？'],
        values: ['思念', '原来的家乡'],
        labels: ['思念', '原来的家乡', '刚刚搬来的旅馆'],
        explanation: '联系诗句理解，不询问学习者真实住址或迁居经历。',
        material: '床前明月光，疑是地上霜。\n举头望明月，低头思故乡。',
      },
      {
        key: 'sequence',
        prompts: [
          '举头望月在低头思乡之前还是之后？',
          '换方向：低头思乡在举头望月之前还是之后？',
        ],
        values: ['之前', '之后'],
        labels: ['之前', '之后', '诗中没有顺序'],
        explanation: '按诗句先后理解，不补造写作地点或精确时间。',
        material: '床前明月光，疑是地上霜。\n举头望明月，低头思故乡。',
      },
      {
        key: 'writing',
        prompts: [
          '思与静中，本课会写字是哪项？',
          '乡与疑中，本课会写字是哪项？',
        ],
        values: ['思', '乡'],
        labels: ['思', '静'],
        reviewLabels: ['乡', '疑'],
        explanation: '八认六写分开，实际写字按规范示范。',
        material: '先与家长共读指定原书页，按本题信息观察。',
      },
    ],
    steps: [
      {
        title: '古诗与八会认',
        text: '第39页唐李白静夜思，八认静思床疑举望低故，六写思前故床地乡。先认字，再读诗。',
        activity: '实际指读八字。',
        visual: {
          kind: 'characters',
          grid: 'tian',
          characters: ['静', '思', '床', '疑', '举', '望', '低', '故'],
        },
      },
      {
        title: '读四句，体会先后',
        text: '[唐]李白\n床前明月光，疑是地上霜。\n举头望明月，低头思故乡。\n先观察月光，再举头望月、低头思乡。疑是表达误以为，不断言真实下霜。',
        activity: '实际朗读四句。',
      },
      {
        title: '动作与心情',
        text: '举头和低头分别联系望月与思乡。思念是诗中情感，可以说自己的理解，不限定唯一感受或要求真实离乡经历。',
        activity: '用自己的话交流诗意。',
      },
      {
        title: '朗读与背诵分开',
        text: '教材明确朗读课文、背诵课文。朗读后尝试背四句，再对照检查；网页选择题不能评声音或认定已背过。',
        activity: '实际朗读后独立尝试背诵。',
      },
      {
        title: '六字规范写',
        text: '按原书田字格看思前故床地乡六字，会认范围与会写范围分开。网页字体不作笔顺标准，缺材料可暂跳。',
        activity: '实际纸面写六字。',
        visual: {
          kind: 'characters',
          grid: 'tian',
          characters: ['思', '前', '故', '床', '地', '乡'],
        },
      },
      {
        title: '记录发现与未来计划',
        text: '记录实际读背写与发现；下次计划另列，不作本次已经完成。',
        activity: '保留发现与计划。',
      },
    ],
    actual: [
      ['recognize', '实际指读静思床疑举望低故八字。'],
      ['read', '实际朗读静夜思四句，家长可帮读。'],
      ['recite', '朗读后实际尝试背诵静夜思，再与原诗核对。'],
      ['meaning', '轮流说一处月光、动作或思乡发现，听伙伴回应。'],
      ['write', '按第39页规范示范实际纸面写思前故床地乡六字。'],
    ],
    reciteRequired: true,
    reflections: [
      '记录一个读词、观察或表达发现。',
      '记录未来练习计划，明确不是已经完成。',
    ],
  },
  {
    itemId: 'u4-2',
    title: '夜色',
    pages: [40, 41],
    recognize: '胆敢勇讲窗乱拉样笑再睡觉',
    write: '色讲笑把样再',
    author: '柯岩',
    sourceCredit: '柯岩（原页未标改动）',
    newRadicals: ['提手旁'],
    additionalReadings: '',
    pairs: [
      {
        key: 'change',
        prompts: ['诗中孩子从前天黑时怎样？', '后来孩子能看见什么？'],
        values: ['不敢往外瞧', '小鸟在月光下睡觉'],
        labels: ['不敢往外瞧', '小鸟在月光下睡觉', '所有孩子都不能害怕'],
        explanation: '只找柯岩诗中人物变化，不以单个故事评价孩子性格。',
        material: '先与家长共读指定原书页，按本题信息观察。',
      },
      {
        key: 'helpers',
        prompts: ['原诗谁讲勇敢故事？', '原诗谁带孩子晚上散步？'],
        values: ['妈妈', '爸爸'],
        labels: ['妈妈', '爸爸', '全部孩子必须同样家庭结构'],
        explanation: '原诗角色不是学习者家庭信息，不要求夜间外出。',
        material: '先与家长共读指定原书页，按本题信息观察。',
      },
      {
        key: 'night-image',
        prompts: ['原诗把花草写得像在做什么？', '花草微笑的描写属于什么表达？'],
        values: ['微笑', '拟人'],
        labels: ['微笑', '拟人', '现实花草真的长着人脸'],
        explanation: '文学观察与自然事实区别，不以诗判断所有植物行为。',
        material: '先与家长共读指定原书页，按本题信息观察。',
      },
      {
        key: 'radical',
        prompts: ['拉字红标的新偏旁叫什么？', '扌在本课哪个字中示范？'],
        values: ['提手旁', '拉'],
        labels: ['提手旁', '拉', '尸字头'],
        explanation: '按第41页红标核对，不扩大新增字。',
        material: '先与家长共读指定原书页，按本题信息观察。',
      },
      {
        key: 'word-0',
        prompts: [
          '本题词胆子第一个字是什么？',
          '换位置：胆子最后一个字是什么？',
        ],
        values: ['胆', '子'],
        labels: ['胆', '子', '与指定词无关'],
        explanation: '覆盖第41页十二词，实际朗读单独确认。',
        material: '本题限定原书示例词：胆子。',
      },
      {
        key: 'word-1',
        prompts: [
          '本题词胆量第一个字是什么？',
          '换位置：胆量最后一个字是什么？',
        ],
        values: ['胆', '量'],
        labels: ['胆', '量', '与指定词无关'],
        explanation: '覆盖第41页十二词，实际朗读单独确认。',
        material: '本题限定原书示例词：胆量。',
      },
      {
        key: 'word-2',
        prompts: [
          '本题词大胆第一个字是什么？',
          '换位置：大胆最后一个字是什么？',
        ],
        values: ['大', '胆'],
        labels: ['大', '胆', '与指定词无关'],
        explanation: '覆盖第41页十二词，实际朗读单独确认。',
        material: '本题限定原书示例词：大胆。',
      },
      {
        key: 'word-3',
        prompts: [
          '本题词勇敢第一个字是什么？',
          '换位置：勇敢最后一个字是什么？',
        ],
        values: ['勇', '敢'],
        labels: ['勇', '敢', '与指定词无关'],
        explanation: '覆盖第41页十二词，实际朗读单独确认。',
        material: '本题限定原书示例词：勇敢。',
      },
      {
        key: 'word-4',
        prompts: [
          '本题词勇气第一个字是什么？',
          '换位置：勇气最后一个字是什么？',
        ],
        values: ['勇', '气'],
        labels: ['勇', '气', '与指定词无关'],
        explanation: '覆盖第41页十二词，实际朗读单独确认。',
        material: '本题限定原书示例词：勇气。',
      },
      {
        key: 'word-5',
        prompts: [
          '本题词勇士第一个字是什么？',
          '换位置：勇士最后一个字是什么？',
        ],
        values: ['勇', '士'],
        labels: ['勇', '士', '与指定词无关'],
        explanation: '覆盖第41页十二词，实际朗读单独确认。',
        material: '本题限定原书示例词：勇士。',
      },
      {
        key: 'word-6',
        prompts: [
          '本题词样子第一个字是什么？',
          '换位置：样子最后一个字是什么？',
        ],
        values: ['样', '子'],
        labels: ['样', '子', '与指定词无关'],
        explanation: '覆盖第41页十二词，实际朗读单独确认。',
        material: '本题限定原书示例词：样子。',
      },
      {
        key: 'word-7',
        prompts: [
          '本题词一样第一个字是什么？',
          '换位置：一样最后一个字是什么？',
        ],
        values: ['一', '样'],
        labels: ['一', '样', '与指定词无关'],
        explanation: '覆盖第41页十二词，实际朗读单独确认。',
        material: '本题限定原书示例词：一样。',
      },
      {
        key: 'word-8',
        prompts: [
          '本题词花样第一个字是什么？',
          '换位置：花样最后一个字是什么？',
        ],
        values: ['花', '样'],
        labels: ['花', '样', '与指定词无关'],
        explanation: '覆盖第41页十二词，实际朗读单独确认。',
        material: '本题限定原书示例词：花样。',
      },
      {
        key: 'word-9',
        prompts: [
          '本题词再见第一个字是什么？',
          '换位置：再见最后一个字是什么？',
        ],
        values: ['再', '见'],
        labels: ['再', '见', '与指定词无关'],
        explanation: '覆盖第41页十二词，实际朗读单独确认。',
        material: '本题限定原书示例词：再见。',
      },
      {
        key: 'word-10',
        prompts: [
          '本题词再三第一个字是什么？',
          '换位置：再三最后一个字是什么？',
        ],
        values: ['再', '三'],
        labels: ['再', '三', '与指定词无关'],
        explanation: '覆盖第41页十二词，实际朗读单独确认。',
        material: '本题限定原书示例词：再三。',
      },
      {
        key: 'word-11',
        prompts: [
          '本题词再次第一个字是什么？',
          '换位置：再次最后一个字是什么？',
        ],
        values: ['再', '次'],
        labels: ['再', '次', '与指定词无关'],
        explanation: '覆盖第41页十二词，实际朗读单独确认。',
        material: '本题限定原书示例词：再次。',
      },
      {
        key: 'writing',
        prompts: [
          '色与胆中，本课会写字是哪项？',
          '再与窗中，本课会写字是哪项？',
        ],
        values: ['色', '再'],
        labels: ['色', '胆'],
        reviewLabels: ['再', '窗'],
        explanation: '六写色讲笑把样再，不能把全部会认字都当会写。',
        material: '先与家长共读指定原书页，按本题信息观察。',
      },
    ],
    steps: [
      {
        title: '两页诗与认写范围',
        text: '原页作者柯岩，十二认胆敢勇讲窗乱拉样笑再睡觉、六写色讲笑把样再；新提手旁在拉字红标。现代全文、原画与录音在外部原书共读。',
        activity: '实际指读十二字。',
        visual: {
          kind: 'characters',
          grid: 'tian',
          characters: [
            '胆',
            '敢',
            '勇',
            '讲',
            '窗',
            '乱',
            '拉',
            '样',
            '笑',
            '再',
            '睡',
            '觉',
          ],
        },
      },
      {
        title: '先读从前，再读后来',
        text: '先共读第40页，比较从前不敢往外瞧与后来月光下观察的变化。妈妈讲故事、爸爸散步是原诗角色，不代填个人家庭经历。',
        activity: '实际共读整首诗，找两种变化。',
      },
      {
        title: '标点与句中停顿',
        text: '教材要求朗读并注意句中停顿。按语意与标点读，屏幕换行不直接决定停顿；省略号也要联系内容。',
        activity: '实际朗读，试一处合理停顿。',
      },
      {
        title: '十二词，四组读记',
        text: '胆子胆量大胆、勇敢勇气勇士、样子一样花样、再见再三再次。按词理解与认读，睡觉的觉读jiào，不按另一个语境jué混用。',
        activity: '实际读十二词。',
      },
      {
        title: '提手旁与六会写',
        text: '新偏旁扌在拉字，六写色讲笑把样再另列；按规范示范实际写，不把部件观察变成新增会写。',
        activity: '观察新偏旁，实际写六字。',
        visual: {
          kind: 'characters',
          grid: 'tian',
          characters: ['色', '讲', '笑', '把', '样', '再'],
        },
      },
      {
        title: '说一处变化和发现',
        text: '感受可以不同，害怕也可表达；诗中花草微笑是拟人，不以诗证明所有现实植物或要求夜间外出。本课只朗读，不增加必做背诵。',
        activity: '轮流交流变化或感受，听回应。',
      },
      {
        title: '记录与计划',
        text: '保留实际读写说与发现，未来练习计划另列。',
        activity: '记录本次发现与下一次计划。',
      },
    ],
    actual: [
      ['recognize', '实际指读胆敢勇讲窗乱拉样笑再睡觉十二字。'],
      ['read', '实际与大人朗读夜色第40页。'],
      ['pause', '实际试一处句中停顿，再说为什么这样读。'],
      ['words', '实际读第41页十二词，联系语境记字。'],
      ['radical', '实际在拉字观察提手旁，说部件发现。'],
      ['write', '按第41页规范示范实际写色讲笑把样再。'],
      ['exchange', '轮流说原诗变化或自己的理解，允许不同感受。'],
    ],
    reciteRequired: false,
    reflections: [
      '记录一个读词、观察或表达发现。',
      '记录未来练习计划，明确不是已经完成。',
    ],
  },
  {
    itemId: 'u4-3',
    title: '端午粽',
    pages: [42, 43],
    recognize: '端粽节总煮盼米枣甜分鲜肉',
    write: '节间吃米分肉',
    author: '屠再华',
    sourceCredit: '屠再华，选作课文时有改动',
    newRadicals: ['米字旁'],
    additionalReadings: '了liǎo',
    pairs: [
      {
        key: 'wrapper',
        prompts: ['文中包粽子外面的叶子是什么？', '文中里面裹着什么？'],
        values: ['箬竹叶', '糯米'],
        labels: ['箬竹叶', '糯米', '所有粽子都是同一馅料'],
        explanation: '只说外婆这份粽子，不推广所有地区做法。',
        material: '先与家长共读指定原书页，按本题信息观察。',
      },
      {
        key: 'filling',
        prompts: ['文中红枣粽中间有什么？', '文中煮熟后闻到什么？'],
        values: ['红枣', '清香'],
        labels: ['红枣', '清香', '未煮熟的肉'],
        explanation: '按第42页具体描写理解，不要求实际烹饪或品尝。',
        material: '先与家长共读指定原书页，按本题信息观察。',
      },
      {
        key: 'taste',
        prompts: [
          '文中粽子除了甜，还有哪项口感？',
          '文中外婆的粽子除了红枣粽还有哪些？',
        ],
        values: ['黏', '红豆粽和鲜肉粽'],
        labels: ['黏', '红豆粽和鲜肉粽', '所有孩子必须喜欢吃'],
        explanation: '口感与花样分开，个人饮食偏好不唯一判分。',
        material: '先与家长共读指定原书页，按本题信息观察。',
      },
      {
        key: 'sharing',
        prompts: ['小篮粽子带回去要分给谁？', '吃粽子纪念屈原在文中怎样标示？'],
        values: ['邻居', '传说'],
        labels: ['邻居', '传说', '精确考古日期'],
        explanation: '按第43页保留传说，不补造日期或要求现实送食。',
        material: '先与家长共读指定原书页，按本题信息观察。',
      },
      {
        key: 'reading',
        prompts: ['了解到的了在本课读什么？', '换词语：吃了的了通常读什么？'],
        values: ['liǎo', 'le'],
        labels: ['liǎo', 'le', 'liào'],
        explanation: '了是熟字新音，另列，不加第十三个新增认字。',
        material: '先与家长共读指定原书页，按本题信息观察。',
      },
      {
        key: 'radical',
        prompts: ['粽字红标的新偏旁叫什么？', '米字旁在本课哪个字中示范？'],
        values: ['米字旁', '粽'],
        labels: ['米字旁', '粽', '提手旁'],
        explanation: '按第43页新红标核对，不把声旁宗混成偏旁。',
        material: '先与家长共读指定原书页，按本题信息观察。',
      },
      {
        key: 'writing',
        prompts: [
          '节与端中，本课会写字是哪项？',
          '肉与枣中，本课会写字是哪项？',
        ],
        values: ['节', '肉'],
        labels: ['节', '端'],
        reviewLabels: ['肉', '枣'],
        explanation: '六写节间吃米分肉与十二会认字分开。',
        material: '先与家长共读指定原书页，按本题信息观察。',
      },
    ],
    steps: [
      {
        title: '两页故事与十二会认',
        text: '屠再华端午粽改选，十二认端粽节总煮盼米枣甜分鲜肉，熟字了liǎo另列。全文、原图、录音外部共读。',
        activity: '实际指读十二字。',
        visual: {
          kind: 'characters',
          grid: 'tian',
          characters: [
            '端',
            '粽',
            '节',
            '总',
            '煮',
            '盼',
            '米',
            '枣',
            '甜',
            '分',
            '鲜',
            '肉',
          ],
        },
      },
      {
        title: '读42页：外婆的红枣粽',
        text: '从叶、米、枣观察颜色与材料，再找清香、黏和甜。描述的是书中外婆这份粽子，不推广所有粽子或要求购买、制作、吃过。',
        activity: '实际共读第42页，按材料和感官整理发现。',
      },
      {
        title: '读43页：分享与传说',
        text: '继续读分享邻居与屈原纪念传说。了解到的了读liǎo，吃了的了可读le，联系语境；传说保持标签，不变成精确史料。',
        activity: '实际继续读第43页，交流分享与传说。',
      },
      {
        title: '标点与朗读停顿',
        text: '教材要求注意标点、读好停顿；逗号、句号联系意思读，不机械按网页换行。',
        activity: '实际朗读，试一处标点停顿。',
      },
      {
        title: '说一说红枣粽',
        text: '用自己的话说原书红枣粽材料、颜色、味道或口感，信息来自原文，表达顺序开放，不要求照背一套答案。',
        activity: '实际描述并听伙伴回应。',
      },
      {
        title: '米字旁与六会写',
        text: '粽的新偏旁米字旁；会写节间吃米分肉按第43页规范示范练。熟字新音与偏旁例字不扩新增认写。',
        activity: '实际观察偏旁并纸面写六字。',
        visual: {
          kind: 'characters',
          grid: 'tian',
          characters: ['节', '间', '吃', '米', '分', '肉'],
        },
      },
      {
        title: '选做：节日故事交流',
        text: '教材此项选做，可讲知道的端午或粽子故事、标清传说，也可跳过。不要把别人的或未来活动写成本人已做；本课不增加必做背诵。',
        activity: '愿意时交流故事并倾听，不知道可跳过。',
      },
      {
        title: '记录发现与下一次计划',
        text: '记录实际读写说发现，另列未来想读或想问的内容。',
        activity: '保留发现和未来计划。',
      },
    ],
    actual: [
      ['recognize', '实际指读端粽节总煮盼米枣甜分鲜肉十二字。'],
      ['read-first', '与大人实际共读第42页。'],
      ['read-second', '实际继续共读第43页。'],
      ['reading', '实际读了解到与吃了，比较了在不同语境的读音。'],
      ['pause', '实际朗读并试一处按标点与语意的停顿。'],
      ['describe', '实际用自己的话描述书中外婆红枣粽，听伙伴回应。'],
      ['radical', '实际在粽字观察米字旁。'],
      ['write', '按第43页规范示范实际纸面写节间吃米分肉。'],
      [
        'extension',
        '选做：实际交流一个端午或粽子故事，标明传说；也可暂时跳过。',
      ],
    ],
    reciteRequired: false,
    reflections: [
      '记录一个读词、观察或表达发现。',
      '记录未来练习计划，明确不是已经完成。',
    ],
  },
];
export const lowerUnitFourReadingSource = {
  sourceUrl: 'https://keben.app/book/0026',
  provider: '第三方原书公开预览',
  checkedAt: '2026-10-01',
  isbn: null,
  editionDate: null,
  printingDate: null,
};
export const lowerUnitFourReadingPageAudits = entries.map((e) => ({
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
        review ? (p.reviewLabels ?? p.labels) : p.labels,
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
    version: 2,
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
      notes: `实际查看第三方原书公开预览（${lowerUnitFourReadingSource.sourceUrl}）第${e.pages.join('—')}页，认${e.recognize}与写${e.write}分别核对，来源按原书脚注，ISBN版印次仍未知。本站讲解、字词问答与活动组织原创，现代全文原画声音外部共读；朗读与实际活动分别人工确认、反思null、计划不当完成，旧补充身份与历史不改写，不以本单元课文开放声明下册或全年完成。`,
    },
  };
}
export const lowerUnitFourReadingLessons: Record<string, Lesson> =
  Object.fromEntries(entries.map((e) => [e.itemId, makeLesson(e)]));

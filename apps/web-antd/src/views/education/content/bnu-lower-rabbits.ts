import type { Lesson, Question } from '../learning/types';

const id = 'bnu-lower-rabbit-homes';
function task(
  suffix: string,
  prompt: string,
  rule: Question['rule'],
  explanation: string,
): Question {
  return {
    id: `${id}-${suffix}`,
    knowledge: id,
    prompt,
    rule,
    hint: '先明确条件和所求；两屋与两盒有名字，结果和过程分别核对，游戏中每张卡只能用一次。',
    explanation,
  };
}
function number(
  suffix: string,
  prompt: string,
  value: number,
  explanation: string,
): Question {
  return task(suffix, prompt, { kind: 'number', value }, explanation);
}
function steps(
  suffix: string,
  prompt: string,
  values: number[],
  explanation: string,
): Question {
  return task(suffix, prompt, { kind: 'steps', values }, explanation);
}
function actual(suffix: string, prompt: string): Question {
  return task(
    suffix,
    prompt,
    { kind: 'manual' },
    '实际点数、摆拨、写画或交流后才确认；只看网页、计划或未做请跳过，答对不证明实际活动已完成。',
  );
}
function cardPairs(
  suffix: string,
  target: number,
  candidates: readonly (readonly [number, number])[],
): Question {
  const choices = candidates.map(([a, b], i) => ({
    id: `${suffix}-${i + 1}`,
    label: `配对${i + 1} · ${a}与${b}`,
  }));
  return {
    ...task(
      suffix,
      `本站每个1～${target - 1}的数各一张卡，从这${candidates.length}组候选中选出全部可凑${target}的两张不同卡。不能复制同一张卡。`,
      {
        kind: 'set',
        values: candidates.flatMap(([a, b], i) =>
          a !== b && a + b === target ? [`${suffix}-${i + 1}`] : [],
        ),
      },
      `每张实际卡只用一次；两张数和为${target}才符合，不重复复制卡片。`,
    ),
    choices,
  };
}
export const bnuRabbitColumns = [
  [7, 6],
  [7, 5],
  [7, 4],
  [6, 9],
  [7, 9],
  [8, 9],
  [9, 5],
  [8, 5],
  [7, 5],
] as const;
export const bnuLowerRabbitsLesson: Lesson = {
  id,
  textbookTitle: '小兔子安家',
  title: '凑十、两屋分配与凑数配对',
  page: 12,
  version: 1,
  status: 'available',
  goal: '完整说明7+5与两跳凑十；有序找两屋分配并解释一个增一个减，区分正好与够用，使用不同数卡完整配对。',
  prerequisite: '认识20以内的数、十与一，能说明凑十和两个部分合计。',
  parentTip:
    '对应北师大下册第12～13页实际读取范围。本站文字信息与原创标记不是原书兔子、饼干插画。允许空屋的0～12范围和正好15块均为本站明确条件，原题开放提问与其它合理条件单独交流，不冒原教材唯一约束。原图与纸卡实际活动独立人工，反思与未来计划分开。',
  review: {
    date: '2026-10-04',
    reviewer: '公开扫描第12～13页及饼干图放大逐项核对',
    notes:
      '7+5、两跳+3/+2、房屋编号、原六行1+11到6+6、四组凑十、三列九式含重复7+5、三盒6/8/9与15人每人1块、1～10各一张凑11全部五配对核对。0空屋和正好约束明确为本站条件，原书实际写画游戏manual，记录null。',
  },
  steps: [
    {
      title: '先数两群，再说一共',
      text: '本站两组不重叠标记7个与5个，共12个；教材兔子图要实际逐只核对，房屋上的1、2是名字，不是住1只、2只或额外兔子。',
      visual: { kind: 'ten-frame', left: 7, right: 5 },
      activity: '实际点数第12页两群兔子，填写整式和只的单位，说明房屋编号。',
    },
    {
      title: '七加五完整凑十',
      text: '先凑7，把5分3与2，7+3=10，再加2为12。数线上先加3再加2，总加5。也可先凑5，把7分5与2，5+5=10，再添2；指定方法的四空不排除其它合理算法。',
      activity: '实际摆或画两种凑十，指出数线起点7、中间10、终点12与两次加数。',
    },
    {
      title: '两屋有名字，分配有规律',
      text: '本站把1号屋和2号屋的入住数分别记录，共12只；这道网页题明确允许一屋空，0与未填不同。原页写出1+11、2+10、3+9、4+8、5+7、6+6六行示例，都是12。本站另把0+12及交换后的分配有序补齐，不称这些扩展是原页已印内容。',
      activity: '实际把12个标记分进两屋，写多种合理分配，说明是否允许空屋。',
    },
    {
      title: '一个增一，另一个减一',
      text: '固定合计12，1号屋增加1，2号屋就减少1；名字互换后可以产生另一条有序分配，6与6交换仍同一条。若一个增加另一个不变，合计就改变，不能仍说12。',
      activity: '实际观察原六行，说清变化及不变的合计，换顺序后再次核对。',
    },
    {
      title: '每一式与每一空都核对',
      text: '8+4先把4分2与2；9+3先把3分1与2；7+4先把4分3与1；5+6先把6分5与1。另三列分别保持7、保持9、保持5，一个数减少或增加1，合计相应变化1。两处7+5是两个原题位置，不能漏一处。',
      activity: '实际完成第13页四组分解与三列九式，说明各列条件和变化。',
    },
    {
      title: '正好与够用是不同条件',
      text: '本站A盒6块、B盒8块、C盒9块，每盒内容无重叠。15人每人1块，若要求正好15块，则A和C；A和B只有14少1，B和C共17够用但余2。原书问合适，要先讨论是否允许剩余，不能把本站附加的正好条件冒原题唯一要求。',
      activity: '实际逐块核对原三盒，再按说明的条件连线并解释其它两组。',
    },
    {
      title: '不同数卡凑十一',
      text: '本站1～10各一张，每次两张不同卡凑11，完整五组为1与10、2与9、3与8、4与7、5与6。先确定一张再找伙伴；交换拿取顺序不增新一组。网页选择和真正同伴游戏分别记录，不自动判断同伴胜负。',
      activity: '实际准备1～10各一张，与同伴按说清的规则玩，核对是否找全五组。',
    },
  ],
  questions: [
    number(
      'total',
      '本站两群互不重叠标记7个与5个，共几个？',
      12,
      '7+5=12，房屋名字不增加对象。',
    ),
    steps(
      'seven-first',
      '本站7+5先凑7，依次填从5分出多少、剩多少、凑成数、总量。',
      [3, 2, 10, 12],
      '5分3与2；7+3=10，再添2为12。',
    ),
    steps(
      'five-first',
      '同一7+5先凑5，依次填从7分出多少、剩多少、凑成数、总量。',
      [5, 2, 10, 12],
      '7分5与2；5+5=10，再添2为12。',
    ),
    number(
      'jump-total',
      '本站从7先加3再加2，一共加多少？',
      5,
      '3+2=5，不只记第一次。',
    ),
    number('jump-last', '本站从7先加3再加2，最后到多少？', 12, '先10，再12。'),
    task(
      'two-homes',
      '本站12只住1号屋与2号屋，允许一屋空。依次填两屋只数，每只只住一屋，两屋合计12。',
      {
        kind: 'arithmetic-pair',
        minimum: 0,
        maximum: 12,
        operation: 'add',
        result: 12,
      },
      '0～12范围内两个数和为12都合法，包括0与12；不是只有6与6。',
    ),
    ...Array.from({ length: 13 }, (_, a) =>
      number(
        `home-partner-${a}`,
        `本站两屋共12只，允许空屋。1号屋${a}只，2号屋几只？`,
        12 - a,
        `${a}+${12 - a}=12；原页六行示例与本站允许0的完整范围分开。`,
      ),
    ),
    ...(
      [
        [8, 4, 12, [2, 2, 10, 12]],
        [9, 3, 12, [1, 2, 10, 12]],
        [7, 4, 11, [3, 1, 10, 11]],
        [5, 6, 11, [5, 1, 10, 11]],
      ] as const
    ).flatMap(([a, b, sum, path], i) => [
      number(
        `method-sum-${i}`,
        `本站第${i + 1}组${a}+${b}，合计多少？`,
        sum,
        `${a}+${b}=${sum}。`,
      ),
      steps(
        i === 0 ? 'eight-first' : `method-${i}`,
        `本站第${i + 1}组${a}+${b}先凑${a}，依次填从${b}分出多少、剩多少、凑成数、总量。`,
        [...path],
        `${b}先分出${path[0]}，剩${path[1]}；凑10后再添，合计${sum}。`,
      ),
    ]),
    ...bnuRabbitColumns.map(([a, b], i) =>
      number(
        `column-${i + 1}`,
        `本站按原页三列数序转成卡${i + 1}：${a}+${b}等于多少？`,
        a + b,
        `${a}+${b}=${a + b}；相同算式的两个位置都要独立核对。`,
      ),
    ),
    number('boxes-ab', '本站A盒6块与B盒8块共几块？', 14, '6+8=14。'),
    number('boxes-ac', '本站A盒6块与C盒9块共几块？', 15, '6+9=15。'),
    number('boxes-bc', '本站B盒8块与C盒9块共几块？', 17, '8+9=17。'),
    number(
      'boxes-short',
      '本站15人各需1块，A与B共14块，还差几块？',
      1,
      '15与14差1。',
    ),
    number(
      'boxes-left',
      '本站15人各吃1块，B与C共17块，剩几块？',
      2,
      '17拿走15剩2，够用不等于正好。',
    ),
    {
      ...task(
        'boxes-exact',
        '本站附加条件：15人每人1块，买两盒正好15块、不多不少，选哪一组？',
        { kind: 'choice', value: 'ac' },
        '只有6+9=15；8+9够吃但余2，不符合本站正好条件。',
      ),
      choices: [
        { id: 'ab', label: 'A与B · 6块和8块' },
        { id: 'ac', label: 'A与C · 6块和9块' },
        { id: 'bc', label: 'B与C · 8块和9块' },
      ],
    },
    steps(
      'eleven-partners',
      '本站1～10各一张，依次给1、2、3、4、5找另一张卡凑11，填五个伙伴数。',
      [10, 9, 8, 7, 6],
      '五组为1/10、2/9、3/8、4/7、5/6，每张只用一次。',
    ),
    cardPairs('eleven-pairs', 11, [
      [1, 10],
      [2, 9],
      [3, 8],
      [4, 7],
      [5, 6],
      [5, 5],
      [8, 4],
      [2, 8],
    ]),
    number(
      'zero-ones',
      '本站8与2个一组成1个十，散着的一有几个？',
      0,
      '散个0，合计仍10，不是未填。',
    ),
    actual(
      'actual-rabbits',
      '实际点数原书两群兔子，填写完整算式与只的单位，说明1/2号是屋名；做过再确认。',
    ),
    actual(
      'actual-ten',
      '实际摆或画7+5两种凑十，原书数线两跳也完整说明；做过再确认。',
    ),
    actual(
      'actual-homes',
      '实际把12个标记分到两个有名字的屋，写多种分配并说明空屋条件；做过再确认。',
    ),
    actual(
      'actual-pattern',
      '实际观察并写原六行分配，说明一个增1另一个减1及合计不变；做过再确认。',
    ),
    actual(
      'actual-methods',
      '实际完成原书8+4、9+3、7+4、5+6四组所有分解空格和总量，说明方法；全部做过再确认。',
    ),
    actual(
      'actual-columns',
      '实际完成原三列九式含给定7+6和两处7+5，比较各列全部变化；做过再确认。',
    ),
    actual(
      'actual-boxes',
      '实际逐块核对原三盒，讨论正好与允许余下的条件，连线并说明各组；做过再确认。',
    ),
    actual(
      'actual-cards',
      '实际准备1～10各一张卡，检查无漏卡或重复卡；做过再确认。',
    ),
    actual(
      'actual-game',
      '实际与同伴说清规则并玩凑11，检查全部五组与每张只用一次；尚未玩请跳过。',
    ),
    actual(
      'actual-explain',
      '实际向同伴说明一种分配或凑十方法，听取并核对另一种方法；只计划请跳过。',
    ),
    task(
      'reflection',
      '记录自己实际怎样分屋、凑十或配卡；没有操作如实写。',
      { kind: 'reflection' },
      '个人记录不自动评分，不确认实际游戏。',
    ),
    task(
      'plan',
      '记录下一次准备练什么，未来计划单独记，不当已经完成。',
      { kind: 'reflection' },
      '未来与已做分开保存。',
    ),
  ],
  reviewQuestions: [
    number(
      'review-total',
      '换一组：9张与4张卡互不重叠，共几张？',
      13,
      '9+4=13。',
    ),
    steps(
      'review-method',
      '换一组9+4先凑9，依次填从4分出多少、剩多少、凑成数、总量。',
      [1, 3, 10, 13],
      '4分1与3，9+1=10，再添3为13。',
    ),
    task(
      'review-homes',
      '换一组13个标记分进有名字的两盒，允许空盒。依次填两盒个数，合计13。',
      {
        kind: 'arithmetic-pair',
        minimum: 0,
        maximum: 13,
        operation: 'add',
        result: 13,
      },
      '范围0～13，合计13的所有分配合法。',
    ),
    cardPairs('review-pairs', 12, [
      [1, 11],
      [2, 10],
      [3, 9],
      [4, 8],
      [5, 7],
      [6, 6],
      [6, 7],
      [2, 8],
    ]),
  ],
};

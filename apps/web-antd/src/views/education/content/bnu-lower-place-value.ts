import type { Lesson, Question } from '../learning/types';

const id = 'bnu-lower-ancient-count-two';
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
    hint: '先看数位或条件，十位每个代表10，个位每个代表1；比较与数序分别核对。',
    explanation,
  };
}
function choice(
  suffix: string,
  prompt: string,
  value: string,
  labels: string[],
  explanation: string,
): Question {
  return {
    ...task(suffix, prompt, { kind: 'choice', value }, explanation),
    choices: labels.map((label) => ({ id: label, label })),
  };
}
function manual(suffix: string, prompt: string): Question {
  return task(
    suffix,
    prompt,
    { kind: 'manual' },
    '实际做过才确认；尚未做请跳过，网页答题不能代替纸面作图、实物拨数和交流。',
  );
}

export const bnuLowerPlaceValueLesson: Lesson = {
  id,
  textbookTitle: '古人计数（二）',
  title: '十位、个位与二十以内数序比较',
  page: 4,
  version: 1,
  status: 'available',
  goal: '分清十位与个位的计数意义，表示10～20，读写十加几并按明确顺序比较数量。',
  prerequisite: '认识10个一是1个十，能表示11～20的十和一。',
  parentTip:
    '对应北师大下册印刷第4～5页。本站图示、问题及纸卡情境原创，数位图不是原书计数器照片。相同石头可通过标注10与1表示不同计数单位，不能说同样大小只能有同样意义。模拟不证明孩子实际拨过计数器。',
  review: {
    date: '2026-10-04',
    reviewer: '公开扫描第4～5页逐项阅读与原创任务核对',
    notes:
      '核对两石标10/1、两数位、0/9到10换位、10+1/9/10、9～20数序、12与9/14、12/15作图填数、18组成、两条六件衣服规律及四组比较。原图和本站自设数分开，整项实际操作人工确认，反思与计划不判正确。',
  },
  steps: [
    {
      title: '同样材料，先标意义',
      text: '本站两张同样的纸卡，分别标10和1，可以一起表示11；若每张都只代表1，两张就表示2。材料相同不等于约定相同，先看标注。教材两块相同石头的讨论引出不同计数单位。',
      activity: '实际用两张纸卡标10和1，说明怎样一起表示11。',
    },
    {
      title: '十位与个位分别看',
      text: '个位每个标记代表1，十位每个标记代表10。本站图示十位1个、个位1个表示11；图中2个标记不能直接说总数是2。读18时先看1个十，再看8个一。',
      visual: { kind: 'place-value', value: 18 },
      activity:
        '实际对照教材在计数器上拨11与18；没有计数器可在纸上画两个有名称的数位，并如实说明材料。',
    },
    {
      title: '从九添一成为十',
      text: '从0逐个添到9，个位记录9个一。再添1，有10个一，要改记为十位1个十、个位0个一。10的个位0有意义，不能漏掉；十位上的1不表示总量只有1。',
      visual: { kind: 'place-value', value: 10 },
      activity:
        '实际操作或画记0、9、10，说明为什么十的表示与个位单独0～9不同。',
    },
    {
      title: '十加几表示总量',
      text: '10与1合起来11，10与9合起来19，10与10合起来20。用两捆每捆10根表示20时，十位是2，个位是0；没有散根与没有总量不同。',
      visual: { kind: 'place-value', value: 20 },
      activity: '实际摆、拨或画10+1、10+9、10+10，并读出总量。',
    },
    {
      title: '按数序读，再比较',
      text: '按从小到大读9、10、11直到20。12比10大，而10比9大，所以12比9大；从12数到13、14，可知12比14小。本站比较14与17时，先读两数，数量较多一侧写大于号，较少写小于号。',
      activity: '对照教材第5页数序条逐个读9～20，说明12与9、12与14的关系。',
    },
    {
      title: '组成、数序和规律不混',
      text: '12由1个十和2个一组成，15由1个十和5个一组成。本站两行纸卡分别按每次多1、每次少2排列，要先说给出的规则再填全部空格；不能只看到几个数就断言所有数列都有唯一规律。',
      activity: '实际画出12、15，再完成教材两条衣服数序的所有空格并说明规则。',
    },
    {
      title: '把比较关系说完整',
      text: '比较13与17、19与9、11与7、10与20，每次都读清左右两数再选符号。相等需要左右表示同样的数量；写出的数字数量或图形高度不代替实际总量。自己的困惑和未来练习计划分别记录。',
      activity: '实际完成教材四组比较，逐组读出完整关系；记录不会的地方。',
    },
  ],
  questions: [
    choice(
      'same-material',
      '本站两张同样纸卡分别标10和1，按标注合起来表示多少？',
      '11',
      ['2', '11', '10'],
      '分别按10与1计，共11；不是把两张都默认为1。',
    ),
    task(
      'tens',
      '本站表示18，十位上应有几个代表10的标记？',
      { kind: 'number', value: 1 },
      '18由1个十和8个一组成，十位标记1个。',
    ),
    task(
      'ones',
      '本站表示18，个位上应有几个代表1的标记？',
      { kind: 'number', value: 8 },
      '个位8个一，不能把十位1个十计入个位。',
    ),
    task(
      'ten-zero',
      '本站表示10，十位已记1个十，个位应记几个一？',
      { kind: 'number', value: 0 },
      '10全部组成1个十，个位为0，不是未填。',
    ),
    task(
      'twenty-tens',
      '本站表示20，个位为0，十位应记几个十？',
      { kind: 'number', value: 2 },
      '20是2个十，不是20个十。',
    ),
    ...([1, 9, 10] as const).map((n) =>
      task(
        `add-${n}`,
        `本站有10根小棒，再添${n}根，共有多少根？`,
        { kind: 'number', value: 10 + n },
        `10根与${n}根合起来为${10 + n}根。`,
      ),
    ),
    ...([2, 5] as const).map((n) =>
      task(
        `draw-${n}`,
        `本站1个十和${n}个一合起来是多少？`,
        { kind: 'number', value: 10 + n },
        `1个十和${n}个一为${10 + n}。网页数值不代替实际画数位。`,
      ),
    ),
    ...([14, 15, 16, 17] as const).map((n, index) =>
      task(
        `ascending-${index}`,
        `本站纸卡按每次多1排列：12、13、A、B、C、D。${['A', 'B', 'C', 'D'][index]}应填多少？`,
        { kind: 'number', value: n },
        `继续每次多1，完整一行为12、13、14、15、16、17。`,
      ),
    ),
    ...([14, 12, 10] as const).map((n, index) =>
      task(
        `descending-${index}`,
        `本站纸卡按每次少2排列：20、18、16、A、B、C。${['A', 'B', 'C'][index]}应填多少？`,
        { kind: 'number', value: n },
        '按给定规则完整一行为20、18、16、14、12、10。',
      ),
    ),
    ...(
      [
        [13, 17, '<'],
        [19, 9, '>'],
        [11, 7, '>'],
        [10, 20, '<'],
        [18, 18, '='],
      ] as const
    ).map(([left, right, value], index) =>
      choice(
        `compare-${index}`,
        `本站比较数量：${left} ○ ${right}，应选哪个符号？`,
        value,
        ['>', '<', '='],
        `${left}${value}${right}；比较实际数值，相等只在数量相同的时候用。`,
      ),
    ),
    manual(
      'actual-mark',
      '实际用两张相同纸卡标10与1表示11，并解释未标意义时不能确定数量；做过再确认。',
    ),
    manual(
      'actual-counter',
      '对照教材第4页实际拨或画0、9、10，标出十位个位并解释换位；全部做过再确认。',
    ),
    manual(
      'actual-three-adds',
      '实际对照第4页分别完成10+1、10+9、10+10的摆拨或画记、填数与读数；全部做过再确认。',
    ),
    manual(
      'actual-number-order',
      '实际对照第5页数序条完整读9～20，说明12与9、12与14的比较；做过再确认。',
    ),
    manual(
      'actual-draw-twelve',
      '实际对照第5页表示12的小棒图，在纸上画出十位个位并完成算式；做过再确认。',
    ),
    manual(
      'actual-draw-fifteen',
      '实际对照第5页表示15的小棒图，在纸上画出十位个位并完成算式；做过再确认。',
    ),
    manual(
      'actual-eighteen',
      '实际用18说出十和一的组成，并在数位图上表示和解释；做过再确认。',
    ),
    manual(
      'actual-two-strips',
      '实际对照第5页两条衣服图，分别填写所有空格并说明顺序或规则；全部做过再确认。',
    ),
    manual(
      'actual-four-comparisons',
      '实际完成第5页四组比较：13与17、19与9、11与7、10与20，逐组读出关系；全部做过再确认。',
    ),
    task(
      'reflection',
      '记录自己怎样区分十位的1与个位的1；尚未实际拨数请如实说明。',
      { kind: 'reflection' },
      '只记录，不自动判正确，不代替实际操作。',
    ),
    task(
      'plan',
      '记录下一次准备如何练习数位或比较；计划与已经完成分开。',
      { kind: 'reflection' },
      '未来计划单独保存，不表示已经完成。',
    ),
  ],
  reviewQuestions: [
    task(
      'review-sixteen',
      '换一组：1个十和6个一合起来是多少？',
      { kind: 'number', value: 16 },
      '10与6合起来为16。',
    ),
    task(
      'review-zero',
      '换一组：表示20，十位已记2个十，个位应记几个一？',
      { kind: 'number', value: 0 },
      '20为2个十和0个一。',
    ),
    choice(
      'review-compare',
      '换一组：17 ○ 14，应填哪个符号？',
      '>',
      ['>', '<', '='],
      '17比14多3，填大于号。',
    ),
    task(
      'review-strip',
      '换一组纸卡，每次少2：19、17、15、A，A是多少？',
      { kind: 'number', value: 13 },
      '15再少2是13，按本题明确规则。',
    ),
  ],
};

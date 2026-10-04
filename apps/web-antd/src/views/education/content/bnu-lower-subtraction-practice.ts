import type { Lesson, Question } from '../learning/types';

const id = 'bnu-lower-subtraction-practice';
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
    explanation,
    hint: '先分清对象、已知和所求，按约定顺序填写；自主问题和实际纸面活动另外记录。',
  };
}
const steps = (
  suffix: string,
  prompt: string,
  values: number[],
  explanation: string,
) => task(suffix, prompt, { kind: 'steps', values }, explanation);
const number = (
  suffix: string,
  prompt: string,
  value: number,
  explanation: string,
) => task(suffix, prompt, { kind: 'number', value }, explanation);
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
const actual = (suffix: string, prompt: string) =>
  task(
    suffix,
    prompt,
    { kind: 'manual' },
    '实际完整做过再确认，未做如实跳过；网页答对不自动确认纸面、圈画或交流。',
  );
const record = (suffix: string, prompt: string) =>
  task(
    suffix,
    prompt,
    { kind: 'reflection' },
    '保留自己的原话，不评分；已做、尚未做和未来计划分别说明。',
  );
function freePair(
  suffix: string,
  operation: 'add' | 'subtract',
  result: number,
): Question {
  return task(
    suffix,
    `本站有限练习：填两个0～20的整数，组成得数${result}的${operation === 'add' ? '加' : '减'}法式，按两个运算数的顺序填写。原纸面题无这个上限，别的合理式可另写。`,
    { kind: 'arithmetic-pair', minimum: 0, maximum: 20, operation, result },
    '接受此范围内所有合法组合，0是有效数；不固定一个示例，不把展示槽当全部算式数量。',
  );
}
export const bnuLowerSubtractionPracticeLesson: Lesson = {
  id,
  textbookTitle: '整理与复习：巩固与应用',
  title: '巩固与应用：完整计算、算式关系与自主问题',
  page: 42,
  version: 1,
  status: 'available',
  goal: '完整计算与圈画、配桌、自主提问，理解三数组的加减关系，解释图中差与合计并说更多合法算式。',
  prerequisite: '会20以内加减，能读懂整体部分、比较多少和一一对应。',
  parentTip:
    '依据公开扫描42～43页，原图外链不打包。家具逐件是14椅9桌而非8桌；原三动物图标10/6/2，大蟹钳子不另数，小壳图不猜现实品种。原三数四式允许两加式或两减式换顺序，本站客观排列明确，不当唯一纸面排列。两踢毽问题和再一个动物问题开放。原看谁说得多无运算数上限，本站自由组合只限0～20；原三槽全部纸填，更多可继续，不冒只四个网页例子替全部实际活动。',
  review: {
    date: '2026-10-05',
    reviewer: '公开扫描42～43全页与圈算、家具、动物局部核对',
    notes:
      '两圈算、数线、全十二式、配桌、两自主问题、三组全四式、动物三数量/差/和/新问题与两个三槽分别对应；最终教师审校未核验。',
  },
  steps: [
    {
      title: '圈的是拿走的部分',
      text: '原左图13个蘑菇圈8个，剩5个；右图15个辣椒圈9个，剩6个。原物品仍是13或15，圈线不是新物品，也不能把圈内数量当剩余。实际可以圈成不同组，只要圈内数量准确且不重复，剩余结果相同。',
      activity:
        '实际分别在原图或逐物抄画的13/15图中圈8/9，逐个核对圈内外并写两式得数。',
    },
    {
      title: '完整画18减9',
      text: '原数线标5～19，从18出发向左共减9到9。本站示例先减8到10再减1到9；也可以每次减1，落点17、16、15、14、13、12、11、10、9。起点18不是第一落点，原合理画法不只这一条拆法。',
      activity:
        '实际完整画18−9的数线过程，说明总共减9和最后落在9，核对不把向右当减。',
    },
    {
      title: '十二条都要算',
      text: '原按行从左到右：15−7、16−7、12−6、17−4；15−8、16−8、16−4、14−7；15−9、16−9、16−6、14−6。三行各四式全部计算。对同原数15的7/8/9，减数每增1差减1；但其它列原数也可能变，不能不看条件就照搬规律。',
      activity: '实际完整算原十二式，逐行核对，再选至少两式说明自己的算法。',
    },
    {
      title: '先配已有桌子，再补缺',
      text: '原椅子后六、中六、下二共14把，桌子上三、中三、下三共9张。每把椅子配一张桌子，已有9对，还缺14−9=5张桌子。不是14＋9，也不是补14张。本站新条件14桌配14椅缺0；只给9桌没给椅数不能确定缺量。',
      activity:
        '实际逐件点原家具并画14椅与9桌一一对应，标五个缺位，写完整数量和单位。',
    },
    {
      title: '自主提出两个问题',
      text: '原小兰踢5下、小刚踢7下、芳芳踢13下。要提出两个数学问题并尝试计算，写清两问的对象和所求，不限本站示例。本站例子：小兰小刚合计5＋7=12下，芳芳比小刚多13−7=6下。其它合理问题也可以，不能将一次示例当完成原两问；实际问题和答句分别记录。',
      activity:
        '实际分别完成两个自主踢毽问题，注明条件、所求、算式、单位和答句，再独立核对。',
    },
    {
      title: '三组数，各有完整四式',
      text: '原5、9、14对应5＋9=14、9＋5=14、14−5=9、14−9=5。4、8、12对应两加两减；6、7、13同样。每组两个部分加成整体，整体减一个部分得另一个。两加式可换顺序，两减式也可换顺序，纸面合理排列不限本站客观题顺序；每组完整四式，共十二式。',
      activity:
        '实际在原三张卡分别填完整两加两减共十二式，说出哪一个是整体、另两个是部分。',
    },
    {
      title: '图标数量、求差和合计',
      text: '原上方虾形图标10只，底部褐色小壳左二中一右三共6只，大蟹2只。腿、钳子和壳纹不增加身体数。虾形比小壳多10−6=4只；虾形与大蟹共10＋2=12只，不把6混进所求。还要再提出一个数学问题，原自主问题不限本站例子，按具体对象写式和答句。',
      activity:
        '实际点全三组，完整填三数量、求差式与合计式；另提一个合理问题并解答，保留自己的原话。',
    },
    {
      title: '看谁说得多，允许更多合理式',
      text: '原分别展示得数12和得数14的三个填式槽，要完整填两边，并可以说更多合法算式。本站先分别试加法与减法，输入范围0～20，接受所有合法组合；12＋0、0＋12、20−8都可得12，14＋0、0＋14、20−6都可得14。纸面原题未限定运算数上限，25−13=12也合理，不因超网页范围判原题错。不同式子与重复念同一式分开说；三个槽不是总数上限。',
      activity:
        '实际在纸面分别写至少三条得12、三条得14的不同合法算式，完整填原六槽，可继续更多并与人交流。',
    },
  ],
  questions: [
    steps(
      'mushrooms',
      '蘑菇圈算：按原总数、圈走数、剩余数填写。',
      [13, 8, 5],
      '13−8=5个，圈走8不当剩5。',
    ),
    steps(
      'peppers',
      '辣椒圈算：按原总数、圈走数、剩余数填写。',
      [15, 9, 6],
      '15−9=6个，不把圈内外再合成新总数。',
    ),
    choice(
      'circle-meaning',
      '圈线本身是不是新增加的一个物品？',
      '不是，它只标记原来的一部分',
      ['是，每个圈算一个', '不是，它只标记原来的一部分', '是，原数量要加1'],
      '每个物品只数一次。',
    ),
    steps(
      'line-to-ten',
      '本站18−9先到10路径：9拆几和几，中间到几，最后到几？',
      [8, 1, 10, 9],
      '18−8=10，10−1=9，合计减9。',
    ),
    steps(
      'line-each',
      '每次减1算18−9：按顺序填九个落点，不包含起点18。',
      [17, 16, 15, 14, 13, 12, 11, 10, 9],
      '九次向左落点，最后9；18只作起点。',
    ),
    steps(
      'row-one',
      '完整第一行15−7、16−7、12−6、17−4，依次填得数。',
      [8, 9, 6, 13],
      '四式分别计算，不能套同一差。',
    ),
    steps(
      'row-two',
      '完整第二行15−8、16−8、16−4、14−7，依次填得数。',
      [7, 8, 12, 7],
      '原数/减数分别核对。',
    ),
    steps(
      'row-three',
      '完整第三行15−9、16−9、16−6、14−6，依次填得数。',
      [6, 7, 10, 8],
      '全十二式独立计算。',
    ),
    steps(
      'furniture',
      '每椅配一桌：按椅子数、已有桌数、还缺桌数填写。',
      [14, 9, 5],
      '已有9对，补5张，不能把椅腿/桌腿当件数。',
    ),
    choice(
      'furniture-unit',
      '原家具问题正确答句是哪一个？',
      '还缺5张桌子',
      ['还缺5张桌子', '还缺5把椅子', '还缺14张桌子'],
      '所求是补桌子，单位张。',
    ),
    number(
      'zero-missing',
      '本站新条件：14椅和14桌，每椅一桌，还缺几张桌？',
      0,
      '全部配好缺0，0不是未知。',
    ),
    choice(
      'unknown-furniture',
      '只知有9桌，没给椅子数量，能确定缺几张桌吗？',
      '不能，还需要椅子数量',
      ['能，一定缺5', '不能，还需要椅子数量', '能，椅子未知当0'],
      '不能沿用原14把或把未知当0。',
    ),
    steps(
      'kicks-counts',
      '按小兰、小刚、芳芳顺序填原踢毽次数。',
      [5, 7, 13],
      '三个已知量分别对应本人。',
    ),
    number(
      'kicks-total-example',
      '本站示例：小兰和小刚共踢几下？',
      12,
      '5＋7=12下，芳芳13不在本问范围。',
    ),
    number(
      'kicks-difference-example',
      '本站示例：芳芳比小刚多踢几下？',
      6,
      '13−7=6下，不用小兰5。',
    ),
    steps(
      'family-fourteen',
      '原5/9/14卡：依次算5＋9、9＋5、14−5、14−9。',
      [14, 14, 9, 5],
      '两个部分与整体分别对应，全四式。',
    ),
    steps(
      'family-twelve',
      '本站明确排列4/8/12卡：依次算4＋8、8＋4、12−4、12−8。',
      [12, 12, 8, 4],
      '纸面两加或两减可换顺序，本站顺序明示。',
    ),
    steps(
      'family-thirteen',
      '本站明确排列6/7/13卡：依次算6＋7、7＋6、13−6、13−7。',
      [13, 13, 7, 6],
      '整体13，不把差当两个部分之和。',
    ),
    choice(
      'family-order',
      '纸面4/8/12卡将两条加法换成先8＋4后4＋8，算式都正确，合理吗？',
      '合理，两条加法都说明两个部分合整体',
      [
        '不合理，只能按本站顺序',
        '合理，两条加法都说明两个部分合整体',
        '不合理，8＋4不等于12',
      ],
      '不把本站指定客观排列当原开放填法唯一顺序。',
    ),
    steps(
      'animals-counts',
      '按虾形图标、褐色小壳图标、大蟹图标顺序，填原图三数量。',
      [10, 6, 2],
      '分别数身体，钳子不增加大蟹数量。',
    ),
    steps(
      'animals-difference',
      '原虾形比小壳多几只：按被减数、减数、差填写。',
      [10, 6, 4],
      '10−6=4只，不用大蟹2。',
    ),
    steps(
      'animals-addition',
      '原虾形与大蟹共几只：按第一部分、第二部分、合计填写。',
      [10, 2, 12],
      '10＋2=12只，所问不包括小壳6。',
    ),
    choice(
      'unknown-animals',
      '新图只给虾形10只，没给大蟹数，能确定两组合计吗？',
      '不能，还需大蟹数量',
      ['能，沿用原2只', '不能，还需大蟹数量', '能，缺失当0'],
      '新条件不能偷用原图数量。',
    ),
    freePair('free-add-twelve', 'add', 12),
    freePair('free-subtract-twelve', 'subtract', 12),
    freePair('free-add-fourteen', 'add', 14),
    freePair('free-subtract-fourteen', 'subtract', 14),
    actual(
      'actual-mushrooms',
      '实际完整圈13个蘑菇中的8个，核对圈内外并填式得数。',
    ),
    actual(
      'actual-peppers',
      '实际完整圈15个辣椒中的9个，核对圈内外并填式得数。',
    ),
    actual(
      'actual-line',
      '实际完整画18−9数线，说明选择路径并核对总减9和落点。',
    ),
    actual(
      'actual-calculations',
      '实际完整写算原十二条式，逐条核对，说明至少两条算法。',
    ),
    actual(
      'actual-furniture',
      '实际点原14椅9桌，一一配对画缺位，列式写答句与单位。',
    ),
    actual(
      'actual-kicks-one',
      '实际提出并尝试解答第一个完整踢毽问题，允许不同于本站示例。',
    ),
    actual(
      'actual-kicks-two',
      '实际提出并尝试解答第二个完整踢毽问题，与第一问区分所求。',
    ),
    actual(
      'actual-family-fourteen',
      '实际在原5/9/14卡完整写两加两减四式，说明整体与部分。',
    ),
    actual(
      'actual-family-twelve',
      '实际在原4/8/12卡完整写两加两减四式，允许两加/两减互换顺序。',
    ),
    actual(
      'actual-family-thirteen',
      '实际在原6/7/13卡完整写两加两减四式，逐式核对。',
    ),
    actual(
      'actual-animal-counts',
      '实际完整点原三组动物图标并填各数量，不由腿钳壳纹重复计数。',
    ),
    actual(
      'actual-animal-relations',
      '实际完整填原动物求差式与合计式，说明每个数的对象和单位。',
    ),
    actual(
      'actual-animal-question',
      '实际再提一个完整动物数学问题并尝试解答，不限本站例子。',
    ),
    actual(
      'actual-free-twelve',
      '实际完整写至少三条不同的得12合法算式，原三槽全部填；更多可继续。',
    ),
    actual(
      'actual-free-fourteen',
      '实际完整写至少三条不同的得14合法算式，原三槽全部填；不限定原运算数上限。',
    ),
    actual(
      'actual-exchange',
      '实际向人说明自己的一条算式及理由，区分更多不同式与重复同式。',
    ),
    record('own-kicks-one', '记录第一个自主踢毽问题、条件、所求、尝试和答句。'),
    record('own-kicks-two', '记录第二个自主踢毽问题，说明与第一问有什么不同。'),
    record(
      'own-animal-question',
      '记录自己的新动物问题和解答尝试，缺信息时说明还需要什么。',
    ),
    record('discovery', '记录你的算式关系或方法发现，写出实际核对过的式子。'),
    record(
      'difficulty',
      '记录你还不确定的地方与已经尝试的帮助；未做如实说明。',
    ),
    record('plan', '记录下一次准备怎样圈、画、算或交流；计划不作已完成。'),
  ],
  reviewQuestions: [
    number(
      'review-circle',
      '新图14个蘑菇圈走8个，还剩几个？',
      6,
      '14−8=6，不照搬原5。',
    ),
    steps(
      'review-furniture',
      '新15椅11桌，每椅配一桌，依次填椅数、桌数、缺桌数。',
      [15, 11, 4],
      '15−11=4张桌。',
    ),
    steps(
      'review-kicks',
      '新甲6下乙9下，依次填乙比甲多几下、两人共几下。',
      [3, 15],
      '9−6=3，9＋6=15，差与合计不同。',
    ),
    steps(
      'review-family',
      '新5/8/13卡：依次算5＋8、8＋5、13−5、13−8。',
      [13, 13, 8, 5],
      '整体仍13，部分改成5/8，不照搬6/7卡。',
    ),
    freePair('review-free-eleven', 'subtract', 11),
  ],
};

import type { BnuComicVisual } from '../learning/bnu-comic';
import type { Lesson, Question } from '../learning/types';

import { bnuComicFacts } from '../learning/bnu-comic';
const id = 'bnu-lower-comic';
const picture = (
  scene: BnuComicVisual['scene'],
  variant: BnuComicVisual['variant'] = 'main',
): BnuComicVisual => ({ kind: 'bnu-comic', scene, variant });
const task = (
  key: string,
  prompt: string,
  rule: Question['rule'],
  explanation: string,
  visual?: BnuComicVisual,
): Question => ({
  id: `${id}-${key}`,
  knowledge: id,
  prompt,
  rule,
  explanation,
  hint: '按故事顺序找对象、数量、变化和问题；画图、交流、修改与自评只记录真实做过的，计划另写。',
  ...(visual ? { visual } : {}),
});
const choose = (
  key: string,
  prompt: string,
  labels: [string, string],
  explanation: string,
  visual?: BnuComicVisual,
) => ({
  ...task(key, prompt, { kind: 'choice', value: 'clear' }, explanation, visual),
  choices: labels.map((label, i) => ({
    id: i === 0 ? 'clear' : 'other',
    label,
  })),
});
const actual = (key: string, prompt: string) =>
  task(
    key,
    prompt,
    { kind: 'manual' },
    '只有实际做过本项才确认。网页读题和计算不能代替作品、实际交流或修改；没做可跳过，没有同伴可请家人参与并如实说明。',
  );
const record = (key: string, prompt: string) =>
  task(
    key,
    prompt,
    { kind: 'reflection' },
    '保留原话，正确性为null，不自动评分。未做、未理解或待评价均可如实记录；未来计划不当已完成。',
  );
export const bnuLowerComicLesson: Lesson = {
  id,
  textbookTitle: '画数学连环画',
  title: '读数学故事、画连环画、交流修改与自评',
  page: 87,
  version: 1,
  status: 'available',
  goal: '读买牛奶和小鸭故事的数学信息，选自己的题材、分格按顺序画，讲述和阅读别人的作品，真实交流修改，再分别评价三项能力。',
  prerequisite:
    '能读20以内数和加减关系；准备纸与笔，困难时请成人帮读。没有作品或交流条件可如实待做，不要求学校资料。',
  parentTip:
    '原87～89页逐项制作，本站原创示意不复制原插画、整段对话。例子四幅不要求所有作品固定四格；数学故事可以含数量、图形或位置。真实、改编和想象如实标明。绘画、交流、欣赏、修改分别确认，三项自评各最多三颗星、不由答题分数自动填满，不要求上传孩子或他人的作品。',
  steps: [
    {
      title: '读四幅生活故事，先找需要与数量',
      text: '原87页用买牛奶的故事引出画数学连环画：生活需要、买一盒并付款、找零、回到生活情境。按上左、上右、下左、下右读；本站标1～4，窄屏依序往下。价钱13元，付20元，20－13＝7元是找零。第四幅延续生活情境，不是再买一盒，不重复算价钱。给定价钱不是现价，也不要求实际购物或制作食品。',
      visual: picture('milk'),
      activity: '口述先后，指出一盒、价钱、付出的钱与找零各指什么。',
    },
    {
      title: '讲自己的经历，也能明确写原创想象',
      text: '找一件身边的数学故事，如整理玩具、来去人数、比较长短或拼图。讲真实经历时如实说；自己编或改编的，说明是想象或改编，不伪造买东西、同伴或课堂经历。先口述，再与实际在场的家人或同伴讨论准备怎样画。',
      activity: '讲一件自己的故事并讨论想画什么；未交流记待做。',
    },
    {
      title: '找数学信息，不只找加减算式',
      text: '原88页先问故事里有哪些数学信息。说明对象、数量和单位，或者图形、位置、比较关系，再提问题。只看到一个数字不足以知道它的用途；画得漂亮也不能替代数学信息。若条件不够，先补清楚，不把没写的数量当0。',
      activity: '记录自己的已知信息和问题，核对是否需要补条件。',
    },
    {
      title: '先分部分，再决定自己的格数',
      text: '想好故事分成几部分、各部分是什么，决定要几格。原示例四幅用于讲它的故事，你可以按自己的情节另定格数。先在纸上分格，写下每格顺序和要说明的信息，不能先随意填满再猜哪格先发生。',
      activity: '实际给纸分格，标顺序并规划每格。',
    },
    {
      title: '按顺序画，文字和图一致',
      text: '用自己能画的简单图形或人物表达，不按美术水平评分。配上对象、单位或图形信息，必要时加人物说明、顺序标号和标题。画一只图标代表多只物品时先说明约定；否则别人可能误数。空白格和网页答题都不算作品已完成。',
      activity: '实际画自己的连环画，配上必要说明。',
    },
    {
      title: '遇到困难，真实讨论',
      text: '看自己哪里还画不清或表达不清：是顺序、数量、单位、图形关系还是缺条件。把具体困难告诉实际在场的人，听建议后决定怎样处理。没有人参与时先记录困难和将来想问谁，不能编造已经得到反馈。',
      activity: '真实提出困难并讨论解决办法；也可如实记录暂无困难。',
    },
    {
      title: '故事会：既讲自己的，也读别人的',
      text: '原89页组织故事会。用自己的话讲作品里的数学信息和问题，再读一份家人或同伴真实提供的数学连环画，试着说清它的对象、条件和问题。只看本站例子可以练读，却不能算已经看过同伴作品；未能交流就记待做。',
      activity: '实际讲自己的作品，并阅读另一份经作者同意的作品。',
    },
    {
      title: '欣赏什么，要有具体理由',
      text: '检查数学信息是否准确、文字与图是否一致、顺序和问题是否清楚。可以喜欢不同题材或画法，说出信息清楚、想法有趣等具体理由，不只比漂亮、不要求照抄。条件不足的地方先询问，不凭自己猜一个唯一答案。',
      activity: '指出真实作品的一项优点和需要核对的地方。',
    },
    {
      title: '阅读之后修改自己的作品',
      text: '根据实际阅读与交流收获，找自己可改进的一处，比如补单位、调整顺序或把问题写清楚。实际修改后说改了什么、为什么；若检查后无需修改，说明依据。未来想改不等于已经改好。不要上传他人作品或身份信息。',
      activity: '实际检查并修改自己的作品，或者说明检查后保留的理由。',
    },
    {
      title: '读小鸭例子：先合起来，再看离开',
      text: '原89页四幅例子先有6只，又来8只，聚在一起14只，再从这14只里离开5只，剩9只。6＋8＝14说明又来后的数量；14－5＝9说明离开后的数量。本站每只小鸭代表一只，但第2幅只画新来的8只，第3幅只画离开的5只，不能把三幅当独立三群再相加。问号用来提问题，不是一只鸭子；自己的故事不必照这两式。',
      visual: picture('ducks'),
      activity: '按顺序讲两次变化，分别解释两条算式回答什么。',
    },
    {
      title: '说收获，把实际和计划分开',
      text: '回看选题、分格、绘画、讲述、阅读和修改。说一项实际发现及还有的困难，再另写下一次的计划。没有画完或没交流可以如实记，网页通过不替代这些过程。',
      activity: '说出实际收获，另列以后想改进的事。',
    },
    {
      title: '三项自评，分别看真实表现',
      text: '原89页分别评价：能讲身边数学故事并画成连环画；能用自己的话表达自己画中的数学信息；能理解别人画中的数学信息和问题。每项最多三颗星，按真实表现自行记录，可写0～3颗星和理由，尚未完成或没有他人作品可写待评价。三项彼此不同，答对算式不能自动给三项都填满，也没有统一正确星数。',
      activity: '依据自己的实际表现分别自评，保留待评价项。',
    },
  ],
  questions: [
    task(
      'milk-cartons',
      '原例第2幅买了多少盒牛奶？不是把四幅里画到的同一盒重复计数。',
      { kind: 'number', value: 1 },
      '只买1盒，各幅延续同一件事，不能因多幅都画到它就重复算购买次数。',
      picture('milk'),
    ),
    task(
      'milk-change',
      '这次价钱13元，付20元，应找回多少元？',
      { kind: 'number', value: 7 },
      '找零是付出的20元减价钱13元，20－13＝7元，不是把两笔钱相加。',
      picture('milk'),
    ),
    choose(
      'milk-units',
      '13元和20元分别说明什么？',
      ['价钱与付款，找零要由它们的关系算出', '两次购买的价钱，可以都加进总价'],
      '13元是一盒价钱，20元是付出的钱；不是两次购买。',
      picture('milk'),
    ),
    choose(
      'origin',
      '没有买过牛奶，也想画一个购物故事，怎样说明？',
      ['可以原创想象，明确写这是想象示例', '为了像教材，声称自己已经实际买过'],
      '故事可以原创或改编，必须如实说明，不能编造自己的经历。',
    ),
    choose(
      'math-information',
      '自己的数学故事是否只能用加减算式？',
      [
        '也可以清楚表达图形、位置、比较等数学信息',
        '凡没有加减算式就不是数学故事',
      ],
      '数学信息不限加减，具体对象和关系应让别人读懂。',
    ),
    choose(
      'panel-count',
      '教材两个例子都是四幅，自己的故事必须几格？',
      ['按自己的故事部分确定，不固定四格', '不论故事怎样都必须恰好四格'],
      '四幅只是这些例子的安排，个人格数要服务自己的故事。',
    ),
    choose(
      'plan-order',
      '要画自己的故事，怎样安排分格和绘画？',
      ['先想部分、分格和顺序，再按顺序画', '先随便填满所有格，最后猜先后'],
      '先规划便于表达顺序，必要时仍可根据真实作品调整。',
    ),
    choose(
      'drawing-clear',
      '只写“来了8”，读者不知道什么来了，怎样改？',
      ['补清对象和单位，让图文对应', '只把8写大，仍不说明对象'],
      '数字需要对象、单位和变化的上下文；写得大不能代替这些信息。',
    ),
    choose(
      'feedback-real',
      '还没有人读自己的作品，记录哪种情况？',
      ['如实写尚未交流，另写想请谁帮看', '直接记录同伴已提出建议'],
      '计划不代表实际交流，没有的反馈不编造。',
    ),
    choose(
      'peer-reading',
      '只是看了本站例子，没有看他人作品，能确认已经完成同伴阅读吗？',
      [
        '不能，例子练读与实际读他人作品分别记录',
        '可以，任何网页题答对就算同伴阅读',
      ],
      '练习与真实交流是不同活动，没有他人作品可待做。',
    ),
    choose(
      'appreciate',
      '欣赏作品时怎样给出有用的理由？',
      ['说数学信息、问题或顺序哪里清楚有趣', '只按画得漂亮给所有人同一种答案'],
      '欣赏与核对要有具体理由，不要求同一种题材或美术效果。',
    ),
    choose(
      'revise',
      '读者说不知道哪幅先发生，怎样实际改进？',
      ['核对情节，补顺序标号或调整画面，再请读者试读', '只换颜色，顺序仍含糊'],
      '修改应解决具体表达困难，之后能再核对是否清楚。',
    ),
    task(
      'ducks-total',
      '小鸭故事先有6只，又来8只。离开前一共有多少只？',
      { kind: 'number', value: 14 },
      '6＋8＝14只，这个结果对应又来后、离开前。',
      picture('ducks'),
    ),
    task(
      'ducks-remaining',
      '从又来后的全部鸭子中离开5只，剩多少只？',
      { kind: 'number', value: 9 },
      '先6＋8＝14，再14－5＝9；不能漏掉最开始6只，只用8－5。',
      picture('ducks'),
    ),
    choose(
      'ducks-events',
      '第2幅8只、第3幅5只可以再当两群都加到开始6只吗？',
      [
        '不能，8是新来，5是随后离开，变化方向不同',
        '可以，图里出现过的数量一律相加',
      ],
      '三幅是事件顺序，不是三群独立鸭子。离开的要从聚在一起的数量扣除。',
      picture('ducks'),
    ),
    task(
      'site-zero',
      '本站另外一个想象故事：1盒价钱13元，正好付13元，找回多少元？不是上面的付20元例子。',
      { kind: 'number', value: 0 },
      '13－13＝0元，付清价钱无需找零；0是有效数量，不是没填。',
    ),
    choose(
      'self-assessment',
      '网页算式全答对，但还没画自己的作品，三项自评怎样记录？',
      ['按真实表现分别记，作品相关能力可待评价', '自动把三项都记三颗星'],
      '实际创作、表达自己和理解别人三项不同，不由客观题得分自动填满。',
    ),
    actual(
      'actual-milk-read',
      '实际按四幅顺序口述牛奶故事，说明一盒、价钱、付款和找零分别指什么。',
    ),
    actual(
      'actual-own-tell',
      '实际讲一件自己的生活数学故事或明确标注的原创想象，并与实际在场的人讨论想怎样画。未交流如实待做。',
    ),
    actual(
      'actual-plan',
      '实际写下自己故事的数学信息、问题、各部分和所需格数，在纸上分格并标顺序。',
    ),
    actual(
      'actual-draw',
      '实际画出自己的连环画并配必要说明；空格、网页答对和未来计划不算已画完。',
    ),
    actual(
      'actual-difficulty',
      '实际回看作品并与在场的人讨论遇到的具体困难；没有困难如实说明，没有交流就待做。',
    ),
    actual(
      'actual-present',
      '实际用自己的话向家人或同伴讲自己的作品，说明数学信息与问题；未作作品不确认。',
    ),
    actual(
      'actual-peer-read',
      '实际阅读一份经作者同意的他人数学连环画，说明其中的信息和问题；仅看本站例子不代此项。',
    ),
    actual(
      'actual-appreciate',
      '实际核对所读作品，指出一项数学信息或表达方面的优点，以及需要补清的地方；没有疑问可说明已核对清楚。',
    ),
    actual(
      'actual-revise',
      '实际根据阅读和交流检查自己的作品并作修改，或者解释核对后无需改动的理由；未来想改不确认此项完成。',
    ),
    actual(
      'actual-duck-read',
      '实际按事件顺序讲小鸭故事，分别说明6＋8＝14和14－5＝9各回答哪个问题。',
    ),
    record(
      'own-information',
      '记录自己的题材、真实/改编/想象属性、数学信息、问题和格数理由。尚未规划如实写待做。',
    ),
    record(
      'difficulty-record',
      '记录实际遇到的困难、实际参与者的建议及处理结果；没有交流写待做，不记真实姓名。',
    ),
    record(
      'revision-record',
      '阅读后自己实际改了什么，为什么？没改说明核对依据；仅有计划请明确标成未来。',
    ),
    record(
      'learning-record',
      '画连环画实际有哪些收获，还有什么不清楚？没有画完也如实说。',
    ),
    record(
      'future-plan',
      '另写下一次想尝试或改进的事；与前面的实际收获、已经发生的修改分开。',
    ),
    record(
      'stars-create',
      '自评第1项：能讲身边数学故事并画成连环画。按实际表现记0～3颗星和理由，未完成可写待评价。没有唯一正确星数。',
    ),
    record(
      'stars-express',
      '自评第2项：能用自己的话表达自己连环画里的数学信息。分别记0～3颗星和理由，尚无自己的作品可写待评价。',
    ),
    record(
      'stars-understand',
      '自评第3项：能理解别人连环画里的数学信息和问题。分别记0～3颗星和理由，没读他人作品可写待评价，不照前两项自动填满。',
    ),
  ],
  reviewQuestions: (() => {
    const f = bnuComicFacts('review');
    return [
      task(
        'review-change',
        `本站新购物故事：1盒${f.price}元，付${f.tendered}元，应找回多少元？`,
        { kind: 'number', value: 4 },
        '20－16＝4元；条件已改，不能沿用原例7元。',
        picture('milk', 'review'),
      ),
      task(
        'review-after-arrive',
        '本站新鸭子故事：又来后、离开前有多少只？',
        { kind: 'number', value: 13 },
        '7＋6＝13只，先算聚在一起的数量。',
        picture('ducks', 'review'),
      ),
      task(
        'review-only-arrivals',
        '只追问新故事第2幅：新来的比最初的少几只？不是求最后剩下的。',
        { kind: 'number', value: 1 },
        '最初7只、新来6只，相差7－6＝1只；范围不同于最后剩数。',
        picture('ducks', 'review'),
      ),
      choose(
        'review-leave-from',
        '本站新鸭子故事，要从哪个数量减去离开的4只？',
        [
          '从开始7只与新来6只聚在一起的13只中减',
          '只从新来的6只中减，忽略开始7只',
        ],
        '离开的是聚在一起的鸭子，13－4＝9；开始的数量不能遗漏。',
        picture('ducks', 'review'),
      ),
      choose(
        'review-missing',
        '另一个故事只说付20元，没有给价钱或买几盒，能确定找回几元吗？',
        [
          '不能，先补价钱和购买数量，未说明不当0',
          '能，直接使用上一个故事价钱16元',
        ],
        '这是独立新条件，不能搬其他故事的价格或擅自补0。',
      ),
      choose(
        'review-three-panels',
        '小朋友的故事分三部分，三格能把信息和顺序表达清楚，要强制改四格吗？',
        ['不用，按情节清楚表达即可', '必须四格，所有教材例子都是模板'],
        '个人故事有自己的格数，不用原示例四格代替情节规划。',
      ),
      choose(
        'review-unit-fix',
        '读者不明白“少4”指什么，哪种改动更有用？',
        [
          '写清少的是哪些物品、单位和比较对象，并核对画面',
          '把4换个颜色，不补条件',
        ],
        '修改围绕真实不清楚的信息，装饰不能补足比较关系。',
      ),
      choose(
        'review-partial-rating',
        '已经画完并讲过自己作品，但没读他人作品，三项自评怎样做？',
        ['分别根据证据记录，第3项可待评价', '画完一份作品，三项自动同分满星'],
        '能创作、能表达自己、能理解别人是不同能力，第三项尚无证据不能冒完成。',
      ),
    ];
  })(),
  review: {
    date: '2026-10-06',
    reviewer: '公开扫描87～89页活动与数量关系核对',
    notes:
      '十一原活动逐项展开，两例条件重述、配图原创；创作、交流、欣赏、修改和三项自评保留真实记录，程序验收另核，不冒全书全年已完成。',
  },
};
export const bnuLowerComicMapping = [
  {
    page: 87,
    sourceActivity: 'read-milk-story-and-identify-math-information',
    steps: [1],
    objective: ['milk-cartons', 'milk-change', 'milk-units'],
    manual: ['actual-milk-read'],
    records: [],
  },
  {
    page: 87,
    sourceActivity: 'tell-life-experience-and-discuss-comic-plan',
    steps: [2],
    objective: ['origin'],
    manual: ['actual-own-tell'],
    records: [],
  },
  {
    page: 88,
    sourceActivity: 'identify-own-math-information-and-plan-panel-count',
    steps: [3, 4],
    objective: ['math-information', 'panel-count'],
    manual: ['actual-plan'],
    records: ['own-information'],
  },
  {
    page: 88,
    sourceActivity: 'divide-and-draw-in-story-order',
    steps: [4, 5],
    objective: ['plan-order', 'drawing-clear'],
    manual: ['actual-draw'],
    records: [],
  },
  {
    page: 88,
    sourceActivity: 'discuss-actual-drawing-difficulties',
    steps: [6],
    objective: ['feedback-real'],
    manual: ['actual-difficulty'],
    records: ['difficulty-record'],
  },
  {
    page: 89,
    sourceActivity: 'read-peer-comics-and-present-own',
    steps: [7],
    objective: ['peer-reading'],
    manual: ['actual-present', 'actual-peer-read'],
    records: [],
  },
  {
    page: 89,
    sourceActivity: 'check-math-information-and-appreciate',
    steps: [8],
    objective: ['appreciate'],
    manual: ['actual-appreciate'],
    records: [],
  },
  {
    page: 89,
    sourceActivity: 'revise-after-reading-peers',
    steps: [9],
    objective: ['revise'],
    manual: ['actual-revise'],
    records: ['revision-record'],
  },
  {
    page: 89,
    sourceActivity: 'read-duck-events-question-and-two-equations',
    steps: [10],
    objective: ['ducks-total', 'ducks-remaining', 'ducks-events', 'site-zero'],
    manual: ['actual-duck-read'],
    records: [],
  },
  {
    page: 89,
    sourceActivity: 'share-learning-from-drawing',
    steps: [11],
    objective: [],
    manual: [],
    records: ['learning-record', 'future-plan'],
  },
  {
    page: 89,
    sourceActivity: 'self-assess-three-separate-capabilities',
    steps: [12],
    objective: ['self-assessment'],
    manual: [],
    records: ['stars-create', 'stars-express', 'stars-understand'],
  },
] as const;

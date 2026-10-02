import type {
  ClassificationRecordVisual,
  Lesson,
  Question,
} from '../learning/types';

import { required } from '../learning/required';
import { sujiaoLowerSource as source } from './sujiao-lower-source';

const id = 'sj-lower-final-classification-review';
export function finalSortingCards(review: boolean) {
  const signs = review
    ? [
        { id: 'A', label: 'A 蓝色圆形外形卡', shape: 'circle', blue: true },
        {
          id: 'B',
          label: 'B 黄色三角形外形卡',
          shape: 'triangle',
          blue: false,
        },
        {
          id: 'C',
          label: 'C 蓝色长方形外形卡',
          shape: 'rectangle',
          blue: true,
        },
        { id: 'D', label: 'D 红色圆形外形卡', shape: 'circle', blue: false },
        { id: 'E', label: 'E 蓝色圆形外形卡', shape: 'circle', blue: true },
        {
          id: 'F',
          label: 'F 蓝色长方形外形卡',
          shape: 'rectangle',
          blue: true,
        },
      ]
    : [
        {
          id: 'A',
          label: 'A 黄色三角形外形卡',
          shape: 'triangle',
          blue: false,
        },
        { id: 'B', label: 'B 红色圆形外形卡', shape: 'circle', blue: false },
        {
          id: 'C',
          label: 'C 蓝色长方形外形卡',
          shape: 'rectangle',
          blue: true,
        },
        {
          id: 'D',
          label: 'D 黄色三角形外形卡',
          shape: 'triangle',
          blue: false,
        },
        { id: 'E', label: 'E 蓝色圆形外形卡', shape: 'circle', blue: true },
        {
          id: 'F',
          label: 'F 蓝色长方形外形卡',
          shape: 'rectangle',
          blue: true,
        },
      ];
  const clothes = review
    ? [
        { id: 'A', label: 'A 蓝色无袖连衣裙卡', upper: false, red: false },
        { id: 'B', label: 'B 红色短袖上衣卡', upper: true, red: true },
        { id: 'C', label: 'C 蓝色长袖上衣卡', upper: true, red: false },
        { id: 'D', label: 'D 红色无袖连衣裙卡', upper: false, red: true },
        { id: 'E', label: 'E 蓝色短袖上衣卡', upper: true, red: false },
        { id: 'F', label: 'F 蓝色无袖连衣裙卡', upper: false, red: false },
      ]
    : [
        { id: 'A', label: 'A 红色短袖上衣卡', upper: true, red: true },
        { id: 'B', label: 'B 蓝色长袖上衣卡', upper: true, red: false },
        { id: 'C', label: 'C 红色无袖连衣裙卡', upper: false, red: true },
        { id: 'D', label: 'D 蓝色无袖连衣裙卡', upper: false, red: false },
        { id: 'E', label: 'E 蓝色短袖上衣卡', upper: true, red: false },
        { id: 'F', label: 'F 红色长袖上衣卡', upper: true, red: true },
      ];
  return { signs, clothes };
}
function tasks(review: boolean): Question[] {
  const { signs, clothes } = finalSortingCards(review);
  const common = (key: string) => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
  });
  const select = (
    key: string,
    prompt: string,
    cards: { id: string; label: string }[],
    values: string[],
  ): Question => ({
    ...common(key),
    prompt,
    choices: cards.map((c) => ({ id: c.id, label: c.label })),
    rule: { kind: 'set', values },
    hint: '这次只用题目指定的标准，选择全部符合的卡片；同样文字但不同字母仍各是一张。',
    explanation:
      '先定标准，再逐张对应；同一批卡换标准后各组可以改变，但全部对象数不变。',
  });
  const questions: Question[] = ['triangle', 'circle', 'rectangle'].map(
    (shape, index) => {
      const names = ['三角形', '圆形', '长方形'];
      return select(
        `sign-${shape}`,
        `只按外轮廓分类，选出全部${required(names[index])}标志外形卡。本站卡片是文字抽象示例，不判断真实交通含义。`,
        signs,
        signs.filter((c) => c.shape === shape).map((c) => c.id),
      );
    },
  );
  questions.push(
    select(
      'sign-blue',
      '改按卡片明确标注的颜色分类，选出全部蓝色外形卡，不沿用刚才形状分组。',
      signs,
      signs.filter((c) => c.blue).map((c) => c.id),
    ),
    select(
      'clothes-upper',
      '两柜纸面模拟：第一柜放上衣，第二柜放连衣裙。选出全部放第一柜的衣服卡，不按颜色选。',
      clothes,
      clothes.filter((c) => c.upper).map((c) => c.id),
    ),
    select(
      'clothes-red',
      '重新整理同一批衣服卡：第一柜放红色，第二柜放蓝色。选出第一柜的全部卡，不沿用上衣分组。',
      clothes,
      clothes.filter((c) => c.red).map((c) => c.id),
    ),
  );
  const signRecord: ClassificationRecordVisual = {
    kind: 'classification-record',
    rows: ['triangle', 'circle', 'rectangle'].map((shape, index) => ({
      label: required(['三角形外形卡', '圆形外形卡', '长方形外形卡'][index]),
      mark: 'tick',
      count: signs.filter((c) => c.shape === shape).length,
    })),
  };
  for (const [index, row] of signRecord.rows.entries())
    questions.push({
      ...common(`sign-count-${index}`),
      prompt: `按本次形状记录，“${row.label}”有几张？一个勾表示一张卡。`,
      visual: signRecord,
      rule: { kind: 'number', value: row.count },
      hint: '先找这一类的标签，只数本行，不加别行。',
      explanation: `本行有${row.count}个一对一记录符号。只数当前卡，不推断真实道路标志数量。`,
    });
  questions.push({
    ...common('clothes-count'),
    prompt: '按上衣与连衣裙分类的记录中，上衣卡有几张？不要混用按颜色的结果。',
    visual: {
      kind: 'classification-record',
      rows: [
        {
          label: '上衣',
          mark: 'circle',
          count: clothes.filter((c) => c.upper).length,
        },
        {
          label: '连衣裙',
          mark: 'circle',
          count: clothes.filter((c) => !c.upper).length,
        },
      ],
    },
    rule: { kind: 'number', value: clothes.filter((c) => c.upper).length },
    hint: '看本次标准和类别标签，一符号一张卡。',
    explanation: '各组记录由本次标准决定，两组总数仍为6张，不是柜子有6个。',
  });
  for (const item of [
    {
      key: 'conserve',
      prompt: review
        ? '同一批六张衣服卡不增减，重新分柜后，各柜可以变化，全部卡会因此增多吗？'
        : '六张外形卡由形状分类改为颜色分类，没有添拿，全部卡会变多吗？',
      good: '不会，仍是六张；各组数量要重新核对',
      bad: '会，每换一种标准就多一张',
    },
    {
      key: 'unknown',
      prompt: review
        ? '另一批衣服卡的颜色没有标出，能把未知颜色的卡直接当成蓝色吗？'
        : '新标志图片的外轮廓还没有看清，可以随意猜类别并把空白当成0吗？',
      good: '不能，先观察或补充信息，未核验不等于没有',
      bad: '能，缺少信息也可以随便归类',
    },
  ])
    questions.push({
      ...common(item.key),
      prompt: item.prompt,
      choices: [
        { id: 'good', label: item.good },
        { id: 'bad', label: item.bad },
      ],
      rule: { kind: 'choice', value: 'good' },
      hint: '核对原对象是否增减，区分没有和没有核实。',
      explanation:
        '换标准不改变原对象总数；新的未知信息须再观察，不能借用例题数据。',
    });
  return questions;
}
export const sujiaoFinalClassificationReviewDraft: Lesson = {
  id,
  title: '期末分类与回顾：标志、衣柜和七项自评',
  textbookTitle: '期末复习：数据分类与评价反思',
  page: 90,
  version: 1,
  status: 'preparing',
  goal: '将标志和衣服按明确标准分类、逐项表示，比较改换标准后的分组；分别回顾本学期七个方面，记录强项与新问题。',
  prerequisite:
    '会分类和一对一记录；准备教材90、93、94页或可访问的电子教材，纸笔与纸卡。',
  parentTip:
    '来源为已实际查看90页标志、93页两衣柜及94页七项评价。文字外形卡与衣服卡是原创抽象示例，不复制教材图片、不教标志法规或根据外形推断真实通行规则；教材实际图片另行观察。可用纸上两个柜框代替收拾家中衣柜，不需购买物品、不记录学校或家庭身份。真实分类与交流人工确认，开放七项回顾correct=null、不自动星级或评价数学喜好；缺材料待做，未来计划不当已做。',
  steps: [
    {
      title: '标志先看外形，再定标准',
      text: '教材90页有不同交通标志。先观察真实教材图片，可以按外轮廓，也可以按明确说清的颜色部分分类，说明分类结果；边框色和底色不混用。本站六张文字卡只练外形与标注颜色，不是真实交通标志，不能据这些卡判断道路规则。每次用一致标准，逐张核对不漏不重。',
      activity:
        '实际观察教材标志，说清外形或具体颜色标准，逐项分类并表示结果；未知图片先问清。',
    },
    {
      title: '两个衣柜，可以采用不同标准',
      text: '用纸画第一柜和第二柜，把六张原创衣服卡先按上衣与连衣裙分；再取出同一批卡，改按红色与蓝色分。第一柜并不永远代表上衣，要每次写清标签。教材93页的衣服另行观察，可选适合原图、能完整分入两柜的标准；颜色不清楚时不能强猜。',
      activity:
        '实际用教材图片在纸上表示两柜分类，再换一个明确标准；核对原对象没有增减。',
    },
    {
      title: '把实际结果表示出来',
      text: '写清本次标准、两个类别和每类记录，一张对象画一个符号。逐张对应原图，再分别数每组、核对合计。分类柜框数量、衣服卡数量、类别数不是同一个问题；没调查的空白不表示0。图示记录只是给定原创示例，不当自己的操作结果。',
      visual: {
        kind: 'classification-record',
        rows: [
          { label: '上衣', mark: 'circle', count: 4 },
          { label: '连衣裙', mark: 'circle', count: 2 },
        ],
      },
      activity:
        '为自己实际两次分类分别画记录、逐张对应核对并说过程，不照抄示例数量。',
    },
    {
      title: '七项分别回顾，不自动评星',
      text: '分别回顾：认读写比较两位数；两类加减计算；数量关系与应用；五类平面图形；不同方向和角度观察；按标准分类；认真思考与主动表达。每项说一个真实例子、困难或需要的帮助，可写尚未做，不能因为网页答对就把全部项目评为熟练。喜欢数学可以说自己的真实感受，不要求固定态度或自动给能力分。',
      activity:
        '与家长对照自己已经做过的记录，七项分别说和记录，实际读写摆观察仍各自人工确认。',
    },
    {
      title: '说强项，再提出新问题',
      text: '选一项自己目前较有把握的内容，说一个实际例子，不与别人作能力排名。再提出自己想问或仍没弄清的新问题，请家长或老师帮助讨论。下次练习写成计划，不把计划当作已经完成；七项回顾与强项、新问题分别保存。',
      activity:
        '实际向家长或同伴说明一个例子并提出自己的新问题；没有交流可如实待做。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      '实际观察教材90页标志，用两种自己说清的标准分别分类并表示结果。标准可为外形或明确的颜色部分，不推断交通规则；没有原图可暂跳，不用本站卡数冒充教材数量。',
      '实际观察教材93页衣服，在纸上画两个柜框，选能完整二分的标准分类，再换一个明确标准重新分，并分别记录各类数量。可用纸面模拟，不必整理真实衣柜；模糊信息先核验。',
      '为上述实际分类逐项画符号或表格，核对每个对象只记一次且总数不变；向家长说明过程，再实际说一个学期收获并提出自己的新问题。未做的部分如实待做。',
    ].map((prompt, index): Question => ({
      id: `${id}-manual-${index}`,
      knowledge: `${id}-manual-${index}`,
      prompt,
      rule: { kind: 'manual' },
      hint: '实际观察、分类、记录或交流完成后确认，网页作答不代替；缺材料可跳过。',
      explanation: '保存实际完成事实，不把计划、示例或自评文字自动当成已操作。',
    })),
    ...(
      [
        [
          'numbers',
          '你认、读、写两位数和比较大小怎样？说一个实际例子、困难或需要的帮助。',
        ],
        [
          'calculation',
          '20以内进位加法、退位减法以及两位数加减整十数或一位数，你分别怎样？按真实例子说明，尚未练的如实记录。',
        ],
        [
          'relations',
          '理解数量关系并解决简单问题时，你怎样分清相差与全部？说一个真实例子或疑问。',
        ],
        [
          'shapes',
          '长方形、正方形、三角形、圆和平行四边形，你怎样辨认？说自己的实际观察或还不清楚的地方。',
        ],
        [
          'observation',
          '从不同方向或角度看同一物体，你怎样比较看到的样子？尚未实际换位也可以如实写。',
        ],
        [
          'classification',
          '你怎样根据特点选一致标准分类并记录？说自己的一个实际例子或困难。',
        ],
        [
          'engagement',
          '数学活动中的思考、提问、表达和感受怎样？可以有不同真实感受，不要求固定喜好或给自己能力等级。',
        ],
        [
          'strength',
          '你觉得目前较有把握的内容是什么？说自己的实际例子，不与他人排名。',
        ],
        [
          'new-question',
          '你还想提出什么数学问题？记自己的问题与准备请教的计划，不把下次准备做的当已经完成。',
        ],
      ] as const
    ).map(([key, prompt]): Question => ({
      id: `${id}-evaluation-${key}`,
      knowledge: `${id}-evaluation-${key}`,
      prompt,
      rule: { kind: 'reflection' },
      hint: '按真实经历或想法记录，可以尚未实践或需要帮助，没有固定句子。',
      explanation: '原话独立保存，correct=null，不自动评分或代替实际任务。',
    })),
  ],
  reviewQuestions: tasks(true),
  review: {
    date: source.checkedAt,
    reviewer: '已读期末分类与评价范围、原创任务核对',
    notes: `依据ISBN ${source.isbn}印刷90、93、94页对应范围。原创六张外形卡、六张衣服卡与复习换条件独立；真实教材分类另行人工确认。七项自评与强项新问题独立null。未知版权版次印次不补造，本课不代替期末剩余图形、数书、等式与所有活动。`,
  },
};

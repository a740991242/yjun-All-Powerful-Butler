import type { TeenGuest, TeenLayoutVisual } from '../learning/teen-layout';
import type { Lesson, Question } from '../learning/types';

import { required } from '../learning/required';
import { teenGuestRoom } from '../learning/teen-layout';
import { sujiaoUpperSource as source } from './sujiao-upper-source';
const id = 'sj-upper-teens-layouts';
const diagram = (
  display: TeenLayoutVisual['display'],
  review = false,
): TeenLayoutVisual => ({
  kind: 'teen-layout',
  display,
  variant: review ? 'review' : 'main',
});
function tasks(review: boolean): Question[] {
  const q = (
    key: string,
    prompt: string,
    rule: Question['rule'],
    explanation: string,
  ): Question => ({
    id: `${id}-${review ? 'r' : 'q'}-${key}`,
    knowledge: `${id}-${key}`,
    prompt,
    rule,
    hint: '先约定从哪边开始，逐个一一对应；空编号不是0，位置的第几和编号不总相同。',
    explanation,
  });
  const variant = review ? 'review' : 'main';
  return [
    {
      ...q(
        'triangle-total',
        '三角排列点图共有多少个点？每个点只算一次，不只数最下面一行。',
        { kind: 'number', value: review ? 10 : 15 },
        review
          ? '按行逐点1、2、3、4，合计10个。'
          : '按行逐点1、2、3、4、5，合计15个；不用先学复杂加法，可逐点接数。',
      ),
      visual: diagram('triangle', review),
    },
    {
      ...q(
        'triangle-rows',
        `从上到下依次填三角图${review ? '四' : '五'}行各有几个点，不填累计数。`,
        { kind: 'steps', values: review ? [1, 2, 3, 4] : [1, 2, 3, 4, 5] },
        '每行单独点数，最下面一行不是全图总数。',
      ),
      visual: diagram('triangle', review),
    },
    {
      ...q(
        'frame-total',
        '方框边上的点一共有多少？四个角各是一点，不能算两次。',
        { kind: 'number', value: review ? 14 : 16 },
        review
          ? '上边5、两个中间行各2、下边5，逐点共14。'
          : '上边5、三个中间行各2、下边5，逐点共16。',
      ),
      visual: diagram('frame', review),
    },
    {
      ...q(
        'frame-rows',
        `从上到下依次填方框图${review ? '四' : '五'}行各有几个点，角点只归它所在行。`,
        { kind: 'steps', values: review ? [5, 2, 2, 5] : [5, 2, 2, 2, 5] },
        '上边和下边各含两个角，中间行只有左右两点，不把空中心当点。',
      ),
      visual: diagram('frame', review),
    },
    {
      ...q(
        'room-total',
        '本图下排十间、上排九间，每个框一间。两排共有几间？不把没有编号的框当不存在，也不把客人当额外房间。',
        { kind: 'number', value: 19 },
        '从1到19一房一号，总数19；空编号仍有房，客人不增加房间。',
      ),
      visual: diagram('rooms', review),
    },
    {
      ...q(
        'room-complete',
        review
          ? '编号规则不变。按编号从大到小记录全部十九间的编号，依次写19到1。'
          : '先下排左至右，再上排左至右，按这个顺序写全部十九间编号1到19，首尾都含。',
        {
          kind: 'steps',
          values: Array.from({ length: 19 }, (_, i) =>
            review ? 19 - i : i + 1,
          ),
        },
        '下排1～10，上排继续11～19；复习只改变记录顺序，不将上排重从1编号。',
      ),
      visual: diagram('rooms', review),
    },
    ...(['A', 'B', 'C', 'D'] as TeenGuest[]).map((guest) => ({
      ...q(
        `guest-${guest}`,
        `按图中下排1～10、上排11～19连续编号规则，客人${guest}在哪一号房间？它的编号未显示，请沿位置核对。`,
        { kind: 'number', value: teenGuestRoom(variant, guest) },
        `客人${guest}在${teenGuestRoom(variant, guest)}号。先看在哪排和排中位置，上排需接下排10继续；不同图客人位置改变，要重新看。`,
      ),
      visual: diagram('rooms', review),
    })),
    {
      ...q(
        'upper-continues',
        review
          ? '上排从左起第六间，编号是16还是6？下排已经编号1～10。'
          : '上排从左起第一间，编号是11还是1？下排已经编号1～10。',
        { kind: 'choice', value: 'continue' },
        '上排排中位置与全图编号分清，下排结束10再接11，上排不重置。',
      ),
      choices: [
        {
          id: 'continue',
          label: review ? '16号，接着下排继续' : '11号，接着下排继续',
        },
        {
          id: 'restart',
          label: review ? '6号，上排从1重排' : '1号，上排从1重排',
        },
      ],
    },
    {
      ...q(
        'corners-once',
        review
          ? '方框四个角如果沿上下边已点过，再点左右边时还要各重复计一次吗？'
          : '角点同时靠两边，是否就代表两个物品？',
        { kind: 'choice', value: 'once' },
        '同一个角点只是一点，共享位置不变成两件物品。',
      ),
      choices: [
        {
          id: 'once',
          label: review ? '不要，已点的角不重复' : '不是，同一个角点只算一次',
        },
        {
          id: 'twice',
          label: review ? '需要，靠两边就算两次' : '是，靠两边就当两个',
        },
      ],
    },
  ];
}
export const sujiaoUpperTeensLayoutsLesson: Lesson = {
  id,
  title: '布点不重漏：十九间房与客人编号',
  textbookTitle: '练习八·有序点数与房间编号',
  page: 84,
  version: 1,
  status: 'available',
  goal: '按真实三角/方框布局不重漏点数，完整十九间连续编号，区分房间总数、排中位置和编号。',
  prerequisite:
    '会数1～19，准备十九张房间卡、点贴或纸笔；上下排固定按图位置，不说楼层号。',
  parentTip: `ISBN ${source.isbn}同版84页已实际查看。原创三角五行15点、方框5×5边16点，变化四行三角10点与5列4行边14点；每角一点。原创十九房下排十/上排九，编号按下排左起1～10再上排11～19，A～D为简单客人代号，位置对应不是教材动物插画。部分编号未显示，不是空房/0；ARIA只报同一可见信息和排中位置，不藏未显示编号。固定teen-layout/display/variant三字段枚举，拒自带答案或房间数据，旧会话/备份版本保持。五项真实摆画与表达人工，反思null，计划分开，教师最终审校未核验。`,
  steps: [
    {
      title: '三角排列，逐行逐点数',
      text: '第一行一个，第二行两个，再三、四、五个，一行一行逐点接着数，最后总共十五个。最下面五个不是全图只有五个。标记点过的位置，每一点只数一次，不因为排列像三角就数三条边。',
      visual: diagram('triangle'),
      activity:
        '实际画或摆五行1/2/3/4/5点，按自己固定路线逐点数并记录各行和全图；再画四行1/2/3/4的变化图独立核对，不删数据后沿旧总数说。',
    },
    {
      title: '方框边点，四角别重数',
      text: '这里五列五行，只在边上有点。可先数上边五个，再依次点中间三行左右各一个，最后下边五个。四个角已在上下边各计一次，中间左右不再重复角；中心空白没有点。原图十六个，变化成五列四行边时十四个。',
      visual: diagram('frame'),
      activity:
        '实际摆或画5×5边点，不填中心，按路线逐点点数并圈自己点过的角；另做5列4行边点，数清每行与总量，保留两图。',
    },
    {
      title: '十九间房，下排结束再接上排',
      text: '十九个框各一间房：下排十间从左到右1～10，上排九间再从左到右11～19。未显示的编号用□留给你核对，不是0，也不是没有房。上排从左第1间是11号，不是1号；排中第几和整个图编号是不同问题。',
      visual: diagram('rooms'),
      activity:
        '实际摆十九张房间卡成下排十/上排九，约定左右方向，逐间编号并填全1～19；上排不要重从1。自己遮住几个编号再补回，逐卡查没有遗漏或重号。',
    },
    {
      title: '找客人时，看排和排中位置',
      text: 'A、B、C、D是四个客人代号，每个在自己的框里，客人不增加房数。A在下排第7间是7号，B下排第9间是9号；C上排第1间接10后是11号，D上排第7间是17号。变化图客人移动后，不能照抄旧房号，要重新沿完整编号核对。',
      visual: diagram('rooms'),
      activity:
        '实际在自己的十九卡图放A于7、B于9、C于11、D于17，分别说排中位置/编号；再移动到3/6/16/18重新找，写下位置和房号，家人按图核对。',
    },
    {
      title: '保留布局，解释不同问题',
      text: '点的总数、房间总数、某客人的编号要分别回答。方框角点重复会多算；把上排从1重编会重复房号；把□当0会错认为没有房。自己的两套点图、完整房间图和客人移动分别记真实操作，不只填网页答案。帮助/困难如实说，未来计划另列。',
      activity:
        '实际把两套点图、十九房编号和客人移动给家人看，解释一个角为何只计一次、上排为何接着10、房号与位置为何不同。未做可待做。',
    },
  ],
  questions: [
    ...tasks(false),
    ...[
      [
        'actual-triangles',
        '实际画或摆五行1/2/3/4/5点及四行1/2/3/4点两图，各逐行记录数量、按固定路线逐点数总量，不只数最下行。保留自己的两图，未画摆暂跳。',
      ],
      [
        'actual-frames',
        '实际摆画5列5行边点与5列4行边点两图，中心不放点，角点仅一次；记录每行和全量，指路线核对有没有漏角或重复。网页看图不确认实做。',
      ],
      [
        'actual-rooms',
        '实际十九张卡摆下排十/上排九，约定左至右，先下排1～10再上排11～19完整编号。逐卡核对十九间不漏不重，遮几个编号再补回，□不是0或没有房。',
      ],
      [
        'actual-guests',
        '实际在自己的十九房图放A/B/C/D于7/9/11/17，分别说排、排中位置和全图编号；再移动至3/6/16/18重新定位记录。人物不增加房数，不照抄旧答案，家长按真实图查看。',
      ],
      [
        'actual-explain',
        '实际展示自己的两套点图、十九卡房间和两次客人位置，解释角点只一次、上排接10、不把排中位置当全图编号。记录真实说法和帮助/困难，未来计划另列，未做暂跳。',
      ],
    ].map(([key, prompt]): Question => ({
      id: `${id}-${required(key)}`,
      knowledge: `${id}-${required(key)}`,
      prompt: required(prompt),
      rule: { kind: 'manual' },
      hint: '真实摆画、标记和解释完成后确认，未做暂跳，计划分开。',
      explanation: '实际布局与编号作品独立人工，网页客观题不代替。',
    })),
    {
      id: `${id}-reflection`,
      knowledge: `${id}-reflection`,
      prompt:
        '写今天真实点图计数或房间编号的一例，怎样避免重复/漏数或重号，及帮助/困难；未做如实说，未来计划另列。',
      rule: { kind: 'reflection' },
      hint: '实际例子与将来准备分开。',
      explanation: '反思correct null，不自动评星。',
    },
  ],
  reviewQuestions: tasks(true),
  review: {
    date: '2026-10-02',
    reviewer: '实际布点与十九房位置/连续编号核对',
    notes:
      '2024年7月第1版、2025年7月第2次印刷84页已实际查看。原创图示不复制动物或教材扫描，复习改变点阵行数、可见编号及客人位置，不改变连续编号规则；教师最终审校未核验。',
  },
};

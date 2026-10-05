import type {
  Lesson,
  PlaneCardsVisual,
  PlaneShape,
  Question,
  Visual,
} from '../learning/types';

import { bnuLowerRecognizeShapesSource as source } from './bnu-lower-recognize-shapes-source';

const id = 'bnu-lower-recognize-shapes';
const names = {
  rectangle: '长方形',
  square: '正方形',
  circle: '圆',
  triangle: '三角形',
} as const;
const colors = {
  red: '红色',
  green: '绿色',
  blue: '蓝色',
  yellow: '黄色',
} as const;
const shapeChoices = Object.entries(names).map(([id, label]) => ({
  id,
  label,
}));
/** Original category order, redrawn with site geometry rather than copied outlines. */
export const bnuRecognizeFirstCards: PlaneCardsVisual = {
  kind: 'plane-cards',
  cards: [
    { shape: 'rectangle', size: 2, turn: 0 },
    { shape: 'triangle', size: 2, turn: 45 },
    { shape: 'circle', size: 1, turn: 0 },
    { shape: 'square', size: 2, turn: 0 },
    { shape: 'circle', size: 2, turn: 0 },
    { shape: 'square', size: 1, turn: 0 },
  ],
};
export const bnuRecognizeLastCards: PlaneCardsVisual = {
  kind: 'plane-cards',
  cards: [
    { shape: 'triangle', size: 1, turn: 0 },
    { shape: 'rectangle', size: 1, turn: 45 },
    { shape: 'rectangle', size: 2, turn: 90 },
    { shape: 'triangle', size: 2, turn: 90 },
    { shape: 'square', size: 2, turn: 45 },
  ],
};
export const bnuRecognizeTrainParts: PlaneCardsVisual = {
  kind: 'plane-cards',
  cards: [
    { shape: 'rectangle', size: 2, turn: 0 },
    { shape: 'rectangle', size: 2, turn: 0 },
    { shape: 'rectangle', size: 2, turn: 0 },
    { shape: 'rectangle', size: 2, turn: 0 },
    { shape: 'rectangle', size: 1, turn: 0 },
    { shape: 'square', size: 2, turn: 0 },
    { shape: 'triangle', size: 1, turn: 0 },
  ],
};
export const bnuRecognizeWheels: PlaneCardsVisual = {
  kind: 'plane-cards',
  cards: Array.from({ length: 8 }, () => ({
    shape: 'circle',
    size: 1,
    turn: 0,
  })),
};
const reviewCards: PlaneCardsVisual = {
  kind: 'plane-cards',
  cards: [
    { shape: 'triangle', size: 2, turn: 135 },
    { shape: 'rectangle', size: 2, turn: 135 },
    { shape: 'circle', size: 1, turn: 90 },
    { shape: 'square', size: 1, turn: 45 },
    { shape: 'circle', size: 2, turn: 0 },
    { shape: 'rectangle', size: 1, turn: 90 },
  ],
};
function task(
  suffix: string,
  prompt: string,
  rule: Question['rule'],
  explanation: string,
  visual?: Visual,
): Question {
  return {
    id: `${id}-${suffix}`,
    knowledge: id,
    prompt,
    rule,
    explanation,
    hint: '先逐个看完整轮廓，再按本题的一种标准判断；字母是图卡位置，不是数量。本站重画图和原书实际活动分开。',
    ...(visual ? { visual } : {}),
  };
}
function category(
  suffix: string,
  prompt: string,
  value: PlaneShape,
  visual: Visual,
): Question {
  return {
    ...task(
      suffix,
      prompt,
      { kind: 'choice', value },
      `${names[value]}；改变大小和转向不改变这类轮廓。`,
      visual,
    ),
    choices: shapeChoices,
  };
}
function choose(
  suffix: string,
  prompt: string,
  labels: string[],
  value: string,
  explanation: string,
): Question {
  return {
    ...task(suffix, prompt, { kind: 'choice', value }, explanation),
    choices: labels.map((label) => ({ id: label, label })),
  };
}
function actual(suffix: string, prompt: string): Question {
  return task(
    suffix,
    prompt,
    { kind: 'manual' },
    '实际完整做过才确认；只看网页、点选或未来计划请跳过，替代材料与纸面方式如实说明。',
  );
}
function record(suffix: string, prompt: string): Question {
  return task(
    suffix,
    prompt,
    { kind: 'reflection' },
    '按自己的话记录，不自动判正确或证明实际活动已完成。',
  );
}

export const bnuLowerRecognizeShapesLesson: Lesson = {
  id,
  textbookTitle: '认识图形',
  title: '描面、十一图识别与按形状涂数',
  page: 76,
  version: 1,
  status: 'available',
  goal: '区分立体物与描出的平面轮廓，完整辨认十一图，说明转向不改类别，先预测再描边，按原图例涂两图并逐类数火车部件。',
  prerequisite: '能逐个点数到11，认识已学的基本立体并愿意观察接触面。',
  parentTip:
    '依据实际阅读76～77页，本站图卡保持原类别次序但使用原创几何，不复制原书比例、三角形样式或插图。十一图拆成前六和后五，后五A～E对应原7～11。火车按原部件类别拆成七车身部件与八车轮清单，重排卡不是完整火车图。原书完整连线、两图涂色与实物描边仍各人工确认；不要求购买、去沙滩或使用刀具。正方形沿本课另分，不重复记成长方形，不教面积公式。',
  review: {
    date: '2026-10-05',
    reviewer: '第三方公开扫描76～77页整页与放大逐项核对',
    notes:
      '六原活动全部对应；最后斜图为正方形，旗杆烟雾非闭合面，船身剩余区域与斜烟囱不强归基本形状。来源核对不替代最终教师试用，未知ISBN版印保持。',
  },
  steps: [
    {
      title: '先选接触面，再想脚印',
      text: '原书沙滩情境先预测物体接触地面留下的轮廓。蓝色正方体平整一面能留下方形轮廓，但脚印不是又一个正方体。紫色物体底面不能只凭颜色或正面透视猜，要选好接触处，再用实物验证。',
      activity:
        '实际选一个安全积木，先说选的接触面和预测，再验证；没有实物可注明纸面说明。',
    },
    {
      title: '做一做，认识四类轮廓',
      text: '按原四组分别描出正方形、长方形、三角形和圆。描的是选定面的边界，不是整个立体物。圆柱平整底面可描圆，不能把弯曲侧面直接说成一个长方形平面；球、滚印和换面要另观察。描边时固定物品，使用安全已有物品与纸笔。',
      activity:
        '实际描出四类轮廓并逐个说名称、所选接触面，允许注明不同替代材料。',
    },
    {
      title: '十一图的前六个',
      text: '原77页从左向右全部十一图。这里重画前1～6为A～F：第1个原书已示范连线，其余也要逐个看完整边界。大小不同不增加类别；本站三角形只重画同类，不冒原书每条边长度或比例。',
      visual: bnuRecognizeFirstCards,
      activity: '实际回原书把前六图逐个连到对应类别，并说明为什么。',
    },
    {
      title: '后五个接着看，不漏最后一图',
      text: '本站后组A～E对应原7～11，不是重新只数到5。第8图斜放仍是长方形，第9图竖放仍是长方形；第11图斜放是正方形。十一图全部完成后再按四类各数一次，原第1个已示范也仍是一张图。',
      visual: bnuRecognizeLastCards,
      activity: '实际把后五图全部连线，再逐类核对十一图是否漏记或重记。',
    },
    {
      title: '把它转一下',
      text: '原对话讨论的是最后斜放的正方形。转一转只是朝向改变，还是同一张图，不能另添一张；大小、颜色与类别分别看。按本题四类分组正方形单列，不额外重复记成长方形。无需教角度数字或集合术语。',
      visual: {
        kind: 'plane-cards',
        cards: [
          { shape: 'square', size: 2, turn: 0 },
          { shape: 'square', size: 2, turn: 45 },
        ],
      },
      activity:
        '实际转同一正方形纸卡或描图，并用自己的话说什么改变、什么没变。',
    },
    {
      title: '身边找一个，先想再描',
      text: '原练1先找物品，先预测描出来的形状，再实际描。预测要先说或先写，不能描完后倒填成原预测；两次不一样也如实保留。换接触面需重新预测，物品名或盒子颜色不能代替实际轮廓。未知还没试不写成0。',
      activity:
        '实际选已有安全物品先记录预测，再固定一个面描边核对；预测与观察分别保存。',
    },
    {
      title: '船图按原图例涂',
      text: '原指定三角形红、圆绿、长方形蓝、正方形黄，配色不跟网页主题变化。船旗三角形涂红、小舱正方形涂黄、大舱长方形涂蓝、四个圆舷窗各绿、四个长方形窗各蓝。旗杆是线，不是闭合面；船甲板和船身剩余外轮廓带斜边并有内圈或窗口，不强说整个都是长方形，也不补造分割线。',
      activity:
        '实际回原船图逐个认轮廓、依指定颜色涂并解释；没有原图请待做，不用四道图例题代替。',
    },
    {
      title: '火箭图也逐个涂',
      text: '火箭尖头和两侧尾翼是三个三角区域，按图例涂红；上、下两块正方形各黄，中部长方形蓝。三个三角形是三个区域，不能只涂尖头；两张作品分开核对。这里17个已识别区域是船11处加火箭6处，不是原图所有白色区域总数。',
      activity:
        '实际回原火箭图完成尖头、两尾翼、两方块和中间长方形，并核对船图，做过再确认。',
    },
    {
      title: '火车车身部件逐个分类',
      text: '回原火车看三节车厢、车头底座和顶横条共五个长方形；驾驶室为一个正方形，前部为一个三角形。本站把这七个基本部件重排成清单A～G，不是原火车插图或比例；不把整个外接框再算一件。蓝烟囱轮廓带斜上边和内部斜线，不从烟囱名称强猜长方形。',
      visual: bnuRecognizeTrainParts,
      activity:
        '实际回原火车逐个指车厢、底座、顶横条、驾驶室、前部，再填写相应三个空。',
    },
    {
      title: '八个车轮与四空核对',
      text: '原三节车厢各两个轮，车头两个，共八个圆；本站轮卡A～H各对应一个轮，不把同轮反复看增加总数。原四空依次为正方形、三角形、长方形、圆，填1、1、5、8并回图检查。烟雾是开放曲线，不是圆；点网页只能记录网页作答，不能自动说已涂、描或与同伴交流。',
      visual: bnuRecognizeWheels,
      activity:
        '实际逐轮数原图、完成全部四空，再与同伴说明逐一计数的方法；未来计划另记。',
    },
  ],
  questions: [
    ...[bnuRecognizeFirstCards, bnuRecognizeLastCards].flatMap(
      (visual, group) =>
        visual.cards.map((card, index) =>
          category(
            `row-${group === 0 ? index + 1 : index + 7}`,
            `本站${group === 0 ? '前六组' : '后五组'}${String.fromCodePoint(65 + index)}（对应原第${group === 0 ? index + 1 : index + 7}图）的轮廓是哪一类？`,
            card.shape,
            visual,
          ),
        ),
    ),
    ...source.categories.map((shape) =>
      task(
        `row-count-${shape}`,
        `按刚核对的原十一图，本题${names[shape]}有多少个？四类分别计，原已示范也算一个。`,
        { kind: 'number', value: source.matching.counts[shape] },
        `完整十一图逐类计，${names[shape]}有${source.matching.counts[shape]}个。`,
      ),
    ),
    ...source.categories.map((shape) => ({
      ...task(
        `color-${shape}`,
        `按原77页指定图例，${names[shape]}应涂什么颜色？这里问原指定颜色，不问个人喜好。`,
        { kind: 'choice', value: source.coloring.legend[shape] },
        `原图例规定${names[shape]}用${colors[source.coloring.legend[shape]]}；实际两作品涂色另确认。`,
      ),
      choices: Object.entries(colors).map(([id, label]) => ({ id, label })),
    })),
    ...(['square', 'triangle', 'rectangle', 'circle'] as const).map((shape) =>
      task(
        `train-${shape}`,
        `本站按原火车已核对部件重排清单中${names[shape]}有几个？车身七部件与车轮八部件分清，不把烟囱或烟雾猜作此类。`,
        { kind: 'number', value: source.train.confirmedCounts[shape] },
        `原基本部件中${names[shape]}${source.train.confirmedCounts[shape]}个，逐一指回所数部件；本站清单不是原火车比例。`,
        shape === 'circle' ? bnuRecognizeWheels : bnuRecognizeTrainParts,
      ),
    ),
    choose(
      'rotation-category',
      '把同一正方形纸卡转向，类别改变了吗？',
      ['改变成新的长方形', '没改变，还是正方形'],
      '没改变，还是正方形',
      '转向不改变原四条等长边和四个直角，不新增图卡。',
    ),
    choose(
      'rotation-count',
      '同一张纸卡转过一次，又看了一次，就有两张实物卡了吗？',
      ['还是一张', '变成两张'],
      '还是一张',
      '操作次数和物品数量不同。',
    ),
    choose(
      'face',
      '正方体选一个平整面描出的纸面轮廓就是新的正方体吗？',
      ['不是，是平面轮廓', '是一个新的立体'],
      '不是，是平面轮廓',
      '描图不新增立体，面与整个物体不同。',
    ),
    choose(
      'prediction-order',
      '原身边描物品任务先做哪一步？',
      ['先说预测再描边核对', '描完再倒填原预测'],
      '先说预测再描边核对',
      '原预测与实际观察分开保存，预测不一致也可如实记录。',
    ),
    choose(
      'unknown-footprint',
      '只知道紫色物品和正面透视图，没核对接触底面，能唯一确定脚印吗？',
      ['不能，要看选定接触面', '能，按颜色就知道'],
      '不能，要看选定接触面',
      '颜色和正面轮廓不能唯一决定隐藏接触面。',
    ),
    choose(
      'open-lines',
      '旗杆和火车烟雾开放线条能当成闭合的圆或长方形区域吗？',
      ['不能，先检查是否闭合', '都能，按物品名称猜'],
      '不能，先检查是否闭合',
      '开放线与封闭区域不同，物品名称也不能代替轮廓。',
    ),
    task(
      'site-zero',
      '本站另问：八张车轮卡全是圆，其中三角形卡有几张？已给完整清单，空白不当0。',
      { kind: 'number', value: 0 },
      '已经完整核对全是圆，三角形为0张；这是本站新问法。',
      bnuRecognizeWheels,
    ),
    actual(
      'actual-footprint',
      '实际选接触面预测并验证脚印，说明所用实物或纸面方式；未做请跳过。',
    ),
    actual(
      'actual-four-traces',
      '实际按原四组描出四类轮廓并逐个命名、说明接触面；全做过才确认。',
    ),
    actual(
      'actual-eleven',
      '实际回原书完整连十一图，包含已示范第1个，再按四类检查；做过再确认。',
    ),
    actual(
      'actual-turn',
      '实际转同一张方形纸卡并解释类别与数量不变；只看图请跳过。',
    ),
    actual(
      'actual-predict',
      '实际选身边物品，在描边前先说或记录预测；描完倒填不作原预测。',
    ),
    actual(
      'actual-trace-check',
      '对同一选定面实际描边并核对原预测，保留不同结果；未试请跳过。',
    ),
    actual(
      'actual-boat',
      '实际回原船图逐个认区域、按指定图例完整涂色并检查；未做请跳过。',
    ),
    actual(
      'actual-rocket',
      '实际回原火箭图完整涂尖头、两翼、两方块与中段并检查；未做请跳过。',
    ),
    actual(
      'actual-train',
      '实际回原火车逐部件逐轮点数，填写全部四空并核对；只答网页不确认。',
    ),
    actual(
      'actual-share',
      '实际向同伴说明一种描面或分类计数方法，听一种看法；只有计划请跳过。',
    ),
    record(
      'prediction-record',
      '分别记录描边前的预测、实际轮廓和选定接触面，未试如实写。',
    ),
    record(
      'reflection',
      '记录实际发现、容易漏的部件或仍想核对的轮廓，不自动评星。',
    ),
    record('plan', '记录下次想尝试的材料和方法，未来计划不当已完成。'),
  ],
  reviewQuestions: [
    ...reviewCards.cards
      .slice(0, 4)
      .map((card, index) =>
        category(
          `review-card-${index + 1}`,
          `换六张新图卡，看${String.fromCodePoint(65 + index)}属于哪类；次序、大小和朝向都换了，不抄原十一图位置。`,
          card.shape,
          reviewCards,
        ),
      ),
    task(
      'review-circles',
      '新六卡中完整数出圆有几张？每字母一张，不按旧十一图总数。',
      { kind: 'number', value: 2 },
      '新C和E是圆，共2张。',
      reviewCards,
    ),
    task(
      'review-rectangles',
      '新六卡长方形有几张？D正方形沿本题单列不重复加。',
      { kind: 'number', value: 2 },
      '新B和F是长方形，共2张。',
      reviewCards,
    ),
    choose(
      'review-contact',
      '换一件物品并改选接触处，能直接照抄上次描出的轮廓吗？',
      ['不能，需要重新预测和验证', '能，只按上次答案'],
      '不能，需要重新预测和验证',
      '物体和接触条件改变，不能沿用旧观察。',
    ),
    choose(
      'review-color',
      '换一个自由涂色活动，没给原图例限制，就必须只认正方形黄色吗？',
      ['不必须，自由配色与原指定任务不同', '必须，所有活动只准原颜色'],
      '不必须，自由配色与原指定任务不同',
      '原题指定与新自由活动条件不同，不把一种题目规定当所有真实图形固定颜色。',
    ),
  ],
};

import type {
  Lesson,
  PlaneCardsVisual,
  Question,
  Visual,
} from '../learning/types';

const names = {
  rectangle: '长方形',
  square: '正方形',
  triangle: '三角形',
  circle: '圆',
} as const;
const shapeChoices = Object.entries(names).map(([id, label]) => ({
  id,
  label,
}));
const mainCards: PlaneCardsVisual = {
  kind: 'plane-cards',
  cards: [
    { shape: 'rectangle', size: 2, turn: 90 },
    { shape: 'square', size: 1, turn: 45 },
    { shape: 'triangle', size: 2, turn: 180 },
    { shape: 'circle', size: 1, turn: 0 },
  ],
};
const newCards: PlaneCardsVisual = {
  kind: 'plane-cards',
  cards: [
    { shape: 'circle', size: 2, turn: 0 },
    { shape: 'triangle', size: 1, turn: 90 },
    { shape: 'rectangle', size: 1, turn: 45 },
    { shape: 'square', size: 2, turn: 90 },
  ],
};
function task(
  id: string,
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
    hint: '先说清对象、选定的面和操作条件；网页图是原创示意，实际操作与自己的记录另记。',
    ...(visual ? { visual } : {}),
  };
}
function choice(
  id: string,
  suffix: string,
  prompt: string,
  value: string,
  labels: string[],
  explanation: string,
  visual?: Visual,
): Question {
  return {
    ...task(id, suffix, prompt, { kind: 'choice', value }, explanation, visual),
    choices: labels.map((label) => ({ id: label, label })),
  };
}
function actual(id: string, suffix: string, prompt: string): Question {
  return task(
    id,
    suffix,
    prompt,
    { kind: 'manual' },
    '实际做过才确认；只有计划或网页作答请跳过，纸面替代须如实记录。',
  );
}
function record(id: string, suffix: string, prompt: string): Question {
  return task(
    id,
    suffix,
    prompt,
    { kind: 'reflection' },
    '按自己的话记录，不自动判正确或确认实际活动。',
  );
}
function identify(
  id: string,
  cards: PlaneCardsVisual,
  review: boolean,
): Question[] {
  return cards.cards.map((card, i) => ({
    ...task(
      id,
      `${review ? 'review' : 'main'}-shape-${i}`,
      `${review ? '新的复习图' : '本站原创图'}中${String.fromCodePoint(65 + i)}的轮廓是哪一类？朝向和大小不是类别。`,
      { kind: 'choice', value: card.shape },
      `${names[card.shape]}；转向和改变大小不改变这一类形状。`,
      cards,
    ),
    choices: shapeChoices,
  }));
}
const printId = 'bnu-lower-trace-print';
export const bnuLowerTracePrintLesson: Lesson = {
  id: printId,
  textbookTitle: '做一做',
  title: '描轮廓、换接触面与自主印图案',
  page: 18,
  version: 1,
  status: 'available',
  goal: '先预测再描印，比较同一物品换接触处后的轮廓，用印痕制作自己的图案并交流。',
  prerequisite: '能观察物体的外形，知道纸上轮廓与物体本身不同。',
  parentTip:
    '对应实际阅读第18～19页。原削笔器、条形材料和7形积木有不规则轮廓，不强归四类；本站四图卡是原创形状辨认迁移，不冒原印图。选安全可清洁的材料，成人协助印色，纸面描边可替代并注明，不要求新购材料。',
  review: {
    date: '2026-10-05',
    reviewer: '公开扫描18～19页逐项阅读',
    notes:
      '描/印、同一物品换面、自由积木图案交流、找两个物品先预测后验证、三图说像什么再制作各自对应，开放创作不按标准形象评分。',
  },
  steps: [
    {
      title: '轮廓来自怎样接触',
      text: '第18页描一圈或印一印留下纸面轮廓，物品本身仍是立体。削笔器、条形材料与7形积木可能有不规则轮廓，不是每个印痕都必须叫正方形或圆。先说明哪一处接触纸面。',
      activity: '实际选安全物品描或印，指出原物、接触处与纸上印痕。',
    },
    {
      title: '同一物品还能留下另一轮廓',
      text: '原页同一物品换接触处后，留下的轮廓可以不同。不是只换颜色，也不是物品变成了新物品。换一个面、换一种允许的操作后重新观察，不仅凭物品名字猜。',
      activity: '实际对照三组物品，比较至少一个物品的两种接触方式与印痕。',
    },
    {
      title: '用印痕组成自己的图案',
      text: '第19页展示毛虫、鱼和箭头形等积木印图。可以借不同印痕组合成自己的作品，作品名称和画法开放，不要求复制示例。本站四张图卡只帮助辨轮廓，不是这三件原作品的部件数量。',
      visual: mainCards,
      activity:
        '实际用已有材料描印一个喜欢的图案，介绍用了什么轮廓和怎样安排。',
    },
    {
      title: '先预测，再验证两个物品',
      text: '练习要从身边找两个物品，先想可能出现的轮廓，再实际描或印，回头比对预测。预测不同于验证，猜得不一样也要保留原预测，不能事后改成早就知道。',
      activity: '分别记录两个物品的原预测、接触方式和实际结果。',
    },
    {
      title: '看图说像什么，再动手',
      text: '原练习三图可像花、动物或小车等，也可提出有依据的其它想法。先描述看见的轮廓，再说像什么和怎样做。实际制作、向同伴表达与未来计划分开，不由选择题确认创作完成。',
      activity:
        '实际回看三幅原图，说自己的联想并自选一幅做或改做，向同伴交流。',
    },
  ],
  questions: [
    ...identify(printId, mainCards, false),
    choice(
      printId,
      'whole',
      '把物品描在纸上，纸面轮廓就是一个新的立体物品吗？',
      '不是',
      ['是', '不是'],
      '描图是平面轮廓，不新增立体物品。',
    ),
    choice(
      printId,
      'contact',
      '同一个物品改用另一个接触处描印，轮廓一定完全一样吗？',
      '不一定，要重新观察',
      ['一定一样', '不一定，要重新观察'],
      '同一物品不同接触处可能不同；实物要验证。',
    ),
    choice(
      printId,
      'prediction',
      '找两个物品，哪个顺序保留真正的预测？',
      '先写预测再描印并比对',
      ['先写预测再描印并比对', '做完后把结果抄成预测'],
      '先留下预测，再观察实际结果，不事后冒称提前知道。',
    ),
    choice(
      printId,
      'irregular',
      '第18页7形或削笔器印痕不符合四图卡之一，就一定描错了吗？',
      '不一定，可能是其它轮廓',
      ['一定描错', '不一定，可能是其它轮廓'],
      '物品可有不规则轮廓；不强行套四种名字。',
    ),
    actual(
      printId,
      'actual-trace',
      '实际对照18页描一圈或印一印，说明原物/接触处/印痕；做过再确认。',
    ),
    actual(
      printId,
      'actual-contact',
      '实际比较原三组物品，至少一物两种接触处的印痕都观察并说明；做过再确认。',
    ),
    actual(
      printId,
      'actual-pattern',
      '实际用积木或纸面替代制作自己的印痕图案，不只点选；做过再确认。',
    ),
    actual(
      printId,
      'actual-first-object',
      '实际为第一个自选物品先写预测，再描印并比较；做过再确认。',
    ),
    actual(
      printId,
      'actual-second-object',
      '实际为第二个不同物品先写预测，再描印并比较；做过再确认。',
    ),
    actual(
      printId,
      'actual-three-pictures',
      '实际观察19页三图分别说联想及轮廓依据，允许其它合理说法；做过再确认。',
    ),
    actual(
      printId,
      'actual-make',
      '实际自选原三图之一制作或改作，说清材料和操作；做过再确认。',
    ),
    actual(
      printId,
      'actual-share',
      '实际向同伴或家人介绍作品并听取一种看法；未交流请跳过。',
    ),
    record(
      printId,
      'prediction-record',
      '分别记录两个物品的原预测与实际轮廓，尚未做如实写。',
    ),
    record(printId, 'reflection', '记录实际发现或想研究的轮廓问题。'),
    record(printId, 'plan', '记录下一次想尝试的材料和接触方式；计划不当已做。'),
  ],
  reviewQuestions: identify(printId, newCards, true),
};
const faceId = 'bnu-lower-find-traces';
export const bnuLowerFindTracesLesson: Lesson = {
  id: faceId,
  textbookTitle: '找一找',
  title: '找印痕来源：平面、滚印与整个物体',
  page: 20,
  version: 1,
  status: 'available',
  goal: '按接触面和操作配对四种轮廓，比较同一积木不同面，说明圆柱平面描印与曲面滚印的区别。',
  prerequisite: '知道描印轮廓与整个物体不同，能辨认四种基本平面轮廓。',
  parentTip:
    '对应实际阅读20～21页。本站立体描面模型原创，三棱柱只是本站示例，不冒原积木所有尺寸；房屋图原物配对开放，选择具体面后验证，不说一个三角印痕唯一确定物体种类。按一年级分类正方形另分组，不展开集合定义。',
  review: {
    date: '2026-10-05',
    reviewer: '公开扫描20～21页及原配对逐项阅读',
    notes:
      '四印痕来源、正方体/长方体换面、圆柱底面圆与侧面滚印长方形、三角与长方来自同一积木、四物描边配对、三实物可能印痕、小屋各部件分别验证；原开放对象不强唯一。',
  },
  steps: [
    {
      title: '平面轮廓与立体来源',
      text: '第20页有方形、长方形、三角形、圆四个印痕。正方体的平面可印方形，长方体选定面可印长方形，原红色积木选定三角形面可印三角形，圆柱底面可印圆。印痕只来自接触部分，不是整个物体都变成了平面。',
      visual: mainCards,
      activity: '实际把原四印痕与四积木配对，说清所选的接触处。',
    },
    {
      title: '同一正方体换面',
      text: '同一正方体各面形状大小相同，换面描印还是可重合的正方形。本站A/B/C三个描面图是三个选定面，不表示整个积木只有三个面。',
      visual: { kind: 'solid-face-traces', solid: 'cube' },
      activity: '实际给同一正方体换不同面描印，再转向叠放比较。',
    },
    {
      title: '同一长方体的不同描面',
      text: '原示例长方体换面能留下大小不同的长方形。同叫长方形不说明可重合，也不能说每一个长方体都必有三种大小。本站三方向不同长度示例A/B/C分别为不同长方形；另一方端长方体还能留下正方形。',
      visual: { kind: 'solid-face-traces', solid: 'cuboid-distinct' },
      activity:
        '实际给一个长方体换面描印，按真实形状大小比较，不凭透视图量边。',
    },
    {
      title: '圆柱滚一滚不是平面印一次',
      text: '第21页图②长方形与④圆可来自同一圆柱：平整底面印圆，曲面涂色滚过纸面可留下展开的长方形痕迹。长方形来自滚动操作，不能说圆柱有一个长方形平面。没滚满或倾斜时实际痕迹可能不同，原示意不是任意滚法保证。',
      activity: '实际分别尝试或纸面说明底面描圆与曲面滚印，清楚区分两种操作。',
    },
    {
      title: '同一物体也能印三角和长方',
      text: '原图②和③讨论来自同一积木，要找既可接触长方形面也可接触三角形面的原物再验证。本站三棱柱A为三角形面、B为长方形面，可作这样的例子；一个三角印痕本身不能唯一认出所有物体种类。',
      visual: { kind: 'solid-face-traces', solid: 'triangular-prism' },
      activity: '实际回到原积木找对应接触面，描印两种轮廓并解释。',
    },
    {
      title: '异形物体仍按轮廓连线',
      text: '练习四条轮廓对应十字块、细长笔侧面、长方体块与小熊形物品。先逐段看边界，再连原物；不能把十字形或小熊形硬叫正方形。下一题正方体、圆柱和长方体分别尝试能印的轮廓，操作方法要说明。',
      activity: '实际完成四轮廓配对，并分别用三物尝试、说清接触面或滚动方式。',
    },
    {
      title: '小屋各部分分别找',
      text: '原小屋屋顶是三角轮廓，主体和窗是方形轮廓，门与烟囱是长方轮廓。四种物品先找合适接触面再试，主体大方形与小窗需匹配实际大小；图中有方形面并不保证印痕一定大小合适。允许其它材料和做法说明，不把只有一个轮廓认作唯一物体。',
      activity: '实际逐部分说明来源并描出小屋，记录已试和待核对的部分。',
    },
  ],
  questions: [
    ...identify(faceId, mainCards, false),
    ...(['A', 'B', 'C'] as const).map((letter) => ({
      ...task(
        faceId,
        `cube-${letter}`,
        `本站同一正方体${letter}面平放描图是哪种轮廓？看对应描图，不按透视猜。`,
        { kind: 'choice', value: 'square' },
        '同一正方体各面形状大小相同，都是正方形。',
        { kind: 'solid-face-traces', solid: 'cube' },
      ),
      choices: shapeChoices,
    })),
    ...(['A', 'B', 'C'] as const).map((letter) => ({
      ...task(
        faceId,
        `cuboid-${letter}`,
        `本站三方向长度不同的长方体${letter}面平放描图是哪类？`,
        { kind: 'choice', value: 'rectangle' },
        '这个已给模型所选面描成长方形，不将斜透视轮廓当描图。',
        { kind: 'solid-face-traces', solid: 'cuboid-distinct' },
      ),
      choices: shapeChoices,
    })),
    choice(
      faceId,
      'cylinder-bottom',
      '按原操作，圆柱平整底面描印的轮廓是什么？',
      '圆',
      ['圆', '长方形', '三角形'],
      '平整底面的边界是圆；与曲面滚动不同。',
    ),
    choice(
      faceId,
      'cylinder-roll',
      '原圆柱曲面滚过纸面可留下长方形痕迹，能说它有长方形平面吗？',
      '不能，是滚印展开痕迹',
      ['能，曲面就是平面', '不能，是滚印展开痕迹'],
      '滚动过程扫出的展开痕迹与直接接触一个平面印一次不同。',
    ),
    ...(['A', 'B'] as const).map((letter) => ({
      ...task(
        faceId,
        `prism-${letter}`,
        `本站三棱柱选定${letter}面的描图属于哪一类？`,
        { kind: 'choice', value: letter === 'A' ? 'triangle' : 'rectangle' },
        letter === 'A' ? 'A描三角形。' : 'B描长方形。',
        { kind: 'solid-face-traces', solid: 'triangular-prism' },
      ),
      choices: shapeChoices,
    })),
    ...(
      [
        ['roof', '屋顶', 'triangle'],
        ['body', '主体', 'square'],
        ['window', '窗', 'square'],
        ['door', '门', 'rectangle'],
        ['chimney', '烟囱', 'rectangle'],
      ] as const
    ).map(([suffix, part, value]) => ({
      ...task(
        faceId,
        `house-${suffix}`,
        `按原小屋图已核对轮廓，${part}属于哪一类？实际配物和大小另核对。`,
        { kind: 'choice', value },
        `${part}轮廓为${names[value]}，不由类别推定实物印痕大小合适。`,
      ),
      choices: shapeChoices,
    })),
    choice(
      faceId,
      'unique',
      '只知道某物印出三角形，能唯一确定物体种类吗？',
      '不能，还要看物体和接触处',
      ['能，只有一种物体', '不能，还要看物体和接触处'],
      '不同物体可有三角形接触面，不从一个印痕唯一推整个物体。',
    ),
    choice(
      faceId,
      'whole',
      '图里只选正方体A/B/C描面，是整个物体只有三个面吗？',
      '不是，只选了三个面',
      ['是，没画的面就不存在', '不是，只选了三个面'],
      '所选描面不是全部面，也不新增积木。',
    ),
    choice(
      faceId,
      'exact',
      '两个印痕都叫长方形，就一定同样大小且可完全叠齐吗？',
      '不一定，要实际叠放比较',
      ['一定一样', '不一定，要实际叠放比较'],
      '名称、大小和朝向分开判断。',
    ),
    actual(
      faceId,
      'actual-four',
      '实际完成20页四印痕/积木配对并分别描印验证；做过再确认。',
    ),
    actual(
      faceId,
      'actual-cube',
      '实际用同一正方体换面描印并叠放比较；做过再确认。',
    ),
    actual(
      faceId,
      'actual-cuboid',
      '实际用同一长方体换面描印，比较真实大小；做过再确认。',
    ),
    actual(
      faceId,
      'actual-cylinder',
      '实际或注明纸面方式完成圆柱底面圆与曲面滚印长方形两种解释；做过再确认。',
    ),
    actual(
      faceId,
      'actual-triangle-rectangle',
      '实际找原物或注明替代物的三角/长方接触面，分别描印验证；做过再确认。',
    ),
    actual(
      faceId,
      'actual-outlines',
      '实际完成21页十字、笔侧面、长方块、小熊四轮廓连线并说依据；做过再确认。',
    ),
    actual(
      faceId,
      'actual-three-objects',
      '实际尝试正方体、圆柱、长方体各能留下什么痕迹，说明操作；做过再确认。',
    ),
    actual(
      faceId,
      'actual-house',
      '实际对原小屋屋顶/主体/窗/门/烟囱逐一找来源、试描并说明尺寸；做过再确认。',
    ),
    record(faceId, 'reflection', '记录实际试出的轮廓与来源，未试的标待核对。'),
    record(faceId, 'plan', '记录下次想试的物体与接触方式，计划不当已做。'),
  ],
  reviewQuestions: [
    ...identify(faceId, newCards, true),
    {
      ...task(
        faceId,
        'review-square-end',
        '换本站方端长方体C面，平放描图是哪类？',
        { kind: 'choice', value: 'square' },
        'C是方形端面；这次不能沿用三方向各不同长方体的长方形答案。',
        { kind: 'solid-face-traces', solid: 'cuboid-square-end' },
      ),
      choices: shapeChoices,
    },
  ],
};
const shadowId = 'bnu-lower-shadow-theatre';
const shadowMain: Visual = { kind: 'shadow-size', variant: 'main' };
const shadowReview: Visual = { kind: 'shadow-size', variant: 'review' };
export const bnuLowerShadowTheatreLesson: Lesson = {
  id: shadowId,
  textbookTitle: '影子剧场',
  title: '影子故事、固定条件与大小变化',
  page: 22,
  version: 1,
  status: 'available',
  goal: '按原四幕讲影子故事，合作选择材料做影子，在固定灯屏条件下比较同物离灯位置与影子大小，并提出自己的研究问题。',
  prerequisite: '能按先后描述图画，区分物体与平面轮廓，愿意记录实际观察。',
  parentTip:
    '实际阅读22～23页。本站灯屏模型原创，只示同一不透光板、点光源/屏固定、沿同轴移动的两个位置；不是所有照明/距离条件下的无条件规律，不教相似公式。用安全低亮光源和纸面，不直视灯、不用激光、成人协助，不强制暗室或新购材料。皮影戏简介按教材介绍，不装未经授权视频。',
  review: {
    date: '2026-10-05',
    reviewer: '公开扫描22～23页逐项阅读',
    notes:
      '原四幕顺序与四情节、文具盒花盆/铅笔笔帽嫩芽合作、手兔远近两比较、三手势试做、皮影文化与单元收获问题交流分别对应；实作人工，不用点选替代。',
  },
  steps: [
    {
      title: '四幕讲成一个故事',
      text: '第22页四幕依次为种子发芽、小苗长高、开花蝴蝶围绕、结许多果实吸引小兔小鸟。先说每幕已有的信息，再连成自己的故事；画面在不同时间出现同一植物，不把四幕当四盆同时摆的植物。想象对话可以不同，但与观察到的顺序分清。',
      activity: '实际依四幕向同伴讲故事，用自己的语言，说明图中信息与想象。',
    },
    {
      title: '合作把物品用作角色',
      text: '原演示用文具盒的长方影子像花盆，再用铅笔和笔帽做嫩芽。物品本身不是花盆或植物，这是故事里的角色选择。与同伴先约定材料、角色和操作，再分别做出故事影子；只有讨论或计划不算已合作表演。',
      activity: '实际选已有安全物品合作做故事影子，或纸面替代并如实记录。',
    },
    {
      title: '固定灯和屏，再改变物的位置',
      text: '原第23页手兔离灯远一些影子变小，近一些影子变大。比较需保持同一手势、灯与屏固定，只沿灯屏之间改变位置。本站A/B是两次同一小板的位置，实线是板与屏上痕迹，虚线只说明光线边界；不量图中厘米，也不由示意确认实际手影已做。',
      visual: shadowMain,
      activity:
        '实际固定灯屏与手势，分别记录两位置的影子；只看模型不能确认实验。',
    },
    {
      title: '手势、距离和影子分开观察',
      text: '原练习有三种手势影子，形似什么可以合理讨论。先固定位置比较手势，再固定手势比较距离，一次改变一个条件。身体大小不因影子变大而增加；相同影子也不能唯一确定物体。',
      activity: '实际尝试原三种手势或注明替代手势，说联想及观察条件。',
    },
    {
      title: '皮影与自己的问题',
      text: '教材介绍皮影戏也称影子戏、灯影戏，表演者在幕后操作角色讲故事。可以讨论影子与故事的关系，不要求播放或复刻原图。单元收获、想研究的问题和未来计划分开记录，再与同伴交流；不把未观察当0或假装已演过。',
      activity: '实际说一项收获和一个想研究的问题，与同伴交流。',
    },
  ],
  questions: [
    {
      ...task(
        shadowId,
        'story-order',
        '按原四幕已有信息排序，不将自己想象的对话当画面事实。',
        { kind: 'sequence', values: ['sprout', 'grow', 'flower', 'fruit'] },
        '先发芽，再长高，再开花，最后结许多果实。',
      ),
      choices: [
        { id: 'fruit', label: '结许多果实' },
        { id: 'flower', label: '开花' },
        { id: 'sprout', label: '种子发芽' },
        { id: 'grow', label: '小苗长高' },
      ],
    },
    choice(
      shadowId,
      'same-plant',
      '四幕是同一植物不同阶段，可以直接说同时有四盆植物吗？',
      '不能，不同时间不能相加成四盆',
      ['能，四幅就是四盆', '不能，不同时间不能相加成四盆'],
      '先后画面重复出现同一对象，不增加同时对象数量。',
    ),
    choice(
      shadowId,
      'role',
      '文具盒的影子在故事中用作花盆，就证明文具盒真的是花盆吗？',
      '不是，是选择故事角色',
      ['是，物体种类改变了', '不是，是选择故事角色'],
      '原物和故事角色不同，不由影子角色改物体。',
    ),
    choice(
      shadowId,
      'bigger',
      '本站两次试验哪一幅的屏上影子较大？灯屏和小板大小相同。',
      'A',
      ['A', 'B'],
      'A的小板更靠近固定点光源，屏上的影子更大；只在明确固定条件中比较。',
      shadowMain,
    ),
    choice(
      shadowId,
      'near-light',
      '在本站固定灯屏、同一板同轴移动条件下，板更近灯，屏上影子怎样？',
      '变大',
      ['变小', '变大', '一定不变'],
      '比较控制条件不变，更近点光源的投影较大。',
    ),
    choice(
      shadowId,
      'far-light',
      '在相同固定条件下，板从较近灯处移向屏、离灯更远，影子怎样？',
      '变小',
      ['变小', '变大', '物体变成另一类'],
      '同一物体未改变大小，改变的是影子大小。',
    ),
    choice(
      shadowId,
      'control',
      '要只研究离灯距离，哪一组做法便于公平比较？',
      '固定灯屏和手势只移手的位置',
      ['同时换灯换手势移屏', '固定灯屏和手势只移手的位置'],
      '一次只改变要研究的条件，不能把同时多变当同一比较。',
    ),
    choice(
      shadowId,
      'body-size',
      '影子变大，就说明同一小板自身长大了吗？',
      '不是，板的大小没变',
      ['是，板会长大', '不是，板的大小没变'],
      '物体大小和影子大小分别观察。',
    ),
    choice(
      shadowId,
      'unknown',
      '只看到一个长方形影子，能唯一确定是哪一件物品吗？',
      '不能，还需要物体和照明条件',
      ['能，只有文具盒', '不能，还需要物体和照明条件'],
      '不同物品在不同条件下可以产生相似影子。',
    ),
    choice(
      shadowId,
      'simulation',
      '看过本站灯屏示意，能自动说已做过真实手影实验吗？',
      '不能，实际做过才确认',
      ['能，看过就已做', '不能，实际做过才确认'],
      '模型观察与真实实验分开记录。',
    ),
    actual(
      shadowId,
      'actual-story',
      '实际依原四幕向同伴讲完整影子故事，分清观察信息与想象；做过再确认。',
    ),
    actual(
      shadowId,
      'actual-cooperate',
      '实际与同伴约定角色、材料并做故事影子；只讨论或纸面替代须如实说明。',
    ),
    actual(
      shadowId,
      'actual-far',
      '实际固定灯屏手势，移到离灯较远的位置观察记录；未试请跳过。',
    ),
    actual(
      shadowId,
      'actual-near',
      '实际保持其它条件，移到离灯较近处观察比较；未试请跳过。',
    ),
    actual(
      shadowId,
      'actual-three-gestures',
      '实际尝试原三手势或注明替代，逐个说影子联想与条件；做过再确认。',
    ),
    actual(
      shadowId,
      'actual-share',
      '实际与同伴交流一个单元收获和想研究的问题；只计划请跳过。',
    ),
    record(
      shadowId,
      'observations',
      '记录固定了哪些条件、两位置实际结果；未做如实写。',
    ),
    record(
      shadowId,
      'question',
      '记录自己想研究的影子或轮廓问题，不强求已有答案。',
    ),
    record(shadowId, 'plan', '记录下次准备怎样验证，计划与已发生实验分开。'),
  ],
  reviewQuestions: [
    choice(
      shadowId,
      'review-bigger',
      '换新的A/B位置，哪次屏上影子较大？同一板、灯屏仍固定。',
      'B',
      ['A', 'B'],
      '这次B靠近灯，不能抄主图A。',
      shadowReview,
    ),
    choice(
      shadowId,
      'review-farther',
      '新图A到B移动后，小板离固定灯更近还是更远？',
      '更近',
      ['更近', '更远', '大小改变'],
      '新图A较远、B较近，小板自身大小没变。',
      shadowReview,
    ),
    choice(
      shadowId,
      'review-condition',
      '另一组试验换了手势又移动了屏，能单独判断离灯距离的作用吗？',
      '不能，多项条件都改变',
      ['能，所有变化都来自距离', '不能，多项条件都改变'],
      '须控制其它条件才能只比较距离。',
    ),
    choice(
      shadowId,
      'review-culture',
      '按教材介绍，影子戏的角色通常在哪操作？',
      '幕布后',
      ['幕布后', '只在纸上写数字'],
      '皮影角色在幕后操作讲故事，简介不自动确认看过演出。',
    ),
  ],
};

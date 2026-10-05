import type { BnuTangramVisual } from '../learning/bnu-tangram';
import type { Lesson, Question, Visual } from '../learning/types';
const id = 'bnu-lower-square-challenge';
const diagram = (
  scene: BnuTangramVisual['scene'],
  variant: BnuTangramVisual['variant'] = 'main',
): BnuTangramVisual => ({ kind: 'bnu-tangram', scene, variant });
const task = (
  suffix: string,
  prompt: string,
  rule: Question['rule'],
  explanation: string,
  visual?: Visual,
): Question => ({
  id: `${id}-${suffix}`,
  knowledge: id,
  prompt,
  rule,
  explanation,
  hint: '先看材料片、再沿完整外边核对；两种大小、两种四片办法分别试，实际叠比与未来计划分开。',
  ...(visual ? { visual } : {}),
});
const choose = (
  suffix: string,
  prompt: string,
  labels: string[],
  value: string,
  explanation: string,
  visual?: Visual,
): Question => ({
  ...task(suffix, prompt, { kind: 'choice', value }, explanation, visual),
  choices: labels.map((label) => ({ id: label, label })),
});
const actual = (suffix: string, prompt: string) =>
  task(
    suffix,
    prompt,
    { kind: 'manual' },
    '只实际完成本项才确认；仅看网页、答题或未来打算请跳过。纸卡替代、成人协助和未交流如实说明，不要求购买或学校资料。',
  );
const record = (suffix: string, prompt: string) =>
  task(
    suffix,
    prompt,
    { kind: 'reflection' },
    '保留真实原话，正确性为null；不知道、未做或困难均可说明，未来计划不当已发生动作。',
  );
export const bnuLowerSquareChallengeLesson: Lesson = {
  id,
  textbookTitle: '拼图大挑战',
  title: '两片、三片与两种四片拼正方形',
  page: 85,
  version: 1,
  status: 'available',
  goal: '从已有七片正方形提出问题，真实试两片两种大小、三片和两种四片办法，叠比另一半、换片重摆，并交流单元发现与待研究问题。',
  prerequisite:
    '认识七巧板原七片及三类，知道大小与类别不同，拼摆保持纸片形状，沿整体外边核对正方形。',
  parentTip:
    '完整对应原85～86页七活动，本站固定几何沿用80页编号作参照，85～86原图没有这些编号；不冒原姿势、配色或尺寸。两片两例大小不同，四片两法分别实做；不能推广任意选两片或四片均可拼，不推本页已经证明5/6片。材料保形、不重叠无空缺，叠比实际操作而非网页面积相同就自动认完成。没有纸卡或同伴可如实待做。',
  review: {
    date: '2026-10-06',
    reviewer: '实际查看公开扫描85～86页与来源记录',
    notes:
      '两片先试、三片、四片找另一半/叠比/换片与单元交流依序；五示例存在性不等于任意选片结论，程序验收另核。',
  },
  steps: [
    {
      title: '从已经能拼的七片正方形出发',
      text: '原85页展示七片拼成的正方形，再问还能不能拼别的正方形。回原图观察完整外边；本站重画沿用80编号1、2两大三角，4、6两小三角，7中三角，3平行四边形，5正方形，每片比例固定，不冒85原图已有标号。原七片正方形只是已知办法，不表示别的方法必须用七片。',
      visual: diagram('square'),
      activity: '实际观察原七片示例并提出想试的问题。',
    },
    {
      title: '先问两片、三片、四片，可以逐步试',
      text: '从两片开始容易比较，成功或不成功都保留真实发现，再换三片、四片条件。先写自己想怎么选，不要求事先猜出所有答案。这里讨论2、3、4及原7片，不把5/6片当原页已经证出的结论；若想研究可以另列问题。',
      activity: '说明自己的第一步选择与问题，实际想法和将来计划分清。',
    },
    {
      title: '两大三角：看整体正方形',
      text: '本站第一例选原1、2两大三角，保持每片形状，沿相同长边接在一起，整体外边四段同长、相邻成直角。两个材料三角片与一个整体正方形分清；拼后不重叠、不留洞，不拿颜色或内部线判断整体。回原两片大例观察，真实取两片试摆。',
      visual: diagram('square-two-large'),
      activity: '实际用两大三角试拼并沿完整外边检查。',
    },
    {
      title: '两小三角：也能拼，大小不必相同',
      text: '再选4、6两小三角，在同一图示单位下也拼成正方形。与前例比较，两例材料数都是2，整体各一个正方形，但小例明显较小；原书不要求两例面积相同。不能只知道是三角形就认任意两片都全等或都可照摆。',
      visual: diagram('square-two-small'),
      activity: '实际试两小三角，再与两大例比较大小和完整边。',
    },
    {
      title: '三片：中三角加两小三角',
      text: '本站三片示例取7中三角与4、6两小三角，两小先形成与中片相配的一半，再接出整个正方形。材料仍三个三角片，整体外轮廓是正方形，不把里面斜线算成整体外边。原三片探索与两片独立，实际试后核对没有重叠和空缺。',
      visual: diagram('square-three'),
      activity: '实际试三片办法，指片和沿完整外边检查。',
    },
    {
      title: '四片先选大三角，再找另一半',
      text: '原86页先选一个大三角，再找另一半。本站第一种四片选1大三角、5方片、4与6两小三角，这三片组合成与大三角对应的另一半。取纸卡时先保留大三角作比较对象，再试其余三片，不把“另一半”理解为只能再取一片；三片组合也是一个整体区域。',
      visual: diagram('square-four-square'),
      activity: '实际选大三角，再用方片与两小三角寻找另一半。',
    },
    {
      title: '检查第一种四片整体',
      text: '接好后整个图是正方形，用了4片，其中3三角、1方片。没有使用的3平行四边形与7中三角不凭原七片数量补入。逐边检查外轮廓，内部线只是材料交界。可以记录需要重新摆的位置，不因网页显示成功就自动确认自己做过。',
      visual: diagram('square-four-square'),
      activity: '实际检查第一种四片拼摆的完整外边、交界和空缺。',
    },
    {
      title: '把组合另一半与大三角重合比',
      text: '按原提示，拿实际选好的三片组合与大三角叠起来比。允许转动保形纸片，把完整边界对齐看能否重合；同面积只是线索，不能自动证明形状相同，更不能代替真实叠比。本站几何保证示例保形，但实际纸卡精度、移动散开、帮助或未叠都如实记。',
      visual: diagram('square-four-square'),
      activity: '实际叠比所拼另一半与大三角，记录边界是否对齐。',
    },
    {
      title: '换一片：方片换成中三角，再重摆',
      text: '原再换片试。本站第二法保留1大三角、4与6两小三角，把5方片换成7中三角，并重新摆另外半边；不是只把新片塞在旧方片位置。总片数仍4，但现在四片都是三角形。原两法分别试，不由第一法成功自动认第二法已实做。',
      visual: diagram('square-four-triangle'),
      activity: '实际换片，重新摆中三角与两小三角，再核对整体正方形。',
    },
    {
      title: '四片成功不表示任选四片都成功',
      text: '两种示例都能拼正方形，是给定材料和摆法的存在性。比较第一法有方片、第二法全三角，仍可得到同形同大的整个正方形；材料类别与整个外边不能混淆。不能由两法推广任意选四片都可拼，也不能只看片数就认已经核对外边。',
      visual: diagram('square-four-triangle'),
      activity: '实际比较两种四片方法的材料差别与整体边界。',
    },
    {
      title: '说方法：从少片开始，动手与叠比帮助思考',
      text: '原收获强调可以用2、3、4片拼正方形，从两片开始，想不明白就动手，摆起来比也是方法；三角片经常发挥作用。这是本次实际或给定示例的总结，不说只三角片才有用，更不认任意子集均可拼。真实试过哪种、用了什么方法和仍不确定的部分各自说明。',
      activity: '实际向同伴或成人介绍试过的方法；没有真实交流可待做。',
    },
    {
      title: '全单元收获与还想研究的问题分别记',
      text: '回看本单元拼七巧板、折纸、图案与轮廓等实际经历，说自己的收获、困难或未做部分，再说还想研究什么。没有做过的活动不能因完成本课答题被补为完成。未来想试5/6片或其它作品可列研究问题，不写成已证结论；交流动作与保存文字也分别记录。',
      activity: '整理真实收获与未来问题，实际交流则如实说明。',
    },
  ],
  questions: [
    task(
      'seven-count',
      '原起点的完整七巧板示例用了几片？不是只数三角片。',
      { kind: 'number', value: 7 },
      '原七片全部使用，三角5片、方1片、平行四边1片合7。',
      diagram('square'),
    ),
    task(
      'two-large-count',
      '本站两大例选了几片材料？不是问整体数量。',
      { kind: 'number', value: 2 },
      '1与2，共两片。',
      diagram('square-two-large'),
    ),
    task(
      'two-small-count',
      '本站两小例选了几片材料？',
      { kind: 'number', value: 2 },
      '4与6，共两片。',
      diagram('square-two-small'),
    ),
    choose(
      'two-sizes',
      '与两大例相比，两小例拼成的整个正方形是否必须同样大？',
      ['不必，两小例较小', '必须，材料数同为2就同面积'],
      '不必，两小例较小',
      '同片数不保证同面积；同一单位下两小例较小。',
      diagram('square-two-small'),
    ),
    task(
      'three-count',
      '本站三片例完整材料共有几片？',
      { kind: 'number', value: 3 },
      '7、4、6各一片，共3。',
      diagram('square-three'),
    ),
    choose(
      'three-whole',
      '本站三片例材料都是三角形，拼成的整个外轮廓是什么？',
      ['正方形', '仍只能是三角形'],
      '正方形',
      '整体外边与材料类别不同。',
      diagram('square-three'),
    ),
    task(
      'four-count',
      '本站第一种四片例1、5、4、6，共用了几片？',
      { kind: 'number', value: 4 },
      '四个编号各一片，共4。',
      diagram('square-four-square'),
    ),
    task(
      'first-square-count',
      '只数第一种四片例的材料，方片有几片？不把整体正方形再加一片。',
      { kind: 'number', value: 1 },
      '只有5是方片，整体不是新增材料。',
      diagram('square-four-square'),
    ),
    task(
      'first-triangle-count',
      '同一第一种四片例，三角材料有几片？',
      { kind: 'number', value: 3 },
      '1、4、6是三角片，共3。',
      diagram('square-four-square'),
    ),
    choose(
      'half-not-one-piece',
      '“找另一半”是否只能再拿一片？',
      ['不是，可以用几片组合成另一半', '是，另一半必须一片'],
      '不是，可以用几片组合成另一半',
      '5、4、6三片组合成另一半，组合区域与材料数分清。',
      diagram('square-four-square'),
    ),
    choose(
      'overlay',
      '网页显示两块区域面积相同，是否就表示自己已经完成实际叠比？',
      ['不是，仍需真实对齐完整边界比较', '是，网页面积足够证明实做'],
      '不是，仍需真实对齐完整边界比较',
      '面积相同不自动证明同形，也不替代真实叠比。',
      diagram('square-four-square'),
    ),
    task(
      'second-triangle-count',
      '第二法1、7、4、6中三角材料共有几片？',
      { kind: 'number', value: 4 },
      '这次四片均三角，第一法三角3片不能套用。',
      diagram('square-four-triangle'),
    ),
    task(
      'site-zero',
      '第二法明确完整选片1、7、4、6里，方片有几片？没有隐藏材料。',
      { kind: 'number', value: 0 },
      '未使用5，全部三角材料，所以方片0；未知原范围不猜0。',
      diagram('square-four-triangle'),
    ),
    choose(
      'replace-rearrange',
      '把方片换成中三角后，正确的尝试方式是什么？',
      [
        '保持各片形状重新摆并核对完整外边',
        '直接塞到旧方片位置，不能移动其它片',
      ],
      '保持各片形状重新摆并核对完整外边',
      '更换材料后可重新摆，保形、无重叠空缺并检查整体。',
      diagram('square-four-triangle'),
    ),
    choose(
      'any-four',
      '给出的两种四片拼法能证明任选四片都能拼正方形吗？',
      ['不能，只证明给定办法存在', '能，四片数量就足够'],
      '不能，只证明给定办法存在',
      '材料和拼法是条件，不由两个例子推广任意子集。',
    ),
    actual(
      'actual-observe',
      '实际观察原85页七片起点与问题，指完整外边；原图不可见或仅看本站替代请如实待做。',
    ),
    actual(
      'actual-two-large',
      '实际取两大三角试拼完整正方形，核对边与交界；只答题不确认。',
    ),
    actual(
      'actual-two-small',
      '实际独立试两小三角办法，再与两大例比较整体大小。',
    ),
    actual(
      'actual-three',
      '实际试中三角加两小三角的三片办法，检查完整外边、保形、不重叠无空缺。',
    ),
    actual(
      'actual-select-large',
      '四片探索中实际先取一个大三角作为比较对象；还未取片请跳过。',
    ),
    actual(
      'actual-other-half',
      '实际用方片与两小三角找另一半并接出第一种四片正方形，检查交界和完整外边。',
    ),
    actual(
      'actual-overlay',
      '实际把另一半组合与大三角对齐叠比，必要时转动保形纸片；没有真实叠比请跳过。',
    ),
    actual(
      'actual-replace',
      '实际把方片换成中三角，保留另三片并重新摆另一半；只想换而未操作请跳过。',
    ),
    actual(
      'actual-second-four',
      '实际完成第二种四片正方形并检查完整边界；第一法成功不代替本项。',
    ),
    actual(
      'actual-exchange',
      '实际与同伴或成人交流方法、单元收获与待研究问题；只保存文字或未来想交流请跳过。',
    ),
    record(
      'first-idea',
      '记最初想从几片、哪些材料开始和提出的问题，不强制预先有成功答案。',
    ),
    record('two-compare', '记自己两大与两小的实际尝试、大小发现或未做部分。'),
    record(
      'overlay-record',
      '记另一半叠比的实际边界结果、困难、帮助或待做，不据网页面积冒实做。',
    ),
    record(
      'replacement-record',
      '记两种四片办法分别实际完成到哪步、换哪片与怎样重摆。',
    ),
    record(
      'reflection',
      '回看单元中自己真实做过的拼图或折纸，说发现、方法或仍不确定的部分，不自动补其他活动完成。',
    ),
    record(
      'plan',
      '未来还想研究什么？例如未试的片数或其它图案，计划与已证结论分开。',
    ),
  ],
  reviewQuestions: [
    task(
      'review-remove-two',
      '先看新三片图，假想拿走4与6两小片后还剩几片？图仍显示拿走前的材料，不冒已实际移走。',
      { kind: 'number', value: 1 },
      '原三片拿走两片，剩7一片，3−2=1。',
      diagram('square-three', 'review'),
    ),
    task(
      'review-remove-medium',
      '新第二四片法先有1、7、4、6，假想拿走7后还剩几个三角材料？不把原方片5补入。',
      { kind: 'number', value: 3 },
      '四三角拿走7，剩1、4、6三个；不等于剩余仍能拼原正方形。',
      diagram('square-four-triangle', 'review'),
    ),
    task(
      'review-whole',
      '新两小片图完整拼好，整个正方形有几个？问整体，不是数两片材料。',
      { kind: 'number', value: 1 },
      '拼好整体是一个正方形，材料仍两片。',
      diagram('square-two-small', 'review'),
    ),
    task(
      'review-no-medium',
      '新第一四片法明确只给1、5、4、6，中三角7有几片？',
      { kind: 'number', value: 0 },
      '选片完整且没有7，所以0。',
      diagram('square-four-square', 'review'),
    ),
    choose(
      'review-changed-material',
      '现在只有第二法1、7、4、6，能不换材料直接照用包含5的第一法吗？',
      ['不能，当前没有5，需要按当前材料重摆', '能，四片数量相同就完全同法'],
      '不能，当前没有5，需要按当前材料重摆',
      '条件改变，片数相同不等于材料相同。',
      diagram('square-four-triangle', 'review'),
    ),
    choose(
      'review-real',
      '自己只实际试过两片，三片和四片未做，记录怎么写？',
      ['两片如实确认，三片四片待做', '网页看过就确认全部实做'],
      '两片如实确认，三片四片待做',
      '每个实做条件独立确认。',
    ),
    choose(
      'review-future',
      '写了以后想试5片，但还未操作，能写已经证明5片成功吗？',
      ['不能，保留为未来研究问题', '能，有计划就等于已证'],
      '不能，保留为未来研究问题',
      '未来计划不等于实际证据，本页未给5片结论。',
    ),
  ],
};

/** Full source-to-draft correspondence; registration and browser QA remain separate. */
export const bnuLowerSquareChallengeMapping = [
  {
    page: 85,
    sourceActivity: 'observe-seven-piece-square-and-ask-alternatives',
    steps: [1, 2],
    objective: ['seven-count'],
    manual: ['actual-observe'],
    records: ['first-idea'],
  },
  {
    page: 85,
    sourceActivity: 'try-two-piece-square-in-two-sizes',
    steps: [3, 4],
    objective: ['two-large-count', 'two-small-count', 'two-sizes'],
    manual: ['actual-two-large', 'actual-two-small'],
    records: ['two-compare'],
  },
  {
    page: 85,
    sourceActivity: 'try-three-piece-square',
    steps: [5],
    objective: ['three-count', 'three-whole'],
    manual: ['actual-three'],
    records: [],
  },
  {
    page: 86,
    sourceActivity: 'choose-large-triangle-and-match-other-half',
    steps: [6, 7],
    objective: [
      'four-count',
      'first-square-count',
      'first-triangle-count',
      'half-not-one-piece',
    ],
    manual: ['actual-select-large', 'actual-other-half'],
    records: [],
  },
  {
    page: 86,
    sourceActivity: 'overlay-and-compare-selected-half',
    steps: [8],
    objective: ['overlay'],
    manual: ['actual-overlay'],
    records: ['overlay-record'],
  },
  {
    page: 86,
    sourceActivity: 'replace-piece-and-try-second-four-piece-square',
    steps: [9, 10],
    objective: [
      'second-triangle-count',
      'site-zero',
      'replace-rearrange',
      'any-four',
    ],
    manual: ['actual-replace', 'actual-second-four'],
    records: ['replacement-record'],
  },
  {
    page: 86,
    sourceActivity: 'describe-method-and-reflect-on-unit',
    steps: [11, 12],
    objective: [],
    manual: ['actual-exchange'],
    records: ['reflection', 'plan'],
  },
] as const;

import type { Lesson, Question, Visual } from '../learning/types';

const base = {
  textbookTitle: '复习与关联',
  version: 1,
  status: 'available' as const,
  prerequisite:
    '按学校实际进度回顾20以内的数、加减法和四种立体图形，不要求先完成所有课包。',
  parentTip:
    '参照人教上册103～109页编写原创整理课。完整数表、算式表及材料活动可以分次做，如实记已做范围，未完成不能勾完整完成。网页正确率不是全册掌握程度；口述、纸笔、真实摆放与个人反思独立记录，缺原书或材料可跳过，不强迫购买。',
  review: {
    date: '2026-10-03',
    reviewer: '官方教材103～109页实际核读与原创任务程序核对',
    notes:
      '资源1221001101241图片109～115逐页实际查看。保留原mu-review-story/review v1，追加数表计算与知识关联两课。表格按数学规律原创绘制，未发布原书扫描、插画或全文；真实活动与未来计划分开。',
  },
};
function task(
  id: string,
  suffix: string,
  prompt: string,
  rule: Question['rule'],
  explanation: string,
  visual?: Visual,
  labels?: string[],
): Question {
  return {
    id: `${id}-${suffix}`,
    knowledge: id,
    prompt,
    rule,
    explanation,
    visual,
    hint: '先明确已知、所求、范围与单位，再分步填；0不是没有回答。',
    choices: labels?.map((label) => ({ id: label, label })),
  };
}
function fields(
  id: string,
  suffix: string,
  prompt: string,
  values: number[],
  explanation: string,
  visual?: Visual,
): Question {
  return task(
    id,
    suffix,
    prompt,
    { kind: 'steps', values },
    explanation,
    visual,
  );
}
function number(
  id: string,
  suffix: string,
  prompt: string,
  value: number,
  explanation: string,
  visual?: Visual,
): Question {
  return task(
    id,
    suffix,
    prompt,
    { kind: 'number', value },
    explanation,
    visual,
  );
}
function choice(
  id: string,
  suffix: string,
  prompt: string,
  value: string,
  labels: string[],
  explanation: string,
): Question {
  return task(
    id,
    suffix,
    prompt,
    { kind: 'choice', value },
    explanation,
    undefined,
    labels,
  );
}
function manual(id: string, suffix: string, prompt: string): Question {
  return task(
    id,
    suffix,
    prompt,
    { kind: 'manual' },
    '只记录是否实际完成，不自动判口述、纸笔、材料稳定性和理解程度，不计客观正确率。没做、缺材料或仅做一部分，请跳过并在反思记具体范围。',
  );
}
function reflect(id: string, suffix: string, prompt: string): Question {
  return task(
    id,
    suffix,
    prompt,
    { kind: 'reflection' },
    '如实记经历、困难与尚待做的内容；未来计划不是已完成证据，个人反思没有统一正确答案。',
  );
}
const grid = 'mu-final-grids';
const map = 'mu-final-links';
const cards: Visual = {
  kind: 'block-cards',
  cards: [
    { shape: 'cube', color: 'red' },
    { shape: 'cylinder', color: 'blue' },
    { shape: 'cuboid', color: 'yellow' },
    { shape: 'cube', color: 'blue' },
    { shape: 'cylinder', color: 'red' },
    { shape: 'cylinder', color: 'yellow' },
  ],
};
const shapeNames = ['长方体', '正方体', '圆柱', '球'];
export const finalPracticeLessons: Lesson[] = [
  {
    ...base,
    id: grid,
    page: 106,
    title: '完整数表、加法表与分步计算',
    goal: '联系行列、数位、相邻数和计算结果，明确含0与10的完整加法范围。',
    steps: [
      {
        title: '从1到19的数表',
        activity: '实际画10行10列表，按行号加列号再减1填全，逐行核对。',
        text: '行号、列号都为1～10，每格填行号加列号再减1：第1行是1～10，第2行是2～11，最后一行是10～19。同一行向右或同一列向下数加1，行号列号不是格里数本身。本站表显示完整规律，纸表实际填写另记录，不复制教材给定空格。',
        visual: {
          kind: 'semester-grid',
          mode: 'numbers',
          hidden: [],
          marked: 11,
        },
      },
      {
        title: '位置、数位和一条路径',
        text: '先说第几行、从左第几列，再读格里的数。例如第8行第6列为13，是1个十和3个一。标出所有11，观察它们位置；在纸计数器画1个十和1个一，珠颗数不等于表示量。从左上1到右下19，走相邻上下左右格，沿数每次加1；斜走不算相邻一步，也不能跨过数。实际画一条合法路径并逐格核对。',
        visual: { kind: 'place-value', value: 11 },
      },
      {
        title: '加数0～10的完整表',
        text: '换一张11行11列表，行列加数均为0～10，每格写本行加数加本列加数，共121个有序算式。0+10与10+0都要有，10+10得20，0+0得0；和为10有11格，不沿用前课1～9两个加数的9格。标记同时有文字和符号，不只靠颜色。',
        visual: {
          kind: 'semester-grid',
          mode: 'addition',
          hidden: [],
          marked: 10,
        },
      },
      {
        title: '四组口算与比较',
        text: '本课有16个原创口算式，按四组分别填写四个得数，含加0、减到0、加10和十几减10。比较先算两边再看大小，不能只比较式子中的一个数字。纸上逐式说明方法，不能用一次综合题判断全册掌握。',
      },
      {
        title: '沿箭头保存每个中间结果',
        text: '从左向右按箭头逐次计算，后一步以前一步结果为起点。每一步都独立填，最终正确不能掩盖中间错误。结果0要写出，没算的留空；用材料实际添取或纸面检查另记录，不由网页填写证明已经实做。',
      },
    ],
    questions: [
      fields(
        grid,
        'q1',
        '数表行列1～10，格中为行号+列号−1。依次填第2行第4列、第4行第7列、第8行第9列三空格。',
        [5, 10, 16],
        '2+4−1=5，4+7−1=10，8+9−1=16。',
        {
          kind: 'semester-grid',
          mode: 'numbers',
          hidden: [
            [2, 4],
            [4, 7],
            [8, 9],
          ],
        },
      ),
      fields(
        grid,
        'q2',
        '依次填16前面的一个数、后面的一个数。',
        [15, 17],
        '相邻前数少1，后数多1。',
      ),
      fields(
        grid,
        'q3',
        '数表第8行、从左第6列：依次填格里的数、几个十、几个一。',
        [13, 1, 3],
        '8+6−1=13，是1个十和3个一，不是8个十和6个一。',
      ),
      number(
        grid,
        'q4',
        '本课10行10列数表中，数11共出现几格？',
        9,
        '第2行第10列到第10行第2列共9格；第1行没有11。',
        { kind: 'semester-grid', mode: 'numbers', hidden: [], marked: 11 },
      ),
      fields(
        grid,
        'q5',
        '20由几个十和几个一组成？依次填。',
        [2, 0],
        '2个十、0个一，0不能省略。',
        { kind: 'place-value', value: 20 },
      ),
      fields(
        grid,
        'q6',
        '加数均0～10的表，依次填0+10、10+0、5+5的和。',
        [10, 10, 10],
        '三式都得10；允许0，交换位置仍保留两个格。',
        {
          kind: 'semester-grid',
          mode: 'addition',
          hidden: [
            [0, 10],
            [10, 0],
            [5, 5],
          ],
          marked: 10,
        },
      ),
      number(
        grid,
        'q7',
        '加数均0～10，左右顺序分开记，和为10共有几格？',
        11,
        '0+10、1+9……10+0共11格，包含0和10。',
      ),
      number(grid, 'q8', '0+7等于多少？', 7, '添0没有增加，仍是7。'),
      fields(
        grid,
        'q9',
        '依次算7+6、9−4、16−6、10+8。',
        [13, 5, 10, 18],
        '四个得数依次13、5、10、18。',
      ),
      fields(
        grid,
        'q10',
        '依次算8+9、8−8、17−10、6+4。',
        [17, 0, 7, 10],
        '减去全部剩0，不是未作答。',
      ),
      fields(
        grid,
        'q11',
        '依次算6+8、7−3、19−9、0+9。',
        [14, 4, 10, 9],
        '四个得数依次14、4、10、9。',
      ),
      fields(
        grid,
        'q12',
        '依次算9+5、8−5、18−8、10+10。',
        [14, 3, 10, 20],
        '最后两式是10、20，不能把加10当加1。',
      ),
      choice(
        grid,
        'q13',
        '8+6与14比较，应填？',
        '=',
        ['>', '<', '='],
        '8+6=14。',
      ),
      choice(
        grid,
        'q14',
        '10−7与5比较，应填？',
        '<',
        ['>', '<', '='],
        '10−7=3，3<5。',
      ),
      choice(
        grid,
        'q15',
        '12与4+7比较，应填？',
        '>',
        ['>', '<', '='],
        '4+7=11，12>11。',
      ),
      fields(
        grid,
        'q16',
        '从14开始，依次+4、−8、+7、−5、+6，依次填每一步的结果。',
        [18, 10, 17, 12, 18],
        '14→18→10→17→12→18，后一步用前一步结果。',
      ),
      fields(
        grid,
        'q17',
        '从13开始，依次−3、+8、−10、+2、−10，依次填每一步的结果。',
        [10, 18, 8, 10, 0],
        '13→10→18→8→10→0，最后0也要填写。',
      ),
      manual(
        grid,
        'number-table',
        '实际画10行10列并填完整100格数表，逐行1～10、2～11……10～19核对；标出全部11并画对应十位个位，解释行列变化。可分次，尚未完整时不要确认整项完成。',
      ),
      manual(
        grid,
        'path',
        '在自己完整的100格纸表，从左上1到右下19实际画一条上下左右相邻、每步数加1的路径，逐格读1～19核对；不可斜走、跳格。缺纸表或没实际画请跳过。',
      ),
      manual(
        grid,
        'addition-table',
        '实际写完整121格算式表：行列加数0～10。逐格填式、分次口算核对，标记全部和为10的11格，说明加0、加10、交换和行列变化；未写完不要把部分当完整完成。',
      ),
      manual(
        grid,
        'calculations',
        '实际在纸上写本课16式、三个比较和两条五步箭头链，逐式核对并解释至少凑十、十几减几、含0三个例子。按实际进度分次，网页填完不等于纸笔已经做。',
      ),
      reflect(
        grid,
        'reflection',
        '我实际整理到哪里，哪些中间步骤仍有困难？分开记已做、只在网页做和计划做的部分，不凭一次成绩宣告全册熟练。',
      ),
    ],
    reviewQuestions: [
      fields(
        grid,
        'r1',
        '同规则数表依次填第3行第5列、第6行第7列、第9行第10列的数。',
        [7, 12, 18],
        '行号加列号减1，依次7、12、18。',
        {
          kind: 'semester-grid',
          mode: 'numbers',
          hidden: [
            [3, 5],
            [6, 7],
            [9, 10],
          ],
        },
      ),
      number(
        grid,
        'r2',
        '加数均0～10，和为11的有序算式共有几格？',
        10,
        '1+10到10+1，共10格。',
      ),
      fields(
        grid,
        'r3',
        '从12开始依次−2、+7、−10、+3、−10，填每步结果。',
        [10, 17, 7, 10, 0],
        '12→10→17→7→10→0，不沿用原链答案。',
      ),
      fields(
        grid,
        'r4',
        '依次算9+8、7−7、18−10、5+5。',
        [17, 0, 8, 10],
        '新式依次17、0、8、10。',
      ),
    ],
  },
  {
    ...base,
    id: map,
    page: 103,
    title: '知识关联、生活提问与图形回顾',
    goal: '用自己的例子联系数、计算、数量关系与图形，分别记录实际应用与观察。',
    steps: [
      {
        title: '整理自己的知识图',
        activity:
          '实际画数与计算、数量关系、图形三个分支，每类放真实例子并解释联系。',
        text: '在纸上以本学期学习为中心，画数与计算、数量关系、图形三个分支。每类添自己的具体例子：数量与第几、十和一、分合与加减、整体与部分、立体形状。逐类解释怎样联系，也可以补充自己的发现；不是复制教材人物的收获。',
        visual: { kind: 'place-value', value: 17 },
      },
      {
        title: '同一材料联系多个算法',
        text: '实际摆3和4两个部分，总共7；恢复同一份材料，写两条加法和两条减法，不能继续取走导致换了整体。再摆8和6，用凑十算14，记录拆出的2和剩下4；也可用接着数或已会的式子说明，不否定其他正确方法。',
        visual: { kind: 'ten-frame', left: 8, right: 6 },
      },
      {
        title: '先读问题，再选计算',
        text: '取走5张纸片后剩7，求原来应5+7；若已知原有16、外面7，求里面则16−7。先说已知和所求、画图、列式、单位与答句，再把结果放回情境检查。静态两部分不是发生了新进入；自己提出新问题时保持条件完整。',
        visual: { kind: 'count', count: 5, other: 7 },
      },
      {
        title: '四种形状按规则重新分类',
        text: '比较长方体、正方体、圆柱和球。圆柱有平底也有弯曲侧面，球表面弯曲；改变分类标准应恢复全部再分。按四类时正方体单列，数学上它是特殊的长方体。数组合里的材料件数不数图上可见的面或接缝，缺某类数量0要写出。',
        visual: cards,
      },
      {
        title: '四块拼组、大正方体与整组配对',
        text: '四个同大小正方体可整面贴合排成长条或2×2一层的长方体；不能用四块拼成完整更大的正方体。更大且完整的最小正方体每层2×2、共两层，需8块，不教体积公式。下方原创配对目标为6块的一层矩形，候选整组只能旋转和平移，不拆、重叠或丢块；与教材的阶梯目标不同，必须逐格检查不能只按总数相同猜。',
        visual: { kind: 'cube-pair', variant: 'main', display: 'candidates' },
      },
      {
        title: '三方面分别回看',
        text: '数与计算、实际问题、图形观察分别记自己确实做过什么、怎么验证和仍不确定什么。会说方法不一定算熟练，网页练习不代表实物搭建或交流已做；未做与计划分开，不自动评星或断定全册已掌握。',
      },
    ],
    questions: [
      choice(
        map,
        'q1',
        '“我拿了5张纸片”中的5表示什么？',
        '数量',
        ['数量', '第几张'],
        '5张说总数量，不是某一张的顺序。',
      ),
      fields(
        map,
        'q2',
        '17由几个十和几个一组成？依次填。',
        [1, 7],
        '1个十和7个一合成17。',
        { kind: 'place-value', value: 17 },
      ),
      fields(
        map,
        'q3',
        '同一整体分成3和4：依次填3+4、4+3、7−3、7−4。',
        [7, 7, 4, 3],
        '两部分合整体，整体减一部分得另一部分；每次恢复原整体。',
      ),
      fields(
        map,
        'q4',
        '8+6先凑8成10。依次填从6拿出几个、剩几个、凑成多少、最后的和。',
        [2, 4, 10, 14],
        '6分2和4，8+2=10，10+4=14。',
        { kind: 'ten-frame', left: 8, right: 6 },
      ),
      number(
        map,
        'q5',
        '拿走5张纸片后还剩7张，原来多少张？',
        12,
        '求原来整体，5+7=12。',
      ),
      number(
        map,
        'q6',
        '原来16张，其中7张在盒外，其余在盒内，盒内多少张？',
        9,
        '整体16减外面7得里面9，不重复合并已经包含的数量。',
      ),
      task(
        map,
        'q7',
        '按有平面/没有平面重新分，选所有有平面的理想形体。',
        { kind: 'set', values: ['长方体', '正方体', '圆柱'] },
        '圆柱两底面平，侧面曲；球没有平面。',
        { kind: 'solid-row', shapes: ['cuboid', 'cube', 'cylinder', 'sphere'] },
        shapeNames,
      ),
      fields(
        map,
        'q8',
        '按图中材料件数，依次填长方体、正方体、圆柱、球各几个。正方体本次单列一类。',
        [1, 2, 3, 0],
        '长方体1、正方体2、圆柱3、球0，不能数颜色或可见的面。',
        cards,
      ),
      number(
        map,
        'q9',
        '同大小小正方体要拼完整且比一块大的正方体，最少需要几块？',
        8,
        '最小每层2×2有4块，两层共8块；4块不能填满完整大正方体。',
      ),
      task(
        map,
        'q10',
        '材料是两单块和一组两块柱，共4个小正方体，不加不丢。选所有保留4块的完整长方体候选。',
        { kind: 'set', values: ['A', 'B'] },
        'A和B各4块，C只有3块；整组旋转平移后仍需真实检查对接，屏幕不证明实物稳定。',
        { kind: 'solid-recompose', scene: 'cube-join', variant: 'main' },
        ['A', 'B', 'C'],
      ),
      task(
        map,
        'q11',
        '原创6块目标，候选只能整组旋转平移，不拆块，选下面全部能无洞无重叠填满目标的配对。',
        { kind: 'set', values: ['A+E', 'B+F', 'C+D'] },
        'A+E、B+F、C+D均可逐格填满；A+D只有5块。块数相同只是必要条件，仍要检查位置。',
        { kind: 'cube-pair', variant: 'main', display: 'candidates' },
        ['A+E', 'B+F', 'C+D', 'A+D'],
      ),
      task(
        map,
        'q12',
        '13分成两个正整数，填自己的一个分法，下一项实做时再写相关加减式。',
        { kind: 'partition', parts: 2, total: 13, minimum: 1 },
        '两正数合计13即可，例如4和9，也可其他合法分法。',
      ),
      manual(
        map,
        'knowledge-map',
        '实际画三个知识分支，每类至少放一个自己的具体例子；说出数量/第几、十和一、整体部分与形状怎样联系，允许补充。尚未画或仅准备纸请跳过。',
      ),
      manual(
        map,
        'methods',
        '实际摆3和4，恢复后写两加两减；再用8和6分别做凑十与另一正确方法。取自己的13分法写两加两减，逐次恢复整体并解释，不由网页填法证明已经做。',
      ),
      manual(
        map,
        'problems',
        '实际用自己的纸片图提出并解决两个不同已知/所求的完整问题，至少一个求拿走前整体；写图、算式、单位、答句与回看。可另阅读自己合法原书105/107页原图提问；缺原书待做，本站纸片不是原图。',
      ),
      manual(
        map,
        'classification',
        '用已有许可的四类轻小材料，实际先按有曲面/无曲面分，恢复后按有平面/无平面分；逐件数、说圆柱为何两轮所属不同。缺某类如实说明，不为了完成购买。',
      ),
      manual(
        map,
        'build',
        '实际用4个同大小正方体整面贴合摆长条与2×2一层，数材料并观察完整外形；若有8块，再搭两层各2×2的完整大正方体。不够8块说明缺少，平面图不能代替真实搭建或稳定观察。',
      ),
      manual(
        map,
        'pairs',
        '按本站6块矩形目标与A～F候选实际画格卡或搭轻小积木，逐组原样恢复，只整组旋转平移核对A+E、B+F、C+D；不拆块、不留洞、不重叠。纸卡与实物分别如实记录，未做请跳过，不冒教材阶梯图已完成。',
      ),
      reflect(
        map,
        'number-reflection',
        '我实际整理或算过什么，怎样确认？网页、纸笔与尚待做范围分别记。',
      ),
      reflect(
        map,
        'problem-reflection',
        '我真实提出或解决了什么问题？哪个已知或所求曾混淆？未来计划另记。',
      ),
      reflect(
        map,
        'shape-reflection',
        '我实际摸、分或搭了哪些形体，缺哪些材料？屏幕观察与实物经验分开，不把缺材料当能力差。',
      ),
    ],
    reviewQuestions: [
      number(
        map,
        'r1',
        '拿走6张后还剩8张，原来多少张？',
        14,
        '求原整体，6+8=14。',
      ),
      fields(
        map,
        'r2',
        '同一整体分成2和5：依次算2+5、5+2、7−2、7−5。',
        [7, 7, 5, 2],
        '新分法两加两减，不能抄原3和4的答案。',
      ),
      task(
        map,
        'r3',
        '按有平面/没有平面分，选没有平面的形体。',
        { kind: 'set', values: ['球'] },
        '本次问无平面，只有球；不是沿用有平面组。',
        { kind: 'solid-row', shapes: ['cuboid', 'cube', 'cylinder', 'sphere'] },
        shapeNames,
      ),
      task(
        map,
        'r4',
        '这次材料是2个相同小正方体，不加不丢且整面贴合。新候选图选全部保留2块的完整长方体。',
        { kind: 'set', values: ['B', 'C'] },
        '新图A是3块，B和C各2块；条件和标签都已改变，不能沿用原四块题答案。',
        { kind: 'solid-recompose', scene: 'pair-cubes', variant: 'review' },
        ['A', 'B', 'C'],
      ),
      choice(
        map,
        'r5',
        '“从左第5张”中的5表示什么？',
        '第几张',
        ['数量', '第几张'],
        '起点和顺序已明确，5说的是第几。',
      ),
      fields(
        map,
        'r6',
        '19由几个十和几个一组成？依次填。',
        [1, 9],
        '1个十与9个一。',
        { kind: 'place-value', value: 19 },
      ),
      fields(
        map,
        'r7',
        '9+7先补9成10，依次填拿出量、剩余量、凑得数、最后和。',
        [1, 6, 10, 16],
        '7分1和6，先10后16。',
        { kind: 'ten-frame', left: 9, right: 7 },
      ),
      task(
        map,
        'r8',
        '14分成两个正整数，填自己的一个分法。',
        { kind: 'partition', parts: 2, total: 14, minimum: 1 },
        '两正数合计14，不沿用13的分法。',
      ),
      number(
        map,
        'r9',
        '原来15张纸片，其中9张在外面，其余在里面，里面几张？',
        6,
        '整体15减部分9，另一部分6。',
      ),
      task(
        map,
        'r10',
        '新6块阶梯目标，候选仍只能整组旋转平移，不拆块，选全部能无洞无重叠填满的配对。',
        { kind: 'set', values: ['A+E', 'B+F'] },
        'A+E、B+F可填满；C+D虽同为6块，形状却不能严密填满新目标。',
        { kind: 'cube-pair', variant: 'review', display: 'candidates' },
        ['A+E', 'B+F', 'C+D'],
      ),
    ],
  },
];

// Review pools follow the actual concept, rather than mixing the whole semester.
const groups: Record<string, [string, string[]][]> = {
  [grid]: [
    ['number-grid', ['q1', 'q2', 'q3', 'q4', 'q5', 'r1']],
    ['addition-grid', ['q6', 'q7', 'q8', 'r2']],
    ['calculation', ['q9', 'q10', 'q11', 'q12', 'q13', 'q14', 'q15', 'r4']],
    ['chain', ['q16', 'q17', 'r3']],
  ],
  [map]: [
    ['numbers', ['q1', 'q2', 'r5', 'r6']],
    ['calculation', ['q3', 'q4', 'q12', 'r2', 'r7', 'r8']],
    ['relations', ['q5', 'q6', 'r1', 'r9']],
    ['shapes', ['q7', 'q8', 'q9', 'q10', 'q11', 'r3', 'r4', 'r10']],
  ],
};
for (const lesson of finalPracticeLessons) {
  for (const [concept, suffixes] of groups[lesson.id] ?? []) {
    for (const suffix of suffixes) {
      const question = [
        ...lesson.questions,
        ...(lesson.reviewQuestions ?? []),
      ].find((q) => q.id === `${lesson.id}-${suffix}`);
      if (!question)
        throw new Error(`Missing final review concept: ${lesson.id}/${suffix}`);
      question.knowledge = `${lesson.id}-${concept}`;
    }
  }
}

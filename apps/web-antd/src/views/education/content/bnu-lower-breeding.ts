import type { Lesson } from '../learning/types';

export const bnuLowerBreedingLesson: Lesson = {
  id: 'bnu-lower-breeding',
  textbookTitle: '小小养殖场',
  title: '小小养殖场：数量比较、线索猜数与完整排序',
  page: 52,
  version: 1,
  status: 'available',
  goal: '按给定数量和方向说比较关系；依据完整候选与回应逐步猜数；用两种方法完整排序五卡，借数线左右位置解释大小。',
  prerequisite: '能读写100以内的数并比较大小，知道缩略画和标签数量可能不同。',
  parentTip:
    '依据已核读的公开扫描52～53页七项活动，本站原创数线另补0刻度作参照，不复制原插图。原鸡100、鹅22、鸭92按标签读取，不从缩略动物件数替换；52页兔未知，53页四候选和完整否定/确认后才定97。多一些、多得多、差不多用于原情境，不设普遍固定差数或比例阈值，差不多不是相等。原五卡排序必须全部做完，两种方法各重置操作；本站标数标签分行只为防50/51或近数重叠，按横线点的左右位置比较。纸面/材料操作、真实对话与解释分别人工，自己的记录不评分、未来计划另列；无需学校资料或购买新材料，最终教师审校未核验。',
  review: {
    date: '2026-10-05',
    reviewer: '52～53完整页与全部数量、对话及五卡来源核对',
    notes:
      '来源核对与最终教师试用分开；三种已知量、定性方向、候选完整线索、两种排序和原数线逐项对应。',
  },
  steps: [
    {
      title: '先读标签，只比三种已知量',
      text: '原养殖场标签鸡100只、鹅22只、鸭92只。只在这三种中，鸡最多、鹅最少。缩略画并没有按一图一只把全部100画完，应按给定标签，不用画中件数改写条件。第52页兔没有数量标签，暂未知；不能填0，也不能提前套后页确认的97。',
      activity:
        '实际指原三个标签，读数量并比较最多最少，说明兔在这一页还缺什么条件。',
    },
    {
      title: '说清方向，观察数线',
      text: '鸡100比鹅22多得多；鸡100比鸭92多一些。反向说，鸭比鸡少一些、鹅比鸡少得多。原鸡和鸭数量差不多，意思较接近，不是完全相等。定性词结合这里对象和条件，不补造所有情境通用的固定差数或比例阈值。本站数线补0作参照，原书标数从10开始；看横线点位置，越右数越大。',
      visual: {
        kind: 'marked-number-line',
        values: [22, 92, 100],
      },
      activity: '实际指原数线位置，完整说四个方向的多/少及鸡鸭较接近的含义。',
    },
    {
      title: '羊的候选：按本题作判断',
      text: '原说羊的只数与鹅22差不多，只给70、26、3三个候选。这里选26，和22较接近；70明显多得多，3明显少得多。选择不证明你点数过真实羊，不把26当原插画画出的羊只数，也不推广为差4在所有情境都差不多。',
      activity: '实际在三个原候选中标出26，说明参照鹅22和本题条件。',
    },
    {
      title: '兔数：听完线索才确定',
      text: '原四候选18、26、90、97。先问18，得到比18多得多的提示，原示例继续考虑90和97，尚不能唯一确定。再问90得到否定，最后问97确认猜对，才确定97。全部候选与完整回应共同提供依据，不从插画直接点成97，不跳过中间否定。',
      activity:
        '真实分角色说完四候选及全部提问、提示、否定、确认，逐步说明仍有哪些可能。',
    },
    {
      title: '原五张卡，全部从小到大排',
      text: '原从左到右50、98、38、10、51。完整重排为10、38、50、51、98，每张只用一次，不漏卡。50与51虽相邻，仍是两个不同的数和两张不同卡。5张卡是张数，不是把卡上数值相加。网页写出顺序不自动确认已移动实际纸卡。',
      activity: '实际重排原五张卡，按从小到大逐张读并检查遗漏或重复。',
    },
    {
      title: '两种方法都完整试一次',
      text: '方法一：每次从剩下的数找最小并移出，依次10、38、50、51、98，共五次。方法二：先比50与98排好，把38插50前，当前只是38、50、98；再把10插最前、51插50与98之间，才排完五张。中间三卡与最后五卡分清，省略的原示范过程要实际补全。',
      activity:
        '重置原五卡，分别完整做每次选最小和逐个插入的方法，口述每一步。',
    },
    {
      title: '把五个数标到线，标签不作第二个轴',
      text: '原数线标10、38、50、51、98，按横线点从左到右也是这个顺序。98在90与100之间，50与51两个点相近但分开。本站0～100图将每个标数放独立行并连到点，只为让近数文字不重叠；标签高低不表示数大数小，必须看横线点位置。原图纸面标点仍单独实际做。',
      visual: {
        kind: 'marked-number-line',
        values: [10, 38, 50, 51, 98],
      },
      activity:
        '实际在纸面数线上标齐五数，逐点解释左右、50与51不同、98所在两刻度。',
    },
    {
      title: '自己的方法、困难和计划分开',
      text: '回看七项原活动：三种标签比较、定性词与数线、羊候选、兔完整猜数、五卡排序、两种排序方法、全部标点。说明自己的真实过程，不把网站分数当实物操作或同伴理解。自己的发现、困难开放记录，未来准备另写；未知条件不补0。',
      activity:
        '实际向同伴说明一段比较与一种排序，回看是否另一种方法和五点都做过，再单独写计划。',
    },
  ],
  questions: [
    {
      id: 'bnu-lower-breeding-given-counts',
      knowledge: 'bnu-lower-breeding',
      prompt: '按原标签顺序填写鸡、鹅、鸭三种数量。',
      rule: {
        kind: 'steps',
        values: [100, 22, 92],
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation:
        '三种标签分别为100只、22只、92只，不能以缩略画的动物件数替换给定数量。',
    },
    {
      id: 'bnu-lower-breeding-most-three',
      knowledge: 'bnu-lower-breeding',
      prompt: '只在鸡100、鹅22、鸭92三种中，哪种最多？',
      rule: {
        kind: 'choice',
        value: '鸡',
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation: '100>92>22，原问题比较这三种已知数量。',
      choices: [
        {
          id: '鸡',
          label: '鸡',
        },
        {
          id: '鹅',
          label: '鹅',
        },
        {
          id: '鸭',
          label: '鸭',
        },
      ],
    },
    {
      id: 'bnu-lower-breeding-least-three',
      knowledge: 'bnu-lower-breeding',
      prompt: '同三种中，哪种最少？',
      rule: {
        kind: 'choice',
        value: '鹅',
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation: '鹅22只最少，不看图上画得是否稀密。',
      choices: [
        {
          id: '鸭',
          label: '鸭',
        },
        {
          id: '鹅',
          label: '鹅',
        },
        {
          id: '鸡',
          label: '鸡',
        },
      ],
    },
    {
      id: 'bnu-lower-breeding-rabbit-unknown',
      knowledge: 'bnu-lower-breeding',
      prompt: '仅看到第52页无数量标签的兔群，能确定兔有0只或97只吗？',
      rule: {
        kind: 'choice',
        value: '不能，须等待数量条件或后页完整线索',
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation:
        '第52页没有兔的数量标签，后页才以候选和完整回答确定，不用未知替代0。',
      choices: [
        {
          id: '此时已确定97只',
          label: '此时已确定97只',
        },
        {
          id: '不能，须等待数量条件或后页完整线索',
          label: '不能，须等待数量条件或后页完整线索',
        },
        {
          id: '就是0只',
          label: '就是0只',
        },
      ],
    },
    {
      id: 'bnu-lower-breeding-picture-count',
      knowledge: 'bnu-lower-breeding',
      prompt: '原标签写鸡100只，缩略图只画出部分鸡。应怎样读原给定数量？',
      rule: {
        kind: 'choice',
        value: '按标签100只，不用画中件数替换',
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation:
        '原给定100是数量条件，画面只为情境，不保证一图一只全部画出。',
      choices: [
        {
          id: '按标签100只，不用画中件数替换',
          label: '按标签100只，不用画中件数替换',
        },
        {
          id: '按画中鸡的件数',
          label: '按画中鸡的件数',
        },
        {
          id: '图不完整就按0只',
          label: '图不完整就按0只',
        },
      ],
    },
    {
      id: 'bnu-lower-breeding-actual-observe',
      knowledge: 'bnu-lower-breeding',
      prompt:
        '实际观察原养殖场图，分别指出鸡、鹅、鸭三个标签，并说明这三种最多与最少。',
      rule: {
        kind: 'manual',
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation:
        '真实完整做过才确认；没有做如实跳过，不从屏幕答对推定已观察原图、移动纸卡或向同伴解释。',
    },
    {
      id: 'bnu-lower-breeding-hen-goose',
      knowledge: 'bnu-lower-breeding',
      prompt: '原鸡100与鹅22，鸡比鹅怎样？',
      rule: {
        kind: 'choice',
        value: '多得多',
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation: '在原情境中100远多于22，这不建立通用固定差数阈值。',
      choices: [
        {
          id: '少一些',
          label: '少一些',
        },
        {
          id: '一样多',
          label: '一样多',
        },
        {
          id: '多得多',
          label: '多得多',
        },
      ],
    },
    {
      id: 'bnu-lower-breeding-hen-duck',
      knowledge: 'bnu-lower-breeding',
      prompt: '原鸡100与鸭92，鸡比鸭怎样？',
      rule: {
        kind: 'choice',
        value: '多一些',
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation: '100略多于92，按本情境表达。',
      choices: [
        {
          id: '多一些',
          label: '多一些',
        },
        {
          id: '少得多',
          label: '少得多',
        },
        {
          id: '一样多',
          label: '一样多',
        },
      ],
    },
    {
      id: 'bnu-lower-breeding-duck-hen',
      knowledge: 'bnu-lower-breeding',
      prompt: '比较方向换成鸭92比鸡100，怎样说？',
      rule: {
        kind: 'choice',
        value: '少一些',
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation: '比较对象反向，多与少也反向。',
      choices: [
        {
          id: '少一些',
          label: '少一些',
        },
        {
          id: '多一些',
          label: '多一些',
        },
        {
          id: '一样多',
          label: '一样多',
        },
      ],
    },
    {
      id: 'bnu-lower-breeding-goose-hen',
      knowledge: 'bnu-lower-breeding',
      prompt: '原鹅22比鸡100怎样？',
      rule: {
        kind: 'choice',
        value: '少得多',
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation: '先说清鹅相对鸡，不混用鸡相对鹅的多。',
      choices: [
        {
          id: '多得多',
          label: '多得多',
        },
        {
          id: '一样多',
          label: '一样多',
        },
        {
          id: '少得多',
          label: '少得多',
        },
      ],
    },
    {
      id: 'bnu-lower-breeding-close-hen-duck',
      knowledge: 'bnu-lower-breeding',
      prompt: '原鸡与鸭的数量关系还可以怎样说？',
      rule: {
        kind: 'choice',
        value: '差不多',
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation: '原100和92较接近，不是100=92；差不多不是相等。',
      choices: [
        {
          id: '差不多',
          label: '差不多',
        },
        {
          id: '完全相等',
          label: '完全相等',
        },
        {
          id: '鹅最多',
          label: '鹅最多',
        },
      ],
    },
    {
      id: 'bnu-lower-breeding-line-right',
      knowledge: 'bnu-lower-breeding',
      prompt: '看本站标数数线，22、92、100中最靠右的标点表示多少？',
      rule: {
        kind: 'choice',
        value: '100',
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation: '同一递增数线上，较大数在右。',
      choices: [
        {
          id: '100',
          label: '100',
        },
        {
          id: '22',
          label: '22',
        },
        {
          id: '92',
          label: '92',
        },
      ],
      visual: {
        kind: 'marked-number-line',
        values: [22, 92, 100],
      },
    },
    {
      id: 'bnu-lower-breeding-threshold',
      knowledge: 'bnu-lower-breeding',
      prompt: '能由本题规定所有情境相差8就一定叫差不多吗？',
      rule: {
        kind: 'choice',
        value: '不能，需结合对象和情境',
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation: '教材的定性词用于这里的比较，不补造普遍固定差数或比例阈值。',
      choices: [
        {
          id: '能，永远按8只判断',
          label: '能，永远按8只判断',
        },
        {
          id: '能，少于100都差不多',
          label: '能，少于100都差不多',
        },
        {
          id: '不能，需结合对象和情境',
          label: '不能，需结合对象和情境',
        },
      ],
    },
    {
      id: 'bnu-lower-breeding-actual-language',
      knowledge: 'bnu-lower-breeding',
      prompt:
        '实际指原数线的鹅、鸭、鸡位置，分别说出四个方向的多/少，并解释鸡鸭差不多不等于相等。',
      rule: {
        kind: 'manual',
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation:
        '真实完整做过才确认；没有做如实跳过，不从屏幕答对推定已观察原图、移动纸卡或向同伴解释。',
    },
    {
      id: 'bnu-lower-breeding-sheep-choice',
      knowledge: 'bnu-lower-breeding',
      prompt: '羊与鹅22只差不多。只在70、26、3三个原候选中填羊的可能只数。',
      rule: {
        kind: 'number',
        value: 26,
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation: '本题选择26，比70或3更接近鹅22；候选推断不冒实际点数。',
    },
    {
      id: 'bnu-lower-breeding-sheep-actual',
      knowledge: 'bnu-lower-breeding',
      prompt: '选择26能证明你已经数过真实羊群吗？',
      rule: {
        kind: 'choice',
        value: '不能，只是题目候选推断',
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation: '题目判断与实地数动物的真实活动分开。',
      choices: [
        {
          id: '不能，只是题目候选推断',
          label: '不能，只是题目候选推断',
        },
        {
          id: '能，网页选对就是数过',
          label: '能，网页选对就是数过',
        },
        {
          id: '能，原插画必定画26只',
          label: '能，原插画必定画26只',
        },
      ],
    },
    {
      id: 'bnu-lower-breeding-actual-sheep',
      knowledge: 'bnu-lower-breeding',
      prompt: '实际在原三候选70、26、3中标出26，指鹅22说明为何本情境选这个数。',
      rule: {
        kind: 'manual',
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation:
        '真实完整做过才确认；没有做如实跳过，不从屏幕答对推定已观察原图、移动纸卡或向同伴解释。',
    },
    {
      id: 'bnu-lower-breeding-rabbit-candidates',
      knowledge: 'bnu-lower-breeding',
      prompt: '依原顺序填猜兔数的四个候选。',
      rule: {
        kind: 'steps',
        values: [18, 26, 90, 97],
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation: '四候选是本题已给条件，不能任意加未给候选。',
    },
    {
      id: 'bnu-lower-breeding-rabbit-two-left',
      knowledge: 'bnu-lower-breeding',
      prompt: '原说比18多得多后，示例认为还有哪两个候选，依从小到大写？',
      rule: {
        kind: 'steps',
        values: [90, 97],
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation:
        '原示例还留90与97，单听这句不能唯一确定；不是一般固定阈值规则。',
    },
    {
      id: 'bnu-lower-breeding-rabbit-before-no',
      knowledge: 'bnu-lower-breeding',
      prompt: '只听比18多得多而没有后续回应，可在90和97中唯一确定吗？',
      rule: {
        kind: 'choice',
        value: '不能，还需完整回应',
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation: '不得跳过后续否定与确认。',
      choices: [
        {
          id: '不能，还需完整回应',
          label: '不能，还需完整回应',
        },
        {
          id: '能，必定90',
          label: '能，必定90',
        },
        {
          id: '能，必定97',
          label: '能，必定97',
        },
      ],
    },
    {
      id: 'bnu-lower-breeding-rabbit-final',
      knowledge: 'bnu-lower-breeding',
      prompt:
        '原四候选中，先说比18多得多，问90回答不是，再问97确认猜对，最后兔数多少？',
      rule: {
        kind: 'number',
        value: 97,
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation: '完整候选和回应共同确定97，不能把页面前后条件混同。',
    },
    {
      id: 'bnu-lower-breeding-rabbit-order',
      knowledge: 'bnu-lower-breeding',
      prompt: '为什么90最后被排除？',
      rule: {
        kind: 'choice',
        value: '因为对90的猜测得到否定',
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation: '依据具体回应，不伪造数的普遍禁用规则。',
      choices: [
        {
          id: '因为90小于18',
          label: '因为90小于18',
        },
        {
          id: '因为任何90都不能表示兔数',
          label: '因为任何90都不能表示兔数',
        },
        {
          id: '因为对90的猜测得到否定',
          label: '因为对90的猜测得到否定',
        },
      ],
    },
    {
      id: 'bnu-lower-breeding-actual-rabbit',
      knowledge: 'bnu-lower-breeding',
      prompt:
        '实际按原对话分角色说完18提问、数量提示、90否定、97确认，并说明每一步知道与尚不知道什么。',
      rule: {
        kind: 'manual',
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation:
        '真实完整做过才确认；没有做如实跳过，不从屏幕答对推定已观察原图、移动纸卡或向同伴解释。',
    },
    {
      id: 'bnu-lower-breeding-original-cards',
      knowledge: 'bnu-lower-breeding',
      prompt: '依原从左到右顺序填五张卡上的数。',
      rule: {
        kind: 'steps',
        values: [50, 98, 38, 10, 51],
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation: '保留原乱序五卡，再实际重新排序。',
    },
    {
      id: 'bnu-lower-breeding-sorted-cards',
      knowledge: 'bnu-lower-breeding',
      prompt: '将给定五卡50、98、38、10、51全部从小到大写出。',
      rule: {
        kind: 'steps',
        values: [10, 38, 50, 51, 98],
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation: '每卡只用一次，五卡全部排完，不以省略号替代余卡。',
    },
    {
      id: 'bnu-lower-breeding-card-count',
      knowledge: 'bnu-lower-breeding',
      prompt: '给定50、98、38、10、51，一共有几张不同卡？',
      rule: {
        kind: 'number',
        value: 5,
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation: '卡张数为5，不是卡上数值的总和。',
    },
    {
      id: 'bnu-lower-breeding-fifty-fifty-one',
      knowledge: 'bnu-lower-breeding',
      prompt: '50与51应怎样排列？',
      rule: {
        kind: 'choice',
        value: '50在51前，两张不同卡',
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation: '50<51，即使数线点很近也不是同一个数。',
      choices: [
        {
          id: '50与51可以合成一张',
          label: '50与51可以合成一张',
        },
        {
          id: '51在50前',
          label: '51在50前',
        },
        {
          id: '50在51前，两张不同卡',
          label: '50在51前，两张不同卡',
        },
      ],
    },
    {
      id: 'bnu-lower-breeding-actual-sort',
      knowledge: 'bnu-lower-breeding',
      prompt:
        '实际用纸卡或已有等价材料把原五卡全部排成10、38、50、51、98，逐卡核对不漏不重复。',
      rule: {
        kind: 'manual',
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation:
        '真实完整做过才确认；没有做如实跳过，不从屏幕答对推定已观察原图、移动纸卡或向同伴解释。',
    },
    {
      id: 'bnu-lower-breeding-select-minimum',
      knowledge: 'bnu-lower-breeding',
      prompt:
        '每次从剩下卡里找最小，完整依次取出五张50、98、38、10、51，应写哪五数？',
      rule: {
        kind: 'steps',
        values: [10, 38, 50, 51, 98],
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation: '每取一张从候选中移开，再找剩下最小，所有五张都取到。',
    },
    {
      id: 'bnu-lower-breeding-insert-first-three',
      knowledge: 'bnu-lower-breeding',
      prompt: '另一法先比50与98，再将38插到合适处，此时三张从小到大是？',
      rule: {
        kind: 'steps',
        values: [38, 50, 98],
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation: '先排50<98，再把38放50前，此时还没处理10和51。',
    },
    {
      id: 'bnu-lower-breeding-insert-all',
      knowledge: 'bnu-lower-breeding',
      prompt: '继续把10与51加入上述已排三卡，最后五张从小到大是？',
      rule: {
        kind: 'steps',
        values: [10, 38, 50, 51, 98],
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation: '10插最前，51插50与98之间，不能漏处理两张新加入卡。',
    },
    {
      id: 'bnu-lower-breeding-partial-method',
      knowledge: 'bnu-lower-breeding',
      prompt: '只排了38、50、98，能说原五卡已经排完吗？',
      rule: {
        kind: 'choice',
        value: '不能，还要加入10和51',
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation: '示例叙述省略不自动等于完整实际排序。',
      choices: [
        {
          id: '能，前三张够了',
          label: '能，前三张够了',
        },
        {
          id: '能，可以省略余卡',
          label: '能，可以省略余卡',
        },
        {
          id: '不能，还要加入10和51',
          label: '不能，还要加入10和51',
        },
      ],
    },
    {
      id: 'bnu-lower-breeding-actual-minimum-method',
      knowledge: 'bnu-lower-breeding',
      prompt: '实际重置原五卡，每次找剩下最小并移出，共完整五次，口述方法。',
      rule: {
        kind: 'manual',
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation:
        '真实完整做过才确认；没有做如实跳过，不从屏幕答对推定已观察原图、移动纸卡或向同伴解释。',
    },
    {
      id: 'bnu-lower-breeding-actual-insert-method',
      knowledge: 'bnu-lower-breeding',
      prompt:
        '再次重置原五卡，先比50/98、加入38，再加入10/51，每一步保持顺序并解释。',
      rule: {
        kind: 'manual',
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation:
        '真实完整做过才确认；没有做如实跳过，不从屏幕答对推定已观察原图、移动纸卡或向同伴解释。',
    },
    {
      id: 'bnu-lower-breeding-marked-direction',
      knowledge: 'bnu-lower-breeding',
      prompt: '看本站数线10、38、50、51、98的标点，沿横线向右数怎样变化？',
      rule: {
        kind: 'choice',
        value: '逐渐增大',
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation: '标签上下错开只防重叠，判断按横线点的左右位置。',
      choices: [
        {
          id: '按标签上下位置定大小',
          label: '按标签上下位置定大小',
        },
        {
          id: '逐渐增大',
          label: '逐渐增大',
        },
        {
          id: '逐渐减小',
          label: '逐渐减小',
        },
      ],
      visual: {
        kind: 'marked-number-line',
        values: [10, 38, 50, 51, 98],
      },
    },
    {
      id: 'bnu-lower-breeding-near-pair',
      knowledge: 'bnu-lower-breeding',
      prompt: '这五点里标数相差1的两个数，依从小到大写？',
      rule: {
        kind: 'steps',
        values: [50, 51],
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation: '50与51是两个不同点、两张不同卡，不因相近变同一。',
      visual: {
        kind: 'marked-number-line',
        values: [10, 38, 50, 51, 98],
      },
    },
    {
      id: 'bnu-lower-breeding-ninety-eight-between',
      knowledge: 'bnu-lower-breeding',
      prompt: '98在相邻两个十刻度之间，按从小到大填两端刻度。',
      rule: {
        kind: 'steps',
        values: [90, 100],
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation: '98大于90且小于100，不因在右端附近当作100。',
      visual: {
        kind: 'marked-number-line',
        values: [98],
      },
    },
    {
      id: 'bnu-lower-breeding-label-height',
      knowledge: 'bnu-lower-breeding',
      prompt: '本站把51标签写得比50标签低，能因此说51较小吗？',
      rule: {
        kind: 'choice',
        value: '不能，要看横线上的点位置',
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation: '不同标签行用于避免50与51重叠，不是第二个数值轴。',
      choices: [
        {
          id: '能，标签高度是数值',
          label: '能，标签高度是数值',
        },
        {
          id: '不能，要看横线上的点位置',
          label: '不能，要看横线上的点位置',
        },
        {
          id: '能，低处永远小',
          label: '能，低处永远小',
        },
      ],
      visual: {
        kind: 'marked-number-line',
        values: [10, 38, 50, 51, 98],
      },
    },
    {
      id: 'bnu-lower-breeding-site-zero',
      knowledge: 'bnu-lower-breeding',
      prompt: '本站数线补出的起点刻度是几？',
      rule: {
        kind: 'number',
        value: 0,
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation:
        '本站原创图补0作参照，原书数线标10起；不把本站补图说成原图已有0。',
      visual: {
        kind: 'marked-number-line',
        values: [10, 38, 50, 51, 98],
      },
    },
    {
      id: 'bnu-lower-breeding-actual-mark',
      knowledge: 'bnu-lower-breeding',
      prompt:
        '实际在原书数线或自己的纸面数线上标齐10、38、50、51、98五点，逐一指点说数。',
      rule: {
        kind: 'manual',
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation:
        '真实完整做过才确认；没有做如实跳过，不从屏幕答对推定已观察原图、移动纸卡或向同伴解释。',
    },
    {
      id: 'bnu-lower-breeding-actual-explain',
      knowledge: 'bnu-lower-breeding',
      prompt:
        '实际向同伴解释数线向右更大、50与51不同、两种排序怎么做；是否理解如实记录。',
      rule: {
        kind: 'manual',
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation:
        '真实完整做过才确认；没有做如实跳过，不从屏幕答对推定已观察原图、移动纸卡或向同伴解释。',
    },
    {
      id: 'bnu-lower-breeding-own-comparison',
      knowledge: 'bnu-lower-breeding',
      prompt:
        '记录自己真实用了什么比较方法，比较对象和方向是什么；未做如实写。',
      rule: {
        kind: 'reflection',
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation: '保存自己的原话，不评分；已做与未知如实说明，未来计划另记。',
    },
    {
      id: 'bnu-lower-breeding-own-sort',
      knowledge: 'bnu-lower-breeding',
      prompt:
        '记录自己实际排序的过程或尚未做的状态，不复制原示例冒自己的操作。',
      rule: {
        kind: 'reflection',
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation: '保存自己的原话，不评分；已做与未知如实说明，未来计划另记。',
    },
    {
      id: 'bnu-lower-breeding-discovery',
      knowledge: 'bnu-lower-breeding',
      prompt: '记录本次对数线、比较词或完整线索的一条发现。',
      rule: {
        kind: 'reflection',
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation: '保存自己的原话，不评分；已做与未知如实说明，未来计划另记。',
    },
    {
      id: 'bnu-lower-breeding-difficulty',
      knowledge: 'bnu-lower-breeding',
      prompt: '记录还不清楚的一处，可以写暂时没有困难。',
      rule: {
        kind: 'reflection',
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation: '保存自己的原话，不评分；已做与未知如实说明，未来计划另记。',
    },
    {
      id: 'bnu-lower-breeding-plan',
      knowledge: 'bnu-lower-breeding',
      prompt: '单独写下一次准备练什么；这是未来计划，不算本次已经做过。',
      rule: {
        kind: 'reflection',
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation: '保存自己的原话，不评分；已做与未知如实说明，未来计划另记。',
    },
  ],
  reviewQuestions: [
    {
      id: 'bnu-lower-breeding-review-reverse',
      knowledge: 'bnu-lower-breeding',
      prompt: '新条件鸭92与鹅22相比，鹅比鸭怎样？',
      rule: {
        kind: 'choice',
        value: '少得多',
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation: '比较对象换成鹅与鸭，22相对92少得多，按此情境判断。',
      choices: [
        {
          id: '少得多',
          label: '少得多',
        },
        {
          id: '多得多',
          label: '多得多',
        },
        {
          id: '一样多',
          label: '一样多',
        },
      ],
    },
    {
      id: 'bnu-lower-breeding-review-sort',
      knowledge: 'bnu-lower-breeding',
      prompt: '新五卡12、39、90、40、41，全部从小到大写。',
      rule: {
        kind: 'steps',
        values: [12, 39, 40, 41, 90],
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation: '重排新卡，不能套原10、38、50、51、98。',
    },
    {
      id: 'bnu-lower-breeding-review-clue',
      knowledge: 'bnu-lower-breeding',
      prompt:
        '新候选30、68、72，已经排除30；询问68回答不是，在只限这三候选时剩哪个？',
      rule: {
        kind: 'choice',
        value: '72',
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation: '依新候选和明确排除，不能套原兔数97。',
      choices: [
        {
          id: '72',
          label: '72',
        },
        {
          id: '68',
          label: '68',
        },
        {
          id: '30',
          label: '30',
        },
      ],
    },
    {
      id: 'bnu-lower-breeding-review-near',
      knowledge: 'bnu-lower-breeding',
      prompt:
        '新数线标39、40、41，其中从40往右最近的标数与从40往左最近的标数依次是什么？',
      rule: {
        kind: 'steps',
        values: [41, 39],
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation: '新的参照是40，右41、左39，标签高度不参与判断。',
      visual: {
        kind: 'marked-number-line',
        values: [39, 40, 41],
      },
    },
    {
      id: 'bnu-lower-breeding-review-close',
      knowledge: 'bnu-lower-breeding',
      prompt: '新一对卡20与21位置相邻，能合并成同一个数吗？',
      rule: {
        kind: 'choice',
        value: '不能，20与21仍是不同的数',
      },
      hint: '先找已给对象、数量和完整线索；按同一数线左右位置比较，真实排序和纸面标点另做。',
      explanation: '相近和相等分开，不需要固定差不多阈值。',
      choices: [
        {
          id: '能，靠近就是相等',
          label: '能，靠近就是相等',
        },
        {
          id: '能，丢掉一张',
          label: '能，丢掉一张',
        },
        {
          id: '不能，20与21仍是不同的数',
          label: '不能，20与21仍是不同的数',
        },
      ],
    },
  ],
};

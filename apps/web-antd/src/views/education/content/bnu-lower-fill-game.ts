import type { Lesson } from '../learning/types';

export const bnuLowerFillGameLesson: Lesson = {
  id: 'bnu-lower-fill-game',
  textbookTitle: '填数游戏',
  title: '行列填数：三行三列与五行五列完整挑战',
  page: 60,
  version: 1,
  status: 'available',
  goal: '按允许范围和行列不重复规则填齐原两图全部空格，理解两种中间阶段、同时看行列与试填调整，完整检查并真实交流。',
  prerequisite: '能读写1～5，知道行、列、空白和给定数，愿意逐格核对。',
  parentTip:
    '依据实际查看60～61两页与独立行列枚举。原3×3五空及5×5七空完整保留，两题在原条件下唯一；不增小宫格或对角线限制，原三个对角线1合法。起点开放、原给定保留，初始与补三行/再填2两个原中间阶段明确分开，图中字母不泄填法。原创方格无教材插画；六实做人工、三记录null与计划分开，旧历史/schema1保持，不需学校或指定审校人前置，最终教师审校未核验。',
  review: {
    date: '2026-10-05',
    reviewer: '60～61整页与两完整方格、两个中间阶段及行列全部解独立核对',
    notes: '五原活动对应，网页练习不替实际纸面、口述或交流。',
  },
  steps: [
    {
      title: '读懂三行三列的规则',
      text: '每空取1、2、3中的一个；每行每列不能重复，给定数不擦掉。原三个1位于对角线上并不违反行列规则，不擅加小宫格或对角线规则。行从上到下、列从左到右，字母仅对应本图空格。',
      activity: '实际指图说规则，空白与真实数字分清。',
      visual: {
        kind: 'bnu-fill-grid',
        scene: 'three',
        variant: 'main',
      },
    },
    {
      title: '原建议从第三行开始',
      text: '第三行已有2、1，因此第一格填3。原建议少空处开始，也可用其它合理起点；先看行，再用列继续排除，不把起点强称唯一方法。',
      activity: '对照原图实际说出一格的行和列。',
      visual: {
        kind: 'bnu-fill-grid',
        scene: 'three',
        variant: 'main',
      },
    },
    {
      title: '三行三列全部填齐再检查',
      text: '原五空上到下、行内左到右为3、2、2、3、3。完整三行1/3/2、2/1/3、3/2/1，每行和每列都含1～3且无重复。只做第三行不是完成整题。',
      activity: '实际填齐五空，逐行逐列核对。',
      visual: {
        kind: 'bnu-fill-grid',
        scene: 'three',
        variant: 'main',
      },
    },
    {
      title: '升级五行五列保留规则',
      text: '现在每空取1～5，行列不重复规则仍保留。原图七空全部要填，不能把后面中间图里的新数当最初给定。先看三条仅一空的行。',
      activity: '实际找出全部七空和三条少空行。',
      visual: {
        kind: 'bnu-fill-grid',
        scene: 'five',
        variant: 'main',
      },
    },
    {
      title: '三条少空行后的明确中间阶段',
      text: '第三行4/2/空/1/5缺3；第四行2/空/4/3/1缺5；第五行3/4/1/空/2缺5。完成这三行后，中间阶段只剩四空。两个5分别在不同的行与列，并不违反规则。',
      activity: '实际在原图填这三格并检查对应列。',
      visual: {
        kind: 'bnu-fill-grid',
        scene: 'five-stage',
        variant: 'main',
      },
    },
    {
      title: '同时看行与列才能决定',
      text: '第一行5/1/空/空/3只看行可填2或4；第三列已有3/4/1，因此第一行第三格不能再填4，只能2。这是本明确中间阶段的推理，不把有限一行信息当足够条件。',
      activity: '实际指图解释行候选与列排除。',
      visual: {
        kind: 'bnu-fill-grid',
        scene: 'five-stage',
        variant: 'main',
      },
    },
    {
      title: '剩余三空完整补齐',
      text: '第一行第三格填2后，下一阶段剩三空：第一行第四格4、第二行第三格5、第二行第四格2。字母按本阶段重新对应，不沿用最初七空编号。完成后五行和五列全部检查范围与重复。',
      activity: '实际填完七空并核对整图。',
      visual: {
        kind: 'bnu-fill-grid',
        scene: 'five-next',
        variant: 'main',
      },
    },
    {
      title: '回顾、试填与真实交流分别记录',
      text: '少空处先看是策略，不确定可先试填，发现重复再按条件调整。不给一次试错贴能力标签；始终保留原给定，最后同时查行与列。真实纸面、口述、交流人工确认，个人原话不判统一答案，未来计划另记。',
      activity: '实际交流一种方法，记录已做与未做。',
    },
  ],
  questions: [
    {
      id: 'bnu-lower-fill-game-allowed-three',
      knowledge: 'bnu-lower-fill-game',
      prompt: '原三行三列游戏，每空允许填哪些数？',
      rule: {
        kind: 'choice',
        value: '1、2、3',
      },
      hint: '先保留给定数，检查允许范围，再同时查看目标格所在的行和列；填完须逐行逐列核对。试填可以调整，真实纸笔和交流另记。',
      explanation: '每空取1～3；空格不是0，范围不是任意整数。',
      visual: {
        kind: 'bnu-fill-grid',
        scene: 'three',
        variant: 'main',
      },
      choices: [
        {
          id: '1、2、3',
          label: '1、2、3',
        },
        {
          id: '0、1、2',
          label: '0、1、2',
        },
        {
          id: '任意整数',
          label: '任意整数',
        },
      ],
    },
    {
      id: 'bnu-lower-fill-game-row-repeat',
      knowledge: 'bnu-lower-fill-game',
      prompt: '每空填1～3。若同一行两个格都填2，可不可以？',
      rule: {
        kind: 'choice',
        value: '不可以，同一行不能重复',
      },
      hint: '先保留给定数，检查允许范围，再同时查看目标格所在的行和列；填完须逐行逐列核对。试填可以调整，真实纸笔和交流另记。',
      explanation: '行和列两个条件都要满足，同一行重复2不合法。',
      choices: [
        {
          id: '不可以，同一行不能重复',
          label: '不可以，同一行不能重复',
        },
        {
          id: '可以，只看列',
          label: '可以，只看列',
        },
      ],
    },
    {
      id: 'bnu-lower-fill-game-column-repeat',
      knowledge: 'bnu-lower-fill-game',
      prompt: '每空填1～3。若同一列已有1，又在这列另一个空格填1，可不可以？',
      rule: {
        kind: 'choice',
        value: '不可以，同一列不能重复',
      },
      hint: '先保留给定数，检查允许范围，再同时查看目标格所在的行和列；填完须逐行逐列核对。试填可以调整，真实纸笔和交流另记。',
      explanation: '同一列不能重复1，即使目标行没有1也不够。',
      choices: [
        {
          id: '不可以，同一列不能重复',
          label: '不可以，同一列不能重复',
        },
        {
          id: '可以，只看行',
          label: '可以，只看行',
        },
      ],
    },
    {
      id: 'bnu-lower-fill-game-diagonal',
      knowledge: 'bnu-lower-fill-game',
      prompt: '原三行三列给定三个1在对角线上。原规则是否禁止对角线上重复？',
      rule: {
        kind: 'choice',
        value: '不禁止，原规则只限制每行和每列',
      },
      hint: '先保留给定数，检查允许范围，再同时查看目标格所在的行和列；填完须逐行逐列核对。试填可以调整，真实纸笔和交流另记。',
      explanation:
        '原各行各列只各有一个1，三个对角线1不违反原规则，不擅加数独规则。',
      visual: {
        kind: 'bnu-fill-grid',
        scene: 'three',
        variant: 'main',
      },
      choices: [
        {
          id: '不禁止，原规则只限制每行和每列',
          label: '不禁止，原规则只限制每行和每列',
        },
        {
          id: '禁止，还要加小宫格规则',
          label: '禁止，还要加小宫格规则',
        },
      ],
    },
    {
      id: 'bnu-lower-fill-game-three-start',
      knowledge: 'bnu-lower-fill-game',
      prompt: '每格1～3且每行每列不重复。原第三行是空、2、1，第一格应填几？',
      rule: {
        kind: 'number',
        value: 3,
      },
      hint: '先保留给定数，检查允许范围，再同时查看目标格所在的行和列；填完须逐行逐列核对。试填可以调整，真实纸笔和交流另记。',
      explanation: '已经有2和1，第三行剩3。起点策略可换，原给定不改。',
      visual: {
        kind: 'bnu-fill-grid',
        scene: 'three',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-fill-game-three-all',
      knowledge: 'bnu-lower-fill-game',
      prompt:
        '每格1～3且每行每列不重复。按图A～E（从上到下、行内左到右）填齐原三行三列全部五空。',
      rule: {
        kind: 'steps',
        values: [3, 2, 2, 3, 3],
      },
      hint: '先保留给定数，检查允许范围，再同时查看目标格所在的行和列；填完须逐行逐列核对。试填可以调整，真实纸笔和交流另记。',
      explanation:
        '完成三行为1/3/2、2/1/3、3/2/1；逐列也分别不重复，五空都核对。',
      visual: {
        kind: 'bnu-fill-grid',
        scene: 'three',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-fill-game-three-bottom',
      knowledge: 'bnu-lower-fill-game',
      prompt:
        '每格1～3且行列不重复，原第三行空、2、1。依次写完整第三行三个数。',
      rule: {
        kind: 'steps',
        values: [3, 2, 1],
      },
      hint: '先保留给定数，检查允许范围，再同时查看目标格所在的行和列；填完须逐行逐列核对。试填可以调整，真实纸笔和交流另记。',
      explanation: '第一格3，原2和1不变；完成第三行还须继续其它四空。',
      visual: {
        kind: 'bnu-fill-grid',
        scene: 'three',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-fill-game-three-check',
      knowledge: 'bnu-lower-fill-game',
      prompt: '三行三列全部填完，应该检查什么？',
      rule: {
        kind: 'choice',
        value: '三行和三列都检查',
      },
      hint: '先保留给定数，检查允许范围，再同时查看目标格所在的行和列；填完须逐行逐列核对。试填可以调整，真实纸笔和交流另记。',
      explanation: '每行每列范围正确且不重复；只检查建议起点不证明整图完成。',
      choices: [
        {
          id: '三行和三列都检查',
          label: '三行和三列都检查',
        },
        {
          id: '只检查第三行',
          label: '只检查第三行',
        },
        {
          id: '只检查对角线',
          label: '只检查对角线',
        },
      ],
    },
    {
      id: 'bnu-lower-fill-game-five-allowed',
      knowledge: 'bnu-lower-fill-game',
      prompt: '升级原五行五列仍每行每列不重复，现在每空允许哪些数？',
      rule: {
        kind: 'choice',
        value: '1、2、3、4、5',
      },
      hint: '先保留给定数，检查允许范围，再同时查看目标格所在的行和列；填完须逐行逐列核对。试填可以调整，真实纸笔和交流另记。',
      explanation: '升级改变允许范围为1～5，行列规则保留。',
      visual: {
        kind: 'bnu-fill-grid',
        scene: 'five',
        variant: 'main',
      },
      choices: [
        {
          id: '1、2、3、4、5',
          label: '1、2、3、4、5',
        },
        {
          id: '仍只允许1、2、3',
          label: '仍只允许1、2、3',
        },
        {
          id: '只限制行，不限制列',
          label: '只限制行，不限制列',
        },
      ],
    },
    {
      id: 'bnu-lower-fill-game-five-single',
      knowledge: 'bnu-lower-fill-game',
      prompt:
        '原5×5每格1～5且行列不重复。第三行4、2、空、1、5；第四行2、空、4、3、1；第五行3、4、1、空、2。依次填这三行唯一的空格。',
      rule: {
        kind: 'steps',
        values: [3, 5, 5],
      },
      hint: '先保留给定数，检查允许范围，再同时查看目标格所在的行和列；填完须逐行逐列核对。试填可以调整，真实纸笔和交流另记。',
      explanation: '三行缺数依次3、5、5，两个5在不同的行和不同的列，允许。',
      visual: {
        kind: 'bnu-fill-grid',
        scene: 'five',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-fill-game-five-all',
      knowledge: 'bnu-lower-fill-game',
      prompt:
        '每格1～5，每行每列不重复。保留原5×5全部给定数，按图A～G（上到下、行内左到右）填齐七空。',
      rule: {
        kind: 'steps',
        values: [2, 4, 5, 2, 3, 5, 5],
      },
      hint: '先保留给定数，检查允许范围，再同时查看目标格所在的行和列；填完须逐行逐列核对。试填可以调整，真实纸笔和交流另记。',
      explanation:
        '完成五行5/1/2/4/3、1/3/5/2/4、4/2/3/1/5、2/5/4/3/1、3/4/1/5/2；全部行和列核对。',
      visual: {
        kind: 'bnu-fill-grid',
        scene: 'five',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-fill-game-row-options',
      knowledge: 'bnu-lower-fill-game',
      prompt:
        '每格1～5。明确处于已补第三四五行的中间阶段，第一行5、1、空、空、3。只看这一行，两个缺数从小到大是什么？',
      rule: {
        kind: 'steps',
        values: [2, 4],
      },
      hint: '先保留给定数，检查允许范围，再同时查看目标格所在的行和列；填完须逐行逐列核对。试填可以调整，真实纸笔和交流另记。',
      explanation: '只看第一行剩2与4，尚不能把两空次序都定下。',
      visual: {
        kind: 'bnu-fill-grid',
        scene: 'five-stage',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-fill-game-column-known',
      knowledge: 'bnu-lower-fill-game',
      prompt:
        '每格1～5。已补第三四五行的中间图第三列从上到下是空、空、3、4、1。依次写三个已知数（不填写空格）。',
      rule: {
        kind: 'steps',
        values: [3, 4, 1],
      },
      hint: '先保留给定数，检查允许范围，再同时查看目标格所在的行和列；填完须逐行逐列核对。试填可以调整，真实纸笔和交流另记。',
      explanation: '第三列已知3、4、1；空格仍未知，不填0。',
      visual: {
        kind: 'bnu-fill-grid',
        scene: 'five-stage',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-fill-game-intersection',
      knowledge: 'bnu-lower-fill-game',
      prompt:
        '每格1～5且每行每列不重复。已补后三行的中间图第一行5、1、空、空、3，第三列空、空、3、4、1。第一行第三格应填几？',
      rule: {
        kind: 'number',
        value: 2,
      },
      hint: '先保留给定数，检查允许范围，再同时查看目标格所在的行和列；填完须逐行逐列核对。试填可以调整，真实纸笔和交流另记。',
      explanation: '行内候选2/4，列中已有4，所以选2；不能只看行随意选4。',
      visual: {
        kind: 'bnu-fill-grid',
        scene: 'five-stage',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-fill-game-five-next-all',
      knowledge: 'bnu-lower-fill-game',
      prompt:
        '每格1～5且行列不重复。明确下一阶段：后三行已完成、第一行第三格已填2。按此图A～C填剩余三个空。',
      rule: {
        kind: 'steps',
        values: [4, 5, 2],
      },
      hint: '先保留给定数，检查允许范围，再同时查看目标格所在的行和列；填完须逐行逐列核对。试填可以调整，真实纸笔和交流另记。',
      explanation:
        '第一行第四格4；第二行第三格5、第四格2。按本阶段字母，不沿用初始A～G顺序。',
      visual: {
        kind: 'bnu-fill-grid',
        scene: 'five-next',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-fill-game-row-two',
      knowledge: 'bnu-lower-fill-game',
      prompt:
        '每格1～5且行列不重复，原第二行1、3、空、空、4。结合完整原5×5图，按左到右写完整第二行。',
      rule: {
        kind: 'steps',
        values: [1, 3, 5, 2, 4],
      },
      hint: '先保留给定数，检查允许范围，再同时查看目标格所在的行和列；填完须逐行逐列核对。试填可以调整，真实纸笔和交流另记。',
      explanation:
        '第二行第三格5、第四格2；原1、3、4保持，须结合列不能只凭行定空格次序。',
      visual: {
        kind: 'bnu-fill-grid',
        scene: 'five',
        variant: 'main',
      },
    },
    {
      id: 'bnu-lower-fill-game-row-only-mistake',
      knowledge: 'bnu-lower-fill-game',
      prompt:
        '中间图第一行缺2和4，第三列已经有4。第一行第三格试填4，哪里不符合？',
      rule: {
        kind: 'choice',
        value: '第三列重复4，需要调整',
      },
      hint: '先保留给定数，检查允许范围，再同时查看目标格所在的行和列；填完须逐行逐列核对。试填可以调整，真实纸笔和交流另记。',
      explanation:
        '第一行本身不重复4，但第三列已有4；试填错可调整到2，不把试错当能力评价。',
      visual: {
        kind: 'bnu-fill-grid',
        scene: 'five-stage',
        variant: 'main',
      },
      choices: [
        {
          id: '第三列重复4，需要调整',
          label: '第三列重复4，需要调整',
        },
        {
          id: '第一行必定重复4',
          label: '第一行必定重复4',
        },
        {
          id: '试填过就不能再修改',
          label: '试填过就不能再修改',
        },
      ],
    },
    {
      id: 'bnu-lower-fill-game-givens',
      knowledge: 'bnu-lower-fill-game',
      prompt: '遇到难填的空格，可以擦掉原给定数来改规则吗？',
      rule: {
        kind: 'choice',
        value: '不可以，须保留原给定数',
      },
      hint: '先保留给定数，检查允许范围，再同时查看目标格所在的行和列；填完须逐行逐列核对。试填可以调整，真实纸笔和交流另记。',
      explanation: '给定数是题目条件；自制新题可另命名，不能当完成原题。',
      choices: [
        {
          id: '不可以，须保留原给定数',
          label: '不可以，须保留原给定数',
        },
        {
          id: '可以，随意改给定',
          label: '可以，随意改给定',
        },
      ],
    },
    {
      id: 'bnu-lower-fill-game-trial-adjust',
      knowledge: 'bnu-lower-fill-game',
      prompt: '尚不能确定时先试填，发现同列重复后，接下来怎么办？',
      rule: {
        kind: 'choice',
        value: '回看行列条件并调整试填数',
      },
      hint: '先保留给定数，检查允许范围，再同时查看目标格所在的行和列；填完须逐行逐列核对。试填可以调整，真实纸笔和交流另记。',
      explanation: '原回顾允许先试再调整；不改原给定，继续按行列检查。',
      choices: [
        {
          id: '回看行列条件并调整试填数',
          label: '回看行列条件并调整试填数',
        },
        {
          id: '保持重复也算完成',
          label: '保持重复也算完成',
        },
        {
          id: '一次试错说明不能学习',
          label: '一次试错说明不能学习',
        },
      ],
    },
    {
      id: 'bnu-lower-fill-game-final-check',
      knowledge: 'bnu-lower-fill-game',
      prompt: '五行五列填完后，哪种核对足够完整？',
      rule: {
        kind: 'choice',
        value: '五行和五列逐一检查范围及重复',
      },
      hint: '先保留给定数，检查允许范围，再同时查看目标格所在的行和列；填完须逐行逐列核对。试填可以调整，真实纸笔和交流另记。',
      explanation: '全部五行和五列都符合；网页结果不代替真实纸面检查。',
      choices: [
        {
          id: '五行和五列逐一检查范围及重复',
          label: '五行和五列逐一检查范围及重复',
        },
        {
          id: '只看空格最多的一行',
          label: '只看空格最多的一行',
        },
        {
          id: '只看最后填的格',
          label: '只看最后填的格',
        },
      ],
    },
    {
      id: 'bnu-lower-fill-game-actual-rule',
      knowledge: 'bnu-lower-fill-game',
      prompt: '实际指着原图读出允许数字、给定格和空格，说清行与列两个规则。',
      rule: {
        kind: 'manual',
      },
      hint: '先保留给定数，检查允许范围，再同时查看目标格所在的行和列；填完须逐行逐列核对。试填可以调整，真实纸笔和交流另记。',
      explanation:
        '实际做过才确认；尚未做、只有计划或仅网页答题请跳过。纸面、口述和交流分别如实记。',
    },
    {
      id: 'bnu-lower-fill-game-actual-three',
      knowledge: 'bnu-lower-fill-game',
      prompt: '对照合法原教材实际填写三行三列全部五空，并逐行逐列检查。',
      rule: {
        kind: 'manual',
      },
      hint: '先保留给定数，检查允许范围，再同时查看目标格所在的行和列；填完须逐行逐列核对。试填可以调整，真实纸笔和交流另记。',
      explanation:
        '实际做过才确认；尚未做、只有计划或仅网页答题请跳过。纸面、口述和交流分别如实记。',
    },
    {
      id: 'bnu-lower-fill-game-actual-five',
      knowledge: 'bnu-lower-fill-game',
      prompt: '实际填写五行五列全部七空，保留给定，写完整五行并逐列检查。',
      rule: {
        kind: 'manual',
      },
      hint: '先保留给定数，检查允许范围，再同时查看目标格所在的行和列；填完须逐行逐列核对。试填可以调整，真实纸笔和交流另记。',
      explanation:
        '实际做过才确认；尚未做、只有计划或仅网页答题请跳过。纸面、口述和交流分别如实记。',
    },
    {
      id: 'bnu-lower-fill-game-actual-stage',
      knowledge: 'bnu-lower-fill-game',
      prompt:
        '实际指图解释三条仅一空行的填写和第一行第三格为什么不能选4；两种原中间阶段分开。',
      rule: {
        kind: 'manual',
      },
      hint: '先保留给定数，检查允许范围，再同时查看目标格所在的行和列；填完须逐行逐列核对。试填可以调整，真实纸笔和交流另记。',
      explanation:
        '实际做过才确认；尚未做、只有计划或仅网页答题请跳过。纸面、口述和交流分别如实记。',
    },
    {
      id: 'bnu-lower-fill-game-actual-check',
      knowledge: 'bnu-lower-fill-game',
      prompt:
        '回看自己真实完成的两个方格，逐行逐列核对范围与重复；若有试填错，实际修改并再检查。',
      rule: {
        kind: 'manual',
      },
      hint: '先保留给定数，检查允许范围，再同时查看目标格所在的行和列；填完须逐行逐列核对。试填可以调整，真实纸笔和交流另记。',
      explanation:
        '实际做过才确认；尚未做、只有计划或仅网页答题请跳过。纸面、口述和交流分别如实记。',
    },
    {
      id: 'bnu-lower-fill-game-actual-exchange',
      knowledge: 'bnu-lower-fill-game',
      prompt:
        '与陪伴者实际交流一种起点和一种行列排除方法，听取对方检查，不把网站答对当已交流。',
      rule: {
        kind: 'manual',
      },
      hint: '先保留给定数，检查允许范围，再同时查看目标格所在的行和列；填完须逐行逐列核对。试填可以调整，真实纸笔和交流另记。',
      explanation:
        '实际做过才确认；尚未做、只有计划或仅网页答题请跳过。纸面、口述和交流分别如实记。',
    },
    {
      id: 'bnu-lower-fill-game-method',
      knowledge: 'bnu-lower-fill-game',
      prompt:
        '记录自己实际从哪里开始、用了什么行列条件；可以与书中建议不同，不统一评分。',
      rule: {
        kind: 'reflection',
      },
      hint: '先保留给定数，检查允许范围，再同时查看目标格所在的行和列；填完须逐行逐列核对。试填可以调整，真实纸笔和交流另记。',
      explanation:
        '保存孩子原话，correct:null；不判方法喜好或情绪，计划与实做分开。',
    },
    {
      id: 'bnu-lower-fill-game-trial-record',
      knowledge: 'bnu-lower-fill-game',
      prompt:
        '如实记录一次试填后怎样检查或调整；没有试错也可如实记，不编造困难。',
      rule: {
        kind: 'reflection',
      },
      hint: '先保留给定数，检查允许范围，再同时查看目标格所在的行和列；填完须逐行逐列核对。试填可以调整，真实纸笔和交流另记。',
      explanation:
        '保存孩子原话，correct:null；不判方法喜好或情绪，计划与实做分开。',
    },
    {
      id: 'bnu-lower-fill-game-plan',
      knowledge: 'bnu-lower-fill-game',
      prompt: '另记下一步准备怎样练习或检查。未来计划不当已经完成。',
      rule: {
        kind: 'reflection',
      },
      hint: '先保留给定数，检查允许范围，再同时查看目标格所在的行和列；填完须逐行逐列核对。试填可以调整，真实纸笔和交流另记。',
      explanation:
        '保存孩子原话，correct:null；不判方法喜好或情绪，计划与实做分开。',
    },
  ],
  reviewQuestions: [
    {
      id: 'bnu-lower-fill-game-review-three-all',
      knowledge: 'bnu-lower-fill-game',
      prompt:
        '本站新三行三列（给定数字循环变换），每格1～3且行列不重复。按图A～E填齐全部五空。',
      rule: {
        kind: 'steps',
        values: [1, 3, 3, 1, 1],
      },
      hint: '先保留给定数，检查允许范围，再同时查看目标格所在的行和列；填完须逐行逐列核对。试填可以调整，真实纸笔和交流另记。',
      explanation: '新完整三行为2/1/3、3/2/1、1/3/2，不能照抄原五空。',
      visual: {
        kind: 'bnu-fill-grid',
        scene: 'three',
        variant: 'review',
      },
    },
    {
      id: 'bnu-lower-fill-game-review-three-start',
      knowledge: 'bnu-lower-fill-game',
      prompt:
        '本站新三行三列第三行为空、3、2，每格1～3且行列不重复，第一格填几？',
      rule: {
        kind: 'number',
        value: 1,
      },
      hint: '先保留给定数，检查允许范围，再同时查看目标格所在的行和列；填完须逐行逐列核对。试填可以调整，真实纸笔和交流另记。',
      explanation: '已知3和2，剩1，条件已变。',
      visual: {
        kind: 'bnu-fill-grid',
        scene: 'three',
        variant: 'review',
      },
    },
    {
      id: 'bnu-lower-fill-game-review-five-all',
      knowledge: 'bnu-lower-fill-game',
      prompt:
        '本站新5×5给定数字循环变换，每格1～5且行列不重复。按图A～G填齐全部七空。',
      rule: {
        kind: 'steps',
        values: [3, 5, 1, 3, 4, 1, 1],
      },
      hint: '先保留给定数，检查允许范围，再同时查看目标格所在的行和列；填完须逐行逐列核对。试填可以调整，真实纸笔和交流另记。',
      explanation:
        '新完整五行1/2/3/5/4、2/4/1/3/5、5/3/4/2/1、3/1/5/4/2、4/5/2/1/3，原七空不能照搬。',
      visual: {
        kind: 'bnu-fill-grid',
        scene: 'five',
        variant: 'review',
      },
    },
    {
      id: 'bnu-lower-fill-game-review-five-single',
      knowledge: 'bnu-lower-fill-game',
      prompt:
        '新5×5第三行5、3、空、2、1；第四行3、空、5、4、2；第五行4、5、2、空、3，每格1～5。依次填三行各自缺数。',
      rule: {
        kind: 'steps',
        values: [4, 1, 1],
      },
      hint: '先保留给定数，检查允许范围，再同时查看目标格所在的行和列；填完须逐行逐列核对。试填可以调整，真实纸笔和交流另记。',
      explanation: '三个缺数4、1、1，两个1不在同一行或列。',
      visual: {
        kind: 'bnu-fill-grid',
        scene: 'five',
        variant: 'review',
      },
    },
    {
      id: 'bnu-lower-fill-game-review-row-options',
      knowledge: 'bnu-lower-fill-game',
      prompt:
        '本站新中间阶段第一行1、2、空、空、4，每格1～5，只看行的两个缺数升序填写。',
      rule: {
        kind: 'steps',
        values: [3, 5],
      },
      hint: '先保留给定数，检查允许范围，再同时查看目标格所在的行和列；填完须逐行逐列核对。试填可以调整，真实纸笔和交流另记。',
      explanation: '新行只缺3、5，尚需同时看列决定位置。',
      visual: {
        kind: 'bnu-fill-grid',
        scene: 'five-stage',
        variant: 'review',
      },
    },
    {
      id: 'bnu-lower-fill-game-review-intersection',
      knowledge: 'bnu-lower-fill-game',
      prompt:
        '本站新中间阶段第一行1、2、空、空、4，第三列空、空、4、5、2，每格1～5且行列不重复。第一行第三格填几？',
      rule: {
        kind: 'number',
        value: 3,
      },
      hint: '先保留给定数，检查允许范围，再同时查看目标格所在的行和列；填完须逐行逐列核对。试填可以调整，真实纸笔和交流另记。',
      explanation: '行候选3/5，列已有5，交集剩3。',
      visual: {
        kind: 'bnu-fill-grid',
        scene: 'five-stage',
        variant: 'review',
      },
    },
    {
      id: 'bnu-lower-fill-game-review-next-all',
      knowledge: 'bnu-lower-fill-game',
      prompt:
        '本站新下一阶段，后三行完成、第一行第三格已填3，每格1～5且行列不重复。按此图A～C填剩余三空。',
      rule: {
        kind: 'steps',
        values: [5, 1, 3],
      },
      hint: '先保留给定数，检查允许范围，再同时查看目标格所在的行和列；填完须逐行逐列核对。试填可以调整，真实纸笔和交流另记。',
      explanation: '新三空5、1、3，字母只对应本阶段。',
      visual: {
        kind: 'bnu-fill-grid',
        scene: 'five-next',
        variant: 'review',
      },
    },
    {
      id: 'bnu-lower-fill-game-review-check-reason',
      knowledge: 'bnu-lower-fill-game',
      prompt:
        '本站新图第一行第三格只看行可选3或5，第三列已有5。为什么不能选5？',
      rule: {
        kind: 'choice',
        value: '第三列会重复5',
      },
      hint: '先保留给定数，检查允许范围，再同时查看目标格所在的行和列；填完须逐行逐列核对。试填可以调整，真实纸笔和交流另记。',
      explanation: '须同时看行列，不新增对角线规则。',
      visual: {
        kind: 'bnu-fill-grid',
        scene: 'five-stage',
        variant: 'review',
      },
      choices: [
        {
          id: '第三列会重复5',
          label: '第三列会重复5',
        },
        {
          id: '因为第一行已有5',
          label: '因为第一行已有5',
        },
        {
          id: '因为对角线必须不同',
          label: '因为对角线必须不同',
        },
      ],
    },
  ],
};

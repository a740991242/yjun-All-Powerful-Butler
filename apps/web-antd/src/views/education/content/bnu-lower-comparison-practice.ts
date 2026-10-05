import type { Lesson } from '../learning/types';

export const bnuLowerComparisonPracticeLesson: Lesson = {
  id: 'bnu-lower-comparison-practice',
  textbookTitle: '练一练：比较与排序',
  title: '比较与排序练习：人数、年龄与四组得分',
  page: 54,
  version: 1,
  status: 'available',
  goal: '根据参照对象和候选比较少一些、少得多、差不多；完整排序四组得分并保留组名对应，解释排序方向。',
  prerequisite: '能比较100以内的数，能说多/少的方向，理解差不多不是相等。',
  parentTip:
    '依据核读54页全部三项活动。跑步86与88/12/76、爸爸37与39/50/28都是原题给定条件，不采集真实班级或家庭信息。定性词限定本题候选，不设普遍固定差数或比例阈值；差不多不是相等。四卡淘气95/笑笑88/妙想91/奇思79按从高到低排全部四张，组名分数一起移动，三个大于关系分别读；与前页升序分清。原表画圈/勾、口述、实际摆卡独立人工，自己的发现与困难不评分、未来计划另列。未知不0，没有原表可自写纸卡，不需学校资料或新购买，最终教师审校未核验。',
  review: {
    date: '2026-10-05',
    reviewer: '54页三项完整活动与全部候选及组名得分来源核对',
    notes: '来源核对不冒最终教师试用；原条件与换数换方向复习分开。',
  },
  steps: [
    {
      title: '跑步86是参照，两项要求分别读',
      text: '原三个候选88、12、76人。跳远比跑步少得多，本题选12并画圈；跳绳比跑步少一些，选76并画勾。88大于86，两个少于86的条件都不符合。缩略人物不是全部86人，不能用画中件数替换标签。',
      activity: '实际在原表或自写候选表用圈、勾分别标两项，读清参照对象。',
    },
    {
      title: '反向说关系，不固定一个阈值',
      text: '跳远12比跑步86少得多，反向跑步比跳远多得多；跳绳76比86少一些，反向跑步比跳绳多一些。这些词结合本题对象和三个候选，不规定所有情境差多少都算某词。88符合两项少于86的数量为0，是确定项数而不是未知。',
      activity: '真实说完两个项目和四个比较方向，说明88为什么不能选。',
    },
    {
      title: '年龄题：差不多不是相等',
      text: '原爸爸37岁，另一位年龄差不多，在39、50、28中选39。39与37较接近但不相等；不能推出所有爸爸39岁或差2永远算差不多。这是题目判断，没有调查自己家庭，不需要披露真实年龄。',
      activity: '实际标39并说参照37和候选比较理由，区别接近与相等。',
    },
    {
      title: '全部四卡按得分从高到低',
      text: '原卡淘气组95、笑笑组88、妙想组91、奇思组79。先找95最高，再从剩下三张找91、88、79，完整顺序淘气、妙想、笑笑、奇思，95>91>88>79。每卡一次，组名与分数一起移动；原第二张笑笑不是第二高，不照搬前页从小到大。',
      activity: '实际摆齐四张组名分数卡，分别检查三个大于关系并解释方法。',
    },
    {
      title: '回看实际过程，再写发现与计划',
      text: '核对原三项是否全做：两项人数圈勾与方向说明、年龄候选比较、完整四组高低排序。网站填数不自动确认画标、摆卡或口述；自己的方法、发现和困难如实写，未来准备另列，未知不补0。',
      activity: '回看实际完成与未做项目，写自己的说明和独立的下一次计划。',
    },
  ],
  questions: [
    {
      id: 'bnu-lower-comparison-practice-run-reference',
      knowledge: 'bnu-lower-comparison-practice',
      prompt: '原题说跑步有86人。两个项目比较时，作为参照的跑步人数是多少？',
      rule: {
        kind: 'number',
        value: 86,
      },
      hint: '先读参照对象、候选与要求方向；比较后逐项检查，真实纸面标记和摆卡另做。',
      explanation: '题中已给跑步86人，不从缩略图的人物件数推人数。',
    },
    {
      id: 'bnu-lower-comparison-practice-sports-candidates',
      knowledge: 'bnu-lower-comparison-practice',
      prompt: '原表从左到右是88人、12人、76人。按原表顺序填写三个候选人数。',
      rule: {
        kind: 'steps',
        values: [88, 12, 76],
      },
      hint: '先读参照对象、候选与要求方向；比较后逐项检查，真实纸面标记和摆卡另做。',
      explanation: '原三个候选为88、12、76。候选不是三个项目已确定的真实人数。',
    },
    {
      id: 'bnu-lower-comparison-practice-long-jump',
      knowledge: 'bnu-lower-comparison-practice',
      prompt: '跑步86人。候选88、12、76中，跳远比跑步少得多，选哪个？',
      rule: {
        kind: 'number',
        value: 12,
      },
      hint: '先读参照对象、候选与要求方向；比较后逐项检查，真实纸面标记和摆卡另做。',
      explanation: '本题12远少于86。88大于86，76是少一些的候选。',
    },
    {
      id: 'bnu-lower-comparison-practice-skipping',
      knowledge: 'bnu-lower-comparison-practice',
      prompt: '同题跳绳比跑步少一些，在88、12、76中选哪个？',
      rule: {
        kind: 'number',
        value: 76,
      },
      hint: '先读参照对象、候选与要求方向；比较后逐项检查，真实纸面标记和摆卡另做。',
      explanation: '76比86少且比较接近；只依据当前候选与条件，不制定通用阈值。',
    },
    {
      id: 'bnu-lower-comparison-practice-not-less',
      knowledge: 'bnu-lower-comparison-practice',
      prompt: '三个候选中，哪个人数比86多，不能满足少于跑步？',
      rule: {
        kind: 'number',
        value: 88,
      },
      hint: '先读参照对象、候选与要求方向；比较后逐项检查，真实纸面标记和摆卡另做。',
      explanation: '88>86，方向不符合少；两项少于86的条件都不满足。',
    },
    {
      id: 'bnu-lower-comparison-practice-reverse',
      knowledge: 'bnu-lower-comparison-practice',
      prompt: '跳远选12、跑步86。反向说跑步比跳远怎样？',
      rule: {
        kind: 'choice',
        value: '多得多',
      },
      hint: '先读参照对象、候选与要求方向；比较后逐项检查，真实纸面标记和摆卡另做。',
      explanation: '交换参照对象后，少得多反向为多得多；仍限定这组数量情境。',
      choices: [
        {
          id: '多得多',
          label: '多得多',
        },
        {
          id: '少得多',
          label: '少得多',
        },
        {
          id: '多一些',
          label: '多一些',
        },
      ],
    },
    {
      id: 'bnu-lower-comparison-practice-zero-compatible',
      knowledge: 'bnu-lower-comparison-practice',
      prompt: '原题两个项目都要求比跑步86人少。候选88能符合其中几项？',
      rule: {
        kind: 'number',
        value: 0,
      },
      hint: '先读参照对象、候选与要求方向；比较后逐项检查，真实纸面标记和摆卡另做。',
      explanation:
        '88大于86，两个少于86的条件都不符合，符合项数是0；这里0为已确定数量，不是未填。',
    },
    {
      id: 'bnu-lower-comparison-practice-threshold',
      knowledge: 'bnu-lower-comparison-practice',
      prompt: '能把这道题的少一些、少得多直接规定成所有情境通用的固定差数吗？',
      rule: {
        kind: 'choice',
        value: '不能，要结合对象和本题候选',
      },
      hint: '先读参照对象、候选与要求方向；比较后逐项检查，真实纸面标记和摆卡另做。',
      explanation: '定性词在给定情境比较，不以一题补普遍阈值。',
      choices: [
        {
          id: '不能，要结合对象和本题候选',
          label: '不能，要结合对象和本题候选',
        },
        {
          id: '能，不用看参照对象',
          label: '能，不用看参照对象',
        },
        {
          id: '能，所有情境固定一个差数',
          label: '能，所有情境固定一个差数',
        },
      ],
    },
    {
      id: 'bnu-lower-comparison-practice-actual-sports-mark',
      knowledge: 'bnu-lower-comparison-practice',
      prompt: '实际回原表，给跳远12画圈、给跳绳76画勾，并分别指明与86的关系。',
      rule: {
        kind: 'manual',
      },
      hint: '先读参照对象、候选与要求方向；比较后逐项检查，真实纸面标记和摆卡另做。',
      explanation:
        '须两种标记和两个条件都实际完成。网页填两个数字不自动确认原表操作；没有原表可在纸上写三个候选并标记。',
    },
    {
      id: 'bnu-lower-comparison-practice-actual-sports-language',
      knowledge: 'bnu-lower-comparison-practice',
      prompt:
        '实际说跳远比跑步少得多、跳绳比跑步少一些，再反向说跑步与这两项的关系。',
      rule: {
        kind: 'manual',
      },
      hint: '先读参照对象、候选与要求方向；比较后逐项检查，真实纸面标记和摆卡另做。',
      explanation:
        '四个方向都说清参照对象。原表情境不是自家班级统计，不要求采集个人信息。',
    },
    {
      id: 'bnu-lower-comparison-practice-age-reference',
      knowledge: 'bnu-lower-comparison-practice',
      prompt:
        '原题说笑笑爸爸今年37岁。比较另一位爸爸年龄时，已给的参照年龄是多少岁？',
      rule: {
        kind: 'number',
        value: 37,
      },
      hint: '先读参照对象、候选与要求方向；比较后逐项检查，真实纸面标记和摆卡另做。',
      explanation: '笑笑爸爸37岁是原题条件，不采集自家爸爸年龄。',
    },
    {
      id: 'bnu-lower-comparison-practice-age-candidate',
      knowledge: 'bnu-lower-comparison-practice',
      prompt: '参照37岁，另一位爸爸年龄差不多，候选39、50、28中选哪个？',
      rule: {
        kind: 'number',
        value: 39,
      },
      hint: '先读参照对象、候选与要求方向；比较后逐项检查，真实纸面标记和摆卡另做。',
      explanation: '本题39与37较接近；50、28离37更远，结合候选作判断。',
    },
    {
      id: 'bnu-lower-comparison-practice-close-not-equal',
      knowledge: 'bnu-lower-comparison-practice',
      prompt: '选择39与37差不多，说明这两个年龄相等吗？',
      rule: {
        kind: 'choice',
        value: '不相等，差不多只表示比较接近',
      },
      hint: '先读参照对象、候选与要求方向；比较后逐项检查，真实纸面标记和摆卡另做。',
      explanation: '37与39是两个不同的数，不把定性接近改成严格等于。',
      choices: [
        {
          id: '相等，都是差不多',
          label: '相等，都是差不多',
        },
        {
          id: '不相等，差不多只表示比较接近',
          label: '不相等，差不多只表示比较接近',
        },
        {
          id: '完全没有比较依据',
          label: '完全没有比较依据',
        },
      ],
    },
    {
      id: 'bnu-lower-comparison-practice-age-real',
      knowledge: 'bnu-lower-comparison-practice',
      prompt: '选出39后，能说已经调查确认了自己家爸爸的实际年龄吗？',
      rule: {
        kind: 'choice',
        value: '不能，这是题目候选判断',
      },
      hint: '先读参照对象、候选与要求方向；比较后逐项检查，真实纸面标记和摆卡另做。',
      explanation: '原人物、候选与真实家庭资料分开，不补造真实调查或要求披露。',
      choices: [
        {
          id: '不能，这是题目候选判断',
          label: '不能，这是题目候选判断',
        },
        {
          id: '能，所有爸爸都是39岁',
          label: '能，所有爸爸都是39岁',
        },
        {
          id: '能，网站自动调查了家庭',
          label: '能，网站自动调查了家庭',
        },
      ],
    },
    {
      id: 'bnu-lower-comparison-practice-actual-age',
      knowledge: 'bnu-lower-comparison-practice',
      prompt: '实际在39、50、28中标39，解释参照37以及差不多与相等的区别。',
      rule: {
        kind: 'manual',
      },
      hint: '先读参照对象、候选与要求方向；比较后逐项检查，真实纸面标记和摆卡另做。',
      explanation:
        '在原题或自写纸卡实际完成并说理由；不用家庭真实年龄，不以网页得分代替口述。',
    },
    {
      id: 'bnu-lower-comparison-practice-score-original',
      knowledge: 'bnu-lower-comparison-practice',
      prompt:
        '原卡淘气组95、笑笑组88、妙想组91、奇思组79。按原卡顺序填写各组得分。',
      rule: {
        kind: 'steps',
        values: [95, 88, 91, 79],
      },
      hint: '先读参照对象、候选与要求方向；比较后逐项检查，真实纸面标记和摆卡另做。',
      explanation: '原对应淘气95、笑笑88、妙想91、奇思79，组名与分数一一对应。',
    },
    {
      id: 'bnu-lower-comparison-practice-sorted-scores',
      knowledge: 'bnu-lower-comparison-practice',
      prompt:
        '原四组淘气95、笑笑88、妙想91、奇思79。按从高到低填写全部四组得分。',
      rule: {
        kind: 'steps',
        values: [95, 91, 88, 79],
      },
      hint: '先读参照对象、候选与要求方向；比较后逐项检查，真实纸面标记和摆卡另做。',
      explanation:
        '四个得分逐个比较，95>91>88>79；不能照搬前页从小到大，也不能漏卡。',
    },
    {
      id: 'bnu-lower-comparison-practice-top-group',
      knowledge: 'bnu-lower-comparison-practice',
      prompt: '原四组淘气95、笑笑88、妙想91、奇思79。最高分是哪组？',
      rule: {
        kind: 'choice',
        value: '淘气组',
      },
      hint: '先读参照对象、候选与要求方向；比较后逐项检查，真实纸面标记和摆卡另做。',
      explanation: '淘气组95分最高，不把原第二张88误作第二高。',
      choices: [
        {
          id: '淘气组',
          label: '淘气组',
        },
        {
          id: '妙想组',
          label: '妙想组',
        },
        {
          id: '奇思组',
          label: '奇思组',
        },
        {
          id: '笑笑组',
          label: '笑笑组',
        },
      ],
    },
    {
      id: 'bnu-lower-comparison-practice-second-group',
      knowledge: 'bnu-lower-comparison-practice',
      prompt:
        '原四组淘气95、笑笑88、妙想91、奇思79。按得分从高到低，第二名是哪组？',
      rule: {
        kind: 'choice',
        value: '妙想组',
      },
      hint: '先读参照对象、候选与要求方向；比较后逐项检查，真实纸面标记和摆卡另做。',
      explanation: '妙想91分，低于95且高于88、79，所以第二。',
      choices: [
        {
          id: '妙想组',
          label: '妙想组',
        },
        {
          id: '奇思组',
          label: '奇思组',
        },
        {
          id: '淘气组',
          label: '淘气组',
        },
        {
          id: '笑笑组',
          label: '笑笑组',
        },
      ],
    },
    {
      id: 'bnu-lower-comparison-practice-last-group',
      knowledge: 'bnu-lower-comparison-practice',
      prompt:
        '原四组淘气95、笑笑88、妙想91、奇思79。按得分从高到低，最后是哪组？',
      rule: {
        kind: 'choice',
        value: '奇思组',
      },
      hint: '先读参照对象、候选与要求方向；比较后逐项检查，真实纸面标记和摆卡另做。',
      explanation: '奇思79分为四组最低，最后不是原卡位置本身决定。',
      choices: [
        {
          id: '淘气组',
          label: '淘气组',
        },
        {
          id: '笑笑组',
          label: '笑笑组',
        },
        {
          id: '奇思组',
          label: '奇思组',
        },
        {
          id: '妙想组',
          label: '妙想组',
        },
      ],
    },
    {
      id: 'bnu-lower-comparison-practice-comparison-sign',
      knowledge: 'bnu-lower-comparison-practice',
      prompt: '从高到低填95、91、88、79，三个相邻位置之间应使用哪个符号？',
      rule: {
        kind: 'choice',
        value: '>',
      },
      hint: '先读参照对象、候选与要求方向；比较后逐项检查，真实纸面标记和摆卡另做。',
      explanation:
        '每个左边都比右边大，三个关系均为大于号，逐个读不能只看首尾。',
      choices: [
        {
          id: '>',
          label: '>',
        },
        {
          id: '=',
          label: '=',
        },
        {
          id: '<',
          label: '<',
        },
      ],
    },
    {
      id: 'bnu-lower-comparison-practice-actual-score-cards',
      knowledge: 'bnu-lower-comparison-practice',
      prompt:
        '实际写或使用全部四张组名得分卡，按得分从高到低摆齐，逐张检查组名与分数。',
      rule: {
        kind: 'manual',
      },
      hint: '先读参照对象、候选与要求方向；比较后逐项检查，真实纸面标记和摆卡另做。',
      explanation:
        '每张卡各一次，95淘气、91妙想、88笑笑、79奇思。纸卡可复用，不需买材料；网页顺序不是实际摆卡。',
    },
    {
      id: 'bnu-lower-comparison-practice-actual-score-explain',
      knowledge: 'bnu-lower-comparison-practice',
      prompt: '实际说明怎样找最高分、从剩下三张继续比较，并完整读95>91>88>79。',
      rule: {
        kind: 'manual',
      },
      hint: '先读参照对象、候选与要求方向；比较后逐项检查，真实纸面标记和摆卡另做。',
      explanation:
        '四卡都排完，三个相邻关系都读，说明原卡位置与分数高低不同；不冒真实班级比赛。',
    },
    {
      id: 'bnu-lower-comparison-practice-own-method',
      knowledge: 'bnu-lower-comparison-practice',
      prompt: '记录自己实际用哪种比较或排序方法。',
      rule: {
        kind: 'reflection',
      },
      hint: '先读参照对象、候选与要求方向；比较后逐项检查，真实纸面标记和摆卡另做。',
      explanation:
        '自己的真实方法开放记录，不统一打对错；若未做可如实写尚未做。',
    },
    {
      id: 'bnu-lower-comparison-practice-discovery',
      knowledge: 'bnu-lower-comparison-practice',
      prompt: '记录自己对参照方向或得分排序的一个真实发现。',
      rule: {
        kind: 'reflection',
      },
      hint: '先读参照对象、候选与要求方向；比较后逐项检查，真实纸面标记和摆卡另做。',
      explanation: '发现不冒同伴也同意，网页正确率不代替实际表达。',
    },
    {
      id: 'bnu-lower-comparison-practice-difficulty',
      knowledge: 'bnu-lower-comparison-practice',
      prompt: '记录还不清楚的条件或步骤。',
      rule: {
        kind: 'reflection',
      },
      hint: '先读参照对象、候选与要求方向；比较后逐项检查，真实纸面标记和摆卡另做。',
      explanation:
        '未知不当0，困难不自动判品德或掌握；与实际任务的完成状态分开。',
    },
    {
      id: 'bnu-lower-comparison-practice-plan',
      knowledge: 'bnu-lower-comparison-practice',
      prompt: '单独写下一次准备怎样练习比较或排序。',
      rule: {
        kind: 'reflection',
      },
      hint: '先读参照对象、候选与要求方向；比较后逐项检查，真实纸面标记和摆卡另做。',
      explanation: '未来计划不算已经做过，不自动确认真实交流或纸卡活动。',
    },
  ],
  reviewQuestions: [
    {
      id: 'bnu-lower-comparison-practice-review-sports',
      knowledge: 'bnu-lower-comparison-practice',
      prompt:
        '新情境跑步72人。候选80、10、65，跳远少得多、跳绳少一些，依次填两项候选。',
      rule: {
        kind: 'steps',
        values: [10, 65],
      },
      hint: '先读参照对象、候选与要求方向；比较后逐项检查，真实纸面标记和摆卡另做。',
      explanation:
        '重新以72为参照，本题10少得多、65少一些，80不满足少；不能用原12和76。',
    },
    {
      id: 'bnu-lower-comparison-practice-review-age',
      knowledge: 'bnu-lower-comparison-practice',
      prompt: '新题参照44岁，候选30、46、62。另一位年龄差不多，选哪个？',
      rule: {
        kind: 'number',
        value: 46,
      },
      hint: '先读参照对象、候选与要求方向；比较后逐项检查，真实纸面标记和摆卡另做。',
      explanation: '在新候选中46与44较接近，不沿用原39或假称实际家庭年龄。',
    },
    {
      id: 'bnu-lower-comparison-practice-review-descending',
      knowledge: 'bnu-lower-comparison-practice',
      prompt: '新四卡甲84、乙98、丙87、丁73，按得分从高到低填写。',
      rule: {
        kind: 'steps',
        values: [98, 87, 84, 73],
      },
      hint: '先读参照对象、候选与要求方向；比较后逐项检查，真实纸面标记和摆卡另做。',
      explanation: '新数量重新比较，98>87>84>73，不用原四个数。',
    },
    {
      id: 'bnu-lower-comparison-practice-review-second',
      knowledge: 'bnu-lower-comparison-practice',
      prompt: '同新四组甲84、乙98、丙87、丁73，第二高是哪组？',
      rule: {
        kind: 'choice',
        value: '丙',
      },
      hint: '先读参照对象、候选与要求方向；比较后逐项检查，真实纸面标记和摆卡另做。',
      explanation: '乙98第一、丙87第二、甲84第三、丁73第四，组名须随得分移动。',
      choices: [
        {
          id: '丁',
          label: '丁',
        },
        {
          id: '甲',
          label: '甲',
        },
        {
          id: '乙',
          label: '乙',
        },
        {
          id: '丙',
          label: '丙',
        },
      ],
    },
    {
      id: 'bnu-lower-comparison-practice-review-ascending',
      knowledge: 'bnu-lower-comparison-practice',
      prompt: '仍用新四个数84、98、87、73，这次明确改为从低到高，填全部四个。',
      rule: {
        kind: 'steps',
        values: [73, 84, 87, 98],
      },
      hint: '先读参照对象、候选与要求方向；比较后逐项检查，真实纸面标记和摆卡另做。',
      explanation: '改变要求就重新排序，73<84<87<98；不能沿用刚才从高到低。',
    },
  ],
};

/** Inspected pages are evidence of scope, not proof that every activity is implemented. */
export const sujiaoCalculationUnitAudit = {
  isbn: '978-7-5743-1295-1',
  checkedAt: '2026-10-02',
  unit: 'u5',
  status: 'original-teaching-implemented',
  finalTeacherReview: 'not-verified',
  pages: [
    {
      page: 57,
      scope: '生活情境引入两位数加减',
      evidence: [['sj-lower-two-digit-tens', ['join', 'leave']]],
      boundary: '使用原创贴纸情境，不从教材封面画面补造隐藏数量。',
    },
    {
      page: 58,
      scope: '加整十数、按十合并与保留个位、摆拨和拆数',
      evidence: [
        [
          'sj-lower-two-digit-tens',
          ['add', 'unit', 'first-add', 'manual-0', 'manual-1'],
        ],
      ],
      boundary: '每捆十根，计数器十位每珠表示十，不按珠子总颗数报数。',
    },
    {
      page: 59,
      scope: '减整十数、与加法比较、交换加数和求另一部分',
      evidence: [
        [
          'sj-lower-two-digit-tens',
          [
            'subtract',
            'first-subtract',
            'unchanged',
            'reverse',
            'missing-part',
            'manual-2',
          ],
        ],
      ],
      boundary: '中间结果合回个位；加数交换不推广为减法交换。',
    },
    {
      page: 60,
      scope: '不进位加一位数、同单位合并个位、摆拨',
      evidence: [
        [
          'sj-lower-two-digit-ones',
          ['add', 'unit', 'first-add', 'manual-0', 'manual-1'],
        ],
      ],
      boundary: '个位不足十的条件不可省略，不概括所有加法十位不变。',
    },
    {
      page: 61,
      scope: '不退位减一位数、保留整十、个位减完为零与实际应用',
      evidence: [
        [
          'sj-lower-two-digit-ones',
          ['subtract', 'first-subtract', 'zero', 'join', 'leave', 'manual-2'],
        ],
      ],
      boundary: '个位够减才可直接取散根，未知不能默认零。',
    },
    {
      page: 62,
      scope: '整十与一位比较、判断得数几十多、不计算比较大小',
      evidence: [
        [
          'sj-lower-calculation-links',
          ['subtract-compare', 'add-compare', 'add-order'],
        ],
        [
          'sj-lower-calculation-review',
          [
            'estimate-add',
            'estimate-tens',
            'estimate-subtract',
            'compare-add',
            'compare-subtract',
            'compare-exchange',
            'manual-0',
            'manual-1',
          ],
        ],
      ],
      boundary:
        '先判断与后核对分栏，独立不计算比较的实际口述人工确认，不由选择题替代。',
    },
    {
      page: 63,
      scope: '合并与部分、自己提问、补条件、相差和十字等和',
      evidence: [
        ['sj-lower-two-digit-tens', ['join', 'missing-part']],
        [
          'sj-lower-practical-problems',
          ['condition', 'unknown', 'manual-2', 'own-question'],
        ],
        ['sj-lower-calculation-review', ['complete-question', 'manual-2']],
        [
          'sj-lower-cross-balance',
          ['placement', 'sums', 'duplicates', 'manual-0', 'manual-1'],
        ],
      ],
      boundary:
        '补的条件注明来自自己；十字每数一次、横竖等和允许多解，自主提问反思与实际解答交流manual分开。',
    },
    {
      page: 64,
      scope: '进位加法、先凑十与合个位两种方法、实际换组',
      evidence: [
        [
          'sj-lower-carry-add',
          [
            'result',
            'loose',
            'bridge',
            'rest',
            'exchange',
            'manual-0',
            'manual-1',
          ],
        ],
      ],
      boundary: '十个一换一个十不再增加总量，原有的十必须合回。',
    },
    {
      page: 65,
      scope: '不满十、恰满十和超过十对比、关联口算与连续加',
      evidence: [
        ['sj-lower-carry-add', ['conditions', 'edge', 'application']],
        [
          'sj-lower-calculation-links',
          ['add-0', 'add-1', 'add-2', 'add-chain', 'manual-1'],
        ],
      ],
      boundary: '恰好十也进位；连算每次用上次结果，不背同一个起点。',
    },
    {
      page: 66,
      scope: '退位减法、拆十与先减到整十两种方法',
      evidence: [
        [
          'sj-lower-borrow-subtract',
          [
            'result',
            'loose',
            'bridge',
            'rest',
            'exchange',
            'manual-0',
            'manual-1',
          ],
        ],
      ],
      boundary: '先拆十尚未取走，十位少一，拆组本身不减少数量。',
    },
    {
      page: 67,
      scope: '够减、不够减、原数个位零、关联减法与连续减',
      evidence: [
        ['sj-lower-borrow-subtract', ['conditions', 'edge', 'application']],
        [
          'sj-lower-calculation-links',
          [
            'subtract-0',
            'subtract-1',
            'subtract-2',
            'subtract-chain',
            'manual-1',
          ],
        ],
      ],
      boundary: '个位恰好够减不拆十，个位零需要拆十；连减核对每次新起点。',
    },
    {
      page: 68,
      scope: '画圈理解进退位、对比是否换组和综合口算',
      evidence: [
        ['sj-lower-carry-add', ['conditions', 'manual-0']],
        ['sj-lower-borrow-subtract', ['conditions', 'manual-0']],
        ['sj-lower-calculation-links', ['add-0', 'subtract-0', 'manual-0']],
      ],
      boundary:
        '原创小棒模型与实际换组，不复制原画；已覆盖方法不等于逐题复制。',
    },
    {
      page: 69,
      scope: '比较、实际合并剩余、三行库存与混合连算',
      evidence: [
        [
          'sj-lower-practical-problems',
          ['join', 'remaining', 'table', 'row', 'meaning', 'manual-0'],
        ],
        ['sj-lower-calculation-links', ['mixed', 'mixed-two', 'manual-2']],
      ],
      boundary:
        '库存同一行配原有和卖出、逐行保留单位，空白不当零；混合方向逐步检查。',
    },
    {
      page: 70,
      scope: '容量、选条件提问、同样多、图形数字、三项评价和两位数减两位数探索',
      evidence: [
        [
          'sj-lower-practical-problems',
          ['capacity', 'shortage', 'equalize', 'questions', 'own-question'],
        ],
        [
          'sj-lower-symbol-digits',
          ['pair', 'same-symbol', 'place-value', 'multiple', 'manual-1'],
        ],
        [
          'sj-lower-calculation-review',
          [
            'complete-question',
            'split-subtrahend',
            'exploration-steps',
            'middle-not-final',
            'total-removed',
            'check-exploration',
            'manual-2',
            'manual-3',
            'manual-4',
            'evaluation-representation',
            'evaluation-calculation',
            'evaluation-application',
          ],
        ],
      ],
      boundary:
        '容量先求合计，数字占位符按数位代回；三项评价各自null，教材51减15改用原创62减17分两次减探索，不扩展为完整竖式单元。',
    },
  ],
  gaps: [],
  resolvedGaps: [
    {
      id: 'estimate-tens',
      evidence: [
        'estimate-add',
        'estimate-tens',
        'estimate-subtract',
        'manual-0',
      ],
      pages: [62],
      requirement: '先判断得数几十多，再计算核对；与直接计算数字分开。',
    },
    {
      id: 'compare-without-calculating',
      evidence: [
        'compare-add',
        'compare-subtract',
        'compare-exchange',
        'manual-1',
      ],
      pages: [62],
      requirement:
        '实际不逐个计算，按同起点加减量或交换加数说明大小关系，独立人工记录。',
    },
    {
      id: 'own-question-activity',
      evidence: ['complete-question', 'manual-2'],
      pages: [63, 70],
      requirement:
        '实际提出不同可回答问题、标条件、解答并交流；现有反思保存不能替代完成实际活动。',
    },
    {
      id: 'independent-evaluations',
      evidence: [
        'evaluation-representation',
        'evaluation-calculation',
        'evaluation-application',
      ],
      pages: [70],
      requirement:
        '摆拨理解、两位数加减技能、实际应用三项分别自评，正确状态为null，不由成绩自动产生。',
    },
    {
      id: 'subtract-two-digit-exploration',
      evidence: [
        'split-subtrahend',
        'exploration-steps',
        'manual-3',
        'manual-4',
      ],
      pages: [70],
      requirement:
        '探索51减15或原创同类题，先减整十再减一位并核对；限定探索，不假称全两位数竖式单元。',
    },
  ],
} as const;

/** Actual reading of printed pages 11–31; skill overlap does not close activity gaps. */
export const sujiaoUpperFirstUnitAudit = {
  isbn: '978-7-5743-1099-5',
  checkedAt: '2026-10-02',
  unit: 'u1',
  status: 'original-teaching-implemented',
  finalTeacherReview: 'not-verified',
  source: 'https://keben.app/book/0103',
  pages: [
    {
      page: 11,
      scope: '0～5单元导入',
      evidence: [],
      boundary: '导入情境不计作独立练习。',
    },
    {
      page: 12,
      scope: '1～3数量对应与生活举例',
      evidence: [
        [
          'sj-upper-recognize-1-3',
          ['one-to-one', 'quantity-digit', 'life-quantity'],
        ],
      ],
      boundary: '原创物品点数，不复制原图。',
    },
    {
      page: 13,
      scope: '拨珠、画圈写数、分类点数与实际书写',
      evidence: [
        ['sj-upper-recognize-1-3', ['actual-count', 'paper-writing']],
        ['sj-upper-colour-count', ['actual-beads', 'actual-subsets']],
      ],
      boundary:
        '画圈写数、实际拨珠与嵌套分类各自人工确认，不自动由网页点数完成。',
    },
    {
      page: 14,
      scope: '4～5数量对应',
      evidence: [
        ['sj-upper-recognize-4-5', ['count', 'quantity-digit', 'paper']],
      ],
      boundary: '数量与实际写数分别记录。',
    },
    {
      page: 15,
      scope: '拨珠、闭合小棒、按1～5涂格与多目标补图',
      evidence: [
        ['sj-upper-fill-arithmetic', ['sticks']],
        ['sj-upper-recognize-4-5', ['physical', 'paper']],
        [
          'sj-upper-colour-count',
          ['actual-beads', 'actual-columns', 'actual-completion'],
        ],
      ],
      boundary: '小棒轮廓、五列按数涂格与不同目标的三瓶补图均独立实际确认。',
    },
    {
      page: 16,
      scope: '几与第几、前后人数、楼层及攀爬方向',
      evidence: [
        [
          'sj-upper-cardinal-ordinal',
          [
            'quantity',
            'rank',
            'before-count',
            'after-count',
            'physical-meaning',
          ],
        ],
        [
          'sj-upper-direction-comparison',
          ['floor-rank', 'floor-neighbours', 'actual-floors'],
        ],
      ],
      boundary: '楼层从底层向上与当前运动方向各自核对，不用水平左右固定替代。',
    },
    {
      page: 17,
      scope: '泳道、上下坡、前人离开及实际选卡游戏',
      evidence: [
        [
          'sj-upper-cardinal-ordinal',
          ['changed-position', 'physical-direction', 'physical-meaning'],
        ],
        [
          'sj-upper-direction-comparison',
          [
            'moving-front',
            'reverse-motion',
            'departing-front',
            'actual-directions',
            'actual-partner-game',
          ],
        ],
      ],
      boundary:
        '上坡下坡与模拟泳道的方向分别判断，实际同伴至少四轮选卡另确认。',
    },
    {
      page: 18,
      scope: '无物表示0、递减到0与写0',
      evidence: [
        ['sj-upper-recognize-zero', ['empty-quantity', 'all-gone', 'paper']],
      ],
      boundary: '数值0与未填输入分清。',
    },
    {
      page: 19,
      scope: '尺上0、0～5数序、逐行涂色与未涂数、生活0',
      evidence: [
        ['sj-upper-recognize-zero', ['zero-first', 'before-one', 'life']],
        [
          'sj-upper-colour-count',
          ['full-colour-record', 'actual-rows', 'zero-is-a-number'],
        ],
      ],
      boundary:
        '五行各5圆实际涂色并填满十个记录，未涂0与空白分清；尺上起点不解释成没有尺。',
    },
    {
      page: 20,
      scope: '一一配对与等号',
      evidence: [
        ['sj-upper-quantity-comparison', ['symbol-0', 'physical-pair']],
      ],
      boundary: '实际配对独立人工确认。',
    },
    {
      page: 21,
      scope: '多少比较、反向关系与写比较符号',
      evidence: [
        [
          'sj-upper-quantity-comparison',
          ['symbol-1', 'symbol-2', 'reverse-relation', 'physical-spacing'],
        ],
      ],
      boundary: '数量比较、读式、纸笔符号分别核对。',
    },
    {
      page: 22,
      scope: '算盘比较、分类数量、数卡次序、整条折线路径',
      evidence: [
        [
          'sj-upper-recognition-review',
          [
            'card-count',
            'card-position',
            'card-content',
            'descending',
            'physical-path',
          ],
        ],
        [
          'sj-upper-colour-count',
          [
            'bead-comparison',
            'whole-and-subsets',
            'no-double-count',
            'actual-beads',
            'actual-subsets',
          ],
        ],
      ],
      boundary:
        '整条路径已有，计数架每颗1的拨珠和嵌套分类另人工确认，不套传统算盘上珠5规则。',
    },
    {
      page: 23,
      scope: '生活数量、三图补齐、数量守恒、全体较小数与开放比较',
      evidence: [
        [
          'sj-upper-recognition-review',
          [
            'life-expression',
            'complete-five',
            'minimum',
            'maximum',
            'physical-pair',
          ],
        ],
        [
          'sj-upper-colour-count',
          [
            'multiple-targets',
            'already-complete',
            'colour-keeps-total',
            'actual-completion',
          ],
        ],
        [
          'sj-upper-direction-comparison',
          [
            'all-smaller-with-zero',
            'all-greater-bounded',
            'multiple-open-comparison',
            'actual-open-comparison',
          ],
        ],
      ],
      boundary:
        '三圈各5三角形实际分别补齐；含0完整范围选全，纸面写多种合法比较式另人工确认。',
    },
    {
      page: 24,
      scope: '车队位置、生活比较与活动顺序',
      evidence: [
        [
          'sj-upper-cardinal-ordinal',
          ['identify-position', 'quantity-versus-position'],
        ],
        ['sj-upper-recognition-review', ['life-procedure']],
        ['sj-upper-direction-comparison', ['actual-directions']],
      ],
      boundary: '队首必须按明确方向判断，生活活动须实际进行。',
    },
    {
      page: 25,
      scope: '合并、接着数、加法术语及自编故事',
      evidence: [
        [
          'sj-upper-first-add',
          ['meaning', 'counting-path', 'terms', 'physical', 'oral-paper'],
        ],
      ],
      boundary: '实物和自编故事已有，不搬原情境。',
    },
    {
      page: 26,
      scope: '自主画两群、数线填空与加法变化',
      evidence: [
        [
          'sj-upper-fill-arithmetic',
          ['draw', 'add-first', 'add-second', 'add-total'],
        ],
        ['sj-upper-unit-one-review', ['addition-pattern']],
      ],
      boundary: '实际画图与屏幕填数区分。',
    },
    {
      page: 27,
      scope: '取走、倒数、减法术语及故事',
      evidence: [
        [
          'sj-upper-first-subtract',
          ['meaning', 'counting-path', 'terms', 'physical', 'oral-paper'],
        ],
      ],
      boundary: '取走量与剩余量分清。',
    },
    {
      page: 28,
      scope: '自主画划、数线与减法变化',
      evidence: [
        [
          'sj-upper-fill-arithmetic',
          [
            'draw',
            'subtract-original',
            'subtract-removed',
            'subtract-remaining',
          ],
        ],
        ['sj-upper-unit-one-review', ['subtraction-pattern']],
      ],
      boundary: '实际划去已有，不能仅靠填空表示操作已做。',
    },
    {
      page: 29,
      scope: '看图加减与0参与运算',
      evidence: [
        [
          'sj-upper-zero-arithmetic',
          [
            'calculate-0',
            'calculate-1',
            'calculate-2',
            'calculate-3',
            'physical',
            'paper-story',
          ],
        ],
      ],
      boundary: '各次恢复原量；取走0与全部取走不同。',
    },
    {
      page: 30,
      scope: '同得数分类、完整正数加法卡表与和为5所有写法',
      evidence: [
        [
          'sj-upper-unit-one-review',
          ['same-sum', 'same-addend', 'multiple-pairs', 'physical-sort'],
        ],
        [
          'sj-upper-card-review',
          [
            'all-add-cards',
            'add-result-groups',
            'all-positive-pairs',
            'actual-add-table',
            'actual-positive-pairs',
          ],
        ],
      ],
      boundary:
        '完整十加卡实际制作、分类及行列整理独立确认，和为5四种有序写法不漏；带0的正确计算仅不属本次正数卡范围。',
    },
    {
      page: 31,
      scope: '完整正数减法卡表、同图多算式、三方面自评及领奖名次',
      evidence: [
        [
          'sj-upper-unit-one-review',
          [
            'same-difference',
            'physical-sort',
            'reflection-text-0',
            'reflection-text-1',
          ],
        ],
        [
          'sj-upper-card-review',
          [
            'all-subtract-cards',
            'subtract-result-groups',
            'one-picture-four-equations',
            'actual-subtract-table',
            'actual-own-picture',
            'actual-evaluation-evidence',
            'evaluation-recognition',
            'evaluation-calculation-story',
            'evaluation-expression-question',
            'podium-rank',
          ],
        ],
      ],
      boundary:
        '完整十减卡、自画图自主提问两加两减、实际读写计算表达及三项独立自评分别记录；自评null，不用综合反思或网页成绩替代；领奖数字表示名次，奖牌只按明确模拟规则，不虚称所有比赛统一奖励。',
    },
  ],
  resolvedGaps: [
    {
      id: 'beads-and-subsets',
      pages: [13, 15, 22],
      activity: '实际拨珠与整体/子类分别点数',
      evidence: [['sj-upper-colour-count', ['actual-beads', 'actual-subsets']]],
    },
    {
      id: 'colour-and-complete',
      pages: [15, 19, 23],
      activity: '五列涂格、五行涂与未涂十项记录及六幅实际补图',
      evidence: [
        [
          'sj-upper-colour-count',
          [
            'full-colour-record',
            'multiple-targets',
            'actual-columns',
            'actual-rows',
            'actual-completion',
          ],
        ],
      ],
    },
    {
      id: 'ordinal-contexts',
      pages: [16, 17, 24],
      activity: '实际楼层、上坡下坡与泳道方向、队首离开及同伴选卡',
      evidence: [
        [
          'sj-upper-direction-comparison',
          ['actual-floors', 'actual-directions', 'actual-partner-game'],
        ],
      ],
    },
    {
      id: 'open-comparison',
      pages: [23],
      activity: '含0全范围及实际写全部合法开放比较填法',
      evidence: [
        [
          'sj-upper-direction-comparison',
          [
            'all-smaller-with-zero',
            'all-greater-bounded',
            'multiple-open-comparison',
            'actual-open-comparison',
          ],
        ],
      ],
    },
    {
      id: 'complete-card-tables',
      pages: [30, 31],
      activity:
        '完整十加卡、十减卡真实制作分类全表，和为5四种写法、自画图先提问再四式',
      evidence: [
        [
          'sj-upper-card-review',
          [
            'actual-add-table',
            'actual-subtract-table',
            'actual-positive-pairs',
            'actual-own-picture',
          ],
        ],
      ],
    },
    {
      id: 'independent-evaluation',
      pages: [31],
      activity: '实际读写比较、计算故事、表达提问证据与三项独立反思',
      evidence: [
        [
          'sj-upper-card-review',
          [
            'actual-evaluation-evidence',
            'evaluation-recognition',
            'evaluation-calculation-story',
            'evaluation-expression-question',
          ],
        ],
      ],
    },
  ],
  gaps: [],
} as const;

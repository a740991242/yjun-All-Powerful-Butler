/** Printed pages 35–52 were read from the retained same-edition reader images. */
export const sujiaoUpperSecondUnitAudit = {
  isbn: '978-7-5743-1099-5',
  checkedAt: '2026-10-02',
  unit: 'u2',
  status: 'original-teaching-implemented',
  finalTeacherReview: 'not-verified',
  source: 'https://keben.app/book/0103',
  pages: [
    {
      page: 35,
      scope: '6～9单元导入',
      evidence: [],
      boundary: '标题情境不虚计为单独练习。',
    },
    {
      page: 36,
      scope: '6和7的数量、手势与5后添数',
      evidence: [
        [
          'sj-upper-recognize-6-9',
          [
            'count-6',
            'count-7',
            'digit-6',
            'digit-7',
            'next-5',
            'next-6',
            'paper',
            'life',
          ],
        ],
      ],
      boundary: '数量对应与实际摆写已有，原图不复制。',
    },
    {
      page: 37,
      scope: '8和9、实际拨珠写数与0～9数序',
      evidence: [
        [
          'sj-upper-numberline',
          ['missing-numbers', 'complete-read-order', 'actual-complete-line'],
        ],
        ['sj-upper-part-tables', ['actual-beads']],
        [
          'sj-upper-recognize-6-9',
          [
            'count-8',
            'count-9',
            'digit-8',
            'digit-9',
            'next-7',
            'next-8',
            'number-order',
            'paper',
          ],
        ],
      ],
      boundary: '真实拨珠及纸面完整数序各有实际任务，不用点数字代替。',
    },
    {
      page: 38,
      scope: '数量与第几、前后数量、数线距离、配对比较和写数',
      evidence: [
        [
          'sj-upper-part-tables',
          ['comparison-chain', 'actual-pairs-comparison'],
        ],
        [
          'sj-upper-nine-consolidation',
          [
            'quantity',
            'rank',
            'before-after',
            'number-distance',
            'physical-queue',
          ],
        ],
        [
          'sj-upper-recognize-6-9',
          ['compare-0', 'compare-1', 'compare-2', 'paper'],
        ],
      ],
      boundary:
        '队列对象排除未画入的带队者，距离按等距间隔；实际配对比较另记录。',
    },
    {
      page: 39,
      scope: '双与根、盘与个、盒与块；三图补齐、6或7分两人、完整8和9分解表',
      evidence: [
        ['sj-upper-numberline', ['actual-complete-line']],
        [
          'sj-upper-part-tables',
          [
            'full-table-8',
            'full-table-9',
            'paired-units',
            'three-completions',
            'swap-keeps-total',
            'distribution-need-not-equal',
            'positive-table-boundary',
            'actual-pairs-comparison',
            'actual-three-completions',
            'actual-table-8',
            'actual-table-9',
            'actual-distribution',
          ],
        ],
        [
          'sj-upper-six-nine-review',
          ['groups-0', 'objects-0', 'groups-1', 'objects-1', 'physical'],
        ],
        ['sj-upper-recognize-6-9', ['complete', 'two-parts', 'physical']],
      ],
      boundary:
        '成对双/根、三图补画、两完整分解表与分6/7实际任务分别对应；两份正数仅本表约束。',
    },
    {
      page: 40,
      scope: '合并6、两加法交换、两种接着数',
      evidence: [
        [
          'sj-upper-six-nine-arithmetic',
          ['add-0-0', 'add-0-1', 'count-forward', 'physical', 'method'],
        ],
      ],
      boundary: '原创两群摆物，各实际操作独立确认。',
    },
    {
      page: 41,
      scope: '7～9两加法、实际数线上画跳跃、同图自编故事',
      evidence: [
        ['sj-upper-numberline', ['forward-landings', 'actual-addition-lines']],
        [
          'sj-upper-six-nine-arithmetic',
          [
            'add-1-0',
            'add-1-1',
            'add-2-0',
            'add-2-1',
            'add-3-0',
            'add-3-1',
            'paper',
          ],
        ],
      ],
      boundary: '同组两加法和故事已有；纸面实际跳线独立人工，不由填结果代替。',
    },
    {
      page: 42,
      scope: '同一总数的两减法与倒数',
      evidence: [
        [
          'sj-upper-six-nine-arithmetic',
          [
            'subtract-0-0',
            'subtract-0-1',
            'count-backward',
            'physical',
            'method',
          ],
        ],
      ],
      boundary: '各道减法恢复原总量，不将交换被减数减数当可逆。',
    },
    {
      page: 43,
      scope: '7～9两减法、画数线跳跃与自编减法故事',
      evidence: [
        [
          'sj-upper-numberline',
          ['backward-landings', 'actual-subtraction-lines'],
        ],
        [
          'sj-upper-six-nine-arithmetic',
          [
            'subtract-1-0',
            'subtract-1-1',
            'subtract-2-0',
            'subtract-2-1',
            'subtract-3-0',
            'subtract-3-1',
            'paper',
          ],
        ],
      ],
      boundary: '倒数与故事已有；实际减法画跳线另有独立任务。',
    },
    {
      page: 44,
      scope: '一图两式、加减联系、抽数卡及包含0的口算',
      evidence: [
        [
          'sj-upper-full-cards',
          ['zero-arithmetic', 'actual-draw-cards', 'actual-zero-operations'],
        ],
        ['sj-upper-six-nine-arithmetic', ['physical', 'method', 'paper']],
      ],
      boundary: '同图四式已有；抽卡与6～9四类含0实际操作独立记录。',
    },
    {
      page: 45,
      scope: '合并和取走故事、自主看图编故事、隐藏位置重复规律及段数连接处',
      evidence: [
        [
          'sj-upper-continuous',
          [
            'hidden-seven',
            'hidden-nine',
            'hidden-in-group',
            'actual-hidden-pattern',
          ],
        ],
        [
          'sj-upper-six-nine-arithmetic',
          ['story-add', 'story-subtract', 'paper'],
        ],
        [
          'sj-upper-six-nine-review',
          ['repeating-pattern', 'connections', 'pattern-paper', 'reflection'],
        ],
      ],
      boundary:
        '整体故事与连接已有；九项中第7/9及组内位置独立判断，真实覆盖记录另列；纸条替代绳安全记录。',
    },
    {
      page: 46,
      scope: '三部分连加与连续两次取走',
      evidence: [
        [
          'sj-upper-sequential-arithmetic',
          ['expression-0', 'expression-1', 'physical', 'story'],
        ],
      ],
      boundary: '中间量作为下一次起点，实际两次操作独立确认。',
    },
    {
      page: 47,
      scope: '连加、先减后加与先加后减、实际画数线',
      evidence: [
        [
          'sj-upper-numberline',
          [
            'two-additions',
            'two-subtractions',
            'add-then-subtract',
            'subtract-then-add',
            'actual-two-change-lines',
          ],
        ],
        [
          'sj-upper-sequential-arithmetic',
          [
            'expression-2',
            'expression-3',
            'story-add',
            'story-mixed',
            'current-quantity',
            'story',
          ],
        ],
      ],
      boundary: '四类两次变化的实际完整画线与逐步说明独立记录。',
    },
    {
      page: 48,
      scope: '混合、六步连续输入、十字与九格横竖求和、两次取走及同单位连加',
      evidence: [
        [
          'sj-upper-continuous',
          [
            'first-path',
            'second-path',
            'fifth-step-start',
            'start-is-not-output',
            'two-paths-reset',
            'actual-first-path',
            'actual-second-path',
          ],
        ],
        [
          'sj-upper-sequential-arithmetic',
          [
            'current-quantity',
            'expression-0',
            'expression-1',
            'expression-2',
            'expression-3',
          ],
        ],
        [
          'sj-upper-nine-consolidation',
          ['row-sums', 'column-sums', 'paper-table', 'same-unit-length'],
        ],
      ],
      boundary:
        '横竖取数和实际同单位已有；两条各六步完整当前数与实际游戏独立，不以两步算式代替。',
    },
    {
      page: 49,
      scope: '0～9读填、开放严格不等式、自编故事、全部正数加减表',
      evidence: [
        [
          'sj-upper-open-comparison',
          [
            'greater-than',
            'descending-pair',
            'dependent-pair-check',
            'zero-is-allowed',
            'strict-excludes-equal',
            'all-greater-candidates',
            'actual-open-writings',
          ],
        ],
        [
          'sj-upper-full-cards',
          [
            'add-chunk-0',
            'add-chunk-1',
            'add-chunk-2',
            'add-chunk-3',
            'subtract-chunk-0',
            'subtract-chunk-1',
            'subtract-chunk-2',
            'subtract-chunk-3',
            'add-result-groups',
            'subtract-result-groups',
            'actual-add-table',
            'actual-subtract-table',
          ],
        ],
        ['sj-upper-numberline', ['actual-complete-line']],
        ['sj-upper-recognize-6-9', ['number-order', 'paper']],
        ['sj-upper-six-nine-arithmetic', ['paper']],
        [
          'sj-upper-nine-consolidation',
          [
            'same-addend',
            'addition-pattern',
            'subtraction-pattern',
            'equation-sorting',
          ],
        ],
      ],
      boundary:
        '完整纸面数序、两套各36卡整表及全部合法开放链式填写/实际自主写已有。',
    },
    {
      page: 50,
      scope: '横竖规律与任选算法、队列取人、两边补画严格比较、实际画跳线',
      evidence: [
        [
          'sj-upper-open-comparison',
          [
            'two-groups-around',
            'actual-two-group-drawings',
            'actual-explanation',
          ],
        ],
        ['sj-upper-full-cards', ['row-column-rule', 'actual-own-method']],
        [
          'sj-upper-numberline',
          ['actual-addition-lines', 'actual-subtraction-lines'],
        ],
        [
          'sj-upper-nine-consolidation',
          [
            'addition-pattern',
            'subtraction-pattern',
            'quantity',
            'rank',
            'queue-change',
            'physical-queue',
          ],
        ],
        ['sj-upper-six-nine-arithmetic', ['method']],
      ],
      boundary:
        '队列与实际跳线已有；独立自选两套小于/大于数量实际画图与解释分开记录。',
    },
    {
      page: 51,
      scope: '整体与两部分、比较两边结果、连算与自主讲故事',
      evidence: [
        ['sj-upper-full-cards', ['zero-arithmetic', 'actual-zero-operations']],
        [
          'sj-upper-six-nine-arithmetic',
          ['story-add', 'story-subtract', 'paper'],
        ],
        ['sj-upper-six-nine-review', ['compare-0', 'compare-1', 'compare-2']],
        [
          'sj-upper-sequential-arithmetic',
          ['expression-0', 'expression-1', 'expression-2', 'expression-3'],
        ],
      ],
      boundary:
        '故事先说明条件和所求，0与空白不混，实际自主问题不由例题答对替代。',
    },
    {
      page: 52,
      scope: '实际续涂1/3/5/7/9格、数字地名、同符号一致及三项评价',
      evidence: [
        [
          'sj-upper-exploration-review',
          [
            'five-counts',
            'five-empty-counts',
            'same-symbols',
            'substitute-both',
            'actual-five-boards',
            'actual-numbered-name',
            'actual-symbols',
            'actual-evaluation-numbers',
            'actual-evaluation-arithmetic',
            'actual-evaluation-habits',
            'reflection-numbers',
            'reflection-arithmetic',
            'reflection-habits',
          ],
        ],
        [
          'sj-upper-six-nine-review',
          [
            'growing-pattern',
            'linked-quantities',
            'pattern-paper',
            'reflection',
          ],
        ],
      ],
      boundary:
        '五张两行五格板实际续涂、数字地名观察、同符号完整代回及三项实际证据/独立自评分别记录；故事有公开来源，不作现代测量。',
    },
  ],
  resolvedGaps: [
    {
      id: 'recognition-physical',
      pages: [37, 38, 39],
      activity:
        '实际拨珠6～9、配对比较与成对计数（双和根分开），不同目标三图实际补画。',
      evidence: [
        'sj-upper-part-tables-actual-beads',
        'sj-upper-part-tables-actual-pairs-comparison',
        'sj-upper-part-tables-actual-three-completions',
      ],
    },
    {
      id: 'complete-part-tables',
      pages: [39],
      activity:
        '8分两正部分的七种有序分法、9的八种完整表实际摆写，交换对应及每列守恒核对。',
      evidence: [
        'sj-upper-part-tables-full-table-8',
        'sj-upper-part-tables-full-table-9',
        'sj-upper-part-tables-actual-table-8',
        'sj-upper-part-tables-actual-table-9',
      ],
    },
    {
      id: 'numberline-drawing',
      pages: [37, 41, 43, 47, 49, 50],
      activity:
        '实际画完整0～9等距数线、缺位填写读数、加减与两次混合逐步画跳线。',
      evidence: [
        'sj-upper-numberline-actual-complete-line',
        'sj-upper-numberline-actual-addition-lines',
        'sj-upper-numberline-actual-subtraction-lines',
        'sj-upper-numberline-actual-two-change-lines',
        'sj-upper-numberline-actual-distance',
      ],
    },
    {
      id: 'complete-arithmetic-tables',
      pages: [44, 49, 50],
      activity:
        '实际36张两正数和≤9加卡、36张被减数≤9减数/差正减卡完整排列行列规律；真实抽卡与6～9含0计算分清本次卡范围。',
      evidence: [
        'sj-upper-full-cards-actual-add-table',
        'sj-upper-full-cards-actual-subtract-table',
        'sj-upper-full-cards-actual-draw-cards',
        'sj-upper-full-cards-actual-zero-operations',
        'sj-upper-full-cards-actual-own-method',
      ],
    },
    {
      id: 'continuous-hidden-pattern',
      pages: [45, 48],
      activity:
        '至少六步连续当前量完整输出，九项重复序列隐藏第7/9项各自定位，实际游戏/记录不当单道两步。',
      evidence: [
        'sj-upper-continuous-first-path',
        'sj-upper-continuous-second-path',
        'sj-upper-continuous-hidden-seven',
        'sj-upper-continuous-hidden-nine',
        'sj-upper-continuous-actual-first-path',
        'sj-upper-continuous-actual-second-path',
        'sj-upper-continuous-actual-hidden-pattern',
      ],
    },
    {
      id: 'open-inequalities',
      pages: [49, 50],
      activity:
        '0～9范围依赖两空的严格大小条件、自主多种合法写法与实际画小/大两群，等于排除。',
      evidence: [
        'sj-upper-open-comparison-descending-pair',
        'sj-upper-open-comparison-two-groups-around',
        'sj-upper-open-comparison-actual-open-writings',
        'sj-upper-open-comparison-actual-two-group-drawings',
        'sj-upper-open-comparison-actual-explanation',
      ],
    },
    {
      id: 'exploration-contexts',
      pages: [52],
      activity:
        '五张两行每行5格板实际续涂1/3/5/7/9；实际观察含数名称、谨慎查故事；同符号同数、两条件完整代回验证。',
      evidence: [
        'sj-upper-exploration-review-actual-five-boards',
        'sj-upper-exploration-review-actual-numbered-name',
        'sj-upper-exploration-review-actual-symbols',
      ],
    },
    {
      id: 'independent-evaluation',
      pages: [52],
      activity:
        '0～9识读写比较、9以内加减讲故事、专心听大胆说认真写三项分别实际证据与reflection null，计划不当已做。',
      evidence: [
        'sj-upper-exploration-review-actual-evaluation-numbers',
        'sj-upper-exploration-review-actual-evaluation-arithmetic',
        'sj-upper-exploration-review-actual-evaluation-habits',
        'sj-upper-exploration-review-reflection-numbers',
        'sj-upper-exploration-review-reflection-arithmetic',
        'sj-upper-exploration-review-reflection-habits',
      ],
    },
  ],
  gaps: [],
} as const;

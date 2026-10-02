/** Seven inspected printed pages, mapped to original teaching and actual tasks. */
export const sujiaoQuantityUnitAudit = {
  isbn: '978-7-5743-1295-1',
  checkedAt: '2026-10-02',
  unit: 'u6',
  status: 'original-teaching-implemented',
  finalTeacherReview: 'not-verified',
  pages: [
    {
      page: 71,
      scope: '作品展情境提出求两类相差的问题',
      evidence: [
        [
          'sj-lower-quantity-difference',
          ['more', 'difference-not-total', 'manual-0'],
        ],
      ],
      boundary:
        '原创两行图，不复制展览原画；同单位数量相差，不由背景画面推隐藏数量。',
    },
    {
      page: 72,
      scope: '已知与所求、一一对应、较多减较少和缺加数核对、列式口答',
      evidence: [
        [
          'sj-lower-quantity-difference',
          ['equation', 'missing-addend', 'manual-0', 'manual-1', 'reflection'],
        ],
      ],
      boundary: '差与合计分开，实物和画图人工确认，不将图示答对当真实操作。',
    },
    {
      page: 73,
      scope: '较少比比较多少与相差、同样多要再添、依据图自己编问题',
      evidence: [
        [
          'sj-lower-quantity-difference',
          ['less', 'both', 'add-to-equal', 'manual-1', 'manual-2'],
        ],
        ['sj-lower-comparison-target', ['manual-2']],
      ],
      boundary:
        '多多少与少多少同一差，未给比较范围不编造；自己编题按实际纸面与口述记录。',
    },
    {
      page: 74,
      scope: '已知标准和多出部分求较多数、画图列式口答与回顾方法',
      evidence: [
        [
          'sj-lower-comparison-target',
          [
            'more-target',
            'reference',
            'what-difference-means',
            'check-direction',
            'manual-0',
            'reflection',
          ],
        ],
      ],
      boundary: '未知全部不提前画可数答案，差不当全部，题意关系决定加减。',
    },
    {
      page: 75,
      scope: '求较少数、比较两种关系、自己画较多较少图和编相反关系问题',
      evidence: [
        [
          'sj-lower-comparison-target',
          [
            'less-target',
            'two-targets',
            'more-word-less-target',
            'less-word-more-target',
            'manual-0',
            'manual-1',
            'manual-2',
          ],
        ],
      ],
      boundary: '不机械按多加少减，独立恢复标准；实际画图和编题人工确认。',
    },
    {
      page: 76,
      scope: '双向求差、两种线段图、同情境三种已知求问、衣裤配套',
      evidence: [
        ['sj-lower-quantity-difference', ['both']],
        [
          'sj-lower-quantity-applications',
          [
            'bar-more',
            'bar-less',
            'bar-question',
            'same-context-difference',
            'same-context-less',
            'same-context-more',
            'matching',
            'manual-0',
            'manual-2',
          ],
        ],
      ],
      boundary:
        '线段是示意不按比例量答案，配套一件一条、不同单位不求合计当缺量。',
    },
    {
      page: 77,
      scope:
        '合计差与部分、同基准分别计算、提出不同问题解答、多种同样多办法与三项评价',
      evidence: [
        [
          'sj-lower-quantity-applications',
          [
            'exhibit-total',
            'exhibit-difference',
            'exhibit-part',
            'shared-reference',
            'reference-not-result',
            'manual-1',
            'manual-2',
            'manual-3',
            'own-question',
            'evaluation-understanding',
            'evaluation-application',
            'evaluation-representation',
          ],
        ],
        [
          'sj-lower-equalize-transfers',
          [
            'only-add',
            'only-remove',
            'transfer',
            'all-methods',
            'manual-0',
            'manual-1',
            'own-method',
          ],
        ],
      ],
      boundary:
        '自己提问与解答实际确认，缺条件不编结果；添拿和移物分开且每次恢复原量。三项评价分别reflection null，不由计划或成绩推星级，整物限制为原创拓展。',
    },
  ],
} as const;

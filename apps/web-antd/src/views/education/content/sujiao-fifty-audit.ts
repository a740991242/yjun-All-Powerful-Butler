/** Printed-page scope mapped to objective, actual and open tasks; teacher review remains unverified. */
export const sujiaoFiftyAudit = {
  isbn: '978-7-5743-1295-1',
  checkedAt: '2026-10-02',
  unit: 'fifty',
  status: 'original-teaching-implemented',
  finalTeacherReview: 'not-verified',
  pages: [
    {
      page: 53,
      scope: '水果估数参照、先估把数再抓数、准确数量与差距',
      evidence: ['manual-0', 'manual-1', 'short', 'extra'],
      boundary:
        '同类十个参照，不由画面面积当准确数，估计和实际记录分列，不使用食品抓取作为必做。',
    },
    {
      page: 54,
      scope: '换材料一把参照、比较谁更接近及交流抓法',
      evidence: ['hand', 'closest', 'tie', 'manual-2', 'manual-3'],
      boundary: '把数和个数不同，距离相同保留并列，不推每把统一数量。',
    },
    {
      page: 55,
      scope: '抓数体会、50积木预测与部分实测、杯桶预测及分工',
      evidence: [
        'stack',
        'water',
        'manual-4',
        'manual-5',
        'reflection-0',
        'reflection-2',
      ],
      boundary:
        '部分摞高不当已摞50，尺寸摆法未给不编高度；成人协助同杯同量，未做待做。',
    },
    {
      page: 56,
      scope:
        '倒杯观察与重新估计、实际全班场地站排和容纳人数估计、生活数量及三项评价',
      evidence: [
        'water',
        'space',
        'unit',
        'manual-5',
        'manual-6',
        'manual-7',
        'manual-8',
        'reflection-0',
        'reflection-1',
        'reflection-2',
      ],
      boundary:
        '纸面队形不代替教师组织现场，实际参与非50如实记，按同样队形估计容量不当实测；页与纸张不同，三项评价null不自动能力评分。',
    },
  ],
} as const;

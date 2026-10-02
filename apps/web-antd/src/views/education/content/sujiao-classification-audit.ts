/** Printed pages mapped to original lessons and actual activities; final teacher review remains separate. */
export const sujiaoClassificationAudit = {
  isbn: '978-7-5743-1295-1',
  checkedAt: '2026-10-02',
  unit: 'u3',
  status: 'original-teaching-implemented',
  finalTeacherReview: 'not-verified',
  pages: [
    {
      page: 36,
      scope: '不同颜色、形状物品引入分类',
      evidence: [
        {
          lesson: 'sj-lower-cup-classification',
          knowledge: 'sj-lower-cup-classification-criterion',
        },
        {
          lesson: 'sj-lower-classification-applications',
          knowledge: 'sj-lower-classification-applications-manual-0',
        },
      ],
      boundary: '使用原创杯子与积木，不复制原灯笼插图，不推断其未给出的数量。',
    },
    {
      page: 37,
      scope: '动物按会飞分类，逐项符号表示、计数比较与重复遗漏核对',
      evidence: [
        {
          lesson: 'sj-lower-classification',
          knowledge: 'sj-lower-classification-fly-select',
        },
        {
          lesson: 'sj-lower-classification',
          knowledge: 'sj-lower-classification-fly-compare',
        },
        {
          lesson: 'sj-lower-classification',
          knowledge: 'sj-lower-classification-same-mark',
        },
        {
          lesson: 'sj-lower-classification',
          knowledge: 'sj-lower-classification-manual-2',
        },
      ],
      boundary:
        '原创已说明能力的动物卡，不照抄原动物数量；同符号和不同符号都可表示，须逐项对应。',
    },
    {
      page: 38,
      scope: '动物换水中生活标准、植物涂色、树叶分类、杯子先形状后颜色',
      evidence: [
        {
          lesson: 'sj-lower-classification',
          knowledge: 'sj-lower-classification-water-select',
        },
        {
          lesson: 'sj-lower-classification-review',
          knowledge: 'sj-lower-classification-review-manual-0',
        },
        {
          lesson: 'sj-lower-nature-classification',
          knowledge: 'sj-lower-nature-classification-manual-1',
        },
        {
          lesson: 'sj-lower-cup-classification',
          knowledge: 'sj-lower-cup-classification-manual-0',
        },
        {
          lesson: 'sj-lower-cup-classification',
          knowledge: 'sj-lower-cup-classification-manual-1',
        },
      ],
      boundary:
        '自选安全纸卡与用品，真实植物涂色独立确认；杯身形状、颜色和把手标准分开，不推断容量。',
    },
    {
      page: 39,
      scope: '班级男女、同龄、同出生月份、足球喜好，实际询问记录和数量表',
      evidence: [
        {
          lesson: 'sj-lower-class-surveys',
          knowledge: 'sj-lower-class-surveys-0-read-0',
        },
        {
          lesson: 'sj-lower-class-surveys',
          knowledge: 'sj-lower-class-surveys-age',
        },
        {
          lesson: 'sj-lower-class-surveys',
          knowledge: 'sj-lower-class-surveys-month',
        },
        {
          lesson: 'sj-lower-class-surveys',
          knowledge: 'sj-lower-class-surveys-preference',
        },
        {
          lesson: 'sj-lower-class-surveys',
          knowledge: 'sj-lower-class-surveys-manual-0',
        },
        {
          lesson: 'sj-lower-class-surveys',
          knowledge: 'sj-lower-class-surveys-manual-2',
        },
      ],
      boundary:
        '示例不是实际全班人数；实际调查先定比较对象与范围，一人一符号，未知不是0，不收集姓名和完整生日。',
    },
    {
      page: 40,
      scope: '小朋友活动分类、动物种类与活动不同标准、乒乓球能力真实调查',
      evidence: [
        {
          lesson: 'sj-lower-child-activities',
          knowledge: 'sj-lower-child-activities-manual-0',
        },
        {
          lesson: 'sj-lower-child-activities',
          knowledge: 'sj-lower-child-activities-manual-1',
        },
        {
          lesson: 'sj-lower-classification-applications',
          knowledge: 'sj-lower-classification-applications-kind-most',
        },
        {
          lesson: 'sj-lower-classification-applications',
          knowledge: 'sj-lower-classification-applications-activity-most',
        },
        { lesson: 'sj-lower-surveys', knowledge: 'sj-lower-surveys-0-read-0' },
        { lesson: 'sj-lower-surveys', knowledge: 'sj-lower-surveys-manual-0' },
      ],
      boundary:
        '原创活动图卡不复制原图；正在参与不等于喜好或能力，真实调查不能由示例答题代替。',
    },
    {
      page: 41,
      scope:
        '积木形状颜色最多、泳池先提问题、最喜欢水果调查、实际图书室交流、两项独立评价',
      evidence: [
        {
          lesson: 'sj-lower-classification-applications',
          knowledge: 'sj-lower-classification-applications-shape-most',
        },
        {
          lesson: 'sj-lower-classification-applications',
          knowledge: 'sj-lower-classification-applications-color-most',
        },
        {
          lesson: 'sj-lower-pool-classification',
          knowledge: 'sj-lower-pool-classification-manual-2',
        },
        { lesson: 'sj-lower-surveys', knowledge: 'sj-lower-surveys-3-read-0' },
        {
          lesson: 'sj-lower-classification-review',
          knowledge: 'sj-lower-classification-review-manual-3',
        },
        {
          lesson: 'sj-lower-classification-review',
          knowledge: 'sj-lower-classification-review-manual-4',
        },
        {
          lesson: 'sj-lower-classification-review',
          knowledge: 'sj-lower-classification-review-classification',
        },
        {
          lesson: 'sj-lower-classification-review',
          knowledge: 'sj-lower-classification-review-expression',
        },
      ],
      boundary:
        '最多保留并列；泳池仅纸面活动不推断游泳能力，图书室必须真实观察交流，计划和未做分列，评价不自动评分。',
    },
  ],
} as const;

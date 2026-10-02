/** Inspected printed-page scope; original teaching does not replace the source book. */
export const sujiaoMathComicAudit = {
  isbn: '978-7-5743-1295-1',
  checkedAt: '2026-10-02',
  unit: 'math-comic',
  status: 'original-teaching-implemented',
  finalTeacherReview: 'not-verified',
  pages: [
    {
      page: 85,
      scope: '读连环画找数字及其用途、交流自己经历的生活数学故事和数学知识',
      evidence: ['initial', 'identifier', 'relevant', 'manual-0'],
      boundary:
        '借书图文为本站原创，编号不当数量；不复制原家庭故事或要求提供真实住址，原创想象明确标注。',
    },
    {
      page: 86,
      scope:
        '不同生活题材、规划先后和幅数、人物语言及标题、阅读作品提出改进建议',
      evidence: [
        'sequence',
        'units',
        'check',
        'manual-1',
        'manual-2',
        'manual-3',
      ],
      boundary:
        '真实口述规划、绘画、交流分别确认，不固定四幅或唯一标题，不将所有故事限制为算式。',
    },
    {
      page: 87,
      scope:
        '补人物标识及标题、画后互看修改、故事会找信息与问题、展示评选及收获',
      evidence: [
        'check',
        'unknown',
        'manual-3',
        'manual-4',
        'manual-5',
        'reflection-0',
        'reflection-1',
      ],
      boundary:
        '展示评选独立于网页答题；家庭替代如实标场景，不冒称班级评选，先征求作者同意、不上传私人信息。没做待做，评价不按美术水平，开放反思null不自动评能力。',
    },
  ],
} as const;

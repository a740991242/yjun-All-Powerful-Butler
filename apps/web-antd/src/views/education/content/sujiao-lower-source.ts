/** Facts actually read in the public scan, rather than inferred from its label.
 * Copyright edition/printing remains unverified; this is not a release gate.
 */
export const sujiaoLowerSource = {
  title: '义务教育教科书 数学 一年级 下册',
  publisher: '江苏凤凰教育出版社',
  isbn: '978-7-5743-1295-1',
  approvalYear: 2024,
  editors: ['孙丽谷', '王林'],
  volumeEditor: '袁芳良',
  edition: null,
  printing: null,
  checkedAt: '2026-10-01',
  preview: 'https://keben.app/book/0096',
  readerPageCount: 110,
  printedPageOffset: 7,
  contents: [
    { id: 'u1', title: '进位加法和退位减法', page: 1 },
    { id: 'u2', title: '图形的初步认识（二）', page: 22 },
    { id: 'shape-joining', title: '图形的拼组', page: 32 },
    { id: 'u3', title: '数据分类（一）', page: 36 },
    { id: 'u4', title: '认识20～99', page: 42 },
    { id: 'fifty', title: '50有多大', page: 53 },
    { id: 'u5', title: '两位数加、减整十数和一位数', page: 57 },
    { id: 'u6', title: '简单的数量关系（一）', page: 71 },
    { id: 'u7', title: '观察物体（一）', page: 78 },
    { id: 'math-comic', title: '数学连环画', page: 85 },
    { id: 'review', title: '期末复习', page: 88 },
  ],
} as const;

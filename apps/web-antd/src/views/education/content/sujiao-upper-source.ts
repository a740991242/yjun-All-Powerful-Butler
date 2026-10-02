/** Facts read from the same public scan's cover, copyright and printed contents.
 * This identifies the scan, not every school's selection or completed lessons.
 */
export const sujiaoUpperSource = {
  title: '义务教育教科书 数学 一年级 上册',
  publisher: '江苏凤凰教育出版社',
  isbn: '978-7-5743-1099-5',
  edition: '2024-07',
  printing: '2025-07',
  printingNumber: 2,
  checkedAt: '2026-10-01',
  preview: 'https://keben.app/book/0103',
  contents: [
    { id: 'games', title: '数学游戏分享', page: 1 },
    { id: 'u1', title: '0～5的认识和加减法', page: 11 },
    { id: 'position', title: '生活中的位置', page: 32 },
    { id: 'u2', title: '6～9的认识和加减法', page: 35 },
    { id: 'u3', title: '图形的初步认识（一）', page: 53 },
    { id: 'u4', title: '10的认识和加减法', page: 62 },
    { id: 'take-ten', title: '好玩的“抢10”', page: 75 },
    { id: 'u5', title: '认识11～19', page: 78 },
    { id: 'review', title: '期末复习', page: 88 },
  ],
} as const;

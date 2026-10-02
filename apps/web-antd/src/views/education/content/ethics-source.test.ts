import { expect, it } from 'vitest';

import { chineseBooks } from './chinese';
import ethicsSources from './ethics-source.json';
import { mathBooks } from './math';
import { textbooks } from './textbooks';

it('records two independent six-three source identities without replacing the original four books', () => {
  expect(textbooks).toHaveLength(4);
  expect([...chineseBooks, ...mathBooks]).toHaveLength(4);
  expect(ethicsSources.map((book) => book.id)).toEqual([
    'pep-ethics-p1-upper-2024',
    'pep-ethics-p1-lower-2024',
  ]);
  expect(ethicsSources.map((book) => book.resourceId)).toEqual([
    '0001',
    '0002',
  ]);
  for (const book of ethicsSources) {
    expect(book.subject).toBe('ethics');
    expect(book.provider).toBe('third-party-public-preview');
    expect(book.pdfUrl).toContain(book.sha256);
    expect(book.sha256).toMatch(/^[a-f\d]{64}$/);
    expect(book.isbn).toBeNull();
    expect(book.editionDate).toBeNull();
    expect(book.printingDate).toBeNull();
    expect(book.approvalMark).toBe(2024);
  }
});

it('keeps complete ordered contents and separates read pages from available authored teaching', () => {
  const expectedPages = [
    [2, 6, 10, 14, 18, 22, 25, 29, 34, 37, 41, 44, 48, 52, 55, 58],
    [2, 6, 10, 14, 18, 22, 26, 30, 34, 38, 41, 45, 50, 54, 57, 60],
  ];
  for (const [index, book] of ethicsSources.entries()) {
    const items = book.units.flatMap((unit) => unit.items);
    expect(book.units).toHaveLength(4);
    expect(items).toHaveLength(16);
    expect(new Set(items.map((item) => item.id)).size).toBe(16);
    expect(items.map((item) => item.page)).toEqual(expectedPages[index]);
    expect(
      items.filter((item) => item.bodyRead).map((item) => item.page),
    ).toEqual([
      2,
      6,
      10,
      14,
      18,
      22,
      book.volume === 'upper' ? 25 : 26,
      book.volume === 'upper' ? 29 : 30,
      34,
      book.volume === 'upper' ? 37 : 38,
      41,
      book.volume === 'upper' ? 44 : 45,
      book.volume === 'upper' ? 48 : 50,
      book.volume === 'upper' ? 52 : 54,
    ]);
    expect(book.readPrintedPages).toEqual([
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      18,
      19,
      20,
      21,
      22,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      34,
      35,
      36,
      37,
      38,
      39,
      40,
      41,
      42,
      43,
      44,
      45,
      46,
      ...(book.volume === 'lower'
        ? [47, 48, 50, 51, 52, 53, 54, 55, 56]
        : [48, 49, 50, 51, 52, 53, 54]),
    ]);
    expect(book.readPdfPages).toEqual([
      1,
      3,
      4,
      5,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      23,
      24,
      25,
      26,
      27,
      28,
      29,
      30,
      31,
      32,
      33,
      34,
      35,
      36,
      37,
      39,
      40,
      41,
      42,
      43,
      44,
      45,
      46,
      47,
      48,
      49,
      50,
      51,
      ...(book.volume === 'lower'
        ? [52, 53, 55, 56, 57, 58, 59, 60, 61]
        : [53, 54, 55, 56, 57, 58, 59]),
    ]);
    expect(book.readPdfPages.length).toBeLessThan(book.pdfPages);
  }
  expect(ethicsSources[0]?.units[0]?.items[0]?.title).toBe('开开心心上学去');
  expect(ethicsSources[1]?.units[0]?.items[0]?.title).toBe('有个新目标');
  expect(ethicsSources[1]?.units[3]?.items[3]?.title).toBe('学先锋 做先锋');
});

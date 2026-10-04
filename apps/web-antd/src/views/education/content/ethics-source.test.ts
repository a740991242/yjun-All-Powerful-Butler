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
    expect(book.isbn).toBe(
      book.volume === 'upper' ? '978-7-107-38236-9' : '978-7-107-38237-6',
    );
    expect(book.isbnEvidence.pdfPage).toBe(70);
    expect(book.isbnEvidence.provider).toBe('third-party-public-preview');
    const digits = [...book.isbn.replaceAll('-', '')].map(Number);
    expect(
      digits.reduce(
        (sum, digit, index) => sum + digit * (index % 2 === 0 ? 1 : 3),
        0,
      ) % 10,
    ).toBe(0);
    expect(book.publisherCrossCheck.status).toBe('entry-only-body-unverified');
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
      book.volume === 'upper' ? 55 : 57,
      book.volume === 'upper' ? 58 : 60,
    ]);
    expect(book.readPrintedPages).toEqual(
      Array.from(
        { length: book.volume === 'upper' ? 60 : 62 },
        (_, i) => i + 1,
      ),
    );
    expect(book.readPdfPages).toEqual(
      Array.from({ length: 70 }, (_, i) => i + 1),
    );
    for (const unit of book.units) {
      expect(unit.introAudit.printedPage).toBe(unit.page);
      expect(unit.introAudit.pdfPage).toBe(unit.page + 5);
      expect(unit.introAudit.lessonIds).toEqual(
        unit.items.map((item) => item.id),
      );
      expect(unit.introAudit.newRequiredExercise).toBe(false);
      expect(unit.introAudit.summary.length).toBeGreaterThan(20);
    }
    expect(book.readPdfPages.length).toBe(book.pdfPages);
  }
  expect(ethicsSources[0]?.units[0]?.items[0]?.title).toBe('开开心心上学去');
  expect(ethicsSources[1]?.units[0]?.items[0]?.title).toBe('有个新目标');
  expect(ethicsSources[1]?.units[3]?.items[3]?.title).toBe('学先锋 做先锋');
});

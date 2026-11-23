export const PORTFOLIO_ARCHIVE_KEY =
  'all-in-one-butler:finance:portfolio-archive:v1';
export const WISHLIST_ARCHIVE_KEY =
  'all-in-one-butler:finance:wishlist-archive:v1';

interface ArchiveState {
  codes: string[];
}

function validateArchive(input: unknown): ArchiveState {
  if (!input || typeof input !== 'object' || Array.isArray(input))
    throw new Error('invalid');
  const codes = (input as Record<string, unknown>).codes;
  if (!Array.isArray(codes) || codes.some((code) => typeof code !== 'string'))
    throw new Error('invalid');
  return { codes: [...new Set(codes)] };
}

export function readArchivedCodes(
  storage: Pick<Storage, 'getItem'>,
  key: string,
  validCodes: Iterable<string>,
) {
  const current = storage.getItem(key);
  if (current === null) return [];
  const valid = new Set(validCodes);
  return validateArchive(JSON.parse(current)).codes.filter((code) =>
    valid.has(code),
  );
}

export function writeArchivedCodes(
  storage: Pick<Storage, 'setItem'>,
  key: string,
  codes: Iterable<string>,
  validCodes: Iterable<string>,
) {
  const valid = new Set(validCodes);
  const normalized = validateArchive({ codes: [...codes] }).codes.filter(
    (code) => valid.has(code),
  );
  storage.setItem(key, JSON.stringify({ codes: normalized }));
  return normalized;
}

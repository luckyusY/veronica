import { describe, it, expect } from 'vitest';
import { isPlainObject, toMultiline, serializeUtilityLinks, parseUtilityLinks, cloneSettings } from '../../src/lib/admin-utils';
import type { CmsSiteSettings } from '../../src/lib/cms-types';

describe('Admin Utilities: isPlainObject', () => {
  it('correctly identifies plain objects', () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject({ key: 'value' })).toBe(true);
  });

  it('rejects arrays and nulls', () => {
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject(null)).toBe(false);
    expect(isPlainObject(undefined)).toBe(false);
    expect(isPlainObject('string')).toBe(false);
  });
});

describe('Admin Utilities: toMultiline', () => {
  it('joins strings with newlines', () => {
    expect(toMultiline(['Line 1', 'Line 2'])).toBe('Line 1\nLine 2');
  });
});

describe('Admin Utilities: Utility Links', () => {
  it('serializes and parses utility links correctly', () => {
    const rawLinks: CmsSiteSettings["footer"]["utilityLinks"] = [
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' }
    ];

    const serialized = serializeUtilityLinks(rawLinks);
    expect(serialized).toBe('Privacy | /privacy\nTerms | /terms');

    const parsed = parseUtilityLinks(serialized);
    expect(parsed).toEqual([
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' }
    ]);
  });
});

describe('Admin Utilities: cloneSettings', () => {
  it('deep clones a site settings object', () => {
    const original: Partial<CmsSiteSettings> = {
      header: { brandKicker: 'Veronica', bookingLabel: 'Book', shopLabel: 'Shop' },
      footer: { notes: ['Note 1'], socialSignals: [], description: '', copyrightTagline: '', utilityLinks: [] }
    };
    
    const cloned = cloneSettings(original as CmsSiteSettings);
    expect(cloned).toEqual(original);
    expect(cloned).not.toBe(original);
  });
});

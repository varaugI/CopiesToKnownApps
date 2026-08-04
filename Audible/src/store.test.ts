import { describe, expect, it } from 'vitest';
import { catalog, filterTitles, formatClock, formatDuration, toggleInCollection } from './store';

describe('Audible catalog helpers', () => {
  it('searches author, narrator, title, and category together', () => {
    expect(filterTitles(catalog, 'Asha King').map((title) => title.id)).toEqual(['sea-between-stars']);
    expect(filterTitles(catalog, '', 'Science Fiction')).toHaveLength(2);
  });

  it('formats listening durations and progress clocks', () => {
    expect(formatDuration(38220)).toBe('10 hr 37 min');
    expect(formatClock(3723)).toBe('1:02:03');
    expect(formatClock(-9)).toBe('0:00');
  });

  it('adds and removes collection ids without duplicates', () => {
    expect(toggleInCollection(['one'], 'two')).toEqual(['one', 'two']);
    expect(toggleInCollection(['one', 'two'], 'one')).toEqual(['two']);
  });
});


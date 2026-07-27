import '@testing-library/jest-dom';
import 'fake-indexeddb/auto';
import { vi } from 'vitest';

if (typeof window !== 'undefined') {
  window.Element.prototype.scrollIntoView = vi.fn();
}

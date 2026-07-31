import { describe, expect, it } from 'vitest';
import { catalog } from '../data/catalog';
import { cartQuantity, cartSubtotal, discountPercent, filterProducts, formatPrice } from './store';

describe('store helpers', () => {
  it('filters by search text and category together', () => {
    const matches = filterProducts(catalog, 'wireless', 'Computers');
    expect(matches.map((product) => product.id)).toEqual(['mechanical-keyboard', 'ergonomic-mouse']);
  });

  it('calculates cart totals and quantities', () => {
    const lines = [
      { product: catalog[0], quantity: 2 },
      { product: catalog[1], quantity: 1 },
    ];
    expect(cartQuantity(lines)).toBe(3);
    expect(cartSubtotal(lines)).toBeCloseTo(299.97);
  });

  it('formats prices and discounts for storefront labels', () => {
    expect(formatPrice(79.99)).toBe('$79.99');
    expect(discountPercent(catalog[0])).toBe(38);
  });
});


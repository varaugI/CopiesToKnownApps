import type { Product } from '../data/catalog';

export type CartLine = { product: Product; quantity: number };

export function filterProducts(products: Product[], query: string, category: string) {
  const needle = query.trim().toLocaleLowerCase();
  return products.filter((product) => {
    const inCategory = category === 'All' || product.category === category;
    const haystack = `${product.title} ${product.brand} ${product.category}`.toLocaleLowerCase();
    return inCategory && (!needle || haystack.includes(needle));
  });
}

export function formatPrice(value: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
}

export function discountPercent(product: Pick<Product, 'price' | 'listPrice'>) {
  return Math.round((1 - product.price / product.listPrice) * 100);
}

export function cartSubtotal(lines: CartLine[]) {
  return lines.reduce((total, line) => total + line.product.price * line.quantity, 0);
}

export function cartQuantity(lines: CartLine[]) {
  return lines.reduce((total, line) => total + line.quantity, 0);
}


import { ProductCard, type Product } from './product-card';
export function ProductGrid({ products, columns = 3 }: { products: Product[]; columns?: 2 | 3 | 4 }) {
  const cols = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' }[columns];
  return <div className={`grid gap-6 ${cols}`}>{products.map(p => <ProductCard key={p.slug} product={p} />)}</div>;
}

import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { catalog, categories, categoryTiles, heroSlides, type Product } from './data/catalog';
import {
  cartQuantity,
  cartSubtotal,
  discountPercent,
  filterProducts,
  formatPrice,
  type CartLine,
} from './lib/store';

type Toast = { id: number; message: string } | null;

const Icon = ({ name, size = 22 }: { name: 'menu' | 'pin' | 'search' | 'cart' | 'user' | 'close' | 'chevron' | 'minus' | 'plus'; size?: number }) => {
  const paths = {
    menu: <path d="M4 7h16M4 12h16M4 17h16" />,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></>,
    cart: <><path d="M3 4h2l2.3 10.2a2 2 0 0 0 2 1.6h7.8a2 2 0 0 0 2-1.6L20.5 8H7" /><circle cx="10" cy="20" r="1" /><circle cx="18" cy="20" r="1" /></>,
    user: <><circle cx="12" cy="8" r="4" /><path d="M4.5 21a7.5 7.5 0 0 1 15 0" /></>,
    close: <path d="m6 6 12 12M18 6 6 18" />,
    chevron: <path d="m9 18 6-6-6-6" />,
    minus: <path d="M5 12h14" />,
    plus: <path d="M12 5v14M5 12h14" />,
  };
  return <svg aria-hidden="true" className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
};

function Logo() {
  return <span className="wordmark" aria-label="amazon"><span>amazon</span><i /></span>;
}

function Stars({ rating, reviews }: { rating: number; reviews?: number }) {
  return <span className="rating" aria-label={`${rating} out of 5 stars`}><span>★★★★★</span><b>{rating}</b>{reviews !== undefined && <em>{reviews.toLocaleString()}</em>}</span>;
}

function Price({ value }: { value: number }) {
  const [whole, cents = '00'] = value.toFixed(2).split('.');
  return <span className="price"><sup>$</sup><strong>{whole}</strong><sup>{cents}</sup></span>;
}

function ProductCard({ product, onOpen, onAdd, compact = false }: { product: Product; onOpen: (product: Product) => void; onAdd: (product: Product) => void; compact?: boolean }) {
  return (
    <article className={`product-card${compact ? ' compact' : ''}`}>
      <button className="product-image" style={{ background: product.accent }} onClick={() => onOpen(product)} aria-label={`View ${product.title}`}>
        <img src={product.image} alt="" loading="lazy" />
      </button>
      <div className="product-copy">
        {product.badge && <span className="product-badge">{product.badge}</span>}
        <button className="product-title" onClick={() => onOpen(product)}>{product.title}</button>
        <Stars rating={product.rating} reviews={compact ? undefined : product.reviews} />
        <div className="product-price-row"><Price value={product.price} /><span className="list-price">List: <s>{formatPrice(product.listPrice)}</s></span></div>
        <div className="delivery-line">{product.prime && <span className="prime">prime</span>} <span>FREE delivery Tomorrow</span></div>
        {!compact && <button className="add-button" onClick={() => onAdd(product)}>Add to cart</button>}
      </div>
    </article>
  );
}

function Header({
  draftQuery,
  setDraftQuery,
  category,
  setCategory,
  onSearch,
  onCart,
  cartCount,
  onAccount,
  onLocation,
}: {
  draftQuery: string;
  setDraftQuery: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  onSearch: (event: FormEvent) => void;
  onCart: () => void;
  cartCount: number;
  onAccount: () => void;
  onLocation: () => void;
}) {
  return (
    <header>
      <div className="topbar">
        <button className="mobile-menu" aria-label="Open menu"><Icon name="menu" /></button>
        <a href="#top" className="logo-link"><Logo /></a>
        <button className="location-button" onClick={onLocation}><Icon name="pin" size={20} /><span><small>Delivering to Austin 78701</small><strong>Update location</strong></span></button>
        <form className="search" role="search" onSubmit={onSearch}>
          <select aria-label="Search category" value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map((item) => <option key={item}>{item}</option>)}</select>
          <input value={draftQuery} onChange={(event) => setDraftQuery(event.target.value)} placeholder="Search Amazon" aria-label="Search Amazon" />
          <button type="submit" aria-label="Submit search"><Icon name="search" size={25} /></button>
        </form>
        <button className="language"><span>🇺🇸</span><strong>EN</strong><span className="caret">▾</span></button>
        <button className="nav-account" onClick={onAccount}><small>Hello, sign in</small><strong>Account & Lists <span className="caret">▾</span></strong></button>
        <button className="orders"><small>Returns</small><strong>& Orders</strong></button>
        <button className="cart-button" onClick={onCart} aria-label={`Cart with ${cartCount} items`}><span className="cart-icon"><Icon name="cart" size={34} /><b>{cartCount}</b></span><strong>Cart</strong></button>
      </div>
      <nav className="subnav" aria-label="Store departments">
        <button><Icon name="menu" size={19} /><strong>All</strong></button>
        {['Today\'s Deals', 'Customer Service', 'Registry', 'Gift Cards', 'Sell'].map((label) => <button key={label}>{label}</button>)}
        <button className="subnav-promo">Shop everyday essentials</button>
      </nav>
    </header>
  );
}

function ProductDialog({ product, onClose, onAdd }: { product: Product; onClose: () => void; onAdd: (product: Product) => void }) {
  return (
    <div className="overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <section className="product-dialog" role="dialog" aria-modal="true" aria-label={product.title}>
        <button className="dialog-close" onClick={onClose} aria-label="Close product detail"><Icon name="close" /></button>
        <div className="dialog-image" style={{ background: product.accent }}><img src={product.image} alt={product.title} /></div>
        <div className="dialog-copy">
          <small>Visit the {product.brand} Store</small>
          <h2>{product.title}</h2>
          <Stars rating={product.rating} reviews={product.reviews} />
          <hr />
          <p className="deal-label">{discountPercent(product)}% off · {product.badge}</p>
          <Price value={product.price} />
          <p className="tax-note">All prices include applicable taxes. Fictional catalog item for this interface study.</p>
          <p>{product.description}</p>
          <h3>About this item</h3>
          <ul>{product.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
          <div className="dialog-delivery"><span>FREE delivery <strong>Tomorrow</strong></span><b>In Stock</b></div>
          <button className="add-button wide" onClick={() => onAdd(product)}>Add to cart</button>
        </div>
      </section>
    </div>
  );
}

function CartDrawer({ lines, onClose, onQuantity, onCheckout }: { lines: CartLine[]; onClose: () => void; onQuantity: (id: string, delta: number) => void; onCheckout: () => void }) {
  const quantity = cartQuantity(lines);
  const subtotal = cartSubtotal(lines);
  return (
    <div className="overlay drawer-overlay" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <aside className="cart-drawer" role="dialog" aria-modal="true" aria-label="Shopping cart">
        <div className="drawer-head"><div><small>Your basket</small><h2>Shopping Cart</h2></div><button onClick={onClose} aria-label="Close cart"><Icon name="close" /></button></div>
        {lines.length === 0 ? (
          <div className="empty-cart"><span><Icon name="cart" size={48} /></span><h3>Your Amazon Cart is empty</h3><p>Explore today’s picks and add something you love.</p><button className="add-button" onClick={onClose}>Continue shopping</button></div>
        ) : (
          <>
            <div className="cart-lines">{lines.map(({ product, quantity: lineQuantity }) => (
              <article className="cart-line" key={product.id}>
                <img src={product.image} alt="" />
                <div><h3>{product.title}</h3><span className="stock">In Stock</span><strong>{formatPrice(product.price)}</strong>
                  <div className="quantity-control"><button onClick={() => onQuantity(product.id, -1)} aria-label={`Remove one ${product.title}`}><Icon name="minus" size={15} /></button><span>{lineQuantity}</span><button onClick={() => onQuantity(product.id, 1)} aria-label={`Add one ${product.title}`}><Icon name="plus" size={15} /></button></div>
                </div>
              </article>
            ))}</div>
            <div className="cart-summary"><p>Subtotal ({quantity} {quantity === 1 ? 'item' : 'items'}): <strong>{formatPrice(subtotal)}</strong></p><label><input type="checkbox" /> This order contains a gift</label><button className="checkout-button" onClick={onCheckout}>Proceed to checkout</button><small>Secure transaction · Demo checkout only</small></div>
          </>
        )}
      </aside>
    </div>
  );
}

export default function App() {
  const [products, setProducts] = useState<Product[]>(catalog);
  const [draftQuery, setDraftQuery] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [heroIndex, setHeroIndex] = useState(0);
  const [selected, setSelected] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [locationOpen, setLocationOpen] = useState(false);
  const [toast, setToast] = useState<Toast>(null);
  const resultsRef = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch('/api/products')
      .then((response) => response.ok ? response.json() as Promise<Product[]> : Promise.reject())
      .then((payload) => payload.length && setProducts(payload))
      .catch(() => setProducts(catalog));
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => setHeroIndex((index) => (index + 1) % heroSlides.length), 7000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    document.body.classList.toggle('no-scroll', Boolean(selected || cartOpen));
    return () => document.body.classList.remove('no-scroll');
  }, [selected, cartOpen]);

  const visibleProducts = useMemo(() => filterProducts(products, query, category), [products, query, category]);
  const cartCount = cartQuantity(cart);
  const hero = heroSlides[heroIndex];

  const announce = (message: string) => setToast({ id: Date.now(), message });

  const runSearch = (event?: FormEvent) => {
    event?.preventDefault();
    setQuery(draftQuery);
    setAccountOpen(false);
    setLocationOpen(false);
    window.setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40);
  };

  const chooseCategory = (nextCategory: string) => {
    setCategory(nextCategory);
    setQuery('');
    setDraftQuery('');
    window.setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 40);
  };

  const addToCart = (product: Product) => {
    setCart((lines) => {
      const existing = lines.find((line) => line.product.id === product.id);
      return existing
        ? lines.map((line) => line.product.id === product.id ? { ...line, quantity: line.quantity + 1 } : line)
        : [...lines, { product, quantity: 1 }];
    });
    fetch('/api/cart', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ productId: product.id, quantity: 1 }) }).catch(() => undefined);
    announce(`${product.brand} item added to cart`);
    setSelected(null);
  };

  const changeQuantity = (id: string, delta: number) => {
    setCart((lines) => lines.map((line) => line.product.id === id ? { ...line, quantity: line.quantity + delta } : line).filter((line) => line.quantity > 0));
  };

  const checkout = () => {
    setCart([]);
    setCartOpen(false);
    announce('Demo order placed — no payment was processed');
  };

  return (
    <div id="top" className="app-shell">
      <Header
        draftQuery={draftQuery}
        setDraftQuery={setDraftQuery}
        category={category}
        setCategory={setCategory}
        onSearch={runSearch}
        onCart={() => { setCartOpen(true); setAccountOpen(false); }}
        cartCount={cartCount}
        onAccount={() => { setAccountOpen((open) => !open); setLocationOpen(false); }}
        onLocation={() => { setLocationOpen((open) => !open); setAccountOpen(false); }}
      />

      {accountOpen && <div className="popover account-popover"><div><h3>Your account</h3>{['Orders', 'Recommendations', 'Browsing History', 'Watchlist'].map((item) => <button key={item}>{item}</button>)}</div><div><h3>Your lists</h3>{['Shopping List', 'Create a List', 'Find a Gift'].map((item) => <button key={item}>{item}</button>)}</div><button className="signin" onClick={() => announce('Demo sign-in opened')}>Sign in</button></div>}
      {locationOpen && <div className="popover location-popover"><h3>Choose your location</h3><p>Delivery options and availability may vary by location.</p><label>US ZIP code<input defaultValue="78701" inputMode="numeric" /></label><button className="apply-location" onClick={() => { setLocationOpen(false); announce('Delivery location updated'); }}>Apply</button></div>}

      <main>
        <section className={`hero ${hero.tone}`} style={{ backgroundImage: `linear-gradient(90deg, rgba(0,0,0,.66) 0%, rgba(0,0,0,.18) 47%, rgba(0,0,0,0) 72%), url(${hero.image})` }}>
          <button className="hero-arrow previous" onClick={() => setHeroIndex((heroIndex - 1 + heroSlides.length) % heroSlides.length)} aria-label="Previous promotion">‹</button>
          <div className="hero-copy"><span>{hero.eyebrow}</span><h1>{hero.title}</h1><p>{hero.copy}</p><button onClick={() => chooseCategory(hero.category)}>Shop {hero.category.toLowerCase()} <Icon name="chevron" size={17} /></button></div>
          <button className="hero-arrow next" onClick={() => setHeroIndex((heroIndex + 1) % heroSlides.length)} aria-label="Next promotion">›</button>
          <div className="hero-dots">{heroSlides.map((slide, index) => <button key={slide.title} className={index === heroIndex ? 'active' : ''} onClick={() => setHeroIndex(index)} aria-label={`Show ${slide.title}`} />)}</div>
        </section>

        <div className="page-content">
          <section className="category-grid" aria-label="Featured categories">{categoryTiles.map((tile) => (
            <article className="category-tile" key={tile.category}><h2>{tile.title}</h2><button onClick={() => chooseCategory(tile.category)}><img src={tile.image} alt="" /><span>{tile.copy}</span></button><button className="text-link" onClick={() => chooseCategory(tile.category)}>Shop now</button></article>
          ))}</section>

          <section className="panel deal-panel"><div className="section-heading"><h2>Today’s Deals</h2><button onClick={() => { setCategory('All'); setQuery(''); setDraftQuery(''); }}>See all deals</button></div><div className="deal-row">{products.slice(0, 7).map((product) => <ProductCard compact key={product.id} product={product} onOpen={setSelected} onAdd={addToCart} />)}</div></section>

          <section className="feature-banner"><div><span>Prime member favorite</span><h2>Small upgrades. Better everyday.</h2><p>Fast, free delivery on millions of items—plus entertainment and more.</p><button onClick={() => announce('Prime preview opened')}>Explore Prime</button></div><img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1200&q=82" alt="A bright modern living room" /></section>

          <section className="panel results-panel" ref={resultsRef}>
            <div className="section-heading results-heading"><div><span>{query || category !== 'All' ? 'Search results' : 'Inspired by your shopping trends'}</span><h2>{query ? `Results for “${query}”` : category !== 'All' ? category : 'Popular right now'}</h2></div>{(query || category !== 'All') && <button onClick={() => { setQuery(''); setDraftQuery(''); setCategory('All'); }}>Clear filters</button>}</div>
            {visibleProducts.length ? <div className="product-grid">{visibleProducts.map((product) => <ProductCard key={product.id} product={product} onOpen={setSelected} onAdd={addToCart} />)}</div> : <div className="no-results"><Icon name="search" size={40} /><h3>No exact matches</h3><p>Try a broader phrase or browse all departments.</p><button className="add-button" onClick={() => { setQuery(''); setDraftQuery(''); setCategory('All'); }}>View all products</button></div>}
          </section>
        </div>
      </main>

      <footer><button className="back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Back to top</button><div className="footer-links"><div><h3>Get to Know Us</h3><a href="#top">About this copy</a><a href="#top">Careers</a><a href="#top">Sustainability</a></div><div><h3>Make Money with Us</h3><a href="#top">Sell products</a><a href="#top">Become an affiliate</a><a href="#top">Advertise products</a></div><div><h3>Amazon Payment Products</h3><a href="#top">Rewards cards</a><a href="#top">Shop with points</a><a href="#top">Reload balance</a></div><div><h3>Let Us Help You</h3><a href="#top">Your account</a><a href="#top">Your orders</a><a href="#top">Help</a></div></div><div className="footer-base"><Logo /><button>English</button><button>$ USD - U.S. Dollar</button><button>United States</button></div><p className="disclaimer">Interface study with fictional products. Not affiliated with or endorsed by Amazon.</p></footer>

      {selected && <ProductDialog product={selected} onClose={() => setSelected(null)} onAdd={addToCart} />}
      {cartOpen && <CartDrawer lines={cart} onClose={() => setCartOpen(false)} onQuantity={changeQuantity} onCheckout={checkout} />}
      {toast && <div key={toast.id} className="toast" role="status"><span>✓</span>{toast.message}</div>}
    </div>
  );
}

